import fs from 'fs';
import path from 'path';

const filesToFix = [
  'components/ThemedText.tsx',
  'src/components/CageSizeCalculator.tsx',
  'src/components/CustomSplash.tsx',
  'src/components/ErrorBoundary.tsx',
  'src/components/PetCard.tsx',
  'src/components/PetFeatureMenu.tsx',
  'src/components/StyledButton.tsx',
  'src/components/ui/TabBarBackground.ios.tsx',
  'src/screens/auth/ForgotPasswordScreen.tsx',
  'src/screens/BondingGuideScreen.tsx',
  'src/screens/BondingTimerScreen.tsx'
];

function addGetColorImport(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if getColor is already imported
    if (content.includes('import { getColor }') || content.includes('import getColor')) {
      console.log(`✓ ${filePath} already has getColor import`);
      return;
    }
    
    // Check if the file uses getColor
    if (!content.includes('getColor.')) {
      console.log(`⚠ ${filePath} doesn't use getColor, skipping`);
      return;
    }
    
    // Find the best place to add the import
    const lines = content.split('\n');
    let importIndex = -1;
    
    // Look for existing imports
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import ')) {
        importIndex = i;
      }
    }
    
    // Add the import after the last import statement
    const getColorImport = "import { getColor } from '../theme/colors';";
    if (filePath.startsWith('src/')) {
      // For src files, adjust the path
      const relativePath = path.relative(path.dirname(filePath), 'src/theme/colors');
      const adjustedImport = `import { getColor } from '${relativePath.replace(/\\/g, '/')}';`;
      lines.splice(importIndex + 1, 0, adjustedImport);
    } else {
      // For root components
      lines.splice(importIndex + 1, 0, getColorImport);
    }
    
    const updatedContent = lines.join('\n');
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✓ Fixed ${filePath}`);
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Adding missing getColor imports...\n');

filesToFix.forEach(filePath => {
  addGetColorImport(filePath);
});

console.log('\nDone!'); 