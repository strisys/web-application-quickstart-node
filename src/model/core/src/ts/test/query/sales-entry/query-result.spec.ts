import { expect } from 'chai';
import * as sut from '../../../query/sales';

const data: sut.ISalesEntryState[] = [{
  id: '10248',
  region: 'North America',
  country: 'United States of America',
  city: 'New York',
  amount: 1740,
  date: new Date('2013-01-06'),
}, {
  id: '10249',
  region: 'North America',
  country: 'United States of America',
  city: 'Los Angeles',
  amount: 850,
  date: new Date('2013-01-13'),
}];

describe('SalesEntryQueryResult', () => {
  describe('constructur', function() {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: sut.ISalesEntryQueryResultState = { id: '1', data: data };
      const entity = new sut.SalesEntryQueryResult(state)
      
      // Assert
      expect(entity.id).to.be.eq(state.id);
      expect(entity.data.length).to.be.eq(state.data.length);
    });
  });
});