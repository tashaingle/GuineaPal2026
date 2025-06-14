# Set Android SDK environment variables
$sdkPath = "C:\Users\Tasha\AppData\Local\Android\Sdk"

# Set ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdkPath, [System.EnvironmentVariableTarget]::User)

# Get current PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', [System.EnvironmentVariableTarget]::User)

# Add new paths if they don't exist
$newPaths = @(
    "$sdkPath\platform-tools",
    "$sdkPath\tools",
    "$sdkPath\tools\bin"
)

foreach ($path in $newPaths) {
    if ($currentPath -notlike "*$path*") {
        $currentPath = "$currentPath;$path"
    }
}

# Update PATH
[System.Environment]::SetEnvironmentVariable('Path', $currentPath, [System.EnvironmentVariableTarget]::User)

Write-Host "Android SDK environment variables have been set:"
Write-Host "ANDROID_HOME = $sdkPath"
Write-Host "Added to PATH:"
foreach ($path in $newPaths) {
    Write-Host "- $path"
} 