import AddEditPetScreen from '@/screens/AddEditPetScreen';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';

export default function AddEditPetRoute() {
    const params = useLocalSearchParams();
    return <AddEditPetScreen />;
} 