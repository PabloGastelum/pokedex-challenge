import { View } from 'react-native';

import { AppError } from '@/domain/errors/AppError';
import { ErrorView } from '@/presentation/components/ErrorView';
import { useThemeColors } from '@/presentation/theme';

import { styles } from './AppErrorFallback.styles';
import type { AppErrorFallbackProps } from './AppErrorFallback.types';

export function AppErrorFallback({ error, retry }: AppErrorFallbackProps) {
  const colors = useThemeColors();

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ErrorView error={AppError.from(error)} onRetry={() => void retry()} />
    </View>
  );
}
