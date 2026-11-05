import type { CacheEntry } from '@/data/types/CacheEntry';

export interface PokemonRepositoryOptions {
  readonly ttlMs: number;
  readonly now?: () => number;
}

export interface ResolveSteps<T> {
  readonly read: () => Promise<CacheEntry<T> | null>;
  readonly fetch: () => Promise<T>;
  readonly write: (data: T, savedAt: number) => Promise<void>;
  readonly forceRefresh?: boolean;
}
