import msal from '@azure/msal-node';
import { Application, Handler, Request, Response, NextFunction, httpStatus } from './shared';
import { useAppServiceAuth, AppConfigKey, log, getConfigValues, isAuthenticated, fetch, store, remove, IdentityData } from './shared';

type ConfigurationSet = {
  secrets: Record<string, string>;
  msal: msal.Configuration;
}

declare module 'express-session' {
  interface SessionData {
    pkceCodes: {
      challengeMethod: string,
      verifier: string,
      challenge: string,
    },
    authCodeUrlRequest: msal.AuthorizationUrlRequest,
    authCodeRequest: Record<string, string> & {
      redirectUri: string,
      code: string,
    }
  }
}

// const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access', 'api://5c3f9ed1-652e-4684-b82d-3586ba549308/user_impersonation'];
const requiredScopes = ['User.Read', 'openid', 'email', 'profile', 'offline_access'];

async function getConfig(): Promise<ConfigurationSet> {
  const config: Record<string, any> = (await getConfigValues());

  const TENANT = config[AppConfigKey.AzureAdTenant];
  const APP_ID = config[AppConfigKey.AzureAdClientId];
  const APP_SECRET = config[AppConfigKey.AzureAdSecret];

  const msalConfig: msal.Configuration = {
    auth: {
      clientId: APP_ID,
      authority: `https://login.microsoftonline.com/${TENANT}`,
      clientSecret: APP_SECRET
    },
    system: {
      loggerOptions: {
        loggerCallback(loglevel: msal.LogLevel, message: string, containsPii: boolean) {
          console.log({ loglevel, message, containsPii });
        },
        piiLoggingEnabled: false,
        logLevel: msal.LogLevel.Info,
      }
    }
  }

  return {
    secrets: config,
    msal: msalConfig
  };
}

async function getConfidentialClientApplication(): Promise<msal.ConfidentialClientApplication> {
  const config = (await getConfig());
  return new msal.ConfidentialClientApplication(config.msal);
}

const cryptoProvider = new msal.CryptoProvider();

/**
 * https://learn.microsoft.com/en-us/azure/active-directory/develop/tutorial-v2-nodejs-webapp-msal
 * Prepares the auth code request parameters and initiates the first leg of auth code flow
 * @param req: Express request object
 * @param res: Express response object
 * @param next: Express next function
 * @param authCodeUrlRequestParams: parameters for requesting an auth code url
 * @param authCodeRequestParams: parameters for requesting tokens using auth code
 */
async function redirectToAuthCodeUrl(req: Request, res: Response, next: NextFunction, authCodeUrlRequestParams: any, authCodeRequestParams: any) {

  // Generate PKCE Codes before starting the authorization flow
  const { verifier, challenge } = await cryptoProvider.generatePkceCodes();
  const msalInstance = (await getConfidentialClientApplication());
  const config = (await getConfig());

  // Set generated PKCE codes and method as session vars
  req.session.pkceCodes = {
    challengeMethod: 'S256',
    verifier: verifier,
    challenge: challenge,
  };

  /**
   * By manipulating the request objects below before each request, we can obtain
   * auth artifacts with desired claims. For more information, visit:
   * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationurlrequest
   * https://azuread.github.io/microsoft-authentication-library-for-js/ref/modules/_azure_msal_node.html#authorizationcoderequest
   **/
  const redirectUri = config.secrets[AppConfigKey.AzureAdRedirectUri];

  req.session.authCodeUrlRequest = {
    redirectUri: redirectUri,
    responseMode: 'form_post', // recommended for confidential clients
    codeChallenge: req.session.pkceCodes.challenge,
    codeChallengeMethod: req.session.pkceCodes.challengeMethod,
    ...authCodeUrlRequestParams,
  };

  req.session.authCodeRequest = {
    redirectUri: redirectUri,
    code: "",
    ...authCodeRequestParams,
  };

  // Get url to sign user in and consent to scopes needed for application
  try {
    const authCodeUrlResponse = (await msalInstance.getAuthCodeUrl(req.session.authCodeUrlRequest));
    res.redirect(authCodeUrlResponse);
  } 
  catch (error) {
    next(error);
  }
};

export const configureCodeGrant = async (app: Application): Promise<Handler> => {
  return null;
};