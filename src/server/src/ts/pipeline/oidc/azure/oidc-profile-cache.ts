import { getLogger } from '../../../shared/logging';

const profiles: Record<string, any> = {};
const idProps = ['oid'];
const loggerFn = getLogger('oidc-azure-ad');

export const fetch = (data: (string | { [key: string]: any })): Promise<any> => {
  loggerFn(`attempting to fetch user profile (${JSON.stringify(data)}) ...`);

  if (typeof data === 'string') {
    return Promise.resolve(profiles[data] || null);
  }

  for (let prop of idProps) {
    if (prop in data) {
      return Promise.resolve((profiles[data[prop]] || null));
    }
  }

  return Promise.resolve(null);
};

export const store = (profile: any): Promise<any> => {
  loggerFn(`attempting to store user profile (${JSON.stringify(profile.email)}) ...`);

  if (!profile) {
    return Promise.resolve(profile);
  }

  if (('oid' in profile)) {
    return Promise.resolve(profiles[profile.oid] = profile);
  }

  loggerFn(`failed to store user profile!  no oid property found.`);
  return Promise.resolve(profile);
};

export const remove = (data: any): Promise<void> => {
  if (typeof data === 'string') {
    loggerFn(`user profile removed from cache`);
    delete profiles[data];
    return;
  }

  for (let prop of idProps) {
    if (prop in data) {
      loggerFn(`user profile removed from cache`);
      delete profiles[data[prop]];
    }
  }

  return Promise.resolve();
};