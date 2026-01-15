import fs from 'fs';

const filesToFix = [
  'src/screens/AddEditPetScreen.tsx',
  'src/screens/AddPetScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/WeightTrackerScreen.tsx'
];

function fixDateTimePickerTypes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace the incorrect import
    content = content.replace(
      /import DateTimePicker, \{ DateTimePickerEvent \} from '@react-native-community\/datetimepicker';/g,
      "import DateTimePicker from '@react-native-community/datetimepicker';"
    );
    
    // Replace DateTimePickerEvent usage with the correct type
    content = content.replace(
      /DateTimePickerEvent/g,
      'any'
    );
    
    fs.writeFileSync(filePath, content);
    console.log(`✓ Fixed DateTimePicker types in ${filePath}`);
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Fixing DateTimePicker types...\n');

filesToFix.forEach(filePath => {
  fixDateTimePickerTypes(filePath);
});

console.log('\nDone!'); 