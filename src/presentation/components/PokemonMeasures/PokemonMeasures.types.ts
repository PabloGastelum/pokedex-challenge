import type { PokemonDetail } from '@/domain/models/Pokemon';

export type PokemonMeasuresProps = Pick<
  PokemonDetail,
  'heightInDecimetres' | 'weightInHectograms' | 'baseExperience'
>;
