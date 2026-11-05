import { memo } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { PokemonImage } from '@/presentation/components/PokemonImage';
import { usePressScale } from '@/presentation/hooks/usePressScale';
import { typography, useThemeColors } from '@/presentation/theme';
import { formatName, formatNumber } from '@/presentation/utils/format';

import { styles } from './PokemonTile.styles';
import type { PokemonTileProps } from './PokemonTile.types';

function PokemonTileBase({ pokemon, width, onPress }: PokemonTileProps) {
  const colors = useThemeColors();
  const { scale, onPressIn, onPressOut } = usePressScale();
  const name = formatName(pokemon.name);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${name}, número ${pokemon.id}`}
      accessibilityHint="Abre su ficha"
      onPress={() => onPress(pokemon)}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={{ width }}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={[styles.plate, { backgroundColor: colors.surface }]}>
          <PokemonImage uri={pokemon.imageUrl} label="" fallbackColor={colors.textMuted} />
        </View>
        <View style={styles.caption}>
          <Text
            numberOfLines={1}
            style={[typography.bodyStrong, styles.name, { color: colors.text }]}
          >
            {name}
          </Text>
          <Text style={[typography.caption, styles.number, { color: colors.textMuted }]}>
            {formatNumber(pokemon.id)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

export const PokemonTile = memo(PokemonTileBase);
