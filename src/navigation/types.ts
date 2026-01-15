import { BondingSession } from '@/types/bonding';
import type {
    DietPreferences,
    FeedingSchedule,
    Gender,
    GuineaPig,
    HealthRecord,
    Medication,
    Mood,
    MoodEntry,
    PeeColor,
    PoopColor,
    PoopConsistency,
    VetAppointment,
    WasteLog,
    WasteType,
    WeightRecord
} from '@/types/guineaPig';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type {
    BondingSession, DietPreferences,
    FeedingSchedule, Gender, GuineaPig, HealthRecord,
    Medication, Mood, MoodEntry, PeeColor, PoopColor, PoopConsistency, VetAppointment, WasteLog, WasteType, WeightRecord
};

export type HealthTabType = 'weight' | 'medication' | 'appointments' | 'notes' | 'waste';

export type RootStackParamList = {
  '(tabs)': undefined;
  '(stack)': undefined;
  '(auth)': undefined;
  'pet-list': undefined;
  'add-edit-pet': {
    mode: 'add' | 'edit';
    pet?: GuineaPig;
    onComplete?: () => void;
  };
  'symptom-checker': undefined;
  'checklist': {
    petId?: string;
  };
  'guinea-gram': {
    petId?: string;
  };
  'bonding-tracker': undefined;
  'care-guide': undefined;
  'health-check': undefined;
  'settings': undefined;
  'calendar': undefined;
  'forgot-password': undefined;
  'register': undefined;
  'login': undefined;
  'home': undefined;
  'health': undefined;
  'care': undefined;
  'diet': undefined;
  'profile': {
    petId: string;
    onDelete?: () => void;
  };
  'breed-selection': {
    onSelect: string;
  };
  'welcome': undefined;
  'family-tree': {
    pet: GuineaPig;
    onUpdate?: () => void;
  };
  'medical-records': {
    petId: string;
  };
  'weight-tracker': {
    petId: string;
  };
  'mood-tracker': {
    petId: string;
  };
  'diet-manager': {
    petId: string;
  };
  'care-schedule': {
    petId: string;
  };
  'bonding-timer': {
    pets?: string[];
  };
  'bonding-guide': undefined;
  'waste-log': {
    petId: string;
  };
  'add-waste-log': {
    petId: string;
    onSave?: () => void;
  };
  'safe-foods': undefined;
  'new-owner-checklist': undefined;
  'care-guide-section': {
    sectionId: string;
  };
};

export type ScreenProps<T extends keyof RootStackParamList> = {
  navigation: NativeStackNavigationProp<RootStackParamList, T>;
  route: RouteProp<RootStackParamList, T>;
};