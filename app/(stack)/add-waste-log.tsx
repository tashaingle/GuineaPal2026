import AddWasteLogScreen from '@/screens/health/AddWasteLogScreen';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function AddWasteLogRoute() {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <AddWasteLogScreen />
    </>
  );
}

export { AddWasteLogScreen };
