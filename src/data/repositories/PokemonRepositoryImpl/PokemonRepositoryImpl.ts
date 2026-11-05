import type {
  PokemonLocalDataSource,
  PokemonRemoteDataSource,
} from '@/data/interfaces/PokemonDataSources';
import type { CacheEntry } from '@/data/types/CacheEntry';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import { AppError } from '@/domain/errors/AppError';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';
import type { PokemonPageQuery, RepositoryResult } from '@/domain/types/RepositoryTypes';

import type { PokemonRepositoryOptions, ResolveSteps } from './PokemonRepositoryImpl.types';

const RECOVERABLE_CODES = new Set([
  AppErrorCode.Network,
  AppErrorCode.Timeout,
  AppErrorCode.Server,
]);

export class PokemonRepositoryImpl implements PokemonRepository {
  private readonly ttlMs: number;
  private readonly now: () => number;

  constructor(
    private readonly remote: PokemonRemoteDataSource,
    private readonly local: PokemonLocalDataSource,
    options: PokemonRepositoryOptions,
  ) {
    this.ttlMs = options.ttlMs;
    this.now = options.now ?? Date.now;
  }

  getPage({
    offset,
    limit,
    forceRefresh,
  }: PokemonPageQuery): Promise<RepositoryResult<PokemonPage>> {
    return this.resolve({
      read: () => this.local.readPage(offset, limit),
      fetch: () => this.remote.fetchPage(offset, limit),
      write: (page, savedAt) => this.local.writePage(offset, limit, page, savedAt),
      forceRefresh,
    });
  }

  getDetail(id: number): Promise<RepositoryResult<PokemonDetail>> {
    return this.resolve({
      read: () => this.local.readDetail(id),
      fetch: () => this.remote.fetchDetail(id),
      write: (detail, savedAt) => this.local.writeDetail(detail, savedAt),
    });
  }

  private async resolve<T>(steps: ResolveSteps<T>): Promise<RepositoryResult<T>> {
    const cached = await this.readSafely(steps.read);

    if (cached && !steps.forceRefresh && this.isFresh(cached)) {
      return { data: cached.data, origin: DataOrigin.Cache, isStale: false };
    }

    let data: T;
    try {
      data = await steps.fetch();
    } catch (error) {
      const appError = AppError.from(error);
      if (cached && RECOVERABLE_CODES.has(appError.code)) {
        return { data: cached.data, origin: DataOrigin.Cache, isStale: true };
      }
      throw appError;
    }

    await this.writeSafely(() => steps.write(data, this.now()));
    return { data, origin: DataOrigin.Network, isStale: false };
  }

  private isFresh(entry: CacheEntry<unknown>): boolean {
    return this.now() - entry.savedAt < this.ttlMs;
  }

  private async readSafely<T>(read: () => Promise<CacheEntry<T> | null>) {
    try {
      return await read();
    } catch {
      return null;
    }
  }

  private async writeSafely(write: () => Promise<void>) {
    try {
      await write();
    } catch {}
  }
}
