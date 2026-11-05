import { renderHook } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';

import { calculatePokemonGrid, GRID_GUTTER, usePokemonGrid } from './usePokemonGrid';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('calculatePokemonGrid', () => {
  it.each([
    [320, 2],
    [599, 2],
    [600, 3],
    [899, 3],
    [900, 4],
    [2000, 4],
  ])('con un ancho de %i usa %i columnas', (width, columns) => {
    expect(calculatePokemonGrid(width).columns).toBe(columns);
  });

  it('no deja que la cuadrícula se desborde', () => {
    [320, 402, 768, 1024, 1200].forEach((width) => {
      const { columns, tileWidth, contentWidth } = calculatePokemonGrid(width);

      expect(columns * tileWidth + GRID_GUTTER * (columns + 1)).toBeLessThanOrEqual(contentWidth);
    });
  });

  it('limita el ancho del contenido en pantallas muy grandes', () => {
    expect(calculatePokemonGrid(2000).contentWidth).toBe(1200);
  });
});

describe('usePokemonGrid', () => {
  it('calcula la cuadrícula con el ancho de la ventana', async () => {
    jest
      .mocked(useWindowDimensions)
      .mockReturnValue({ width: 768, height: 1024, scale: 2, fontScale: 1 });

    const { result } = await renderHook(() => usePokemonGrid());

    expect(result.current).toEqual(calculatePokemonGrid(768));
  });
});
