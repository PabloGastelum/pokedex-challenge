import type { AppError } from '@/domain/errors/AppError';
import type { PagingStatus } from '@/presentation/context/PokemonListContext';

export interface PokemonListFooterProps {
  readonly paging: PagingStatus;
  readonly error: AppError | null;
  readonly onRetry: () => void;
}
