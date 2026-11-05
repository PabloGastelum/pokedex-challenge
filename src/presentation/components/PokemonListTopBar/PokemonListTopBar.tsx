import { Animated, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { typography, useThemeColors } from '@/presentation/theme';

import { styles, TOP_BAR_CONTENT_HEIGHT } from './PokemonListTopBar.styles';
import type { PokemonListTopBarProps } from './PokemonListTopBar.types';

const FADE_START = 8;
const FADE_END = 40;

export function PokemonListTopBar({ title, scrollY }: PokemonListTopBarProps) {
  const colors = useThemeColors();
  const { top } = useSafeAreaInsets();
  const opacity = scrollY.interpolate({
    inputRange: [FADE_START, FADE_END],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.bar,
        {
          opacity,
          height: top + TOP_BAR_CONTENT_HEIGHT,
          backgroundColor: colors.background,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <View style={styles.content}>
        <Text style={[typography.bodyStrong, { color: colors.text }]}>{title}</Text>
      </View>
    </Animated.View>
  );
}
