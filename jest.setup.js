jest.mock('expo-image', () => ({ Image: 'ExpoImage' }));
jest.mock(
  'react-native-safe-area-context',
  () => jest.requireActual('react-native-safe-area-context/jest/mock').default,
);
