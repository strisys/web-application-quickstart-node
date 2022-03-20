import { expect } from 'chai';
import { SalesEntryQueryService, SalesEntryQueryResult } from '../../..';

describe('SalesEntryQueryService', () => {
  describe('get', async function() {
    it('should return a query result', async () => {
      // Assemble/Arrange
      const entity: SalesEntryQueryResult = (await (new SalesEntryQueryService()).get());
      
      // Assert
      expect(entity).to.not.be.null;
      expect(entity.data.length).to.be.greaterThan(0);
    }).skip();
  });
});