import { PetContext } from '@/contexts/PetContext';
import { GuineaPig } from '@/types/guineaPig';
import { useContext } from 'react';

export interface PetContextType {
  pets: GuineaPig[];
  loading: boolean;
  error: string | null;
  addPet: (pet: GuineaPig) => void;
  updatePet: (pet: GuineaPig) => void;
  deletePet: (id: string) => void;
  savePets: () => Promise<void>;
}

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
}; 