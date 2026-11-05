import { StyleSheet } from 'react-native';

import { radius, spacing } from '@/presentation/theme';

const OVERSCROLL_HEIGHT = 800;

export const styles = StyleSheet.create({
  hero: { alignItems: 'center', paddingBottom: spacing.md + radius.lg },
  overscroll: {
    position: 'absolute',
    top: -OVERSCROLL_HEIGHT,
    left: 0,
    right: 0,
    height: OVERSCROLL_HEIGHT,
  },
  spotlight: { alignItems: 'center', justifyContent: 'center', borderRadius: radius.pill },
});
