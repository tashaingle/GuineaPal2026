import fs from 'fs';

const filesToFix = [
  {
    file: 'app/(stack)/family-tree.tsx',
    changes: [
      {
        pattern: /pet: pet as any,/g,
        replacement: "pet: pet as Pet,"
      }
    ]
  },
  {
    file: 'src/screens/AddEditPetScreen.tsx',
    changes: [
      {
        pattern: /\(pet as any\)\?\.isPregnant/g,
        replacement: "(pet as GuineaPig)?.isPregnant"
      },
      {
        pattern: /\(pet as any\)\?\.pregnancyStartDate/g,
        replacement: "(pet as GuineaPig)?.pregnancyStartDate"
      },
      {
        pattern: /\(pet as any\)\?\.expectedDueDate/g,
        replacement: "(pet as GuineaPig)?.expectedDueDate"
      },
      {
        pattern: /await updatePet\(newPet as any\);/g,
        replacement: "await updatePet(newPet as Pet);"
      },
      {
        pattern: /await addPet\(newPet as any\);/g,
        replacement: "await addPet(newPet as Pet);"
      }
    ]
  },
  {
    file: 'src/screens/BondingTrackerScreen.tsx',
    changes: [
      {
        pattern: /setPets\(savedPets as any\);/g,
        replacement: "setPets(savedPets as Pet[]);"
      }
    ]
  },
  {
    file: 'src/screens/BreedSelectionScreen.tsx',
    changes: [
      {
        pattern: /setSelectedBreed\(breed as any\);/g,
        replacement: "setSelectedBreed(breed as Breed);"
      }
    ]
  },
  {
    file: 'src/screens/CareGuideSection.tsx',
    changes: [
      {
        pattern: /sections\?: any\[\];/g,
        replacement: "sections?: CareGuideSection[];"
      }
    ]
  },
  {
    file: 'src/screens/FloorTimeScreen.tsx',
    changes: [
      {
        pattern: /theme={calendarTheme as any}/g,
        replacement: "theme={calendarTheme as CalendarTheme}"
      },
      {
        pattern: /style={styles\.notesInput as any}/g,
        replacement: "style={styles.notesInput as ViewStyle}"
      }
    ]
  },
  {
    file: 'src/screens/health/AddWasteLogScreen.tsx',
    changes: [
      {
        pattern: /\(pet as any\)\.wasteLogs\?\.find\(\(l: any\)/g,
        replacement: "(pet as Pet).wasteLogs?.find((l: WasteLog)"
      },
      {
        pattern: /\(\(pet as any\)\.wasteLogs \|\| \[\]\)\.map\(\(log: any\)/g,
        replacement: "((pet as Pet).wasteLogs || []).map((log: WasteLog)"
      },
      {
        pattern: /: \[\.\.\.\(\(pet as any\)\.wasteLogs \|\| \[\]\), newLog\],/g,
        replacement: ": [...((pet as Pet).wasteLogs || []), newLog],"
      },
      {
        pattern: /await savePets\(updatedPets as any\);/g,
        replacement: "await savePets(updatedPets as Pet[]);"
      },
      {
        pattern: /const updatedPet: any = {/g,
        replacement: "const updatedPet: Pet = {"
      }
    ]
  },
  {
    file: 'src/screens/health/MoodTrackerScreen.tsx',
    changes: [
      {
        pattern: /setPet\(currentPet as any\);/g,
        replacement: "setPet(currentPet as GuineaPig);"
      },
      {
        pattern: /setMoodHistory\(\(currentPet\.moodHistory as any\)/g,
        replacement: "setMoodHistory((currentPet.moodHistory as MoodEntry[])"
      },
      {
        pattern: /setMoodHistory\(\(updatedPet\.moodHistory as any\)/g,
        replacement: "setMoodHistory((updatedPet.moodHistory as MoodEntry[])"
      }
    ]
  },
  {
    file: 'src/screens/health/WasteLogScreen.tsx',
    changes: [
      {
        pattern: /setPet\(currentPet as any\);/g,
        replacement: "setPet(currentPet as GuineaPig);"
      },
      {
        pattern: /if \(\(currentPet as any\)\.wasteLogs\)/g,
        replacement: "if ((currentPet as Pet).wasteLogs)"
      },
      {
        pattern: /setLogs\(\(currentPet as any\)\.wasteLogs\);/g,
        replacement: "setLogs((currentPet as Pet).wasteLogs);"
      },
      {
        pattern: /if \(updatedPet && \(updatedPet as any\)\.wasteLogs\)/g,
        replacement: "if (updatedPet && (updatedPet as Pet).wasteLogs)"
      },
      {
        pattern: /\(updatedPet as any\)\.wasteLogs = \(updatedPet as any\)\.wasteLogs\.filter\(\(log: any\)/g,
        replacement: "(updatedPet as Pet).wasteLogs = (updatedPet as Pet).wasteLogs.filter((log: WasteLog)"
      },
      {
        pattern: /setLogs\(\(updatedPet as any\)\.wasteLogs\);/g,
        replacement: "setLogs((updatedPet as Pet).wasteLogs);"
      }
    ]
  },
  {
    file: 'src/screens/health/WeightTrackerScreen.tsx',
    changes: [
      {
        pattern: /const handleDateChange = \(event: any,/g,
        replacement: "const handleDateChange = (event: DateTimePickerEvent,"
      }
    ]
  },
  {
    file: 'src/screens/PetListScreen.tsx',
    changes: [
      {
        pattern: /onPress=\{\(\) => handleEditPet\(pet as any\)\}/g,
        replacement: "onPress={() => handleEditPet(pet as Pet)}"
      }
    ]
  },
  {
    file: 'src/screens/ProfileScreen.tsx',
    changes: [
      {
        pattern: /\(pets\.find\(p => p\.id === petId\) as any\)/g,
        replacement: "(pets.find(p => p.id === petId) as Pet)"
      },
      {
        pattern: /setPet\(freshPet as any\);/g,
        replacement: "setPet(freshPet as GuineaPig);"
      }
    ]
  },
  {
    file: 'src/services/purchases.ts',
    changes: [
      {
        pattern: /await InAppPurchases\.requestPurchase\(productId as any\);/g,
        replacement: "await InAppPurchases.requestPurchase(productId as string);"
      }
    ]
  }
];

function replaceAnyTypes(filePath, changes) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    changes.forEach(change => {
      if (change.pattern.test(content)) {
        content = content.replace(change.pattern, change.replacement);
        modified = true;
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Replaced any types in ${filePath}`);
    } else {
      console.log(`- No any types found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Replacing any types with specific types...\n');

filesToFix.forEach(({ file, changes }) => {
  replaceAnyTypes(file, changes);
});

console.log('\nDone!'); 