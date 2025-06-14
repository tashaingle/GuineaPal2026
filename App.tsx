import { AuthProvider } from '@/contexts/AuthContext';
import { PetProvider } from '@/contexts/PetContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Slot } from 'expo-router';
import React from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <PetProvider>
            <Slot />
          </PetProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
} 