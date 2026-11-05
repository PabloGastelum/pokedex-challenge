import type { AppError } from '@/domain/errors/AppError';

export interface ErrorViewProps {
  readonly error: AppError;
  readonly onRetry: () => void;
}
