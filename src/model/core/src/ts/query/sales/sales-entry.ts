import { IIdentity, EntityUtil } from '../../biz';

export interface ISalesEntryState extends IIdentity {
  id: string,
  region: string,
  country: string,
  city: string,
  amount: number,
  date: Date
}

type StateOrNull = (ISalesEntryState | null);
type From<T> = (T extends Array<ISalesEntryState> ? Array<SalesEntry> : SalesEntry);

export class SalesEntry {
  private static _null: SalesEntry;
  private static _emptyState: ISalesEntryState;
  private _state: ISalesEntryState;

  constructor(state: StateOrNull = null) {
    this._state = SalesEntry.coerce(state);
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get name(): string {
    return this._state.uuid;
  }

  public toString(): string {
    return this.name;
  }

  public get state(): Readonly<ISalesEntryState> {
    return { ...this._state };
  }

  public static get null(): SalesEntry {
    return (SalesEntry._null ?? (SalesEntry._null = new SalesEntry(Object.freeze({ ...SalesEntry.emptyState, uuid: 'null' }))));
  }

  public static get emptyState(): Readonly<ISalesEntryState> {
    return (SalesEntry._emptyState || (SalesEntry._emptyState = Object.freeze({
      id: '',
      uuid: '',
      region: '',
      country: '',
      city: '',
      amount: 0,
      date: new Date()
    })));
  }

  public static coerce(source: StateOrNull): ISalesEntryState {
    const emp = SalesEntry.emptyState;
    const val = (source || emp);

    return {
      ...val,
      id: (val.id || emp.id),
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      region: (val.region || emp.region),
      country: (val.country || emp.country),
      city: (val.city || emp.city),
      amount: (val.amount || emp.amount)
    };
  }

  public static from<T extends (Array<ISalesEntryState> | ISalesEntryState)>(states: T): From<T> {
    const val: (Array<ISalesEntryState> | ISalesEntryState) = (states || []);
    return ((Array.isArray(val)) ? val.map((s) => (new SalesEntry(s))) : new SalesEntry(val)) as From<T>;
  }
}