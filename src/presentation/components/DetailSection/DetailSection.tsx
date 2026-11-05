import { Text, View } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './DetailSection.styles';
import type { DetailSectionProps } from './DetailSection.types';

export function DetailSection({ title, trailing, children }: DetailSectionProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Text accessibilityRole="header" style={[typography.heading, { color: colors.text }]}>
          {title}
        </Text>
        {trailing}
      </View>
      {children}
    </View>
  );
}
