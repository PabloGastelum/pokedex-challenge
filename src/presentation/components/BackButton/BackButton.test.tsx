import { fireEvent, render, screen } from '@testing-library/react-native';
import { useRouter } from 'expo-router';

import { BackButton } from './BackButton';

jest.mock('expo-router', () => ({ useRouter: jest.fn() }));

function setup(canGoBack: boolean) {
  const router = { canGoBack: () => canGoBack, back: jest.fn(), replace: jest.fn() };
  jest.mocked(useRouter).mockReturnValue(router as unknown as ReturnType<typeof useRouter>);
  return router;
}

describe('BackButton', () => {
  it('se anuncia como un botón para volver', async () => {
    setup(true);

    await render(<BackButton />);

    expect(screen.getByRole('button', { name: 'Volver' })).toBeTruthy();
  });

  it('vuelve a la pantalla anterior', async () => {
    const router = setup(true);
    await render(<BackButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Volver' }));

    expect(router.back).toHaveBeenCalledTimes(1);
    expect(router.replace).not.toHaveBeenCalled();
  });

  it('va a la lista si se entró por un enlace directo', async () => {
    const router = setup(false);
    await render(<BackButton />);

    await fireEvent.press(screen.getByRole('button', { name: 'Volver' }));

    expect(router.replace).toHaveBeenCalledWith('/');
    expect(router.back).not.toHaveBeenCalled();
  });
});
