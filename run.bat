# ExamShield AI - Run All Services

echo "=============================================="
echo "  ExamShield AI - Starting All Services"
echo "=============================================="

# Check if Java is installed
if ! command -v java &> /dev/null; then
    echo "Error: Java not found. Please install Java 17+"
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python not found. Please install Python 3.9+"
    exit 1
fi

# Function to check if port is in use
check_port() {
    if command -v lsof &> /dev/null; then
        lsof -i:$1 &> /dev/null
    elif command -v netstat &> /dev/null; then
        netstat -an | grep $1 &> /dev/null
    else
        # Default to assuming port is free
        return 1
    fi
}

# Start Backend (Spring Boot)
start_backend() {
    echo ""
    echo "[1/3] Starting Spring Boot Backend on port 8080..."
    
    cd backend
    
    if [ -f "mvnw" ]; then
        ./mvnw spring-boot:run -DskipTests &
    else
        mvn spring-boot:run -DskipTests &
    fi
    
    cd ..
    echo "Backend starting in background..."
}

# Start AI Detection Server (Python)
start_ai_server() {
    echo ""
    echo "[2/3] Starting AI Detection Server on port 5000..."
    
    cd ai_backend
    
    # Install dependencies if needed
    if [ ! -d "venv" ]; then
        echo "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt 2>/dev/null
    
    python3 src/detector.py &
    
    cd ..
    echo "AI Server starting in background..."
}

# Start Frontend (Vite)
start_frontend() {
    echo ""
    echo "[3/3] Starting Frontend on port 5173..."
    
    npm run dev &
    
    echo "Frontend starting in background..."
}

# Main
echo ""
echo "Starting services..."
echo ""

# Start all services
start_backend
start_ai_server  
start_frontend

echo ""
echo "=============================================="
echo "  All services started!"
echo "=============================================="
echo ""
echo "Services:"
echo "  - Frontend:    http://localhost:5173"
echo "  - Backend:     http://localhost:8080"
echo "  - AI Server:   http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
