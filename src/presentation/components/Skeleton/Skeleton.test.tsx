import { render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  afterEach(() => jest.restoreAllMocks());

  it('aplica las dimensiones recibidas', async () => {
    await render(<Skeleton width={120} height={16} />);

    expect(screen.getByTestId('skeleton')).toHaveStyle({ width: 120, height: 16 });
  });

  it('anima el pulso y lo detiene al desmontarse', async () => {
    const stop = jest.fn();
    jest.spyOn(Animated, 'loop').mockReturnValue({
      start: jest.fn(),
      stop,
      reset: jest.fn(),
    } as unknown as Animated.CompositeAnimation);

    const { unmount } = await render(<Skeleton />);
    expect(Animated.loop).toHaveBeenCalled();

    await unmount();
    expect(stop).toHaveBeenCalled();
  });

  it('detiene el pulso si la persona pidió reducir el movimiento', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const stop = jest.fn();
    jest.spyOn(Animated, 'loop').mockReturnValue({
      start: jest.fn(),
      stop,
      reset: jest.fn(),
    } as unknown as Animated.CompositeAnimation);

    await render(<Skeleton />);

    await waitFor(() => expect(stop).toHaveBeenCalled());
  });
});
