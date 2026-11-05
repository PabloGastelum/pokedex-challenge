import { Text } from 'react-native';

import { DetailSection } from '@/presentation/components/DetailSection';
import { StatBar } from '@/presentation/components/StatBar';
import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './PokemonStats.styles';
import type { PokemonStatsProps } from './PokemonStats.types';

export function PokemonStats({ stats, color }: PokemonStatsProps) {
  const colors = useThemeColors();
  const total = stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <DetailSection
      title="Estadísticas base"
      trailing={
        <Text accessibilityLabel={`Total: ${total}`} style={styles.total}>
          <Text style={[typography.caption, { color: colors.textMuted }]}>Total </Text>
          <Text style={[typography.bodyStrong, { color: colors.text }]}>{total}</Text>
        </Text>
      }
    >
      {stats.map((stat) => (
        <StatBar key={stat.name} stat={stat} color={color} />
      ))}
    </DetailSection>
  );
}
