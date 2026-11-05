import { StyleSheet } from 'react-native';

import { GRID_GUTTER } from '@/presentation/hooks/usePokemonGrid';
import { spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: {
    alignSelf: 'center',
    paddingHorizontal: GRID_GUTTER,
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  row: { gap: GRID_GUTTER },
  loadingTitle: { alignSelf: 'center', paddingHorizontal: GRID_GUTTER, paddingTop: spacing.sm },
});
