export interface ICustomerState {
    id: string;
    name?: string;
    address?: string;
}
export declare class Customer {
    private readonly _state;
    constructor(state?: ICustomerState);
    get id(): string;
    set id(value: string);
    get name(): string;
    set name(value: string);
    get address(): string;
    get state(): ICustomerState;
    set address(value: string);
    static null(): Customer;
    static get emptyState(): ICustomerState;
    static correct(source: ICustomerState): ICustomerState;
    static from(states: ICustomerState[]): Customer[];
}
