import type { PokemonAbility } from '@/domain/models/Pokemon';

export interface PokemonAbilitiesProps {
  readonly abilities: readonly PokemonAbility[];
}
