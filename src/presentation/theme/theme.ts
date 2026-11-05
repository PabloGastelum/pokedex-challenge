import { useColorScheme } from 'react-native';

import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';

import type { ThemeColors } from './theme.types';

export const lightColors: ThemeColors = {
  background: '#F6F4EF',
  surface: '#E9E5DB',
  text: '#1C1B18',
  textMuted: '#5F5B52',
  border: '#D5D0C4',
  primary: '#1C1B18',
  onPrimary: '#F6F4EF',
  notice: '#F5E6B8',
  onNotice: '#3D2F00',
};

export const darkColors: ThemeColors = {
  background: '#141311',
  surface: '#26241F',
  text: '#F2EFE8',
  textMuted: '#B3AEA2',
  border: '#3D3A32',
  primary: '#F2EFE8',
  onPrimary: '#141311',
  notice: '#3D3210',
  onNotice: '#F7E7B5',
};

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radius = { sm: 8, md: 16, lg: 28, pill: 999 } as const;

export const typography = {
  display: { fontSize: 34, lineHeight: 40, fontWeight: '700' },
  heading: { fontSize: 20, lineHeight: 26, fontWeight: '700' },
  body: { fontSize: 16, lineHeight: 24, fontWeight: '400' },
  bodyStrong: { fontSize: 16, lineHeight: 22, fontWeight: '600' },
  caption: { fontSize: 13, lineHeight: 18, fontWeight: '500' },
} as const;

export const MIN_TOUCH_TARGET = 48;

export const typeColors: Readonly<Record<PokemonTypeName, string>> = {
  [PokemonTypeName.Normal]: '#A8A77A',
  [PokemonTypeName.Fire]: '#E8702A',
  [PokemonTypeName.Water]: '#4A8FE7',
  [PokemonTypeName.Electric]: '#F2C81E',
  [PokemonTypeName.Grass]: '#5FAE3E',
  [PokemonTypeName.Ice]: '#8ED3D0',
  [PokemonTypeName.Fighting]: '#B5302B',
  [PokemonTypeName.Poison]: '#9440A0',
  [PokemonTypeName.Ground]: '#D9B75E',
  [PokemonTypeName.Flying]: '#A18CF0',
  [PokemonTypeName.Psychic]: '#EE5A87',
  [PokemonTypeName.Bug]: '#A3B31D',
  [PokemonTypeName.Rock]: '#B3A03A',
  [PokemonTypeName.Ghost]: '#6A5590',
  [PokemonTypeName.Dragon]: '#6B3BF0',
  [PokemonTypeName.Dark]: '#65503F',
  [PokemonTypeName.Steel]: '#B4B4CC',
  [PokemonTypeName.Fairy]: '#E79BB4',
  [PokemonTypeName.Unknown]: '#8A8A80',
};

export function useThemeColors(): ThemeColors {
  return useColorScheme() === 'dark' ? darkColors : lightColors;
}
