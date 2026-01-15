import fs from 'fs';

const filesToClean = [
  'app/(stack)/_layout.tsx',
  'src/components/AppHeader.tsx',
  'src/components/BaseScreen.tsx',
  'src/components/ui/IconSymbol.tsx',
  'src/components/ui/TabBarBackground.tsx',
  'src/contexts/ThemeContext.tsx',
  'src/screens/AddEditPetScreen.tsx',
  'src/screens/AddEmergencyContactScreen.tsx',
  'src/screens/AddPetScreen.tsx',
  'src/screens/BondingTrackerScreen.tsx',
  'src/screens/BreedSelectionScreen.tsx',
  'src/screens/ChecklistScreen.tsx',
  'src/screens/EmergencyContactsScreen.tsx',
  'src/screens/FamilyTreeScreen.tsx',
  'src/screens/FloorTimeLogsScreen.tsx',
  'src/screens/FloorTimeScreen.tsx',
  'src/screens/FunFactsScreen.tsx',
  'src/screens/GuineaGramScreen.tsx',
  'src/screens/NewOwnerChecklistScreen.tsx',
  'src/screens/PetListScreen.tsx',
  'src/screens/SafeFoodsScreen.tsx',
  'src/screens/SettingsScreen.tsx',
  'src/screens/SymptomCheckerScreen.tsx',
  'src/screens/SymptomDetailsScreen.tsx',
  'src/screens/auth/LoginScreen.tsx',
  'src/screens/auth/RegisterScreen.tsx',
  'src/screens/care/CareScheduleScreen.tsx',
  'src/screens/diet/DietManagerScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/MoodTrackerScreen.tsx',
  'src/screens/health/WasteLogScreen.tsx'
];

function removeUnusedColors(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove unused colors imports
    const colorsImportPatterns = [
      /import \{ colors \} from ['"]@\/theme\/colors['"];?\n?/g,
      /import \{ colors \} from ['"]\.\.\/theme\/colors['"];?\n?/g,
      /import \{ colors \} from ['"]\.\.\/\.\.\/theme\/colors['"];?\n?/g,
      /import colors from ['"]@\/theme\/colors['"];?\n?/g,
      /import colors from ['"]\.\.\/theme\/colors['"];?\n?/g,
      /import colors from ['"]\.\.\/\.\.\/theme\/colors['"];?\n?/g
    ];
    
    colorsImportPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        content = content.replace(pattern, '');
        modified = true;
      }
    });
    
    // Remove unused getColor import from ThemeContext
    if (filePath.includes('ThemeContext.tsx')) {
      content = content.replace(/import \{ getColor \} from ['"]\.\.\/theme\/colors['"];?\n?/g, '');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Removed unused colors import from ${filePath}`);
    } else {
      console.log(`- No unused colors import found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('Removing all unused colors imports...\n');

filesToClean.forEach(filePath => {
  removeUnusedColors(filePath);
});

console.log('\nDone!'); 