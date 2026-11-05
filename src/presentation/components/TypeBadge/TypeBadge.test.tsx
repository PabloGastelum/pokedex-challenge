import { render, screen } from '@testing-library/react-native';

import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { typeColors } from '@/presentation/theme';
import { readableOn } from '@/presentation/utils/contrast';

import { TypeBadge } from './TypeBadge';

describe('TypeBadge', () => {
  it('traduce el tipo y usa un texto legible sobre su color', async () => {
    await render(<TypeBadge type={PokemonTypeName.Fire} />);

    expect(screen.getByText('Fuego')).toHaveStyle({
      color: readableOn(typeColors[PokemonTypeName.Fire]),
    });
  });
});
