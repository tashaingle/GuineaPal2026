import fs from 'fs';

const filesToFix = [
  {
    file: 'src/screens/FloorTimeScreen.tsx',
    stylesToAdd: {
      'sessionNotes': '{ fontSize: 14, color: getColor.textLight(), marginTop: 8 }',
      'section': '{ marginBottom: 20 }',
      'stopButton': '{ backgroundColor: getColor.error() }',
      'startButton': '{ backgroundColor: getColor.primary() }'
    }
  },
  {
    file: 'src/screens/health/MedicalRecordsScreen.tsx',
    stylesToAdd: {
      'activeTag': '{ backgroundColor: getColor.success() }',
      'inactiveTag': '{ backgroundColor: getColor.error() }',
      'activeText': '{ color: getColor.background() }',
      'inactiveText': '{ color: getColor.background() }'
    }
  }
];

function addMissingStyles(filePath, stylesToAdd) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Find the StyleSheet.create section
    const styleSheetMatch = content.match(/const styles = StyleSheet\.create\(\{([\s\S]*?)\}\);/);
    
    if (styleSheetMatch) {
      const existingStyles = styleSheetMatch[1];
      let newStyles = existingStyles;
      
      // Add missing styles
      Object.entries(stylesToAdd).forEach(([styleName, styleValue]) => {
        if (!existingStyles.includes(`${styleName}:`)) {
          newStyles += `  ${styleName}: ${styleValue},\n`;
        }
      });
      
      // Replace the styles section
      content = content.replace(
        /const styles = StyleSheet\.create\(\{([\s\S]*?)\}\);/,
        `const styles = StyleSheet.create({${newStyles}});`
      );
      
      fs.writeFileSync(filePath, content);
      console.log(`✓ Added missing styles to ${filePath}`);
    } else {
      console.log(`⚠ Could not find StyleSheet.create in ${filePath}`);
    }
    
  } catch (error) {
    console.error(`✗ Error fixing ${filePath}:`, error.message);
  }
}

console.log('Adding missing styles...\n');

filesToFix.forEach(({ file, stylesToAdd }) => {
  addMissingStyles(file, stylesToAdd);
});

console.log('\nDone!'); 