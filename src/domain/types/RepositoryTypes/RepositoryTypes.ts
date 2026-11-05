import { DataOrigin } from '@/domain/enums/DataOrigin';

export interface PokemonPageQuery {
  readonly offset: number;
  readonly limit: number;
  readonly forceRefresh?: boolean;
}

export interface RepositoryResult<T> {
  readonly data: T;
  readonly origin: DataOrigin;
  readonly isStale: boolean;
}
