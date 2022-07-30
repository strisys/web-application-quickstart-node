import { KV } from "../kv";

export interface IIdentityState {
  id: string;
  email: string;
  displayName: string;
  settings: KV;
}

export type UserPreferenceKey = ('initial-path');

export class Identity {
  private static readonly _null = new Identity();
  private readonly _state: IIdentityState = Identity.emptyState;

  constructor(state: IIdentityState = null) {
    this._state = Identity.coerce(state);
  }

  public get id(): string {
    return (this._state.id || '');
  }

  public set id(value: string) {
    this._state.id = (value || '');
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

  public get state(): IIdentityState {
    return { ...this._state };
  }

  public static null(): Identity {
    Identity._null._state.id = null;
    Identity._null._state.email = '';
    Identity._null._state.displayName = '';
    Identity._null._state.settings = {};
    return Identity._null;
  }

  public static get emptyState(): IIdentityState {
    return {
      id: '',
      email: '',
      displayName: '',
      settings: {}
    };
  }

  public static coerce(source: IIdentityState): IIdentityState {
    const val = (source || Identity.emptyState);

    return {
      id: (val.id || null),
      email: (val.email || ''),
      displayName: (val.displayName || ''),
      settings: (val.settings || {})
    };
  }

  public static from(states: IIdentityState[]): Identity[] {
    return (states || []).map((s) => {
      return (new Identity(s));
    })
  }
}