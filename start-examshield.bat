@echo off
title ExamShield AI - Quick Start
color 0A

echo.
echo  ============================================
echo    ExamShield AI - Quick Start
echo  ============================================
echo.
echo  Starting all 3 services with health checks...
echo.

:: ── 1. Backend ───────────────────────────────────────
echo  [1/3] Starting Spring Boot Backend (Port 8080)...
start "Backend - Port 8080" cmd /k "cd /d %~dp0backend && mvn clean spring-boot:run -DskipTests"
echo        Started in new window.
echo.

:: Wait for backend to initialize
echo        Waiting for backend to initialize...
ping 127.0.0.1 -n 5 >nul

:: ── 2. AI Server ─────────────────────────────────────
echo  [2/3] Starting Python AI Server (Port 5000)...
cd /d "%~dp0ai_backend"
if not exist "venv" (
    echo        Creating virtual environment...
    python -m venv venv
    echo        Installing dependencies...
    call venv\Scripts\activate.bat
    pip install -r requirements.txt --quiet
) else (
    call venv\Scripts\activate.bat
)
start "AI Server - Port 5000" cmd /k "cd /d %~dp0ai_backend && call venv\Scripts\activate.bat && python src\detector.py"
cd /d "%~dp0"
echo        Started in new window.
echo.

:: Wait for AI server
echo        Waiting for AI server to initialize...
ping 127.0.0.1 -n 4 >nul

:: ── 3. Frontend ──────────────────────────────────────
echo  [3/3] Starting Vite Frontend (Port 5173)...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0 && npm run dev"
echo        Started in new window.
echo.

:: ── Done ─────────────────────────────────────────────
echo  ============================================
echo    All services launched!
echo  ============================================
echo.
echo  URLs:
echo    Frontend:    http://localhost:5173
echo    Backend:     http://localhost:8080
echo    AI Server:   http://localhost:5000
echo    AI Health:   http://localhost:5000/health
echo.
echo  Login Credentials:
echo    Admin:        admin / admin
echo    Invigilator:  invigilator / invigi123
echo.
echo  Close the individual windows to stop services.
echo.
pause
