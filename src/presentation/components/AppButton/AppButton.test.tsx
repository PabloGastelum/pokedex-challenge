import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppButton } from './AppButton';

describe('AppButton', () => {
  it('se expone como botón con su etiqueta', async () => {
    await render(<AppButton label="Reintentar" onPress={jest.fn()} />);

    expect(screen.getByRole('button', { name: 'Reintentar' })).toBeTruthy();
  });

  it('avisa al presionarse', async () => {
    const onPress = jest.fn();
    await render(<AppButton label="Reintentar" onPress={onPress} />);

    await fireEvent.press(screen.getByRole('button'));

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
