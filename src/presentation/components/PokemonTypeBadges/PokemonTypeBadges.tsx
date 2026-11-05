import { View } from 'react-native';

import { TypeBadge } from '@/presentation/components/TypeBadge';

import { styles } from './PokemonTypeBadges.styles';
import type { PokemonTypeBadgesProps } from './PokemonTypeBadges.types';

export function PokemonTypeBadges({ types }: PokemonTypeBadgesProps) {
  return (
    <View style={styles.row}>
      {types.map((type) => (
        <TypeBadge key={type} type={type} />
      ))}
    </View>
  );
}
