import DietManagerScreen from '@/screens/health/DietManagerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function DietManager(): JSX.Element {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <DietManagerScreen />
        </>
    );
} 