const { defineConfig, globalIgnores } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const prettierConfig = require('eslint-config-prettier/flat');

const FRAMEWORKS = ['react', 'react-native', 'expo*', 'inversify'];

const INTERNAL_FILES = [
  '@/domain/*/*/*',
  '@/data/*/*/*',
  '@/infrastructure/*/*/*',
  '@/presentation/*/*/*',
  '@/presentation/theme/*',
  '@/di/*/*',
  '../*',
];

const rules = (files, forbidden, message) => ({
  files,
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          { group: INTERNAL_FILES, message: 'Importa desde el barrel de la pieza.' },
          ...(forbidden.length ? [{ group: forbidden, message }] : []),
        ],
      },
    ],
  },
});

module.exports = defineConfig([
  globalIgnores(['.expo/**', 'coverage/**', 'dist/**']),
  expoConfig,
  prettierConfig,
  rules(
    ['src/domain/**'],
    ['@/data/*', '@/infrastructure/*', '@/presentation/*', '@/di/*', ...FRAMEWORKS],
    'domain no depende de otras capas ni de frameworks.',
  ),
  rules(
    ['src/data/**'],
    ['@/infrastructure/*', '@/presentation/*', '@/di/*', ...FRAMEWORKS],
    'data solo conoce domain y sus propias interfaces.',
  ),
  rules(
    ['src/infrastructure/**'],
    ['@/presentation/*', '@/di/*', 'inversify'],
    'infrastructure implementa interfaces de data; no conoce la UI ni el contenedor.',
  ),
  rules(
    ['src/presentation/**'],
    ['@/data/*', '@/infrastructure/*', '@/di/*', 'inversify'],
    'presentation solo conoce domain; las dependencias llegan por contexto.',
  ),
  rules(['src/app/**', 'src/di/**'], []),
  { files: ['jest.setup.js'], languageOptions: { globals: { jest: 'readonly' } } },
]);
