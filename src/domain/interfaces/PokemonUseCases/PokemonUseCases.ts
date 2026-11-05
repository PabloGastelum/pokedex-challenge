import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';
import type { PokemonPageQuery, RepositoryResult } from '@/domain/types/RepositoryTypes';

export interface GetPokemonPageUseCase {
  execute(query: PokemonPageQuery): Promise<RepositoryResult<PokemonPage>>;
}

export interface GetPokemonDetailUseCase {
  execute(id: number): Promise<RepositoryResult<PokemonDetail>>;
}
