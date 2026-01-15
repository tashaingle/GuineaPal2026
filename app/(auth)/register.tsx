import RegisterScreen from '@/screens/auth/RegisterScreen';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function RegisterRoute(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <RegisterScreen router={router} />
    </>
  );
} 