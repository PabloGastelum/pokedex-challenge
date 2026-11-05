import type { Animated } from 'react-native';

export interface UsePressScaleResult {
  readonly scale: Animated.Value;
  readonly onPressIn: () => void;
  readonly onPressOut: () => void;
}
