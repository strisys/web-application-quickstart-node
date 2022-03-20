import { ISalesEntryState } from './sales-entry';

export interface ISalesEntryQueryResultState {
  id: string,
  data?: ISalesEntryState[]
}

export class SalesEntryQueryResult {
  public static readonly _null = new SalesEntryQueryResult();
  private readonly _state: ISalesEntryQueryResultState = SalesEntryQueryResult.emptyState;
  
  constructor(state: ISalesEntryQueryResultState = null) {
    this._state = SalesEntryQueryResult.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public set id(value: string) {
    this._state.id = (value || '');
  }

  public get data(): ISalesEntryState[] {
    return ((this._state.data) ? [...this._state.data] : []);
  }

  public get name(): string {
    return this._state.id;
  }

  public toString(): string {
    return this.name;
  }

  public get state(): ISalesEntryQueryResultState {
    return { ...this._state };
  }

  public static get null(): SalesEntryQueryResult {
    SalesEntryQueryResult._null._state.id = '';
    return SalesEntryQueryResult._null;
  }

  public static get emptyState(): ISalesEntryQueryResultState {
    return {
      id: '',
      data: [],
    };
  }

  public static coerce(source: ISalesEntryQueryResultState): ISalesEntryQueryResultState {
    const val = (source || SalesEntryQueryResult.emptyState);

    return {
      id: (val.id || null),
      data: (val.data || []),
    };
  }

  public static from(state: ISalesEntryQueryResultState): SalesEntryQueryResult {
    return ((state) ? (new SalesEntryQueryResult(state)) : SalesEntryQueryResult.null);
  }
}