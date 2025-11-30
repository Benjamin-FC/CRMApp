# 🚀 CRM UI - Complete Deployment Package

Complete IIS deployment solution for CRM UI application with automated scripts and comprehensive documentation.

## 📦 What's Included

### Deployment Scripts (5)
- ✅ `deploy-iis.ps1` - Full automated deployment to IIS
- ✅ `undeploy-iis.ps1` - Clean removal from IIS
- ✅ `build-only.ps1` - Build without deploying
- ✅ `check-prerequisites.ps1` - System requirements checker
- ✅ `update-appsettings.ps1` - Configuration updater

### Quick Start Tools (2)
- ✅ `DEPLOY.bat` - One-click deployment (right-click → Run as Admin)
- ✅ `deployment-helper.bat` - Interactive menu for all operations

### Documentation (4)
- ✅ `QUICKSTART.md` - Get started in 5 minutes
- ✅ `DEPLOYMENT.md` - Complete deployment guide (8.4 KB)
- ✅ `SCRIPTS.md` - Full scripts reference (7.3 KB)
- ✅ `README.md` - Project overview and development guide

## 🎯 Quick Start (30 seconds)

1. **Right-click** `DEPLOY.bat`
2. Select **"Run as Administrator"**
3. Wait for completion
4. Open **http://localhost:8080**

Done! ✨

## 📚 Documentation Guide

| File | Purpose | When to Read |
|------|---------|--------------|
| **QUICKSTART.md** | Get running fast | First time users |
| **DEPLOYMENT.md** | Comprehensive guide | Need detailed info |
| **SCRIPTS.md** | Script reference | Using individual scripts |
| **README.md** | Project overview | Development & features |

## 🛠️ Common Tasks

### First Deployment
```batch
DEPLOY.bat
```

### Check Prerequisites
```powershell
.\check-prerequisites.ps1
```

### Interactive Menu
```batch
deployment-helper.bat
```

### Custom Port Deployment
```powershell
.\deploy-iis.ps1 -Port 9090
```

### Update Configuration
```powershell
.\update-appsettings.ps1 -Environment Production
```

### Remove from IIS
```powershell
.\undeploy-iis.ps1
```

## 📋 Default Configuration

After deployment:
- **URL:** http://localhost:8080
- **Site Name:** CRMUi
- **App Pool:** CRMUiAppPool
- **Path:** C:\inetpub\wwwroot\CRMUi

## ⚡ Features

### Automated Deployment
- ✓ Builds backend and frontend
- ✓ Creates IIS site and app pool
- ✓ Configures permissions
- ✓ Sets up logging
- ✓ Validates deployment

### Smart Prerequisites Check
- ✓ Administrator privileges
- ✓ .NET SDK 8.0+
- ✓ Node.js 18+
- ✓ IIS installation
- ✓ ASP.NET Core Hosting Bundle
- ✓ Project structure

### Flexible Configuration
- ✓ Multiple environments (Dev/Staging/Prod)
- ✓ Custom backend URLs
- ✓ Adjustable logging levels
- ✓ Environment-specific settings

### Safe Operations
- ✓ Confirmation prompts
- ✓ Automatic backups support
- ✓ Graceful error handling
- ✓ Detailed logging

## 🔧 Requirements

### System Requirements
- Windows 10/11 or Windows Server
- IIS enabled
- .NET 8.0 SDK
- Node.js 18+
- Administrator access

### Project Structure
```
CRMUI/
├── CRMWebSpa.Server/    # Backend (.NET)
├── client/              # Frontend (React)
├── CRMWebSpa.Tests/     # Test suite
└── [deployment scripts] # This package
```

## 📖 Next Steps

1. **Read:** [QUICKSTART.md](QUICKSTART.md) - 5-minute guide
2. **Deploy:** Run `DEPLOY.bat` as Administrator
3. **Verify:** Open http://localhost:8080
4. **Learn More:** Read [DEPLOYMENT.md](DEPLOYMENT.md)

## 💡 Tips

- Always run prerequisite check first
- Use `deployment-helper.bat` for interactive menu
- Keep backups before major updates
- Check Event Viewer if issues occur
- Enable detailed logging for troubleshooting

## 🆘 Need Help?

1. Run `.\check-prerequisites.ps1` - Check system
2. See [DEPLOYMENT.md](DEPLOYMENT.md) - Full guide
3. See [SCRIPTS.md](SCRIPTS.md) - Script reference
4. Check logs in `C:\inetpub\wwwroot\CRMUi\logs\`

## 🎉 What Gets Deployed

- ✓ Backend API (ASP.NET Core)
- ✓ Frontend SPA (React)
- ✓ Serilog logging
- ✓ OAuth authentication
- ✓ CORS configuration
- ✓ Swagger documentation
- ✓ Health checks
- ✓ Error handling

## 📊 Test Coverage

49 comprehensive tests included:
- 14 Controller tests
- 29 Service tests
- 6 Model tests
- 9 Integration tests

Run tests:
```powershell
cd CRMWebSpa.Tests
dotnet test
```

---

**Ready to deploy?** Right-click `DEPLOY.bat` and select "Run as Administrator"! 🚀
# This file has been removed as part of documentation cleanup.
