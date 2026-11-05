import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { errorCopy } from '@/presentation/utils/labels';

import { ErrorView } from './ErrorView';

describe('ErrorView', () => {
  it.each(Object.values(AppErrorCode))('muestra el texto amigable del error %s', async (code) => {
    await render(<ErrorView error={new AppError(code, 'detalle técnico')} onRetry={jest.fn()} />);

    expect(screen.getByText(errorCopy[code].title)).toBeTruthy();
    expect(screen.getByText(errorCopy[code].message)).toBeTruthy();
    expect(screen.queryByText('detalle técnico')).toBeNull();
  });

  it('permite reintentar', async () => {
    const onRetry = jest.fn();
    await render(<ErrorView error={new AppError(AppErrorCode.Network, 'x')} onRetry={onRetry} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
