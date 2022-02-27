import { Customer, ICustomerState } from 'model-core';
export { Customer, ICustomerState };
import axios from 'axios';

// const fetchApi = ((process) ? (import('node-fetch')) : fetch);
axios.defaults.baseURL = 'http://localhost:3000';

export class CustomerRepository {
  public async get(): Promise<Customer[]> {
    const response = (await axios.get('/api/v1/customers'));
    const entities = ((await response.data) as ICustomerState[]);

    return Customer.from(entities);
  }

  public async getOne(id: string): Promise<Customer> {
    const entities = (await this.get());

    const state = entities.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Customer(state)) : Customer.null());
  }
}
