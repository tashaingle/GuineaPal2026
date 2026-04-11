import { purchasePremium, restorePurchases } from '@/services/purchases';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as InAppPurchases from 'expo-iap';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface PremiumContextType {
  isPremium: boolean;
  checkPremiumStatus: () => Promise<void>;
  purchasePremium: () => Promise<void>;
  restorePurchases: () => Promise<void>;
}

const PremiumContext = createContext<PremiumContextType>({
  isPremium: false,
  checkPremiumStatus: async () => {},
  purchasePremium: async () => {},
  restorePurchases: async () => {},
});

export const usePremium = () => useContext(PremiumContext);

const PREMIUM_STATUS_KEY = '@guineapal_premium_status';

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPremium, setIsPremium] = useState(false);

  const checkPremiumStatus = async () => {
    try {
      const status = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
      setIsPremium(status === 'true');
    } catch (error) {
      console.error('Error checking premium status:', error);
    }
  };

  const handlePurchase = async () => {
    try {
      if (__DEV__) {
        // In development, just toggle premium status
        const newStatus = !isPremium;
        await AsyncStorage.setItem(PREMIUM_STATUS_KEY, newStatus.toString());
        setIsPremium(newStatus);
        return;
      }

      const purchase = await purchasePremium();
      
      // Verify the purchase
      if (purchase) {
        await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
        setIsPremium(true);
        
        // Finish the transaction
        if (Platform.OS === 'ios') {
          await InAppPurchases.finishTransaction({ 
            purchase: purchase as InAppPurchases.ProductPurchase 
          });
        }
      }
    } catch (error) {
      console.error('Error handling purchase:', error);
      throw error;
    }
  };

  const handleRestorePurchases = async () => {
    try {
      if (__DEV__) {
        // In development, just check AsyncStorage
        await checkPremiumStatus();
        return;
      }

      const purchases = await restorePurchases();
      
      // Check if any of the restored purchases is our premium product
      const hasPremium = purchases.some(purchase => 
        purchase.productId === 'com.tasha.guineapal.premium'
      );
      
      if (hasPremium) {
        await AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true');
        setIsPremium(true);
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  return (
    <PremiumContext.Provider 
      value={{ 
        isPremium, 
        checkPremiumStatus, 
        purchasePremium: handlePurchase,
        restorePurchases: handleRestorePurchases
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}; 