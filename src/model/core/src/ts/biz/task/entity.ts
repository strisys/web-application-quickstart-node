import { IIdentity, IPersistedEntity, IPeristentStoreSync, PeristentStoreSyncStatus, generateUuid } from '../entity';
import { KV } from '../../kv';

export interface ITaskState extends IIdentity, IPeristentStoreSync {
  id: string,
  description: (string | null);
  tags: (KV | null);
}

type StateOrNull = (ITaskState | null);
type From<T> = (T extends Array<ITaskState> ? Array<Task> : Task);

export class Task implements IPersistedEntity {
  private static _null: Task;
  private static _emptyState: Readonly<ITaskState>;
  private readonly _state: ITaskState;

  constructor(state: StateOrNull = null) {
    this._state = Task.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get isNull(): boolean {
    return (Task.null === this);
  }

  public get syncStatus(): PeristentStoreSyncStatus {
    return this._state.syncStatus;
  }

  public set syncStatus(value: PeristentStoreSyncStatus) {
    this._state.syncStatus = (value || 'unknown');
  }

  public setSyncStatus(value: PeristentStoreSyncStatus): Task {
    this.syncStatus = value;
    return this;
  }

  public get description(): string {
    return (this._state.description || '');
  }

  public set description(value: string) {
    this._state.description = (value || '');
  }

  public get tags(): KV {
    return { ...(this._state.tags || (this._state.tags = {})) };
  }

  public toString(): string {
    return this.uuid;
  }

  public get state(): Readonly<ITaskState> {
    return { ...this._state };
  }

  public static get null(): Task {
    return (Task._null ?? (Task._null = new Task(Object.freeze({ ...Task.emptyState, uuid: 'null' }))));
  }

  public static get emptyState(): Readonly<ITaskState> {
    return (Task._emptyState || (Task._emptyState = Object.freeze({
      id: '',
      uuid: '',
      description: '',
      tags: {},
      syncStatus: 'unknown'
    })));
  }

  public static coerce(source: StateOrNull): ITaskState {
    const emp = Task.emptyState;
    const val = (source || emp);

    return {
      ...val,
      id: (val.id || emp.id),
      uuid: (val.uuid || generateUuid()),
      description: (val.description || emp.description),
      tags: (val.tags || emp.tags),
      syncStatus: ((!source) ? 'new' : (val.syncStatus || emp.syncStatus)),
    };
  }

  public static from<T extends (Array<ITaskState> | ITaskState)>(states: T): From<T> {
    const val: (Array<ITaskState> | ITaskState) = (states || []);
    return ((Array.isArray(val)) ? val.map((s) => (new Task(s))) : new Task(val)) as From<T>;
  }
}