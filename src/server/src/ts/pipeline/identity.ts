import { Application, Request, Response, NextFunction } from 'express';
import { getLogger } from '../shared/logging';
import { tryExtractIdentity, IdentityData } from './oidc/identity';

export type IdentityProvider = ('azure-ad');
export type IdentityHandler = (req: Request) => Promise<IdentityData>;

const logger = getLogger('pipeline:oidc:identity');

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