import { expect } from 'chai';
import { KVStore } from '../kv';

describe('KVStore', () => {
  describe('getCurrent', function() {
    it('should contain the expected state', async () => {
      // Assemble/Act
      const ctx = 'kv-context-test';
      const store = KVStore.current(ctx);
            
      // Assert
      expect(store).to.not.be.null;
      expect(store).to.not.be.undefined;
      expect(store.context).to.be.equal(ctx);
    });

    it('can store values and fetch them back', async () => {
      // Assemble/Act
      const context = 'kv-context-test';
      const key = 'my-value';
      const value = 'whatever';
      const isFrozen = false;
      const meta = { 'test': 'hello'};

      const store = KVStore.current(context);
      store.set(key, value, isFrozen, meta);
            
      // Assert
      const entry = store.get(key);
      expect(entry).to.not.be.null;
      expect(entry.value).to.be.equal(value);
      expect(entry.isFrozen).to.be.equal(isFrozen);
      expect(entry.metaData).to.be.deep.equal(meta);
      expect(entry.metaData).to.not.be.equal(meta);
    });
  });
});