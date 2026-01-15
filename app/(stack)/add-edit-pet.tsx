import AddEditPetScreen from '@/screens/AddEditPetScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function AddEditPetRoute(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AddEditPetScreen />
    </>
  );
} 