import { Request } from 'express';
import { getLogger } from 'model-server';
import { IIdentityState } from 'model-server';

const logger = getLogger('pipeline:oidc:azure:identity');

declare global {
  namespace Express {
    interface Request {
      profile: IIdentityState;
      bearerToken: string
    }
  }
}

const tryExtractEmail = (user: any): string => {
  if (!user) {
    return '';
  }

  if (user.upn) {
    return user.upn;
  }

  if ((user._json) && (user._json.email)) {
    return user._json.email;
  }

  return '';
}

export const tryExtractIdentity = async (req: Request): Promise<IIdentityState> => {
  logger('attempting to parse identity from request ...');

  const user: any = req.user;
  const email = tryExtractEmail(user);

  if (!email) {
    return null;
  }

  const profile: IIdentityState = {
    id: user.oid,
    uuid: user.oid,
    email: email,
    displayName: user.displayName,
    settings: {}
  }

  logger(`app-specific user profile from request (user:=${JSON.stringify(profile)}`);
  return profile;
}