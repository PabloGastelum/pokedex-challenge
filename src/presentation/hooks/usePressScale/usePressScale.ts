import { useCallback, useState } from 'react';
import { Animated } from 'react-native';

import { useReducedMotion } from '@/presentation/hooks/useReducedMotion';

import type { UsePressScaleResult } from './usePressScale.types';

const PRESSED_SCALE = 0.96;

export function usePressScale(): UsePressScaleResult {
  const isReducedMotion = useReducedMotion();
  const [scale] = useState(() => new Animated.Value(1));

  const animateTo = useCallback(
    (toValue: number) => {
      if (isReducedMotion) return;
      Animated.spring(scale, { toValue, speed: 40, bounciness: 0, useNativeDriver: true }).start();
    },
    [isReducedMotion, scale],
  );

  const onPressIn = useCallback(() => animateTo(PRESSED_SCALE), [animateTo]);
  const onPressOut = useCallback(() => animateTo(1), [animateTo]);

  return { scale, onPressIn, onPressOut };
}
