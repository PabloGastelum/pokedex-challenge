import type { PokemonDetail } from '@/domain/models/Pokemon';

export interface PokemonDetailContentProps {
  readonly detail: PokemonDetail;
  readonly isStale: boolean;
}
