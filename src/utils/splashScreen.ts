import * as SplashScreen from 'expo-splash-screen';
import logger from './logger';

// Configure splash screen
SplashScreen.preventAutoHideAsync()
  .catch(() => {
    /* reloading the app might trigger some race conditions, ignore them */
  });

// Function to hide the splash screen
export const hideSplashScreen = async (): Promise<void> => {
  try {
    // Ensure the background color is set
    if (typeof document !== 'undefined') {
      document.body.style.backgroundColor = '#FFF8E1';
    }
    await SplashScreen.hideAsync();
  } catch (error) {
    logger.error('Failed to hide splash screen:', error);
    throw new Error('Failed to hide splash screen');
  }
}; 