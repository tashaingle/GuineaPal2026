import CareGuideSection from '@/screens/CareGuideSection';
import { Stack } from 'expo-router/stack';
import React from 'react';

const CareGuideSectionWrapper = (): JSX.Element => {
    return (
        <CareGuideSection />
    );
};

export default function CareGuideSectionRoute(): JSX.Element {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: false,
                }}
            />
            <CareGuideSectionWrapper />
        </>
    );
} 