import { render, screen, waitFor } from '@testing-library/react-native';
import { AccessibilityInfo, Animated } from 'react-native';

import { PokemonHero } from './PokemonHero';

const props = { name: 'Pikachu', backgroundColor: '#F2C81E', foregroundColor: '#14130F' };

describe('PokemonHero', () => {
  afterEach(() => jest.restoreAllMocks());

  it('muestra la ilustración con una etiqueta descriptiva', async () => {
    await render(<PokemonHero {...props} imageUrl="25.png" />);

    expect(screen.getByLabelText('Ilustración de Pikachu')).toBeTruthy();
  });

  it('muestra el reemplazo si el Pokémon no tiene imagen', async () => {
    await render(<PokemonHero {...props} imageUrl={null} />);

    expect(screen.getByText('Sin imagen')).toBeTruthy();
  });

  it('anima la entrada de la ilustración', async () => {
    const timing = jest.spyOn(Animated, 'timing');

    await render(<PokemonHero {...props} imageUrl="25.png" />);

    expect(timing).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({ toValue: 1, useNativeDriver: true }),
    );
  });

  it('muestra la ilustración sin animar si se pidió reducir el movimiento', async () => {
    jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
    const setValue = jest.spyOn(Animated.Value.prototype, 'setValue');

    await render(<PokemonHero {...props} imageUrl="25.png" />);

    await waitFor(() => expect(setValue).toHaveBeenCalledWith(1));
  });
});
