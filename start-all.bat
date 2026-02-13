@echo off
echo ==============================================
echo   ExamShield AI - Starting All Services
echo ==============================================

echo.
echo [1/3] Starting Spring Boot Backend on port 8080...
cd /d "%~dp0backend"
start "Backend" cmd /c "mvn spring-boot:run -DskipTests"
cd /d "%~dp0"

echo.
echo [2/3] Starting AI Detection Server on port 5000...
cd /d "%~dp0ai_backend"
if not exist "venv" (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt 2>nul
start "AI-Server" cmd /c "python src\detector.py"
cd /d "%~dp0"

echo.
echo [3/3] Starting Frontend on port 5173...
start "Frontend" cmd /c "npm run dev"

echo.
echo ==============================================
echo   All services started!
echo ==============================================
echo.
echo Services:
echo   - Frontend:    http://localhost:5173
echo   - Backend:     http://localhost:8080
echo   - AI Server:   http://localhost:5000
echo.
echo Press any key to exit (services will keep running)...
pause >nul
