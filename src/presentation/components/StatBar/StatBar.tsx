import { useEffect, useState } from 'react';
import { Animated, Easing, Text, View } from 'react-native';

import { useReducedMotion } from '@/presentation/hooks/useReducedMotion';
import { typography, useThemeColors } from '@/presentation/theme';
import { statLabels } from '@/presentation/utils/labels';

import { styles } from './StatBar.styles';
import type { StatBarProps } from './StatBar.types';

const STAT_SCALE_MAX = 200;

export function getStatFill(value: number): number {
  return Math.min(Math.max(value, 0) / STAT_SCALE_MAX, 1);
}

export function StatBar({ stat, color }: StatBarProps) {
  const colors = useThemeColors();
  const isReducedMotion = useReducedMotion();
  const fill = getStatFill(stat.value);
  const [progress] = useState(() => new Animated.Value(0));
  const label = statLabels[stat.name];

  useEffect(() => {
    if (isReducedMotion) {
      progress.setValue(fill);
      return;
    }
    Animated.timing(progress, {
      toValue: fill,
      duration: 500,
      easing: Easing.out(Easing.exp),
      useNativeDriver: true,
    }).start();
  }, [fill, isReducedMotion, progress]);

  return (
    <View accessible accessibilityLabel={`${label}: ${stat.value}`} style={styles.row}>
      <Text
        numberOfLines={1}
        style={[typography.caption, styles.label, { color: colors.textMuted }]}
      >
        {label}
      </Text>
      <Text style={[typography.bodyStrong, styles.value, { color: colors.text }]}>
        {stat.value}
      </Text>
      <View style={[styles.track, { backgroundColor: colors.surface }]}>
        <Animated.View
          style={[styles.fill, { backgroundColor: color, transform: [{ scaleX: progress }] }]}
        />
      </View>
    </View>
  );
}
