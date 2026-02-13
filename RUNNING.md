# ExamShield AI

## Quick Start

### Prerequisites
- Java 17+
- Node.js 18+
- Python 3.9+
- Maven 3.8+

### Installation & Running

#### Option 1: Run All Services (Windows)
```bash
start-all.bat
```

#### Option 2: Run Manually

**1. Start Backend (Spring Boot)**
```bash
cd backend
mvn spring-boot:run
```

**2. Start AI Server (Python)**
```bash
cd ai_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python src/detector.py
```

**3. Start Frontend**
```bash
npm run dev
```

### Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **AI Server**: http://localhost:5000

## System Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   Spring Boot    │────▶│   SQLite DB     │
│   (React+Vite) │     │   (Java 17)      │     │                 │
└────────┬────────┘     └────────┬─────────┘     └─────────────────┘
         │                       │
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │  Python AI      │
         │              │  YOLOv8+        │
         │              │  MediaPipe      │
         └─────────────▶│  (Port 5000)    │
                        └──────────────────┘
```

## Features
- Live camera monitoring via IP Webcam
- Video upload & analysis
- Real-time detection with WebSocket
- Prohibited item detection (phones, earphones, etc.)
- Head pose estimation
- Behavior analysis
- Session reports

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create exam session |
| GET | `/api/sessions` | List all sessions |
| POST | `/api/sessions/{id}/start` | Start session |
| POST | `/api/detect/stream` | Start live stream |
| POST | `/api/detect/video` | Upload video |
| GET | `/api/reports/{id}` | Get session report |

## Configuration

Edit `backend/src/main/resources/application.properties` to customize:
- Server port
- Database location
- Upload directories
- Detection settings
