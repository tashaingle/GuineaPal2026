import { MoodEntry } from './guineaPig';

export interface Pet {
    id: string;
    name: string;
    species: 'guinea_pig' | 'rabbit' | 'hamster' | 'other';
    breed?: string;
    gender: 'male' | 'female';
    birthDate?: string;
    adoptionDate?: string;
    color: string;
    weight?: number;
    notes?: string;
    image?: string;
    isActive: boolean;
    // Family relationship properties
    motherId?: string;
    fatherId?: string;
    mate?: string;
    siblings?: string[];
    children?: string[];
    // Additional properties
    createdAt?: string;
    updatedAt?: string;
    moodHistory?: MoodEntry[];
    dietPreferences?: {
        favoriteVegetables: string[];
        favoriteFruits: string[];
        allergies: string[];
        restrictions: string[];
        hayPreference: string;
    };
} 