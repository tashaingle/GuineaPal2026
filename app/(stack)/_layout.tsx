import colors from '@/theme/colors';
import { Stack } from 'expo-router/stack';
import React from 'react';
import { PetProvider } from '../../src/contexts/PetContext';

function StackLayout() {
  return (
    <PetProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          presentation: 'card',
          contentStyle: {
            backgroundColor: colors.background.DEFAULT,
          },
        }}
      >
        <Stack.Screen
          name="welcome"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-edit-pet"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom'
          }}
        />
        <Stack.Screen
          name="checklist"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="guinea-gram"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="pet-list"
        />
        <Stack.Screen
          name="profile"
        />
        <Stack.Screen
          name="breed-selection"
        />
        <Stack.Screen
          name="weight-tracker"
        />
        <Stack.Screen
          name="medical-records"
        />
        <Stack.Screen
          name="diet-manager"
        />
        <Stack.Screen
          name="waste-log"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-waste-log"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="bonding-tracker"
        />
        <Stack.Screen
          name="bonding-timer"
        />
        <Stack.Screen
          name="bonding-guide"
        />
        <Stack.Screen
          name="family-tree"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="symptom-checker"
        />
        <Stack.Screen
          name="symptom-details"
        />
        <Stack.Screen
          name="care-guide"
        />
        <Stack.Screen
          name="care-guide-section"
        />
        <Stack.Screen
          name="floor-time"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </PetProvider>
  );
}

export default StackLayout; 