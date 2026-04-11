import { Platform } from 'react-native';

export const initializeAds = async () => {
  console.log('Ads not supported on web');
};

export const adUnitIds = {
  banner: '',
  interstitial: '',
};

export const showInterstitialAd = async (): Promise<void> => {
  return Promise.resolve();
};

export const BannerAd = () => null;
export const BannerAdSize = {};
export const TestIds = {};