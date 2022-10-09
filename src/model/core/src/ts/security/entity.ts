import { IIdentity, generateUuid } from '../biz/entity';
import { KV } from '../kv';

export interface IIdentityState extends IIdentity {
  id: string;
  email: string;
  displayName: string;
  settings: KV;
}

export type UserPreferenceKey = ('initial-path');
type StateOrNull = (IIdentityState | null);
type From<T> = (T extends Array<IIdentityState> ? Array<Identity> : Identity);

export class Identity {
  private static _null: Identity;
  private static _emptyState: Readonly<IIdentityState>;
  private readonly _state: IIdentityState;

  constructor(state: (IIdentityState | null) = null) {
    this._state = Identity.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get email(): string {
    return (this._state.email || '');
  }

  public get displayName(): string {
    return (this._state.displayName || '');
  }

  public get preferences(): KV {
    return { ...(this._state.settings || {}) };
  }

  public setUserPreferenceValue(key: (UserPreferenceKey | 'string'), value: any): Identity {
    this._state.settings[key] = value;
    return this;
  }

  public toString(): string {
    return this.email;
  }

  public get state(): Readonly<IIdentityState> {
    return { ...this._state };
  }

  public static get null(): Identity {
    return (Identity._null ?? (Identity._null = new Identity(Object.freeze({ ...Identity.emptyState, uuid: 'null' }))));
  }

  public static get emptyState(): Readonly<IIdentityState> {
    return (Identity._emptyState || (Identity._emptyState = Object.freeze({
      id: '',
      uuid: '',
      email: '',
      displayName: '',
      settings: {},
    })));
  }

  public static coerce(source: StateOrNull): IIdentityState {
    const emp = Identity.emptyState;
    const val = (source || emp);

    return {
      ...val,
      uuid: (val.uuid || generateUuid()),
      id: (val.id || emp.id),
      email: (val.email || emp.email),
      displayName: (val.displayName || emp.displayName),
      settings: (val.settings || emp.settings),
    };
  }

  public static from<T extends (Array<IIdentityState> | IIdentityState)>(states: T): From<T> {
    const val: (Array<IIdentityState> | IIdentityState) = (states || []);
    return ((Array.isArray(val)) ? val.map((s) => (new Identity(s))) : new Identity(val)) as From<T>;
  }
}