import AddVetScreen from '@/screens/AddVetScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function AddVetRoute(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <AddVetScreen />
    </>
  );
}
