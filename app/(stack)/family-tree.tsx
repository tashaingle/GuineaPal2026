import FamilyTreeScreen from '@/screens/FamilyTreeScreen';
import { GuineaPig } from '@/types/guineaPig';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function FamilyTreeRoute() {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Parse the pet object from the params
    const pet = params.pet ? JSON.parse(params.pet as string) as GuineaPig : undefined;

    if (!pet) {
        router.back();
        return null;
    }

    return (
        <FamilyTreeScreen
            route={{
                params: {
                    pet,
                    onUpdate: () => {
                        // Handle any updates if needed
                    }
                }
            }}
        />
    );
} 