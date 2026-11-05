import type { PokemonDetailDto, PokemonListResponseDto } from '@/data/dtos/PokeApiDtos';
import { AppErrorCode } from '@/domain/enums/AppErrorCode';
import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { StatName } from '@/domain/enums/StatName';

import {
  buildArtworkUrl,
  extractIdFromUrl,
  toPokemonDetail,
  toPokemonPage,
} from './pokemonMappers';

const ART = 'https://img.test';

const listDto = (overrides: Partial<PokemonListResponseDto> = {}): PokemonListResponseDto => ({
  count: 1351,
  next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
  previous: null,
  results: [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ],
  ...overrides,
});

const detailDto = (overrides: Partial<PokemonDetailDto> = {}): PokemonDetailDto => ({
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  base_experience: 64,
  types: [
    { slot: 2, type: { name: 'poison', url: '' } },
    { slot: 1, type: { name: 'grass', url: '' } },
  ],
  abilities: [
    { slot: 3, is_hidden: true, ability: { name: 'chlorophyll', url: '' } },
    { slot: 1, is_hidden: false, ability: { name: 'overgrow', url: '' } },
  ],
  stats: [
    { base_stat: 45, stat: { name: 'hp', url: '' } },
    { base_stat: 1, stat: { name: 'stat-futura', url: '' } },
  ],
  sprites: {
    front_default: 'sprite.png',
    other: { 'official-artwork': { front_default: 'artwork.png' } },
  },
  ...overrides,
});

describe('extractIdFromUrl', () => {
  it.each([
    ['https://pokeapi.co/api/v2/pokemon/25/', 25],
    ['https://pokeapi.co/api/v2/pokemon/10001', 10001],
    ['https://pokeapi.co/api/v2/ability/25/', null],
    ['no-es-url', null],
  ])('%s -> %s', (url, expected) => {
    expect(extractIdFromUrl(url)).toBe(expected);
  });
});

describe('buildArtworkUrl', () => {
  it('arma la dirección con la base recibida', () => {
    expect(buildArtworkUrl(ART, 25)).toBe('https://img.test/25.png');
  });
});

describe('toPokemonPage', () => {
  it('deriva id e imagen y calcula el siguiente offset', () => {
    const page = toPokemonPage(listDto(), 20, ART);

    expect(page.items[0]).toEqual({ id: 1, name: 'bulbasaur', imageUrl: 'https://img.test/1.png' });
    expect(page.nextOffset).toBe(22);
    expect(page.totalCount).toBe(1351);
  });

  it('termina la paginación cuando no hay siguiente página', () => {
    expect(toPokemonPage(listDto({ next: null }), 0, ART).nextOffset).toBeNull();
  });

  it('no sigue paginando con una página vacía aunque venga `next`', () => {
    expect(toPokemonPage(listDto({ results: [] }), 0, ART).nextOffset).toBeNull();
  });

  it('rechaza una respuesta sin resultados o con URLs inesperadas', () => {
    const noResults = { count: 0 } as unknown as PokemonListResponseDto;
    const badUrl = listDto({ results: [{ name: 'x', url: 'https://otro.sitio/x' }] });

    expect(() => toPokemonPage(noResults, 0, ART)).toThrow(
      expect.objectContaining({ code: AppErrorCode.InvalidData }),
    );
    expect(() => toPokemonPage(badUrl, 0, ART)).toThrow(
      expect.objectContaining({ code: AppErrorCode.InvalidData }),
    );
  });
});

describe('toPokemonDetail', () => {
  it('mapea el detalle ordenando tipos y habilidades por slot', () => {
    const detail = toPokemonDetail(detailDto());

    expect(detail.types).toEqual([PokemonTypeName.Grass, PokemonTypeName.Poison]);
    expect(detail.abilities).toEqual([
      { name: 'overgrow', isHidden: false },
      { name: 'chlorophyll', isHidden: true },
    ]);
    expect(detail.heightInDecimetres).toBe(7);
    expect(detail.weightInHectograms).toBe(69);
    expect(detail.baseExperience).toBe(64);
    expect(detail.imageUrl).toBe('artwork.png');
  });

  it('descarta estadísticas desconocidas y marca tipos desconocidos', () => {
    const detail = toPokemonDetail(
      detailDto({ types: [{ slot: 1, type: { name: 'stellar', url: '' } }] }),
    );

    expect(detail.stats).toEqual([{ name: StatName.Hp, value: 45 }]);
    expect(detail.types).toEqual([PokemonTypeName.Unknown]);
  });

  it('usa el sprite básico o null cuando falta la ilustración', () => {
    expect(toPokemonDetail(detailDto({ sprites: { front_default: 's.png' } })).imageUrl).toBe(
      's.png',
    );
    expect(toPokemonDetail(detailDto({ sprites: { front_default: null } })).imageUrl).toBeNull();
  });

  it('acepta experiencia base nula', () => {
    expect(toPokemonDetail(detailDto({ base_experience: null })).baseExperience).toBeNull();
  });

  it('tolera una respuesta sin listas ni imágenes', () => {
    const dto = { id: 1, name: 'x', height: 1, weight: 1 } as PokemonDetailDto;

    expect(toPokemonDetail(dto)).toMatchObject({
      types: [],
      abilities: [],
      stats: [],
      imageUrl: null,
      baseExperience: null,
    });
  });

  it('no modifica los arreglos del DTO al ordenar', () => {
    const dto = detailDto();
    const firstType = dto.types[0];

    toPokemonDetail(dto);

    expect(dto.types[0]).toBe(firstType);
  });

  it('rechaza un detalle sin id', () => {
    const dto = { name: 'x' } as PokemonDetailDto;

    expect(() => toPokemonDetail(dto)).toThrow(
      expect.objectContaining({ code: AppErrorCode.InvalidData }),
    );
  });
});
