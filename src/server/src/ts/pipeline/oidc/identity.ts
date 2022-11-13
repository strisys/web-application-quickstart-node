import { Request } from 'express';
import { getLogger } from '../../shared/logging';

const logger = getLogger('pipeline:oidc:identity');

export type IdentityData = {
  sub: string,
  profile: Record<string, string>
  claims: Record<string, string>,
  authentication: {
    accessToken: string,
    refreshToken: string,
    authorizationCode: string,
  }
};

export type IdentityDataOrNull = (IdentityData | null);

declare global {
  namespace Express {
    interface Request {
      profile: IdentityData;
      accessToken: string;
    }
  }
}

export const tryExtractIdentity = async (req: Request): Promise<IdentityDataOrNull> => {
  logger('attempting to get identity from request ...');

  if (!req.user) {
    return null;
  }

  const identityData = (req.user as IdentityData);
  logger(`app-specific identity from request (email:=${identityData.profile.email}`);
  return identityData;
}