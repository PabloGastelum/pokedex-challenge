import type { PokemonSummary } from '@/domain/models/Pokemon';

export interface PokemonTileProps {
  readonly pokemon: PokemonSummary;
  readonly width: number;
  readonly onPress: (pokemon: PokemonSummary) => void;
}
