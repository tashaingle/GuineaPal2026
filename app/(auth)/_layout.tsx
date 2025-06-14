import { useAuth } from '@/contexts/AuthContext';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function AuthLayout() {
  const { user, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return null;
  }

  // If not authenticated, show auth screens
  if (!user) {
    return (
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack>
    );
  }

  return null;
} 