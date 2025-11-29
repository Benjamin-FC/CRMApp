# Deploy CRMWebSpa to IIS
# Run as Administrator

Import-Module WebAdministration

$appPoolName = "CRMUiPool"
$siteName = "Default Web Site"
$appName = "CRMUi"
$physicalPath = "d:\_DELETE_\CRMUI\publish"

Write-Host "Deploying CRMUi to IIS..." -ForegroundColor Cyan

# Check admin
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "ERROR: Run as Administrator!" -ForegroundColor Red
    exit 1
}

# Create/Update App Pool
if (!(Test-Path "IIS:\AppPools\$appPoolName")) {
    Write-Host "Creating App Pool: $appPoolName" -ForegroundColor Green
    New-WebAppPool -Name $appPoolName
    Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "managedRuntimeVersion" -Value ""
    Set-ItemProperty "IIS:\AppPools\$appPoolName" -Name "enable32BitAppOnWin64" -Value $false
} else {
    Write-Host "App Pool exists, stopping..." -ForegroundColor Yellow
    Stop-WebAppPool -Name $appPoolName
    Start-Sleep -Seconds 2
}

# Remove existing app
if (Test-Path "IIS:\Sites\$siteName\$appName") {
    Write-Host "Removing existing app..." -ForegroundColor Yellow
    Remove-WebApplication -Name $appName -Site $siteName
}

# Ensure Default Web Site is running
if (!(Test-Path "IIS:\Sites\$siteName")) {
    Write-Host "Creating Default Web Site..." -ForegroundColor Yellow
    New-Website -Name $siteName -PhysicalPath "C:\inetpub\wwwroot" -Port 80
}

$site = Get-Website -Name $siteName
if ($site.State -ne "Started") {
    Start-Website -Name $siteName
}

# Create application
Write-Host "Creating application: /$appName" -ForegroundColor Green
New-WebApplication -Name $appName -Site $siteName -PhysicalPath $physicalPath -ApplicationPool $appPoolName -Force

# Set permissions
Write-Host "Setting permissions..." -ForegroundColor Green
$acl = Get-Acl $physicalPath
$permission = "IIS_IUSRS", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl $physicalPath $acl

# Start app pool
Start-WebAppPool -Name $appPoolName

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "URL: http://localhost/$appName" -ForegroundColor White
Write-Host "Swagger: http://localhost/$appName/swagger" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

# Test
Start-Sleep -Seconds 3
try {
    $response = Invoke-WebRequest -Uri "http://localhost/$appName" -UseBasicParsing -TimeoutSec 5
    Write-Host "Site is responding! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Warning: $($_.Exception.Message)" -ForegroundColor Yellow
}
