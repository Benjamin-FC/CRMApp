@echo off
REM Quick Deploy - Build and Deploy CRMWebSpa to IIS
REM This will automatically request admin privileges

echo.
echo ========================================
echo   CRM WebSpa - Build and Deploy
echo ========================================
echo.

REM Check for admin privileges
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo Requesting Administrator privileges...
    powershell -Command "Start-Process cmd -ArgumentList '/c cd /d %CD% && %~f0' -Verb RunAs"
    exit /b
)

echo Running deployment script...
echo.

powershell -ExecutionPolicy Bypass -File "%~dp0build-and-deploy.ps1"

echo.
pause
