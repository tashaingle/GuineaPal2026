import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'GuineaPal',
  slug: 'guineapal',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.guineapal.app',
    config: {
      googleMobileAdsAppId: 'ca-app-pub-1405426793776119~1660161441'
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    package: 'com.guineapal.app',
    config: {
      googleMobileAdsAppId: 'ca-app-pub-1405426793776119~1660161441'
    }
  },
  web: {
    favicon: './assets/favicon.png'
  },
  plugins: [
    'expo-router',
    'react-native-iap',
    [
      'expo-ads-admob',
      {
        userTrackingPermission: 'This identifier will be used to deliver personalized ads to you.'
      }
    ]
  ],
  scheme: 'guineapal',
  experiments: {
    typedRoutes: true,
    tsconfigPaths: true
  }
}); 