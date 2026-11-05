export const TOKENS = {
  AppConfig: Symbol.for('AppConfig'),
  HttpClient: Symbol.for('HttpClient'),
  KeyValueStore: Symbol.for('KeyValueStore'),
  PokemonRemoteDataSource: Symbol.for('PokemonRemoteDataSource'),
  PokemonLocalDataSource: Symbol.for('PokemonLocalDataSource'),
  PokemonRepository: Symbol.for('PokemonRepository'),
  GetPokemonPageUseCase: Symbol.for('GetPokemonPageUseCase'),
  GetPokemonDetailUseCase: Symbol.for('GetPokemonDetailUseCase'),
} as const;
