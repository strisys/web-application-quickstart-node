import { getLogger } from '../../../shared/logging';
import { IdentityData } from '../identity';
export { IdentityData };

type StringOrNull = (string | null);

const profiles: Record<string, IdentityData> = {};
const idProps = ['sub'];
const loggerFn = getLogger('oidc-azure-ad');

export const fetch = (keyOrData: (string | Record<string, any>)): Promise<any> => {
  loggerFn(`attempting to fetch user profile (${JSON.stringify(keyOrData)}) ...`);

  if (typeof keyOrData === 'string') {
    return Promise.resolve(profiles[keyOrData] || null);
  }

  for (let prop of idProps) {
    if (prop in keyOrData) {
      return Promise.resolve((profiles[keyOrData[prop]] || null));
    }
  }

  return Promise.resolve(null);
};

export const store = (profileData: IdentityData, key: StringOrNull = null): Promise<any> => {
  loggerFn(`attempting to store user profile (${JSON.stringify(profileData.profile.email)}) ...`);

  if (!profileData) {
    return Promise.resolve(profileData);
  }

  if ((!key) && ('sub' in profileData)) {
    key = profileData.sub;
  }

  if (key) {
    return Promise.resolve(profiles[key] = profileData);
  }

  loggerFn(`failed to store user profile!  no 'sub' property found.`);
  return Promise.resolve(profileData);
};

export const remove = (keyOrData: (string | Record<string, any>)): Promise<void> => {
  if (typeof keyOrData === 'string') {
    loggerFn(`user identity removed from cache`);
    delete profiles[keyOrData];
    return;
  }

  for (let prop of idProps) {
    if (prop in keyOrData) {
      loggerFn(`user identity removed from cache`);
      delete profiles[keyOrData[prop]];
    }
  }

  return Promise.resolve();
};