import passport from 'passport';
import { OIDCStrategy, IOIDCStrategyOptionWithRequest } from 'passport-azure-ad';
import { Application, Handler, Request, Response, httpStatus } from './shared';
import { useAppServiceAuth, AppConfigKey, log, getConfigValues, isAuthenticated, fetch, store, remove, IdentityData } from './shared';

// https://github.com/AzureAD/passport-azure-ad/tree/dev
// const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access', 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/user_impersonation'];
const requiredScopes = 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/user_impersonation User.Read openid email profile offline_access';
// const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access'];

const findByOid = async (sub: any, fn: any): Promise<any> => {
  return fn(null, (await fetch(sub)));
};

passport.serializeUser((user: any, done: (err: any, id?: any) => void) => {
  done(null, user.sub);
});

passport.deserializeUser(async (oid: any, done: any) => {
  await findByOid(oid, (err: any, user: any) => {
    done(err, user);
  });
});

//const verifyFn = (req: any, profile: any, done: any) => {
const verifyFn = (req: any, iss: any, sub: any, profile: any, jwtClaims: any, access_token: any, refresh_token: any, params: any, done: any) => {
  const identityData: IdentityData = {
    sub,
    profile,
    claims: jwtClaims,
    authentication: {
      accessToken: (req['accessToken'] = access_token) as string,
      refreshToken: refresh_token,
      authorizationCode: req.body['code']
    }
  }

  if (!sub) {
    return done(new Error(`No subjct (sub) found.  The passport.js strategy configuration and/or scopes granted in Azure AD are invalid.  Check that the proper scopes [${requiredScopes}] have been specified and granted.`), null);
  }

  findByOid(sub, (err: any, user: any) => {
    if (err) {
      return done(err);
    }

    if (!user) {
      store(identityData);
      log(`The user profile has been cached successfully. [${profile.displayName}]`);
      return done(null, profile);
    }

    return done(null, user);
  });
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
  const APP_ID = config[AppConfigKey.AzureAdClientId];
  const APP_SECRET = config[AppConfigKey.AzureAdSecret];
  const REDIRECT_URL = config[AppConfigKey.AzureAdRedirectUri];
  const DESTROY_URL = config[AppConfigKey.AzureAdDestroySessionUri];
  const IDENTITY_META = config[AppConfigKey.AzureAdIdentityMetaDataUri];
  const ISSUER_URI = config[AppConfigKey.AzureAdIssuerUri];

  const getPassportConfig = (): any => {
    return {
      creds: {
        identityMetadata: IDENTITY_META,
        clientID: APP_ID,
        redirectUrl: REDIRECT_URL,
        clientSecret: APP_SECRET,
      },
      resourceURL: 'https://graph.windows.net',
      destroySessionUrl: DESTROY_URL
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
    issuer: ISSUER_URI,
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
      res.send(isAuthenticated(req));
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
      if (isAuthenticated(req)) {
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