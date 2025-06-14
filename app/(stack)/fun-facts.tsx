import FunFactsScreen from '@/screens/FunFactsScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function FunFactsRoute() {
  const params = useLocalSearchParams();
  return <FunFactsScreen />;
} 