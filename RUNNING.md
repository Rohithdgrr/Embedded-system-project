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

### Login Credentials
| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin |
| Invigilator | invigilator | invigi123 |

---

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
                                │
                                ▼
                       ┌──────────────────┐
                       │  Brevo Email API │
                       │  (SMTP/API)      │
                       └──────────────────┘
```

---

## Features

### 🎥 Live Monitoring (Admin)
- Live camera monitoring via IP Webcam / DroidCam / built-in camera
- Real-time AI object detection using YOLOv8
- Head pose estimation with MediaPipe
- Live detection stats panel with head count
- Integrity score tracking

### 🔍 AI Detection (5 Classes)
| # | Violation | Points | Icon |
|---|-----------|--------|------|
| 1 | Mobile Phone | 30 | 📱 |
| 2 | Chit / Paper Slip | 25 | 📝 |
| 3 | Textbook | 30 | 📖 |
| 4 | Notebook | 25 | 📓 |
| 5 | Electronic Device | 20 | 💻 |

> **Note:** Earphone and smart watch detection have been intentionally removed from the system due to high false-positive rates with COCO-based YOLO detection.

### 🔄 Behavioral Analysis
- Head turning detection
- Leaning / looking down detection
- Multiple people in frame
- No person detected (empty seat)

### 👁️ Invigilator Portal
- **Live violation feed** — Every violation appears instantly with type, seat, confidence, and severity points
- **Evidence screenshots** — Each alert shows a captured frame as proof; expandable for fullscreen view
- **Violation filtering** — Filter by type or show only alerts with screenshot evidence
- **Seat summary** — Grouped view showing total violation points per seat
- **Comprehensive email report** — Sends ONE email with ALL violations including:
  - Summary stats (total violations, severity points, seats flagged, high severity count)
  - Violation type breakdown badges
  - Complete violation log table (type, seat, level, confidence, points, time, context)
  - Per-seat breakdown with total points
- **Threshold-based auto-send** — Email report auto-sends when violation points exceed 50
- **Manual send** — "Send Report" button for on-demand email reports

### 📊 Reports & History
- Session history with violation breakdowns
- Detection type distribution charts (donut + line)
- Stats summary: phones, chits, books, devices
- Session detail modal with evidence gallery

### 📧 Email Notifications (Brevo API)
- Comprehensive HTML email reports
- Professional table layout with all violations
- Per-seat violation summaries
- Browser notification fallback
- Configurable sender via `BREVO_SENDER_EMAIL`

---

## Detection Point System

| Violation Type | Severity Points |
|----------------|----------------|
| Phone detected | 30 |
| Chit/slip detected | 25 |
| Textbook detected | 30 |
| Notebook detected | 25 |
| Electronic device | 20 |
| Head turn (sustained) | 10 |
| Looking down | 8 |
| Multiple people | 15 |
| No person | 10 |

**Email Threshold:** 50 points (configurable in `views/InvigilatorView.tsx`)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/sessions` | Create exam session |
| GET | `/api/sessions` | List all sessions |
| POST | `/api/sessions/{id}/start` | Start session |
| POST | `/api/detect/stream` | Start live stream |
| POST | `/api/detect/video` | Upload video |
| GET | `/api/reports/{id}` | Get session report |
| POST | `/api/notifications/send` | Send email notification |

---

## Project Structure

```
proctorclay-ai/
├── ai_backend/              # Python AI server
│   ├── src/
│   │   └── detector.py      # YOLOv8 + MediaPipe detection engine
│   ├── venv/                # Python virtual environment
│   └── requirements.txt     # Python dependencies
│
├── backend/                 # Spring Boot Java backend
│   └── src/main/java/com/examshield/
│       ├── controller/      # REST API controllers
│       ├── service/         # Business logic + email
│       └── model/           # Data models
│
├── frontend/                # Frontend AI service layer
│   └── services/
│       └── aiService.ts     # AI backend API client + scoring
│
├── views/                   # Main page components
│   ├── LiveMonitorView.tsx  # Admin live monitoring
│   ├── InvigilatorView.tsx  # Invigilator portal
│   └── ReportsView.tsx      # Reports & history
│
├── components/              # Reusable UI components
│   ├── live/                # Live monitoring components
│   ├── reports/             # Report components
│   ├── upload/              # Video upload components
│   ├── LiveMonitoring.tsx   # Camera feed + AI processing
│   ├── Header.tsx           # App header
│   ├── Navigation.tsx       # Tab navigation
│   ├── Login.tsx            # Login page
│   ├── ClayCard.tsx         # Claymorphism card
│   └── ClayButton.tsx       # Claymorphism button
│
├── services/                # Frontend services
│   ├── notificationService.ts  # Email + browser notifications
│   └── geminiService.ts     # Gemini AI integration
│
├── types.ts                 # TypeScript type definitions
├── App.tsx                  # Root application component
├── index.css                # Global styles + claymorphism
├── start-all.bat            # Windows startup script
├── README.md                # Full project documentation
└── RUNNING.md               # This file
```

---

## Configuration

### Environment Variables
| Variable | Description | Default |
|----------|-------------|---------|
| `BREVO_API_KEY` | Brevo email API key | Set in notificationService.ts |
| `BREVO_SENDER_EMAIL` | Verified sender email | rreon633@gmail.com |
| `VITE_AI_BACKEND_URL` | AI server URL | http://localhost:5000 |

### Application Properties
Edit `backend/src/main/resources/application.properties` to customize:
- Server port
- Database location
- Upload directories
- Detection settings

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Vanilla CSS (Claymorphism theme) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Plus Jakarta Sans, Inter, JetBrains Mono |
| Backend | Spring Boot 3 (Java 17) |
| Database | SQLite |
| AI Server | Python Flask |
| Object Detection | YOLOv8 (Ultralytics) |
| Pose Estimation | MediaPipe |
| Email | Brevo (Sendinblue) API |
