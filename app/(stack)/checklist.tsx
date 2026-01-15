import ChecklistScreen from '@/screens/ChecklistScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function Checklist(): JSX.Element {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <ChecklistScreen />
        </>
    );
}

Checklist.displayName = 'Checklist'; 