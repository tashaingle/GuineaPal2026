module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ['babel-preset-expo', {
        jsxRuntime: 'automatic',
        unstable_disableModuleWrapping: true,
        unstable_useRequireContext: true
      }]
    ],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
          alias: {
            '@': './src',
          },
        },
      ],
      'react-native-reanimated/plugin',
      ['transform-inline-environment-variables', {
        include: ['EXPO_OS', 'NODE_ENV', 'EXPO_PLATFORM', 'EXPO_DEVTOOLS_LISTEN_ADDRESS']
      }]
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel'],
      },
      development: {
        plugins: ['react-native-paper/babel'],
      }
    },
  };
};