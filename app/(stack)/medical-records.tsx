import MedicalRecordsScreen from '@/screens/health/MedicalRecordsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function MedicalRecordsRoute() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <MedicalRecordsScreen />
    </>
  );
}

export { MedicalRecordsScreen };
