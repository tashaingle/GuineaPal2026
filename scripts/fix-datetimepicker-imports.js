import fs from 'fs';

const filesToFix = [
  'src/screens/AddEditPetScreen.tsx',
  'src/screens/AddPetScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/WeightTrackerScreen.tsx'
];

function fixDateTimePickerImports(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the incorrect DateTimePicker import
    content = content.replace(
      /import DateTimePicker from '@react-native-community\/datetimepicker';/g,
      "import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';"
    );
    
    // Also fix any direct import of the module
    content = content.replace(
      /import \{ DateTimePicker \} from '@react-native-community\/datetimepicker';/g,
      "import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';"
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed DateTimePicker imports in ${filePath}`);
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing DateTimePicker imports...\n');

filesToFix.forEach(filePath => {
  fixDateTimePickerImports(filePath);
});

console.log('\nDone!'); 