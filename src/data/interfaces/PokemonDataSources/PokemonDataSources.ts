import type { CacheEntry } from '@/data/types/CacheEntry';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';

export interface PokemonRemoteDataSource {
  fetchPage(offset: number, limit: number): Promise<PokemonPage>;
  fetchDetail(id: number): Promise<PokemonDetail>;
}

export interface PokemonLocalDataSource {
  readPage(offset: number, limit: number): Promise<CacheEntry<PokemonPage> | null>;
  writePage(offset: number, limit: number, page: PokemonPage, savedAt: number): Promise<void>;
  readDetail(id: number): Promise<CacheEntry<PokemonDetail> | null>;
  writeDetail(detail: PokemonDetail, savedAt: number): Promise<void>;
}
