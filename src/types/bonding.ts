export interface BondingSession {
    id: string;
    date: string;
    duration: number; // in minutes
    pets: string[]; // array of pet IDs
    notes?: string;
    behaviors?: {
        positive: string[];
        negative: string[];
    };
    location?: string;
} 