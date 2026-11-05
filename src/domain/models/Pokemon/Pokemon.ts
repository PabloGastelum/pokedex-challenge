import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';

export interface PokemonSummary {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string;
}

export interface PokemonAbility {
  readonly name: string;
  readonly isHidden: boolean;
}

export interface PokemonStat {
  readonly name: StatName;
  readonly value: number;
}

export interface PokemonDetail {
  readonly id: number;
  readonly name: string;
  readonly imageUrl: string | null;
  readonly types: readonly PokemonTypeName[];
  readonly abilities: readonly PokemonAbility[];
  readonly stats: readonly PokemonStat[];
  readonly heightInDecimetres: number;
  readonly weightInHectograms: number;
  readonly baseExperience: number | null;
}

export interface PokemonPage {
  readonly items: readonly PokemonSummary[];
  readonly nextOffset: number | null;
  readonly totalCount: number;
}
