import { Stack } from 'expo-router/stack';
import React from 'react';
import SymptomCheckerScreen from '../../src/screens/SymptomCheckerScreen';

export default function SymptomChecker() {
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