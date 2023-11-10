import { expect, assert } from 'chai';
import { KVStore } from '../kv';
import { faker } from '@faker-js/faker'

export { expect, assert, KVStore, faker };

export const setup = () => {
  KVStore.current().isTesting = true;
}