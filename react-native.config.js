module.exports = {
  project: {
    android: {
      sourceDir: './android',
      manifestPath: './android/app/src/main/AndroidManifest.xml',
      packageName: 'com.tasha.guineapal',
    },
  },
  dependencies: {
    'react-native': {
      platforms: {
        android: null,
      },
    },
  },
}; 