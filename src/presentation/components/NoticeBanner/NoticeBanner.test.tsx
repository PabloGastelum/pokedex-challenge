import { render, screen } from '@testing-library/react-native';

import { NoticeBanner } from './NoticeBanner';

describe('NoticeBanner', () => {
  it('muestra el mensaje', async () => {
    await render(<NoticeBanner message="Sin conexión" />);

    expect(screen.getByText('Sin conexión')).toBeTruthy();
  });
});
