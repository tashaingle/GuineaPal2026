export const GUINEA_PIG_BREEDS = [
    'Abyssinian',
    'American',
    'American Crested',
    'Baldwin',
    'Coronet',
    'Cuy',
    'English Crested',
    'Himalayan',
    'Merino',
    'Mixed Breed',
    'Peruvian',
    'Rex',
    'Sheltie',
    'Skinny',
    'Teddy',
    'Texel',
    'Unknown'
] as const;

export type GuineaPigBreed = typeof GUINEA_PIG_BREEDS[number];

export const GUINEA_PIG_NAMES = [
    // Food-inspired names
    'Pepper', 'Ginger', 'Cocoa', 'Mocha', 'Caramel', 'Honey', 'Cookie', 'Muffin', 'Pumpkin', 'Olive',
    // Nature-inspired names
    'Willow', 'Daisy', 'Sunny', 'Storm', 'River', 'Sky', 'Rain', 'Leaf', 'Flower', 'Meadow',
    // Cute/Adorable names
    'Pip', 'Pipkin', 'Pippin', 'Poppy', 'Peanut', 'Pudding', 'Pumpkin', 'Pixie', 'Pebbles', 'Panda',
    // Character-inspired names
    'Gizmo', 'Fuzzy', 'Fluffy', 'Furball', 'Fuzzball', 'Fuzzy Wuzzy', 'Fuzzy Bear', 'Fuzzy Face', 'Fuzzy Butt', 'Fuzzy Pants',
    // Unique names
    'Ziggy', 'Zephyr', 'Zorro', 'Zigzag', 'Zipper', 'Zesty', 'Zany', 'Zippy', 'Zesty', 'Zippy'
] as const;

export type GuineaPigName = typeof GUINEA_PIG_NAMES[number]; 