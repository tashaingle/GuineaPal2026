import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { useRouter, useSegments } from 'expo-router/build/hooks';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import * as IAP from 'react-native-iap';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BreedProvider } from '../src/context/BreedContext';
import { PetProvider } from '../src/context/PetContext';
import { AuthProvider, useAuth } from '../src/contexts/AuthContext';
import { PremiumProvider } from '../src/contexts/PremiumContext';
import { initializeAds } from '../src/utils/ads';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    // Check if we're in the auth group
    const inAuthGroup = segments[0] === '(auth)';

    // If we're not authenticated and not in the auth group, redirect to login
    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    }
    // If we're authenticated and in the auth group, redirect to welcome
    else if (user && inAuthGroup) {
      router.replace('/(stack)/welcome');
    }
  }, [user, segments, isLoading]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    ...MaterialCommunityIcons.font,
  });

  useEffect(() => {
    const initializeApp = async () => {
      // Skip initialization in development
      if (__DEV__) {
        console.log('Skipping initialization in development environment');
        return;
      }

      try {
        // Initialize IAP
        await IAP.initConnection();
        console.log('IAP initialized successfully');

        // Initialize Ads
        await initializeAds();
        console.log('Ads initialized successfully');
      } catch (error) {
        console.warn('Initialization failed:', error);
      }
    };

    if (fontsLoaded) {
      SplashScreen.hideAsync();
      initializeApp();
    }

    return () => {
      if (!__DEV__) {
        IAP.endConnection();
      }
    };
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <PaperProvider>
        <AuthProvider>
          <PremiumProvider>
            <PetProvider>
              <BreedProvider>
                <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                <RootLayoutNav />
              </BreedProvider>
            </PetProvider>
          </PremiumProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
} 