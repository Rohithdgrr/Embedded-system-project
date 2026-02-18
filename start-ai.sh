#!/bin/bash

echo ""
echo "=============================================="
echo "  ExamShield AI - Python AI Server"
echo "=============================================="
echo ""

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/ai_backend"

# Setup venv if needed
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    source venv/bin/activate
    echo "Installing dependencies..."
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

echo "Access:  http://localhost:5000"
echo "Health:  http://localhost:5000/health"
echo ""
echo "Detection: Phone, Chit, Textbook, Notebook, Device"
echo ""

python3 src/detector.py
