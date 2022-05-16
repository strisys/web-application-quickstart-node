import { expect } from 'chai';
import { SalesEntryQueryService, SalesEntryQueryResult } from '../../..';
import { KVStore, KV } from 'model-core';

KVStore.current('model-client').isTesting = true;

describe('SalesEntryQueryService', () => {
  describe('get', async function() {
    it('should return a query result for all sales', async () => {
      // Assemble/Act
      const entity: SalesEntryQueryResult = (await (new SalesEntryQueryService()).get());
      
      // Assert
      expect(entity).to.not.be.null;
      expect(entity.data.length).to.be.greaterThan(0);
    }).skip();

    it('should return a query result for a filtered set sales given a context', async () => {
      // Assemble/Act
      const query = { region: 'North America', city: 'New York' };
      const entity: SalesEntryQueryResult = (await (new SalesEntryQueryService()).get(query));
      
      console.log(entity.data.length);

      // Assert
      expect(entity).to.not.be.null;
      expect(entity.data.length).to.be.eq(33);
    }).skip();
  });
});