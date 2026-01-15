import fs from 'fs';

const filesToClean = [
  'app/(stack)/_layout.tsx',
  'src/components/AppHeader.tsx',
  'src/components/BaseScreen.tsx',
  'src/components/CageSizeCalculator.tsx',
  'src/components/CustomSplash.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/PetCard.tsx',
  'src/components/PetFeatureMenu.tsx',
  'src/components/ui/IconSymbol.tsx',
  'src/components/ui/TabBarBackground.ios.tsx',
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
  'src/screens/auth/ForgotPasswordScreen.tsx',
  'src/screens/auth/LoginScreen.tsx',
  'src/screens/auth/RegisterScreen.tsx',
  'src/screens/care/CareScheduleScreen.tsx',
  'src/screens/diet/DietManagerScreen.tsx',
  'src/screens/health/AddWasteLogScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/MoodTrackerScreen.tsx',
  'src/screens/health/WasteLogScreen.tsx'
];

function removeUnusedImports(filePath) {
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
    
    // Remove unused GuineaPig import from AddWasteLogScreen
    if (filePath.includes('AddWasteLogScreen.tsx')) {
      content = content.replace(/import \{ GuineaPig \} from ['"]\.\.\/types\/guineaPig['"];?\n?/g, '');
      modified = true;
    }
    
    // Remove unused getColor import from ThemeContext
    if (filePath.includes('ThemeContext.tsx')) {
      content = content.replace(/import \{ getColor \} from ['"]\.\.\/theme\/colors['"];?\n?/g, '');
      modified = true;
    }
    
    // Remove unused loadedPets from BondingTimerScreen
    if (filePath.includes('BondingTimerScreen.tsx')) {
      content = content.replace(/const loadedPets = await getPets\(\);?\n?/g, '');
      modified = true;
    }
    
    // Remove unused variables from services
    if (filePath.includes('auth.ts')) {
      content = content.replace(/const _password = password;/g, '// const _password = password;');
      modified = true;
    }
    
    if (filePath.includes('healthCheckService.ts')) {
      content = content.replace(/catch \(_error\)/g, 'catch (error)');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✓ Cleaned unused imports in ${filePath}`);
    } else {
      console.log(`- No unused imports found in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

console.log('Removing unused imports...\n');

filesToClean.forEach(filePath => {
  removeUnusedImports(filePath);
});

console.log('\nDone!'); 