import { useRouter } from 'expo-router';
import { Pressable, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { spacing } from '@/presentation/theme';

import { styles } from './BackButton.styles';

export function BackButton() {
  const router = useRouter();
  const { top } = useSafeAreaInsets();

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/'));

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Volver"
      onPress={goBack}
      style={({ pressed }) => [
        styles.button,
        { top: top + spacing.xs, opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <View style={styles.circle}>
        <View style={styles.chevron} />
      </View>
    </Pressable>
  );
}
