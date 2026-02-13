#!/bin/bash
cd "$(dirname "$0")/ai_backend"
echo "Starting Python AI Server..."
echo "Access: http://localhost:5000"
echo "Health: http://localhost:5000/health"
echo ""
python src/detector.py
