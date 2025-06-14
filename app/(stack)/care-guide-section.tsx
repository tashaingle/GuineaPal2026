import CareGuideSection from '@/screens/CareGuideSection';
import { Stack } from 'expo-router/stack';
import React from 'react';

export default function CareGuideSectionRoute() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <CareGuideSection />
        </>
    );
} 