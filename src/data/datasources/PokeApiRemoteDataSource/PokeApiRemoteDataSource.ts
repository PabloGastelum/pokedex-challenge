import type { PokemonDetailDto, PokemonListResponseDto } from '@/data/dtos/PokeApiDtos';
import type { HttpClient } from '@/data/interfaces/HttpClient';
import type { PokemonRemoteDataSource } from '@/data/interfaces/PokemonDataSources';
import { toPokemonDetail, toPokemonPage } from '@/data/mappers/pokemonMappers';
import type { PokemonDetail, PokemonPage } from '@/domain/models/Pokemon';

export class PokeApiRemoteDataSource implements PokemonRemoteDataSource {
  constructor(
    private readonly http: HttpClient,
    private readonly artworkBaseUrl: string,
  ) {}

  async fetchPage(offset: number, limit: number): Promise<PokemonPage> {
    const dto = await this.http.getJson<PokemonListResponseDto>(
      `/pokemon?offset=${offset}&limit=${limit}`,
    );
    return toPokemonPage(dto, offset, this.artworkBaseUrl);
  }

  async fetchDetail(id: number): Promise<PokemonDetail> {
    const dto = await this.http.getJson<PokemonDetailDto>(`/pokemon/${id}`);
    return toPokemonDetail(dto);
  }
}
