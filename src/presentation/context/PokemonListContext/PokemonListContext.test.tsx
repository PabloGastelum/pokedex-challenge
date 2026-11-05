import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { DependenciesProvider } from '@/presentation/context/DependenciesContext';
import { createDependencies, createPage, deferred, networkResult } from '@/presentation/test-utils';

import {
  PokemonListProvider,
  usePokemonListActions,
  usePokemonListState,
} from './PokemonListContext';
import type { PokemonListState } from './PokemonListContext.types';

const networkError = () => new AppError(AppErrorCode.Network, 'sin red');

const ids = (state: PokemonListState) =>
  state.status === 'ready' ? state.items.map(({ id }) => id) : [];

function mount() {
  const dependencies = createDependencies();
  const execute = dependencies.getPokemonPage.execute;
  const wrapper = ({ children }: PropsWithChildren) => (
    <DependenciesProvider dependencies={dependencies}>
      <PokemonListProvider>{children}</PokemonListProvider>
    </DependenciesProvider>
  );
  const render = () =>
    renderHook(() => ({ state: usePokemonListState(), actions: usePokemonListActions() }), {
      wrapper,
    });
  return { execute, render };
}

async function setupReady() {
  const { execute, render } = mount();
  execute.mockResolvedValueOnce(networkResult(createPage([1, 2], 2)));
  const { result: hook } = await render();
  await waitFor(() => expect(hook.current.state.status).toBe('ready'));
  return { hook, execute };
}

describe('PokemonListProvider', () => {
  it('carga la primera página de 20 al montarse', async () => {
    const { hook, execute } = await setupReady();

    expect(execute).toHaveBeenCalledWith({ offset: 0, limit: 20 });
    expect(ids(hook.current.state)).toEqual([1, 2]);
  });

  it('muestra el error de la carga inicial y se recupera al recargar', async () => {
    const { execute, render } = mount();
    execute.mockRejectedValueOnce(networkError());
    const { result: hook } = await render();
    await waitFor(() => expect(hook.current.state.status).toBe('error'));

    execute.mockResolvedValueOnce(networkResult(createPage([1], null)));
    await act(() => hook.current.actions.reload());

    expect(ids(hook.current.state)).toEqual([1]);
  });

  it('agrega la siguiente página con el offset correcto', async () => {
    const { hook, execute } = await setupReady();
    execute.mockResolvedValueOnce(networkResult(createPage([3], null)));

    await act(() => hook.current.actions.loadMore());

    expect(execute).toHaveBeenLastCalledWith({ offset: 2, limit: 20 });
    expect(ids(hook.current.state)).toEqual([1, 2, 3]);
  });

  it('no duplica la petición si se pide cargar más dos veces seguidas', async () => {
    const { hook, execute } = await setupReady();
    execute.mockResolvedValueOnce(networkResult(createPage([3], 3)));

    await act(async () => {
      await Promise.all([hook.current.actions.loadMore(), hook.current.actions.loadMore()]);
    });

    expect(execute).toHaveBeenCalledTimes(2);
    expect(ids(hook.current.state)).toEqual([1, 2, 3]);
  });

  it('no pide más cuando ya no hay siguiente página', async () => {
    const { hook, execute } = await setupReady();
    execute.mockResolvedValueOnce(networkResult(createPage([3], null)));
    await act(() => hook.current.actions.loadMore());

    await act(() => hook.current.actions.loadMore());

    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('conserva la lista si falla cargar más y permite reintentar', async () => {
    const { hook, execute } = await setupReady();
    execute.mockRejectedValueOnce(networkError());

    await act(() => hook.current.actions.loadMore());

    expect(hook.current.state).toMatchObject({
      status: 'ready',
      pagingError: expect.any(AppError),
    });
    expect(ids(hook.current.state)).toEqual([1, 2]);

    execute.mockResolvedValueOnce(networkResult(createPage([3], null)));
    await act(() => hook.current.actions.loadMore());

    expect(hook.current.state).toMatchObject({ pagingError: null });
    expect(ids(hook.current.state)).toEqual([1, 2, 3]);
  });

  it('refrescar fuerza la red y reemplaza la lista', async () => {
    const { hook, execute } = await setupReady();
    execute.mockResolvedValueOnce(networkResult(createPage([9], 1)));

    await act(() => hook.current.actions.refresh());

    expect(execute).toHaveBeenLastCalledWith({ offset: 0, limit: 20, forceRefresh: true });
    expect(ids(hook.current.state)).toEqual([9]);
  });

  it('si refrescar falla conserva la lista con el error', async () => {
    const { hook, execute } = await setupReady();
    execute.mockRejectedValueOnce(networkError());

    await act(() => hook.current.actions.refresh());

    expect(ids(hook.current.state)).toEqual([1, 2]);
    expect(hook.current.state).toMatchObject({ pagingError: { code: AppErrorCode.Network } });
  });

  it('no refresca ni pagina mientras la carga inicial sigue en curso', async () => {
    const { execute, render } = mount();
    execute.mockReturnValue(deferred().promise);
    const { result: hook } = await render();

    await act(() => hook.current.actions.refresh());
    await act(() => hook.current.actions.loadMore());

    expect(execute).toHaveBeenCalledTimes(1);
  });

  it('una recarga descarta la página que venía en camino', async () => {
    const { hook, execute } = await setupReady();
    const slowPage = deferred<ReturnType<typeof networkResult>>();
    execute.mockReturnValueOnce(slowPage.promise);
    execute.mockResolvedValueOnce(networkResult(createPage([7], null)));

    let pendingLoadMore: Promise<void> = Promise.resolve();
    await act(async () => {
      pendingLoadMore = hook.current.actions.loadMore();
    });
    await act(() => hook.current.actions.reload());
    await act(async () => {
      slowPage.resolve(networkResult(createPage([3], null)));
      await pendingLoadMore;
    });

    expect(ids(hook.current.state)).toEqual([7]);
  });

  it('una recarga descarta el error de la carga anterior', async () => {
    const { execute, render } = mount();
    let rejectFirst: (error: unknown) => void = () => undefined;
    execute.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectFirst = reject;
      }),
    );
    execute.mockResolvedValueOnce(networkResult(createPage([1], null)));
    const { result: hook } = await render();

    await act(() => hook.current.actions.reload());
    await act(async () => rejectFirst(networkError()));

    expect(hook.current.state).toMatchObject({ status: 'ready' });
    expect(ids(hook.current.state)).toEqual([1]);
  });

  it('una recarga descarta el error de la paginación en curso y libera el candado', async () => {
    const { hook, execute } = await setupReady();
    let rejectPage: (error: unknown) => void = () => undefined;
    execute.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectPage = reject;
      }),
    );
    execute.mockResolvedValueOnce(networkResult(createPage([7], 1)));

    let pendingLoadMore: Promise<void> = Promise.resolve();
    await act(async () => {
      pendingLoadMore = hook.current.actions.loadMore();
    });
    await act(() => hook.current.actions.reload());
    await act(async () => {
      rejectPage(networkError());
      await pendingLoadMore;
    });

    expect(hook.current.state).toMatchObject({ status: 'ready', pagingError: null });

    execute.mockResolvedValueOnce(networkResult(createPage([8], null)));
    await act(() => hook.current.actions.loadMore());

    expect(ids(hook.current.state)).toEqual([7, 8]);
  });

  it('no refresca mientras otra paginación está en curso', async () => {
    const { hook, execute } = await setupReady();
    const slowPage = deferred<ReturnType<typeof networkResult>>();
    execute.mockReturnValueOnce(slowPage.promise);

    let pendingLoadMore: Promise<void> = Promise.resolve();
    await act(async () => {
      pendingLoadMore = hook.current.actions.loadMore();
    });
    await act(() => hook.current.actions.refresh());

    expect(execute).toHaveBeenCalledTimes(2);

    await act(async () => {
      slowPage.resolve(networkResult(createPage([3], null)));
      await pendingLoadMore;
    });
  });

  it.each([
    ['usePokemonListState', usePokemonListState],
    ['usePokemonListActions', usePokemonListActions],
  ] as const)('%s falla con un mensaje claro sin provider', async (name, hook) => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(renderHook(() => hook())).rejects.toThrow(
      `${name} requiere un PokemonListProvider`,
    );

    jest.restoreAllMocks();
  });
});
