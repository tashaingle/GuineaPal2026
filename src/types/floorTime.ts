export interface FloorTimeSession {
    id: string;
    date: string;
    duration: number;
    location: 'floor' | 'garden';
    notes?: string;
    pets: string[];
} 