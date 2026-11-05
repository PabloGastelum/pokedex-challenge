import type { DimensionValue, ViewStyle } from 'react-native';

export interface SkeletonProps {
  readonly width?: DimensionValue;
  readonly height?: DimensionValue;
  readonly style?: ViewStyle;
}
