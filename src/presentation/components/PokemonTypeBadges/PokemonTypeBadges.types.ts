import type { PokemonTypeName } from '@/domain/enums/PokemonTypeName';

export interface PokemonTypeBadgesProps {
  readonly types: readonly PokemonTypeName[];
}
