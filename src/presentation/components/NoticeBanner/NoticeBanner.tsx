import { Text, View } from 'react-native';

import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './NoticeBanner.styles';
import type { NoticeBannerProps } from './NoticeBanner.types';

export function NoticeBanner({ message }: NoticeBannerProps) {
  const colors = useThemeColors();

  return (
    <View
      accessibilityLiveRegion="polite"
      style={[styles.banner, { backgroundColor: colors.notice }]}
    >
      <Text style={[typography.caption, { color: colors.onNotice }]}>{message}</Text>
    </View>
  );
}
