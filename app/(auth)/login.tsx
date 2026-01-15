import LoginScreen from '@/screens/auth/LoginScreen';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function LoginRoute(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <LoginScreen router={router} />
    </>
  );
} 