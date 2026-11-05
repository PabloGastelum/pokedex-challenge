import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { AppError } from '@/domain/errors/AppError';
import { errorCopy } from '@/presentation/utils/labels';

import { AppErrorFallback } from './AppErrorFallback';

const retry = jest.fn().mockResolvedValue(undefined);

describe('AppErrorFallback', () => {
  beforeEach(() => retry.mockClear());

  it('muestra un mensaje genérico para un error de render, sin el detalle técnico', async () => {
    await render(<AppErrorFallback error={new TypeError('x is undefined')} retry={retry} />);

    expect(screen.getByText(errorCopy[AppErrorCode.Unknown].title)).toBeTruthy();
    expect(screen.queryByText('x is undefined')).toBeNull();
  });

  it('respeta el código de un AppError', async () => {
    await render(
      <AppErrorFallback error={new AppError(AppErrorCode.Network, 'x')} retry={retry} />,
    );

    expect(screen.getByText(errorCopy[AppErrorCode.Network].title)).toBeTruthy();
  });

  it('permite reintentar', async () => {
    await render(<AppErrorFallback error={new Error('x')} retry={retry} />);

    await fireEvent.press(screen.getByRole('button', { name: 'Reintentar' }));

    expect(retry).toHaveBeenCalledTimes(1);
  });
});
