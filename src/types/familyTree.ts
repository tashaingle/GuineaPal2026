export interface FamilyMember {
    id: string;
    name: string;
    relationship: 'parent' | 'sibling' | 'offspring' | 'mate';
    gender: 'male' | 'female';
    birthDate?: string;
    deathDate?: string;
    parents?: string[];
    children?: string[];
    partner?: string;
    notes?: string;
    petId?: string;
}

export interface FamilyTree {
    members: FamilyMember[];
    lastUpdated: string;
} 