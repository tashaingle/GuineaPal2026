const fs = require('fs');
const path = require('path');

// Function to check if a file exists
function fileExists(filePath) {
    try {
        return fs.statSync(filePath).isFile();
    } catch (error) {
        return false;
    }
}

// Function to check if a directory exists
function dirExists(dirPath) {
    try {
        return fs.statSync(dirPath).isDirectory();
    } catch (error) {
        return false;
    }
}

// Function to check file content for potential issues
function checkFileContent(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        const issues = [];

        // Check for default exports
        if (!content.includes('export default')) {
            issues.push('Missing default export');
        }

        // Check for React imports
        if (!content.includes('import React')) {
            issues.push('Missing React import');
        }

        // Check for fragment usage
        if (content.includes('<React.Fragment') || content.includes('<>')) {
            const styleProps = content.match(/<React\.Fragment[^>]*style=/g) || 
                             content.match(/<>[^>]*style=/g);
            if (styleProps) {
                issues.push('Fragment with style prop detected');
            }
        }

        return issues;
    } catch (error) {
        return [`Error reading file: ${error.message}`];
    }
}

// Main debug function
function debugErrors() {
    // Check app directory structure
    const appDir = path.join(__dirname, '..', 'app');
    if (!dirExists(appDir)) {
        throw new Error('Error: app directory not found!');
    }

    // Check route files
    const routeFiles = [
        'app/_layout.tsx',
        'app/(stack)/checklist.tsx',
        'app/(stack)/fun-facts.tsx',
        'app/(stack)/_layout.tsx'
    ];

    routeFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, '..', filePath);
        
        if (!fileExists(fullPath)) {
            throw new Error(`Error: ${filePath} not found!`);
        }

        const issues = checkFileContent(fullPath);
        if (issues.length > 0) {
            throw new Error(`Issues found in ${filePath}:\n${issues.join('\n')}`);
        }
    });

    // Check Metro configuration
    const metroConfigPath = path.join(__dirname, '..', 'metro.config.cjs');
    if (!fileExists(metroConfigPath)) {
        throw new Error('Error: metro.config.cjs not found!');
    }

    // Check for node_modules
    const nodeModulesPath = path.join(__dirname, '..', 'node_modules');
    if (!dirExists(nodeModulesPath)) {
        throw new Error('Error: node_modules directory not found!');
    }
}

// Run the debug function
debugErrors(); 