import ProfileScreen from '@/screens/ProfileScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function ProfileRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ProfileScreen />
    </>
  );
}

export { ProfileScreen };
