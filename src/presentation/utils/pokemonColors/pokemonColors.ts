import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { typeColors } from '@/presentation/theme';
import { readableOn, WHITE } from '@/presentation/utils/contrast';

import type { HeroColors } from './pokemonColors.types';

export function getHeroColors(types: readonly PokemonTypeName[]): HeroColors {
  const background = typeColors[types[0] ?? PokemonTypeName.Unknown];
  const foreground = readableOn(background);
  return { background, foreground, statusBarStyle: foreground === WHITE ? 'light' : 'dark' };
}
