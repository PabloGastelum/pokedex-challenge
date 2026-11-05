import { render, screen } from '@testing-library/react-native';

import { PokemonGridSkeleton } from './PokemonGridSkeleton';

describe('PokemonGridSkeleton', () => {
  it('se anuncia como carga', async () => {
    await render(<PokemonGridSkeleton columns={2} tileWidth={160} contentWidth={400} />);

    expect(screen.getByLabelText('Cargando Pokémon')).toBeTruthy();
  });

  it.each([
    [2, 8],
    [4, 16],
  ])('con %i columnas dibuja %i tarjetas', async (columns, tiles) => {
    await render(<PokemonGridSkeleton columns={columns} tileWidth={160} contentWidth={800} />);

    expect(screen.getAllByTestId('skeleton', { includeHiddenElements: true })).toHaveLength(
      tiles * 3,
    );
  });
});
