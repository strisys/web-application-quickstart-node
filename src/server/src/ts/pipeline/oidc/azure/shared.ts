import { Application, Request, Response, Handler, NextFunction } from 'express';
import { getLogger } from '../../../shared/logging';
import { SecretStoreFactory } from 'model-server';

export { Application, Request, Response, Handler, NextFunction };;
export { fetch, store, remove, IdentityData } from './oidc-store';
export const log = getLogger('azure-ad-authentication');
export * as httpStatus from 'http-status-codes';

let configValues: Record<string, any>;

export enum AppConfigKey {
  NodeEnv = 'NODE_ENV',
  AzureAdTenant = 'AZURE-AD-TENANT',
  AzureAdClientId = 'AZURE-AD-APP-ID',
  AzureAdSecret = 'AZURE-AD-APP-SECRET',
  AzureAdRedirectUri = 'AZURE-AD-REDIRECT-URI',
  AzureAdDestroySessionUri = 'AZURE-AD-DESTROY-SESSION-URI',
  AzureAdIdentityMetaDataUri = 'AZURE-AD-IDENTITY-META-URI',
  AzureAdIssuerUri = 'AZURE-AD-ISSUER-URI',
  HostUrl = 'AZURE_AD_OAUTH_HOST_URL',
  HostPort = 'AZURE_AD_OAUTH_HOST_PORT',
  FrontEndUrl = 'AZURE_AD_OAUTH_URL_FRONTEND',
  SessionSecret = 'SESSION-SECRET',
  UseAppServiceAuth = 'AZURE-AD-USE-APP-SERVICE-AUTH',
  ApiAudience = 'AZURE-AD-REST-API-AUDIENCE',
}

const keys = [AppConfigKey.AzureAdTenant, AppConfigKey.AzureAdClientId, AppConfigKey.AzureAdSecret, AppConfigKey.HostUrl, AppConfigKey.HostPort, AppConfigKey.FrontEndUrl, AppConfigKey.UseAppServiceAuth, AppConfigKey.ApiAudience];

const isInAzure = (): boolean => {
  return Boolean(process.env['WEBSITE_INSTANCE_ID']);
}

export const useAppServiceAuth = async (): Promise<boolean> => {
  if (!isInAzure()) {
    return false;
  }

  const config: { [key: string]: any } = (await getConfigValues());
  const value = ((config[AppConfigKey.UseAppServiceAuth] || '') as string).toLowerCase();
  return ((value === 'true') || (value === '1'));
}

export const getConfigValues = async (): Promise<Record<string, any>> => {
  if (configValues) {
    return configValues;
  }

  log(`'fetching azure-ad authentication parameters ...`);
  configValues = (await (SecretStoreFactory.get('azure-key-vault').getMany(keys)));

  const tenant = configValues[AppConfigKey.AzureAdTenant];
  const hostUrl = configValues[AppConfigKey.HostUrl];
  const port = configValues[AppConfigKey.HostPort];
  const isDefaultPort = ((!port) || (port === '80') || (port === 80) || (port === '0') || (port === 0));

  configValues[AppConfigKey.AzureAdRedirectUri] = ((isDefaultPort) ? `${hostUrl}/signin` : `${hostUrl}:${port}/signin`);
  configValues[AppConfigKey.AzureAdDestroySessionUri] = ((isDefaultPort) ? `${hostUrl}` : `${hostUrl}:${port}`);
  configValues[AppConfigKey.AzureAdIdentityMetaDataUri] = `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`;
  configValues[AppConfigKey.AzureAdIssuerUri] = `https://login.microsoftonline.com/${tenant}/v2.0`

  return configValues;
}

export const isAuthenticated = (req: Request): boolean => {
  return (Boolean(req.user) || (req.isAuthenticated && req.isAuthenticated()));
}

export const tryGetBearerToken = (request: Request): string => {
  const authorizationValue = request.headers['authorization'];

  if (!authorizationValue) {
    return '';
  }

  const parts = authorizationValue.split(' ');

  if ((parts.length != 2) || (parts[0] !== 'Bearer')) {
    return '';
  }

  return (parts[1] || '');
}

export const trySetBearerToken = (request: Request): boolean => {
  return Boolean((request['accessToken'] = tryGetBearerToken(request)));
}