import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type { PokemonDetail } from '@/domain/models/Pokemon';

import { GetPokemonDetail } from './GetPokemonDetail';

const result = { data: { id: 1 } as PokemonDetail, origin: DataOrigin.Cache, isStale: false };

const createRepository = (): jest.Mocked<PokemonRepository> => ({
  getPage: jest.fn(),
  getDetail: jest.fn().mockResolvedValue(result),
});

describe('GetPokemonDetail', () => {
  it('delega un id válido al repositorio', async () => {
    const repository = createRepository();

    await expect(new GetPokemonDetail(repository).execute(1)).resolves.toBe(result);
    expect(repository.getDetail).toHaveBeenCalledWith(1);
  });

  it.each([0, -3, 1.5, Number.NaN])('trata el id %s como no encontrado', async (id) => {
    const repository = createRepository();

    await expect(new GetPokemonDetail(repository).execute(id)).rejects.toMatchObject({
      code: AppErrorCode.NotFound,
    });
    expect(repository.getDetail).not.toHaveBeenCalled();
  });
});
