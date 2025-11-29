# Check Prerequisites for CRM UI Deployment

Write-Host "Checking Prerequisites for CRM UI Deployment..." -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green

$allGood = $true

# Check if running as Administrator
Write-Host "Checking Administrator privileges..." -ForegroundColor Yellow
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    Write-Host "  ✓ Running as Administrator" -ForegroundColor Green
} else {
    Write-Host "  ✗ NOT running as Administrator" -ForegroundColor Red
    Write-Host "    Please run PowerShell as Administrator" -ForegroundColor Yellow
    $allGood = $false
}

# Check .NET SDK
Write-Host "`nChecking .NET SDK..." -ForegroundColor Yellow
try {
    $dotnetVersion = dotnet --version
    Write-Host "  ✓ .NET SDK installed: $dotnetVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ .NET SDK not found" -ForegroundColor Red
    Write-Host "    Install from: https://dotnet.microsoft.com/download" -ForegroundColor Yellow
    $allGood = $false
}

# Check Node.js
Write-Host "`nChecking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Node.js not found" -ForegroundColor Red
    Write-Host "    Install from: https://nodejs.org/" -ForegroundColor Yellow
    $allGood = $false
}

# Check npm
Write-Host "`nChecking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✓ npm installed: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ npm not found" -ForegroundColor Red
    Write-Host "    Comes with Node.js installation" -ForegroundColor Yellow
    $allGood = $false
}

# Check IIS
Write-Host "`nChecking IIS..." -ForegroundColor Yellow
try {
    Import-Module WebAdministration -ErrorAction Stop
    Write-Host "  ✓ IIS is installed and accessible" -ForegroundColor Green
} catch {
    Write-Host "  ✗ IIS not found or not accessible" -ForegroundColor Red
    Write-Host "    Install IIS via Windows Features" -ForegroundColor Yellow
    $allGood = $false
}

# Check ASP.NET Core Hosting Bundle
Write-Host "`nChecking ASP.NET Core Hosting Bundle..." -ForegroundColor Yellow
$aspNetCoreModulePath = "${env:ProgramFiles}\IIS\Asp.Net Core Module\V2\aspnetcorev2.dll"
if (Test-Path $aspNetCoreModulePath) {
    Write-Host "  ✓ ASP.NET Core Module V2 is installed" -ForegroundColor Green
} else {
    Write-Host "  ✗ ASP.NET Core Hosting Bundle not found" -ForegroundColor Red
    Write-Host "    Install from: https://dotnet.microsoft.com/download/dotnet/8.0" -ForegroundColor Yellow
    Write-Host "    Look for 'Hosting Bundle' download" -ForegroundColor Yellow
    $allGood = $false
}

# Check project files
Write-Host "`nChecking project structure..." -ForegroundColor Yellow
$serverProject = "$PSScriptRoot\CRMWebSpa.Server\CRMWebSpa.Server.csproj"
$clientPackageJson = "$PSScriptRoot\client\package.json"

if (Test-Path $serverProject) {
    Write-Host "  ✓ Backend project found" -ForegroundColor Green
} else {
    Write-Host "  ✗ Backend project not found: $serverProject" -ForegroundColor Red
    $allGood = $false
}

if (Test-Path $clientPackageJson) {
    Write-Host "  ✓ Frontend project found" -ForegroundColor Green
} else {
    Write-Host "  ✗ Frontend project not found: $clientPackageJson" -ForegroundColor Red
    $allGood = $false
}

# Final summary
Write-Host "`n============================================" -ForegroundColor Green
if ($allGood) {
    Write-Host "   ALL PREREQUISITES MET! ✓" -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Green
    Write-Host "`nYou can now run: .\deploy-iis.ps1" -ForegroundColor Cyan
} else {
    Write-Host "   SOME PREREQUISITES ARE MISSING! ✗" -ForegroundColor Red
    Write-Host "============================================" -ForegroundColor Red
    Write-Host "`nPlease install missing components before deployment." -ForegroundColor Yellow
}
Write-Host ""
