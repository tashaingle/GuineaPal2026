import React, { createContext, useContext, useEffect, useState } from 'react';
import { GuineaPig } from '../types/guineaPig';
import { loadPets, savePets } from '../utils/storage';

interface PetContextType {
  pets: GuineaPig[];
  loading: boolean;
  error: Error | null;
  addPet: (pet: GuineaPig) => Promise<void>;
  updatePet: (pet: GuineaPig) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPet: (id: string) => GuineaPig | undefined;
}

export const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<GuineaPig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadPetsData();
  }, []);

  const loadPetsData = async () => {
    try {
      console.log('Loading pets data...');
      const loadedPets = await loadPets();
      console.log('Loaded pets:', loadedPets);
      setPets(loadedPets);
      setError(null);
    } catch (err) {
      console.error('Error loading pets:', err);
      setError(err instanceof Error ? err : new Error('Failed to load pets'));
    } finally {
      setLoading(false);
    }
  };

  const addPet = async (pet: GuineaPig) => {
    try {
      console.log('Adding new pet:', pet);
      const newPets = [...pets, pet];
      console.log('New pets array:', newPets);
      await savePets(newPets);
      console.log('Pets saved successfully');
      setPets(newPets);
      setError(null);
    } catch (err) {
      console.error('Error adding pet:', err);
      setError(err instanceof Error ? err : new Error('Failed to add pet'));
      throw err;
    }
  };

  const updatePet = async (updatedPet: GuineaPig) => {
    try {
      console.log('Updating pet:', updatedPet);
      const newPets = pets.map(pet => 
        pet.id === updatedPet.id ? { ...updatedPet, updatedAt: new Date().toISOString() } : pet
      );
      console.log('Updated pets array:', newPets);
      await savePets(newPets);
      console.log('Pets saved successfully');
      setPets(newPets);
      setError(null);
    } catch (err) {
      console.error('Error updating pet:', err);
      setError(err instanceof Error ? err : new Error('Failed to update pet'));
      throw err;
    }
  };

  const deletePet = async (id: string) => {
    try {
      console.log('Deleting pet:', id);
      const newPets = pets.filter(pet => pet.id !== id);
      console.log('Remaining pets:', newPets);
      await savePets(newPets);
      console.log('Pets saved successfully');
      setPets(newPets);
      setError(null);
    } catch (err) {
      console.error('Error deleting pet:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete pet'));
      throw err;
    }
  };

  const getPet = (id: string) => {
    return pets.find(pet => pet.id === id);
  };

  return (
    <PetContext.Provider value={{
      pets,
      loading,
      error,
      addPet,
      updatePet,
      deletePet,
      getPet
    }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePets = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}; 