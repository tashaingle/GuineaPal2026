# Remove large directories
Remove-Item -Path "node_modules" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path ".expo" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "temp_build" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path "backup_20250602" -Recurse -Force -ErrorAction SilentlyContinue

# Remove backup files
Remove-Item -Path "App.tsx.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package.json.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app.json.backup" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "app.config.js.bak" -Force -ErrorAction SilentlyContinue
Remove-Item -Path "package.json.bak" -Force -ErrorAction SilentlyContinue

# Remove cache files
Remove-Item -Path "tsconfig.tsbuildinfo" -Force -ErrorAction SilentlyContinue

Write-Host "Cleanup completed. You can now run 'npm install' to reinstall dependencies." 