import { render, screen } from '@testing-library/react-native';

import { PokemonDetailTitle } from './PokemonDetailTitle';

describe('PokemonDetailTitle', () => {
  it('muestra el nombre como encabezado y el número', async () => {
    await render(<PokemonDetailTitle name="Pikachu" id={25} />);

    expect(screen.getByRole('header', { name: 'Pikachu' })).toBeTruthy();
    expect(screen.getByText('#025')).toBeTruthy();
  });
});
