import { CACHE_SCHEMA_VERSION } from '@/data/constants/cache';
import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';
import type { PokemonLocalDataSource } from '@/data/interfaces/PokemonDataSources';
import type { CacheEntry } from '@/data/types/CacheEntry';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';

const pageKey = (offset: number, limit: number) => `pokemon:page:${offset}:${limit}`;
const detailKey = (id: number) => `pokemon:detail:${id}`;

function isCurrentEntry<T>(value: unknown): value is CacheEntry<T> {
  if (typeof value !== 'object' || value === null) return false;
  const entry = value as Partial<CacheEntry<T>>;
  return (
    entry.schemaVersion === CACHE_SCHEMA_VERSION &&
    typeof entry.savedAt === 'number' &&
    entry.data !== undefined
  );
}

export class KeyValuePokemonLocalDataSource implements PokemonLocalDataSource {
  constructor(private readonly store: KeyValueStore) {}

  readPage(offset: number, limit: number): Promise<CacheEntry<PokemonPage> | null> {
    return this.read<PokemonPage>(pageKey(offset, limit));
  }

  writePage(offset: number, limit: number, page: PokemonPage, savedAt: number): Promise<void> {
    return this.write(pageKey(offset, limit), page, savedAt);
  }

  readDetail(id: number): Promise<CacheEntry<PokemonDetail> | null> {
    return this.read<PokemonDetail>(detailKey(id));
  }

  writeDetail(detail: PokemonDetail, savedAt: number): Promise<void> {
    return this.write(detailKey(detail.id), detail, savedAt);
  }

  private async read<T>(key: string): Promise<CacheEntry<T> | null> {
    const raw = await this.store.getItem(key);
    if (raw === null) return null;

    try {
      const parsed: unknown = JSON.parse(raw);
      if (isCurrentEntry<T>(parsed)) return parsed;
    } catch {}
    await this.store.removeItem(key);
    return null;
  }

  private write<T>(key: string, data: T, savedAt: number): Promise<void> {
    const entry: CacheEntry<T> = { schemaVersion: CACHE_SCHEMA_VERSION, savedAt, data };
    return this.store.setItem(key, JSON.stringify(entry));
  }
}
