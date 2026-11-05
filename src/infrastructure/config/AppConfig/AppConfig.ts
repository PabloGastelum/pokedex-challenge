import type { AppConfig, RawAppConfig } from './AppConfig.types';

const DEFAULTS: AppConfig = {
  pokeApiBaseUrl: 'https://pokeapi.co/api/v2',
  artworkBaseUrl:
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork',
};

function resolveUrl(name: keyof AppConfig, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULTS[name];
  if (!/^https?:\/\/\S+$/.test(trimmed)) {
    throw new Error(`Configuración inválida en ${name}: "${trimmed}" no es una URL http(s)`);
  }
  return trimmed.replace(/\/+$/, '');
}

export function parseAppConfig(raw: RawAppConfig): AppConfig {
  return {
    pokeApiBaseUrl: resolveUrl('pokeApiBaseUrl', raw.pokeApiBaseUrl),
    artworkBaseUrl: resolveUrl('artworkBaseUrl', raw.artworkBaseUrl),
  };
}

export function loadAppConfig(): AppConfig {
  return parseAppConfig({
    pokeApiBaseUrl: process.env.EXPO_PUBLIC_POKEAPI_BASE_URL,
    artworkBaseUrl: process.env.EXPO_PUBLIC_POKEMON_ARTWORK_BASE_URL,
  });
}
