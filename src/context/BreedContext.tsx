import React, { createContext, useContext, useState } from 'react';

type BreedContextType = {
  selectedBreed: string;
  setSelectedBreed: (breed: string) => void;
};

const BreedContext = createContext<BreedContextType | undefined>(undefined);

export const BreedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedBreed, setSelectedBreed] = useState('');

  return (
    <BreedContext.Provider value={{ selectedBreed, setSelectedBreed }}>
      {children}
    </BreedContext.Provider>
  );
};

export const useBreed = () => {
  const context = useContext(BreedContext);
  if (context === undefined) {
    throw new Error('useBreed must be used within a BreedProvider');
  }
  return context;
}; 