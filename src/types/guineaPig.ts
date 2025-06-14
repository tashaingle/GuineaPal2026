export type Gender = 'male' | 'female' | 'unknown';

export type GuineaPig = {
  id: string;
  name: string;
  breed?: string;
  birthDate?: string;
  weight?: number;
  gender: Gender;
  image?: string;
  isPregnant?: boolean;
  pregnancyStartDate?: string;
  pregnancyNotes?: string;
  expectedDueDate?: string;
  createdAt: string;
  updatedAt: string;
  moodHistory?: MoodEntry[];
  dietPreferences?: DietPreferences;
  feedingSchedule?: FeedingSchedule;
  healthRecords?: HealthRecord[];
  medications?: Medication[];
  vetAppointments?: VetAppointment[];
  weightRecords?: WeightRecord[];
  moodEntries?: MoodEntry[];
  wasteLogs?: WasteLog[];
  // Family relationship properties
  motherId?: string;
  fatherId?: string;
  mate?: string;
  siblings?: string[];
  children?: string[];
};

export type Mood = 'happy' | 'content' | 'neutral' | 'anxious' | 'sad';

export type MoodEntry = {
  id: string;
  date: string;
  mood: Mood;
  photo?: string;
  notes?: string;
  activities: string[];
};

export type WasteType = 'poop' | 'pee';

export type PoopConsistency = 'normal' | 'soft' | 'wet' | 'dry' | 'diarrhea';
export type PoopColor = 'brown' | 'dark_brown' | 'green' | 'white' | 'red' | 'black';
export type PeeColor = 'clear' | 'cloudy' | 'dark_yellow' | 'orange' | 'red' | 'brown';

export interface WasteLog {
  id: string;
  petId: string;
  date: string;
  type: WasteType;
  frequency: number;
  frequencyType: 'per_hour' | 'per_day';
  location: string;
  notes?: string;
  poopConsistency?: PoopConsistency;
  poopColor?: PoopColor;
  peeColor?: PeeColor;
  peeVolume?: 'normal' | 'excessive' | 'reduced';
}

export type HealthRecord = {
  id: string;
  date: string;
  type: 'symptom' | 'checkup' | 'treatment' | 'note';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  resolved?: boolean;
  createdAt: string;
};

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  reminderEnabled: boolean;
  active: boolean;
};

export type VetAppointment = {
  id: string;
  date: string;
  time: string;
  purpose: string;
  vetName?: string;
  clinic?: string;
  notes?: string;
  completed: boolean;
  reminderEnabled: boolean;
};

export type WeightRecord = {
  id: string;
  date: string;
  weight: number;
  notes?: string;
};

export type DietPreferences = {
  favoriteVegetables: string[];
  favoriteFruits: string[];
  allergies: string[];
  restrictions: string[];
  hayPreference: string;
};

export type FeedingSchedule = {
  hay: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    amount: string;
  };
  pellets: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    amount: string;
  };
  vegetables: {
    frequency: 'daily' | 'twice_daily';
    times: string[];
    items: Array<{
      name: string;
      amount: string;
    }>;
  };
  fruits: {
    frequency: 'weekly';
    days: number[];
    amount: string;
  };
}; 