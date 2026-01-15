import fs from 'fs';

const filesToFix = [
  {
    file: 'app/(stack)/_layout.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'app/(stack)/family-tree.tsx',
    changes: [
      {
        pattern: /pet: pet as any,/g,
        replacement: "pet: pet as GuineaPig,"
      }
    ]
  },
  {
    file: 'src/components/AppHeader.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/components/BaseScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/components/ui/IconSymbol.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/components/ui/TabBarBackground.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/contexts/ThemeContext.tsx',
    changes: [
      {
        pattern: /import \{ getColor \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/AddEditPetScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/AddEmergencyContactScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/AddPetScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/BondingTimerScreen.tsx',
    changes: [
      {
        pattern: /const loadedPets = await getPets\(\);?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/BondingTrackerScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/BreedSelectionScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/ChecklistScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/EmergencyContactsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/FamilyTreeScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/FloorTimeLogsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/FloorTimeScreen.tsx',
    changes: [
      {
        pattern: /import \{ CalendarTheme \} from ['"]react-native-calendars['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/FunFactsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/GuineaGramScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/NewOwnerChecklistScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/PetListScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/SafeFoodsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/SettingsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/SymptomCheckerScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/SymptomDetailsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/auth/LoginScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/auth/RegisterScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/care/CareScheduleScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/diet/DietManagerScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/health/MedicalRecordsScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/health/MoodTrackerScreen.tsx',
    changes: [
      {
        pattern: /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
        replacement: ""
      }
    ]
  },
  {
    file: 'src/screens/health/WasteLogScreen.tsx',
    changes: [
      {
        pattern: /import \{ GuineaPig, WasteLog \} from ['"]@\/navigation\/types['"];/g,
        replacement: "import { GuineaPig } from '@/navigation/types';"
      }
    ]
  },
  {
    file: 'src/services/auth.ts',
    changes: [
      {
        pattern: /const _password = password;/g,
        replacement: "// const _password = password;"
      }
    ]
  },
  {
    file: 'src/services/healthCheckService.ts',
    changes: [
      {
        pattern: /catch \(_error\)/g,
        replacement: "catch (error)"
      }
    ]
  }
];

function cleanupWarnings(filePath, changes) {
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
      console.log(`✓ Cleaned warnings in ${filePath}`);
    } else {
      console.log(`- No warnings found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('Cleaning up ESLint warnings...\n');

filesToFix.forEach(({ file, changes }) => {
  cleanupWarnings(file, changes);
});

console.log('\nDone!'); 