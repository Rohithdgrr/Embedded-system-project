@echo off
title ExamShield AI - Service Manager
color 0B

echo.
echo  ============================================
echo    ExamShield AI - Starting All Services
echo  ============================================
echo.
echo  This will start 3 services:
echo    1. Spring Boot Backend  (Port 8080)
echo    2. Python AI Server     (Port 5000)
echo    3. Vite Frontend        (Port 5173)
echo.

:: ── 1. Backend (Spring Boot) ─────────────────────────
echo  [1/3] Starting Spring Boot Backend...
start "ExamShield - Backend (8080)" cmd /k "cd /d %~dp0backend && mvn clean spring-boot:run -DskipTests"
echo        ^> Window: "ExamShield - Backend (8080)"
echo.

:: Small delay so Maven init doesn't conflict
ping 127.0.0.1 -n 4 >nul

:: ── 2. AI Server (Python + venv) ─────────────────────
echo  [2/3] Starting Python AI Server...
cd /d "%~dp0ai_backend"
if not exist "venv" (
    echo        Creating Python virtual environment...
    python -m venv venv
)
start "ExamShield - AI Server (5000)" cmd /k "cd /d %~dp0ai_backend && call venv\Scripts\activate.bat && pip install -r requirements.txt --quiet 2>nul && python src\detector.py"
cd /d "%~dp0"
echo        ^> Window: "ExamShield - AI Server (5000)"
echo.

:: Small delay
ping 127.0.0.1 -n 3 >nul

:: ── 3. Frontend (Vite) ───────────────────────────────
echo  [3/3] Starting Vite Frontend...
start "ExamShield - Frontend (5173)" cmd /k "cd /d %~dp0 && npm run dev"
echo        ^> Window: "ExamShield - Frontend (5173)"
echo.

:: ── Summary ──────────────────────────────────────────
echo  ============================================
echo    All services started successfully!
echo  ============================================
echo.
echo  Access Points:
echo    Frontend:    http://localhost:5173
echo    Backend:     http://localhost:8080
echo    AI Server:   http://localhost:5000
echo.
echo  Login:
echo    Admin:        admin / admin
echo    Invigilator:  invigilator / invigi123
echo.
echo  Detection Classes (5):
echo    Phone, Chit, Textbook, Notebook, Device
echo.
echo  Close individual windows to stop each service.
echo  Press any key to close this launcher...
pause >nul
