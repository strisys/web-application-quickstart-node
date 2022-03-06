import express from 'express';
import { getLogger } from 'model-server';

const loggerFn = getLogger('request-logger');

export const log = (): express.RequestHandler => {
  return (req, res, next) => {
    loggerFn(`request received: ${req.method} - ${req.path}`);
    next();
  }
}
