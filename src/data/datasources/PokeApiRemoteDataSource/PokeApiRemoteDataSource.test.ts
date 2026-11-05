import type { HttpClient } from '@/data/interfaces/HttpClient';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';

import { PokeApiRemoteDataSource } from './PokeApiRemoteDataSource';

const createHttp = (): jest.Mocked<HttpClient> => ({ getJson: jest.fn() });

describe('PokeApiRemoteDataSource', () => {
  it('pide la página con offset y límite y la mapea al dominio', async () => {
    const http = createHttp();
    http.getJson.mockResolvedValue({
      count: 100,
      next: 'siguiente',
      previous: null,
      results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
    });

    const page = await new PokeApiRemoteDataSource(http, 'https://img.test').fetchPage(20, 10);

    expect(http.getJson).toHaveBeenCalledWith('/pokemon?offset=20&limit=10');
    expect(page.items[0]).toEqual({
      id: 25,
      name: 'pikachu',
      imageUrl: 'https://img.test/25.png',
    });
    expect(page.nextOffset).toBe(21);
  });

  it('pide el detalle por id y lo mapea al dominio', async () => {
    const http = createHttp();
    http.getJson.mockResolvedValue({
      id: 25,
      name: 'pikachu',
      height: 4,
      weight: 60,
      base_experience: 112,
      types: [],
      abilities: [],
      stats: [],
      sprites: { front_default: 'p.png' },
    });

    const detail = await new PokeApiRemoteDataSource(http, 'https://img.test').fetchDetail(25);

    expect(http.getJson).toHaveBeenCalledWith('/pokemon/25');
    expect(detail).toMatchObject({ id: 25, heightInDecimetres: 4, imageUrl: 'p.png' });
  });

  it('propaga los errores del cliente HTTP', async () => {
    const http = createHttp();
    http.getJson.mockRejectedValue(new AppError(AppErrorCode.NotFound, 'no existe'));

    await expect(
      new PokeApiRemoteDataSource(http, 'https://img.test').fetchDetail(1),
    ).rejects.toMatchObject({
      code: AppErrorCode.NotFound,
    });
  });

  it('rechaza una respuesta con forma inesperada', async () => {
    const http = createHttp();
    http.getJson.mockResolvedValue({ inesperado: true });

    await expect(
      new PokeApiRemoteDataSource(http, 'https://img.test').fetchPage(0, 20),
    ).rejects.toMatchObject({
      code: AppErrorCode.InvalidData,
    });
  });
});
