import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Color mapping for the old pattern to new getColor pattern
const colorMappings = {
  'colors.primary': 'getColor.primary()',
  'colors.primary.DEFAULT': 'getColor.primary()',
  'colors.primary.light': 'getColor.primaryLight()',
  'colors.primary.dark': 'getColor.primaryDark()',
  'colors.secondary': 'getColor.secondary()',
  'colors.secondary.DEFAULT': 'getColor.secondary()',
  'colors.secondary.light': 'getColor.secondaryLight()',
  'colors.secondary.dark': 'getColor.secondaryDark()',
  'colors.background': 'getColor.background()',
  'colors.background.DEFAULT': 'getColor.background()',
  'colors.background.light': 'getColor.backgroundLight()',
  'colors.background.dark': 'getColor.backgroundDark()',
  'colors.background.card': 'getColor.backgroundCard()',
  'colors.background.elevated': 'getColor.backgroundElevated()',
  'colors.text': 'getColor.text()',
  'colors.text.primary': 'getColor.text()',
  'colors.text.secondary': 'getColor.textSecondary()',
  'colors.text.light': 'getColor.textLight()',
  'colors.text.dark': 'getColor.textDark()',
  'colors.text.muted': 'getColor.textMuted()',
  'colors.status.success': 'getColor.success()',
  'colors.status.warning': 'getColor.warning()',
  'colors.status.error': 'getColor.error()',
  'colors.status.info': 'getColor.info()',
  'colors.border': 'getColor.border()',
  'colors.border.DEFAULT': 'getColor.border()',
  'colors.border.light': 'getColor.borderLight()',
  'colors.border.dark': 'getColor.borderDark()',
  'colors.shadow': 'getColor.shadow()',
  'colors.shadow.DEFAULT': 'getColor.shadow()',
  'colors.overlay': 'getColor.overlay()',
  'colors.overlay.DEFAULT': 'getColor.overlay()',
  'colors.components.card.background': 'getColor.cardBackground()',
  'colors.components.card.border': 'getColor.cardBorder()',
  'colors.components.card.shadow': 'getColor.cardShadow()',
  'colors.components.input.background': 'getColor.inputBackground()',
  'colors.components.input.border': 'getColor.inputBorder()',
  'colors.components.input.placeholder': 'getColor.inputPlaceholder()',
  'colors.components.header.background': 'getColor.headerBackground()',
  'colors.components.header.text': 'getColor.headerText()',
  'colors.buttons.primary': 'getColor.buttonPrimary()',
  'colors.buttons.secondary': 'getColor.buttonSecondary()',
  'colors.buttons.red': 'getColor.buttonRed()',
  'colors.buttons.green': 'getColor.buttonGreen()',
  'colors.buttons.blue': 'getColor.buttonBlue()',
  'colors.buttons.brown': 'getColor.buttonBrown()',
  'colors.buttons.orange': 'getColor.buttonOrange()',
  'colors.buttons.purple': 'getColor.buttonPurple()',
  'colors.buttons.indigo': 'getColor.buttonIndigo()',
  'colors.buttons.gold': 'getColor.buttonGold()',
  'colors.urgency.low': 'getColor.urgencyLow()',
  'colors.urgency.medium': 'getColor.urgencyMedium()',
  'colors.urgency.high': 'getColor.urgencyHigh()',
  'colors.accent.primary': 'getColor.accentPrimary()',
  'colors.accent.secondary': 'getColor.accentSecondary()',
  'colors.white': 'getColor.background()',
  'colors.black': 'getColor.textDark()',
  'colors.transparent': 'getColor.transparent()',
  // Direct color properties that don't exist
  'colors.textLight': 'getColor.textLight()',
  'colors.error': 'getColor.error()',
  'colors.borderLight': 'getColor.borderLight()',
  'colors.primaryDark': 'getColor.primaryDark()',
  'colors.primaryLight': 'getColor.primaryLight()',
};

function fixColorsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if file already imports getColor
    const hasGetColorImport = content.includes('getColor') || content.includes('{ getColor }');
    
    // Add getColor import if needed
    if (!hasGetColorImport && content.includes('colors')) {
      // Find the colors import line
      const colorsImportRegex = /import\s+colors\s+from\s+['"]([^'"]+)['"]/;
      const colorsImportMatch = content.match(colorsImportRegex);
      
      if (colorsImportMatch) {
        const importPath = colorsImportMatch[1];
        const newImport = `import colors, { getColor } from '${importPath}';`;
        content = content.replace(colorsImportRegex, newImport);
        modified = true;
      }
    }

    // Replace color usages
    for (const [oldPattern, newPattern] of Object.entries(colorMappings)) {
      const regex = new RegExp(`\\b${oldPattern.replace(/\./g, '\\.')}\\b`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, newPattern);
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Fixed colors in: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other build directories
      if (!['node_modules', '.git', 'build', 'dist', '__tests__'].includes(file)) {
        processDirectory(filePath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixColorsInFile(filePath);
    }
  }
}

// Start processing from the current directory
const startDir = process.cwd();
console.log('Starting color fix process...');
processDirectory(startDir);
console.log('Color fix process completed!'); 