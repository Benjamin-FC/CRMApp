
# Start CRMWebSpa Backend and Frontend for Local Testing
# Usage: Run this script from the root of your solution folder

$backendPath = "C:\Users\BenjaminA\source\repos\CRMApp\CRMWebSpa.Server\CRMWebSpa.Server.csproj"
$frontendPath = "C:\Users\BenjaminA\source\repos\CRMApp\client"
$backendPort = 5037
$frontendPort = 5173

function Close-PortProcess {
	param([int]$Port)
	$connections = Get-NetTCPConnection -LocalPort $Port -ErrorAction SilentlyContinue | Where-Object { $_.State -eq 'Listen' -or $_.State -eq 'Established' }
	if ($connections) {
		$pids = $connections | Select-Object -ExpandProperty OwningProcess | Sort-Object -Unique
		foreach ($processId in $pids) {
			try {
				$proc = Get-Process -Id $processId -ErrorAction SilentlyContinue
				if ($proc) {
					Write-Host "Closing process $($proc.ProcessName) (PID $processId) on port $Port..." -ForegroundColor Yellow
					Stop-Process -Id $processId -Force
				}
			} catch {}
		}
	}
}

Write-Host "Checking and closing any process using backend port $backendPort..." -ForegroundColor Cyan
Close-PortProcess -Port $backendPort
Write-Host "Checking and closing any process using frontend port $frontendPort..." -ForegroundColor Cyan
Close-PortProcess -Port $frontendPort

Start-Sleep -Seconds 2

Write-Host "Starting backend (ASP.NET Core) on port $backendPort..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "dotnet run --urls http://localhost:$backendPort --project $backendPath" -WindowStyle Normal

Start-Sleep -Seconds 3



Write-Host "Starting frontend (Vite React) on port $frontendPort..." -ForegroundColor Cyan
Start-Process cmd.exe -ArgumentList "/k cd /d $frontendPath && npm run dev -- --port $frontendPort" -WindowStyle Normal

Write-Host "\nBoth backend and frontend are starting in new PowerShell windows." -ForegroundColor Green
Write-Host "Wait for both to finish starting, then open your browser to: http://localhost:$frontendPort/CRMUi/" -ForegroundColor Yellow
