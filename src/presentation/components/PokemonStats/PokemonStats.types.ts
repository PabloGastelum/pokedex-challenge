import type { PokemonStat } from '@/domain/models/Pokemon';

export interface PokemonStatsProps {
  readonly stats: readonly PokemonStat[];
  readonly color: string;
}
