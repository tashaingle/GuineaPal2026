import { useFonts as useExpoFonts } from 'expo-font';

export const useFonts = () => {
  const [fontsLoaded, error] = useExpoFonts({
    'SpaceMono': require('../../assets/fonts/SpaceMono.ttf'),
  });

  return { fontsLoaded, error };
};