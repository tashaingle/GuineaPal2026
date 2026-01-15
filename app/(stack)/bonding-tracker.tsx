import BondingTrackerScreen from '@/screens/BondingTrackerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function BondingTrackerRoute(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <BondingTrackerScreen />
    </>
  );
} 