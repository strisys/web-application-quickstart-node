import { Request } from 'express';
import { getLogger } from '../../../shared/logging';
import { IIdentityStateAuthenticated } from 'model-server';

const logger = getLogger('pipeline:oidc:azure:identity');

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

export const tryExtractIdentity = async (req: Request): Promise<IIdentityStateAuthenticated> => {
  logger('attempting to parse identity from request ...');

  const user: any = req.user;
  const email = tryExtractEmail(user);

  if (!email) {
    return null;
  }

  const profile: IIdentityStateAuthenticated = {
    id: user.oid,
    uuid: user.oid,
    email: email,
    displayName: user.displayName,
    settings: {},
    accessToken: req.accessToken
  }

  logger(`app-specific user profile from request (email:=${email}`);

  return profile;
}