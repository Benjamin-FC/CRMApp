# Check if backend is running on port 5018
$portCheck = Test-NetConnection -ComputerName 'localhost' -Port 5018
if (-not $portCheck.TcpTestSucceeded) {
	Write-Error 'start backend first (port 5018 is not listening)'
	exit 1
}
Write-Host 'verified 5018 is working!' -ForegroundColor Green
# Check if script execution is allowed
try {
	$null = Get-ExecutionPolicy -Scope CurrentUser
} catch {
	Write-Error 'Unable to determine execution policy.'
	exit 1
}

if ((Get-ExecutionPolicy -Scope CurrentUser) -eq 'Restricted') {
	Write-Error 'PowerShell script execution is disabled by your execution policy.\nTo enable, run: Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned\nSee https://go.microsoft.com/fwlink/?LinkID=135170 for details.'
	exit 1
}
# Check for required environment variable
if (-not $env:CRM_USERNAME) {
	Write-Error 'Environment variable CRM_USERNAME is not set. Please set CRM_USERNAME before running this script.'
	exit 1
}
# Master PowerShell script to start backend and then CRMApp
# Starts backend proxy, waits for it to be ready, then staclsrts CRMApp

$backendPath = "C:\Users\BenjaminA\source\repos\CRMBackEnd"
$crmAppPath = "C:\Users\BenjaminA\source\repos\CRMApp"



Write-Host "Starting CRMApp..."
Push-Location $crmAppPath
./start-all.ps1
Pop-Location

Write-Host "Both backend and CRMApp started."
