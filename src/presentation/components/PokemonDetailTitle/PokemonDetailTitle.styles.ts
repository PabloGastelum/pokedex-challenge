import { StyleSheet } from 'react-native';

import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'baseline', gap: spacing.md },
  name: { flex: 1 },
  number: { fontVariant: ['tabular-nums'] },
});
