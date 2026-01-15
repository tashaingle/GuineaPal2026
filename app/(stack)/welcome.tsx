import WelcomeScreen from '@/screens/WelcomeScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Welcome(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <WelcomeScreen />
    </>
  );
} 