
export interface ICustomerState {
  id: string;
  name?: string;
  address?: string
}

export class Customer {
  private readonly _state: ICustomerState = Customer.emptyState;

  constructor(state: ICustomerState = null) {
    this._state = Customer.correct(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public set id(value: string) {
    this._state.id = (value || '');
  }

  public get name(): string {
    return (this._state.name || '');
  }

  public set name(value: string) {
    this._state.name = (value || '');
  }

  public get address(): string {
    return (this._state.address || '');
  }

  public get state(): ICustomerState {
    return { ... this._state };
  }

  public set address(value: string) {
    this._state.address = (value || '');
  }

  public static null(): Customer {
    return (new Customer());
  }

  public static get emptyState(): ICustomerState {
    return {
      id: '',
      name: '',
      address: ''
    };
  }

  public static correct(source: ICustomerState): ICustomerState {
    const val = (source || Customer.emptyState);

    return {
      id: val.id,
      name: (val.name || ''),
      address: (val.address || '')
    };
  }

  public static from(states: ICustomerState[]): Customer[] {
    if (!states) {
      return [];
    }

    return states.map((s) => {
      return (new Customer(s));
    })
  }
}