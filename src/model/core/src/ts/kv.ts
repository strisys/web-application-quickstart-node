export type WellKnownKey = ('is-testing');

export type KV = { [key:string]: any };

export class KVStoreEntry {
  public static readonly null = new KVStoreEntry('null', '', true);
  private readonly _key: string;
  private readonly _isFrozen: boolean;
  private readonly _metaData: { [key:string]: any };
  private _value: any;

  public constructor(key: string, value: any, isFrozen: boolean, metaData: KV = {}) {
    this._key = key;
    this._value = value;
    this._isFrozen = isFrozen
    this._metaData = { ...(metaData || {})};
  }

  public get key(): string {
    return this._key;
  }

  public get value(): any {
    return this._value;
  }

  public get metaData(): any {
    return this._metaData;
  }

  public set value(val: any) {
    if (this.isFrozen) {
      throw new Error(`Failed to set value for ${this.key} as its is set to 'frozen' cannot be changed.`);
    }

    this._value = val;
  }

  public get isFrozen(): boolean {
    return this._isFrozen;
  }
}

export class KVStore {
  private static readonly _stores: { [key:string]: KVStore } = {};
  private readonly _inner: { [key: (string | WellKnownKey)]: KVStoreEntry } = {};
  private readonly _context: string;

  private constructor(context: string) {
    this._inner['is-testing'] = new KVStoreEntry('is-testing', false, false);
    this._context = context;
  }

  public static current(context: string = 'global'): KVStore {
    const ctx = (context || '').trim();

    if (!ctx) {
      throw new Error(`Failed to get KVStore.  No 'context' specified.`)
    }

    return ((KVStore._stores[ctx]) ? KVStore._stores[ctx] : (KVStore._stores[ctx] = new KVStore(ctx)));
  }

  public get context(): string {
    return this._context;
  }

  public get isTesting(): boolean {
    return (this._inner['is-testing'].value === true);
  }

  public set isTesting(value: boolean) {
    this._inner['is-testing'].value = value;
  }

  public get(key: (string | WellKnownKey)): KVStoreEntry {
    const current = this.tryGet(key);
    return ((current) ? current : null)
  }

  private tryGet(key: (string | WellKnownKey)): KVStoreEntry {
    return (this._inner[key] || null);
  }

  public set(key: (WellKnownKey | string), value: any, freeze: boolean = true, metaData: KV = {}): KVStoreEntry {
    const entry = this.tryGet(key);

    if (entry) {
      entry.value = value;
      return entry;
    }

    return (this._inner[key] = new KVStoreEntry(key, value, freeze, metaData));
  }
}