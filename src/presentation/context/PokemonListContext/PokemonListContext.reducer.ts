import type { PokemonSummary } from '@/domain/models/Pokemon';

import type { PokemonListAction, PokemonListState } from './PokemonListContext.types';

export const initialPokemonListState: PokemonListState = { status: 'loading' };

function mergeUnique(
  current: readonly PokemonSummary[],
  incoming: readonly PokemonSummary[],
): readonly PokemonSummary[] {
  const seen = new Set(current.map(({ id }) => id));
  return [...current, ...incoming.filter(({ id }) => !seen.has(id))];
}

export function pokemonListReducer(
  state: PokemonListState,
  action: PokemonListAction,
): PokemonListState {
  switch (action.type) {
    case 'load/started':
      return { status: 'loading' };
    case 'load/failed':
      return { status: 'error', error: action.error };
    case 'page/replaced':
      return {
        status: 'ready',
        items: action.page.items,
        nextOffset: action.page.nextOffset,
        totalCount: action.page.totalCount,
        isStale: action.isStale,
        paging: 'idle',
        pagingError: null,
      };
    case 'page/appended':
      if (state.status !== 'ready') return state;
      return {
        ...state,
        items: mergeUnique(state.items, action.page.items),
        nextOffset: action.page.nextOffset,
        totalCount: action.page.totalCount,
        isStale: state.isStale || action.isStale,
        paging: 'idle',
        pagingError: null,
      };
    case 'paging/started':
      if (state.status !== 'ready') return state;
      return { ...state, paging: action.paging, pagingError: null };
    case 'paging/failed':
      if (state.status !== 'ready') return state;
      return { ...state, paging: 'idle', pagingError: action.error };
  }
}
