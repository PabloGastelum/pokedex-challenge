import { AppErrorCode } from '@/domain/enums/AppErrorCode';

export class AppError extends Error {
  readonly code: AppErrorCode;

  constructor(code: AppErrorCode, message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'AppError';
    this.code = code;
  }

  static from(error: unknown): AppError {
    if (error instanceof AppError) return error;
    const message = error instanceof Error ? error.message : 'Error desconocido';
    return new AppError(AppErrorCode.Unknown, message, { cause: error });
  }
}
