/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Application, Request, Response, Handler, RequestHandler, NextFunction } from 'express';
import { OIDCStrategy, IOIDCStrategyOptionWithRequest, BearerStrategy, IBearerStrategyOptionWithRequest } from 'passport-azure-ad';
import passport from 'passport';
import httpStatus from 'http-status-codes';
import { SecretStoreFactory } from 'model-server';
import process from 'process';
import { fetch, store, remove } from './oidc-profile-cache';
import { getLogger } from '../../../shared/logging';

type AuthType = ('codeGrant' | 'bearer');
type AuthHanders = (Record<AuthType, Handler> | null);

let authHandlers: AuthHanders = null;

enum AppConfigKey {
  NodeEnv = 'NODE_ENV',
  AzureAdTenant = 'AZURE-AD-TENANT',
  AzureAdClientId = 'AZURE-AD-APP-ID',
  AzureAdSecret = 'AZURE-AD-APP-SECRET',
  HostUrl = 'AZURE_AD_OAUTH_HOST_URL',
  HostPort = 'AZURE_AD_OAUTH_HOST_PORT',
  FrontEndUrl = 'AZURE_AD_OAUTH_URL_FRONTEND',
  SessionSecret = 'SESSION-SECRET',
  UseAppServiceAuth = 'AZURE-AD-USE-APP-SERVICE-AUTH',
  ApiAudience = 'AZURE-AD-REST-API-AUDIENCE',
}

const log = getLogger('oidc-azure-ad');

const isInAzure = (): boolean => {
  return Boolean(process.env['WEBSITE_INSTANCE_ID']);
}

const useAppServiceAuth = async (): Promise<boolean> => {
  if (!isInAzure()) {
    return false;
  }

  const config: { [key: string]: any } = (await getConfigValues());
  const value = ((config[AppConfigKey.UseAppServiceAuth] || '') as string).toLowerCase();
  return ((value === 'true') || (value === '1'));
}

// https://github.com/AzureAD/passport-azure-ad/tree/dev
const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access'];

const getConfigValues = async (): Promise<Record<string, any>> => {
  const keys = [AppConfigKey.AzureAdTenant, AppConfigKey.AzureAdClientId, AppConfigKey.AzureAdSecret, AppConfigKey.HostUrl, AppConfigKey.HostPort, AppConfigKey.FrontEndUrl, AppConfigKey.UseAppServiceAuth, AppConfigKey.ApiAudience];
  return (await (SecretStoreFactory.get('azure-key-vault').getMany(keys)));
}

const findByOid = async (oid: any, fn: any): Promise<any> => {
  return fn(null, (await fetch(oid)));
};

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.oid);
});

passport.deserializeUser(async (oid: any, done: any) => {
  await findByOid(oid, (err: any, user: any) => {
    done(err, user);
  });
});

//const verifyFn = (req: any, profile: any, done: any) => {
const verifyFn = (req: any, iss: any, sub: any, profile: any, jwtClaims: any, access_token: any, refresh_token: any, params: any, done: any) => {
  const oid = (profile && profile.oid);

  if (!oid) {
    return done(new Error(`No object id found.  The passport.js strategy configuration and/or scopes granted in Azure AD are invalid.  Check that the proper scopes [${requiredScopes}] have been specified and granted.`), null);
  }

  findByOid(oid, (err: any, user: any) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      profile.accessToken = req['accessToken'] = access_token;
      store(profile);
      log(`The user profile has been cached successfully. [${profile.displayName}]`);
      return done(null, profile);
    }

    return done(null, user);
  });
}

const tryGetBearerToken = (request: Request): string => {
  const authorizationValue = request.headers['authorization'];

  if (!authorizationValue) {
    return '';
  }

  const parts = authorizationValue.split(' ');

  if ((parts.length != 2) || (parts[0] !== 'Bearer')) {
    return '';
  }

  return (parts[1] || '');
}

const trySetBearerToken = (request: Request): boolean => {
  return Boolean((request['accessToken'] = tryGetBearerToken(request)));
}

const isAuthenticted = (req: Request): boolean => {
  return (Boolean(req.user) || (req.isAuthenticated && req.isAuthenticated()));
}

const ensureAuthenticated = (req: Request, res: Response, next: any): void => {
  log(`ensuring authentication [url:=${req.url}, headers:=${JSON.stringify(Object.keys(req.headers))}}] ...`);

  if (isAuthenticted(req)) {
    log(`request to ${req.url} is authenticated`);
    return next();
  }

  if (trySetBearerToken(req)) {
    log(`bearer token detected.`);
    authHandlers['bearer'](req, res, next);
    return;
  }

  res.redirect('/login');
};

export const configure = async (app: Application, path = '/*'): Promise<Application> => {
  app.use(passport.initialize());
  app.use(passport.session());

  authHandlers = {
    codeGrant: (await configureCodeGrant(app)),
    bearer: (await configureBearer(app))
  };

  app.all(path, ensureAuthenticated);
  return app;
}

export const configureBearer = async (app: Application): Promise<Handler> => {
  const config: Record<string, any> = (await getConfigValues());
  const TENANT = config[AppConfigKey.AzureAdTenant];
  const APP_ID = config[AppConfigKey.AzureAdClientId];
  const AUDIENCE = config[AppConfigKey.AzureAdClientId];

  // https://github.com/AzureAD/passport-azure-ad#42-bearerstrategy
  const options: IBearerStrategyOptionWithRequest = {
    identityMetadata: `https://login.microsoftonline.com/${TENANT}/v2.0/.well-known/openid-configuration`,
    clientID: APP_ID,
    allowMultiAudiencesInToken: false,
    audience: AUDIENCE,
    passReqToCallback: true,
    validateIssuer: false,
    issuer: `https://sts.windows.net/${TENANT}/`,
    isB2C: false,
    loggingLevel: 'info',
    loggingNoPII: false,
    clockSkew: 300
  };

  const strategy: passport.Strategy = new BearerStrategy(options, async (request: Request, user: any, done) => {
    if (user) {
      user.accessToken = tryGetBearerToken(request);
      await store(user);
    }

    done(null, user);
  });

  passport.use(strategy);
  log(`passport.js Bearer strategy configured (config:=${JSON.stringify(Object.keys(options))})`);

  // Use this for debugging
  // return passport.authenticate('oauth-bearer', { session: false }, (a: any, info: any, error: any) => {
  //   if (error) {
  //     log(`Failed to validate bearer token (error:=${error})`);
  //   }
  // });

  const exec: Handler = passport.authenticate('oauth-bearer', { session: false });

  // const authenticate = (): Handler => {
  //   return (req: Request, res: Response, next: NextFunction) => {
  //     log(`executing bearer token authentication ...`);
  //     exec(req, res, next);
  //   }
  // };

  return exec;
}

export const configureCodeGrant = async (app: Application): Promise<Handler> => {
  if (await useAppServiceAuth()) {
    log(`bypassed usage of authentication using middleware in application.`);
    return;
  }

  log(`bypassed usage of authentication servers in Azure in favor of middleware in application.`);
  const config: Record<string, any> = (await getConfigValues());
  const HOST_URL = config[AppConfigKey.HostUrl];
  const PORT = config[AppConfigKey.HostPort];
  const HOST_PORT = `${HOST_URL}:${PORT}`;
  const URL_FRONTEND = (config[AppConfigKey.FrontEndUrl] || HOST_PORT);
  const TENANT = config[AppConfigKey.AzureAdTenant];

  const getPassportConfig = (): any => {
    const APP_ID = config[AppConfigKey.AzureAdClientId];
    const APP_SECRET = config[AppConfigKey.AzureAdSecret];

    const isDefaultPort = ((!PORT) || (PORT === '80') || (PORT === 80) || (PORT === '0') || (PORT === 0));
    const redirectUrl = ((isDefaultPort) ? `${HOST_URL}/signin` : `${HOST_URL}:${PORT}/signin`);
    const destroySessionUrl = ((isDefaultPort) ? `${HOST_URL}` : `${HOST_URL}:${PORT}`);

    return {
      creds: {
        identityMetadata: `https://login.microsoftonline.com/${TENANT}/v2.0/.well-known/openid-configuration`,
        clientID: APP_ID,
        redirectUrl: redirectUrl,
        clientSecret: APP_SECRET,
      },
      resourceURL: 'https://graph.windows.net',
      destroySessionUrl: destroySessionUrl
    };
  };

  const passconfig = getPassportConfig();

  // https://github.com/AzureAD/passport-azure-ad#4112-options
  const cfg: IOIDCStrategyOptionWithRequest = {
    identityMetadata: passconfig.creds.identityMetadata,
    clientID: passconfig.creds.clientID,
    clientSecret: passconfig.creds.clientSecret,
    responseType: 'code id_token',
    responseMode: 'form_post',
    redirectUrl: passconfig.creds.redirectUrl,
    allowHttpForRedirectUrl: true,
    isB2C: false,
    validateIssuer: true,
    issuer: `https://login.microsoftonline.com/${TENANT}/v2.0`,
    passReqToCallback: true,
    scope: requiredScopes,
    loggingLevel: 'info',
    loggingNoPII: true,
    nonceLifetime: 3600,
    nonceMaxAmount: 10,
    useCookieInsteadOfSession: false,
    cookieSameSite: true,
    cookieEncryptionKeys: [
      { 'key': '12345678901234567890123456789012', 'iv': '123456789012' },
      { 'key': 'abcdefghijklmnopqrstuvwxyzabcdef', 'iv': 'abcdefghijkl' }
    ],
    clockSkew: 300,
  }

  passport.use(new OIDCStrategy(cfg, verifyFn));

  const reducedConfig: Omit<IOIDCStrategyOptionWithRequest, ('clientSecret' | 'clientID')> = cfg;
  log(`passport.js OIDC strategy configured (config:=${JSON.stringify(Object.keys(reducedConfig))})`);

  const configurePaths = (): Handler => {
    app.use((req: Request, res: Response, next: any) => {
      res.locals.user = req.user;
      next();
    });

    app.get('/isloggedin', (req, res, next) => {
      res.send(isAuthenticted(req));
      next();
    });

    app.all('/fail', (req: Request, res: Response) => {
      log(`OIDC failure`);
      const error = req.flash('error');
      res.status(500).end(`OAuth authentication failed (message:=${JSON.stringify(error)})`);
    });

    const authFn: Handler = passport.authenticate('azuread-openidconnect', { failureRedirect: '/fail', failureFlash: true });

    app.get('/login', (req: Request, res: Response, next: any) => {
      log(`attempt to login to ${req.url}.  user may be redirected to IdP`);
      authFn(req, res, next);
    });

    const redeemCode = (req: Request, res: Response, next: any) => {
      log(`attempt to redeem authentication code [url:=${req.url}]`);
      authFn(req, res, next);
    };

    app.post('/signin', redeemCode, (req: Request, res: Response, next: any) => {
      log(`azure data received successfully`);
      res.redirect(URL_FRONTEND)
    });

    app.get('/user', (req: Request, res: Response, next: any) => {
      log(`attempt get user information [user:=${JSON.stringify(req.user)}]`);
      const user: any = req.user;
      delete user.accessToken;

      if (!user) {
        res.status(httpStatus.NOT_FOUND).send({});
        return;
      }

      res.status(httpStatus.OK).jsonp(user)
    });

    app.get('/signout', (req: Request, res: Response, next: any) => {
      log(`------------------------------------------------------------------------------------------------------------------------`);
      log(`signout invoked by idp (GET) (headers:=${JSON.stringify(req.headers)}, body:=${JSON.stringify(req.body)}`);
      log(`------------------------------------------------------------------------------------------------------------------------`);
      res.status(httpStatus.OK).jsonp({});
    });

    app.get('/logout', async (req: Request, res: Response, next: any) => {
      if (isAuthenticted(req)) {
        await remove(req.user);

        log(`------------------------------------------------`);
        log(`destroying session for user (email:=${req!.user!.toString()})`);
        log(`------------------------------------------------`);

        req['session'].destroy((err: any) => {
          if (err) {
            log(`failed to destroy session for user (err:=${err})`);
          }

          const doneLogout = (err: any): void => {
            log(`logout complete (err:=${err})`);
          }

          req.logOut && req.logOut({
            keepSessionInfo: false
          }, doneLogout);
        });
      }

      res.redirect(`https://login.microsoftonline.com/${TENANT}/oauth2/logout`);
    });

    return authFn;
  }

  return configurePaths();
};