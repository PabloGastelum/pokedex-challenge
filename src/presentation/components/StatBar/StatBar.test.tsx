import { render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';

import { StatName } from '@/domain/enums/StatName';

import { getStatFill, StatBar } from './StatBar';

describe('getStatFill', () => {
  it.each([
    [0, 0],
    [100, 0.5],
    [200, 1],
    [255, 1],
    [-5, 0],
  ])('el valor %i cubre %d de la barra', (value, expected) => {
    expect(getStatFill(value)).toBe(expected);
  });
});

describe('StatBar', () => {
  afterEach(() => jest.restoreAllMocks());

  it('anima la barra hasta su valor', async () => {
    const timing = jest.spyOn(Animated, 'timing');

    await render(<StatBar stat={{ name: StatName.Hp, value: 100 }} color="#000000" />);

    expect(timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 0.5, useNativeDriver: true }),
    );
  });

  it('coloca la barra sin animar si se pidió reducir el movimiento', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');

    await render(<StatBar stat={{ name: StatName.Hp, value: 100 }} color="#000000" />);

    await waitFor(() => expect(setValue).toHaveBeenCalledWith(0.5));
  });

  it('anuncia la estadística traducida con su valor', async () => {
    await render(<StatBar stat={{ name: StatName.SpecialAttack, value: 65 }} color="#000000" />);

    expect(screen.getByLabelText('At. especial: 65')).toBeTruthy();
  });
});
