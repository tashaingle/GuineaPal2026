import SymptomDetailsScreen from '@/screens/SymptomDetailsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function SymptomDetailsRoute() {
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