import {
  fetchProducts,
  getAvailablePurchases,
  endConnection as iapEndConnection,
  initConnection,
  requestPurchase,
} from 'expo-iap';

const PREMIUM_PRODUCT_ID = 'com.tasha.guineapal.premium';

export const initializePurchases = async () => {
  try {
    await initConnection();
  } catch (error) {
    console.error('Failed to initialize purchases:', error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const products = await fetchProducts({ skus: [PREMIUM_PRODUCT_ID], type: 'in-app' });
    return products;
  } catch (error) {
    console.error('Failed to get products:', error);
    throw error;
  }
};

export const purchasePremium = async () => {
  try {
    const purchase = await requestPurchase({
      request: {
        apple: { sku: PREMIUM_PRODUCT_ID },
        google: { skus: [PREMIUM_PRODUCT_ID] }
      },
      type: 'in-app'
    });
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