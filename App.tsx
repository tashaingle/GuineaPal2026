import { Slot } from 'expo-router';
import React from 'react';
import 'react-native-get-random-values';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App(): JSX.Element {
  return (
    <SafeAreaProvider>
      <Slot />
    </SafeAreaProvider>
  );
} 