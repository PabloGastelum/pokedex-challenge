import { Text, View } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';
import { formatName } from '@/presentation/utils/format';

import { styles } from './AbilityChip.styles';
import type { AbilityChipProps } from './AbilityChip.types';

export function AbilityChip({ ability }: AbilityChipProps) {
  const colors = useThemeColors();
  const name = formatName(ability.name);

  return (
    <View
      accessible
      accessibilityLabel={ability.isHidden ? `${name}, habilidad oculta` : name}
      style={[styles.chip, { backgroundColor: colors.surface }]}
    >
      <Text style={[typography.bodyStrong, { color: colors.text }]}>{name}</Text>
      {ability.isHidden ? (
        <Text style={[typography.caption, { color: colors.textMuted }]}>Oculta</Text>
      ) : null}
    </View>
  );
}
