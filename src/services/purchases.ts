import * as InAppPurchases from 'expo-iap';
import { Platform } from 'react-native';

// Product IDs
const PREMIUM_PRODUCT_ID = Platform.select({
  android: 'com.tasha.guineapal.premium',
  ios: 'com.tasha.guineapal.premium',
}) || 'com.tasha.guineapal.premium'; // Fallback to Android ID

// Initialize IAP
export const initializePurchases = async () => {
  try {
    await InAppPurchases.initConnection();
    if (Platform.OS === 'android') {
      await InAppPurchases.flushFailedPurchasesCachedAsPendingAndroid();
    }
  } catch (error) {
    console.error('Failed to initialize purchases:', error);
    throw error;
  }
};

// Get available products
export const getProducts = async () => {
  try {
    const products = await InAppPurchases.getProducts({
      skus: [PREMIUM_PRODUCT_ID],
    });
    return products;
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
};

// Purchase premium
export const purchasePremium = async () => {
  try {
    const purchase = await InAppPurchases.requestPurchase({
      sku: PREMIUM_PRODUCT_ID,
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    });
    return purchase;
  } catch (error) {
    console.error('Failed to purchase premium:', error);
    throw error;
  }
};

// Restore purchases
export const restorePurchases = async () => {
  try {
    if (Platform.OS === 'ios') {
      const purchases = await InAppPurchases.getAvailablePurchases();
      return purchases;
    } else {
      const purchases = await InAppPurchases.getAvailablePurchases();
      return purchases;
    }
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
};

// End connection when app is closed
export const endConnection = async () => {
  try {
    await InAppPurchases.endConnection();
  } catch (error) {
    console.error('Failed to end connection:', error);
  }
}; 