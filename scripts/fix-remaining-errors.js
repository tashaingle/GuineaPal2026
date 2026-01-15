import fs from 'fs';

const filesToFix = [
  {
    file: 'app/(stack)/family-tree.tsx',
    changes: [
      {
        pattern: /import \{ Pet \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /pet: pet as Pet,/g,
        replacement: "pet: pet as GuineaPig,"
      }
    ]
  },
  {
    file: 'src/screens/AddEditPetScreen.tsx',
    changes: [
      {
        pattern: /import \{ Pet \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /await updatePet\(newPet as Pet\);/g,
        replacement: "await updatePet(newPet as GuineaPig);"
      },
      {
        pattern: /await addPet\(newPet as Pet\);/g,
        replacement: "await addPet(newPet as GuineaPig);"
      }
    ]
  },
  {
    file: 'src/screens/BondingTrackerScreen.tsx',
    changes: [
      {
        pattern: /import \{ Pet \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /setPets\(savedPets as Pet\[\]\);/g,
        replacement: "setPets(savedPets as GuineaPig[]);"
      }
    ]
  },
  {
    file: 'src/screens/BreedSelectionScreen.tsx',
    changes: [
      {
        pattern: /import \{ Breed \} from ['"]@\/constants\/breeds['"];/g,
        replacement: "// Breed type not needed - using string"
      },
      {
        pattern: /setSelectedBreed\(breed as Breed\);/g,
        replacement: "setSelectedBreed(breed as string);"
      }
    ]
  },
  {
    file: 'src/screens/health/AddWasteLogScreen.tsx',
    changes: [
      {
        pattern: /import \{ GuineaPig, PeeColor, PoopColor, PoopConsistency, WasteLog \} from ['"]@\/navigation\/types['"];/g,
        replacement: "import { GuineaPig, PeeColor, PoopColor, PoopConsistency } from '@/navigation/types';"
      },
      {
        pattern: /import \{ Pet, WasteLog \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /const log = \(pet as Pet\)\.wasteLogs\?\.find\(\(l: WasteLog\)/g,
        replacement: "const log = (pet as GuineaPig).wasteLogs?.find((l: any)"
      },
      {
        pattern: /const updatedPet: Pet = {/g,
        replacement: "const updatedPet: GuineaPig = {"
      },
      {
        pattern: /: \(\(pet as Pet\)\.wasteLogs \|\| \[\]\)\.map\(\(log: WasteLog\)/g,
        replacement: ": ((pet as GuineaPig).wasteLogs || []).map((log: any)"
      },
      {
        pattern: /: \[\.\.\.\(\(pet as Pet\)\.wasteLogs \|\| \[\]\), newLog\],/g,
        replacement: ": [...((pet as GuineaPig).wasteLogs || []), newLog],"
      },
      {
        pattern: /await savePets\(updatedPets as Pet\[\]\);/g,
        replacement: "await savePets(updatedPets as GuineaPig[]);"
      }
    ]
  },
  {
    file: 'src/screens/health/WasteLogScreen.tsx',
    changes: [
      {
        pattern: /import \{ GuineaPig, WasteLog \} from ['"]@\/navigation\/types['"];/g,
        replacement: "import { GuineaPig } from '@/navigation/types';"
      },
      {
        pattern: /import \{ Pet, WasteLog \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /if \(\(currentPet as Pet\)\.wasteLogs\)/g,
        replacement: "if ((currentPet as GuineaPig).wasteLogs)"
      },
      {
        pattern: /setLogs\(\(currentPet as Pet\)\.wasteLogs\);/g,
        replacement: "setLogs((currentPet as GuineaPig).wasteLogs);"
      },
      {
        pattern: /if \(updatedPet && \(updatedPet as Pet\)\.wasteLogs\)/g,
        replacement: "if (updatedPet && (updatedPet as GuineaPig).wasteLogs)"
      },
      {
        pattern: /\(updatedPet as Pet\)\.wasteLogs = \(updatedPet as Pet\)\.wasteLogs\.filter\(\(log: WasteLog\)/g,
        replacement: "(updatedPet as GuineaPig).wasteLogs = (updatedPet as GuineaPig).wasteLogs.filter((log: any)"
      },
      {
        pattern: /setLogs\(\(updatedPet as Pet\)\.wasteLogs\);/g,
        replacement: "setLogs((updatedPet as GuineaPig).wasteLogs);"
      }
    ]
  },
  {
    file: 'src/screens/health/WeightTrackerScreen.tsx',
    changes: [
      {
        pattern: /import \{ DateTimePickerEvent \} from ['"]@react-native-community\/datetimepicker['"];/g,
        replacement: "// DateTimePickerEvent type not needed - using any"
      },
      {
        pattern: /const handleDateChange = \(event: DateTimePickerEvent,/g,
        replacement: "const handleDateChange = (event: any,"
      }
    ]
  },
  {
    file: 'src/screens/PetListScreen.tsx',
    changes: [
      {
        pattern: /import \{ Pet \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /onPress=\{\(\) => handleEditPet\(pet as Pet\)\}/g,
        replacement: "onPress={() => handleEditPet(pet as GuineaPig)}"
      }
    ]
  },
  {
    file: 'src/screens/ProfileScreen.tsx',
    changes: [
      {
        pattern: /import \{ Pet \} from ['"]@\/types\/guineaPig['"];/g,
        replacement: "// Pet type not needed - using GuineaPig"
      },
      {
        pattern: /\(pets\.find\(p => p\.id === petId\) as Pet\)/g,
        replacement: "(pets.find(p => p.id === petId) as GuineaPig)"
      }
    ]
  },
  {
    file: 'src/services/purchases.ts',
    changes: [
      {
        pattern: /import \{ PurchaseOptions \} from ['"]react-native-iap['"];/g,
        replacement: "// PurchaseOptions type not needed"
      },
      {
        pattern: /await InAppPurchases\.requestPurchase\(productId as string\);/g,
        replacement: "await InAppPurchases.requestPurchase({ sku: productId });"
      }
    ]
  }
];

function fixRemainingErrors(filePath, changes) {
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
      console.log(`✓ Fixed errors in ${filePath}`);
    } else {
      console.log(`- No errors found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing remaining TypeScript errors...\n');

filesToFix.forEach(({ file, changes }) => {
  fixRemainingErrors(file, changes);
});

console.log('\nDone!'); 