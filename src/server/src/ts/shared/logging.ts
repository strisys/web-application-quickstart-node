import { getLogger as logger } from 'model-server';
type LogFn = (value: any) => void;

export const getLogger = (namespace: string): LogFn => {
  return logger(namespace)
}