import { View } from 'react-native';

import { AbilityChip } from '@/presentation/components/AbilityChip';
import { DetailSection } from '@/presentation/components/DetailSection';

import { styles } from './PokemonAbilities.styles';
import type { PokemonAbilitiesProps } from './PokemonAbilities.types';

export function PokemonAbilities({ abilities }: PokemonAbilitiesProps) {
  return (
    <DetailSection title="Habilidades">
      <View style={styles.chips}>
        {abilities.map((ability) => (
          <AbilityChip key={ability.name} ability={ability} />
        ))}
      </View>
    </DetailSection>
  );
}
