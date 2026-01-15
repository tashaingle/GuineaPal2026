import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as InAppPurchases from 'react-native-iap';

type Purchase = {
  productId: string;
  transactionId: string;
  transactionDate: string;
  transactionReceipt: string;
};

type PremiumContextType = {
  isPremium: boolean;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  loading: boolean;
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

// Product ID for the £1.99 premium purchase
const PREMIUM_PRODUCT_ID = Platform.select({
  android: 'com.guineapal.app.premium',
  ios: 'com.guineapal.app.premium',
}) || 'com.guineapal.app.premium';

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    if (!__DEV__) {
      initializeIAP();
    }
  }, []);

  const initializeIAP = async (): Promise<void> => {
    try {
      await InAppPurchases.initConnection();
      if (Platform.OS === 'android') {
        await InAppPurchases.flushFailedPurchasesCachedAsPendingAndroid();
      }
      await InAppPurchases.getProducts({ skus: [PREMIUM_PRODUCT_ID] });
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
    }
  };

  const checkPremiumStatus = async (): Promise<void> => {
    try {
      const premiumStatus = await AsyncStorage.getItem('premium_status');
      setIsPremium(premiumStatus === 'true');
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  };

  const purchasePremium = async (): Promise<void> => {
    setLoading(true);
    
    try {
      if (__DEV__) {
        // In development, just toggle premium status
        const newStatus = !isPremium;
        await AsyncStorage.setItem('premium_status', newStatus.toString());
        setIsPremium(newStatus);
        return;
      }

      const purchase = await InAppPurchases.requestPurchase({
        sku: PREMIUM_PRODUCT_ID,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });

      if (purchase) {
        const purchaseData: Purchase = {
          productId: purchase.productId,
          transactionId: purchase.transactionId,
          transactionDate: purchase.transactionDate,
          transactionReceipt: purchase.transactionReceipt,
        };

        await InAppPurchases.finishTransaction(purchaseData);
        await AsyncStorage.setItem('premium_status', 'true');
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Failed to purchase premium:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const restorePurchases = async (): Promise<void> => {
    setLoading(true);
    
    try {
      if (__DEV__) {
        // In development, just check AsyncStorage
        await checkPremiumStatus();
        return;
      }

      const purchases = await InAppPurchases.getAvailablePurchases();
      const hasPremium = purchases.some(
        (purchase) => purchase.productId === PREMIUM_PRODUCT_ID
      );

      if (hasPremium) {
        await AsyncStorage.setItem('premium_status', 'true');
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <PremiumContext.Provider
      value={{ isPremium, purchasePremium, restorePurchases, loading }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = (): PremiumContextType => {
  const context = useContext(PremiumContext);
  if (!context) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
};

export const usePremiumState = (): { isPremium: boolean; loading: boolean } => {
  const { isPremium, loading } = usePremium();
  return { isPremium, loading };
};

export const usePremiumActions = (): {
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
} => {
  const { purchasePremium, restorePurchases } = usePremium();
  return { purchasePremium, restorePurchases };
};

export const useIsPremium = (): boolean => {
  const { isPremium } = usePremium();
  return isPremium;
}; 