# SystemTimeMod Versioning

## Version Structure

Format: `MAJOR.MINOR.PATCH-build.BUILD_NUMBER`

- **MAJOR** (1): Breaking API changes
- **MINOR** (1): New functionality (backwards compatible)
- **PATCH** (0): Bug fixes
- **BUILD_NUMBER**: Auto-incremented with each build

Examples:
- `1.1.0-build.1` - First build of version 1.1.0
- `1.1.0-build.25` - 25th build of version 1.1.0
- `1.2.0-build.1` - First build of version 1.2.0

## Automatic Versioning

### How It Works

1. **With each build** (`dotnet build`):
   - `IncrementBuild.ps1` runs automatically
   - Build number increments by 1
   - `Version.cs` file is updated

2. **Version.cs file** contains:
```csharp
   public static class ModVersion
   {
       public const string Version = "1.1.0";
       public const int BuildNumber = 1;
       public const string FullVersion = "1.1.0-build.1";
   }
```

3. **Displayed in game settings**:
   - Full version (e.g.: `1.1.0-build.42`)
   - Build number (e.g.: `42`)

## Updating Version

### Changing MAJOR/MINOR/PATCH

To update the main version:

1. **Update `mod.json`**:
```json
   {
     "version": "1.2.0"
   }
```

2. **Update `Version.cs`** (reset BuildNumber):
```csharp
   public const string Version = "1.2.0";
   public const int BuildNumber = 0;
```

3. **Build the project**:
```powershell
   dotnet build
```

BuildNumber will automatically become 1 on first build.

### Manual Build Increment

To manually increment the build number:
```powershell
cd SystemTimeMod
.\IncrementBuild.ps1
```

## Version Display

### In Game Settings

Version is displayed in the **About** section:
- **Mod Version**: `1.1.0-build.42`
- **Build Number**: `42`

Fields are read-only for editing.

### In Code
```csharp
using SystemTimeMod;

// Getting version info
string version = ModVersion.Version;         // "1.1.0"
int build = ModVersion.BuildNumber;          // 42
string full = ModVersion.FullVersion;        // "1.1.0-build.42"
```

## Disabling Auto-Increment

To temporarily disable auto-increment, comment out in `.csproj`:
```xml
<!-- Increment build number before build -->
<!--
<Target Name="IncrementBuild" BeforeTargets="CoreCompile">
  ...
</Target>
-->
```

## Troubleshooting

### BuildNumber not incrementing

Check:
1. PowerShell is available in PATH
2. `IncrementBuild.ps1` script exists
3. `Version.cs` file is not locked
4. Write permissions in project directory

### Build error

If you encounter an error in `IncrementBuild.ps1`:
1. Run the script manually for debugging
2. Check `Version.cs` format
3. Verify regex patterns in script are correct