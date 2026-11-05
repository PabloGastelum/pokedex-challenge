import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type { GetPokemonPageUseCase } from '@/domain/interfaces/PokemonUseCases';
import type { PokemonPage } from '@/domain/models/Pokemon';
import type { PokemonPageQuery, RepositoryResult } from '@/domain/types/RepositoryTypes';

export class GetPokemonPage implements GetPokemonPageUseCase {
  constructor(private readonly repository: PokemonRepository) {}

  execute(query: PokemonPageQuery): Promise<RepositoryResult<PokemonPage>> {
    if (!Number.isInteger(query.offset) || query.offset < 0) {
      return Promise.reject(new AppError(AppErrorCode.InvalidData, 'Offset inválido'));
    }
    if (!Number.isInteger(query.limit) || query.limit <= 0) {
      return Promise.reject(new AppError(AppErrorCode.InvalidData, 'Límite inválido'));
    }
    return this.repository.getPage(query);
  }
}
