import { Platform } from 'react-native';
import * as InAppPurchases from 'react-native-iap';
// PurchaseOptions type not needed

// Product IDs - using the correct bundle identifier
const PREMIUM_PRODUCT_ID = Platform.select({
  android: 'com.guineapal.app.premium',
  ios: 'com.guineapal.app.premium',
}) || 'com.guineapal.app.premium'; // Fallback to Android ID

// Initialize IAP
export const initializePurchases = async (): Promise<void> => {
  try {
    await InAppPurchases.initConnection();
    if (Platform.OS === 'android') {
      await InAppPurchases.flushFailedPurchasesCachedAsPendingAndroid();
    }
  } catch {
    throw new Error('Failed to initialize purchases');
  }
};

// Get available products
export const getProducts = async (): Promise<InAppPurchases.Product[]> => {
  try {
    const products = await InAppPurchases.getProducts({
      skus: [PREMIUM_PRODUCT_ID],
    });
    return products;
  } catch {
    throw new Error('Failed to get products');
  }
};

// Purchase premium
export const purchasePremium = async (): Promise<InAppPurchases.Purchase> => {
  try {
    const purchase = await InAppPurchases.requestPurchase({
      sku: PREMIUM_PRODUCT_ID,
      andDangerouslyFinishTransactionAutomaticallyIOS: false,
    });
    return purchase;
  } catch {
    throw new Error('Failed to purchase premium');
  }
};

// Restore purchases
export const restorePurchases = async (): Promise<InAppPurchases.Purchase[]> => {
  try {
    if (Platform.OS === 'ios') {
      const purchases = await InAppPurchases.getAvailablePurchases();
      return purchases;
    } else {
      const purchases = await InAppPurchases.getAvailablePurchases();
      return purchases;
    }
  } catch {
    throw new Error('Failed to restore purchases');
  }
};

// End connection when app is closed
export const endConnection = async (): Promise<void> => {
  try {
    await InAppPurchases.endConnection();
  } catch {
    throw new Error('Failed to end connection');
  }
};

export const purchaseProduct = async (productId: string): Promise<void> => {
  try {
    await InAppPurchases.requestPurchase({ sku: productId });
  } catch {
    throw new Error('Failed to purchase product');
  }
};

export const finishTransaction = async (transaction: InAppPurchases.Purchase): Promise<void> => {
  try {
    await InAppPurchases.finishTransaction(transaction);
  } catch {
    throw new Error('Failed to finish transaction');
  }
}; 