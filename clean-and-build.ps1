# Clean and Build Script for GuineaPal
# This script cleans the project and rebuilds it to resolve manifest conflicts

Write-Host "🧹 Cleaning GuineaPal project..." -ForegroundColor Green

# Clean npm cache
Write-Host "Cleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Remove node_modules and reinstall
Write-Host "Removing node_modules..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Remove-Item -Recurse -Force "node_modules"
}

# Remove package-lock.json
Write-Host "Removing package-lock.json..." -ForegroundColor Yellow
if (Test-Path "package-lock.json") {
    Remove-Item "package-lock.json"
}

# Clean Expo cache
Write-Host "Cleaning Expo cache..." -ForegroundColor Yellow
npx expo install --fix

# Clean Android build
Write-Host "Cleaning Android build..." -ForegroundColor Yellow
if (Test-Path "android") {
    Remove-Item -Recurse -Force "android"
}

# Clean iOS build (if exists)
Write-Host "Cleaning iOS build..." -ForegroundColor Yellow
if (Test-Path "ios") {
    Remove-Item -Recurse -Force "ios"
}

# Clean Expo cache
Write-Host "Cleaning Expo cache..." -ForegroundColor Yellow
npx expo start --clear

Write-Host "✅ Clean completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Run: eas build --platform android --profile production" -ForegroundColor White
Write-Host "2. Or run: npx expo run:android" -ForegroundColor White
Write-Host ""
Write-Host "The Google Mobile Ads configuration has been fixed to avoid manifest conflicts." -ForegroundColor Green 