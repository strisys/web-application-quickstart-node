import { router as taskRouter } from './v1.0/task';

const CURRENT_VERSION = '1.0';

const getUrlPath = (endpoint: string, version: string = CURRENT_VERSION) => {
  return `/api/v${version}/${endpoint}`;
}

// Pair paths to routers
export const map = {
  [getUrlPath('tasks')]: taskRouter,
}