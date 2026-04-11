import {
  flushFailedPurchasesCachedAsPendingAndroid,
  getAvailablePurchases,
  endConnection as iapEndConnection,
  getProducts as iapGetProducts,
  initConnection,
  requestPurchase,
} from 'expo-iap';
import { Platform } from 'react-native';

const PREMIUM_PRODUCT_ID = Platform.select({
  android: 'com.tasha.guineapal.premium',
  ios: 'com.tasha.guineapal.premium',
}) || 'com.tasha.guineapal.premium';

export const initializePurchases = async () => {
  try {
    await initConnection();
    if (Platform.OS === 'android') {
      await flushFailedPurchasesCachedAsPendingAndroid();
    }
  } catch (error) {
    console.error('Failed to initialize purchases:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const products = await iapGetProducts([PREMIUM_PRODUCT_ID]);
    return products;
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
};

export const purchasePremium = async () => {
  try {
    const purchase = await requestPurchase({ sku: PREMIUM_PRODUCT_ID });
    return purchase;
  } catch (error) {
    console.error('Failed to purchase premium:', error);
    throw error;
  }
};

export const restorePurchases = async () => {
  try {
    const purchases = await getAvailablePurchases();
    return purchases;
  } catch (error) {
    console.error('Failed to restore purchases:', error);
    throw error;
  }
};

export const endConnection = async () => {
  try {
    await iapEndConnection();
  } catch (error) {
    console.error('Failed to end connection:', error);
  }
};