import GuineaGramScreen from '@/screens/GuineaGramScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function GuineaGram(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <GuineaGramScreen />
    </>
  );
} 