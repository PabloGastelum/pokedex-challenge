import { renderHook } from '@testing-library/react-native';
import { useWindowDimensions } from 'react-native';
import * as SafeArea from 'react-native-safe-area-context';

import { usePokemonHeroLayout } from './usePokemonHeroLayout';

jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockWindowWidth = (width: number) =>
  jest.mocked(useWindowDimensions).mockReturnValue({ width, height: 800, scale: 2, fontScale: 1 });

describe('usePokemonHeroLayout', () => {
  afterEach(() => jest.restoreAllMocks());

  it('escala la imagen con el ancho de la pantalla', async () => {
    mockWindowWidth(400);

    const { result } = await renderHook(() => usePokemonHeroLayout());

    expect(result.current.imageSize).toBeCloseTo(248);
  });

  it('limita la imagen en pantallas grandes', async () => {
    mockWindowWidth(1200);

    const { result } = await renderHook(() => usePokemonHeroLayout());

    expect(result.current.imageSize).toBe(320);
  });

  it('deja espacio para el área segura y la cabecera', async () => {
    mockWindowWidth(400);
    jest
      .spyOn(SafeArea, 'useSafeAreaInsets')
      .mockReturnValue({ top: 59, bottom: 0, left: 0, right: 0 });

    const { result } = await renderHook(() => usePokemonHeroLayout());

    expect(result.current.paddingTop).toBe(103);
  });
});
