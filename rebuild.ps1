# Stop on any error
$ErrorActionPreference = "Stop"

Write-Host "Starting rebuild process..." -ForegroundColor Green

# Clean Android build
Write-Host "`nCleaning Android build..." -ForegroundColor Yellow
cd android
./gradlew clean
if ($LASTEXITCODE -ne 0) {
    Write-Host "Gradle clean failed!" -ForegroundColor Red
    exit 1
}
cd ..

# Remove build directories
Write-Host "`nRemoving build directories..." -ForegroundColor Yellow
$directories = @(
    "android/.gradle",
    "android/app/build",
    "android/build",
    "node_modules/.cache"
)

foreach ($dir in $directories) {
    if (Test-Path $dir) {
        Write-Host "Removing $dir..."
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# Clean npm cache
Write-Host "`nCleaning npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Reinstall node modules
Write-Host "`nReinstalling node modules..." -ForegroundColor Yellow
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
npm install

# Rebuild
Write-Host "`nRebuilding project..." -ForegroundColor Yellow
cd android
./gradlew assembleDebug --stacktrace
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}
cd ..

Write-Host "`nBuild process completed successfully!" -ForegroundColor Green 