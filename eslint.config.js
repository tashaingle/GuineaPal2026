import react from 'eslint-plugin-react';
import reactNative from 'eslint-plugin-react-native';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: [
      '**/*.d.ts',
      'scripts/**/*.js',
      'scripts/**/*.ts',
      '.expo/**/*',
      'node_modules/**/*',
      'build/**/*',
      'dist/**/*'
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        location: true,
        history: true,
        localStorage: true,
        sessionStorage: true,
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        fetch: true,
        XMLHttpRequest: true,
        AudioWorkletGlobalScope: true,
        
        // Node.js globals
        process: true,
        __dirname: true,
        __filename: true,
        module: true,
        require: true,
        exports: true,
        
        // ES2021 globals
        Promise: true,
        Symbol: true,
        Map: true,
        Set: true,
        WeakMap: true,
        WeakSet: true,
        Proxy: true,
        Reflect: true,
        Intl: true,

        // React Native globals
        __DEV__: true,
        describe: true,
        it: true,
        expect: true
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true
        },
        project: './tsconfig.json'
      }
    },
    plugins: {
      'react-native': reactNative,
      'react': react,
      '@typescript-eslint': tseslint.plugin
    },
    rules: {
      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': ['warn', { 
        allowExpressions: true,
        allowTypedFunctionExpressions: true,
        allowHigherOrderFunctions: true,
        allowDirectConstAssertionInArrowFunctions: true,
        allowConciseArrowFunctionExpressionsStartingWithVoid: true
      }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unknown-property': 'error',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-unused-vars': 'off', // Using TypeScript version instead
      'no-use-before-define': ['error', { 
        functions: false,
        classes: false,
        variables: false,
        allowNamedExports: true
      }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error'
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  {
    files: ['**/*.{js,jsx}'],
    ignores: [
      'scripts/**/*.js',
      'scripts/**/*.ts',
      '.expo/**/*',
      'node_modules/**/*',
      'build/**/*',
      'dist/**/*'
    ],
    languageOptions: {
      globals: {
        // Browser globals
        window: true,
        document: true,
        navigator: true,
        location: true,
        history: true,
        localStorage: true,
        sessionStorage: true,
        console: true,
        setTimeout: true,
        setInterval: true,
        clearTimeout: true,
        clearInterval: true,
        fetch: true,
        XMLHttpRequest: true,
        AudioWorkletGlobalScope: true,
        
        // Node.js globals
        process: true,
        __dirname: true,
        __filename: true,
        module: true,
        require: true,
        exports: true,
        
        // ES2021 globals
        Promise: true,
        Symbol: true,
        Map: true,
        Set: true,
        WeakMap: true,
        WeakSet: true,
        Proxy: true,
        Reflect: true,
        Intl: true,

        // React Native globals
        __DEV__: true,
        describe: true,
        it: true,
        expect: true
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
      'react-native': reactNative,
      'react': react
    },
    rules: {
      // React Native specific rules
      'react-native/no-unused-styles': 'error',
      'react-native/no-inline-styles': 'warn',
      'react-native/no-color-literals': 'warn',
      'react-native/no-raw-text': 'error',
      'react-native/no-single-element-style-arrays': 'error',
      
      // React rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/prop-types': 'off',
      'react/display-name': 'error',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-pascal-case': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-children-prop': 'error',
      'react/no-danger': 'error',
      'react/no-deprecated': 'error',
      'react/no-direct-mutation-state': 'error',
      'react/no-find-dom-node': 'error',
      'react/no-is-mounted': 'error',
      'react/no-render-return-value': 'error',
      'react/no-string-refs': 'error',
      'react/no-unknown-property': 'error',
      'react/require-render-return': 'error',
      'react/self-closing-comp': 'error',
      'react/void-dom-elements-no-children': 'error',
      
      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info', 'debug'] }],
      'no-debugger': 'error',
      'no-duplicate-imports': 'error',
      'no-unused-expressions': 'error',
      'no-unused-labels': 'error',
      'no-unused-private-class-members': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-use-before-define': ['error', { 
        functions: false,
        classes: false,
        variables: false,
        allowNamedExports: true
      }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-rest-params': 'error',
      'prefer-spread': 'error',
      'prefer-template': 'error'
    }
  },
  {
    files: ['src/services/auth.ts', 'src/utils/logger.ts'],
    rules: {
      'no-use-before-define': 'off'
    }
  }
];