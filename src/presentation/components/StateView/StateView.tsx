import { Text, View } from 'react-native';

import { AppButton } from '@/presentation/components/AppButton';
import { typography, useThemeColors } from '@/presentation/theme';

import { styles } from './StateView.styles';
import type { StateViewProps } from './StateView.types';

export function StateView({ title, message, actionLabel, onAction }: StateViewProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container} accessibilityLiveRegion="polite">
      <Text
        accessibilityRole="header"
        style={[typography.heading, styles.text, { color: colors.text }]}
      >
        {title}
      </Text>
      <Text style={[typography.body, styles.text, { color: colors.textMuted }]}>{message}</Text>
      {actionLabel && onAction ? <AppButton label={actionLabel} onPress={onAction} /> : null}
    </View>
  );
}
