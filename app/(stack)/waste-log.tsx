import WasteLogScreen from '@/screens/health/WasteLogScreen';
import { useLocalSearchParams } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function WasteLog(): JSX.Element {
  const params = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <WasteLogScreen route={{ params: { petId: params.petId as string } }} />
    </>
  );
}

export { WasteLogScreen };
