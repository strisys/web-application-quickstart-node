import { IPersistedEntity, PeristentStoreSyncStatus, EntityUtil, OneOrMany, OneOrArray, EntityOrState, ComparisonItemResultBuilder, ComparisonItemResultCollection } from '../entity';
import { IDocumentInfoState, DocumentInfoCollection } from './document';
import { KV } from '../../kv';

export interface ITaskState extends IPersistedEntity {
  name: string;
  description: string;
  documents: Array<IDocumentInfoState>;
  tags: KV;
}

const ENTITY_NAME = 'Task';

export type TaskStateOrNull = (ITaskState | null);
export type TaskOneOrArray = OneOrMany<TaskOrState, Task>;
export type TaskOrState = EntityOrState<ITaskState, Task>;
type TaskOneOrMany<T> = (T extends Array<TaskOrState> ? Array<Task> : (T extends Array<Partial<ITaskState>> ? Array<Task> : Task));
type TaskOneOrManyState<T> = (T extends Array<ITaskState> ? Array<ITaskState> : ITaskState);


export class Task implements IPersistedEntity {
  private static _null: Task;
  private static _emptyState: Readonly<ITaskState>;
  private static _keys: Array<string>;
  private readonly _state: ITaskState;
  private _documents: (DocumentInfoCollection | null) = null;

  constructor(state: TaskStateOrNull = null) {
    this._state = Task.coerce(state);
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get name(): string {
    return (this._state.name || '');
  }


  public get documents(): DocumentInfoCollection {
    return (this._documents || (this._documents = new DocumentInfoCollection(this._state.documents)));
  }

  public get isNull(): boolean {
    return Boolean(this._state.isNull);
  }

  public get isReadOnly(): boolean {
    return Boolean(this._state.isReadOnly);
  }

  public get syncStatus(): PeristentStoreSyncStatus {
    return this._state.syncStatus;
  }

  public setSyncStatus(value: PeristentStoreSyncStatus = 'sychronized'): Task {
    this.documents.setSyncStatus(this._state.syncStatus = value);
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

  public get state(): ITaskState {
    return { ...this._state, documents: this.documents.state };
  }

  public static tryCast(value: any): TaskOrState {
    if (value instanceof Task) {
      return value as Task;
    };

    return EntityUtil.tryCast<TaskOrState>(value, Task.stateKeys, Task.null);
  }

  public static canCast(value: any): boolean {
    return (!Task.tryCast(value).isNull);
  }

  public static get null(): Task {
    return (Task._null ?? (Task._null = new Task(EntityUtil.appendNullObjectState(Task.emptyState))));
  }


  private static createNewState<T extends OneOrArray<Partial<ITaskState>>>(partial: T): TaskOneOrManyState<T> {
    const create = (partial: Partial<ITaskState>) => {
      return {
        ...Task.emptyState,
        uuid: EntityUtil.generate('uuid'),
        syncStatus: 'new',
        ...partial
      }
    }

    if (Array.isArray(partial)) {
      return (partial.map((p) => create(p)) as TaskOneOrManyState<T>);
    }

    return create(partial) as TaskOneOrManyState<T>;
  }

  public static create<T extends OneOrArray<Partial<ITaskState>>>(state: T): TaskOneOrMany<T> {
    return Task.from(Task.createNewState(state)) as TaskOneOrMany<T>;
  }

  public static get stateKeys(): Array<string> {
    return (Task._keys || (Task._keys = Object.keys(Task.emptyState)));
  }

  public static get emptyState(): Readonly<ITaskState> {
    return (Task._emptyState || (Task._emptyState = Object.freeze({
      uuid: '',
      name: '',
      description: '',
      documents: [],
      tags: {},
      syncStatus: 'unknown',
      isNull: false
    })));
  }

  private static coerce(source: TaskStateOrNull): ITaskState {
    const emp = Task.emptyState;
    const val = (source || emp);

    return {
      ...val,
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      description: (val.description || emp.description),
      tags: (val.tags || emp.tags),
      syncStatus: ((!source) ? 'new' : (val.syncStatus || emp.syncStatus)),
    };
  }

  public static from<T extends (string | Array<TaskOrState> | TaskOrState)>(state: T): TaskOneOrMany<T> {
    if (!state) {
      return (Task.null as TaskOneOrMany<T>);
    }

    if (state instanceof Task) {
      return (new Task(state.state) as TaskOneOrMany<T>);
    }

    if (typeof state === 'string') {
      const parsed = JSON.parse(state);
      const val = ((Array.isArray(parsed)) ? parsed as Array<ITaskState> : parsed as ITaskState);
      const result = ((Array.isArray(val)) ? val.map((s) => (new Task(s))) : new Task(val));
      return (result as TaskOneOrMany<T>);
    }

    if (Array.isArray(state)) {
      const result: Array<Task> = state.map((s) => {
        return ((s instanceof Task) ? new Task(s.state) : new Task(s));
      });

      return (result as TaskOneOrMany<T>);
    }

    return (new Task(state) as TaskOneOrMany<T>);
  }

  public equals(other: Task): boolean {
    return EntityUtil.areEqual(this, other);
  }

  public clone(withValidation: boolean = false): Task {
    const clone = (new Task(JSON.parse(this.toJSON(withValidation)) as ITaskState));

    if (withValidation) {
      this.compareTo(clone).tryThrow(`failed to successfully clone ${ENTITY_NAME} object graph`);
    }

    return clone;
  }

  public compareTo(other: Task): ComparisonItemResultCollection {
    return Task.compare(this, other);
  }

  public static compare(a: Task, b: Task): ComparisonItemResultCollection {
    return (new ComparisonItemResultBuilder(ENTITY_NAME))
      .compareProperties(a, b, [...Task.stateKeys, 'state'])
      .compare('toJSON()', a.toJSON(false), b.toJSON(false))
      .result('differences-only');
  }

  public toJSON(withValidation: boolean = false): string {
    const json = JSON.stringify(this.state);

    if ((withValidation) && (EntityUtil.isSuspectJson(json))) {
      throw new Error(`the json for the specified entity (${this.toString(false)}) has an underscore (_) indicating that it is invalid. \n${json}`);
    }

    return json;
  }

  public toString(json?: boolean): string {
    return ((!json) ? this.description : this.toJSON(false));
  }
}