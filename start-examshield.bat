@echo off
echo ==============================================
echo   ExamShield AI - Starting All Services
echo ==============================================
echo.
echo This will start 3 services:
echo   1. Spring Boot Backend (Port 8080)
echo   2. Python AI Server (Port 5000)
echo   3. Vite Frontend (Port 5173)
echo.
echo Press any key to start...
pause >nul
echo.

:: Start Backend
echo [1/3] Starting Spring Boot Backend...
start "Backend - Port 8080" cmd /k "cd /d %~dp0backend && call mvn spring-boot:run -DskipTests"
echo Backend starting... (Window: Backend - Port 8080)
echo.

:: Wait a bit
ping 127.0.0.1 -n 3 >nul

:: Start AI Server
echo [2/3] Starting Python AI Server...
start "AI Server - Port 5000" cmd /k "cd /d %~dp0ai_backend && python src/detector.py"
echo AI Server starting... (Window: AI Server - Port 5000)
echo.

:: Wait a bit
ping 127.0.0.1 -n 3 >nul

:: Start Frontend
echo [3/3] Starting Vite Frontend...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0 && npm run dev"
echo Frontend starting... (Window: Frontend - Port 5173)
echo.

echo ==============================================
echo   All services started!
echo ==============================================
echo.
echo Services will be available at:
echo   Frontend:  http://localhost:5173
echo   Backend:   http://localhost:8080
echo   AI Server: http://localhost:5000
echo.
echo Close the individual windows to stop each service.
echo.
pause
