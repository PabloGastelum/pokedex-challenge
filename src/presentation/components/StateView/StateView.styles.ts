import { StyleSheet } from 'react-native';

import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    padding: spacing.xl,
  },
  text: { textAlign: 'center', maxWidth: 420 },
});
