
export interface ISalesEntryState {
  id: string;
  region: string,
  country: string,
  city: string,
  amount: number,
  date: Date
}

export class SalesEntry {
  private static readonly _null = new SalesEntry();
  private readonly _state: ISalesEntryState = SalesEntry.emptyState;

  constructor(state: ISalesEntryState = null) {
    this._state = SalesEntry.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public get name(): string {
    return this._state.id;
  }

  public toString(): string {
    return this.name;
  }

  public get state(): ISalesEntryState {
    return { ...this._state };
  }

  public static null(): SalesEntry {
    SalesEntry._null._state.id = '';
    return SalesEntry._null;
  }

  public static get emptyState(): ISalesEntryState {
    return {
      id: '',
      region: '',
      country: '',
      city: '',
      amount: 0,
      date: null
    };
  }

  public static coerce(source: ISalesEntryState): ISalesEntryState {
    const val = (source || SalesEntry.emptyState);

    return {
      id: (val.id || null),
      region: (val.region || ''),
      country: (val.country || ''),
      city: (val.city || ''),
      amount: (val.amount || 0),
      date: (val.date || null),
    };
  }

  public static from(states: ISalesEntryState[]): SalesEntry[] {
    if ((!states) || (!states.length)) {
      return [];
    }

    return states.map((s) => {
      return (new SalesEntry(s));
    })
  }
}