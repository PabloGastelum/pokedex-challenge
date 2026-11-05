import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DetailSection } from './DetailSection';

describe('DetailSection', () => {
  it('muestra el título como encabezado y su contenido', async () => {
    await render(
      <DetailSection title="Habilidades" trailing={<Text>318</Text>}>
        <Text>Overgrow</Text>
      </DetailSection>,
    );

    expect(screen.getByRole('header', { name: 'Habilidades' })).toBeTruthy();
    expect(screen.getByText('318')).toBeTruthy();
    expect(screen.getByText('Overgrow')).toBeTruthy();
  });
});
