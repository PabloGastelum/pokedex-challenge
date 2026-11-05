import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type PropsWithChildren,
} from 'react';

import { AppError } from '@/domain/errors/AppError';
import type { PokemonPageQuery } from '@/domain/types/RepositoryTypes';
import { useDependencies } from '@/presentation/context/DependenciesContext';

import { initialPokemonListState, pokemonListReducer } from './PokemonListContext.reducer';
import type { PokemonListActions, PokemonListState } from './PokemonListContext.types';

export const POKEMON_PAGE_SIZE = 20;

const PokemonListStateContext = createContext<PokemonListState | null>(null);
const PokemonListActionsContext = createContext<PokemonListActions | null>(null);

export function PokemonListProvider({ children }: PropsWithChildren) {
  const { getPokemonPage } = useDependencies();
  const [state, dispatch] = useReducer(pokemonListReducer, initialPokemonListState);

  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const requestId = useRef(0);
  const isPaging = useRef(false);

  const reload = useCallback(async () => {
    const id = ++requestId.current;
    isPaging.current = false;
    dispatch({ type: 'load/started' });
    try {
      const { data, isStale } = await getPokemonPage.execute({
        offset: 0,
        limit: POKEMON_PAGE_SIZE,
      });
      if (id === requestId.current) dispatch({ type: 'page/replaced', page: data, isStale });
    } catch (error) {
      if (id === requestId.current) dispatch({ type: 'load/failed', error: AppError.from(error) });
    }
  }, [getPokemonPage]);

  const runPaging = useCallback(
    async (paging: 'refreshing' | 'loadingMore', query: PokemonPageQuery) => {
      if (isPaging.current) return;
      isPaging.current = true;

      const id = ++requestId.current;
      dispatch({ type: 'paging/started', paging });
      try {
        const { data, isStale } = await getPokemonPage.execute(query);
        if (id !== requestId.current) return;
        const type = paging === 'refreshing' ? 'page/replaced' : 'page/appended';
        dispatch({ type, page: data, isStale });
      } catch (error) {
        if (id === requestId.current) {
          dispatch({ type: 'paging/failed', error: AppError.from(error) });
        }
      } finally {
        if (id === requestId.current) isPaging.current = false;
      }
    },
    [getPokemonPage],
  );

  const refresh = useCallback(async () => {
    if (stateRef.current.status !== 'ready') return;
    await runPaging('refreshing', { offset: 0, limit: POKEMON_PAGE_SIZE, forceRefresh: true });
  }, [runPaging]);

  const loadMore = useCallback(async () => {
    const current = stateRef.current;
    if (current.status !== 'ready' || current.nextOffset === null) return;
    await runPaging('loadingMore', { offset: current.nextOffset, limit: POKEMON_PAGE_SIZE });
  }, [runPaging]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const actions = useMemo(() => ({ reload, refresh, loadMore }), [reload, refresh, loadMore]);

  return (
    <PokemonListActionsContext.Provider value={actions}>
      <PokemonListStateContext.Provider value={state}>{children}</PokemonListStateContext.Provider>
    </PokemonListActionsContext.Provider>
  );
}

export function usePokemonListState(): PokemonListState {
  const state = useContext(PokemonListStateContext);
  if (!state) throw new Error('usePokemonListState requiere un PokemonListProvider');
  return state;
}

export function usePokemonListActions(): PokemonListActions {
  const actions = useContext(PokemonListActionsContext);
  if (!actions) throw new Error('usePokemonListActions requiere un PokemonListProvider');
  return actions;
}
