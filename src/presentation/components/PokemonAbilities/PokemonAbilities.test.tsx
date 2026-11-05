import { render, screen } from '@testing-library/react-native';

import { PokemonAbilities } from './PokemonAbilities';

describe('PokemonAbilities', () => {
  it('muestra una etiqueta por habilidad y marca solo las ocultas', async () => {
    await render(
      <PokemonAbilities
        abilities={[
          { name: 'solar-power', isHidden: true },
          { name: 'blaze', isHidden: false },
        ]}
      />,
    );

    expect(screen.getByRole('header', { name: 'Habilidades' })).toBeTruthy();
    expect(screen.getByLabelText('Solar Power, habilidad oculta')).toBeTruthy();
    expect(screen.getByLabelText('Blaze')).toBeTruthy();
  });
});
