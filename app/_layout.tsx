import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { PetProvider } from '@/contexts/PetContext';
import { PremiumProvider } from '@/contexts/PremiumContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { cleanupApp, initializeApp } from '@/utils/initializeApp';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Slot, useRouter } from 'expo-router';
import { useSegments } from 'expo-router/build/hooks';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

function RootLayoutNav(): React.JSX.Element {
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

function RootLayoutContent(): React.JSX.Element | null {
    const colorScheme = useColorScheme();
    const [fontsLoaded] = useFonts({
        ...MaterialCommunityIcons.font,
        ...AntDesign.font,
        ...MaterialIcons.font,
        ...FontAwesome.font,
        ...Ionicons.font,
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
            initializeApp();
        }

        return cleanupApp;
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <PaperProvider>
                <ThemeProvider>
                    <PetProvider>
                        <PremiumProvider>
                            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
                            <RootLayoutNav />
                        </PremiumProvider>
                    </PetProvider>
                </ThemeProvider>
            </PaperProvider>
        </SafeAreaProvider>
    );
}

function RootLayout(): React.JSX.Element {
    return (
        <AuthProvider>
            <RootLayoutContent />
        </AuthProvider>
    );
}

RootLayout.displayName = 'RootLayout';

export default RootLayout; 