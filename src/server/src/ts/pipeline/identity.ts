import { Application, Request, Response, NextFunction } from 'express';
import { IIdentityStateAuthenticated, getLogger } from 'model-server';
import { tryExtractIdentity } from './oidc/azure/identity';

export type IdentityProvider = ('azure-ad');
export type IdentityHandler = (req: Request) => Promise<IIdentityStateAuthenticated>;

const logger = getLogger('pipeline:oidc:identity');

declare global {
  namespace Express {
    interface Request {
      profile: IIdentityStateAuthenticated;
      accessToken: string
    }
  }
}


export const configure = (app: Application, idp: IdentityProvider): Application => {
  let handler: IdentityHandler = null;

  if (idp === 'azure-ad') {
    handler = tryExtractIdentity;
  }

  if (handler) {
    app.all('/*', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      req.profile = (await handler(req));
      next();
    });
  }

  return app;
};