import { Customer, ICustomerState  } from 'model-core';
export { Customer, ICustomerState  };

// This is data that would come from a document or relational database
const cache: ICustomerState[] = [{
  id: '1',
  name: 'Elon Musk',
  address: '1 EV Way'
}, {
  id: '2',
  name: 'Bill Gates',
  address: '2 Software Way'
}];

export class CustomerRepository {
  public get(): Customer[] {
    return Customer.from(cache);
  }

  public getOne(id: string): Customer {
    const state = cache.find((c) => {
      return (c.id === id);
    });

    return ((state) ? (new Customer(state)) : Customer.null());
  }
}
