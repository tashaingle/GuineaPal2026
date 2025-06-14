import React, { createContext, useContext, useState } from 'react';

export interface Pet {
    id: string;
    name: string;
    breed: string;
    colors: string[];
    birthdate: string;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

interface PetContextType {
    pets: Pet[];
    addPet: (pet: Pet) => Promise<void>;
    updatePet: (pet: Pet) => Promise<void>;
    deletePet: (id: string) => Promise<void>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [pets, setPets] = useState<Pet[]>([]);

    const addPet = async (pet: Pet) => {
        setPets(prev => [...prev, pet]);
    };

    const updatePet = async (pet: Pet) => {
        setPets(prev => prev.map(p => p.id === pet.id ? pet : p));
    };

    const deletePet = async (id: string) => {
        setPets(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PetContext.Provider value={{ pets, addPet, updatePet, deletePet }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePet = () => {
    const context = useContext(PetContext);
    if (context === undefined) {
        throw new Error('usePet must be used within a PetProvider');
    }
    return context;
}; 