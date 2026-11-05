import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type { GetPokemonDetailUseCase } from '@/domain/interfaces/PokemonUseCases';
import type { PokemonDetail } from '@/domain/models/Pokemon';
import type { RepositoryResult } from '@/domain/types/RepositoryTypes';

export class GetPokemonDetail implements GetPokemonDetailUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(id: number): Promise<RepositoryResult<PokemonDetail>> {
    if (!Number.isInteger(id) || id <= 0) {
      return Promise.reject(new AppError(AppErrorCode.NotFound, `Id de Pokémon inválido: ${id}`));
    }
    return this.repository.getDetail(id);
  }
}
