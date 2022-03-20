import { expect } from 'chai';
import * as sut from '../../../query/sales/query-service';
import { getLogger } from '../../util';

const logger = getLogger(module);

describe('SalesEntryQueryService', () => {
  describe('get', function() {
    it('should return expected state', async () => {
      // Assemble/Arrange
      const queryResult = await (new sut.SalesEntryQueryService()).get();
      
      // Assert
      expect(queryResult.id).to.not.be.null;
      expect(queryResult.data.length).to.be.greaterThan(0);
    });
  });
});