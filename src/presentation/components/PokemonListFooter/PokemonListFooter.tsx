import { ActivityIndicator, Text, View } from 'react-native';

import { AppButton } from '@/presentation/components/AppButton';
import { typography, useThemeColors } from '@/presentation/theme';
import { errorCopy } from '@/presentation/utils/labels';

import { styles } from './PokemonListFooter.styles';
import type { PokemonListFooterProps } from './PokemonListFooter.types';

export function PokemonListFooter({ paging, error, onRetry }: PokemonListFooterProps) {
  const colors = useThemeColors();

  if (paging === 'loadingMore') {
    return (
      <ActivityIndicator
        accessibilityLabel="Cargando más Pokémon"
        color={colors.textMuted}
        style={styles.footer}
      />
    );
  }

  if (error) {
    return (
      <View style={styles.footer}>
        <Text style={[typography.body, styles.message, { color: colors.textMuted }]}>
          {errorCopy[error.code].message}
        </Text>
        <AppButton label="Reintentar" onPress={onRetry} />
      </View>
    );
  }

  return null;
}
