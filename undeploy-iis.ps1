# CRM UI Undeployment Script for IIS
# This script removes the CRM application from IIS

param(
    [string]$SiteName = "CRMUi",
    [string]$AppPool = "CRMUiAppPool",
    [string]$DeployPath = "C:\inetpub\wwwroot\CRMUi",
    [switch]$DeleteFiles = $false
)

Write-Host "Starting CRM UI Undeployment from IIS..." -ForegroundColor Yellow
Write-Host "Site Name: $SiteName" -ForegroundColor Cyan
Write-Host "App Pool: $AppPool" -ForegroundColor Cyan

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

# Stop and remove website
if (Get-WebSite -Name $SiteName -ErrorAction SilentlyContinue) {
    Write-Host "`nStopping website: $SiteName..." -ForegroundColor Yellow
    Stop-WebSite -Name $SiteName -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    Write-Host "Removing website: $SiteName..." -ForegroundColor Yellow
    Remove-WebSite -Name $SiteName
    Write-Host "Website removed successfully!" -ForegroundColor Green
} else {
    Write-Host "`nWebsite $SiteName not found." -ForegroundColor Gray
}

# Stop and remove application pool
if (Test-Path "IIS:\AppPools\$AppPool") {
    Write-Host "`nStopping application pool: $AppPool..." -ForegroundColor Yellow
    Stop-WebAppPool -Name $AppPool -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    
    Write-Host "Removing application pool: $AppPool..." -ForegroundColor Yellow
    Remove-WebAppPool -Name $AppPool
    Write-Host "Application pool removed successfully!" -ForegroundColor Green
} else {
    Write-Host "`nApplication pool $AppPool not found." -ForegroundColor Gray
}

# Delete deployment files if requested
if ($DeleteFiles) {
    if (Test-Path $DeployPath) {
        Write-Host "`nDeleting deployment files from: $DeployPath..." -ForegroundColor Yellow
        $response = Read-Host "Are you sure you want to delete all files? (Y/N)"
        if ($response -eq "Y" -or $response -eq "y") {
            Remove-Item -Path $DeployPath -Recurse -Force
            Write-Host "Deployment files deleted successfully!" -ForegroundColor Green
        } else {
            Write-Host "File deletion cancelled." -ForegroundColor Yellow
        }
    } else {
        Write-Host "`nDeployment path not found: $DeployPath" -ForegroundColor Gray
    }
} else {
    Write-Host "`nDeployment files were NOT deleted. Use -DeleteFiles switch to remove them." -ForegroundColor Cyan
}

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "   UNDEPLOYMENT COMPLETED!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green
