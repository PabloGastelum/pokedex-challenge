import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import { AppError } from '@/domain/errors/AppError';
import { DependenciesProvider } from '@/presentation/context/DependenciesContext';
import { PokemonListProvider } from '@/presentation/context/PokemonListContext';
import { createDependencies, createPage, deferred, networkResult } from '@/presentation/test-utils';
import { STALE_DATA_MESSAGE } from '@/presentation/utils/labels';

import { PokemonListScreen } from './PokemonListScreen';

jest.mock('expo-router', () => ({ useRouter: jest.fn() }));

function setup() {
  const dependencies = createDependencies();
  const mount = () =>
    render(
      <DependenciesProvider dependencies={dependencies}>
        <PokemonListProvider>
          <PokemonListScreen />
        </PokemonListProvider>
      </DependenciesProvider>,
    );
  return { execute: dependencies.getPokemonPage.execute, mount };
}

async function scrollToEnd() {
  const list = screen.getByTestId('pokemon-list');
  await fireEvent(list, 'layout', { nativeEvent: { layout: { width: 400, height: 800 } } });
  await fireEvent(list, 'contentSizeChange', 400, 1000);
  await fireEvent.scroll(list, {
    nativeEvent: {
      contentOffset: { x: 0, y: 200 },
      contentSize: { width: 400, height: 1000 },
      layoutMeasurement: { width: 400, height: 800 },
    },
  });
}

describe('PokemonListScreen', () => {
  const push = jest.fn();

  beforeEach(() => {
    push.mockClear();
    jest.mocked(useRouter).mockReturnValue({ push } as unknown as ReturnType<typeof useRouter>);
  });

  it('muestra el título y el indicador de carga mientras espera', async () => {
    const { execute, mount } = setup();
    execute.mockReturnValue(deferred().promise);

    await mount();

    expect(screen.getByRole('header', { name: 'Pokédex' })).toBeTruthy();
    expect(screen.getByLabelText('Cargando Pokémon')).toBeTruthy();
  });

  it('muestra los primeros Pokémon con nombre y número', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValue(networkResult(createPage([1, 2], 20)));

    await mount();

    expect(await screen.findByText('Poke 1')).toBeTruthy();
    expect(screen.getByText('#002')).toBeTruthy();
    expect(screen.getByText('100 Pokémon')).toBeTruthy();
    expect(execute).toHaveBeenCalledWith({ offset: 0, limit: 20 });
  });

  it('navega al detalle al tocar un Pokémon', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValue(networkResult(createPage([1], null)));

    await mount();
    await fireEvent.press(await screen.findByRole('button', { name: 'Poke 1, número 1' }));

    expect(push).toHaveBeenCalledWith({ pathname: '/pokemon/[id]', params: { id: 1 } });
  });

  it('muestra un error amigable y permite reintentar', async () => {
    const { execute, mount } = setup();
    execute.mockRejectedValueOnce(new AppError(AppErrorCode.Network, 'x'));
    execute.mockResolvedValueOnce(networkResult(createPage([1], null)));

    await mount();
    expect(await screen.findByText('Sin conexión')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByText('Poke 1')).toBeTruthy();
  });

  it('muestra el estado vacío y permite volver a cargar', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValueOnce(networkResult(createPage([], null)));
    execute.mockResolvedValueOnce(networkResult(createPage([1], null)));

    await mount();
    expect(await screen.findByText('No hay Pokémon para mostrar')).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Volver a cargar' }));

    expect(await screen.findByText('Poke 1')).toBeTruthy();
  });

  it('pide la siguiente página al llegar al final', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValueOnce(networkResult(createPage([1, 2], 20)));
    execute.mockResolvedValueOnce(networkResult(createPage([3], null)));
    await mount();
    await screen.findByText('Poke 1');

    await scrollToEnd();

    await waitFor(() => expect(execute).toHaveBeenLastCalledWith({ offset: 20, limit: 20 }));
    expect(await screen.findByText('Poke 3')).toBeTruthy();
  });

  it('si falla la paginación conserva la lista, no reintenta sola y ofrece reintentar', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValueOnce(networkResult(createPage([1, 2], 20)));
    execute.mockRejectedValueOnce(new AppError(AppErrorCode.Network, 'sin red'));
    execute.mockResolvedValueOnce(networkResult(createPage([3], null)));
    await mount();
    await screen.findByText('Poke 1');

    await scrollToEnd();
    const retry = await screen.findByRole('button', { name: 'Reintentar' });
    expect(screen.getByText('Poke 1')).toBeTruthy();

    await scrollToEnd();
    expect(execute).toHaveBeenCalledTimes(2);

    await fireEvent.press(retry);

    expect(await screen.findByText('Poke 3')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Reintentar' })).toBeNull();
  });

  it('refrescar fuerza la red y reemplaza la lista', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValueOnce(networkResult(createPage([1], null)));
    execute.mockResolvedValueOnce(networkResult(createPage([9], null)));
    await mount();
    await screen.findByText('Poke 1');

    const { refreshControl } = screen.getByTestId('pokemon-list').props;
    await act(() => refreshControl.props.onRefresh());

    expect(execute).toHaveBeenLastCalledWith({ offset: 0, limit: 20, forceRefresh: true });
    expect(await screen.findByText('Poke 9')).toBeTruthy();
  });

  it('avisa cuando los datos son guardados', async () => {
    const { execute, mount } = setup();
    execute.mockResolvedValue({
      data: createPage([1], null),
      origin: DataOrigin.Cache,
      isStale: true,
    });

    await mount();

    expect(await screen.findByText(STALE_DATA_MESSAGE)).toBeTruthy();
  });
});
