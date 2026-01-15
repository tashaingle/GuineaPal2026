export interface BondingSession {
    id: string;
    date: string;
    duration: number; // in minutes
    location: 'floor' | 'cage' | 'playpen' | 'outside';
    notes?: string;
    pets: string[]; // array of pet IDs
    behaviors: {
        positive: string[];
        negative: string[];
    };
} 