import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface Breed {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  careLevel: 'easy' | 'medium' | 'hard';
  lifespan: string;
  size: 'small' | 'medium' | 'large';
  image?: string;
}

interface BreedContextType {
  breeds: Breed[];
  selectedBreed: Breed | null;
  setSelectedBreed: (breed: Breed | null) => void;
  searchBreeds: (query: string) => Breed[];
}

const BreedContext = createContext<BreedContextType | undefined>(undefined);

const DEFAULT_BREEDS: Breed[] = [
  {
    id: '1',
    name: 'American',
    description: 'The most common breed of guinea pig, known for its short, smooth coat.',
    characteristics: ['Friendly', 'Easy to handle', 'Good for beginners'],
    careLevel: 'easy',
    lifespan: '5-7 years',
    size: 'medium',
  },
  {
    id: '2',
    name: 'Abyssinian',
    description: 'Known for its distinctive rosettes or swirls in its coat.',
    characteristics: ['Active', 'Playful', 'Requires regular grooming'],
    careLevel: 'medium',
    lifespan: '5-7 years',
    size: 'medium',
  },
  {
    id: '3',
    name: 'Peruvian',
    description: 'Long-haired breed that requires extensive grooming.',
    characteristics: ['Beautiful long coat', 'Requires daily grooming', 'Gentle temperament'],
    careLevel: 'hard',
    lifespan: '5-7 years',
    size: 'medium',
  },
  {
    id: '4',
    name: 'Silkie',
    description: 'Long-haired breed with a smooth, flowing coat.',
    characteristics: ['Silky smooth coat', 'Requires regular grooming', 'Calm temperament'],
    careLevel: 'medium',
    lifespan: '5-7 years',
    size: 'medium',
  },
  {
    id: '5',
    name: 'Teddy',
    description: 'Short-haired breed with a dense, plush coat.',
    characteristics: ['Soft, dense coat', 'Low maintenance', 'Friendly'],
    careLevel: 'easy',
    lifespan: '5-7 years',
    size: 'medium',
  },
];

interface BreedProviderProps {
  children: ReactNode;
}

export const BreedProvider: React.FC<BreedProviderProps> = ({ children }) => {
  const [breeds] = useState<Breed[]>(DEFAULT_BREEDS);
  const [selectedBreed, setSelectedBreed] = useState<Breed | null>(null);

  const searchBreeds = (query: string): Breed[] => {
    if (!query.trim()) return breeds;
    return breeds.filter(breed =>
      breed.name.toLowerCase().includes(query.toLowerCase()) ||
      breed.description.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value: BreedContextType = {
    breeds,
    selectedBreed,
    setSelectedBreed,
    searchBreeds,
  };

  return (
    <BreedContext.Provider value={value}>
      {children}
    </BreedContext.Provider>
  );
};

export const useBreed = (): BreedContextType => {
  const context = useContext(BreedContext);
  if (context === undefined) {
    throw new Error('useBreed must be used within a BreedProvider');
  }
  return context;
}; 