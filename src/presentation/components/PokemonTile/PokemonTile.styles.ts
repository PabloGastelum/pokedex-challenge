import { StyleSheet } from 'react-native';

import { radius, spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  plate: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  caption: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.sm },
  name: { flex: 1 },
  number: { fontVariant: ['tabular-nums'] },
});
