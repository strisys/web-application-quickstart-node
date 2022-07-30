
export interface ITaskState {
  id: string;
  description?: string;
}

export class Task {
  private static readonly _null = new Task();
  private readonly _state: ITaskState = Task.emptyState;

  constructor(state: ITaskState = null) {
    this._state = Task.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public set id(value: string) {
    this._state.id = (value || '');
  }

  public get description(): string {
    return (this._state.description || '');
  }

  public set description(value: string) {
    this._state.description = (value || '');
  }

  public toString(): string {
    return this.id;
  }

  public get state(): ITaskState {
    return { ...this._state };
  }

  public static null(): Task {
    Task._null._state.id = null;
    Task._null._state.description = '';
    return Task._null;
  }

  public static get emptyState(): ITaskState {
    return {
      id: '',
      description: ''
    };
  }

  public static coerce(source: ITaskState): ITaskState {
    const val = (source || Task.emptyState);

    return {
      id: (val.id || null),
      description: (val.description || '')
    };
  }

  public static from(states: ITaskState[]): Task[] {
    return (states || []).filter((s) => Boolean(s)).map((s) => {
      return (new Task(s));
    })
  }
}