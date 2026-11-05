import { useEffect, useState } from 'react';
import { Animated, Easing } from 'react-native';

import { useReducedMotion } from '@/presentation/hooks/useReducedMotion';
import { useThemeColors } from '@/presentation/theme';

import { styles } from './Skeleton.styles';
import type { SkeletonProps } from './Skeleton.types';

export function Skeleton({ width, height, style }: SkeletonProps) {
  const colors = useThemeColors();
  const isReducedMotion = useReducedMotion();
  const [opacity] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (isReducedMotion) {
      opacity.setValue(1);
      return;
    }
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 700,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [isReducedMotion, opacity]);

  return (
    <Animated.View
      testID="skeleton"
      style={[styles.block, { width, height, opacity, backgroundColor: colors.surface }, style]}
    />
  );
}
