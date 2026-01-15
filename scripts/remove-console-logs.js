import fs from 'fs';

const filesToClean = [
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
  'src/screens/auth/ForgotPasswordScreen.tsx',
  'src/screens/auth/LoginScreen.tsx',
  'src/screens/auth/RegisterScreen.tsx',
  'src/screens/care/CareScheduleScreen.tsx',
  'src/screens/diet/DietManagerScreen.tsx',
  'src/screens/health/AddWasteLogScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/MoodTrackerScreen.tsx',
  'src/screens/health/WasteLogScreen.tsx',
  'src/screens/health/WeightTrackerScreen.tsx',
  'src/contexts/PetContext.tsx',
  'src/contexts/ThemeContext.tsx',
  'src/services/auth.ts',
  'src/services/purchases.ts',
  'src/utils/petStorage.ts',
  'src/utils/storage.ts'
];

function removeConsoleLogs(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove console.log statements but keep console.warn, console.error, etc.
    const consoleLogPattern = /console\.log\([^)]*\);?\n?/g;
    const matches = content.match(consoleLogPattern);
    
    if (matches && matches.length > 0) {
      content = content.replace(consoleLogPattern, '');
      modified = true;
      console.log(`✓ Removed ${matches.length} console.log statements from ${filePath}`);
    } else {
      console.log(`- No console.log statements found in ${filePath}`);
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
    }
    
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('Removing console.log statements...\n');

filesToClean.forEach(filePath => {
  removeConsoleLogs(filePath);
});

console.log('\nDone!'); 