import AddEmergencyContactScreen from '@/screens/AddEmergencyContactScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function AddEmergencyContactRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <AddEmergencyContactScreen />
    </>
  );
}
