import { expect } from 'chai';
import { Customer, ICustomerState } from '../customer';

describe('CustomerRepository', () => {
  describe('constructor', function() {
    it('should contain the specified state', async () => {
      // Assemble/Arrange
      const state: ICustomerState = { id: '1', name: `Stephen Trudel`, address: '1 TS Way' };
      const entity = new Customer(state)
      
      // Assert
      expect(entity.id).to.be.eq(state.id);
      expect(entity.name).to.be.eq(state.name);
      expect(entity.address).to.be.eq(state.address);
    });
  });
});