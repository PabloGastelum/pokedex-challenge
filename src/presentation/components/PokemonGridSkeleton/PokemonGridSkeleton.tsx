import { View } from 'react-native';

import { Skeleton } from '@/presentation/components/Skeleton';

import { styles } from './PokemonGridSkeleton.styles';
import type { PokemonGridSkeletonProps } from './PokemonGridSkeleton.types';

const ROWS = 4;

export function PokemonGridSkeleton({
  columns,
  tileWidth,
  contentWidth,
}: PokemonGridSkeletonProps) {
  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando Pokémon"
      style={[styles.grid, { width: contentWidth }]}
    >
      {Array.from({ length: columns * ROWS }, (_, index) => (
        <View key={index} style={{ width: tileWidth }}>
          <Skeleton height={tileWidth} style={styles.plate} />
          <View style={styles.caption}>
            <Skeleton width="60%" height={18} />
            <Skeleton width="22%" height={14} />
          </View>
        </View>
      ))}
    </View>
  );
}
