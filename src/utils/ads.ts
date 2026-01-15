import { AdModule, InterstitialAdInstance } from '@/types/ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const PREMIUM_STATUS_KEY = '@guineapal_premium_status';
const AD_ERRORS_KEY = '@ad_errors';

const isExpoGo = Constants.appOwnership === 'expo';

// Enhanced error logging for ads
export const logAdError = (context: string, error: unknown, additionalInfo?: unknown): void => {
  const errorInfo = {
    timestamp: new Date().toISOString(),
    context,
    platform: Platform.OS,
    isDev: __DEV__,
    appOwnership: Constants.appOwnership,
    error: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    additionalInfo,
  };

  console.error('🔴 AD ERROR:', errorInfo);

  if (__DEV__) {
    AsyncStorage.setItem(AD_ERRORS_KEY, JSON.stringify(errorInfo)).catch(() => {});
  }
};

export const logAdInfo = (_context: string, _info: unknown): void => {
  // Enable if you need it:
  // console.log('🔵 AD INFO:', { timestamp: new Date().toISOString(), context: _context, info: _info });
};

// Ad unit IDs (keep your production IDs elsewhere; these are test IDs)
export const adUnitIds = {
  interstitial:
    Platform.select({
      ios: 'ca-app-pub-3940256099942544/4411468910',
      android: 'ca-app-pub-3940256099942544/1033173712',
    }) || 'ca-app-pub-3940256099942544/1033173712',
  banner:
    Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716',
      android: 'ca-app-pub-3940256099942544/6300978111',
    }) || 'ca-app-pub-3940256099942544/6300978111',
};

// Try to import react-native-google-mobile-ads, but ONLY outside Expo Go
let InterstitialAd: AdModule['InterstitialAd'] | null = null;
let BannerAd: AdModule['BannerAd'] | null = null;
let BannerAdSize: AdModule['BannerAdSize'] | null = null;
let MobileAds: AdModule['MobileAds'] | null = null;
let TestIds: { BANNER: string; INTERSTITIAL: string } | null = null;

if (!isExpoGo) {
  try {
    const adsModule = require('react-native-google-mobile-ads');
    InterstitialAd = adsModule.InterstitialAd;
    BannerAd = adsModule.BannerAd;
    BannerAdSize = adsModule.BannerAdSize;
    MobileAds = adsModule.MobileAds;
    TestIds = adsModule.TestIds;

    logAdInfo('Module Loaded', {
      hasInterstitialAd: !!InterstitialAd,
      hasBannerAd: !!BannerAd,
      hasBannerAdSize: !!BannerAdSize,
      hasMobileAds: !!MobileAds,
    });
  } catch (error) {
    logAdError('Module Loading Failed', error, {
      moduleName: 'react-native-google-mobile-ads',
      note: 'Native module requires a custom dev build / production build (not Expo Go).',
    });
  }
} else {
  logAdInfo('Ads Skipped', { reason: 'Expo Go', appOwnership: Constants.appOwnership });
}

// Create interstitial ad instance (only if module is available)
let interstitial: InterstitialAdInstance | null = null;
if (InterstitialAd) {
  const unitId = __DEV__ && TestIds?.INTERSTITIAL ? TestIds.INTERSTITIAL : adUnitIds.interstitial;

  interstitial = InterstitialAd.createForAdRequest(unitId, {
    requestNonPersonalizedAdsOnly: false,
    keywords: ['pets', 'guinea pigs', 'animals'],
  });
}

// Initialize ads
export const initializeAds = async (): Promise<void> => {
  try {
    if (isExpoGo || !MobileAds) {
      logAdInfo('Ads Initialization Skipped', {
        reason: isExpoGo ? 'Expo Go' : 'Module not available',
        appOwnership: Constants.appOwnership,
        hasMobileAds: !!MobileAds,
      });
      return;
    }

    logAdInfo('Initializing Ads', { platform: Platform.OS });

    // ✅ Proper init pattern
    // Some versions support MobileAds().initialize(); others allow MobileAds().initialize()
    // This is the most common/current API:
    await MobileAds().initialize();

    // Load interstitial early
    if (interstitial?.load) {
      try {
        const loadResult = interstitial.load();

        if (loadResult && typeof loadResult.then === 'function') {
          loadResult
            .then(() => logAdInfo('Interstitial Ad Loaded', { loaded: interstitial?.loaded }))
            .catch((e: unknown) =>
              logAdInfo('Interstitial Ad Load Failed', {
                error: e instanceof Error ? e.message : String(e),
              })
            );
        } else {
          logAdInfo('Interstitial Ad Load Attempted', { loadResultType: typeof loadResult });
        }
      } catch (loadError) {
        logAdInfo('Interstitial Ad Load Error', {
          error: loadError instanceof Error ? loadError.message : String(loadError),
        });
      }
    }
  } catch (error) {
    logAdError('Ads Initialization Failed', error, { platform: Platform.OS });
  }
};

// Check if user is premium
const isPremium = async (): Promise<boolean> => {
  try {
    const premiumStatus = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
    return premiumStatus === 'true';
  } catch (error) {
    console.warn('Failed to check premium status:', error);
    return false;
  }
};

// Load and show interstitial ad
export const showInterstitialAd = async (): Promise<void> => {
  if (isExpoGo || !interstitial) {
    logAdInfo('Interstitial Ad Skipped', {
      reason: isExpoGo ? 'Expo Go' : 'No Interstitial',
      appOwnership: Constants.appOwnership,
      hasInterstitial: !!interstitial,
    });
    return;
  }

  try {
    if (await isPremium()) {
      logAdInfo('Interstitial Ad Skipped', { reason: 'Premium User' });
      return;
    }

    logAdInfo('Showing Interstitial Ad', { loaded: interstitial.loaded });

    if (interstitial.loaded) {
      await interstitial.show();
      logAdInfo('Interstitial Ad Shown', {});
      return;
    }

    logAdInfo('Interstitial Ad Loading', {});
    await interstitial.load();

    setTimeout(async () => {
      if (interstitial?.loaded) {
        try {
          await interstitial.show();
          logAdInfo('Interstitial Ad Shown (Delayed)', {});
        } catch (showError) {
          logAdError('Interstitial Ad Show Failed (Delayed)', showError);
        }
      } else {
        logAdInfo('Interstitial Ad Not Ready', { timeout: 3000 });
      }
    }, 3000);
  } catch (error) {
    logAdError('Interstitial Ad Show Failed', error, { loaded: interstitial?.loaded });
  }
};

// Export banner ad component bits for use in other files
export { BannerAd, BannerAdSize };

// Debug utility to get stored ad errors
export const getStoredAdErrors = async (): Promise<
  Array<{ timestamp: string; context: string; error: string }>
> => {
  try {
    const errors = await AsyncStorage.getItem(AD_ERRORS_KEY);
    return errors ? JSON.parse(errors) : [];
  } catch {
    return [];
  }
};

// Clear stored ad errors
export const clearStoredAdErrors = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(AD_ERRORS_KEY);
  } catch {
    // Ignore errors when clearing
  }
};

// Get ad status for debugging
export const getAdStatus = (): {
  platform: string;
  isDev: boolean;
  appOwnership: string;
  interstitialLoaded: boolean;
  hasMobileAds: boolean;
} => {
  return {
    platform: Platform.OS,
    isDev: __DEV__,
    appOwnership: Constants.appOwnership || 'unknown',
    interstitialLoaded: interstitial?.loaded || false,
    hasMobileAds: !!MobileAds,
  };
};
