import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Index(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
    </>
  );
} 