import { useEffect, useState } from 'react';
import { Animated, Easing, View } from 'react-native';

import { PokemonImage } from '@/presentation/components/PokemonImage';
import { usePokemonHeroLayout } from '@/presentation/hooks/usePokemonHeroLayout';
import { useReducedMotion } from '@/presentation/hooks/useReducedMotion';
import { WHITE, withAlpha } from '@/presentation/utils/contrast';

import { styles } from './PokemonHero.styles';
import type { PokemonHeroProps } from './PokemonHero.types';

const SPOTLIGHT_COLOR = withAlpha(WHITE, 0.3);
const SPOTLIGHT_RATIO = 1.12;
const ENTRANCE_START_SCALE = 0.9;

export function PokemonHero({
  imageUrl,
  name,
  backgroundColor,
  foregroundColor,
}: PokemonHeroProps) {
  const { imageSize, paddingTop } = usePokemonHeroLayout();
  const isReducedMotion = useReducedMotion();
  const [progress] = useState(() => new Animated.Value(0));
  const spotlightSize = imageSize * SPOTLIGHT_RATIO;

  useEffect(() => {
    if (isReducedMotion) {
      progress.setValue(1);
      return;
    }
    Animated.timing(progress, {
      toValue: 1,
      duration: 420,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [isReducedMotion, progress]);

  const scale = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [ENTRANCE_START_SCALE, 1],
  });

  return (
    <View style={[styles.hero, { backgroundColor, paddingTop }]}>
      <View style={[styles.overscroll, { backgroundColor }]} />
      <View
        style={[
          styles.spotlight,
          { width: spotlightSize, height: spotlightSize, backgroundColor: SPOTLIGHT_COLOR },
        ]}
      >
        <Animated.View style={{ opacity: progress, transform: [{ scale }] }}>
          <PokemonImage
            uri={imageUrl}
            label={`Ilustración de ${name}`}
            fallbackColor={foregroundColor}
            size={imageSize}
          />
        </Animated.View>
      </View>
    </View>
  );
}
