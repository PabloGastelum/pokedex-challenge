import { View } from 'react-native';

import { DetailBody } from '@/presentation/components/DetailBody';
import { Skeleton } from '@/presentation/components/Skeleton';
import { usePokemonHeroLayout } from '@/presentation/hooks/usePokemonHeroLayout';
import { useThemeColors } from '@/presentation/theme';

import { styles } from './PokemonDetailSkeleton.styles';

export function PokemonDetailSkeleton() {
  const colors = useThemeColors();
  const { imageSize, paddingTop } = usePokemonHeroLayout();

  return (
    <View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel="Cargando ficha"
      style={[styles.screen, { backgroundColor: colors.background }]}
    >
      <View style={[styles.hero, { backgroundColor: colors.surface, paddingTop }]}>
        <View style={{ height: imageSize }} />
      </View>
      <DetailBody>
        <Skeleton width="60%" height={40} />
        <View style={styles.chips}>
          <Skeleton width={84} height={26} />
          <Skeleton width={84} height={26} />
        </View>
        <Skeleton height={82} />
        <Skeleton width="45%" height={26} />
        <Skeleton height={120} />
      </DetailBody>
    </View>
  );
}
