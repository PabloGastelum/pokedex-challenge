import { render, screen } from '@testing-library/react-native';

import { PokemonMeasures } from './PokemonMeasures';

describe('PokemonMeasures', () => {
  it('convierte las unidades de PokéAPI', async () => {
    await render(
      <PokemonMeasures heightInDecimetres={7} weightInHectograms={69} baseExperience={64} />,
    );

    expect(screen.getByLabelText('Altura: 0.7 m')).toBeTruthy();
    expect(screen.getByLabelText('Peso: 6.9 kg')).toBeTruthy();
    expect(screen.getByLabelText('Experiencia base: 64')).toBeTruthy();
  });

  it('indica cuando no hay experiencia base', async () => {
    await render(
      <PokemonMeasures heightInDecimetres={7} weightInHectograms={69} baseExperience={null} />,
    );

    expect(screen.getByLabelText('Experiencia base: N/D')).toBeTruthy();
  });

  it('muestra una experiencia base de cero en lugar de ocultarla', async () => {
    await render(
      <PokemonMeasures heightInDecimetres={7} weightInHectograms={69} baseExperience={0} />,
    );

    expect(screen.getByLabelText('Experiencia base: 0')).toBeTruthy();
  });
});
