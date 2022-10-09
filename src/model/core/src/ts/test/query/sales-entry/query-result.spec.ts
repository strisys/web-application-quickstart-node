import { expect } from 'chai';
import { KEY_LENGTH } from '../../..';
import * as sut from '../../../query/sales';

const data: sut.ISalesEntryState[] = [{
  id: '10248',
  uuid: '',
  region: 'North America',
  country: 'United States of America',
  city: 'New York',
  amount: 1740,
  date: new Date('2013-01-06'),
},
{
  id: '10249',
  uuid: '',
  region: 'North America',
  country: 'United States of America',
  city: 'Los Angeles',
  amount: 850,
  date: new Date('2013-01-13'),
}];

describe('SalesEntryQueryResult', () => {
  describe('constructor', function () {
    it('should contain the expected state', async () => {
      // Assemble/Arrange
      const state: sut.ISalesEntryQueryResultState = { id: '123', uuid: '', data: data };
      const entity = new sut.SalesEntryQueryResult(state)

      // Assert
      expect(entity.id).is.not.null.and.is.not.undefined;
      expect(entity.uuid).is.not.null.and.is.not.undefined;
      expect(entity.uuid.length).is.eq(KEY_LENGTH);
      expect(entity.data.length).to.be.eq(state?.data?.length);
    });
  });
});