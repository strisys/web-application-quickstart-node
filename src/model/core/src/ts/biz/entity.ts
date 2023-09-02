import { customAlphabet } from 'nanoid';
import { alphanumeric } from 'nanoid-dictionary';

export const KEY_LENGTH = 16;

// https://github.com/CyberAP/nanoid-dictionary
const generator = customAlphabet(alphanumeric, KEY_LENGTH);

export type TypeOrNull<T> = (T | null);
export type EntityOrState<S, E> = (E | S);
export type OneOrMany<T, E> = (T extends [] ? Array<E> : E);

export interface IIdentity<T extends string = string> {
  uuid: T;
}

export interface ISerializble {
  toJSON(): string;
}

export interface INullObject {
  isNull?: boolean;
}

export type PeristentStoreSyncStatus = ('unknown' | 'new' | 'dirty' | 'sychronized')

export interface IPeristentStoreSync {
  syncStatus: PeristentStoreSyncStatus;
  isReadOnly?: boolean;
}

export interface IPersistedEntity extends IIdentity, INullObject, IPeristentStoreSync {
}

export class EntityUtil {
  private static _expr = new RegExp('^_');

  private static _nullObjectState: Readonly<(IIdentity & INullObject & IPeristentStoreSync)> = {
    uuid: 'null',
    syncStatus: 'sychronized',
    isNull: true,
    isReadOnly: true,
  }

  public static appendNullObjectState = <S extends IIdentity<I>, I extends string = string>(source: S): Readonly<S> => {
    return Object.freeze({ ...source, ...EntityUtil._nullObjectState });
  }

  public static generate = (type: ('uuid' | 'timestamp')): string => {
    if (type === 'uuid') {
      return generator();
    }

    return (new Date()).toString();
  }

  public static isSuspectJson = (value: string): boolean => {
    return EntityUtil._expr.test(value);
  }

  public static tryCast = <T>(obj: any, properties: Array<string>, defaultVal: T): T => {
    if (typeof obj !== 'object') {
      return defaultVal;
    }

    for (let p = 0; (p < properties.length); p++) {
      if (properties[p] in obj) {
        continue;
      }

      return defaultVal;
    }

    return (obj as T);
  }

  public static areEqual<T extends string = string>(target: IIdentity<T>, other: IIdentity<T>): boolean {
    return ((target) && (other) && ((other === target) || (other?.uuid === target?.uuid)));
  }
}

export function factory<S, E>(type: { new(args: S): E }, args: S): E {
  return new type(args);
}

export type OneOrOther<S, E> = (S | E);
export type OneOrArray<T> = (T | Array<T>);
export type OneOrArrayConditional<T, E = T> = (T extends Array<T> ? Array<E> : E);

export class EmptyStateCache {
  private static readonly _cache: Record<string, Object> = {};

  public static tryGet<T>(key: string): Readonly<T> {
    return (EmptyStateCache._cache[key] as T);
  }

  public static set<T>(key: string, value: T): Readonly<T> {
    return (EmptyStateCache._cache[key] = Object.freeze(value));
  }
}

class ComparisonItemResult {
  constructor(public name: string, public differenceDescription: string = '') {
  }

  public get isDifferent(): boolean {
    return Boolean(this.differenceDescription)
  }

  public toString(): string {
    const baseMessage = `name:=${this.name},isDifferent:=${this.isDifferent}`;
    return ((this.isDifferent) ? `${baseMessage},description:=${this.differenceDescription}` : baseMessage);
  }

  private static tryGetValue(target: any, propertyKey: any): any {
    try {
      return Reflect.get(target, propertyKey)
    }
    catch (error) {
      return `${error}`
    }
  }

  public static compareProperties<T extends object>(a: T, b: T, properties: Array<string>): Array<ComparisonItemResult> {
    return properties.filter((k) => Reflect.has(a, k)).map((k) => {
      return ComparisonItemResult.compare(k as string, ComparisonItemResult.tryGetValue(a, k), ComparisonItemResult.tryGetValue(b, k))
    });
  }

  public static compare(name: string, a: any, b: any): ComparisonItemResult {
    const valA = JSON.stringify(a), valB = JSON.stringify(b);
    return (new ComparisonItemResult(name, ((valA !== valB) ? `${valA} !== ${valB}` : '')));
  }
}

export type LogResultType = ('all' | 'differences-only' | 'none');

export class ComparisonItemResultBuilder {
  private readonly _items: Array<ComparisonItemResult> = [];

  constructor(public entity: string) {
  }

  public compareProperties<T extends object>(a: T, b: T, properties: Array<string>): ComparisonItemResultBuilder {
    ComparisonItemResult.compareProperties(a, b, properties).forEach((r) => this._items.push(r));
    return this;
  }

  public compare(name: string, a: any, b: any): ComparisonItemResultBuilder {
    this._items.push(ComparisonItemResult.compare(name, a, b));
    return this;
  }

  public append(results: (ComparisonItemResultCollection | Array<ComparisonItemResult>)): ComparisonItemResultBuilder {
    (results || []).forEach((r) => this._items.push(r));
    return this;
  }

  public result(logResultType: LogResultType): ComparisonItemResultCollection {
    return ComparisonItemResultCollection.create(this.entity, this._items, logResultType);
  }
}

export class ComparisonItemResultCollection {
  private readonly _items: Array<ComparisonItemResult> = [];

  constructor(public entity: string, items: Array<ComparisonItemResult> = []) {
    this._items = (items || []);
  }

  public get differences(): ComparisonItemResultCollection {
    const differences = this._items.filter((a) => a.isDifferent);
    return (new ComparisonItemResultCollection(this.entity, differences));
  }

  public get length(): number {
    return this._items.length;
  }

  public includes(name: string): boolean {
    const value = (name || '').toLowerCase();

    const find = (e: ComparisonItemResult): boolean => {
      return ((e.name.toLowerCase() === value) || (e.name.toLowerCase() === (value + '()')));
    }

    return Boolean(this._items.find(find));
  }

  public get hasDifferences(): boolean {
    return (this.differences.length > 0);
  }

  protected get items(): Array<ComparisonItemResult> {
    return [...this._items];
  }

  public forEach(fn: (result: ComparisonItemResult, index: number) => void) {
    this._items.forEach(fn);
  }

  public tryThrow(message: string = ''): ComparisonItemResultCollection {
    if (this.hasDifferences) {
      throw new Error(`${this.entity}: ${message || ''}\n${this.toString(true)}`);
    }

    return this;
  }

  public toString(differencesOnly: boolean = true): string {
    const filtered = ((differencesOnly) ? this.differences.items : this._items)
    let message = `comparison operation complete for entities (${this.entity}).`;

    if ((differencesOnly) && (filtered.length === 0)) {
      return `${message}  no differences found`;
    }

    message += '\n';

    filtered.forEach((i, index) => {
      message += (' - ' + i.name + ((index < filtered.length) ? `\n` : ''));
    });

    return message;
  }

  public static create(entity: string, items: Array<ComparisonItemResult> = [], logResult: LogResultType = 'differences-only'): ComparisonItemResultCollection {
    const results = (new ComparisonItemResultCollection(entity, items));
    return results;
  }
}