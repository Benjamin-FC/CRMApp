# Build Only Script - Builds both frontend and backend without deploying

Write-Host "Starting CRM UI Build..." -ForegroundColor Green

# Build the backend
Write-Host "`n=== Building Backend ===" -ForegroundColor Green
Push-Location "$PSScriptRoot\CRMWebSpa.Server"
dotnet clean
dotnet build -c Release
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

Write-Host "`n============================================" -ForegroundColor Green
Write-Host "   BUILD COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host "`nBuild outputs:" -ForegroundColor Cyan
Write-Host "  Backend:  $PSScriptRoot\CRMWebSpa.Server\bin\Release\net8.0" -ForegroundColor White
Write-Host "  Frontend: $PSScriptRoot\client\dist" -ForegroundColor White
Write-Host "`n============================================`n" -ForegroundColor Green
