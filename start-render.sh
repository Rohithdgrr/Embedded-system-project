#!/bin/bash
# Render deployment startup script

echo "Starting AI Detection Server on Render..."
echo "Port: $PORT"

# Run gunicorn with the Flask app
cd ai_backend
exec gunicorn -w 1 --threads 2 --timeout 120 -b 0.0.0.0:$PORT "src.detector:app"
