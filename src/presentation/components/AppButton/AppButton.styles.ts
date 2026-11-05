import { StyleSheet } from 'react-native';

import { MIN_TOUCH_TARGET, radius, spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  button: {
    minHeight: MIN_TOUCH_TARGET,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
