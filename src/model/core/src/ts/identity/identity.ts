import { IIdentity, EntityUtil, OneOrOther, OneOrArray, ComparisonItemResultCollection, ComparisonItemResultBuilder } from '../biz/entity';
import { KV } from '../kv';

export interface IIdentityState extends IIdentity {
  id: string;
  email: string;
  displayName: string;
  settings: KV;
}

const ENTITY_NAME= 'Identity';
export type UserPreferenceKey = ('initial-path');
type StateOrNull = (IIdentityState | null);
export type IdentityOrState = OneOrOther<Identity, IIdentityState>;
type IdentityOneOrMany<T> = (T extends Array<IdentityOrState> ? Array<Identity> : (T extends Array<Partial<IIdentityState>> ? Array<Identity> : Identity));
type IdentityOneOrManyState<T> = (T extends Array<IIdentityState> ? Array<IIdentityState> : IIdentityState);

export class Identity {
  private static _null: Identity;
  private static _keys: Array<string>;
  private static _emptyState: Readonly<IIdentityState>;
  private readonly _state: IIdentityState;

  private constructor(state: (IIdentityState | null) = null) {
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

  public get state(): Readonly<IIdentityState> {
    return { ...this._state };
  }

  public static get null(): Identity {
    return (Identity._null ?? (Identity._null = new Identity(Object.freeze({ ...Identity.emptyState, uuid: 'null' }))));
  }

  public static toState(entityOrState: IdentityOrState): IIdentityState {
    return ((entityOrState instanceof Identity) ? entityOrState.state : Identity.coerce(entityOrState));
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
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      id: (val.id || emp.id),
      email: (val.email || emp.email),
      displayName: (val.displayName || emp.displayName),
      settings: (val.settings || emp.settings),
    };
  }

  public toJSON(withValidation: boolean = false): string {
    const json = JSON.stringify(this.state);

    if ((withValidation) && (EntityUtil.isSuspectJson(json))) {
      throw new Error(`the json for the specified entity (${this.toString(false)}) has an underscore (_) indicating that it is invalid. \n${json}`);
    }

    return json;
  }

  public clone(withValidation: boolean = false): Identity {
    const clone = (new Identity(JSON.parse(this.toJSON(withValidation)) as IIdentityState));

    if (withValidation) {
      this.compareTo(clone).tryThrow(`failed to successfully clone ${ENTITY_NAME} object graph`);
    }

    return clone;
  }

  public static get stateKeys(): Array<string> {
    return (Identity._keys || (Identity._keys = Object.keys(Identity.emptyState)));
  }

  public compareTo(other: Identity): ComparisonItemResultCollection {
    return Identity.compare(this, other);
  }

  public static compare(a: Identity, b: Identity): ComparisonItemResultCollection {
    return (new ComparisonItemResultBuilder(ENTITY_NAME))
      .compareProperties(a, b, [...Identity.stateKeys, 'state'])
      .compare('toJSON()', a.toJSON(false), b.toJSON(false))
      .result('differences-only');
  }

  public toString(json?: boolean): string {
    return ((!json) ? this.email : this.toJSON(false));
  }

  private static createNewState<T extends OneOrArray<Partial<IIdentityState>>>(partial: T): IdentityOneOrManyState<T> {
    const create = (partial: Partial<IIdentityState>): IIdentityState => {
      return {
        ...Identity.emptyState,
        uuid: EntityUtil.generate('uuid'),
        ...partial
      }
    }

    if (Array.isArray(partial)) {
      return (partial.map((p) => create(p)) as IdentityOneOrManyState<T>);
    }

    return create(partial) as IdentityOneOrManyState<T>;
  }

  public static create<T extends OneOrArray<Partial<IIdentityState>>>(state: T): IdentityOneOrMany<T> {
    return Identity.from(Identity.createNewState(state)) as IdentityOneOrMany<T>;
  }

  public static from<T extends (string | Array<IIdentityState> | IIdentityState)>(state: T): IdentityOneOrMany<T> {
    if (!state) {
      return (Identity.null as IdentityOneOrMany<T>);
    }

    if (state instanceof Identity) {
      return (new Identity(state.state) as IdentityOneOrMany<T>);
    }

    if (typeof state === 'string') {
      const parsed = JSON.parse(state);
      const val = ((Array.isArray(parsed)) ? parsed as Array<IIdentityState> : parsed as IIdentityState);
      const result = ((Array.isArray(val)) ? val.map((s) => (new Identity(s))) : new Identity(val));
      return (result as IdentityOneOrMany<T>);
    }

    if (Array.isArray(state)) {
      const result: Array<Identity> = state.map((s) => {
        return ((s instanceof Identity) ? new Identity(s.state) : new Identity(s));
      });

      return (result as IdentityOneOrMany<T>);
    }

    return (new Identity(state) as IdentityOneOrMany<T>);
  }
}