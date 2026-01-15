#!/usr/bin/env node

/**
 * Ad Debug Script for GuineaPal
 * 
 * This script helps debug ad-related issues by:
 * 1. Checking if react-native-google-mobile-ads is properly installed
 * 2. Validating ad unit IDs
 * 3. Checking for common configuration issues
 * 4. Providing debugging commands
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 GuineaPal Ad Debug Tool\n');

// Check if react-native-google-mobile-ads is installed
function checkAdModule() {
    console.log('1. Checking react-native-google-mobile-ads installation...');
    
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
        console.log('❌ package.json not found');
        return false;
    }
    
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const adModule = packageJson.dependencies['react-native-google-mobile-ads'];
    
    if (adModule) {
        console.log(`✅ react-native-google-mobile-ads is installed (version: ${adModule})`);
        return true;
    } else {
        console.log('❌ react-native-google-mobile-ads is not installed');
        return false;
    }
}

// Check app.config.ts for ad configuration
function checkAppConfig() {
    console.log('\n2. Checking app configuration...');
    
    const appConfigPath = path.join(__dirname, '..', 'app.config.ts');
    if (!fs.existsSync(appConfigPath)) {
        console.log('❌ app.config.ts not found');
        return false;
    }
    
    const appConfig = fs.readFileSync(appConfigPath, 'utf8');
    
    // Check for Google Mobile Ads App ID
    if (appConfig.includes('googleMobileAdsAppId')) {
        console.log('✅ Google Mobile Ads App ID is configured');
    } else {
        console.log('❌ Google Mobile Ads App ID is missing from app.config.ts');
    }
    
    // Check for test ad unit IDs
    if (appConfig.includes('ca-app-pub-3940256099942544')) {
        console.log('✅ Test ad unit IDs are configured');
    } else {
        console.log('⚠️  Test ad unit IDs not found in app.config.ts (they might be in ads.ts)');
    }
    
    return true;
}

// Check ads.ts file
function checkAdsFile() {
    console.log('\n3. Checking ads.ts configuration...');
    
    const adsPath = path.join(__dirname, '..', 'src', 'utils', 'ads.ts');
    if (!fs.existsSync(adsPath)) {
        console.log('❌ src/utils/ads.ts not found');
        return false;
    }
    
    const adsContent = fs.readFileSync(adsPath, 'utf8');
    
    // Check for ad unit IDs
    if (adsContent.includes('ca-app-pub-3940256099942544')) {
        console.log('✅ Test ad unit IDs are configured in ads.ts');
    } else {
        console.log('❌ Test ad unit IDs not found in ads.ts');
    }
    
    // Check for error handling
    if (adsContent.includes('logAdError')) {
        console.log('✅ Enhanced error logging is implemented');
    } else {
        console.log('⚠️  Enhanced error logging not found');
    }
    
    return true;
}

// Check for common issues
function checkCommonIssues() {
    console.log('\n4. Checking for common issues...');
    
    const issues = [];
    
    // Check if running in development
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
        console.log('ℹ️  Running in development mode - ads will be skipped');
        issues.push('Ads are disabled in development mode');
    }
    
    // Check for Expo Go
    if (process.env.EXPO_PUBLIC_APP_OWNERSHIP === 'expo') {
        console.log('ℹ️  Running in Expo Go - ads will be skipped');
        issues.push('Ads are disabled in Expo Go');
    }
    
    if (issues.length === 0) {
        console.log('✅ No common issues detected');
    } else {
        console.log('⚠️  Common issues that might affect ads:');
        issues.forEach(issue => console.log(`   - ${issue}`));
    }
}

// Provide debugging commands
function showDebugCommands() {
    console.log('\n5. Debugging Commands:');
    console.log('\nTo check ad errors in your app:');
    console.log('   📱 Run the app and check the Settings screen (Debug section)');
    console.log('   📱 Look for console logs with 🔴 AD ERROR or 🔵 AD INFO');
    
    console.log('\nTo view logs:');
    console.log('   Android: adb logcat | grep -i "ad\\|error"');
    console.log('   iOS: xcrun simctl spawn booted log stream | grep -i "ad\\|error"');
    console.log('   Metro: npx react-native start --reset-cache');
    
    console.log('\nTo test ads:');
    console.log('   📱 Build a production APK: eas build --platform android --profile production');
    console.log('   📱 Install on a real device (ads don\'t work in simulators)');
    console.log('   📱 Make sure you\'re not in development mode');
    
    console.log('\nTo check ad unit IDs:');
    console.log('   📁 Check src/utils/ads.ts for current ad unit IDs');
    console.log('   📁 Verify they match your AdMob console');
    
    console.log('\nTo enable ads in development (for testing):');
    console.log('   📝 Temporarily change __DEV__ to false in ads.ts');
    console.log('   📝 Remember to change it back before production builds');
}

// Main execution
function main() {
    const adModuleInstalled = checkAdModule();
    const appConfigValid = checkAppConfig();
    const adsFileValid = checkAdsFile();
    checkCommonIssues();
    showDebugCommands();
    
    console.log('\n📋 Summary:');
    console.log(`   Ad Module: ${adModuleInstalled ? '✅' : '❌'}`);
    console.log(`   App Config: ${appConfigValid ? '✅' : '❌'}`);
    console.log(`   Ads File: ${adsFileValid ? '✅' : '❌'}`);
    
    if (!adModuleInstalled) {
        console.log('\n🔧 To install react-native-google-mobile-ads:');
        console.log('   npm install react-native-google-mobile-ads');
        console.log('   npx expo install react-native-google-mobile-ads');
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Build and test on a real device');
    console.log('   2. Check the Settings screen debug section');
    console.log('   3. Monitor console logs for ad errors');
    console.log('   4. Verify ad unit IDs in AdMob console');
}

main(); 