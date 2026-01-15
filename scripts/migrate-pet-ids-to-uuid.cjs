// WARNING: Run this script only once and make a backup of your data before proceeding!
// This script migrates all pets in AsyncStorage from numeric string IDs to UUIDs.
// It updates the 'pets' key and all related records (health, weight, etc.).

const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Path to your AsyncStorage file (adjust as needed)
const ASYNC_STORAGE_PATH = path.join(__dirname, '../path/to/your/asyncstorage.json');

// Keys for related records
const RELATED_KEYS = [
  '@guinea_pal_health_records_',
  '@guinea_pal_weight_records_',
  '@guinea_pal_medications_',
  '@guinea_pal_vet_appointments_',
  '@guinea_pal_care_schedule_',
  '@guinea_pal_diet_preferences_',
  '@guinea_pal_feeding_schedule_'
];

function isUUID(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(id);
}

function migrate() {
  if (!fs.existsSync(ASYNC_STORAGE_PATH)) {
    console.error('AsyncStorage file not found:', ASYNC_STORAGE_PATH);
    process.exit(1);
  }

  const storage = JSON.parse(fs.readFileSync(ASYNC_STORAGE_PATH, 'utf8'));
  if (!storage['pets']) {
    console.error('No pets found in storage.');
    process.exit(1);
  }

  let pets = JSON.parse(storage['pets']);
  let idMap = {};
  let updated = false;

  // Assign new UUIDs to pets with non-UUID ids
  pets = pets.map(pet => {
    if (!isUUID(pet.id)) {
      const oldId = pet.id;
      const newId = uuidv4();
      idMap[oldId] = newId;
      pet.id = newId;
      updated = true;
      console.log(`Pet '${pet.name}' id changed: ${oldId} -> ${newId}`);
    }
    return pet;
  });

  if (!updated) {
    console.log('No pets needed migration.');
    return;
  }

  // Update pets in storage
  storage['pets'] = JSON.stringify(pets);

  // Update all related records
  for (const key of Object.keys(storage)) {
    for (const oldId in idMap) {
      if (key.startsWith('@guinea_pal_') && key.endsWith(oldId)) {
        const newKey = key.replace(oldId, idMap[oldId]);
        storage[newKey] = storage[key];
        delete storage[key];
        console.log(`Updated key: ${key} -> ${newKey}`);
      }
    }
  }

  // Save updated storage
  fs.writeFileSync(ASYNC_STORAGE_PATH, JSON.stringify(storage, null, 2), 'utf8');
  console.log('Migration complete. All pet IDs are now UUIDs.');
}

migrate(); 