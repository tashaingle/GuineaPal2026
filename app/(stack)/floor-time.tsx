import FloorTimeScreen from '@/screens/FloorTimeScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function FloorTime(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <FloorTimeScreen />
    </>
  );
} 