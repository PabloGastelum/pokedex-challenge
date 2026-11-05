import type { Animated } from 'react-native';

export interface PokemonListTopBarProps {
  readonly title: string;
  readonly scrollY: Animated.Value;
}
