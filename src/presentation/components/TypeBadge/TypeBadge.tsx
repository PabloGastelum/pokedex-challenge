import { Text, View } from 'react-native';

import { typeColors, typography } from '@/presentation/theme';
import { readableOn } from '@/presentation/utils/contrast';
import { typeLabels } from '@/presentation/utils/labels';

import { styles } from './TypeBadge.styles';
import type { TypeBadgeProps } from './TypeBadge.types';

export function TypeBadge({ type }: TypeBadgeProps) {
  const backgroundColor = typeColors[type];

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[typography.caption, { color: readableOn(backgroundColor) }]}>
        {typeLabels[type]}
      </Text>
    </View>
  );
}
