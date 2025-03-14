module.exports = {
  env: {
    browser: true,
    'jest/globals': true,
  },
  extends: [
    'eslint:recommended', // Базовые рекомендации от ESLint
    'plugin:@typescript-eslint/recommended', // Рекомендации для TypeScript
    'plugin:react/recommended', // Рекомендации для React
    'plugin:react/jsx-runtime',
    'plugin:react-native/all', // Рекомендации для React Native
    'plugin:prettier/recommended', // Включает Prettier и конфликтующие ESLint-правила отключает
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'jest'],
  parser: '@typescript-eslint/parser',
  rules: {
    camelcase: 0,
    'import/no-default-export': 0,
    'no-useless-escape': 0,
    '@typescript-eslint/member-delimiter-style': 0, // comma in TS interfaces

    'no-console': 1,
    'react-native/no-inline-styles': 1, // allow inline styles
    'react-native/no-unused-styles': 1, //no unused styles
    'react-native/no-color-literals': 0,
    'react/prefer-stateless-function': 2, // only React.FC
    'no-param-reassign': 2,
    'react-native/no-raw-text': 0,
    'no-else-return': ['error', {allowElseIf: false}],
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
};
