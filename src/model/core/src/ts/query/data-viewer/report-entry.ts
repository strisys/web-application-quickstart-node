
import { IIdentity, EntityUtil } from '../../biz/entity';
import { KV } from '../../kv';

export interface IReportEntryBaseState extends IIdentity {
  name: string,
  version: string,
  description?: (string | null);
  tags?: (Record<string, any> | null);
}

export interface IReportEntryState extends IReportEntryBaseState {
  data: (any | null);
}

export type ReportEntryOrNull = (IReportEntryState | null);

export class ReportEntry {
  private static _null: ReportEntry;
  private static _emptyState: Readonly<IReportEntryState>;
  private _state: IReportEntryState;

  constructor(state: IReportEntryState) {
    this._state = ReportEntry.coerce(state);
  }

  public get id(): string {
    return ReportEntry.toKey(this._state.name, this._state.version);
  }

  public get uuid(): string {
    return this._state.uuid;
  }

  public get data(): any {
    return (this._state.data || null);
  }

  public get name(): string {
    return (this._state.name || '');
  }

  public get version(): string {
    return (this._state.version || '');
  }

  public get description(): string {
    return (this._state.description || '');
  }

  public get tags(): KV {
    return (this._state.tags || {});
  }

  public get state(): Readonly<IReportEntryState> {
    return { ...this._state };
  }

  public static toKey(name: string, version: string): string {
    return ((version) ? `${name} v${version}` : name);
  }

  public static get null(): ReportEntry {
    return (ReportEntry._null ?? (ReportEntry._null = new ReportEntry(Object.freeze({ ...ReportEntry.emptyState, uuid: 'null' }))));
  }

  public static get emptyState(): Readonly<IReportEntryState> {
    return (ReportEntry._emptyState || (ReportEntry._emptyState = Object.freeze({
      uuid: '',
      name: '',
      version: '',
      description: '',
      data: null,
      tags: {},
    })));
  }

  public static coerce(source: ReportEntryOrNull): IReportEntryState {
    const emp = ReportEntry.emptyState;
    const val = (source || emp);

    return {
      ...val,
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      name: (val.name || emp.name),
      version: (val.version || emp.version),
      description: (val.description || emp.description),
      data: (val.data || emp.data),
      tags: (val.tags || emp.tags),
    };
  }

  public toString(): string {
    return this.id;
  }
}