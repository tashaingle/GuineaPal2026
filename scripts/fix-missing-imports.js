import fs from 'fs';

const filesToFix = [
  {
    file: 'app/(stack)/family-tree.tsx',
    imports: ["import { Pet } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/AddEditPetScreen.tsx',
    imports: ["import { Pet } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/BondingTrackerScreen.tsx',
    imports: ["import { Pet } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/BreedSelectionScreen.tsx',
    imports: ["import { Breed } from '@/constants/breeds';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/FloorTimeScreen.tsx',
    imports: ["import { CalendarTheme } from 'react-native-calendars';"],
    addAfter: "import { Calendar } from 'react-native-calendars';"
  },
  {
    file: 'src/screens/health/AddWasteLogScreen.tsx',
    imports: ["import { Pet, WasteLog } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/health/WasteLogScreen.tsx',
    imports: ["import { Pet, WasteLog } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/health/WeightTrackerScreen.tsx',
    imports: ["import { DateTimePickerEvent } from '@react-native-community/datetimepicker';"],
    addAfter: "import DateTimePicker from '@react-native-community/datetimepicker';"
  },
  {
    file: 'src/screens/PetListScreen.tsx',
    imports: ["import { Pet } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/screens/ProfileScreen.tsx',
    imports: ["import { Pet } from '@/types/guineaPig';"],
    addAfter: "import { GuineaPig } from '@/types/guineaPig';"
  },
  {
    file: 'src/services/purchases.ts',
    imports: ["import { PurchaseOptions } from 'react-native-iap';"],
    addAfter: "import { InAppPurchases } from 'react-native-iap';"
  }
];

function addMissingImports(filePath, imports, addAfter) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    imports.forEach(importStatement => {
      // Check if import already exists
      const importPattern = new RegExp(importStatement.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      if (!importPattern.test(content)) {
        // Find the line to add after
        const lines = content.split('\n');
        const addAfterIndex = lines.findIndex(line => line.includes(addAfter));
        
        if (addAfterIndex !== -1) {
          // Insert the new import after the specified line
          lines.splice(addAfterIndex + 1, 0, importStatement);
          content = lines.join('\n');
          modified = true;
        } else {
          // If we can't find the specified line, add at the top with other imports
          const importLines = lines.filter(line => line.trim().startsWith('import'));
          if (importLines.length > 0) {
            const lastImportIndex = lines.lastIndexOf(importLines[importLines.length - 1]);
            lines.splice(lastImportIndex + 1, 0, importStatement);
            content = lines.join('\n');
            modified = true;
          }
        }
      }
    });
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Added missing imports to ${filePath}`);
    } else {
      console.log(`- No missing imports found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Adding missing type imports...\n');

filesToFix.forEach(({ file, imports, addAfter }) => {
  addMissingImports(file, imports, addAfter);
});

console.log('\nDone!'); 