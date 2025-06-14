import BreedSelectionScreen from '@/screens/BreedSelectionScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function BreedSelection() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <BreedSelectionScreen />
    </>
  );
} 