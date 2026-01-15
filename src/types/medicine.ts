export interface Medicine {
    id: string;
    name: string;
    type: 'tablet' | 'liquid' | 'injection' | 'other';
    dosage: string;
    frequency: string;
    startDate: string;
    endDate?: string;
    notes?: string;
    petIds: string[];
} 