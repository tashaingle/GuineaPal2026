import { AdError, BannerAdComponentProps, BannerAdProps, BannerAdSizeType } from '@/types/ads';
import Constants from 'expo-constants';
import React from 'react';
import { Platform, View } from 'react-native';

// Ad unit IDs
const adUnitIds = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID for Android
  }) || 'ca-app-pub-3940256099942544/6300978111', // Fallback to Android test ID
};

// Try to import react-native-google-mobile-ads
let BannerAd: React.ComponentType<BannerAdProps> | null = null;
let BannerAdSize: Record<string, BannerAdSizeType> | null = null;

try {
  const adsModule = require('react-native-google-mobile-ads');
  BannerAd = adsModule.BannerAd;
  BannerAdSize = adsModule.BannerAdSize;
} catch (error) {
  console.warn('react-native-google-mobile-ads not available:', error);
}

// Banner ad component
export const BannerAdComponent: React.FC<BannerAdComponentProps> = ({ size = BannerAdSize?.BANNER || 'BANNER', style }) => {
  // Skip ads in development, Expo Go, or if module not available
  if (__DEV__ || Constants.appOwnership === 'expo' || !BannerAd) {
    return null;
  }

  return (
    <View style={style}>
      <BannerAd
        unitId={adUnitIds.banner}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
          keywords: ['pets', 'guinea pigs', 'animals'],
        }}
        onAdFailedToLoad={(error: AdError) => console.warn('Banner ad failed to load:', error)}
      />
    </View>
  );
}; 