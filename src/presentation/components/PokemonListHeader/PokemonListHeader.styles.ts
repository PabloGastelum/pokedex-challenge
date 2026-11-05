import { StyleSheet } from 'react-native';

import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  header: { gap: spacing.md },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: spacing.md,
  },
  count: { fontVariant: ['tabular-nums'] },
});
