import { render } from '@testing-library/react-native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ReactNative from 'react-native';

import { darkColors, lightColors } from '@/presentation/theme';

import { AppNavigator } from './AppNavigator';

jest.mock('expo-status-bar', () => ({ StatusBar: jest.fn(() => null) }));
jest.mock('expo-router', () => ({ Stack: jest.fn(() => null) }));

const firstProps = (component: unknown) =>
  (component as jest.Mock).mock.calls[0]?.[0] as Record<string, unknown>;

describe('AppNavigator', () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it.each([
    ['light', 'dark', lightColors],
    ['dark', 'light', darkColors],
  ] as const)('con el esquema %s usa barra %s y su fondo', async (scheme, barStyle, colors) => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(scheme);

    await render(<AppNavigator />);

    expect(firstProps(StatusBar)).toMatchObject({ style: barStyle });
    expect(firstProps(Stack).screenOptions).toMatchObject({
      contentStyle: { backgroundColor: colors.background },
    });
  });

  it('oculta la cabecera nativa: cada pantalla dibuja la suya', async () => {
    await render(<AppNavigator />);

    expect(firstProps(Stack).screenOptions).toMatchObject({ headerShown: false });
  });
});
