import { Image } from 'expo-image';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { typography } from '@/presentation/theme';

import { styles } from './PokemonImage.styles';
import type { PokemonImageProps } from './PokemonImage.types';

export function PokemonImage({ uri, label, fallbackColor, size }: PokemonImageProps) {
  const [failedUri, setFailedUri] = useState<string | null>(null);
  const dimensions = size ? { width: size, height: size } : styles.fill;

  if (!uri || failedUri === uri) {
    return (
      <View style={[dimensions, styles.fallback]} accessibilityLabel={`${label}: sin imagen`}>
        <Text style={[typography.caption, { color: fallbackColor }]}>Sin imagen</Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      style={dimensions}
      contentFit="contain"
      cachePolicy="memory-disk"
      recyclingKey={uri}
      transition={180}
      accessibilityLabel={label}
      onError={() => setFailedUri(uri)}
    />
  );
}
