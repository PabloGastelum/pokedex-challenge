import { renderHook } from '@testing-library/react-native';
import type { PropsWithChildren } from 'react';

import { DependenciesProvider, useDependencies } from './DependenciesContext';
import type { AppDependencies } from './DependenciesContext.types';

describe('DependenciesContext', () => {
  it('entrega las dependencias recibidas', async () => {
    const dependencies: AppDependencies = {
      getPokemonPage: { execute: jest.fn() },
      getPokemonDetail: { execute: jest.fn() },
    };
    const wrapper = ({ children }: PropsWithChildren) => (
      <DependenciesProvider dependencies={dependencies}>{children}</DependenciesProvider>
    );

    const { result } = await renderHook(() => useDependencies(), { wrapper });

    expect(result.current).toBe(dependencies);
  });

  it('falla con un mensaje claro si falta el provider', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    await expect(renderHook(() => useDependencies())).rejects.toThrow(
      'useDependencies requiere un DependenciesProvider',
    );

    jest.restoreAllMocks();
  });
});
