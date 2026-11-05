import { StyleSheet } from 'react-native';

import { radius, spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, minHeight: 32 },
  label: { width: 96 },
  value: { width: 36, textAlign: 'right', fontVariant: ['tabular-nums'] },
  track: { flex: 1, height: 10, borderRadius: radius.pill, overflow: 'hidden' },
  fill: { height: '100%', width: '100%', transformOrigin: 'left' },
});
