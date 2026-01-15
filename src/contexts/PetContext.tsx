import React, { createContext, useContext, useEffect, useState } from 'react';
import { Pet } from '../types/pet';
import { loadPets, savePets } from '../utils/storage';

interface PetContextType {
  pets: Pet[];
  loading: boolean;
  error: Error | null;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPet: (id: string) => Pet | undefined;
  savePets: () => Promise<void>;
}

export const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }): JSX.Element => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPetsData();
  }, []);

  const loadPetsData = async (): Promise<void> => {
    try {
      const loadedPets = await loadPets();
      setPets(loadedPets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load pets'));
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (pet: Pet): Promise<void> => {
    try {
      const newPets = [...pets, pet];
      await savePets(newPets);
      setPets(newPets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add pet'));
      throw err;
    }
  };

  const updatePet = async (updatedPet: Pet): Promise<void> => {
    try {
      const newPets = pets.map(pet => 
        pet.id === updatedPet.id ? { ...updatedPet, updatedAt: new Date().toISOString() } : pet
      );
      await savePets(newPets);
      setPets(newPets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update pet'));
      throw err;
    }
  };

  const deletePet = async (id: string): Promise<void> => {
    try {
      const newPets = pets.filter(pet => pet.id !== id);
      await savePets(newPets);
      setPets(newPets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to delete pet'));
      throw err;
    }
  };

  const getPet = (id: string): Pet | undefined => {
    return pets.find(pet => pet.id === id);
  };

  const savePetsData = async (): Promise<void> => {
    try {
      await savePets(pets);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save pets'));
    }
  };

  return (
    <PetContext.Provider value={{
      pets,
      loading,
      error,
      addPet,
      updatePet,
      deletePet,
      getPet,
      savePets: savePetsData
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = (): PetContextType => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}; 