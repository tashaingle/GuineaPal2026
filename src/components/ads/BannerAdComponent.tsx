import { usePremium } from '@/contexts/PremiumContext';
import { BannerAd, BannerAdSize, adUnitIds } from '@/utils/ads';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

interface Props {
  size?: BannerAdSize;
  style?: any;
}

const BannerAdComponent: React.FC<Props> = ({ 
  size = BannerAdSize.BANNER,
  style 
}) => {
  const { isPremium } = usePremium();

  // Don't show ads on iOS or for premium users
  if (Platform.OS === 'ios' || isPremium) {
    return null;
  }

  return (
    <View style={[styles.container, style]}>
      <BannerAd
        unitId={adUnitIds.banner}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});

export default BannerAdComponent; 