import { act, renderHook, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';

import { usePressScale } from './usePressScale';

describe('usePressScale', () => {
  afterEach(() => jest.restoreAllMocks());

  it('encoge al presionar y regresa al soltar', async () => {
    const spring = jest.spyOn(Animated, 'spring');
    const { result } = await renderHook(() => usePressScale());

    await act(async () => result.current.onPressIn());
    expect(spring).toHaveBeenLastCalledWith(
      result.current.scale,
      expect.objectContaining({ toValue: 0.96, useNativeDriver: true }),
    );

    await act(async () => result.current.onPressOut());
    expect(spring).toHaveBeenLastCalledWith(
      result.current.scale,
      expect.objectContaining({ toValue: 1 }),
    );
  });

  it('no anima si se pidió reducir el movimiento', async () => {
    const isReduced = jest
      .spyOn(AccessibilityInfo, 'isReduceMotionEnabled')
      .mockResolvedValue(true);
    const spring = jest.spyOn(Animated, 'spring');
    const { result } = await renderHook(() => usePressScale());
    await waitFor(() => expect(isReduced).toHaveBeenCalled());
    await act(async () => undefined);

    await act(async () => result.current.onPressIn());

    expect(spring).not.toHaveBeenCalled();
  });
});
