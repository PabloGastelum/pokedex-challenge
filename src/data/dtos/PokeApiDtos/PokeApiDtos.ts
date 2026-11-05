export interface NamedResourceDto {
  name: string;
  url: string;
}

export interface PokemonListResponseDto {
  count: number;
  next: string | null;
  previous: string | null;
  results: NamedResourceDto[];
}

export interface PokemonDetailDto {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number | null;
  types: { slot: number; type: NamedResourceDto }[];
  abilities: { is_hidden: boolean; slot: number; ability: NamedResourceDto }[];
  stats: { base_stat: number; stat: NamedResourceDto }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: { front_default: string | null };
    };
  };
}
