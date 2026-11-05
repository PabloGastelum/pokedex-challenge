export interface AppConfig {
  readonly pokeApiBaseUrl: string;
  readonly artworkBaseUrl: string;
}

export type RawAppConfig = {
  readonly [Key in keyof AppConfig]?: string;
};
