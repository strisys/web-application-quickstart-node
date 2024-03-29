export { staticfile, publicPath } from './static-file';
export { log } from './request-logger';
export { reroute } from './spa-reroute';
export { configure as configureCors } from './cors';
export { configure as configureOidc } from './oidc/azure/auth-flow';
export { configure as configureHealth } from './health';
export { set as setApiRoutes } from './router-map-service';
export { handleError } from './unhandled-error';
export { configure as configureDebug } from './debug';
export { configure as configureIdentity } from './identity';