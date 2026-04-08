import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds, {
    AdEventType,
    BannerAd,
    BannerAdSize,
    InterstitialAd,
    TestIds,
} from 'react-native-google-mobile-ads';

const PREMIUM_STATUS_KEY = '@guineapal_premium_status';

// Initialize mobile ads
export const initializeAds = async () => {
  try {
    // Initialize for both platforms
    await mobileAds().initialize();
    console.log('Ads initialized successfully');
  } catch (error) {
    console.error('Failed to initialize ads:', error);
    // Don't throw the error to prevent app from crashing
    // Just log it and continue
  }
};

// Ad Unit IDs - Use test IDs in development
export const adUnitIds = {
  // Test IDs for development, real IDs for production
  banner: __DEV__ ? TestIds.BANNER : 'ca-app-pub-1405426793776119/9789932908',
  interstitial: __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-1405426793776119/2657532430',
};

// Check if user is premium
const isPremium = async (): Promise<boolean> => {
  try {
    const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
    return status === 'true';
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

// Load and show interstitial ad
export const showInterstitialAd = async (): Promise<void> => {
  // Don't show ads for premium users
  if (await isPremium()) {
    return;
  }

  return new Promise<void>((resolve) => {
    const interstitialAd = InterstitialAd.createForAdRequest(adUnitIds.interstitial, {
      requestNonPersonalizedAdsOnly: true,
      keywords: ['pet', 'guinea pig', 'animal care', 'pet care'],
    });

    const unsubscribeLoaded = interstitialAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitialAd.show();
        unsubscribeLoaded();
        unsubscribeClosed();
      }
    );

    const unsubscribeClosed = interstitialAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        resolve();
        unsubscribeLoaded();
        unsubscribeClosed();
      }
    );

    interstitialAd.load();
  });
};

// Banner ad component props type
export interface BannerAdProps {
  size?: BannerAdSize;
  unitId?: string;
}

// Export components and types that will be used throughout the app
export { BannerAd, BannerAdSize, TestIds };
