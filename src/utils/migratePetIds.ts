import { GuineaPig } from '@/types/guineaPig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

function isUUID(id: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
}

export async function migratePetIdsToUUID(): Promise<{ migrated: number; total: number }> {
  try {
    // Load all pets
    const petsData = await AsyncStorage.getItem('pets');
    if (!petsData) {
      return { migrated: 0, total: 0 };
    }

    const pets: GuineaPig[] = JSON.parse(petsData);
    const idMap: Record<string, string> = {};
    let migratedCount = 0;

    // Check which pets need migration
    pets.forEach(pet => {
      if (!isUUID(pet.id)) {
        const oldId = pet.id;
        const newId = uuid.v4();
        idMap[oldId] = newId;
        pet.id = newId;
        migratedCount++;
      }
    });

    if (migratedCount === 0) {
      return { migrated: 0, total: pets.length };
    }

    // Update pets in storage
    await AsyncStorage.setItem('pets', JSON.stringify(pets));

    // Update all related records
    const allKeys = await AsyncStorage.getAllKeys();
    const relatedKeys = allKeys.filter(key => 
      key.startsWith('@guinea_pal_') || 
      key.startsWith('bondingSessions') ||
      key.startsWith('diet_')
    );

    for (const key of relatedKeys) {
      const value = await AsyncStorage.getItem(key);
      if (value) {
        let updated = false;

        // Check if this key contains any old pet IDs
        for (const [oldId, newId] of Object.entries(idMap)) {
          if (key.includes(oldId)) {
            const newKey = key.replace(oldId, newId);
            await AsyncStorage.setItem(newKey, value);
            await AsyncStorage.removeItem(key);
            updated = true;
            break;
          }
        }

        // Also check if the value itself contains old pet IDs (for arrays/objects)
        if (!updated) {
          try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
              const updatedArray = parsed.map(item => {
                if (item.petId && idMap[item.petId]) {
                  return { ...item, petId: idMap[item.petId] };
                }
                return item;
              });
              if (JSON.stringify(updatedArray) !== value) {
                await AsyncStorage.setItem(key, JSON.stringify(updatedArray));
              }
            }
          } catch {
            // Not JSON, skip
          }
        }
      }
    }

    return { migrated: migratedCount, total: pets.length };

  } catch (error) {
    throw error;
  }
}

// Function to check if migration is needed
export async function checkMigrationNeeded(): Promise<boolean> {
  try {
    const petsData = await AsyncStorage.getItem('pets');
    if (!petsData) return false;

    const pets: GuineaPig[] = JSON.parse(petsData);
    return pets.some(pet => !isUUID(pet.id));
  } catch {
    return false;
  }
} 