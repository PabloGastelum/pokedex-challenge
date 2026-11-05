import { fireEvent, render, screen } from '@testing-library/react-native';

import { StateView } from './StateView';

describe('StateView', () => {
  it('muestra el título como encabezado y el mensaje', async () => {
    await render(<StateView title="Vacío" message="No hay datos" />);

    expect(screen.getByRole('header', { name: 'Vacío' })).toBeTruthy();
    expect(screen.getByText('No hay datos')).toBeTruthy();
  });

  it('muestra la acción y responde al presionarla', async () => {
    const onAction = jest.fn();
    await render(<StateView title="t" message="m" actionLabel="Reintentar" onAction={onAction} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it.each([[{ actionLabel: 'Reintentar' }], [{ onAction: () => undefined }], [{}]])(
    'no muestra un botón incompleto con %j',
    async (props) => {
      await render(<StateView title="t" message="m" {...props} />);

      expect(screen.queryByRole('button')).toBeNull();
    },
  );
});
