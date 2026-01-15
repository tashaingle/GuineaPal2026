import ForgotPasswordScreen from '@/screens/auth/ForgotPasswordScreen';
import { useRouter } from 'expo-router';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function ForgotPasswordRoute(): JSX.Element {
  const router = useRouter();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <ForgotPasswordScreen router={router} />
    </>
  );
} 