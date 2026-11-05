import { KeyValuePokemonLocalDataSource } from '@/data/datasources/KeyValuePokemonLocalDataSource';
import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';
import type { PokemonRemoteDataSource } from '@/data/interfaces/PokemonDataSources';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import { AppError } from '@/domain/errors/AppError';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';

import { PokemonRepositoryImpl } from './PokemonRepositoryImpl';

const TTL = 1000;
const NOW = 10_000;
const QUERY = { offset: 0, limit: 20 };

const page: PokemonPage = {
  items: [{ id: 1, name: 'bulbasaur', imageUrl: 'a.png' }],
  nextOffset: 20,
  totalCount: 1351,
};
const newerPage: PokemonPage = { ...page, totalCount: 1352 };
const detail: PokemonDetail = {
  id: 1,
  name: 'bulbasaur',
  imageUrl: 'a.png',
  types: [],
  abilities: [],
  stats: [],
  heightInDecimetres: 7,
  weightInHectograms: 69,
  baseExperience: 64,
};

class MemoryStore implements KeyValueStore {
  readonly items = new Map<string, string>();
  async getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  async setItem(key: string, value: string) {
    this.items.set(key, value);
  }
  async removeItem(key: string) {
    this.items.delete(key);
  }
}

function setup() {
  const store = new MemoryStore();
  const local = new KeyValuePokemonLocalDataSource(store);
  const remote: jest.Mocked<PokemonRemoteDataSource> = {
    fetchPage: jest.fn().mockResolvedValue(newerPage),
    fetchDetail: jest.fn().mockResolvedValue(detail),
  };
  const repository = new PokemonRepositoryImpl(remote, local, { ttlMs: TTL, now: () => NOW });
  return { store, local, remote, repository };
}

describe('PokemonRepositoryImpl', () => {
  it('sin caché consulta la red y guarda el resultado', async () => {
    const { repository, local } = setup();

    const result = await repository.getPage(QUERY);

    expect(result).toEqual({ data: newerPage, origin: DataOrigin.Network, isStale: false });
    await expect(local.readPage(0, 20)).resolves.toMatchObject({ savedAt: NOW, data: newerPage });
  });

  it('con caché vigente no usa la red', async () => {
    const { repository, local, remote } = setup();
    await local.writePage(0, 20, page, NOW - TTL + 1);

    const result = await repository.getPage(QUERY);

    expect(result).toEqual({ data: page, origin: DataOrigin.Cache, isStale: false });
    expect(remote.fetchPage).not.toHaveBeenCalled();
  });

  it('con caché vencida consulta la red', async () => {
    const { repository, local } = setup();
    await local.writePage(0, 20, page, NOW - TTL);

    const result = await repository.getPage(QUERY);

    expect(result).toEqual({ data: newerPage, origin: DataOrigin.Network, isStale: false });
  });

  it('el refresco forzado ignora la caché vigente', async () => {
    const { repository, local, remote } = setup();
    await local.writePage(0, 20, page, NOW);

    const result = await repository.getPage({ ...QUERY, forceRefresh: true });

    expect(remote.fetchPage).toHaveBeenCalledWith(0, 20);
    expect(result.data).toBe(newerPage);
  });

  it.each([AppErrorCode.Network, AppErrorCode.Timeout, AppErrorCode.Server])(
    'si la red falla con %s responde con la caché vencida marcada como stale',
    async (code) => {
      const { repository, local, remote } = setup();
      await local.writePage(0, 20, page, 0);
      remote.fetchPage.mockRejectedValue(new AppError(code, 'fallo'));

      const result = await repository.getPage(QUERY);

      expect(result).toEqual({ data: page, origin: DataOrigin.Cache, isStale: true });
    },
  );

  it('si el refresco forzado falla conserva la caché vigente como stale', async () => {
    const { repository, local, remote } = setup();
    await local.writePage(0, 20, page, NOW);
    remote.fetchPage.mockRejectedValue(new AppError(AppErrorCode.Network, 'sin red'));

    const result = await repository.getPage({ ...QUERY, forceRefresh: true });

    expect(result).toEqual({ data: page, origin: DataOrigin.Cache, isStale: true });
  });

  it('si la red falla y no hay caché propaga el error', async () => {
    const { repository, remote } = setup();
    remote.fetchPage.mockRejectedValue(new AppError(AppErrorCode.Network, 'sin red'));

    await expect(repository.getPage(QUERY)).rejects.toMatchObject({ code: AppErrorCode.Network });
  });

  it('un 404 no se oculta con la caché', async () => {
    const { repository, local, remote } = setup();
    await local.writeDetail(detail, 0);
    remote.fetchDetail.mockRejectedValue(new AppError(AppErrorCode.NotFound, 'no existe'));

    await expect(repository.getDetail(1)).rejects.toMatchObject({ code: AppErrorCode.NotFound });
  });

  it('convierte errores desconocidos en AppError', async () => {
    const { repository, remote } = setup();
    remote.fetchDetail.mockRejectedValue(new Error('raro'));

    await expect(repository.getDetail(1)).rejects.toBeInstanceOf(AppError);
  });

  it('guarda el detalle y lo sirve desde caché', async () => {
    const { repository, remote } = setup();

    await repository.getDetail(1);
    const second = await repository.getDetail(1);

    expect(second.origin).toBe(DataOrigin.Cache);
    expect(remote.fetchDetail).toHaveBeenCalledTimes(1);
  });

  it('aplica el vencimiento justo en el límite', async () => {
    const { repository, local, remote } = setup();
    await local.writePage(0, 20, page, NOW - TTL + 1);
    await repository.getPage(QUERY);
    expect(remote.fetchPage).not.toHaveBeenCalled();

    await local.writePage(0, 20, page, NOW - TTL);
    await repository.getPage(QUERY);
    expect(remote.fetchPage).toHaveBeenCalledTimes(1);
  });

  it('no oculta con la caché una respuesta con datos inválidos', async () => {
    const { repository, local, remote } = setup();
    await local.writePage(0, 20, page, 0);
    remote.fetchPage.mockRejectedValue(new AppError(AppErrorCode.InvalidData, 'rara'));

    await expect(repository.getPage(QUERY)).rejects.toMatchObject({
      code: AppErrorCode.InvalidData,
    });
  });

  it('el detalle también usa la caché vencida si la red falla', async () => {
    const { repository, local, remote } = setup();
    await local.writeDetail(detail, 0);
    remote.fetchDetail.mockRejectedValue(new AppError(AppErrorCode.Network, 'sin red'));

    await expect(repository.getDetail(1)).resolves.toEqual({
      data: detail,
      origin: DataOrigin.Cache,
      isStale: true,
    });
  });

  it('guarda con la fecha actual', async () => {
    const { repository, local } = setup();

    await repository.getDetail(1);

    await expect(local.readDetail(1)).resolves.toMatchObject({ savedAt: NOW });
  });

  it('usa Date.now si no se indica un reloj', async () => {
    const { remote, local } = setup();
    jest.spyOn(Date, 'now').mockReturnValue(5000);
    const repository = new PokemonRepositoryImpl(remote, local, { ttlMs: TTL });

    await repository.getDetail(1);

    await expect(local.readDetail(1)).resolves.toMatchObject({ savedAt: 5000 });
    jest.restoreAllMocks();
  });

  it('si el guardado falla responde igual con los datos de la red', async () => {
    const { repository, store } = setup();
    jest.spyOn(store, 'setItem').mockRejectedValue(new Error('disco lleno'));

    await expect(repository.getDetail(1)).resolves.toMatchObject({
      data: detail,
      origin: DataOrigin.Network,
    });
  });

  it('sigue funcionando si el almacenamiento falla', async () => {
    const { repository, store } = setup();
    jest.spyOn(store, 'getItem').mockRejectedValue(new Error('disco'));
    jest.spyOn(store, 'setItem').mockRejectedValue(new Error('disco'));

    const result = await repository.getPage(QUERY);

    expect(result.origin).toBe(DataOrigin.Network);
  });
});
