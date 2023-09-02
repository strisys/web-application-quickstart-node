import { IIdentity, EntityUtil } from '../../biz';
import { ISalesEntryState } from './sales-entry';

export interface ISalesEntryQueryResultState extends IIdentity {
  id: string,
  data?: ISalesEntryState[]
}

type From<T> = (T extends Array<ISalesEntryQueryResultState> ? Array<SalesEntryQueryResult> : SalesEntryQueryResult);
type StateOrNull = (ISalesEntryQueryResultState | null);

export class SalesEntryQueryResult {
  public static _null = new SalesEntryQueryResult();
  private static _emptyState: Readonly<ISalesEntryQueryResultState>;
  private readonly _state: ISalesEntryQueryResultState;

  constructor(state: StateOrNull = null) {
    this._state = SalesEntryQueryResult.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get data(): ISalesEntryState[] {
    return ((this._state.data) ? [...this._state.data] : []);
  }

  public toString(): string {
    return this.id;
  }

  public get state(): Readonly<ISalesEntryQueryResultState> {
    return { ...this._state };
  }

  public static get null(): SalesEntryQueryResult {
    return (SalesEntryQueryResult._null ?? (SalesEntryQueryResult._null = new SalesEntryQueryResult(Object.freeze({ ...SalesEntryQueryResult.emptyState, uuid: 'null' }))));
  }

  public static get emptyState(): Readonly<ISalesEntryQueryResultState> {
    return (SalesEntryQueryResult._emptyState || (SalesEntryQueryResult._emptyState = Object.freeze({
      id: '',
      uuid: '',
      data: []
    })));
  }

  public static coerce(source: StateOrNull): ISalesEntryQueryResultState {
    const emp = SalesEntryQueryResult.emptyState;
    const val = (source || emp);

    return {
      ...val,
      id: (val.id || emp.id),
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      data: (val.data || emp.data),
    };
  }

  public static from<T extends (Array<ISalesEntryQueryResultState> | ISalesEntryQueryResultState)>(states: T): From<T> {
    const val: (Array<ISalesEntryQueryResultState> | ISalesEntryQueryResultState) = (states || []);
    return ((Array.isArray(val)) ? val.map((s) => (new SalesEntryQueryResult(s))) : new SalesEntryQueryResult(val)) as From<T>;
  }
}