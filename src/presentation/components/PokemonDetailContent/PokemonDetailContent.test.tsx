import { render, screen } from '@testing-library/react-native';
import * as SafeArea from 'react-native-safe-area-context';

import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { createDetail } from '@/presentation/test-utils';
import { typeColors } from '@/presentation/theme';
import { STALE_DATA_MESSAGE } from '@/presentation/utils/labels';

import { PokemonDetailContent } from './PokemonDetailContent';

describe('PokemonDetailContent', () => {
  it('reúne todas las secciones de la ficha', async () => {
    await render(<PokemonDetailContent detail={createDetail()} isStale={false} />);

    expect(screen.getByLabelText('Ilustración de Bulbasaur')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Bulbasaur' })).toBeTruthy();
    expect(screen.getByText('Planta')).toBeTruthy();
    expect(screen.getByLabelText('Altura: 0.7 m')).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Habilidades' })).toBeTruthy();
    expect(screen.getByRole('header', { name: 'Estadísticas base' })).toBeTruthy();
    expect(screen.queryByText(STALE_DATA_MESSAGE)).toBeNull();
  });

  it('avisa cuando los datos son guardados', async () => {
    await render(<PokemonDetailContent detail={createDetail()} isStale />);

    expect(screen.getByText(STALE_DATA_MESSAGE)).toBeTruthy();
  });

  it('mantiene el color del Pokémon detrás de la barra de estado', async () => {
    jest
      .spyOn(SafeArea, 'useSafeAreaInsets')
      .mockReturnValue({ top: 59, bottom: 0, left: 0, right: 0 });

    await render(<PokemonDetailContent detail={createDetail()} isStale={false} />);

    expect(screen.getByTestId('status-backdrop', { includeHiddenElements: true })).toHaveStyle({
      height: 59,
      backgroundColor: typeColors[PokemonTypeName.Grass],
    });
    jest.restoreAllMocks();
  });

  it('funciona con un Pokémon sin tipos ni imagen', async () => {
    await render(
      <PokemonDetailContent detail={createDetail({ types: [], imageUrl: null })} isStale={false} />,
    );

    expect(screen.getByText('Sin imagen')).toBeTruthy();
  });
});
