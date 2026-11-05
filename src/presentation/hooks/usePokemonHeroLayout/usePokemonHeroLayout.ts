import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { PokemonHeroLayout } from './usePokemonHeroLayout.types';

const BACK_BUTTON_SPACE = 44;
const IMAGE_WIDTH_RATIO = 0.62;
const MAX_IMAGE_SIZE = 320;

export function usePokemonHeroLayout(): PokemonHeroLayout {
  const { width } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  return {
    imageSize: Math.min(width * IMAGE_WIDTH_RATIO, MAX_IMAGE_SIZE),
    paddingTop: top + BACK_BUTTON_SPACE,
  };
}
