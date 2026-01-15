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

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
    const [pets, setPets] = useState<Pet[]>([]);

    const addPet = async (pet: Pet): Promise<void> => {
        setPets(prev => [...prev, pet]);
    };

    const updatePet = async (pet: Pet): Promise<void> => {
        setPets(prev => prev.map(p => p.id === pet.id ? pet : p));
    };

    const deletePet = async (id: string): Promise<void> => {
        setPets(prev => prev.filter(p => p.id !== id));
    };

    return (
        <PetContext.Provider value={{ pets, addPet, updatePet, deletePet }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePet = (): PetContextType => {
    const context = useContext(PetContext);
    if (!context) {
        throw new Error('usePet must be used within a PetProvider');
    }
    return context;
};

export const usePetList = (): Pet[] => {
    const { pets } = usePet();
    return pets;
};

export const usePetById = (id: string): Pet | undefined => {
    const { pets } = usePet();
    return pets.find(pet => pet.id === id);
};

export const usePetActions = (): {
    addPet: (pet: Omit<Pet, 'id'>) => Promise<void>;
    updatePet: (id: string, pet: Partial<Pet>) => Promise<void>;
    deletePet: (id: string) => Promise<void>;
} => {
    const context = usePet();
    return {
        addPet: async (pet: Omit<Pet, 'id'>): Promise<void> => {
            const newPet = { ...pet, id: Date.now().toString() };
            await context.addPet(newPet);
        },
        updatePet: async (id: string, pet: Partial<Pet>): Promise<void> => {
            const existingPet = context.pets.find(p => p.id === id);
            if (!existingPet) {
                throw new Error(`Pet with id ${id} not found`);
            }
            await context.updatePet({ ...existingPet, ...pet });
        },
        deletePet: context.deletePet
    };
}; 