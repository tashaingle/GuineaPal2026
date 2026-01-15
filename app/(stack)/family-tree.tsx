import FamilyTreeScreen from '@/screens/FamilyTreeScreen';
import { Pet } from '@/types/pet';
// Pet type not needed - using GuineaPig
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';

export default function FamilyTreeRoute(): JSX.Element {
    const params = useLocalSearchParams();
    const router = useRouter();

    // Parse the pet object from the params
    const pet = params.pet ? JSON.parse(params.pet as string) as Pet : undefined;

    if (!pet) {
        router.back();
        return <></>;
    }

    return (
        <FamilyTreeScreen
            route={{
                params: {
                    pet: {
                        ...pet,
                        createdAt: pet.createdAt || '',
                        updatedAt: pet.updatedAt || '',
                        moodHistory: (pet.moodHistory || []).map(entry => ({
                            id: entry.id || `${entry.date}-${entry.mood}`,
                            date: entry.date,
                            mood: entry.mood as import('@/types/guineaPig').Mood,
                            notes: entry.notes || '',
                            activities: entry.activities || [],
                            photo: entry.photo || undefined,
                        })),
                    },
                    onUpdate: () => {
                        // Handle any updates if needed
                    }
                }
            }}
        />
    );
} 