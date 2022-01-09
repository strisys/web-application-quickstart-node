import { Customer, ICustomerState } from 'model-core';
export { Customer, ICustomerState };
export declare class CustomerRepository {
    get(): Customer[];
    getOne(id: string): Customer;
}
