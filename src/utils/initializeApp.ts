import * as IAP from 'react-native-iap';
import { initializeAds } from './ads';

export async function initializeApp(): Promise<void> {
    try {
        // Initialize IAP
        if (!__DEV__) {
            await IAP.initConnection();
        }

        // Initialize Ads
        await initializeAds();
    } catch {
        // Handle initialization error
        throw new Error('Failed to initialize app');
    }
}

export function cleanupApp(): void {
    if (!__DEV__) {
        IAP.endConnection();
    }
} 