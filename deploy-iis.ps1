# CRM UI Deployment Script for IIS
# This script builds and deploys the CRM application to IIS

param(
    [string]$SiteName = "CRMUi",
    [string]$AppPool = "CRMUiAppPool",
    [int]$Port = 8080,
    [string]$DeployPath = "C:\inetpub\wwwroot\CRMUi",
    [string]$HostName = "localhost"
)

Write-Host "Starting CRM UI Deployment to IIS..." -ForegroundColor Green
Write-Host "Site Name: $SiteName" -ForegroundColor Cyan
Write-Host "App Pool: $AppPool" -ForegroundColor Cyan
Write-Host "Port: $Port" -ForegroundColor Cyan
Write-Host "Deploy Path: $DeployPath" -ForegroundColor Cyan

# Check if running as Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    exit 1
}

# Import IIS module
Write-Host "`nImporting IIS module..." -ForegroundColor Yellow
Import-Module WebAdministration -ErrorAction Stop

# Stop if deployment path already exists and ask for confirmation
if (Test-Path $DeployPath) {
    Write-Host "`nWARNING: Deployment path already exists: $DeployPath" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite? (Y/N)"
    if ($response -ne "Y" -and $response -ne "y") {
        Write-Host "Deployment cancelled." -ForegroundColor Red
        exit 0
    }
    
    # Stop the site and app pool if they exist
    if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
        Write-Host "Stopping existing site: $SiteName..." -ForegroundColor Yellow
        Stop-WebSite -Name $SiteName -ErrorAction SilentlyContinue
    }
    
    if (Get-WebAppPoolState -Name $AppPool -ErrorAction SilentlyContinue) {
        Write-Host "Stopping existing app pool: $AppPool..." -ForegroundColor Yellow
        Stop-WebAppPool -Name $AppPool -ErrorAction SilentlyContinue
        Start-Sleep -Seconds 2
    }
}

# Build the backend
Write-Host "`n=== Building Backend ===" -ForegroundColor Green
Push-Location "$PSScriptRoot\CRMWebSpa.Server"
$buildResult = dotnet publish -c Release -o "$PSScriptRoot\publish\backend"
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Backend build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "Backend build successful!" -ForegroundColor Green

# Build the frontend
Write-Host "`n=== Building Frontend ===" -ForegroundColor Green
Push-Location "$PSScriptRoot\client"
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}

npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Frontend build failed!" -ForegroundColor Red
    Pop-Location
    exit 1
}
Pop-Location
Write-Host "Frontend build successful!" -ForegroundColor Green

# Create deployment directory
Write-Host "`n=== Creating Deployment Directory ===" -ForegroundColor Green
if (Test-Path $DeployPath) {
    Remove-Item -Path $DeployPath -Recurse -Force
}
New-Item -ItemType Directory -Path $DeployPath -Force | Out-Null
Write-Host "Deployment directory created: $DeployPath" -ForegroundColor Green

# Copy backend files
Write-Host "`nCopying backend files..." -ForegroundColor Yellow
Copy-Item -Path "$PSScriptRoot\publish\backend\*" -Destination $DeployPath -Recurse -Force
Write-Host "Backend files copied successfully!" -ForegroundColor Green

# Copy frontend files to wwwroot
Write-Host "`nCopying frontend files..." -ForegroundColor Yellow
$wwwrootPath = Join-Path $DeployPath "wwwroot\client"
New-Item -ItemType Directory -Path $wwwrootPath -Force | Out-Null
Copy-Item -Path "$PSScriptRoot\client\dist\*" -Destination $wwwrootPath -Recurse -Force
Write-Host "Frontend files copied successfully!" -ForegroundColor Green

# Create or update Application Pool
Write-Host "`n=== Configuring Application Pool ===" -ForegroundColor Green
if (Test-Path "IIS:\AppPools\$AppPool") {
    Write-Host "Application pool already exists, updating..." -ForegroundColor Yellow
    Stop-WebAppPool -Name $AppPool -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Remove-WebAppPool -Name $AppPool -ErrorAction SilentlyContinue
}

New-WebAppPool -Name $AppPool -Force | Out-Null
Set-ItemProperty -Path "IIS:\AppPools\$AppPool" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty -Path "IIS:\AppPools\$AppPool" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Write-Host "Application pool created: $AppPool" -ForegroundColor Green

# Create or update Website
Write-Host "`n=== Configuring Website ===" -ForegroundColor Green
if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
    Write-Host "Website already exists, removing..." -ForegroundColor Yellow
    Remove-WebSite -Name $SiteName
}

New-WebSite -Name $SiteName `
    -Port $Port `
    -PhysicalPath $DeployPath `
    -ApplicationPool $AppPool `
    -Force | Out-Null

Write-Host "Website created: $SiteName" -ForegroundColor Green

# Set permissions
Write-Host "`n=== Setting Permissions ===" -ForegroundColor Green
$acl = Get-Acl $DeployPath
$identity = "IIS AppPool\$AppPool"
$fileSystemRights = [System.Security.AccessControl.FileSystemRights]::FullControl
$inheritanceFlags = [System.Security.AccessControl.InheritanceFlags]::ContainerInherit -bor [System.Security.AccessControl.InheritanceFlags]::ObjectInherit
$propagationFlags = [System.Security.AccessControl.PropagationFlags]::None
$accessControlType = [System.Security.AccessControl.AccessControlType]::Allow
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, $fileSystemRights, $inheritanceFlags, $propagationFlags, $accessControlType)
$acl.AddAccessRule($accessRule)
Set-Acl -Path $DeployPath -AclObject $acl
Write-Host "Permissions set for: $identity" -ForegroundColor Green

# Create web.config for URL rewriting if needed
Write-Host "`nCreating web.config..." -ForegroundColor Yellow
$webConfigContent = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" 
                  arguments=".\CRMWebSpa.Server.dll" 
                  stdoutLogEnabled="false" 
                  stdoutLogFile=".\logs\stdout" 
                  hostingModel="inprocess" />
      <security>
        <requestFiltering>
          <requestLimits maxAllowedContentLength="52428800" />
        </requestFiltering>
      </security>
    </system.webServer>
  </location>
</configuration>
"@

$webConfigPath = Join-Path $DeployPath "web.config"
$webConfigContent | Out-File -FilePath $webConfigPath -Encoding UTF8 -Force
Write-Host "web.config created successfully!" -ForegroundColor Green

# Start the application pool and website
Write-Host "`n=== Starting Application ===" -ForegroundColor Green
Start-WebAppPool -Name $AppPool
Start-Sleep -Seconds 2
Start-WebSite -Name $SiteName
Write-Host "Application pool and website started!" -ForegroundColor Green

# Clean up publish folder
Write-Host "`nCleaning up temporary files..." -ForegroundColor Yellow
Remove-Item -Path "$PSScriptRoot\publish" -Recurse -Force -ErrorAction SilentlyContinue

# Display summary
Write-Host "`n============================================" -ForegroundColor Green
Write-Host "   DEPLOYMENT COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nDeployment Summary:" -ForegroundColor Cyan
Write-Host "  Site Name:     $SiteName" -ForegroundColor White
Write-Host "  App Pool:      $AppPool" -ForegroundColor White
Write-Host "  Deploy Path:   $DeployPath" -ForegroundColor White
Write-Host "  URL:           http://${HostName}:${Port}" -ForegroundColor White
Write-Host "`nNext Steps:" -ForegroundColor Yellow
Write-Host "  1. Open your browser and navigate to: http://${HostName}:${Port}" -ForegroundColor White
Write-Host "  2. Check IIS Manager to verify the site is running" -ForegroundColor White
Write-Host "  3. Review logs in: $DeployPath\logs" -ForegroundColor White
Write-Host "`n============================================`n" -ForegroundColor Green
