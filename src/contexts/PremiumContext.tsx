import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
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
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    checkPremiumStatus();
    if (!__DEV__) {
      initializeIAP();
    }
  }, []);

  const initializeIAP = async () => {
    try {
      await InAppPurchases.initConnection();
      await InAppPurchases.getProducts({ skus: ['premium_subscription'] });
    } catch (error) {
      console.error('Failed to initialize IAP:', error);
    }
  };

  const checkPremiumStatus = async () => {
    try {
      const premiumStatus = await AsyncStorage.getItem('premium_status');
      setIsPremium(premiumStatus === 'true');
    } catch (error) {
      console.error('Failed to check premium status:', error);
    }
  };

  const purchasePremium = async () => {
    if (__DEV__) {
      // In development, just toggle premium status
      const newStatus = !isPremium;
      await AsyncStorage.setItem('premium_status', newStatus.toString());
      setIsPremium(newStatus);
      return;
    }

    try {
      const purchase = await InAppPurchases.requestPurchase({
        sku: 'premium_subscription',
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
    }
  };

  const restorePurchases = async () => {
    if (__DEV__) {
      // In development, just check AsyncStorage
      await checkPremiumStatus();
      return;
    }

    try {
      const purchases = await InAppPurchases.getAvailablePurchases();
      const hasPremium = purchases.some(
        (purchase) => purchase.productId === 'premium_subscription'
      );

      if (hasPremium) {
        await AsyncStorage.setItem('premium_status', 'true');
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Failed to restore purchases:', error);
    }
  };

  return (
    <PremiumContext.Provider
      value={{ isPremium, purchasePremium, restorePurchases }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
} 