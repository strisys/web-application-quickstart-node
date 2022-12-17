import { Application, Request, Response, Handler } from 'express';
import passport from 'passport';
import { log, isAuthenticated, trySetBearerToken } from './shared';
import { configureCodeGrant } from './passport-oidc-flow';
import { configureBearer } from './passport-bearer';

type AuthType = ('codeGrant' | 'bearer');
type AuthHanders = (Record<AuthType, Handler> | null);

let authHandlers: AuthHanders = null;

const ensureAuthenticated = (req: Request, res: Response, next: any): void => {
  log(`ensuring authentication [url:=${req.url}, headers:=${JSON.stringify(Object.keys(req.headers))}}] ...`);

  if (isAuthenticated(req)) {
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

