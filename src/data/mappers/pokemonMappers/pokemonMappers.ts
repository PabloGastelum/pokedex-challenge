import type {
  NamedResourceDto,
  PokemonDetailDto,
  PokemonListResponseDto,
} from '@/data/dtos/PokeApiDtos';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';
import { AppError } from '@/domain/errors/AppError';
import type { PokemonDetail, PokemonPage, PokemonSummary } from '@/domain/models/Pokemon';

const KNOWN_TYPES = new Set<string>(Object.values(PokemonTypeName));
const KNOWN_STATS = new Set<string>(Object.values(StatName));

const invalid = (message: string) => new AppError(AppErrorCode.InvalidData, message);

export function extractIdFromUrl(url: string): number | null {
  const match = /\/pokemon\/(\d+)\/?$/.exec(url);
  return match?.[1] ? Number(match[1]) : null;
}

export function buildArtworkUrl(baseUrl: string, id: number): string {
  return `${baseUrl}/${id}.png`;
}

function toSummary({ name, url }: NamedResourceDto, artworkBaseUrl: string): PokemonSummary {
  const id = extractIdFromUrl(url);
  if (id === null) throw invalid(`URL de Pokémon inesperada: ${url}`);
  return { id, name, imageUrl: buildArtworkUrl(artworkBaseUrl, id) };
}

export function toPokemonPage(
  dto: PokemonListResponseDto,
  offset: number,
  artworkBaseUrl: string,
): PokemonPage {
  if (!Array.isArray(dto?.results)) throw invalid('El listado no contiene resultados');

  const items = dto.results.map((result) => toSummary(result, artworkBaseUrl));
  const hasMore = dto.next !== null && items.length > 0;

  return {
    items,
    nextOffset: hasMore ? offset + items.length : null,
    totalCount: dto.count,
  };
}

export function toPokemonDetail(dto: PokemonDetailDto): PokemonDetail {
  if (!Number.isInteger(dto?.id) || !dto.name) throw invalid('El detalle no tiene id o nombre');

  return {
    id: dto.id,
    name: dto.name,
    imageUrl:
      dto.sprites?.other?.['official-artwork']?.front_default ?? dto.sprites?.front_default ?? null,
    types: [...(dto.types ?? [])]
      .sort((a, b) => a.slot - b.slot)
      .map(({ type }) =>
        KNOWN_TYPES.has(type.name) ? (type.name as PokemonTypeName) : PokemonTypeName.Unknown,
      ),
    abilities: [...(dto.abilities ?? [])]
      .sort((a, b) => a.slot - b.slot)
      .map(({ ability, is_hidden }) => ({ name: ability.name, isHidden: is_hidden })),
    stats: (dto.stats ?? [])
      .filter(({ stat }) => KNOWN_STATS.has(stat.name))
      .map(({ stat, base_stat }) => ({ name: stat.name as StatName, value: base_stat })),
    heightInDecimetres: dto.height,
    weightInHectograms: dto.weight,
    baseExperience: dto.base_experience ?? null,
  };
}
