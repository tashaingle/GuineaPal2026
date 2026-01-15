export interface HealthRecord {
    id: string;
    petId: string;
    date: string;
    type: 'checkup' | 'vaccination' | 'illness' | 'injury' | 'other';
    description: string;
    vet?: string;
    cost?: number;
    followUp?: string;
    medications?: string[];
    notes?: string;
} 