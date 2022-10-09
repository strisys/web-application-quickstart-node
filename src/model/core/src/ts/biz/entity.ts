import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

export const KEY_LENGTH = 16;

// https://github.com/CyberAP/nanoid-dictionary
const generator = customAlphabet(alphanumeric, KEY_LENGTH);

export interface IIdentity<T extends string = string> {
  uuid: T;
}

export interface INullObject {
  isNull: boolean;
}

export type PeristentStoreSyncStatus = ('unknown' | 'new' | 'dirty' | 'sychronized')

export interface IPeristentStoreSync {
  syncStatus: PeristentStoreSyncStatus;
}

export const generateUuid = (): string => {
  return generator();
}

export interface IPersistedEntity extends IIdentity<string>, INullObject, IPeristentStoreSync {
}