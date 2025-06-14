import * as Font from 'expo-font';
import { useEffect, useState } from 'react';

export const useFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadFonts() {
      try {
        console.log('Starting font loading...');
        await Font.loadAsync({
          'SpaceMono': require('../../assets/fonts/SpaceMono.ttf'),
        });
        console.log('Fonts loaded successfully');
        if (isMounted) {
          setFontsLoaded(true);
        }
      } catch (e) {
        console.error('Error loading fonts:', e);
        if (isMounted) {
          setError(e instanceof Error ? e : new Error('Failed to load fonts'));
          // Still set to true to allow app to continue
          setFontsLoaded(true);
        }
      }
    }

    loadFonts();

    return () => {
      isMounted = false;
    };
  }, []);

  return { fontsLoaded, error };
}; 