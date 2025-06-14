import { Stats } from '@/types';
import type { GuineaPig } from '@/types/guineaPig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@guinea_pal_pets';
const BACKUP_KEY = '@guinea_pal_pets_backup';
const OLD_STORAGE_KEY = '@guinea_pal_pets_old';
const LAST_SYNC_KEY = '@guinea_pal_last_sync';
const STATS_KEY = '@guinea_pal_stats';

type StorageOperationResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};

const isValidPet = (pet: any): pet is GuineaPig => {
  if (!pet || typeof pet !== 'object') {
    console.warn('Invalid pet: not an object');
    return false;
  }

  const requiredFields = ['id', 'name', 'breed', 'gender', 'createdAt', 'updatedAt'];
  const missingFields = requiredFields.filter(field => !pet[field]);
  
  if (missingFields.length > 0) {
    console.warn('Invalid pet: missing required fields:', missingFields);
    return false;
  }

  if (typeof pet.id !== 'string' || !pet.id) {
    console.warn('Invalid pet: invalid id');
    return false;
  }

  if (typeof pet.name !== 'string' || !pet.name.trim()) {
    console.warn('Invalid pet: invalid name');
    return false;
  }

  if (typeof pet.breed !== 'string' || !pet.breed) {
    console.warn('Invalid pet: invalid breed');
    return false;
  }

  if (!['male', 'female', 'unknown'].includes(pet.gender)) {
    console.warn('Invalid pet: invalid gender');
    return false;
  }

  if (typeof pet.createdAt !== 'string' || !pet.createdAt) {
    console.warn('Invalid pet: invalid createdAt');
    return false;
  }

  if (typeof pet.updatedAt !== 'string' || !pet.updatedAt) {
    console.warn('Invalid pet: invalid updatedAt');
    return false;
  }

  // Optional fields validation
  if (pet.birthDate && typeof pet.birthDate !== 'string') {
    console.warn('Invalid pet: invalid birthDate');
    return false;
  }

  if (pet.weight !== undefined && (typeof pet.weight !== 'number' || isNaN(pet.weight))) {
    console.warn('Invalid pet: invalid weight');
    return false;
  }

  if (pet.image && typeof pet.image !== 'string') {
    console.warn('Invalid pet: invalid image');
    return false;
  }

  if (pet.isPregnant !== undefined && typeof pet.isPregnant !== 'boolean') {
    console.warn('Invalid pet: invalid isPregnant');
    return false;
  }

  if (pet.pregnancyStartDate && typeof pet.pregnancyStartDate !== 'string') {
    console.warn('Invalid pet: invalid pregnancyStartDate');
    return false;
  }

  if (pet.pregnancyNotes && typeof pet.pregnancyNotes !== 'string') {
    console.warn('Invalid pet: invalid pregnancyNotes');
    return false;
  }

  if (pet.expectedDueDate && typeof pet.expectedDueDate !== 'string') {
    console.warn('Invalid pet: invalid expectedDueDate');
    return false;
  }

  return true;
};

export const loadPets = async (): Promise<GuineaPig[]> => {
  try {
    console.log('Loading pets from storage...');
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    console.log('Raw storage data:', jsonValue);
    
    if (!jsonValue) {
      console.log('No pets found in storage, checking for old storage key...');
      // Try to load from old storage key
      const oldJsonValue = await AsyncStorage.getItem(OLD_STORAGE_KEY);
      if (oldJsonValue) {
        console.log('Found pets in old storage, migrating...');
        const oldPets = JSON.parse(oldJsonValue);
        // Save to new storage key
        await AsyncStorage.setItem(STORAGE_KEY, oldJsonValue);
        // Remove old storage key
        await AsyncStorage.removeItem(OLD_STORAGE_KEY);
        console.log('Migration complete, loaded', oldPets.length, 'pets');
        return oldPets;
      }
      console.log('No pets found in any storage');
      return [];
    }

    const pets = JSON.parse(jsonValue);
    console.log('Loaded', pets.length, 'pets from storage');
    return pets;
  } catch (error) {
    console.error('Error loading pets:', error);
    return [];
  }
};

export const savePets = async (pets: GuineaPig[]): Promise<void> => {
  try {
    console.log('Starting save process...');
    console.log('Number of pets to save:', pets.length);
    
    // Validate pets
    const validPets = pets.filter(pet => {
      const isValid = isValidPet(pet);
      if (!isValid) {
        console.warn('Invalid pet found:', pet);
      }
      return isValid;
    });

    console.log('Valid pets to save:', validPets.length);

    // Create backup of current pets
    const currentPets = await loadPets();
    console.log('Current pets count:', currentPets.length);
    
    if (currentPets.length > 0) {
      console.log('Creating backup of current pets...');
      await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(currentPets));
      console.log('Backup created successfully');
    }

    // Save new pets
    console.log('Saving pets to storage...');
    const jsonValue = JSON.stringify(validPets);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    console.log('Pets saved successfully');

    // Update last sync timestamp
    await AsyncStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
    console.log('Last sync timestamp updated');
  } catch (error) {
    console.error('Error saving pets:', error);
    throw error;
  }
};

export const getPetById = async (id: string): Promise<StorageOperationResult<GuineaPig | undefined>> => {
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: new Error('Invalid pet ID')
    };
  }

  try {
    const pets = await loadPets();
    const pet = pets.find(pet => pet.id === id);
    return { 
      success: true, 
      data: pet 
    };
  } catch (error) {
    console.error(`Failed to get pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Pet lookup failed')
    };
  }
};

export const addOrUpdatePet = async (pet: GuineaPig): Promise<StorageOperationResult<void>> => {
  if (!isValidPet(pet)) {
    return {
      success: false,
      error: new Error('Invalid pet data')
    };
  }

  try {
    const pets = await loadPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
   
    const newPets = [...pets]; 
    if (existingIndex >= 0) {
      newPets[existingIndex] = pet;
    } else {
      newPets.push(pet);
    }

    await savePets(newPets);
    return { success: true };
  } catch (error) {
    console.error('Failed to update pets:', error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Update operation failed')
    };
  }
};

export const deletePet = async (id: string): Promise<StorageOperationResult<boolean>> => {
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: new Error('Invalid pet ID')
    };
  }

  try {
    const pets = await loadPets();
    const newPets = pets.filter(pet => pet.id !== id);
   
    if (newPets.length !== pets.length) {
      await savePets(newPets);
      return { success: true, data: true };
    }
    return { success: true, data: false };
  } catch (error) {
    console.error(`Failed to delete pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Deletion failed')
    };
  }
};

export const loadStats = async (): Promise<Stats> => {
    try {
        const savedStats = await AsyncStorage.getItem(STATS_KEY);
        if (savedStats) {
            return JSON.parse(savedStats);
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
    
    // Return default stats if none found
    return {
        happiness: 50,
        hunger: 50,
        health: 50,
        energy: 50,
        interactionCount: 0,
        lastInteraction: new Date().toISOString(),
        dailyInteractions: {
            [new Date().toDateString()]: 0
        }
    };
};

export const saveStats = async (stats: Stats): Promise<void> => {
    try {
        await AsyncStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (error) {
        console.error('Error saving stats:', error);
    }
};
