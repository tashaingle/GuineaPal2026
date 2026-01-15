import { Stats } from '@/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BondingSession } from '../types/bonding';
import { EmergencyContact } from '../types/emergencyContact';
import { Event } from '../types/event';
import { FamilyTree } from '../types/familyTree';
import { FloorTimeSession } from '../types/floorTime';
import { GuineaGramPost } from '../types/guineaGram';
import { HealthRecord } from '../types/health';
import { Medicine } from '../types/medicine';
import { Pet } from '../types/pet';
import { WeightRecord } from '../types/weight';
import { logger } from './logger';

// const STORAGE_KEY = '@guinea_pal_pets';
// const BACKUP_KEY = '@guinea_pal_pets_backup';
// const OLD_STORAGE_KEY = '@guinea_pal_pets_old';
// const LAST_SYNC_KEY = '@guinea_pal_last_sync';
const STATS_KEY = '@stats';

// Storage keys
const PETS_KEY = 'pets';
const FLOOR_TIME_KEY = '@floor_time';
const BONDING_KEY = '@bonding';
const EMERGENCY_CONTACTS_KEY = '@emergency_contacts';
const EVENTS_KEY = '@events';
const FAMILY_TREE_KEY = '@family_tree';
const GUINEAGRAM_KEY = '@guineagram';
const HEALTH_RECORDS_KEY = '@health_records';
const MEDICINES_KEY = '@medicines';
const WEIGHT_RECORDS_KEY = '@weight_records';

type StorageOperationResult<T> = {
  success: boolean;
  data?: T;
  error?: Error;
};

// Type for unknown pet data before validation
type UnknownPetData = {
  id?: unknown;
  name?: unknown;
  breed?: unknown;
  gender?: unknown;
  createdAt?: unknown;
  updatedAt?: unknown;
  birthDate?: unknown;
  weight?: unknown;
  image?: unknown;
  isPregnant?: unknown;
  pregnancyStartDate?: unknown;
  pregnancyNotes?: unknown;
  expectedDueDate?: unknown;
  [key: string]: unknown;
};

// Generic storage functions
export const storeData = async <T>(key: string, value: T): Promise<void> => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
        logger.info(`Stored data for key: ${key}`);
    } catch (error) {
        logger.error(`Error storing data for key: ${key}`, error);
        throw error;
    }
};

export const getData = async <T>(key: string): Promise<T | null> => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
        logger.error(`Error retrieving data for key: ${key}`, error);
        throw error;
    }
};

// Pet storage functions
export const storePets = async (pets: Pet[]): Promise<void> => {
    await storeData(PETS_KEY, pets);
};

export const getPets = async (): Promise<Pet[]> => {
    return (await getData<Pet[]>(PETS_KEY)) || [];
};

// Legacy function names for backward compatibility
export const loadPets = async (): Promise<Pet[]> => {
    return await getPets();
};

export const savePets = async (pets: Pet[]): Promise<void> => {
    await storePets(pets);
};

// Floor time storage functions
export const storeFloorTimeSessions = async (sessions: FloorTimeSession[]): Promise<void> => {
    await storeData(FLOOR_TIME_KEY, sessions);
};

export const getFloorTimeSessions = async (): Promise<FloorTimeSession[]> => {
    return (await getData<FloorTimeSession[]>(FLOOR_TIME_KEY)) || [];
};

// Bonding storage functions
export const storeBondingSessions = async (sessions: BondingSession[]): Promise<void> => {
    await storeData(BONDING_KEY, sessions);
};

export const getBondingSessions = async (): Promise<BondingSession[]> => {
    return (await getData<BondingSession[]>(BONDING_KEY)) || [];
};

// Emergency contacts storage functions
export const storeEmergencyContacts = async (contacts: EmergencyContact[]): Promise<void> => {
    await storeData(EMERGENCY_CONTACTS_KEY, contacts);
};

export const getEmergencyContacts = async (): Promise<EmergencyContact[]> => {
    return (await getData<EmergencyContact[]>(EMERGENCY_CONTACTS_KEY)) || [];
};

// Events storage functions
export const storeEvents = async (events: Event[]): Promise<void> => {
    await storeData(EVENTS_KEY, events);
};

export const getEvents = async (): Promise<Event[]> => {
    return (await getData<Event[]>(EVENTS_KEY)) || [];
};

// Family tree storage functions (per-pet)
export const storeFamilyTree = async (familyTree: FamilyTree, petId?: string): Promise<void> => {
    const key = petId ? `${FAMILY_TREE_KEY}_${petId}` : FAMILY_TREE_KEY;
    await storeData(key, familyTree);
};

export const getFamilyTree = async (petId?: string): Promise<FamilyTree | null> => {
    const key = petId ? `${FAMILY_TREE_KEY}_${petId}` : FAMILY_TREE_KEY;
    return await getData<FamilyTree>(key);
};

// GuineaGram storage functions
export const storeGuineaGramPosts = async (posts: GuineaGramPost[]): Promise<void> => {
    await storeData(GUINEAGRAM_KEY, posts);
};

export const getGuineaGramPosts = async (): Promise<GuineaGramPost[]> => {
    return (await getData<GuineaGramPost[]>(GUINEAGRAM_KEY)) || [];
};

// Health records storage functions
export const storeHealthRecords = async (records: HealthRecord[]): Promise<void> => {
    await storeData(HEALTH_RECORDS_KEY, records);
};

export const getHealthRecords = async (): Promise<HealthRecord[]> => {
    return (await getData<HealthRecord[]>(HEALTH_RECORDS_KEY)) || [];
};

// Medicines storage functions
export const storeMedicines = async (medicines: Medicine[]): Promise<void> => {
    await storeData(MEDICINES_KEY, medicines);
};

export const getMedicines = async (): Promise<Medicine[]> => {
    return (await getData<Medicine[]>(MEDICINES_KEY)) || [];
};

// Weight records storage functions
export const storeWeightRecords = async (records: WeightRecord[]): Promise<void> => {
    await storeData(WEIGHT_RECORDS_KEY, records);
};

export const getWeightRecords = async (): Promise<WeightRecord[]> => {
    return (await getData<WeightRecord[]>(WEIGHT_RECORDS_KEY)) || [];
};

export const getPetById = async (id: string): Promise<StorageOperationResult<Pet | undefined>> => {
  if (!id || typeof id !== 'string') {
    return {
      success: false,
      error: new Error('Invalid pet ID')
    };
  }

  try {
    const pets = await getPets();
    const pet = pets.find(pet => pet.id === id);
    return { 
      success: true, 
      data: pet 
    };
  } catch (error) {
    logger.error(`Failed to get pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Pet lookup failed')
    };
  }
};

export const addOrUpdatePet = async (pet: Pet): Promise<StorageOperationResult<void>> => {
  if (!isValidPet(pet)) {
    return {
      success: false,
      error: new Error('Invalid pet data')
    };
  }

  try {
    const pets = await getPets();
    const existingIndex = pets.findIndex(p => p.id === pet.id);
   
    const newPets = [...pets]; 
    if (existingIndex >= 0) {
      newPets[existingIndex] = pet;
    } else {
      newPets.push(pet);
    }

    await storePets(newPets);
    return { success: true };
  } catch (error) {
    logger.error('Failed to update pets:', error);
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
    const pets = await getPets();
    const newPets = pets.filter(pet => pet.id !== id);
   
    if (newPets.length !== pets.length) {
      await storePets(newPets);
      return { success: true, data: true };
    }
    return { success: true, data: false };
  } catch (error) {
    logger.error(`Failed to delete pet with ID ${id}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error : new Error('Deletion failed')
    };
  }
};

export const loadStats = async (): Promise<Stats> => {
    try {
        const savedStats = await getData<Stats>(STATS_KEY);
        if (savedStats) {
            return savedStats;
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
        await storeData(STATS_KEY, stats);
    } catch (error) {
        console.error('Error saving stats:', error);
    }
};

const isValidPet = (pet: unknown): pet is Pet => {
  if (!pet || typeof pet !== 'object') {
    return false;
  }

  const petData = pet as UnknownPetData;
  const requiredFields = ['id', 'name', 'breed', 'gender', 'createdAt', 'updatedAt'];
  const missingFields = requiredFields.filter(field => !petData[field]);
  
  if (missingFields.length > 0) {
    return false;
  }

  if (typeof petData.id !== 'string' || !petData.id) {
    return false;
  }

  if (typeof petData.name !== 'string' || !petData.name.trim()) {
    return false;
  }

  if (typeof petData.breed !== 'string' || !petData.breed) {
    return false;
  }

  if (!['male', 'female', 'unknown'].includes(petData.gender as string)) {
    return false;
  }

  if (typeof petData.createdAt !== 'string' || !petData.createdAt) {
    return false;
  }

  if (typeof petData.updatedAt !== 'string' || !petData.updatedAt) {
    return false;
  }

  // Optional fields validation
  if (petData.birthDate && typeof petData.birthDate !== 'string') {
    return false;
  }

  if (petData.weight !== undefined && (typeof petData.weight !== 'number' || isNaN(petData.weight))) {
    return false;
  }

  if (petData.image && typeof petData.image !== 'string') {
    return false;
  }

  if (petData.isPregnant !== undefined && typeof petData.isPregnant !== 'boolean') {
    return false;
  }

  if (petData.pregnancyStartDate && typeof petData.pregnancyStartDate !== 'string') {
    return false;
  }

  if (petData.pregnancyNotes && typeof petData.pregnancyNotes !== 'string') {
    return false;
  }

  if (petData.expectedDueDate && typeof petData.expectedDueDate !== 'string') {
    return false;
  }

  return true;
};
