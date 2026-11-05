import { StatusBar } from 'expo-status-bar';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { DetailBody } from '@/presentation/components/DetailBody';
import { NoticeBanner } from '@/presentation/components/NoticeBanner';
import { PokemonAbilities } from '@/presentation/components/PokemonAbilities';
import { PokemonDetailTitle } from '@/presentation/components/PokemonDetailTitle';
import { PokemonHero } from '@/presentation/components/PokemonHero';
import { PokemonMeasures } from '@/presentation/components/PokemonMeasures';
import { PokemonStats } from '@/presentation/components/PokemonStats';
import { PokemonTypeBadges } from '@/presentation/components/PokemonTypeBadges';
import { spacing, useThemeColors } from '@/presentation/theme';
import { formatName } from '@/presentation/utils/format';
import { STALE_DATA_MESSAGE } from '@/presentation/utils/labels';
import { getHeroColors } from '@/presentation/utils/pokemonColors';

import { styles } from './PokemonDetailContent.styles';
import type { PokemonDetailContentProps } from './PokemonDetailContent.types';

export function PokemonDetailContent({ detail, isStale }: PokemonDetailContentProps) {
  const colors = useThemeColors();
  const { top, bottom } = useSafeAreaInsets();
  const hero = getHeroColors(detail.types);
  const name = formatName(detail.name);

  return (
    <>
      <StatusBar style={hero.statusBarStyle} />
      <ScrollView
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingBottom: bottom + spacing.xl }}
        contentInsetAdjustmentBehavior="never"
      >
        <PokemonHero
          imageUrl={detail.imageUrl}
          name={name}
          backgroundColor={hero.background}
          foregroundColor={hero.foreground}
        />
        <DetailBody>
          {isStale ? <NoticeBanner message={STALE_DATA_MESSAGE} /> : null}
          <PokemonDetailTitle name={name} id={detail.id} />
          <PokemonTypeBadges types={detail.types} />
          <PokemonMeasures
            heightInDecimetres={detail.heightInDecimetres}
            weightInHectograms={detail.weightInHectograms}
            baseExperience={detail.baseExperience}
          />
          <PokemonAbilities abilities={detail.abilities} />
          <PokemonStats stats={detail.stats} color={hero.background} />
        </DetailBody>
      </ScrollView>
      <View
        testID="status-backdrop"
        pointerEvents="none"
        style={[styles.statusBackdrop, { height: top, backgroundColor: hero.background }]}
      />
    </>
  );
}
