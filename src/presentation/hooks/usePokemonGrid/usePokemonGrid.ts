import { useWindowDimensions } from 'react-native';

import { spacing } from '@/presentation/theme';

import type { PokemonGridLayout } from './usePokemonGrid.types';

export const GRID_GUTTER = spacing.md;

const MAX_CONTENT_WIDTH = 1200;
const THREE_COLUMNS_FROM = 600;
const FOUR_COLUMNS_FROM = 900;

export function calculatePokemonGrid(windowWidth: number): PokemonGridLayout {
  const contentWidth = Math.min(windowWidth, MAX_CONTENT_WIDTH);
  const columns = contentWidth < THREE_COLUMNS_FROM ? 2 : contentWidth < FOUR_COLUMNS_FROM ? 3 : 4;
  const tileWidth = Math.floor((contentWidth - GRID_GUTTER * (columns + 1)) / columns);
  return { columns, tileWidth, contentWidth };
}

export function usePokemonGrid(): PokemonGridLayout {
  const { width } = useWindowDimensions();
  return calculatePokemonGrid(width);
}
