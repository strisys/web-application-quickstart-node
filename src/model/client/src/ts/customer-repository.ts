import { fetch } from 'cross-fetch';
import { Customer, ICustomerState } from 'model-core';
export { Customer, ICustomerState };

const baseUrl = 'http://localhost:3000';

export class CustomerRepository {
  public async get(): Promise<Customer[]> {
    const response = (await fetch(`${baseUrl}/api/v1/customers`));
    const json = (await response.json());

    return Customer.from(json);
  }

  public async getOne(id: string): Promise<Customer> {
    const entities = (await this.get());

    const state = entities.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Customer(state)) : Customer.null());
  }
}
