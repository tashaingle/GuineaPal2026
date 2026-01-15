import PetListScreen from '@/screens/PetListScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function PetList(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <PetListScreen />
    </>
  );
} 