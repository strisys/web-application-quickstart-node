import { Application, Request, Response, NextFunction } from 'express';
import { getLogger } from 'model-server';
import { map } from '../api/router-map';
import { configure } from './cors';

const logger = getLogger('router-map-service');

export const set = (app: Application): Application => {
  app.use((request: Request, res: Response, next: NextFunction) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
  });

  configure(app);
    
  const routes = Object.keys(map);
  logger(`configuring api routes: ${routes}`);

  routes.forEach((route) => {
    app.use(route, map[route]);
  })
  
  return app;
};