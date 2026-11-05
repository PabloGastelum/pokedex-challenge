import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import type { PokemonRepository } from '@/domain/interfaces/PokemonRepository';
import type { PokemonPage } from '@/domain/models/Pokemon';

import { GetPokemonPage } from './GetPokemonPage';

const result = {
  data: { items: [], nextOffset: null, totalCount: 0 } satisfies PokemonPage,
  origin: DataOrigin.Network,
  isStale: false,
};

const createRepository = (): jest.Mocked<PokemonRepository> => ({
  getPage: jest.fn().mockResolvedValue(result),
  getDetail: jest.fn(),
});

describe('GetPokemonPage', () => {
  it('delega una consulta válida al repositorio', async () => {
    const repository = createRepository();
    const query = { offset: 20, limit: 20, forceRefresh: true };

    await expect(new GetPokemonPage(repository).execute(query)).resolves.toBe(result);
    expect(repository.getPage).toHaveBeenCalledWith(query);
  });

  it('acepta el offset cero', async () => {
    const repository = createRepository();

    await new GetPokemonPage(repository).execute({ offset: 0, limit: 20 });

    expect(repository.getPage).toHaveBeenCalledTimes(1);
  });

  it.each([
    { offset: -1, limit: 20 },
    { offset: 1.5, limit: 20 },
    { offset: Number.NaN, limit: 20 },
    { offset: 0, limit: 0 },
    { offset: 0, limit: -5 },
    { offset: 0, limit: 2.5 },
  ])('rechaza la consulta inválida %j sin tocar el repositorio', async (query) => {
    const repository = createRepository();

    await expect(new GetPokemonPage(repository).execute(query)).rejects.toMatchObject({
      code: AppErrorCode.InvalidData,
    });
    expect(repository.getPage).not.toHaveBeenCalled();
  });
});
