import { View } from 'react-native';

import { MeasureItem } from '@/presentation/components/MeasureItem';
import { useThemeColors } from '@/presentation/theme';
import { formatHeight, formatWeight } from '@/presentation/utils/format';

import { styles } from './PokemonMeasures.styles';
import type { PokemonMeasuresProps } from './PokemonMeasures.types';

export function PokemonMeasures({
  heightInDecimetres,
  weightInHectograms,
  baseExperience,
}: PokemonMeasuresProps) {
  const colors = useThemeColors();
  const divider = <View style={[styles.divider, { backgroundColor: colors.border }]} />;

  return (
    <View style={[styles.panel, { backgroundColor: colors.surface }]}>
      <MeasureItem label="Altura" value={formatHeight(heightInDecimetres)} />
      {divider}
      <MeasureItem label="Peso" value={formatWeight(weightInHectograms)} />
      {divider}
      <MeasureItem
        label="Exp. base"
        spokenLabel="Experiencia base"
        value={baseExperience === null ? 'N/D' : String(baseExperience)}
      />
    </View>
  );
}
