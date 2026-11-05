import { StyleSheet } from 'react-native';

import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center', gap: 2, paddingHorizontal: spacing.xs },
  value: { fontVariant: ['tabular-nums'] },
});
