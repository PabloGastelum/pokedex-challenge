import { render, screen } from '@testing-library/react-native';

import { PokemonDetailSkeleton } from './PokemonDetailSkeleton';

describe('PokemonDetailSkeleton', () => {
  it('se anuncia como carga', async () => {
    await render(<PokemonDetailSkeleton />);

    expect(screen.getByLabelText('Cargando ficha')).toBeTruthy();
  });
});
