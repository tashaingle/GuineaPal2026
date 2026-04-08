import reactNative from 'eslint-plugin-react-native';
import globals from 'globals';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.serviceworker,
        ...globals.node,
        ...globals.browser
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      'react-native': reactNative
    },
    rules: {
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'no-require-imports': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];