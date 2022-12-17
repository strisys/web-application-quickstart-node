import { Application, Request, Handler } from 'express';
import { BearerStrategy, IBearerStrategyOptionWithRequest } from 'passport-azure-ad';
import passport from 'passport';
import { getConfigValues, AppConfigKey, tryGetBearerToken, log, IdentityData, store } from './shared';

export const configureBearer = async (app: Application): Promise<Handler> => {
  const config: Record<string, any> = (await getConfigValues());
  const TENANT = config[AppConfigKey.AzureAdTenant];
  const APP_ID = config[AppConfigKey.AzureAdClientId];
  const AUDIENCE = config[AppConfigKey.AzureAdClientId];

  // https://github.com/AzureAD/passport-azure-ad#42-bearerstrategy
  const options: IBearerStrategyOptionWithRequest = {
    identityMetadata: `https://login.microsoftonline.com/${TENANT}/v2.0/.well-known/openid-configuration`,
    clientID: APP_ID,
    allowMultiAudiencesInToken: false,
    audience: AUDIENCE,
    passReqToCallback: true,
    validateIssuer: false,
    issuer: `https://sts.windows.net/${TENANT}/`,
    isB2C: false,
    loggingLevel: 'warn',
    loggingNoPII: false,
    clockSkew: 300
  };

  const strategy: passport.Strategy = new BearerStrategy(options, async (request: Request, user: any, done) => {
    const identityData: IdentityData = {
      sub: user.sub,
      profile: user,
      claims: user,
      authentication: {
        accessToken: tryGetBearerToken(request),
        refreshToken: '',
        authorizationCode: ''
      }
    }

    await store(identityData);
    done(null, identityData);
  });

  passport.use(strategy);
  log(`passport.js Bearer strategy configured (config:=${JSON.stringify(Object.keys(options))})`);

  // Use this for debugging
  // return passport.authenticate('oauth-bearer', { session: false }, (a: any, info: any, error: any) => {
  //   if (error) {
  //     log(`Failed to validate bearer token (error:=${error})`);
  //   }
  // });

  const exec: Handler = passport.authenticate('oauth-bearer', { session: false });

  // const authenticate = (): Handler => {
  //   return (req: Request, res: Response, next: NextFunction) => {
  //     log(`executing bearer token authentication ...`);
  //     exec(req, res, next);
  //   }
  // };

  return exec;
}