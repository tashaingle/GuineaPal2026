# Clean Android build
Write-Host "Cleaning Android build..."
cd android
./gradlew clean
cd ..

# Remove build directories
Write-Host "Removing build directories..."
Remove-Item -Path "android/.gradle" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android/app/build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "android/build" -Recurse -Force -ErrorAction SilentlyContinue

# Rebuild
Write-Host "Rebuilding project..."
cd android
./gradlew assembleDebug --stacktrace
cd ..

Write-Host "Build process completed!" 