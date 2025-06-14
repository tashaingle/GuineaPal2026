import BondingTimerScreen from '@/screens/BondingTimerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function BondingTimerRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <BondingTimerScreen />
    </>
  );
} 