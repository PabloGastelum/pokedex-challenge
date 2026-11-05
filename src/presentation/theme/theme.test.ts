import { renderHook } from '@testing-library/react-native';
import * as ReactNative from 'react-native';

import { PokemonTypeName } from '@/domain/enums/PokemonTypeName';
import { contrastRatio, readableOn } from '@/presentation/utils/contrast';

import { darkColors, lightColors, typeColors, useThemeColors } from './theme';

const AA_TEXT = 4.5;

describe('contraste del tema', () => {
  it.each(Object.values(PokemonTypeName))('el texto sobre el tipo %s cumple AA', (type) => {
    const background = typeColors[type];

    expect(contrastRatio(background, readableOn(background))).toBeGreaterThanOrEqual(AA_TEXT);
  });

  it.each([
    ['claro', lightColors],
    ['oscuro', darkColors],
  ])('los pares de texto del tema %s cumplen AA', (_, colors) => {
    expect(contrastRatio(colors.background, colors.text)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(colors.background, colors.textMuted)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(colors.surface, colors.textMuted)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(colors.primary, colors.onPrimary)).toBeGreaterThanOrEqual(AA_TEXT);
    expect(contrastRatio(colors.notice, colors.onNotice)).toBeGreaterThanOrEqual(AA_TEXT);
  });
});

describe('useThemeColors', () => {
  afterEach(() => jest.restoreAllMocks());

  it.each([
    ['dark', darkColors],
    ['light', lightColors],
    [null, lightColors],
  ] as const)('con el esquema %s usa la paleta correcta', async (scheme, expected) => {
    jest
      .spyOn(ReactNative, 'useColorScheme')
      .mockReturnValue(scheme as ReactNative.ColorSchemeName);

    const { result } = await renderHook(() => useThemeColors());

    expect(result.current).toBe(expected);
  });
});
