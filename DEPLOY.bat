@echo off
echo ============================================
echo    CRM UI - Quick Deploy to IIS
echo ============================================
echo.

REM Check if running as Administrator
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo Checking prerequisites...
powershell -ExecutionPolicy Bypass -File "%~dp0check-prerequisites.ps1"
if %errorlevel% neq 0 (
    echo.
    echo Prerequisites check failed. Please install missing components.
    pause
    exit /b 1
)

echo.
echo Starting deployment...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0deploy-iis.ps1"

echo.
echo ============================================
echo    Deployment Complete!
echo ============================================
echo.
pause
