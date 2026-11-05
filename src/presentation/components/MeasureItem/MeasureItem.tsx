import { Text, View } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './MeasureItem.styles';
import type { MeasureItemProps } from './MeasureItem.types';

export function MeasureItem({ label, value, spokenLabel = label }: MeasureItemProps) {
  const colors = useThemeColors();

  return (
    <View accessible accessibilityLabel={`${spokenLabel}: ${value}`} style={styles.item}>
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        style={[typography.heading, styles.value, { color: colors.text }]}
      >
        {value}
      </Text>
      <Text style={[typography.caption, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}
