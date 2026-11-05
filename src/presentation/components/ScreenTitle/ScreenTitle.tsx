import { Text } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';

import type { ScreenTitleProps } from './ScreenTitle.types';

export function ScreenTitle({ title }: ScreenTitleProps) {
  const colors = useThemeColors();

  return (
    <Text accessibilityRole="header" style={[typography.display, { color: colors.text }]}>
      {title}
    </Text>
  );
}
