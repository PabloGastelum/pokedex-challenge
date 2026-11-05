import { StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET, radius, spacing } from '@/presentation/theme';
import { INK, WHITE, withAlpha } from '@/presentation/utils/contrast';

const CIRCLE_SIZE = 40;
const CHEVRON_SIZE = 11;
const HIT_OVERFLOW = (MIN_TOUCH_TARGET - CIRCLE_SIZE) / 2;

export const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    left: spacing.md - HIT_OVERFLOW,
    width: MIN_TOUCH_TARGET,
    height: MIN_TOUCH_TARGET,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: withAlpha(WHITE, 0.88),
  },
  chevron: {
    width: CHEVRON_SIZE,
    height: CHEVRON_SIZE,
    marginLeft: CHEVRON_SIZE / 3,
    borderLeftWidth: 2.5,
    borderBottomWidth: 2.5,
    borderColor: INK,
    transform: [{ rotate: '45deg' }],
  },
});
