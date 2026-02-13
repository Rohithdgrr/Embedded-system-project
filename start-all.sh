#!/bin/bash

echo "=============================================="
echo "  ExamShield AI - Starting All Services"
echo "=============================================="
echo ""

# Get the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Starting services from: $SCRIPT_DIR"
echo ""

# Function to start a service in a new terminal
start_service() {
    local name=$1
    local dir=$2
    local cmd=$3
    
    echo "[$name] Starting..."
    
    # Try to use different terminal emulators
    if command -v mintty &> /dev/null; then
        mintty -w normal -t "$name" bash -c "cd '$dir' && $cmd; echo ''; echo 'Press Enter to close...'; read" &
    elif command -v gnome-terminal &> /dev/null; then
        gnome-terminal --title="$name" -- bash -c "cd '$dir' && $cmd; echo ''; echo 'Press Enter to close...'; read" &
    elif command -v xterm &> /dev/null; then
        xterm -T "$name" -e bash -c "cd '$dir' && $cmd; echo ''; echo 'Press Enter to close...'; read" &
    else
        # Fallback: run in background with logging
        echo "  -> Running in background (check ${name,,}.log)"
        (cd "$dir" && $cmd) > "$SCRIPT_DIR/${name,,}.log" 2>&1 &
    fi
}

# Start Backend
echo "[1/3] Starting Spring Boot Backend on port 8080..."
cd "$SCRIPT_DIR/backend"
mvn spring-boot:run -DskipTests > "$SCRIPT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
echo "  -> Backend PID: $BACKEND_PID"
echo "  -> Log: backend.log"
echo ""

# Wait a moment
sleep 3

# Start AI Server
echo "[2/3] Starting Python AI Server on port 5000..."
cd "$SCRIPT_DIR/ai_backend"
python src/detector.py > "$SCRIPT_DIR/ai.log" 2>&1 &
AI_PID=$!
echo "  -> AI Server PID: $AI_PID"
echo "  -> Log: ai.log"
echo ""

# Wait a moment
sleep 3

# Start Frontend
echo "[3/3] Starting Vite Frontend on port 5173..."
cd "$SCRIPT_DIR"
npm run dev > "$SCRIPT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
echo "  -> Frontend PID: $FRONTEND_PID"
echo "  -> Log: frontend.log"
echo ""

echo "=============================================="
echo "  All services started!"
echo "=============================================="
echo ""
echo "Services:"
echo "  Frontend:    http://localhost:5173"
echo "  Backend:     http://localhost:8080"
echo "  AI Server:   http://localhost:5000"
echo ""
echo "Process IDs:"
echo "  Backend:   $BACKEND_PID"
echo "  AI:        $AI_PID"
echo "  Frontend:  $FRONTEND_PID"
echo ""
echo "To stop all services, run:"
echo "  kill $BACKEND_PID $AI_PID $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to exit this monitor (services will keep running)"
echo ""

# Monitor logs
tail -f "$SCRIPT_DIR/backend.log" "$SCRIPT_DIR/ai.log" "$SCRIPT_DIR/frontend.log" 2>/dev/null || wait
