import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Patterns to fix getColor function calls with nested properties
const colorPatterns = [
  // Fix getColor.background().DEFAULT -> getColor.background()
  { pattern: /getColor\.background\(\)\.DEFAULT/g, replacement: 'getColor.background()' },
  { pattern: /getColor\.background\(\)\.card/g, replacement: 'getColor.backgroundCard()' },
  { pattern: /getColor\.background\(\)\.elevated/g, replacement: 'getColor.backgroundElevated()' },
  { pattern: /getColor\.background\(\)\.light/g, replacement: 'getColor.backgroundLight()' },
  { pattern: /getColor\.background\(\)\.dark/g, replacement: 'getColor.backgroundDark()' },
  
  // Fix getColor.primary().DEFAULT -> getColor.primary()
  { pattern: /getColor\.primary\(\)\.DEFAULT/g, replacement: 'getColor.primary()' },
  { pattern: /getColor\.primary\(\)\.light/g, replacement: 'getColor.primaryLight()' },
  { pattern: /getColor\.primary\(\)\.dark/g, replacement: 'getColor.primaryDark()' },
  
  // Fix getColor.secondary().DEFAULT -> getColor.secondary()
  { pattern: /getColor\.secondary\(\)\.DEFAULT/g, replacement: 'getColor.secondary()' },
  { pattern: /getColor\.secondary\(\)\.light/g, replacement: 'getColor.secondaryLight()' },
  { pattern: /getColor\.secondary\(\)\.dark/g, replacement: 'getColor.secondaryDark()' },
  
  // Fix getColor.text().primary -> getColor.text()
  { pattern: /getColor\.text\(\)\.primary/g, replacement: 'getColor.text()' },
  { pattern: /getColor\.text\(\)\.secondary/g, replacement: 'getColor.textSecondary()' },
  { pattern: /getColor\.text\(\)\.light/g, replacement: 'getColor.textLight()' },
  { pattern: /getColor\.text\(\)\.dark/g, replacement: 'getColor.textDark()' },
  { pattern: /getColor\.text\(\)\.muted/g, replacement: 'getColor.textMuted()' },
  
  // Fix getColor.border().DEFAULT -> getColor.border()
  { pattern: /getColor\.border\(\)\.DEFAULT/g, replacement: 'getColor.border()' },
  { pattern: /getColor\.border\(\)\.light/g, replacement: 'getColor.borderLight()' },
  { pattern: /getColor\.border\(\)\.dark/g, replacement: 'getColor.borderDark()' },
  
  // Fix getColor.shadow().DEFAULT -> getColor.shadow()
  { pattern: /getColor\.shadow\(\)\.DEFAULT/g, replacement: 'getColor.shadow()' },
  
  // Fix getColor.overlay().DEFAULT -> getColor.overlay()
  { pattern: /getColor\.overlay\(\)\.DEFAULT/g, replacement: 'getColor.overlay()' },
  
  // Fix colors.backgroundLight -> getColor.backgroundLight()
  { pattern: /colors\.backgroundLight/g, replacement: 'getColor.backgroundLight()' },
  { pattern: /colors\.success/g, replacement: 'getColor.success()' },
  { pattern: /colors\.error/g, replacement: 'getColor.error()' },
  { pattern: /colors\.warning/g, replacement: 'getColor.warning()' },
  { pattern: /colors\.info/g, replacement: 'getColor.info()' },
];

function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Apply all patterns
    for (const { pattern, replacement } of colorPatterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, replacement);
        modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed colors in: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
    return false;
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  let totalFixed = 0;
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      totalFixed += walkDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (processFile(filePath)) {
        totalFixed++;
      }
    }
  }
  
  return totalFixed;
}

console.log('Starting remaining color fix process...');
const totalFixed = walkDirectory(path.join(__dirname, '..'));
console.log(`Color fix process completed! Fixed ${totalFixed} files.`); 