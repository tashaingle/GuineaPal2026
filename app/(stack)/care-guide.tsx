import GuineaPigLibraryScreen from '@/screens/GuineaPigLibraryScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function CareGuide(): JSX.Element {
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