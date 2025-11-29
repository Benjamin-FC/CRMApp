# Undeploy CRMWebSpa from IIS
# Removes application from IIS and optionally deletes files

param(
    [switch]$DeleteFiles = $false,
    [switch]$DeleteAppPool = $true,
    [string]$AppName = "CRMUi",
    [string]$AppPoolName = "CRMUiPool"
)

$ErrorActionPreference = "Stop"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Undeploying $AppName from IIS" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

# Check admin
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
if (-not $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "❌ This script must be run as Administrator!" -ForegroundColor Red
    exit 1
}

try {
    Import-Module WebAdministration -ErrorAction Stop
} catch {
    Write-Host "❌ IIS WebAdministration module not available" -ForegroundColor Red
    exit 1
}

# Stop App Pool
if (Test-Path "IIS:\AppPools\$AppPoolName") {
    Write-Host "Stopping App Pool: $AppPoolName..." -NoNewline
    Stop-WebAppPool -Name $AppPoolName -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
    Write-Host " ✅" -ForegroundColor Green
}

# Remove Application
if (Test-Path "IIS:\Sites\Default Web Site\$AppName") {
    Write-Host "Removing Application: $AppName..." -NoNewline
    Remove-WebApplication -Name $AppName -Site "Default Web Site"
    Write-Host " ✅" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Application '$AppName' not found in IIS" -ForegroundColor Yellow
}

# Remove App Pool
if ($DeleteAppPool -and (Test-Path "IIS:\AppPools\$AppPoolName")) {
    Write-Host "Removing App Pool: $AppPoolName..." -NoNewline
    Remove-WebAppPool -Name $AppPoolName
    Write-Host " ✅" -ForegroundColor Green
}

# Delete files
if ($DeleteFiles) {
    $publishPath = "$PSScriptRoot\publish"
    if (Test-Path $publishPath) {
        Write-Host "Deleting files from: $publishPath..." -NoNewline
        Remove-Item $publishPath -Recurse -Force
        Write-Host " ✅" -ForegroundColor Green
    }
}

Write-Host "`n✅ Undeployment complete!`n" -ForegroundColor Green

if (-not $DeleteFiles) {
    Write-Host "💡 To also delete publish files, run:" -ForegroundColor Yellow
    Write-Host "   .\undeploy.ps1 -DeleteFiles`n" -ForegroundColor White
}
