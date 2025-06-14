import LoginScreen from '@/screens/auth/LoginScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Login() {
  const router = useRouter();
  return <LoginScreen router={router} />;
} 