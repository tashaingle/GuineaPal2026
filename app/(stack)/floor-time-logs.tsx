import FloorTimeLogsScreen from '@/screens/FloorTimeLogsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function FloorTimeLogsRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                    animation: 'slide_from_right',
                    presentation: 'card',
                }}
            />
            <FloorTimeLogsScreen />
        </>
    );
} 