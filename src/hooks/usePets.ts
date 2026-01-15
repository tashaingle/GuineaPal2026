import { PetContext } from '@/contexts/PetContext';
import { Pet } from '@/types/pet';
import { useContext } from 'react';

export interface PetContextType {
  pets: Pet[];
  loading: boolean;
  error: Error | null;
  addPet: (pet: Pet) => Promise<void>;
  updatePet: (pet: Pet) => Promise<void>;
  deletePet: (id: string) => Promise<void>;
  getPet: (id: string) => Pet | undefined;
  savePets: () => Promise<void>;
}

export const usePets = (): PetContextType => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}; 