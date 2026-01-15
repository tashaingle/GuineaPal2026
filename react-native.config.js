module.exports = {
  project: {
    android: {
      sourceDir: './android',
      packageName: 'com.guineapal.app'
    },
  },
  dependencies: {
    'react-native': {
      platforms: {
        android: null,
      },
    },
  },
  assets: ['./assets/fonts/'],
}; 