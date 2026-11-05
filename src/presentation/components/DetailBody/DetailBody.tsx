import { View } from 'react-native';

import { useThemeColors } from '@/presentation/theme';

import { styles } from './DetailBody.styles';
import type { DetailBodyProps } from './DetailBody.types';

export function DetailBody({ children }: DetailBodyProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.sheet, { backgroundColor: colors.background }]}>
      <View style={styles.column}>{children}</View>
    </View>
  );
}
