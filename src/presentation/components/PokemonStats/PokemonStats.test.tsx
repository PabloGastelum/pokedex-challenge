import { render, screen } from '@testing-library/react-native';

import { StatName } from '@/domain/enums/StatName';

import { PokemonStats } from './PokemonStats';

describe('PokemonStats', () => {
  it('muestra una barra por estadística y la suma total', async () => {
    await render(
      <PokemonStats
        color="#000000"
        stats={[
          { name: StatName.Hp, value: 45 },
          { name: StatName.Speed, value: 45 },
        ]}
      />,
    );

    expect(screen.getByLabelText('Salud: 45')).toBeTruthy();
    expect(screen.getByLabelText('Velocidad: 45')).toBeTruthy();
    expect(screen.getByLabelText('Total: 90')).toBeTruthy();
  });

  it('muestra un total de cero sin estadísticas', async () => {
    await render(<PokemonStats color="#000000" stats={[]} />);

    expect(screen.getByLabelText('Total: 0')).toBeTruthy();
  });
});
