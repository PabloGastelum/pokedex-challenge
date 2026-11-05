import { DependenciesProvider } from '@/presentation/context/DependenciesContext';
import { PokemonListProvider } from '@/presentation/context/PokemonListContext';

import type { AppProvidersProps } from './AppProviders.types';

export function AppProviders({ dependencies, children }: AppProvidersProps) {
  return (
    <DependenciesProvider dependencies={dependencies}>
      <PokemonListProvider>{children}</PokemonListProvider>
    </DependenciesProvider>
  );
}
