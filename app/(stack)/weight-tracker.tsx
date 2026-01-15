import WeightTrackerScreen from '@/screens/health/WeightTrackerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function WeightTracker(): JSX.Element {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <WeightTrackerScreen />
    </>
  );
}

export { WeightTrackerScreen };
