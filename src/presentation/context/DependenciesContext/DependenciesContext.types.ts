import type { PropsWithChildren } from 'react';

import type {
  GetPokemonDetailUseCase,
  GetPokemonPageUseCase,
} from '@/domain/interfaces/PokemonUseCases';

export interface AppDependencies {
  readonly getPokemonPage: GetPokemonPageUseCase;
  readonly getPokemonDetail: GetPokemonDetailUseCase;
}

export type DependenciesProviderProps = PropsWithChildren<{
  readonly dependencies: AppDependencies;
}>;
