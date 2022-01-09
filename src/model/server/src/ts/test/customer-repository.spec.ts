import { expect } from 'chai';
import { Customer, CustomerRepository } from '../customer-repository';

describe('CustomerRepository', () => {
  describe('get', function() {
    it('should return more than 0 customers', async () => {
      // Assemble/Arrange
      const entities: Customer[] = (new CustomerRepository()).get();
      
      // Assert
      expect(entities.length).to.be.greaterThan(0);
    });
  });
});