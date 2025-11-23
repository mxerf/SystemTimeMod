# Script for automatic build number increment

param(
    [string]$VersionFile = 'Version.cs'
)

$ErrorActionPreference = 'Stop'

try {
    # Read current version file
    $content = Get-Content $VersionFile -Raw
    
    # Extract version and build
    if ($content -match 'Version = "([0-9]+\.[0-9]+\.[0-9]+)"') {
        $version = $Matches[1]
    } else {
        Write-Host 'ERROR: Cannot find version' -ForegroundColor Red
        exit 1
    }
    
    if ($content -match 'BuildNumber = ([0-9]+)') {
        $buildNumber = [int]$Matches[1]
    } else {
        Write-Host 'ERROR: Cannot find build number' -ForegroundColor Red
        exit 1
    }
    
    # Increment build
    $newBuildNumber = $buildNumber + 1
    $fullVersion = "$version-build.$newBuildNumber"
    
    # Generate new file content
    $newContent = @"
// Auto-generated file. Do not edit manually.
// This file is generated during build process.

namespace SystemTimeMod
{
    public static class ModVersion
    {
        public const string Version = "$version";
        public const int BuildNumber = $newBuildNumber;
        public const string FullVersion = "$fullVersion";
    }
}
"@
    
    # Save file
    Set-Content -Path $VersionFile -Value $newContent -NoNewline
    
    Write-Host "Build incremented: $buildNumber -> $newBuildNumber" -ForegroundColor Green
    Write-Host "Version: $fullVersion" -ForegroundColor Cyan
    
    exit 0
}
catch {
    Write-Host "ERROR: Failed to increment build - $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
