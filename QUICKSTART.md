# CRM UI - Quick Start Guide

## For First Time Setup

### 1. Check Prerequisites
Run this first to ensure you have everything needed:
```powershell
.\check-prerequisites.ps1
```

### 2. Deploy to IIS
**Option A - Using Batch File (Easiest):**
- Right-click `DEPLOY.bat`
- Select "Run as Administrator"

**Option B - Using PowerShell:**
```powershell
# Run PowerShell as Administrator, then:
.\deploy-iis.ps1
```

### 3. Access Your Application
Open browser to: `http://localhost:8080`

## Common Commands

### Build Without Deploying
```powershell
.\build-only.ps1
```

### Update Configuration
```powershell
.\update-appsettings.ps1 -Environment Production -CRMBackendUrl "http://your-backend"
```

### Undeploy from IIS
```powershell
# Remove from IIS but keep files
.\undeploy-iis.ps1

# Remove from IIS and delete files
.\undeploy-iis.ps1 -DeleteFiles
```

### Run All Tests
```powershell
cd CRMWebSpa.Tests
dotnet test
```

### Development Mode
```powershell
# Terminal 1 - Backend
cd CRMWebSpa.Server
dotnet run

# Terminal 2 - Frontend
cd client
npm run dev
```

## Interactive Helper Menu

For an interactive menu with all options:
```batch
deployment-helper.bat
```

## Troubleshooting

### "Access Denied" or "Permission Denied"
- Make sure you're running as Administrator
- Right-click PowerShell or CMD and select "Run as Administrator"

### "Execution Policy" Errors
The scripts use `-ExecutionPolicy Bypass` to avoid this, but if you get errors:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### IIS Not Found
Install IIS via Windows Features:
1. Open "Turn Windows features on or off"
2. Enable "Internet Information Services"
3. Enable "Web Management Tools" → "IIS Management Console"
4. Enable ".NET Framework 4.8 Advanced Services" or later

### ASP.NET Core Module Not Found
Download and install the ASP.NET Core Hosting Bundle:
https://dotnet.microsoft.com/download/dotnet/8.0

Look for "Hosting Bundle" in the downloads list.

## Default Deployment Details

After deployment, your app will be available at:
- **URL:** http://localhost:8080
- **Site Name:** CRMUi
- **App Pool:** CRMUiAppPool
- **Path:** C:\inetpub\wwwroot\CRMUi

## Need More Help?

See detailed documentation in [DEPLOYMENT.md](DEPLOYMENT.md)
