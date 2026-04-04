@echo off
setlocal EnableDelayedExpansion

cd /d "%~dp0"

echo.
echo ==============================================
echo   victory.docs - Launch Script
echo ==============================================
echo.

:: ---- STEP 1: Check Node.js ----
echo [1/5] Checking Node.js...
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found.
    echo Please install from: https://nodejs.org
    pause
    exit /b 1
)
echo OK: Node.js found.

:: ---- STEP 2: Install dependencies ----
echo.
echo [2/5] Checking node_modules...
if not exist "node_modules" (
    echo Installing dependencies... please wait...
    npm install
    if errorlevel 1 (
        echo ERROR: npm install failed.
        pause
        exit /b 1
    )
    echo OK: Installed.
) else (
    echo OK: Already installed.
)

:: ---- STEP 3: Setup ngrok ----
echo.
echo [3/5] Setting up ngrok...

set NGROK_EXE=

where ngrok >nul 2>&1
if not errorlevel 1 (
    set NGROK_EXE=ngrok
    echo OK: ngrok found in PATH.
    goto ngrok_ready
)

if exist "%~dp0tools\ngrok\ngrok.exe" (
    set NGROK_EXE=%~dp0tools\ngrok\ngrok.exe
    echo OK: ngrok found in tools folder.
    goto ngrok_ready
)

echo INFO: ngrok not found. Downloading...
if not exist "%~dp0tools\ngrok" mkdir "%~dp0tools\ngrok"

powershell -NoProfile -ExecutionPolicy Bypass -Command "Invoke-WebRequest -Uri 'https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip' -OutFile '%~dp0tools\ngrok\ngrok.zip' -UseBasicParsing"
if errorlevel 1 goto ngrok_fail

powershell -NoProfile -ExecutionPolicy Bypass -Command "Expand-Archive -Path '%~dp0tools\ngrok\ngrok.zip' -DestinationPath '%~dp0tools\ngrok' -Force"
del "%~dp0tools\ngrok\ngrok.zip" >nul 2>&1

if exist "%~dp0tools\ngrok\ngrok.exe" (
    set NGROK_EXE=%~dp0tools\ngrok\ngrok.exe
    echo OK: ngrok downloaded.
    goto ngrok_ready
)

:ngrok_fail
echo WARN: Could not get ngrok. Will run locally only.
set NGROK_EXE=
goto start_server

:ngrok_ready
"%NGROK_EXE%" config add-authtoken 2wGYKA6kbVkUkDjjRdEzxK5BPMW_5Br3voaCHN6ab2QevcXfu >nul 2>&1
echo OK: ngrok token configured.

:: ---- STEP 4: Start Next.js server ----
:start_server
echo.
echo [4/5] Starting Next.js dev server...

for /f "tokens=5" %%P in ('netstat -aon 2^>nul ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /f /pid %%P >nul 2>&1
)

start "victory.docs Server" cmd /k "npm run dev"

echo INFO: Waiting for server to be ready...
set TRIES=0

:wait_loop
set /a TRIES+=1
if !TRIES! gtr 24 (
    echo ERROR: Server did not start after 2 minutes.
    echo        Check the "victory.docs Server" window for errors.
    pause
    exit /b 1
)
timeout /t 5 /nobreak >nul
curl -sf http://localhost:3000 -o nul 2>&1
if errorlevel 1 (
    echo        Waiting... !TRIES!/24
    goto wait_loop
)
echo OK: Server is ready at http://localhost:3000

:: ---- STEP 5: Start ngrok ----
echo.
echo [5/5] Starting ngrok tunnel...

if "!NGROK_EXE!"=="" goto show_local

taskkill /f /im ngrok.exe >nul 2>&1
timeout /t 1 /nobreak >nul

start "ngrok" /min "!NGROK_EXE!" http 3000

echo INFO: Waiting 8 seconds for tunnel...
timeout /t 8 /nobreak >nul

:: Get ngrok URL - write to temp file then read
powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "try { (Invoke-RestMethod 'http://localhost:4040/api/tunnels').tunnels | Where-Object { $_.proto -eq 'https' } | Select-Object -First 1 -ExpandProperty public_url } catch { '' }" ^
    > "%TEMP%\vd_ngrok_url.txt" 2>nul

set PUBLIC_URL=
set /p PUBLIC_URL= < "%TEMP%\vd_ngrok_url.txt"
del "%TEMP%\vd_ngrok_url.txt" >nul 2>&1

:: Remove any trailing whitespace/newline from URL
set PUBLIC_URL=!PUBLIC_URL: =!

goto show_result

:show_local
set PUBLIC_URL=

:show_result
echo.
echo ==============================================
echo   victory.docs is LIVE!
echo ==============================================
echo.
echo   Local  : http://localhost:3000
if not "!PUBLIC_URL!"=="" (
    echo   Public : !PUBLIC_URL!
    echo   ngrok  : http://localhost:4040
    echo.
    echo   Share the PUBLIC URL with anyone online!
) else (
    echo   Public : Open http://localhost:4040 to see ngrok URL
    echo            (or ngrok was not available)
)
echo.
echo   Close the "victory.docs Server" window to stop the app.
echo   Press any key here to stop ngrok tunnel only.
echo ==============================================
echo.

start "" http://localhost:3000
timeout /t 2 /nobreak >nul
if not "!PUBLIC_URL!"=="" start "" !PUBLIC_URL!
timeout /t 1 /nobreak >nul
if not "!NGROK_EXE!"=="" start "" http://localhost:4040

pause >nul

if not "!NGROK_EXE!"=="" (
    taskkill /f /im ngrok.exe >nul 2>&1
    echo OK: ngrok stopped.
)

echo.
echo The app server is still running in the "victory.docs Server" window.
echo Close that window to fully stop the app.
echo.
pause
exit /b 0
