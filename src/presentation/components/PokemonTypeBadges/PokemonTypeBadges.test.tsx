import { render, screen } from '@testing-library/react-native';

import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';

import { PokemonTypeBadges } from './PokemonTypeBadges';

describe('PokemonTypeBadges', () => {
  it('muestra una insignia por tipo', async () => {
    await render(<PokemonTypeBadges types={[PokemonTypeName.Grass, PokemonTypeName.Poison]} />);

    expect(screen.getByText('Planta')).toBeTruthy();
    expect(screen.getByText('Veneno')).toBeTruthy();
  });
});
