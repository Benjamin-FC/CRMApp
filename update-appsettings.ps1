# Update appsettings.json for different environments

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet("Development", "Staging", "Production")]
    [string]$Environment,
    
    [string]$CRMBackendUrl,
    [string]$TokenEndpoint,
    [int]$Port
)

$appsettingsPath = "$PSScriptRoot\CRMWebSpa.Server\appsettings.json"
$appsettingsEnvPath = "$PSScriptRoot\CRMWebSpa.Server\appsettings.$Environment.json"

Write-Host "Updating appsettings for environment: $Environment" -ForegroundColor Cyan

# Read current appsettings
if (Test-Path $appsettingsEnvPath) {
    $config = Get-Content $appsettingsEnvPath | ConvertFrom-Json
} else {
    $config = Get-Content $appsettingsPath | ConvertFrom-Json
}

# Update CRM Backend URL if provided
if ($CRMBackendUrl) {
    $config.CRMBackend.BaseUrl = $CRMBackendUrl
    Write-Host "Updated CRM Backend URL: $CRMBackendUrl" -ForegroundColor Green
}

# Update Token Endpoint if provided
if ($TokenEndpoint) {
    $config.CRMBackend.TokenEndpoint = $TokenEndpoint
    Write-Host "Updated Token Endpoint: $TokenEndpoint" -ForegroundColor Green
}

# Update logging level based on environment
if ($Environment -eq "Production") {
    $config.Serilog.MinimumLevel.Default = "Warning"
    Write-Host "Set logging level to: Warning (Production)" -ForegroundColor Green
} elseif ($Environment -eq "Staging") {
    $config.Serilog.MinimumLevel.Default = "Information"
    Write-Host "Set logging level to: Information (Staging)" -ForegroundColor Green
} else {
    $config.Serilog.MinimumLevel.Default = "Debug"
    Write-Host "Set logging level to: Debug (Development)" -ForegroundColor Green
}

# Save updated configuration
$config | ConvertTo-Json -Depth 10 | Set-Content $appsettingsEnvPath
Write-Host "`nConfiguration saved to: $appsettingsEnvPath" -ForegroundColor Green

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "   CONFIGURATION UPDATE COMPLETED!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Green
