import EmergencyContactsScreen from '@/screens/EmergencyContactsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function EmergencyContactsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      />
      <EmergencyContactsScreen />
    </>
  );
}
