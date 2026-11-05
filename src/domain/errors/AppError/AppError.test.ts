import { AppErrorCode } from '@/domain/enums/AppErrorCode';

import { AppError } from './AppError';

describe('AppError', () => {
  it('guarda el código, el mensaje y la causa', () => {
    const cause = new Error('original');
    const error = new AppError(AppErrorCode.Network, 'sin red', { cause });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('AppError');
    expect(error.code).toBe(AppErrorCode.Network);
    expect(error.message).toBe('sin red');
    expect(error.cause).toBe(cause);
  });

  describe('from', () => {
    it('devuelve el mismo error si ya es un AppError', () => {
      const error = new AppError(AppErrorCode.Timeout, 'tarde');

      expect(AppError.from(error)).toBe(error);
    });

    it('envuelve un Error conservando el mensaje y la causa', () => {
      const original = new TypeError('roto');

      expect(AppError.from(original)).toMatchObject({
        code: AppErrorCode.Unknown,
        message: 'roto',
        cause: original,
      });
    });

    it.each(['texto', 42, null, undefined])('acepta el valor no Error %j', (value) => {
      expect(AppError.from(value)).toMatchObject({
        code: AppErrorCode.Unknown,
        message: 'Error desconocido',
      });
    });
  });
});
