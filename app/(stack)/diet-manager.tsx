import DietManagerScreen from '@/screens/health/DietManagerScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function DietManagerRoute() {
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