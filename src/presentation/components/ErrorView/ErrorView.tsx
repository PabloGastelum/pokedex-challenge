import { StateView } from '@/presentation/components/StateView';
import { errorCopy } from '@/presentation/utils/labels';

import type { ErrorViewProps } from './ErrorView.types';

export function ErrorView({ error, onRetry }: ErrorViewProps) {
  const copy = errorCopy[error.code];

  return (
    <StateView
      title={copy.title}
      message={copy.message}
      actionLabel="Reintentar"
      onAction={onRetry}
    />
  );
}
