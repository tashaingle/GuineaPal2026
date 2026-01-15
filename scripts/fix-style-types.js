import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Files that need manual style type fixes
const filesToFix = [
  'src/screens/health/DietManagerScreen.tsx',
  'src/screens/health/WeightTrackerScreen.tsx',
  'src/screens/health/MedicalRecordsScreen.tsx',
  'src/screens/health/MoodTrackerScreen.tsx',
  'src/screens/health/WasteLogScreen.tsx'
];

function fixStyleTypes(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Add proper style type annotations
    const styleTypeFixes = [
      // Fix style type annotations in StyleSheet.create
      {
        pattern: /const styles = StyleSheet\.create\(\{/g,
        replacement: 'const styles = StyleSheet.create({\n  // View styles\n  container: {\n    flex: 1,\n    backgroundColor: getColor.background(),\n  } as ViewStyle,'
      },
      // Add proper type annotations for common style patterns
      {
        pattern: /(\w+): \{\s*([^}]+)\s*\}/g,
        replacement: (match, styleName, styleContent) => {
          // Determine if this should be ViewStyle or TextStyle based on content
          const isViewStyle = styleContent.includes('flex') || 
                             styleContent.includes('backgroundColor') || 
                             styleContent.includes('padding') || 
                             styleContent.includes('margin') ||
                             styleContent.includes('border') ||
                             styleContent.includes('elevation') ||
                             styleContent.includes('shadow');
          
          const isTextStyle = styleContent.includes('fontSize') || 
                             styleContent.includes('fontWeight') || 
                             styleContent.includes('color') ||
                             styleContent.includes('textAlign');
          
          if (isViewStyle && !isTextStyle) {
            return `${styleName}: {\n    ${styleContent}\n  } as ViewStyle`;
          } else if (isTextStyle) {
            return `${styleName}: {\n    ${styleContent}\n  } as TextStyle`;
          }
          return match;
        }
      }
    ];
    
    for (const { pattern, replacement } of styleTypeFixes) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed style types in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

console.log('Starting style type fix process...');
let totalFixed = 0;

for (const file of filesToFix) {
  const fullPath = path.join(__dirname, '..', file);
  if (fs.existsSync(fullPath)) {
    if (fixStyleTypes(fullPath)) {
      totalFixed++;
    }
  }
}

console.log(`Style type fix process completed! Fixed ${totalFixed} files.`); 