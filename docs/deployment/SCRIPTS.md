# CRM UI - Deployment Scripts Summary

## Available Scripts

### 🚀 Deployment Scripts

| Script | Purpose | Admin Required | Usage |
|--------|---------|----------------|-------|
| `DEPLOY.bat` | Quick deployment to IIS | ✅ Yes | Double-click or run as admin |
| `deployment-helper.bat` | Interactive menu for all operations | ✅ For deploy/undeploy | Run to see menu |
| `deploy-iis.ps1` | Full PowerShell deployment | ✅ Yes | `.\deploy-iis.ps1` |
| `undeploy-iis.ps1` | Remove from IIS | ✅ Yes | `.\undeploy-iis.ps1` |

### 🔧 Utility Scripts

| Script | Purpose | Admin Required | Usage |
|--------|---------|----------------|-------|
| `check-prerequisites.ps1` | Verify system requirements | ❌ No | `.\check-prerequisites.ps1` |
| `build-only.ps1` | Build without deploying | ❌ No | `.\build-only.ps1` |
| `update-appsettings.ps1` | Update configuration | ❌ No | `.\update-appsettings.ps1 -Environment Production` |

## Quick Reference

### First Time Deployment
```batch
# Easiest way - right-click and "Run as Administrator"
DEPLOY.bat
```

### Custom Deployment
```powershell
.\deploy-iis.ps1 -SiteName "CRMUi" -Port 8080 -DeployPath "C:\inetpub\wwwroot\CRMUi"
```

### Update Existing Deployment
```powershell
# Just run deploy again, it will prompt to overwrite
.\deploy-iis.ps1
```

### Remove Deployment
```powershell
# Keep files
.\undeploy-iis.ps1

# Delete files too
.\undeploy-iis.ps1 -DeleteFiles
```

### Interactive Menu
```batch
deployment-helper.bat
```

## Script Parameters

### deploy-iis.ps1
```powershell
-SiteName "CRMUi"                           # IIS site name
-AppPool "CRMUiAppPool"                     # Application pool name
-Port 8080                                   # HTTP port
-DeployPath "C:\inetpub\wwwroot\CRMUi"      # Deployment directory
-HostName "localhost"                        # Host name
```

### undeploy-iis.ps1
```powershell
-SiteName "CRMUi"                           # IIS site name
-AppPool "CRMUiAppPool"                     # Application pool name
-DeployPath "C:\inetpub\wwwroot\CRMUi"      # Deployment directory
-DeleteFiles                                 # Also delete files (switch)
```

### update-appsettings.ps1
```powershell
-Environment "Production"                    # Required: Development/Staging/Production
-CRMBackendUrl "http://backend-url"         # Optional: Backend API URL
-TokenEndpoint "http://token-url"           # Optional: Token service URL
```

## What Each Script Does

### DEPLOY.bat
1. Checks if running as Administrator
2. Runs prerequisite check
3. Executes full deployment
4. Shows completion message

### deployment-helper.bat
Interactive menu with options:
1. Check Prerequisites
2. Build Only (No Deploy)
3. Deploy to IIS
4. Undeploy from IIS
5. Undeploy and Delete Files
6. Update Configuration
7. Exit

### deploy-iis.ps1
1. Verifies Administrator privileges
2. Builds backend (Release mode)
3. Builds frontend (Production mode)
4. Creates/updates IIS application pool
5. Creates/updates IIS website
6. Copies all files to deployment directory
7. Creates web.config
8. Sets proper permissions
9. Starts application

### undeploy-iis.ps1
1. Verifies Administrator privileges
2. Stops and removes IIS website
3. Stops and removes application pool
4. Optionally deletes deployment files

### check-prerequisites.ps1
Checks for:
- Administrator privileges
- .NET SDK installation
- Node.js installation
- npm installation
- IIS installation
- ASP.NET Core Hosting Bundle
- Project files existence

### build-only.ps1
1. Cleans backend project
2. Builds backend in Release mode
3. Runs npm install for frontend
4. Builds frontend for production
5. Shows build output locations

### update-appsettings.ps1
1. Reads current appsettings
2. Updates configuration values
3. Sets appropriate logging level for environment
4. Saves environment-specific config file

## Output Locations

### After Build
- **Backend**: `CRMWebSpa.Server\bin\Release\net8.0`
- **Frontend**: `client\dist`

### After Deployment
- **All Files**: `C:\inetpub\wwwroot\CRMUi`
- **Logs**: `C:\inetpub\wwwroot\CRMUi\logs`
- **Frontend**: `C:\inetpub\wwwroot\CRMUi\wwwroot\client`

## Common Scenarios

### Scenario 1: First Deployment
```batch
1. Run DEPLOY.bat as Administrator
2. Wait for completion
3. Open http://localhost:8080
```

### Scenario 2: Update Application
```batch
1. Make code changes
2. Run DEPLOY.bat as Administrator
3. Confirm overwrite when prompted
```

### Scenario 3: Change Configuration
```powershell
.\update-appsettings.ps1 -Environment Production -CRMBackendUrl "https://api.company.com"
.\deploy-iis.ps1
```

### Scenario 4: Test Build Without Deploy
```powershell
.\build-only.ps1
# Check output in bin and dist folders
```

### Scenario 5: Complete Removal
```powershell
.\undeploy-iis.ps1 -DeleteFiles
```

### Scenario 6: Build for Different Ports
```powershell
.\deploy-iis.ps1 -Port 9090
# Application will be available on port 9090
```

## Troubleshooting

### Script Won't Run
**Error:** "Scripts are disabled on this system"
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Permission Denied
**Solution:** Run as Administrator
- Right-click PowerShell → "Run as Administrator"
- Or right-click .bat file → "Run as Administrator"

### Build Fails
**Check:**
1. Run `.\check-prerequisites.ps1`
2. Ensure .NET SDK and Node.js are installed
3. Check for compilation errors in code

### Deployment Fails
**Check:**
1. IIS is installed and running
2. ASP.NET Core Hosting Bundle is installed
3. Port is not already in use
4. Sufficient disk space

### Site Won't Start
**Check:**
1. Event Viewer → Application logs
2. Enable stdout logging in web.config
3. Check application pool is running
4. Verify .NET runtime is installed

## Best Practices

1. **Always check prerequisites first**
   ```powershell
   .\check-prerequisites.ps1
   ```

2. **Test build before deploying**
   ```powershell
   .\build-only.ps1
   ```

3. **Use appropriate environment settings**
   ```powershell
   .\update-appsettings.ps1 -Environment Production
   ```

4. **Backup before major updates**
   ```powershell
   Copy-Item "C:\inetpub\wwwroot\CRMUi" "C:\Backups\CRMUi_$(Get-Date -Format 'yyyyMMdd')" -Recurse
   ```

5. **Review logs after deployment**
   ```powershell
   Get-Content "C:\inetpub\wwwroot\CRMUi\logs\log-*.txt" | Select-Object -Last 50
   ```

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide for beginners
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Comprehensive deployment documentation
- **[README.md](README.md)** - Project overview and development guide
- **[CRMWebSpa.Tests/README.md](CRMWebSpa.Tests/README.md)** - Testing documentation

## Support Commands

### Check IIS Site Status
```powershell
Get-WebSite -Name "CRMUi"
Get-WebAppPool -Name "CRMUiAppPool"
```

### Restart Application
```powershell
Restart-WebAppPool -Name "CRMUiAppPool"
Restart-WebSite -Name "CRMUi"
```

### View Recent Logs
```powershell
Get-Content "C:\inetpub\wwwroot\CRMUi\logs\log-*.txt" -Tail 20
```

### Check Port Availability
```powershell
Test-NetConnection -ComputerName localhost -Port 8080
```
# This file has been removed as part of documentation cleanup.
