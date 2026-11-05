export interface PokemonImageProps {
  readonly uri: string | null;
  readonly label: string;
  readonly fallbackColor: string;
  readonly size?: number;
}
