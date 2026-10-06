@echo off
title SecureBank YONO Banking Platform Launcher
echo ========================================================
echo         SecureBank Digital Banking Platform
echo ========================================================
echo.

echo [1/3] Checking MongoDB Service...
sc query MongoDB | findstr /i "RUNNING" >nul
if %errorlevel% neq 0 (
    echo [INFO] Starting MongoDB service...
    net start MongoDB >nul 2>&1
)

echo [2/3] Starting Backend API Server on Port 5000...
start "SecureBank Backend Server (Port 5000)" cmd /k "cd /d "%~dp0server" && npm run dev"

timeout /t 3 /nobreak >nul

echo [3/3] Starting Frontend React + Vite on Port 5173...
start "SecureBank Frontend Client (Port 5173)" cmd /k "cd /d "%~dp0client" && npm run dev"

timeout /t 2 /nobreak >nul

echo.
echo ========================================================
echo Project successfully launched!
echo.
echo Frontend URL : http://localhost:5173
echo Backend API  : http://localhost:5000
echo.
echo Sample Accounts:
echo - Customer: rahul.sharma@example.com / User@123 (T-PIN: 1234)
echo - Customer: priya.patel@example.com / User@123 (T-PIN: 1234)
echo - Admin:    admin@sbi.com / Admin@123
echo ========================================================
echo.
echo Opening browser at http://localhost:5173 ...
start http://localhost:5173
echo.
pause
