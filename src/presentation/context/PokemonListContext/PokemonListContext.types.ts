import type { AppError } from '@/domain/errors/AppError';
import type { PokemonPage, PokemonSummary } from '@/domain/models/Pokemon';

export type PagingStatus = 'idle' | 'refreshing' | 'loadingMore';

export type PokemonListState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: AppError }
  | {
      readonly status: 'ready';
      readonly items: readonly PokemonSummary[];
      readonly nextOffset: number | null;
      readonly totalCount: number;
      readonly isStale: boolean;
      readonly paging: PagingStatus;
      readonly pagingError: AppError | null;
    };

export type PokemonListAction =
  | { readonly type: 'load/started' }
  | { readonly type: 'load/failed'; readonly error: AppError }
  | { readonly type: 'page/replaced'; readonly page: PokemonPage; readonly isStale: boolean }
  | { readonly type: 'page/appended'; readonly page: PokemonPage; readonly isStale: boolean }
  | { readonly type: 'paging/started'; readonly paging: Exclude<PagingStatus, 'idle'> }
  | { readonly type: 'paging/failed'; readonly error: AppError };

export interface PokemonListActions {
  readonly reload: () => Promise<void>;
  readonly refresh: () => Promise<void>;
  readonly loadMore: () => Promise<void>;
}
