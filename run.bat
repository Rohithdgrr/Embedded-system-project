@echo off
title ExamShield AI - Run All
color 0E

echo.
echo  ============================================
echo    ExamShield AI - Run All Services
echo  ============================================
echo.

:: Check prerequisites
where java >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Java not found. Please install Java 17+
    pause
    exit /b 1
)

where python >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Python not found. Please install Python 3.9+
    pause
    exit /b 1
)

where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo  [ERROR] Node.js not found. Please install Node.js 18+
    pause
    exit /b 1
)

echo  Prerequisites OK: Java, Python, Node.js found.
echo.

:: ── 1. Backend ───────────────────────────────────────
echo  [1/3] Starting Spring Boot Backend (Port 8080)...
start "ExamShield Backend" cmd /k "cd /d %~dp0backend && mvn clean spring-boot:run -DskipTests"
ping 127.0.0.1 -n 5 >nul

:: ── 2. AI Server ─────────────────────────────────────
echo  [2/3] Starting Python AI Server (Port 5000)...
cd /d "%~dp0ai_backend"
if not exist "venv" (
    echo        Setting up Python venv...
    python -m venv venv
    call venv\Scripts\activate.bat
    pip install -r requirements.txt
) 
start "ExamShield AI" cmd /k "cd /d %~dp0ai_backend && call venv\Scripts\activate.bat && python src\detector.py"
cd /d "%~dp0"
ping 127.0.0.1 -n 4 >nul

:: ── 3. Frontend ──────────────────────────────────────
echo  [3/3] Starting Vite Frontend (Port 5173)...
start "ExamShield Frontend" cmd /k "cd /d %~dp0 && npm run dev"

:: ── Summary ──────────────────────────────────────────
echo.
echo  ============================================
echo    All services started!
echo  ============================================
echo.
echo  Access Points:
echo    Frontend:    http://localhost:5173
echo    Backend API: http://localhost:8080
echo    AI Server:   http://localhost:5000
echo    AI Health:   http://localhost:5000/health
echo.
echo  Login:
echo    Admin:        admin / admin
echo    Invigilator:  invigilator / invigi123
echo.
echo  AI Detection Classes:
echo    Phone, Chit, Textbook, Notebook, Device
echo.
echo  Notification Threshold: 50 points
echo.
echo  Press any key to close this launcher...
pause >nul
