import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = (): boolean => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadFonts = async (): Promise<void> => {
      try {
        // Using system fonts instead of Poppins
        await Font.loadAsync({
          'Poppins-Regular': require('../../assets/fonts/SpaceMono.ttf'),
          'Poppins-Medium': require('../../assets/fonts/SpaceMono.ttf'),
          'Poppins-SemiBold': require('../../assets/fonts/SpaceMono.ttf'),
          'Poppins-Bold': require('../../assets/fonts/SpaceMono.ttf'),
        });

        if (isMounted) {
          setFontsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading fonts:', error);
        // Fallback to system fonts
        if (isMounted) {
          setFontsLoaded(true);
        }
      }
    };

    loadFonts();

    return (): void => {
      isMounted = false;
    };
  }, []);

  return fontsLoaded;
}; 