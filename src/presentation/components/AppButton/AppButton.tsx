import { Pressable, Text } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './AppButton.styles';
import type { AppButtonProps } from './AppButton.types';

export function AppButton({ label, onPress }: AppButtonProps) {
  const colors = useThemeColors();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      android_ripple={{ color: colors.onPrimary }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
      ]}
    >
      <Text style={[typography.bodyStrong, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}
