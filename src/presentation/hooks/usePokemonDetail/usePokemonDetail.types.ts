import type { AppError } from '@/domain/errors/AppError';
import type { PokemonDetail } from '@/domain/models/Pokemon';

export type PokemonDetailState =
  | { readonly status: 'loading' }
  | { readonly status: 'error'; readonly error: AppError }
  | { readonly status: 'ready'; readonly detail: PokemonDetail; readonly isStale: boolean };

export type UsePokemonDetailResult = PokemonDetailState & { readonly retry: () => void };
