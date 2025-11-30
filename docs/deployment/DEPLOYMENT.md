# CRM UI Deployment Guide

Complete guide for deploying the CRM UI application to IIS.

## Prerequisites

Before deployment, ensure you have:

1. **Windows Server or Windows 10/11 with IIS enabled**
2. **.NET 8.0 SDK or later**
3. **Node.js 18+ and npm**
4. **IIS with ASP.NET Core Hosting Bundle**
5. **Administrator privileges**

### Quick Prerequisites Check

Run the prerequisite checker:
```powershell
.\check-prerequisites.ps1
```

This will verify all required components are installed.

## Deployment Scripts

### 1. `deploy-iis.ps1` - Full Deployment
Builds and deploys the complete application to IIS.

**Basic Usage:**
```powershell
.\deploy-iis.ps1
```

**Custom Configuration:**
```powershell
.\deploy-iis.ps1 -SiteName "CRMUi" -Port 8080 -DeployPath "C:\inetpub\wwwroot\CRMUi"
```

**Parameters:**
- `-SiteName` - IIS website name (default: "CRMUi")
- `-AppPool` - Application pool name (default: "CRMUiAppPool")
- `-Port` - HTTP port (default: 8080)
- `-DeployPath` - Deployment directory (default: "C:\inetpub\wwwroot\CRMUi")
- `-HostName` - Host name for URL (default: "localhost")

**What it does:**
1. Builds backend (.NET) in Release mode
2. Builds frontend (React/Vite) for production
3. Creates IIS application pool and website
4. Copies all files to deployment directory
5. Configures web.config
6. Sets proper permissions
7. Starts the application

### 2. `undeploy-iis.ps1` - Remove Deployment
Removes the application from IIS.

**Basic Usage:**
```powershell
.\undeploy-iis.ps1
```

**Delete Files Too:**
```powershell
.\undeploy-iis.ps1 -DeleteFiles
```

**What it does:**
1. Stops and removes IIS website
2. Stops and removes application pool
3. Optionally deletes deployment files

### 3. `build-only.ps1` - Build Without Deployment
Builds both frontend and backend without deploying.

**Usage:**
```powershell
.\build-only.ps1
```

**What it does:**
1. Cleans and builds backend in Release mode
2. Runs npm install and build for frontend
3. No deployment to IIS

### 4. `update-appsettings.ps1` - Update Configuration
Updates application configuration for different environments.

**Usage:**
```powershell
.\update-appsettings.ps1 -Environment Production -CRMBackendUrl "https://api.crm.company.com"
```

**Parameters:**
- `-Environment` - Development, Staging, or Production (required)
- `-CRMBackendUrl` - Backend API URL (optional)
- `-TokenEndpoint` - Token service endpoint (optional)

### 5. `check-prerequisites.ps1` - Verify System Requirements
Checks if all required components are installed.

**Usage:**
```powershell
.\check-prerequisites.ps1
```

## Deployment Steps

### First Time Deployment

1. **Check Prerequisites**
   ```powershell
   .\check-prerequisites.ps1
   ```

2. **Update Configuration** (if needed)
   ```powershell
   .\update-appsettings.ps1 -Environment Production -CRMBackendUrl "http://your-backend-url"
   ```

3. **Deploy to IIS**
   ```powershell
   .\deploy-iis.ps1
   ```

4. **Verify Deployment**
   - Open browser to `http://localhost:8080`
   - Check IIS Manager for site status
   - Review logs in deployment directory

### Update Existing Deployment

1. **Redeploy**
   ```powershell
   .\deploy-iis.ps1
   ```
   
   The script will prompt to overwrite existing deployment.

### Remove Deployment

```powershell
# Remove from IIS but keep files
.\undeploy-iis.ps1

# Remove from IIS and delete files
.\undeploy-iis.ps1 -DeleteFiles
```

## Configuration

### Application Settings

Main configuration file: `CRMWebSpa.Server\appsettings.json`

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning"
      }
    }
  },
  "CRMBackend": {
    "BaseUrl": "http://localhost/CRMbackend",
    "TokenEndpoint": "http://tokenendpoint"
  }
}
```

### Environment-Specific Settings

Create environment-specific files:
- `appsettings.Development.json`
- `appsettings.Staging.json`
- `appsettings.Production.json`

### Frontend Configuration

Frontend configuration: `client\src\services\api.ts`

Update the API base URL if needed:
```typescript
const API_BASE_URL = 'http://localhost:5037/api';
```

## IIS Configuration

### Default Configuration

- **Site Name:** CRMUi
- **App Pool:** CRMUiAppPool
- **Port:** 8080
- **Path:** C:\inetpub\wwwroot\CRMUi
- **Runtime:** .NET Core (No Managed Code)
- **Identity:** ApplicationPoolIdentity

### Web.config

The deployment script creates a `web.config` with:
- ASP.NET Core Module V2
- In-process hosting model
- Request size limit: 50 MB
- Stdout logging disabled (enable for troubleshooting)

### Enabling Detailed Logging

Edit `web.config` in deployment directory:
```xml
<aspNetCore processPath="dotnet" 
            stdoutLogEnabled="true" 
            stdoutLogFile=".\logs\stdout" />
```

## Troubleshooting

### Common Issues

**1. Site won't start**
- Check Event Viewer → Windows Logs → Application
- Enable stdout logging in web.config
- Verify ASP.NET Core Hosting Bundle is installed

**2. 500.31 Error**
- .NET runtime not found
- Install correct .NET runtime version
- Check application pool settings

**3. 403 Forbidden**
- Check file permissions
- Verify IIS AppPool identity has access
- Review IIS authentication settings

**4. Frontend not loading**
- Check if wwwroot\client folder exists
- Verify frontend build completed successfully
- Check browser console for errors

**5. Backend API not responding**
- Check if backend is running (Task Manager)
- Review logs in deployment\logs folder
- Verify appsettings.json configuration

### Log Locations

- **Application Logs:** `C:\inetpub\wwwroot\CRMUi\logs\`
- **IIS Logs:** `C:\inetpub\logs\LogFiles\`
- **Event Viewer:** Windows Logs → Application

### Restart Application

```powershell
# Using IIS Manager
# OR using PowerShell:
Import-Module WebAdministration
Restart-WebAppPool -Name "CRMUiAppPool"
Restart-WebSite -Name "CRMUi"
```

## Security Considerations

### Production Deployment

1. **Use HTTPS**
   - Install SSL certificate
   - Update port binding to 443
   - Redirect HTTP to HTTPS

2. **Update CORS Settings**
   - Restrict origins in `Program.cs`
   - Remove wildcard origins

3. **Secure Configuration**
   - Store secrets in Azure Key Vault or environment variables
   - Don't commit sensitive data to source control

4. **File Permissions**
   - Limit permissions to necessary folders only
   - Regular security audits

### Firewall Rules

Open required ports in Windows Firewall:
```powershell
New-NetFirewallRule -DisplayName "CRM UI HTTP" -Direction Inbound -LocalPort 8080 -Protocol TCP -Action Allow
```

## Monitoring

### Health Checks

Add to `Program.cs`:
```csharp
app.MapHealthChecks("/health");
```

### Application Insights (Optional)

Add Application Insights for monitoring:
```powershell
dotnet add package Microsoft.ApplicationInsights.AspNetCore
```

## Backup and Recovery

### Backup Before Update

```powershell
# Backup deployment directory
Copy-Item -Path "C:\inetpub\wwwroot\CRMUi" -Destination "C:\Backups\CRMUi_$(Get-Date -Format 'yyyyMMdd_HHmmss')" -Recurse
```

### Restore from Backup

```powershell
# Stop site
Stop-WebSite -Name "CRMUi"
Stop-WebAppPool -Name "CRMUiAppPool"

# Restore files
Copy-Item -Path "C:\Backups\CRMUi_20250129_120000\*" -Destination "C:\inetpub\wwwroot\CRMUi" -Recurse -Force

# Start site
Start-WebAppPool -Name "CRMUiAppPool"
Start-WebSite -Name "CRMUi"
```

## Performance Tuning

### Application Pool Settings

- **Recycling:** Configure regular intervals
- **Queue Length:** Adjust based on load
- **Idle Timeout:** Set appropriate timeout

### Compression

Enable static and dynamic compression in IIS for better performance.

## Support

For issues or questions:
1. Check logs in deployment directory
2. Review Windows Event Viewer
3. Enable detailed logging in web.config
4. Check IIS application pool status

## Quick Reference

```powershell
# Deploy
.\deploy-iis.ps1

# Undeploy
.\undeploy-iis.ps1

# Build only
.\build-only.ps1

# Check prerequisites
.\check-prerequisites.ps1

# Update config
.\update-appsettings.ps1 -Environment Production

# Check site status
Get-WebSite -Name "CRMUi"
Get-WebAppPool -Name "CRMUiAppPool"
```
# This file has been removed as part of documentation cleanup.
