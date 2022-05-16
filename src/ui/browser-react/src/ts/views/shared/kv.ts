import { KVStore, KVStoreEntry, KV} from 'model-client';
export { KVStore, KVStoreEntry };
export type { KV };

export type AppKeys = ('app-title');

const kvstore = KVStore.current('ui');
kvstore.set('app-title', 'My App');

export const getValue = (key: AppKeys): KVStoreEntry => {
  return kvstore.get(key);
}

export const setValue = (key: (AppKeys | string), value: any, freeze: boolean = true, metaData?: KV): KVStoreEntry => {
  return kvstore.set(key, value, freeze, metaData);
}