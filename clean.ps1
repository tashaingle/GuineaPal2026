# clean.ps1
cd $PSScriptRoot

if (Test-Path "node_modules") {
    Write-Host "Removing node_modules..."
    Remove-Item -Recurse -Force "node_modules"
} else {
    Write-Host "node_modules not found, skipping..."
}

if (Test-Path "yarn.lock") {
    Write-Host "Removing yarn.lock..."
    Remove-Item -Force "yarn.lock"
} else {
    Write-Host "yarn.lock not found, skipping..."
}

Write-Host "Installing dependencies..."
yarn install

# Clean up build and cache directories
Remove-Item -Path "android/.gradle" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android/app/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp_build" -Recurse -Force -ErrorAction SilentlyContinue

# Clean up backup files
Remove-Item -Path "App.tsx.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package.json.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app.json.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app.config.js.bak" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package.json.bak" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backup_20250602" -Recurse -Force -ErrorAction SilentlyContinue

# Clean up TypeScript cache
Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup completed!"