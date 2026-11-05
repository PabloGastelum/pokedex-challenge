import { StyleSheet } from 'react-native';

import { radius, spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  hero: { paddingBottom: spacing.md + radius.lg },
  chips: { flexDirection: 'row', gap: spacing.sm },
});
