import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { typeColors } from '@/presentation/theme';
import { INK, WHITE } from '@/presentation/utils/contrast';

import { getHeroColors } from './pokemonColors';

describe('getHeroColors', () => {
  it('usa el primer tipo como fondo', () => {
    const { background } = getHeroColors([PokemonTypeName.Fire, PokemonTypeName.Flying]);

    expect(background).toBe(typeColors[PokemonTypeName.Fire]);
  });

  it('usa barra de estado oscura sobre un fondo claro', () => {
    expect(getHeroColors([PokemonTypeName.Electric])).toMatchObject({
      foreground: INK,
      statusBarStyle: 'dark',
    });
  });

  it('usa barra de estado clara sobre un fondo oscuro', () => {
    expect(getHeroColors([PokemonTypeName.Dragon])).toMatchObject({
      foreground: WHITE,
      statusBarStyle: 'light',
    });
  });

  it('cae en el color desconocido si no hay tipos', () => {
    expect(getHeroColors([]).background).toBe(typeColors[PokemonTypeName.Unknown]);
  });
});
