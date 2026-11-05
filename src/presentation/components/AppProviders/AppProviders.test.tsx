import { render, renderHook, screen, waitFor } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';
import { Text } from 'react-native';

import { useDependencies } from '@/presentation/context/DependenciesContext';
import { usePokemonListState } from '@/presentation/context/PokemonListContext';
import { createDependencies, createPage, networkResult } from '@/presentation/test-utils';

import { AppProviders } from './AppProviders';

function setup() {
  const dependencies = createDependencies();
  dependencies.getPokemonPage.execute.mockResolvedValue(networkResult(createPage([1], null)));
  const wrapper = ({ children }: PropsWithChildren) => (
    <AppProviders dependencies={dependencies}>{children}</AppProviders>
  );
  return { dependencies, wrapper };
}

describe('AppProviders', () => {
  it('muestra su contenido', async () => {
    const { wrapper: Wrapper } = setup();

    await render(
      <Wrapper>
        <Text>Contenido</Text>
      </Wrapper>,
    );

    expect(screen.getByText('Contenido')).toBeTruthy();
  });

  it('entrega las dependencias recibidas', async () => {
    const { dependencies, wrapper } = setup();

    const { result } = await renderHook(() => useDependencies(), { wrapper });

    expect(result.current).toBe(dependencies);
  });

  it('conecta el listado con sus casos de uso y lo carga', async () => {
    const { dependencies, wrapper } = setup();

    const { result } = await renderHook(() => usePokemonListState(), { wrapper });

    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(dependencies.getPokemonPage.execute).toHaveBeenCalledTimes(1);
  });
});
