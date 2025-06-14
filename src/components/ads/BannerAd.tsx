import { AdMobBanner } from 'expo-ads-admob';
import React from 'react';
import { Platform } from 'react-native';

// Ad unit IDs
const adUnitIds = {
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID for Android
  }) || 'ca-app-pub-3940256099942544/6300978111', // Fallback to Android test ID
};

// Banner ad component props
interface BannerAdProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle' | 'fullBanner' | 'leaderboard' | 'smartBannerPortrait' | 'smartBannerLandscape';
  style?: any;
}

// Banner ad component
export const BannerAd: React.FC<BannerAdProps> = ({ size = 'banner', style }) => {
  // Skip ads in development
  if (__DEV__) {
    return null;
  }

  return (
    <AdMobBanner
      bannerSize={size}
      adUnitID={adUnitIds.banner}
      servePersonalizedAds={true}
      onDidFailToReceiveAdWithError={(error) => console.warn('Banner ad failed to load:', error)}
      style={style}
    />
  );
}; 