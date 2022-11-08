import { getLogger } from './debug';
const logger = getLogger('reflection');

export function setProperty<T extends object, F extends keyof T, V extends T[F]>(target: T, key: F, value: V): V {
  logger(`dynamically setting value (property:=${key.toString()}, value:=${value})`);
  return (target[key] = value);
}

export function getProperty<T extends object, F extends keyof T, V extends T[F]>(target: T, key: F): V {
  return (target[key] as V);
}