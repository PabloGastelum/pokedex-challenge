import { render, screen } from '@testing-library/react-native';

import { STALE_DATA_MESSAGE } from '@/presentation/utils/labels';

import { PokemonListHeader } from './PokemonListHeader';

describe('PokemonListHeader', () => {
  it('muestra el título y el total, sin aviso con datos al día', async () => {
    await render(<PokemonListHeader isStale={false} totalCount={1351} />);

    expect(screen.getByRole('header', { name: 'Pokédex' })).toBeTruthy();
    expect(screen.getByText('1,351 Pokémon')).toBeTruthy();
    expect(screen.queryByText(STALE_DATA_MESSAGE)).toBeNull();
  });

  it('avisa cuando los datos son guardados', async () => {
    await render(<PokemonListHeader isStale totalCount={1351} />);

    expect(screen.getByText(STALE_DATA_MESSAGE)).toBeTruthy();
  });
});
