export interface CacheEntry<T> {
  readonly schemaVersion: number;
  readonly savedAt: number;
  readonly data: T;
}
