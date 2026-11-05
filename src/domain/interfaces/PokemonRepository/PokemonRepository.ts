import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';
import type { PokemonPageQuery, RepositoryResult } from '@/domain/types/RepositoryTypes';

export interface PokemonRepository {
  getPage(query: PokemonPageQuery): Promise<RepositoryResult<PokemonPage>>;
  getDetail(id: number): Promise<RepositoryResult<PokemonDetail>>;
}
