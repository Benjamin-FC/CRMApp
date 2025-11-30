# Clean Deployment Steps for CRM WebSpa

Follow these steps to deploy the CRM WebSpa application to IIS from scratch.

## Prerequisites
- Windows Server with IIS installed
- .NET 8.0 SDK installed
- Node.js (LTS) installed
- Administrator privileges

## 1. Clone the Repository
```
git clone <your-repo-url>
cd CRMUI
```

## 2. Build and Test Backend
```
cd CRMWebSpa.Server
# Restore dependencies
 dotnet restore
# Run tests (optional)
 dotnet test
# Publish for Release
 dotnet publish -c Release -o ../publish
```

## 3. Build Frontend
```
cd ../client
npm install
npm run build
```

## 4. Integrate Frontend with Backend
```
# Copy frontend build to backend wwwroot
xcopy /E /I /Y dist ..\publish\wwwroot
```

## 5. Configure IIS
- Open IIS Manager
- Create an Application Pool (No Managed Code)
- Create a new Application under your site (e.g. `/CRMUi`)
- Set the Physical Path to the `publish` folder
- Assign the Application Pool
- Ensure permissions for `IIS_IUSRS` on the publish folder

## 6. Start Application
- Start the Application Pool
- Browse to `http://localhost/CRMUi`

## 7. Verify Deployment
- Home page loads
- Swagger UI available at `/CRMUi/swagger`
- API endpoints respond

## 8. Troubleshooting
- Check IIS logs and `publish/logs` for errors
- Ensure all prerequisites are installed
- Restart IIS if needed

---
For automated deployment, use the provided `build-and-deploy.ps1` script.
