import { Router } from 'express';
import { router as customerRouter } from './customer';

export const apiRouter = Router();

const getPath = (end: string) => {
  return `/api/v1/${end}`;
}

apiRouter.use(getPath(`customers`), customerRouter);