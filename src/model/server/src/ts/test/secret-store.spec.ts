import { expect } from 'chai';
import { SecretStoreFactory, KVStore } from '../';
import { getLogger } from './util';

const logger = getLogger(module);

KVStore.current('model-server').isTesting = true;
const timeout = 15000;

xdescribe('SecretStore', () => {
  const store = SecretStoreFactory.get('azure-key-vault', 'kv-waqs-dev');

  describe('get', function () {
    this.timeout(timeout);

    it('should fetch a valid value', async () => {
      // Assemble/Act
      const value: any = (await store.get('NODE-ENV'));

      // Assert
      expect(value).to.be.length.greaterThan(0);
    });
  });

  describe('getMany', function () {
    this.timeout(timeout);

    it('should fetch a valid value', async () => {
      // Assemble/Act
      const value: any = (await store.getMany(['NODE-ENV']));

      // Assert
      expect(value['NODE-ENV']).to.be.length.greaterThan(0);
    });
  });
});