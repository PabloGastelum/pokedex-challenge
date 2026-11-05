import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { createPage } from '@/presentation/test-utils';

import { initialPokemonListState, pokemonListReducer } from './PokemonListContext.reducer';

const error = new AppError(AppErrorCode.Network, 'sin red');

const ready = () =>
  pokemonListReducer(initialPokemonListState, {
    type: 'page/replaced',
    page: createPage([1, 2], 20),
    isStale: false,
  });

const ids = (state: ReturnType<typeof ready>) =>
  state.status === 'ready' ? state.items.map(({ id }) => id) : [];

describe('pokemonListReducer', () => {
  it('pasa de cargando a listo', () => {
    expect(ready()).toMatchObject({
      status: 'ready',
      nextOffset: 20,
      totalCount: 100,
      paging: 'idle',
    });
  });

  it('pasa de cargando a error', () => {
    const state = pokemonListReducer(initialPokemonListState, { type: 'load/failed', error });

    expect(state).toEqual({ status: 'error', error });
  });

  it('una recarga vuelve a cargando desde cualquier estado', () => {
    expect(pokemonListReducer(ready(), { type: 'load/started' })).toEqual({ status: 'loading' });
  });

  it('agrega una página sin repetir ids', () => {
    const state = pokemonListReducer(ready(), {
      type: 'page/appended',
      page: createPage([2, 3], null),
      isStale: false,
    });

    expect(state).toMatchObject({ nextOffset: null });
    expect(ids(state)).toEqual([1, 2, 3]);
  });

  it('una página guardada marca toda la lista como stale', () => {
    const state = pokemonListReducer(ready(), {
      type: 'page/appended',
      page: createPage([3], 21),
      isStale: true,
    });

    expect(state).toMatchObject({ isStale: true });
  });

  it('una página de red no borra la marca de stale de la lista', () => {
    const stale = pokemonListReducer(ready(), {
      type: 'page/appended',
      page: createPage([3], 21),
      isStale: true,
    });
    const state = pokemonListReducer(stale, {
      type: 'page/appended',
      page: createPage([4], 22),
      isStale: false,
    });

    expect(state).toMatchObject({ isStale: true });
  });

  it('empezar a paginar limpia el error anterior', () => {
    const failed = pokemonListReducer(ready(), { type: 'paging/failed', error });
    const state = pokemonListReducer(failed, { type: 'paging/started', paging: 'loadingMore' });

    expect(state).toMatchObject({ paging: 'loadingMore', pagingError: null });
  });

  it('un error de paginación conserva la lista', () => {
    const loadingMore = pokemonListReducer(ready(), {
      type: 'paging/started',
      paging: 'loadingMore',
    });
    const state = pokemonListReducer(loadingMore, { type: 'paging/failed', error });

    expect(state).toMatchObject({ status: 'ready', paging: 'idle', pagingError: error });
    expect(ids(state)).toEqual([1, 2]);
  });

  it('refrescar reemplaza la lista y limpia el error y la marca de stale', () => {
    const stale = pokemonListReducer(initialPokemonListState, {
      type: 'page/replaced',
      page: createPage([1], 20),
      isStale: true,
    });
    const failed = pokemonListReducer(stale, { type: 'paging/failed', error });
    const state = pokemonListReducer(failed, {
      type: 'page/replaced',
      page: createPage([9], 20),
      isStale: false,
    });

    expect(state).toMatchObject({ pagingError: null, isStale: false });
    expect(ids(state)).toEqual([9]);
  });

  it.each([
    { type: 'page/appended', page: createPage([1], null), isStale: false },
    { type: 'paging/started', paging: 'loadingMore' },
    { type: 'paging/failed', error },
  ] as const)('ignora $type si la lista no está lista', (action) => {
    expect(pokemonListReducer(initialPokemonListState, action)).toBe(initialPokemonListState);
  });
});
