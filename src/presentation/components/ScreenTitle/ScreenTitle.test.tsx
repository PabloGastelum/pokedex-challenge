import { render, screen } from '@testing-library/react-native';

import { ScreenTitle } from './ScreenTitle';

describe('ScreenTitle', () => {
  it('se expone como encabezado', async () => {
    await render(<ScreenTitle title="Pokédex" />);

    expect(screen.getByRole('header', { name: 'Pokédex' })).toBeTruthy();
  });
});
