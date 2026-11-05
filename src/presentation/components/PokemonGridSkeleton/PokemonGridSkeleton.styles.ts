import { StyleSheet } from 'react-native';

import { GRID_GUTTER } from '@/presentation/hooks/usePokemonGrid';
import { radius, spacing } from '@/presentation/theme';

export const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: GRID_GUTTER,
    rowGap: spacing.lg,
    padding: GRID_GUTTER,
    alignSelf: 'center',
  },
  plate: { borderRadius: radius.md, marginBottom: spacing.sm },
  caption: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.sm },
});
