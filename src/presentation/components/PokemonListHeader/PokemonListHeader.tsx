import { Text, View } from 'react-native';

import { NoticeBanner } from '@/presentation/components/NoticeBanner';
import { ScreenTitle } from '@/presentation/components/ScreenTitle';
import { typography, useThemeColors } from '@/presentation/theme';
import { formatCount } from '@/presentation/utils/format';
import { STALE_DATA_MESSAGE } from '@/presentation/utils/labels';

import { styles } from './PokemonListHeader.styles';
import type { PokemonListHeaderProps } from './PokemonListHeader.types';

export function PokemonListHeader({ isStale, totalCount }: PokemonListHeaderProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <ScreenTitle title="Pokédex" />
        <Text style={[typography.caption, styles.count, { color: colors.textMuted }]}>
          {`${formatCount(totalCount)} Pokémon`}
        </Text>
      </View>
      {isStale ? <NoticeBanner message={STALE_DATA_MESSAGE} /> : null}
    </View>
  );
}
