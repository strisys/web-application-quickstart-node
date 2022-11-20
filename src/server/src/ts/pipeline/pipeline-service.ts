/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Application } from 'express';
import http from 'http';
import bodyParser from 'express';
import session from 'express-session';
import flash from 'express-flash';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { getLogger } from 'model-server';
import { staticfile, publicPath, configureHealth, reroute, setApiRoutes, handleError, configureOidc, configureDebug, configureIdentity } from './';

const namespace = 'pipeline-service';
const logger = getLogger(namespace);
const morganFormat = `  ${namespace} :method :url :status :res[content-length] - :response-time ms`;

const SESSION_SECRET = `<replce-men-with-a-session-secret>`;

export class PipelineService {
  public static readonly defaultPort = 3000;
  private _port: number = 0;
  private _app: Application = null;
  private _server: http.Server = null;

  public constructor(port = PipelineService.defaultPort) {
    this._app = express();
    this._port = ((port > 0) ? port : PipelineService.defaultPort);
  }

  public get app(): Application {
    return this._app;
  }

  public get port(): number {
    return (this._port || PipelineService.defaultPort);
  }

  public get isStarted(): boolean {
    return Boolean(this._server);
  }

  protected async configureMiddleware(): Promise<PipelineService> {
    const app = this.app;

    logger(`configuring pipeline ...`);

    try {
      app.use(morgan(morganFormat));
      configureDebug(app);
      app.use(bodyParser.text({ limit: '999mb' }));
      app.use(bodyParser.json({ limit: '999mb' }));
      app.use(bodyParser.urlencoded({ limit: '999mb', extended: false, parameterLimit: 100000, }));
      app.use(cookieParser());
      app.use(session({ resave: true, saveUninitialized: true, secret: SESSION_SECRET }));
      app.use(flash());
      configureHealth(app);
      await configureOidc(app);
      configureIdentity(app, 'azure-ad');
      setApiRoutes(app);
      app.use(staticfile);
      app.all('*', reroute(publicPath));
      app.use(handleError);
      app.disable(`x-powered-by`);
    }
    catch (error) {
      logger(`failed to configure HTTP pipeline (error:=${error})`);
      throw error;
    }

    logger(`pipeline configured successfully!`);

    return this;
  }

  public async start(): Promise<PipelineService> {
    if (this.isStarted) {
      throw new Error(`The pipeline service has already been started.`);
    }

    const app = (await this.configureMiddleware()).app;
    logger(`HTTP pipeline configured`);

    this._server = http.createServer(app).listen(this.port, `0.0.0.0`, () => {
      logger(`HTTP server listening @ :${this.port}`);
    });

    return this;
  }
}