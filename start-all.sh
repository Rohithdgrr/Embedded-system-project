#!/bin/bash

echo ""
echo "=============================================="
echo "  ExamShield AI - Starting All Services"
echo "=============================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Starting services from: $SCRIPT_DIR"
echo ""

# Store PIDs for cleanup
PIDS=()

cleanup() {
    echo ""
    echo "Stopping all services..."
    for pid in "${PIDS[@]}"; do
        kill "$pid" 2>/dev/null
    done
    echo "All services stopped."
    exit 0
}

trap cleanup SIGINT SIGTERM

# ── 1. Backend (Spring Boot) ──────────────────────────
echo "[1/3] Starting Spring Boot Backend (Port 8080)..."
cd "$SCRIPT_DIR/backend"
if [ -f "mvnw" ]; then
    chmod +x mvnw
    ./mvnw clean spring-boot:run -DskipTests > "$SCRIPT_DIR/backend.log" 2>&1 &
else
    mvn clean spring-boot:run -DskipTests > "$SCRIPT_DIR/backend.log" 2>&1 &
fi
BACKEND_PID=$!
PIDS+=($BACKEND_PID)
echo "  -> PID: $BACKEND_PID | Log: backend.log"
echo ""

# Wait for backend to start
sleep 5

# ── 2. AI Server (Python + venv) ─────────────────────
echo "[2/3] Starting Python AI Server (Port 5000)..."
cd "$SCRIPT_DIR/ai_backend"

# Create venv if needed
if [ ! -d "venv" ]; then
    echo "  -> Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt --quiet
else
    source venv/bin/activate
fi

python3 src/detector.py > "$SCRIPT_DIR/ai.log" 2>&1 &
AI_PID=$!
PIDS+=($AI_PID)
echo "  -> PID: $AI_PID | Log: ai.log"
echo ""

# Wait for AI server
sleep 3

# ── 3. Frontend (Vite) ───────────────────────────────
echo "[3/3] Starting Vite Frontend (Port 5173)..."
cd "$SCRIPT_DIR"
npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
PIDS+=($FRONTEND_PID)
echo "  -> PID: $FRONTEND_PID | Log: frontend.log"
echo ""

# ── Summary ──────────────────────────────────────────
echo "=============================================="
echo "  All services started!"
echo "=============================================="
echo ""
echo "Access Points:"
echo "  Frontend:    http://localhost:5173"
echo "  Backend:     http://localhost:8080"
echo "  AI Server:   http://localhost:5000"
echo "  AI Health:   http://localhost:5000/health"
echo ""
echo "Login:"
echo "  Admin:        admin / admin"
echo "  Invigilator:  invigilator / invigi123"
echo ""
echo "Detection: Phone, Chit, Textbook, Notebook, Device"
echo ""
echo "Process IDs:"
echo "  Backend:   $BACKEND_PID"
echo "  AI:        $AI_PID"
echo "  Frontend:  $FRONTEND_PID"
echo ""
echo "To stop all: kill $BACKEND_PID $AI_PID $FRONTEND_PID"
echo "Or press Ctrl+C"
echo ""

# Monitor logs
tail -f "$SCRIPT_DIR/backend.log" "$SCRIPT_DIR/ai.log" "$SCRIPT_DIR/frontend.log" 2>/dev/null || wait
