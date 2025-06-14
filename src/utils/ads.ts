import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdMobInterstitial } from 'expo-ads-admob';
import { Platform } from 'react-native';

const PREMIUM_STATUS_KEY = '@guineapal_premium_status';

// Ad unit IDs
export const adUnitIds = {
  interstitial: Platform.select({
    ios: 'ca-app-pub-3940256099942544/4411468910', // Test ID for iOS
    android: 'ca-app-pub-3940256099942544/1033173712', // Test ID for Android
  }) || 'ca-app-pub-3940256099942544/1033173712', // Fallback to Android test ID
  banner: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716', // Test ID for iOS
    android: 'ca-app-pub-3940256099942544/6300978111', // Test ID for Android
  }) || 'ca-app-pub-3940256099942544/6300978111', // Fallback to Android test ID
};

// Initialize ads
export const initializeAds = async (): Promise<void> => {
  try {
    // Initialize AdMob
    await AdMobInterstitial.setAdUnitID(adUnitIds.interstitial);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
  } catch (error) {
    console.warn('Failed to initialize ads:', error);
  }
};

// Check if user has premium status
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
  // Skip ads in development
  if (__DEV__) {
    return;
  }

  try {
    // Check premium status
    if (await isPremium()) {
      return;
    }

    // Initialize the ad
    await AdMobInterstitial.setAdUnitID(adUnitIds.interstitial);
    await AdMobInterstitial.requestAdAsync({ servePersonalizedAds: true });
    
    // Check if the ad is ready before showing
    const isReady = await AdMobInterstitial.getIsReadyAsync();
    if (isReady) {
      await AdMobInterstitial.showAdAsync();
    } else {
      console.warn('Interstitial ad not ready');
    }
  } catch (error) {
    console.warn('Failed to show interstitial ad:', error);
    // Don't throw the error, just log it and continue
  }
}; 