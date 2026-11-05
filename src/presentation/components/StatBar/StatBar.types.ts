import type { PokemonStat } from '@/domain/models/Pokemon';

export interface StatBarProps {
  readonly stat: PokemonStat;
  readonly color: string;
}
