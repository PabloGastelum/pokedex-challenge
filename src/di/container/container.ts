import 'reflect-metadata';

import { Container } from 'inversify';

import { CACHE_TTL_MS } from '@/data/constants/cache';
import { KeyValuePokemonLocalDataSource } from '@/data/datasources/KeyValuePokemonLocalDataSource';
import { PokeApiRemoteDataSource } from '@/data/datasources/PokeApiRemoteDataSource';
import type { HttpClient } from '@/data/interfaces/HttpClient';
import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';
import type {
  PokemonLocalDataSource,
  PokemonRemoteDataSource,
} from '@/data/interfaces/PokemonDataSources';
import { PokemonRepositoryImpl } from '@/data/repositories/PokemonRepositoryImpl';
import { TOKENS } from '@/di/tokens';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type {
  GetPokemonDetailUseCase,
  GetPokemonPageUseCase,
} from '@/domain/interfaces/PokemonUseCases';
import { GetPokemonDetail } from '@/domain/usecases/GetPokemonDetail';
import { GetPokemonPage } from '@/domain/usecases/GetPokemonPage';
import { loadAppConfig, type AppConfig } from '@/infrastructure/config/AppConfig';
import { FetchHttpClient } from '@/infrastructure/http/FetchHttpClient';
import { SqliteKeyValueStore } from '@/infrastructure/storage/SqliteKeyValueStore';
import type { AppDependencies } from '@/presentation/context/DependenciesContext';

const REQUEST_TIMEOUT_MS = 10_000;

export function createContainer(): Container {
  const container = new Container({ defaultScope: 'Singleton' });

  container.bind<AppConfig>(TOKENS.AppConfig).toDynamicValue(() => loadAppConfig());

  container.bind<HttpClient>(TOKENS.HttpClient).toDynamicValue(
    ({ get }) =>
      new FetchHttpClient({
        baseUrl: get<AppConfig>(TOKENS.AppConfig).pokeApiBaseUrl,
        timeoutMs: REQUEST_TIMEOUT_MS,
      }),
  );
  container
    .bind<KeyValueStore>(TOKENS.KeyValueStore)
    .toDynamicValue(() => new SqliteKeyValueStore());

  container
    .bind<PokemonRemoteDataSource>(TOKENS.PokemonRemoteDataSource)
    .toDynamicValue(
      ({ get }) =>
        new PokeApiRemoteDataSource(
          get<HttpClient>(TOKENS.HttpClient),
          get<AppConfig>(TOKENS.AppConfig).artworkBaseUrl,
        ),
    );
  container
    .bind<PokemonLocalDataSource>(TOKENS.PokemonLocalDataSource)
    .toDynamicValue(
      ({ get }) => new KeyValuePokemonLocalDataSource(get<KeyValueStore>(TOKENS.KeyValueStore)),
    );

  container
    .bind<PokemonRepository>(TOKENS.PokemonRepository)
    .toDynamicValue(
      ({ get }) =>
        new PokemonRepositoryImpl(
          get<PokemonRemoteDataSource>(TOKENS.PokemonRemoteDataSource),
          get<PokemonLocalDataSource>(TOKENS.PokemonLocalDataSource),
          { ttlMs: CACHE_TTL_MS },
        ),
    );

  container
    .bind<GetPokemonPageUseCase>(TOKENS.GetPokemonPageUseCase)
    .toDynamicValue(
      ({ get }) => new GetPokemonPage(get<PokemonRepository>(TOKENS.PokemonRepository)),
    );
  container
    .bind<GetPokemonDetailUseCase>(TOKENS.GetPokemonDetailUseCase)
    .toDynamicValue(
      ({ get }) => new GetPokemonDetail(get<PokemonRepository>(TOKENS.PokemonRepository)),
    );

  return container;
}

export function resolveDependencies(container: Container): AppDependencies {
  return {
    getPokemonPage: container.get<GetPokemonPageUseCase>(TOKENS.GetPokemonPageUseCase),
    getPokemonDetail: container.get<GetPokemonDetailUseCase>(TOKENS.GetPokemonDetailUseCase),
  };
}
