import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { BackButton } from '@/presentation/components/BackButton';
import { ErrorView } from '@/presentation/components/ErrorView';
import { PokemonDetailContent } from '@/presentation/components/PokemonDetailContent';
import { PokemonDetailSkeleton } from '@/presentation/components/PokemonDetailSkeleton';
import { usePokemonDetail } from '@/presentation/hooks/usePokemonDetail';
import { useThemeColors } from '@/presentation/theme';

import { styles } from './PokemonDetailScreen.styles';
import type { PokemonDetailRouteParams } from './PokemonDetailScreen.types';

export function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<PokemonDetailRouteParams>();
  const state = usePokemonDetail(Number(id));
  const colors = useThemeColors();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      {state.status === 'loading' ? <PokemonDetailSkeleton /> : null}
      {state.status === 'error' ? <ErrorView error={state.error} onRetry={state.retry} /> : null}
      {state.status === 'ready' ? (
        <PokemonDetailContent detail={state.detail} isStale={state.isStale} />
      ) : null}
      <BackButton />
    </View>
  );
}
