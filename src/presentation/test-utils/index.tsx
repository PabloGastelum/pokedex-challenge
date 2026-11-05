import type { PropsWithChildren } from 'react';

import { DataOrigin } from '@/domain/enums/DataOrigin';
import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';
import type { RepositoryResult } from '@/domain/types/RepositoryTypes';
import { DependenciesProvider } from '@/presentation/context/DependenciesContext';

export const createPage = (ids: number[], nextOffset: number | null): PokemonPage => ({
  items: ids.map((id) => ({ id, name: `poke-${id}`, imageUrl: `${id}.png` })),
  nextOffset,
  totalCount: 100,
});

export const createDetail = (overrides: Partial<PokemonDetail> = {}): PokemonDetail => ({
  id: 1,
  name: 'bulbasaur',
  imageUrl: '1.png',
  types: [PokemonTypeName.Grass, PokemonTypeName.Poison],
  abilities: [
    { name: 'overgrow', isHidden: false },
    { name: 'chlorophyll', isHidden: true },
  ],
  stats: [
    { name: StatName.Hp, value: 45 },
    { name: StatName.Attack, value: 49 },
  ],
  heightInDecimetres: 7,
  weightInHectograms: 69,
  baseExperience: 64,
  ...overrides,
});

export const networkResult = <T,>(data: T): RepositoryResult<T> => ({
  data,
  origin: DataOrigin.Network,
  isStale: false,
});

export const createDependencies = () => ({
  getPokemonPage: { execute: jest.fn() },
  getPokemonDetail: { execute: jest.fn() },
});

export const createWrapper = (dependencies: ReturnType<typeof createDependencies>) =>
  function Wrapper({ children }: PropsWithChildren) {
    return <DependenciesProvider dependencies={dependencies}>{children}</DependenciesProvider>;
  };

export function deferred<T = unknown>() {
  let resolve: (value: T) => void = () => undefined;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}
