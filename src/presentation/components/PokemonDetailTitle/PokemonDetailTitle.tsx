import { Text, View } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';
import { formatNumber } from '@/presentation/utils/format';

import { styles } from './PokemonDetailTitle.styles';
import type { PokemonDetailTitleProps } from './PokemonDetailTitle.types';

export function PokemonDetailTitle({ name, id }: PokemonDetailTitleProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.row}>
      <Text
        accessibilityRole="header"
        style={[typography.display, styles.name, { color: colors.text }]}
      >
        {name}
      </Text>
      <Text style={[typography.bodyStrong, styles.number, { color: colors.textMuted }]}>
        {formatNumber(id)}
      </Text>
    </View>
  );
}
