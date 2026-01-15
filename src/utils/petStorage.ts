import { DietPreferences, FeedingSchedule, HealthRecord, Medication, VetAppointment, WeightRecord } from '@/navigation/types';
import { GuineaPig } from '@/types/guineaPig';
import logger from '@/utils/logger';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  PETS: '@guinea_pal_pets',
  HEALTH_RECORDS: '@guinea_pal_health_records_',
  MEDICATIONS: '@guinea_pal_medications_',
  VET_APPOINTMENTS: '@guinea_pal_vet_appointments_',
  WEIGHT_RECORDS: '@guinea_pal_weight_records_',
  CARE_SCHEDULE: '@guinea_pal_care_schedule_',
  DIET_PREFERENCES: '@guinea_pal_diet_preferences_',
  FEEDING_SCHEDULE: '@guinea_pal_feeding_schedule_'
};

// Health Records
export const saveHealthRecord = async (petId: string, record: HealthRecord): Promise<void> => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = [...records, record];
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const loadHealthRecords = async (petId: string): Promise<HealthRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEYS.HEALTH_RECORDS + petId);
    return records ? JSON.parse(records) : [];
  } catch {
    return [];
  }
};

// Medications
export const saveMedication = async (petId: string, medication: Medication): Promise<void> => {
  const medications = await loadMedications(petId);
  const updatedMedications = [...medications, medication];
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const loadMedications = async (petId: string): Promise<Medication[]> => {
  try {
    const medications = await AsyncStorage.getItem(STORAGE_KEYS.MEDICATIONS + petId);
    return medications ? JSON.parse(medications) : [];
  } catch {
    return [];
  }
};

// Vet Appointments
export const saveVetAppointment = async (petId: string, appointment: VetAppointment): Promise<void> => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = [...appointments, appointment];
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

export const loadVetAppointments = async (petId: string): Promise<VetAppointment[]> => {
  try {
    const appointments = await AsyncStorage.getItem(STORAGE_KEYS.VET_APPOINTMENTS + petId);
    return appointments ? JSON.parse(appointments) : [];
  } catch {
    return [];
  }
};

// Weight Records
export const saveWeightRecord = async (petId: string, record: WeightRecord): Promise<void> => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = [...records, record];
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const loadWeightRecords = async (petId: string): Promise<WeightRecord[]> => {
  try {
    const records = await AsyncStorage.getItem(STORAGE_KEYS.WEIGHT_RECORDS + petId);
    return records ? JSON.parse(records) : [];
  } catch {
    return [];
  }
};

export const updateWeightRecord = async (petId: string, updatedRecord: WeightRecord): Promise<void> => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = records.map(record => 
    record.id === updatedRecord.id ? updatedRecord : record
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

// Update functions
export const updateHealthRecord = async (petId: string, updatedRecord: HealthRecord): Promise<void> => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = records.map(record => 
    record.id === updatedRecord.id ? updatedRecord : record
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const updateMedication = async (petId: string, updatedMedication: Medication): Promise<void> => {
  const medications = await loadMedications(petId);
  const updatedMedications = medications.map(medication => 
    medication.id === updatedMedication.id ? updatedMedication : medication
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const updateVetAppointment = async (petId: string, updatedAppointment: VetAppointment): Promise<void> => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = appointments.map(appointment => 
    appointment.id === updatedAppointment.id ? updatedAppointment : appointment
  );
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

// Delete functions
export const deleteHealthRecord = async (petId: string, recordId: string): Promise<void> => {
  const records = await loadHealthRecords(petId);
  const updatedRecords = records.filter(record => record.id !== recordId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.HEALTH_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

export const deleteMedication = async (petId: string, medicationId: string): Promise<void> => {
  const medications = await loadMedications(petId);
  const updatedMedications = medications.filter(medication => medication.id !== medicationId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.MEDICATIONS + petId,
    JSON.stringify(updatedMedications)
  );
};

export const deleteVetAppointment = async (petId: string, appointmentId: string): Promise<void> => {
  const appointments = await loadVetAppointments(petId);
  const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.VET_APPOINTMENTS + petId,
    JSON.stringify(updatedAppointments)
  );
};

export const deleteWeightRecord = async (petId: string, recordId: string): Promise<void> => {
  const records = await loadWeightRecords(petId);
  const updatedRecords = records.filter(record => record.id !== recordId);
  await AsyncStorage.setItem(
    STORAGE_KEYS.WEIGHT_RECORDS + petId,
    JSON.stringify(updatedRecords)
  );
};

// Diet Preferences
export const saveDietPreferences = async (petId: string, preferences: DietPreferences): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.DIET_PREFERENCES + petId,
    JSON.stringify(preferences)
  );
};

export const loadDietPreferences = async (petId: string): Promise<DietPreferences | null> => {
  try {
    const preferences = await AsyncStorage.getItem(STORAGE_KEYS.DIET_PREFERENCES + petId);
    return preferences ? JSON.parse(preferences) : null;
  } catch {
    return null;
  }
};

// Feeding Schedule
export const saveFeedingSchedule = async (petId: string, schedule: FeedingSchedule): Promise<void> => {
  await AsyncStorage.setItem(
    STORAGE_KEYS.FEEDING_SCHEDULE + petId,
    JSON.stringify(schedule)
  );
};

export const loadFeedingSchedule = async (petId: string): Promise<FeedingSchedule | null> => {
  try {
    const schedule = await AsyncStorage.getItem(STORAGE_KEYS.FEEDING_SCHEDULE + petId);
    return schedule ? JSON.parse(schedule) : null;
  } catch {
    return null;
  }
};

export const loadPets = async (): Promise<GuineaPig[]> => {
    try {
        const petsData = await AsyncStorage.getItem('pets');
        return petsData ? JSON.parse(petsData) : [];
    } catch {
        return [];
    }
};

export const savePets = async (pets: GuineaPig[]): Promise<void> => {
    try {
        await AsyncStorage.setItem('pets', JSON.stringify(pets));
    } catch {
        throw new Error('Failed to save pets');
    }
};

export type Diet = {
    foodItems: Array<{
        id: string;
        name: string;
        amount: string;
        frequency: string;
        notes?: string;
    }>;
    allergies: string[];
    favoriteFruits: string[];
    favoriteVegetables: string[];
};

export async function loadDiet(petId: string): Promise<Diet | null> {
    try {
        const dietData = await AsyncStorage.getItem(`diet_${petId}`);
        if (dietData) {
            const parsed = JSON.parse(dietData);
            return {
                foodItems: parsed.foodItems || [],
                allergies: parsed.allergies || [],
                favoriteFruits: parsed.favoriteFruits || [],
                favoriteVegetables: parsed.favoriteVegetables || []
            };
        }
        return null;
    } catch {
        return null;
    }
}

export async function saveDiet(petId: string, diet: Diet): Promise<void> {
    try {
        await AsyncStorage.setItem(`diet_${petId}`, JSON.stringify(diet));
    } catch (error) {
        logger.error('Failed to save diet:', error);
        throw new Error('Failed to save diet');
    }
} 