import { Application, Request, Response } from 'express';
import { getLogger } from 'model-server';

const logger = getLogger('cors');

export const configure = (app: Application): Application => {
  app.options("/*", (request: Request, res: Response) => {
    logger(`Setting CORS headers`);

    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH,HEAD');
    // res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Content-Length,X-Requested-With');
    // res.send(200);
  });

  return app;
}