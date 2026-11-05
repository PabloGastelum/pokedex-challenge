import { act, renderHook, waitFor } from '@testing-library/react-native';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import { AppError } from '@/domain/errors/AppError';
import {
  createDependencies,
  createDetail,
  createWrapper,
  deferred,
  networkResult,
} from '@/presentation/test-utils';

import { usePokemonDetail } from './usePokemonDetail';

function setup() {
  const dependencies = createDependencies();
  const wrapper = createWrapper(dependencies);
  const execute = dependencies.getPokemonDetail.execute;
  return { execute, wrapper };
}

describe('usePokemonDetail', () => {
  it('pasa de cargando a listo', async () => {
    const { execute, wrapper } = setup();
    execute.mockResolvedValue(networkResult(createDetail()));

    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(execute).toHaveBeenCalledWith(1);
    expect(result.current).toMatchObject({ detail: { id: 1 }, isStale: false });
  });

  it('empieza cargando mientras no hay respuesta', async () => {
    const { execute, wrapper } = setup();
    execute.mockReturnValue(deferred().promise);

    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });

    expect(result.current.status).toBe('loading');
  });

  it('informa cuando los datos son guardados', async () => {
    const { execute, wrapper } = setup();
    execute.mockResolvedValue({ data: createDetail(), origin: DataOrigin.Cache, isStale: true });

    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current).toMatchObject({ isStale: true }));
  });

  it('convierte un error desconocido en AppError', async () => {
    const { execute, wrapper } = setup();
    execute.mockRejectedValue(new Error('raro'));

    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('error'));
    expect(result.current).toMatchObject({ error: { code: AppErrorCode.Unknown } });
  });

  it('reintenta después de un error', async () => {
    const { execute, wrapper } = setup();
    execute.mockRejectedValueOnce(new AppError(AppErrorCode.Network, 'sin red'));
    execute.mockResolvedValueOnce(networkResult(createDetail()));
    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => result.current.retry());

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(execute).toHaveBeenCalledTimes(2);
  });

  it('ignora la respuesta del id anterior si cambia mientras carga', async () => {
    const { execute, wrapper } = setup();
    const first = deferred<ReturnType<typeof networkResult>>();
    execute.mockReturnValueOnce(first.promise);
    execute.mockResolvedValueOnce(networkResult(createDetail({ id: 2, name: 'ivysaur' })));
    const { result, rerender } = await renderHook(
      ({ id }: { id: number }) => usePokemonDetail(id),
      { wrapper, initialProps: { id: 1 } },
    );

    await rerender({ id: 2 });
    await waitFor(() => expect(result.current).toMatchObject({ detail: { id: 2 } }));
    await act(async () => first.resolve(networkResult(createDetail({ id: 1 }))));

    expect(result.current).toMatchObject({ detail: { id: 2 } });
  });

  it('ignora un error del id anterior si cambia mientras carga', async () => {
    const { execute, wrapper } = setup();
    let rejectFirst: (error: unknown) => void = () => undefined;
    execute.mockReturnValueOnce(
      new Promise((_, reject) => {
        rejectFirst = reject;
      }),
    );
    execute.mockResolvedValueOnce(networkResult(createDetail({ id: 2 })));
    const { result, rerender } = await renderHook(
      ({ id }: { id: number }) => usePokemonDetail(id),
      { wrapper, initialProps: { id: 1 } },
    );

    await rerender({ id: 2 });
    await waitFor(() => expect(result.current.status).toBe('ready'));
    await act(async () => rejectFirst(new Error('tarde')));

    expect(result.current).toMatchObject({ status: 'ready', detail: { id: 2 } });
  });

  it('vuelve a cargando al cambiar de id, sin mostrar el Pokémon anterior', async () => {
    const { execute, wrapper } = setup();
    execute.mockResolvedValueOnce(networkResult(createDetail({ id: 1 })));
    execute.mockReturnValueOnce(deferred().promise);
    const { result, rerender } = await renderHook(
      ({ id }: { id: number }) => usePokemonDetail(id),
      { wrapper, initialProps: { id: 1 } },
    );
    await waitFor(() => expect(result.current.status).toBe('ready'));

    await rerender({ id: 2 });

    expect(result.current.status).toBe('loading');
  });

  it('muestra cargando durante un reintento', async () => {
    const { execute, wrapper } = setup();
    execute.mockRejectedValueOnce(new AppError(AppErrorCode.Network, 'sin red'));
    execute.mockReturnValueOnce(deferred().promise);
    const { result } = await renderHook(() => usePokemonDetail(1), { wrapper });
    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => result.current.retry());

    expect(result.current.status).toBe('loading');
  });

  it('no actualiza el estado si se desmonta mientras carga', async () => {
    const { execute, wrapper } = setup();
    const pending = deferred<ReturnType<typeof networkResult>>();
    execute.mockReturnValue(pending.promise);
    const { result, unmount } = await renderHook(() => usePokemonDetail(1), { wrapper });
    const lastState = result.current;

    await unmount();
    await act(async () => pending.resolve(networkResult(createDetail())));

    expect(result.current).toBe(lastState);
  });
});
