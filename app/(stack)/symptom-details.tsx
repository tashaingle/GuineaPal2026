import SymptomDetailsScreen from '@/screens/SymptomDetailsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function SymptomDetails(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <SymptomDetailsScreen />
    </>
  );
} 