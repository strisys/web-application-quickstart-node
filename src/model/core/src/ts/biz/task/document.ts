import { IPersistedEntity, PeristentStoreSyncStatus, EntityUtil, OneOrArray, OneOrOther, ComparisonItemResultBuilder, ComparisonItemResultCollection, EmptyStateCache } from '../entity';
import { DateUtil } from '../date-util';
import { IIdentityState, Identity } from '../../identity'
import { KV } from '../../kv';

const ENTITY_NAME = 'DocumentInfo';

export interface IDocumentInfoState extends IPersistedEntity {
  displayName: string;
  description: string;
  url: string;
  status: string;
  uploadedBy: IIdentityState,
  createDate: string;
  isReadOnly: boolean;
  isNull: boolean;
  tags: KV;
}

export type DocumentInfoOrState = OneOrOther<DocumentInfo, IDocumentInfoState>;
type DocumentInfoOneOrMany<T> = (T extends Array<IDocumentInfoState> ? Array<DocumentInfo> : (T extends Array<DocumentInfoOrState> ? Array<DocumentInfo> : DocumentInfo));

export class DocumentInfo implements IPersistedEntity {
  private static _null: DocumentInfo;
  private static _keys: Array<string>;
  private readonly _state: IDocumentInfoState = DocumentInfo.emptyState;
  private _uploadedBy: (Identity | null) = null;
  private _createDate: (Date | null) = null;

  constructor(state: (IDocumentInfoState | null) = null) {
    this._state = DocumentInfo.coerce(state);
  }

  public get uuid(): string {
    return (this._state.uuid || '');
  }

  public get uploadedBy(): Identity {
    return (this._uploadedBy || (this._uploadedBy = Identity.from(this._state.uploadedBy)));
  }

  public static get stateKeys(): Array<string> {
    return (DocumentInfo._keys || (DocumentInfo._keys = Object.keys(DocumentInfo.emptyState)));
  }

  public get isNull(): boolean {
    return Boolean(this._state.isNull);
  }

  public get isReadOnly(): boolean {
    return Boolean(this._state.isReadOnly);
  }

  public get url(): string {
    return (this._state.url || '');
  }

  public get createDate(): Date {
    return (this._createDate || (this._createDate = new Date(this._state.createDate)));
  }

  public get syncStatus(): PeristentStoreSyncStatus {
    return this._state.syncStatus;
  }

  public setSyncStatus(value: PeristentStoreSyncStatus = 'sychronized'): DocumentInfo {
    this._state.syncStatus = value;
    return this;
  }

  public get description(): string {
    return (this._state.description || '');
  }

  public get displayName(): string {
    return (this._state.displayName || this.description);
  }

  public get status(): string {
    return (this._state.status || '');
  }

  public get tags(): Record<string, any> {
    return { ...(this._state.tags || {}) };
  }

  public equals(other: DocumentInfo): boolean {
    return EntityUtil.areEqual(this, other);
  }

  public toString(json?: boolean): string {
    return ((!json) ? this.description : this.toJSON(false));
  }

  public toJSON(withValidation: boolean = false): string {
    const json = JSON.stringify(this.state);

    if ((withValidation) && (EntityUtil.isSuspectJson(json))) {
      throw new Error(`the json for the specified entity (${this.toString(false)}) has an underscore (_) indicating that it is invalid. \n${json}`);
    }

    return json;
  }

  public clone(withValidation: boolean = false): DocumentInfo {
    const clone = (new DocumentInfo(JSON.parse(this.toJSON(withValidation)) as IDocumentInfoState));

    if (withValidation) {
      this.compareTo(clone).tryThrow('failed to successfully clone object graph');
    }

    return clone;
  }

  public compareTo(other: DocumentInfo): ComparisonItemResultCollection {
    return DocumentInfo.compare(this, other);
  }

  public static compare(a: DocumentInfo, b: DocumentInfo): ComparisonItemResultCollection {
    return (new ComparisonItemResultBuilder('Obligation'))
      .compareProperties(a, b, [...DocumentInfo.stateKeys, 'state'])
      .compare('toJSON()', a.toJSON(false), b.toJSON(false))
      .result('differences-only');
  }

  public static toState(profile: DocumentInfoOrState): IDocumentInfoState {
    return ((profile instanceof DocumentInfo) ? profile.state : profile);
  }

  public get state(): IDocumentInfoState {
    return { ...this._state };
  }

  public static tryCast(value: any): DocumentInfoOrState {
    if (value instanceof DocumentInfo) {
      return value as DocumentInfo;
    };

    return EntityUtil.tryCast<DocumentInfoOrState>(value, DocumentInfo.stateKeys, DocumentInfo.null);
  }

  public static canCast(value: any): boolean {
    return (!DocumentInfo.tryCast(value).isNull);
  }

  public static get null(): DocumentInfo {
    return (DocumentInfo._null ?? (DocumentInfo._null = new DocumentInfo(EntityUtil.appendNullObjectState(DocumentInfo.emptyState))));
  }

  private static createNewState(partial: Partial<IDocumentInfoState>): IDocumentInfoState {
    return {
      ...DocumentInfo.emptyState,
      uuid: EntityUtil.generate('uuid'),
      syncStatus: 'new',
      createDate: EntityUtil.generate('timestamp'),
      status: 'active',
      ...partial
    }
  }

  public static create(state: Partial<IDocumentInfoState>): DocumentInfo {
    return DocumentInfo.from(DocumentInfo.createNewState(state));
  }

  public static get emptyState(): Readonly<IDocumentInfoState> {
    return (EmptyStateCache.tryGet(ENTITY_NAME) || EmptyStateCache.set(ENTITY_NAME, {
      uuid: '',
      displayName: '',
      description: '',
      url: '',
      status: '',
      uploadedBy: Identity.null.state,
      createDate: DateUtil.MIN_DATE_STRING,
      tags: {},
      isReadOnly: false,
      isNull: false,
      syncStatus: 'inSync'
    }));
  }

  private static coerce(source: (IDocumentInfoState | null)): IDocumentInfoState {
    const emp = DocumentInfo.emptyState;
    const val = (source || emp);

    return {
      uuid: (val.uuid || EntityUtil.generate('uuid')),
      displayName: (val.displayName || emp.displayName),
      description: (val.description || emp.description),
      url: (val.url || emp.url),
      status: (val.status || emp.status),
      uploadedBy: Identity.toState(val.uploadedBy || emp.uploadedBy),
      createDate: (val.createDate || emp.createDate),
      tags: { ...(val.tags || emp.tags) },
      isReadOnly: (val.isReadOnly || emp.isReadOnly),
      isNull: (val.isNull || emp.isNull),
      syncStatus: ((!source) ? 'new' : (val.syncStatus || emp.syncStatus)),
    };
  }

  public static from<T extends (Array<DocumentInfoOrState> | DocumentInfoOrState | string)>(state: T): DocumentInfoOneOrMany<T> {
    if (typeof state === 'string') {
      try {
        return (new DocumentInfo((JSON.parse(state) as IDocumentInfoState)) as DocumentInfoOneOrMany<T>);
      }
      catch (error) {
        throw new Error(`failed to parse JSON into a valid 'Document' instance.  ${error}\n\n${state}`);
      }
    }

    if (state instanceof DocumentInfo) {
      return (new DocumentInfo(DocumentInfo.toState(state)) as DocumentInfoOneOrMany<T>);
    }

    const val: (Array<DocumentInfoOrState> | DocumentInfoOrState) = (state || ([] as Array<DocumentInfoOrState>));

    if (!Array.isArray(val)) {
      return new DocumentInfo(((val instanceof DocumentInfo) ? val.state : val)) as DocumentInfoOneOrMany<T>
    }

    return (val.map((s) => new DocumentInfo(((s instanceof DocumentInfo) ? s.state : s))) as DocumentInfoOneOrMany<T>);
  }
}

export type DocumentInfoProfileKey = (number | string | DocumentInfoOrState);

export class DocumentInfoCollection {
  private readonly _elements: Array<DocumentInfo>;
  private readonly _isReadOnly: boolean;

  constructor(elements: Array<IDocumentInfoState> = [], isReadOnly: boolean = false) {
    this._elements = DocumentInfo.from(elements || []);
    this._isReadOnly = isReadOnly;
  }

  public tryGet(key: DocumentInfoProfileKey): DocumentInfo {
    if (typeof key === 'number') {
      if ((key > (this._elements.length - 1)) || (key < 0)) {
        return DocumentInfo.null;
      }

      return this._elements[key];
    }

    if (typeof key === 'string') {
      return (this._elements.find((t => (t.uuid === key))) || DocumentInfo.null);
    }

    if ('uuid' in key) {
      return (this._elements.find((t => (t.uuid === key.uuid))) || DocumentInfo.null);
    }

    return DocumentInfo.null;
  }

  public get(key: DocumentInfoProfileKey): DocumentInfo {
    const element = this.tryGet(key);

    if (element.isNull) {
      throw new Error(`index out of range. the document info could not be found in the collection for the specified key (${key})`);
    }

    return element;
  }

  public includes(key: DocumentInfoProfileKey): boolean {
    return (!this.tryGet(key).isNull);
  }

  public push(elements: OneOrArray<DocumentInfoOrState>): OneOrArray<DocumentInfo> {
    if (this.isReadOnly) {
      throw new Error(`failed to add ${ENTITY_NAME} to collection. the collection is readonly.`);
    }

    return ((Array.isArray(elements) ? elements : [elements])).map((element) => {
      let item = this.tryGet(element.uuid);

      if (item.isNull) {
        item = ((element instanceof DocumentInfo) ? element : DocumentInfo.from(element));
        this._elements.push(item);
      }

      return item;
    })
  }

  public get isReadOnly(): boolean {
    return this._isReadOnly;
  }

  public get length(): number {
    return this._elements.length;
  }

  public get isEmpty(): boolean {
    return (this._elements.length === 0);
  }

  public setSyncStatus(value: PeristentStoreSyncStatus): DocumentInfoCollection {
    this._elements.forEach((t) => t.setSyncStatus(value));
    return this;
  }

  public get state(): Array<IDocumentInfoState> {
    return this._elements.map((e) => e.state);
  }

  public toString(): string {
    return JSON.stringify(this._elements.map((e) => e.toString(false)));
  }

  public forEach(fn: (value: DocumentInfo, index: number) => void) {
    this._elements.forEach(fn);
  }

  public find(predicate: (value: DocumentInfo) => boolean): DocumentInfo {
    return (this._elements.find(predicate) || DocumentInfo.null);
  }

  public filter(predicate: (value: DocumentInfo) => boolean): Array<DocumentInfo> {
    return (this._elements.filter(predicate) || []);
  }

  public map<T>(fn: (value: DocumentInfo) => any): Array<T> {
    return (this._elements.map(fn) || []);
  }

  public compareTo(other: DocumentInfoCollection): ComparisonItemResultCollection {
    return DocumentInfoCollection.compare(this, other);
  }

  public static toStates(values: Array<DocumentInfoOrState>): Array<IDocumentInfoState> {
    return (values || []).map((v) => DocumentInfo.toState(v));
  }

  public static compare(a: DocumentInfoCollection, b: DocumentInfoCollection): ComparisonItemResultCollection {
    const builder = (new ComparisonItemResultBuilder(`${ENTITY_NAME}Collection}`))
      .compare('items.length', a.length, b.length);

    a.forEach((ia) => {
      builder.append(ia.compareTo(b.tryGet(ia.uuid)));
    });

    return builder.result('differences-only');
  }
}