import SymptomCheckerScreen from '@/screens/SymptomCheckerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function SymptomChecker(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <SymptomCheckerScreen />
    </>
  );
} 