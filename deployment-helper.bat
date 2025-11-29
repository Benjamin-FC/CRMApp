@echo off
echo ============================================
echo    CRM UI - Deployment Helper
echo ============================================
echo.
echo Select an option:
echo.
echo 1. Check Prerequisites
echo 2. Build Only (No Deploy)
echo 3. Deploy to IIS
echo 4. Undeploy from IIS
echo 5. Undeploy and Delete Files
echo 6. Update Configuration
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" goto check_prereq
if "%choice%"=="2" goto build_only
if "%choice%"=="3" goto deploy
if "%choice%"=="4" goto undeploy
if "%choice%"=="5" goto undeploy_delete
if "%choice%"=="6" goto update_config
if "%choice%"=="7" goto exit
goto invalid

:check_prereq
echo.
echo Running prerequisite check...
powershell -ExecutionPolicy Bypass -File "%~dp0check-prerequisites.ps1"
goto end

:build_only
echo.
echo Building application...
powershell -ExecutionPolicy Bypass -File "%~dp0build-only.ps1"
goto end

:deploy
echo.
echo Checking if running as Administrator...
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as Administrator"
    goto end
)
echo.
echo Starting deployment...
powershell -ExecutionPolicy Bypass -File "%~dp0deploy-iis.ps1"
goto end

:undeploy
echo.
echo Checking if running as Administrator...
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as Administrator"
    goto end
)
echo.
echo Undeploying from IIS...
powershell -ExecutionPolicy Bypass -File "%~dp0undeploy-iis.ps1"
goto end

:undeploy_delete
echo.
echo Checking if running as Administrator...
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: This script must be run as Administrator!
    echo Right-click and select "Run as Administrator"
    goto end
)
echo.
echo Undeploying from IIS and deleting files...
powershell -ExecutionPolicy Bypass -File "%~dp0undeploy-iis.ps1" -DeleteFiles
goto end

:update_config
echo.
echo Select environment:
echo 1. Development
echo 2. Staging
echo 3. Production
echo.
set /p env_choice="Enter choice (1-3): "

if "%env_choice%"=="1" set env=Development
if "%env_choice%"=="2" set env=Staging
if "%env_choice%"=="3" set env=Production

if not defined env (
    echo Invalid choice!
    goto end
)

echo.
set /p backend_url="Enter CRM Backend URL (or press Enter to skip): "
set /p token_url="Enter Token Endpoint URL (or press Enter to skip): "

set params=-Environment %env%
if not "%backend_url%"=="" set params=%params% -CRMBackendUrl "%backend_url%"
if not "%token_url%"=="" set params=%params% -TokenEndpoint "%token_url%"

powershell -ExecutionPolicy Bypass -File "%~dp0update-appsettings.ps1" %params%
goto end

:invalid
echo.
echo Invalid choice! Please select 1-7.
goto end

:exit
exit /b 0

:end
echo.
echo ============================================
echo    Operation Complete
echo ============================================
echo.
pause
