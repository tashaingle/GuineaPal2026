import FunFactsScreen from '@/screens/FunFactsScreen';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function FunFacts(): JSX.Element {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false
                }}
            />
            <FunFactsScreen />
        </>
    );
}

FunFacts.displayName = 'FunFacts'; 