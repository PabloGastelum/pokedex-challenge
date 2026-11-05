import Storage from 'expo-sqlite/kv-store';

import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';

export class SqliteKeyValueStore implements KeyValueStore {
  getItem(key: string): Promise<string | null> {
    return Storage.getItem(key);
  }

  async setItem(key: string, value: string): Promise<void> {
    await Storage.setItem(key, value);
  }

  async removeItem(key: string): Promise<void> {
    await Storage.removeItem(key);
  }
}
