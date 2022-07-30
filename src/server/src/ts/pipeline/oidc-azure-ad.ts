/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passportazure, { IOIDCStrategyOptionWithRequest } from 'passport-azure-ad';
import passport from 'passport';
import { Application, Request, Response } from 'express';
import { SecretStoreFactory, getLogger } from 'model-server';

enum AppConfigKey {
  NodeEnv = 'NODE_ENV',
  AzureAdTenant = 'AZURE-AD-TENANT',
  AzureAdClientId = 'AZURE-AD-APP-ID',
  AzureAdSecret = 'AZURE-AD-APP-SECRET',
  HostUrl = 'AZURE_AD_OAUTH_HOST_URL',
  HostPort  = 'AZURE_AD_OAUTH_HOST_PORT',
  FrontEndUrl = 'AZURE_AD_OAUTH_URL_FRONTEND',
  SessionSecret = 'SESSION-SECRET',
}

const loggerFn = getLogger('oidc-azure-ad');
const OIDCStrategy = passportazure.OIDCStrategy;
const userProfiles: any[] = [];

// https://github.com/AzureAD/passport-azure-ad/tree/dev
const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access'];

const getConfig = async (): Promise<{ [key: string] : any }> => {
  const keys = [AppConfigKey.AzureAdTenant, AppConfigKey.AzureAdClientId, AppConfigKey.AzureAdSecret, AppConfigKey.HostUrl, AppConfigKey.HostPort, AppConfigKey.FrontEndUrl];
  return (await (SecretStoreFactory.get('azure-key-vault').getMany(keys)));
}

const findByOid = (oid: any, fn: any) => {
  const user = (userProfiles.find((u) => {
    return (u.oid === oid);
  }) || null);

  return fn(null, user);
};

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.oid);
});

passport.deserializeUser((oid: any, done: any) => {
  findByOid(oid, (err: any, user: any) => {
    done(err, user);
  });
});

const verifyFn = (req: any, profile: any, done: any) => {
  const oid = (profile && profile.oid);

  if (!oid) {
    return done(new Error(`No object id found.  The passport.js strategy configuration and/or scopes granted in Azure AD are invalid.  Check that the proper scopes [${requiredScopes}] have been specified and granted.`), null);
  }

  findByOid(oid, (err: any, user: any) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      userProfiles.push(profile);
      loggerFn(`The user profile has been cached successfully. [${profile.displayName}]`);
      return done(null, profile);
    }

    return done(null, user);
  });
}

const ensureAuthenticated = (req: Request, res: Response, next: any): void => {
  if (req.isAuthenticated()) { 
    loggerFn(`request to ${req.url} is authenticated`);
    return next(); 
  }

  res.redirect('/login'); 
};

export const configure = async (app: Application): Promise<Application> => {
  const config: { [key: string] : any } = (await getConfig());

  const HOST_URL = config[AppConfigKey.HostUrl];
  const PORT = config[AppConfigKey.HostPort];
  const HOST_PORT = `${HOST_URL}:${PORT}`;
  const URL_FRONTEND = (config[AppConfigKey.FrontEndUrl] || HOST_PORT);

  const getPassportConfig = (): any => {
    const TENANT = config[AppConfigKey.AzureAdTenant];
    const APP_ID = config[AppConfigKey.AzureAdClientId];
    const APP_SECRET = config[AppConfigKey.AzureAdSecret];
       
    const redirectUrl = ((PORT === '80') ? `${HOST_URL}/signin` : `${HOST_URL}:${PORT}/signin`);
    const destroySessionUrl = ((PORT === '80') ? `${HOST_URL}` : `${HOST_URL}:${PORT}`);

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
    // responseType: 'code id_token',
    responseType: 'id_token',
    responseMode: 'form_post',
    redirectUrl: passconfig.creds.redirectUrl,
    allowHttpForRedirectUrl: true,
    clientSecret: passconfig.creds.clientSecret,
    validateIssuer: false,
    isB2C: false,
    issuer: '',
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
  app.use(passport.initialize());
  app.use(passport.session());
  loggerFn(`passport.js configured ==> ${JSON.stringify(cfg)}`);

  app.use((req: Request, res: Response, next: any) => {
    res.locals.user = req.user;
    next();
  });

  app.get('/islogin', (req, res, next) => {
    res.send(req.isAuthenticated());
    next();
  });
  
  app.all('/fail', (req: Request, res: Response) => {
    loggerFn(`OIDC failure`);
    res.status(500);
    res.end('OAuth authentication failed');
  });

  const authFn = passport.authenticate('azuread-openidconnect', { failureRedirect: '/fail', });

  app.get('/login', (req: Request, res: Response, next: any) => {
    loggerFn(`attempt to redirect request to ${req.url} is redirected to IdP`);
    authFn(req, res, next);
  });

  app.post('/signin', (req: Request, res: Response, next: any) => {
    loggerFn(`attempt to redeem authentication code [url:=${req.url}]`);
    authFn(req, res, next);
  }, (req: Request, res: Response, next: any) => {
    loggerFn(`azure data received successfully`);
    res.redirect(URL_FRONTEND)
  });

  app.get('/logout', (req: Request, res: Response, next: any) => {
    if (!req.isAuthenticated()) { 
      next();
      return;
    }

    loggerFn(`logging user out ...`);

    const index = userProfiles.findIndex((p: any) => {
      return (p.oid === (req.user as any)['oid']);
    });

    if (index >= 0) {
      userProfiles.splice(index);
      loggerFn(`profile removed from cache`);
    }

    req['session'].destroy((err: any) => {
      const doneLogout = (err: any): void => {
        loggerFn(`logout complete (err:=${err})`);
      }

      req.logOut({
        keepSessionInfo: false
      }, doneLogout);

      res.redirect(passconfig.destroySessionUrl);
    });
  });

  app.all('/', ensureAuthenticated);

  return app;
};