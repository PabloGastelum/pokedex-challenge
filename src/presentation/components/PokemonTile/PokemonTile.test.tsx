import { fireEvent, render, screen } from '@testing-library/react-native';

import { PokemonTile } from './PokemonTile';

const pokemon = { id: 122, name: 'mr-mime', imageUrl: '122.png' };

describe('PokemonTile', () => {
  it('muestra número y nombre formateados', async () => {
    await render(<PokemonTile pokemon={pokemon} width={160} onPress={jest.fn()} />);

    expect(screen.getByText('#122')).toBeTruthy();
    expect(screen.getByText('Mr Mime')).toBeTruthy();
  });

  it('se anuncia como un botón con nombre y número', async () => {
    await render(<PokemonTile pokemon={pokemon} width={160} onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Mr Mime, número 122' })).toBeTruthy();
  });

  it('entrega el Pokémon al presionarse', async () => {
    const onPress = jest.fn();
    await render(<PokemonTile pokemon={pokemon} width={160} onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledWith(pokemon);
  });
});
