import { fireEvent, render, screen } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { DependenciesProvider } from '@/presentation/context/DependenciesContext';
import {
  createDependencies,
  createDetail,
  deferred,
  networkResult,
} from '@/presentation/test-utils';

import { PokemonDetailScreen } from './PokemonDetailScreen';

jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: jest.fn(() => ({ canGoBack: () => true, back: jest.fn(), replace: jest.fn() })),
}));

function setup(id: string | undefined = '1') {
  jest.mocked(useLocalSearchParams).mockReturnValue(id === undefined ? {} : { id });
  const dependencies = createDependencies();
  const mount = () =>
    render(
      <DependenciesProvider dependencies={dependencies}>
        <PokemonDetailScreen />
      </DependenciesProvider>,
    );
  return { execute: dependencies.getPokemonDetail.execute, mount };
}

describe('PokemonDetailScreen', () => {
  it('muestra la carga mientras espera', async () => {
    const { execute, mount } = setup();
    execute.mockReturnValue(deferred().promise);

    await mount();

    expect(screen.getByLabelText('Cargando ficha')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeTruthy();
  });

  it('convierte el id de la ruta y muestra la información', async () => {
    const { execute, mount } = setup('25');
    execute.mockResolvedValue(networkResult(createDetail({ id: 25, name: 'pikachu' })));

    await mount();

    expect(await screen.findByRole('header', { name: 'Pikachu' })).toBeTruthy();
    expect(execute).toHaveBeenCalledWith(25);
  });

  it('muestra el error y reintenta', async () => {
    const { execute, mount } = setup();
    execute.mockRejectedValueOnce(new AppError(AppErrorCode.Timeout, 'x'));
    execute.mockResolvedValueOnce(networkResult(createDetail()));

    await mount();
    expect(await screen.findByText('La respuesta tardó demasiado')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Volver' })).toBeTruthy();

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(await screen.findByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
  });

  it('pasa un id inválido al caso de uso, que lo trata como no encontrado', async () => {
    const { execute, mount } = setup('no-es-numero');
    execute.mockRejectedValue(new AppError(AppErrorCode.NotFound, 'x'));

    await mount();

    expect(await screen.findByText('Pokémon no encontrado')).toBeTruthy();
    expect(execute).toHaveBeenCalledWith(Number.NaN);
  });
});
