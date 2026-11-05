import { render, screen } from '@testing-library/react-native';

import { MeasureItem } from './MeasureItem';

describe('MeasureItem', () => {
  it('anuncia la etiqueta y el valor', async () => {
    await render(<MeasureItem label="Peso" value="6.9 kg" />);

    expect(screen.getByLabelText('Peso: 6.9 kg')).toBeTruthy();
  });

  it('usa el texto completo para lectores de pantalla si la etiqueta va abreviada', async () => {
    await render(<MeasureItem label="Exp. base" spokenLabel="Experiencia base" value="64" />);

    expect(screen.getByLabelText('Experiencia base: 64')).toBeTruthy();
    expect(screen.getByText('Exp. base', { includeHiddenElements: true })).toBeTruthy();
  });
});
