export interface Event {
    id: string;
    title: string;
    date: string;
    description?: string;
    type: 'birthday' | 'adoption' | 'medical' | 'other';
    petIds: string[];
    reminder?: boolean;
    reminderDate?: string;
} 