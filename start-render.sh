#!/bin/bash
# Render deployment startup script

echo "Starting AI Detection Server on Render..."
echo "Port: $PORT"

# Run gunicorn with the Flask app
cd ai_backend
exec gunicorn -w 2 -b 0.0.0.0:$PORT "src.detector:app"
