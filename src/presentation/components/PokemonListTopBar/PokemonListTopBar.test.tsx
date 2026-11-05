import { render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { PokemonListTopBar } from './PokemonListTopBar';

describe('PokemonListTopBar', () => {
  it('muestra el título pero lo oculta a los lectores de pantalla', async () => {
    await render(<PokemonListTopBar title="Pokédex" scrollY={new Animated.Value(0)} />);

    expect(screen.queryByText('Pokédex')).toBeNull();
    expect(screen.getByText('Pokédex', { includeHiddenElements: true })).toBeTruthy();
  });

  it('aparece según el desplazamiento de la lista', async () => {
    const scrollY = new Animated.Value(0);
    const interpolate = jest.spyOn(scrollY, 'interpolate');

    await render(<PokemonListTopBar title="Pokédex" scrollY={scrollY} />);

    expect(interpolate).toHaveBeenCalledWith(
      expect.objectContaining({ outputRange: [0, 1], extrapolate: 'clamp' }),
    );
  });
});
