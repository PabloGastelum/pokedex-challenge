import { TOKENS } from '@/di/tokens';
import type { HttpClient } from '@/data/interfaces/HttpClient';
import type { KeyValueStore } from '@/data/interfaces/KeyValueStore';
import { DataOrigin } from '@/domain/enums/DataOrigin';
import type { AppConfig } from '@/infrastructure/config/AppConfig';

import { createContainer, resolveDependencies } from './container';

jest.mock('expo-sqlite/kv-store', () => ({
  __esModule: true,
  default: { getItem: jest.fn(), setItem: jest.fn(), removeItem: jest.fn() },
}));

describe('container', () => {
  it('resuelve los casos de uso como singletons', () => {
    const container = createContainer();

    const first = resolveDependencies(container);
    const second = resolveDependencies(container);

    expect(first.getPokemonPage).toBe(second.getPokemonPage);
    expect(first.getPokemonDetail).toBe(second.getPokemonDetail);
    expect(container.get(TOKENS.PokemonRepository)).toBe(container.get(TOKENS.PokemonRepository));
  });

  it('entrega la configuración a la capa de datos', async () => {
    const container = createContainer();
    const http: HttpClient = {
      getJson: jest.fn().mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'pikachu', url: 'https://pokeapi.co/api/v2/pokemon/25/' }],
      }),
    };
    const store: KeyValueStore = {
      getItem: async () => null,
      setItem: async () => undefined,
      removeItem: async () => undefined,
    };
    container
      .rebind<AppConfig>(TOKENS.AppConfig)
      .toConstantValue({ pokeApiBaseUrl: 'https://api.test', artworkBaseUrl: 'https://img.test' });
    container.rebind<HttpClient>(TOKENS.HttpClient).toConstantValue(http);
    container.rebind<KeyValueStore>(TOKENS.KeyValueStore).toConstantValue(store);

    const { data } = await resolveDependencies(container).getPokemonPage.execute({
      offset: 0,
      limit: 20,
    });

    expect(data.items[0]?.imageUrl).toBe('https://img.test/25.png');
  });

  it('crea el cliente HTTP con la URL configurada', async () => {
    const fetchSpy = jest.spyOn(globalThis, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ id: 1 }),
    } as Response);
    const container = createContainer();
    container
      .rebind<AppConfig>(TOKENS.AppConfig)
      .toConstantValue({ pokeApiBaseUrl: 'https://api.test', artworkBaseUrl: 'https://img.test' });

    await container.get<HttpClient>(TOKENS.HttpClient).getJson('/x');

    expect(fetchSpy.mock.calls[0]?.[0]).toBe('https://api.test/x');
    fetchSpy.mockRestore();
  });

  it('permite sustituir infraestructura y conecta todas las capas', async () => {
    const container = createContainer();
    const http: HttpClient = {
      getJson: jest.fn().mockResolvedValue({
        count: 1,
        next: null,
        previous: null,
        results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' }],
      }),
    };
    const items = new Map<string, string>();
    const store: KeyValueStore = {
      getItem: async (key) => items.get(key) ?? null,
      setItem: async (key, value) => void items.set(key, value),
      removeItem: async (key) => void items.delete(key),
    };
    container.rebind<HttpClient>(TOKENS.HttpClient).toConstantValue(http);
    container.rebind<KeyValueStore>(TOKENS.KeyValueStore).toConstantValue(store);
    const { getPokemonPage } = resolveDependencies(container);

    const first = await getPokemonPage.execute({ offset: 0, limit: 20 });
    const second = await getPokemonPage.execute({ offset: 0, limit: 20 });

    expect(first.origin).toBe(DataOrigin.Network);
    expect(first.data.items[0]?.name).toBe('bulbasaur');
    expect(second.origin).toBe(DataOrigin.Cache);
    expect(http.getJson).toHaveBeenCalledTimes(1);
  });
});
