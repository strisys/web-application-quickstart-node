import express from 'express';
import { getLogger } from 'model-server';
import httpStatus from 'http-status-codes';

const loggerFn = getLogger('unhandled-error');

export const handleError = (): express.ErrorRequestHandler => {
  return (error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    loggerFn(`failed to process request to path ${req.path}.\n\n${error.stack}`);
  
    res.status(httpStatus.INTERNAL_SERVER_ERROR);
    res.send(`${httpStatus.INTERNAL_SERVER_ERROR} | Sorry, our application is experiencing a problem!`);
  }
}