import { StyleSheet } from 'react-native';

import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  section: { gap: spacing.sm, marginTop: spacing.sm },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
});
