try {
  require('dotenv').config();
} catch (error) {
  console.warn('Warning: dotenv not found, environment variables will not be loaded');
}

module.exports = {
  name: 'GuineaPal',
  slug: 'guineapal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/images/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.guineapal.app'
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.guineapal.app',
    versionCode: 3,
    permissions: [
      'INTERNET',
      'SYSTEM_ALERT_WINDOW',
      'VIBRATE',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE'
    ]
  },
  web: {
    favicon: './assets/images/favicon.png'
  },
  plugins: [
    'expo-router',
    'react-native-iap',
    [
      'react-native-google-mobile-ads',
      {
        androidAppId: 'ca-app-pub-1405426793776119~1660161441',
        iosAppId: 'ca-app-pub-1405426793776119~1660161441',
        userMessagingPlatform: false,
        delayAppMeasurementInit: true
      }
    ]
  ],
  scheme: 'guineapal',
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  },
  extra: {
    eas: {
      projectId: "d149b9fe-85ba-43b2-9577-b176594a069a"
    }
  }
}; 