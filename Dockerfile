FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY ai_backend/requirements.txt ./
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY ai_backend/ ./ai_backend/
COPY yolov8n.pt ./

# Set environment variables
ENV PYTHONUNBUFFERED=1
ENV FLASK_ENV=production
ENV PORT=8080

EXPOSE 8080

# Start the application
CMD ["gunicorn", "--workers", "1", "--threads", "1", "--timeout", "180", "--bind", "0.0.0.0:8080", "ai_backend.src.detector:app"]
