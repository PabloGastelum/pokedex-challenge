import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { DetailBody } from './DetailBody';

describe('DetailBody', () => {
  it('muestra su contenido', async () => {
    await render(
      <DetailBody>
        <Text>Contenido</Text>
      </DetailBody>,
    );

    expect(screen.getByText('Contenido')).toBeTruthy();
  });
});
