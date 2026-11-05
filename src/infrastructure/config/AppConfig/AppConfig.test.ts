import { loadAppConfig, parseAppConfig } from './AppConfig';

const DEFAULT_API = 'https://pokeapi.co/api/v2';

describe('parseAppConfig', () => {
  it('usa los valores por defecto si no hay configuración', () => {
    const config = parseAppConfig({});

    expect(config.pokeApiBaseUrl).toBe(DEFAULT_API);
    expect(config.artworkBaseUrl).toMatch(/official-artwork$/);
  });

  it.each(['', '   '])('trata el valor %j como no configurado', (value) => {
    expect(parseAppConfig({ pokeApiBaseUrl: value }).pokeApiBaseUrl).toBe(DEFAULT_API);
  });

  it('usa los valores configurados', () => {
    const config = parseAppConfig({
      pokeApiBaseUrl: 'https://api.test/v2',
      artworkBaseUrl: 'http://img.test/art',
    });

    expect(config).toEqual({
      pokeApiBaseUrl: 'https://api.test/v2',
      artworkBaseUrl: 'http://img.test/art',
    });
  });

  it('quita espacios y diagonales finales para no duplicarlas al armar rutas', () => {
    expect(parseAppConfig({ pokeApiBaseUrl: ' https://api.test/v2// ' }).pokeApiBaseUrl).toBe(
      'https://api.test/v2',
    );
  });

  it.each(['pokeapi.co', 'ftp://api.test', 'https://', 'https://con espacio.test'])(
    'rechaza la URL inválida %j nombrando la variable',
    (value) => {
      expect(() => parseAppConfig({ artworkBaseUrl: value })).toThrow(/artworkBaseUrl/);
    },
  );
});

describe('loadAppConfig', () => {
  const original = { ...process.env };

  afterEach(() => {
    process.env = { ...original };
  });

  it('lee las variables de entorno', () => {
    process.env.EXPO_PUBLIC_POKEAPI_BASE_URL = 'https://api.test/v2';
    process.env.EXPO_PUBLIC_POKEMON_ARTWORK_BASE_URL = 'https://img.test/art';

    expect(loadAppConfig()).toEqual({
      pokeApiBaseUrl: 'https://api.test/v2',
      artworkBaseUrl: 'https://img.test/art',
    });
  });

  it('funciona sin variables de entorno', () => {
    delete process.env.EXPO_PUBLIC_POKEAPI_BASE_URL;
    delete process.env.EXPO_PUBLIC_POKEMON_ARTWORK_BASE_URL;

    expect(loadAppConfig().pokeApiBaseUrl).toBe(DEFAULT_API);
  });
});
