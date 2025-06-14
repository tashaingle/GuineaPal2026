import { usePremium } from '@/contexts/PremiumContext';
import { adUnitIds } from '@/utils/ads';
import { AdMobBanner } from 'expo-ads-admob';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

type BannerSize = 'banner' | 'largeBanner' | 'mediumRectangle' | 'fullBanner' | 'leaderboard' | 'smartBannerPortrait' | 'smartBannerLandscape';

interface Props {
  size?: BannerSize;
  style?: any;
}

const BannerAdComponent: React.FC<Props> = ({ 
  size = 'banner',
  style 
}) => {
  const { isPremium } = usePremium();

  // Don't show ads on iOS, for premium users, or in development
  if (Platform.OS === 'ios' || isPremium || __DEV__) {
    return null;
  }

  try {
    return (
      <View style={[styles.container, style]}>
        <AdMobBanner
          adUnitID={adUnitIds.banner}
          bannerSize={size}
          servePersonalizedAds={false}
          onDidFailToReceiveAdWithError={(error) => console.warn('Banner ad failed to load:', error)}
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
    width: '100%',
  },
});

export default BannerAdComponent; 