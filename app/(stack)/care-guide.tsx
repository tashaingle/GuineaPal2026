import GuineaPigLibraryScreen from '@/screens/GuineaPigLibraryScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function CareGuideRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <GuineaPigLibraryScreen />
        </>
    );
} 