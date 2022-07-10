
import { Application, Request, Response } from 'express';
import { getLogger } from 'model-server';

const logger = getLogger('debug');

export const configure = (app: Application): Application => {
  app.get('/headers', (request: Request, res: Response) => {
    res.jsonp(request.headers);
  });

  return app;
};