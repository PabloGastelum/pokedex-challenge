import { CACHE_SCHEMA_VERSION } from '@/data/constants/cache';
import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';

import { KeyValuePokemonLocalDataSource } from './KeyValuePokemonLocalDataSource';

const page: PokemonPage = {
  items: [{ id: 1, name: 'bulbasaur', imageUrl: 'a.png' }],
  nextOffset: 20,
  totalCount: 1351,
};
const detail = { id: 1, name: 'bulbasaur' } as PokemonDetail;

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
  return { store, local: new KeyValuePokemonLocalDataSource(store) };
}

describe('KeyValuePokemonLocalDataSource', () => {
  const KEY = 'pokemon:detail:1';

  it('recupera una página guardada con su fecha y versión', async () => {
    const { local } = setup();

    await local.writePage(0, 20, page, 1234);

    await expect(local.readPage(0, 20)).resolves.toEqual({
      schemaVersion: CACHE_SCHEMA_VERSION,
      savedAt: 1234,
      data: page,
    });
  });

  it('recupera un detalle guardado', async () => {
    const { local } = setup();

    await local.writeDetail(detail, 1234);

    await expect(local.readDetail(1)).resolves.toMatchObject({ savedAt: 1234, data: detail });
  });

  it('devuelve null si no hay nada guardado', async () => {
    const { local } = setup();

    await expect(local.readPage(0, 20)).resolves.toBeNull();
    await expect(local.readDetail(1)).resolves.toBeNull();
  });

  it('distingue páginas por offset y límite', async () => {
    const { local } = setup();
    await local.writePage(0, 20, page, 1);

    await expect(local.readPage(20, 20)).resolves.toBeNull();
    await expect(local.readPage(0, 10)).resolves.toBeNull();
  });

  it('distingue detalles por id', async () => {
    const { local } = setup();
    await local.writeDetail(detail, 1);

    await expect(local.readDetail(2)).resolves.toBeNull();
  });

  it('una escritura nueva reemplaza la anterior', async () => {
    const { local } = setup();
    await local.writePage(0, 20, page, 1);

    await local.writePage(0, 20, { ...page, totalCount: 2 }, 2);

    await expect(local.readPage(0, 20)).resolves.toMatchObject({
      savedAt: 2,
      data: { totalCount: 2 },
    });
  });

  it.each([
    ['JSON corrupto', '{no-json'],
    ['un esquema anterior', JSON.stringify({ schemaVersion: 0, savedAt: 1, data: {} })],
    ['una entrada sin datos', JSON.stringify({ schemaVersion: CACHE_SCHEMA_VERSION, savedAt: 1 })],
    ['una fecha inválida', JSON.stringify({ schemaVersion: CACHE_SCHEMA_VERSION, data: {} })],
    ['un valor que no es objeto', '42'],
    ['un valor nulo', 'null'],
  ])('descarta y elimina %s', async (_, raw) => {
    const { store, local } = setup();
    store.items.set(KEY, raw);

    await expect(local.readDetail(1)).resolves.toBeNull();
    expect(store.items.has(KEY)).toBe(false);
  });

  it('propaga los fallos del almacenamiento para que el repositorio decida', async () => {
    const { store, local } = setup();
    jest.spyOn(store, 'getItem').mockRejectedValue(new Error('disco'));

    await expect(local.readDetail(1)).rejects.toThrow('disco');
  });
});
