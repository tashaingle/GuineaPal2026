import RegisterScreen from '@/screens/auth/RegisterScreen';
import { useRouter } from 'expo-router';
import React from 'react';

export default function Register() {
  const router = useRouter();
  return <RegisterScreen router={router} />;
} 