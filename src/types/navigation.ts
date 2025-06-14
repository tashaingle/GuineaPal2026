import { GuineaPig } from './guineaPig';

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
  'checklist': undefined;
  'guinea-gram': undefined;
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
  'profile': undefined;
  'care-schedule': { petId: string };
  'diet-manager': { petId: string };
  'weight-tracker': { petId: string };
  'medical-records': { petId: string };
  'mood-tracker': { petId: string };
  'waste-log': { petId: string };
}; 