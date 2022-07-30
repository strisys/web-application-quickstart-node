import { Application, Request, Response, NextFunction } from 'express';
import { getLogger } from 'model-server';
import { IIdentityState } from 'model-server';

export type IdentityProviderType = ('azure-ad');
const logger = getLogger('identity-middleware');

declare global {
  namespace Express {
    interface Request {
      identity: IIdentityState;
    }
  }
}

const tryExtractAzure = async (req: Request): Promise<IIdentityState> => {
  // user set elsewhere in authentication middleware
  const user: any = req.user;

  if (!user) {
    return null;
  }

  const email = user._json.email;

  const identity: IIdentityState = {
    id: user.oid,
    email: email,
    displayName: user.displayName,
    settings: {}
  }

  logger(`identity of request caller extracted (identity:=${JSON.stringify(identity)}`);
  return identity;
}

const extractMap = {
  "azure-ad": tryExtractAzure
}

const trySetUser = (type: IdentityProviderType): any => {
  const extractFn = extractMap[type];

  if (!extractFn){
    logger(`Failed to determine identity extract function from provided type [${type}]`);
  }

  const fn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    req.identity = (await extractFn(req));
    next();
  }

  return fn;
};

export const configure = (type: IdentityProviderType, app: Application): Application => {
  app.all('/*', trySetUser(type));
  return app;
};