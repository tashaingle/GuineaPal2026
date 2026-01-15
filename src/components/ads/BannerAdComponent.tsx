import { usePremium } from '@/contexts/PremiumContext';
import { AdError, BannerAdComponentProps, BannerAdProps, BannerAdSizeType } from '@/types/ads';
import Constants from 'expo-constants';
import React from 'react';
import { StyleSheet, View } from 'react-native';

// Only available in a custom dev build / production build (NOT Expo Go)
let BannerAd: React.ComponentType<BannerAdProps> | null = null;
let BannerAdSize: Record<string, BannerAdSizeType> | null = null;
let TestIds: { BANNER: string } | null = null;

const isExpoGo = Constants.appOwnership === 'expo';

if (!isExpoGo) {
  try {
    const adsModule = require('react-native-google-mobile-ads');
    BannerAd = adsModule.BannerAd;
    BannerAdSize = adsModule.BannerAdSize;
    TestIds = adsModule.TestIds;
  } catch (error) {
    console.warn('react-native-google-mobile-ads not available (dev build required):', error);
  }
}

function getBannerUnitId(): string {
  // Use test ads in dev to avoid accidental real ad requests during development
  if (__DEV__ && TestIds?.BANNER) return TestIds.BANNER;

  // Lazily load your ad unit IDs only when we actually need them
  try {
    const { adUnitIds } = require('@/utils/ads');
    return adUnitIds.banner;
  } catch (e) {
    console.warn('Failed to load adUnitIds from @/utils/ads. Using test banner instead.', e);
    // Safe fallback test banner
    return 'ca-app-pub-3940256099942544/6300978111';
  }
}

const BannerAdComponent: React.FC<BannerAdComponentProps> = ({
  size = BannerAdSize?.BANNER || 'BANNER',
  style
}) => {
  const { isPremium } = usePremium();

  // Don't show ads for premium users, in Expo Go, or if the native module isn't available
  if (isPremium || isExpoGo || !BannerAd) {
    return null;
  }

  const unitId = getBannerUnitId();

  try {
    return (
      <View style={[styles.container, style]}>
        <BannerAd
          unitId={unitId}
          size={size}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
            keywords: ['pets', 'guinea pigs', 'animals']
          }}
          onAdFailedToLoad={(error: AdError) => console.warn('Banner ad failed to load:', error)}
        />
      </View>
    );
  } catch (error) {
    console.warn('Failed to render banner ad:', error);
    return null;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  }
});

export default BannerAdComponent;
