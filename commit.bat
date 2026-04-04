@echo off
setlocal enabledelayedexpansion

echo.
echo ================================================
echo   VICTORY.DOCS - Auto Commit and Deploy Tool
echo ================================================
echo.

:: Cek ada perubahan tidak
git diff --quiet 2>nul
git diff --cached --quiet 2>nul
git status --short > "%TEMP%\gitstatus.txt" 2>&1
set SIZE=0
for %%F in ("%TEMP%\gitstatus.txt") do set SIZE=%%~zF
if %SIZE%==0 (
    echo [!] Tidak ada perubahan yang perlu di-commit.
    echo.
    del "%TEMP%\gitstatus.txt" 2>nul
    pause
    exit /b 0
)

echo [i] File yang akan dikirim:
echo ------------------------------------------------
type "%TEMP%\gitstatus.txt"
del "%TEMP%\gitstatus.txt" 2>nul
echo ------------------------------------------------
echo.

:: Input pesan commit
set "COMMIT_MSG="
set /p "COMMIT_MSG=Pesan commit (kosongkan untuk otomatis): "

:: Jika kosong, buat timestamp otomatis
if "!COMMIT_MSG!"=="" (
    set "COMMIT_MSG=update: %date% %time:~0,5%"
)

echo.
echo [1/3] Menambahkan semua file...
git add .

echo [2/3] Menyimpan commit: !COMMIT_MSG!
git commit -m "!COMMIT_MSG!"
if errorlevel 1 (
    echo.
    echo [ERROR] Commit gagal!
    pause
    exit /b 1
)

echo [3/3] Mengirim ke GitHub...
git push origin main
if errorlevel 1 (
    echo.
    echo [ERROR] Push gagal! Cek koneksi atau login GitHub.
    pause
    exit /b 1
)

echo.
echo ================================================
echo   SUKSES! Perubahan terkirim ke GitHub.
echo   Vercel akan auto-deploy dalam 1-2 menit.
echo ================================================
echo.
echo   Web  : https://docs-academy.vercel.app
echo   Repo : https://github.com/stiperawang-beep/docs-academy
echo.
pause
