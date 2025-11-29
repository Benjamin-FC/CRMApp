# Verify IIS Deployment
# Runs comprehensive verification tests on deployed application

param(
    [string]$AppName = "CRMUi",
    [switch]$Detailed = $false
)

$baseUrl = "http://localhost/$AppName"

function Write-TestResult {
    param(
        [string]$TestName,
        [bool]$Passed,
        [string]$Details = ""
    )
    
    $status = if ($Passed) { "✅ PASS" } else { "❌ FAIL" }
    $color = if ($Passed) { "Green" } else { "Red" }
    
    Write-Host "$status - $TestName" -ForegroundColor $color
    if ($Details -and $Detailed) {
        Write-Host "        $Details" -ForegroundColor Gray
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   IIS Deployment Verification" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

$allTests = @()

# Test 1: IIS Configuration
Write-Host "📋 Checking IIS Configuration..." -ForegroundColor Cyan
try {
    Import-Module WebAdministration
    
    $app = Get-WebApplication -Name $AppName -Site "Default Web Site"
    $allTests += @{
        Name = "Application exists in IIS"
        Passed = $app -ne $null
        Details = if ($app) { "Path: $($app.PhysicalPath)" } else { "Not found" }
    }
    
    if ($app) {
        $appPool = Get-Item "IIS:\AppPools\$($app.ApplicationPool)"
        $allTests += @{
            Name = "App Pool configured correctly"
            Passed = $appPool.managedRuntimeVersion -eq ""
            Details = "Runtime: $($appPool.managedRuntimeVersion), State: $($appPool.state)"
        }
    }
} catch {
    $allTests += @{
        Name = "IIS Configuration Check"
        Passed = $false
        Details = $_.Exception.Message
    }
}

# Test 2: File System
Write-Host "`n📁 Checking File System..." -ForegroundColor Cyan
$publishPath = "$PSScriptRoot\publish"

$fileTests = @(
    @{ File = "CRMWebSpa.Server.dll"; Critical = $true }
    @{ File = "web.config"; Critical = $true }
    @{ File = "wwwroot\index.html"; Critical = $true }
    @{ File = "appsettings.json"; Critical = $false }
)

foreach ($test in $fileTests) {
    $exists = Test-Path "$publishPath\$($test.File)"
    $allTests += @{
        Name = "File: $($test.File)"
        Passed = $exists -or (-not $test.Critical)
        Details = if ($exists) { "Found" } else { "Missing" }
    }
}

# Test 3: HTTP Endpoints
Write-Host "`n🌐 Testing HTTP Endpoints..." -ForegroundColor Cyan

$endpoints = @(
    @{ 
        Name = "Root (Frontend)"
        Url = $baseUrl
        ExpectedStatus = 200
    }
    @{ 
        Name = "Swagger UI"
        Url = "$baseUrl/swagger"
        ExpectedStatus = 200
    }
    @{ 
        Name = "API - Health Check"
        Url = "$baseUrl/api/auth/login"
        Method = "POST"
        Body = '{"username":"","password":""}'
        ExpectedStatus = 400
        Description = "Should return BadRequest for empty credentials"
    }
    @{ 
        Name = "API - Valid Login"
        Url = "$baseUrl/api/auth/login"
        Method = "POST"
        Body = '{"username":"testuser","password":"password123"}'
        ExpectedStatus = 200
        Description = "Should return token"
    }
    @{ 
        Name = "API - Customer without token"
        Url = "$baseUrl/api/customer/12345"
        ExpectedStatus = 401
        Description = "Should require authorization"
    }
)

foreach ($endpoint in $endpoints) {
    try {
        $params = @{
            Uri = $endpoint.Url
            UseBasicParsing = $true
            TimeoutSec = 10
        }
        
        if ($endpoint.Method -eq "POST") {
            $params.Method = "POST"
            $params.Body = $endpoint.Body
            $params.ContentType = "application/json"
        }
        
        try {
            $response = Invoke-WebRequest @params -ErrorAction Stop
            $status = $response.StatusCode
        } catch {
            $status = $_.Exception.Response.StatusCode.value__
        }
        
        $passed = $status -eq $endpoint.ExpectedStatus
        $details = "Status: $status (Expected: $($endpoint.ExpectedStatus))"
        if ($endpoint.Description) {
            $details += " - $($endpoint.Description)"
        }
        
        $allTests += @{
            Name = $endpoint.Name
            Passed = $passed
            Details = $details
        }
    } catch {
        $allTests += @{
            Name = $endpoint.Name
            Passed = $false
            Details = "Error: $($_.Exception.Message)"
        }
    }
}

# Test 4: Logging
Write-Host "`n📝 Checking Logging..." -ForegroundColor Cyan
$logPath = "$publishPath\logs"
$logExists = Test-Path $logPath
$allTests += @{
    Name = "Log directory exists"
    Passed = $logExists
    Details = if ($logExists) { 
        $logCount = (Get-ChildItem $logPath -Filter "log*.txt" -ErrorAction SilentlyContinue).Count
        "$logCount log file(s) found"
    } else { 
        "Not found at $logPath" 
    }
}

# Display Results
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   Test Results" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

$passed = 0
$failed = 0

foreach ($test in $allTests) {
    Write-TestResult -TestName $test.Name -Passed $test.Passed -Details $test.Details
    if ($test.Passed) { $passed++ } else { $failed++ }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($allTests.Count) | Passed: $passed | Failed: $failed" -ForegroundColor White
Write-Host "========================================`n" -ForegroundColor Cyan

if ($failed -eq 0) {
    Write-Host "✅ All tests passed! Application is working correctly.`n" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  $failed test(s) failed. Review the results above.`n" -ForegroundColor Yellow
    exit 1
}
