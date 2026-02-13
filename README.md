embedded system project. 



# 🎓 ExamShield AI — Revised Project Plan

## Smart Examination Integrity System

### Embedded System + AI/ML + Web Platform

---

---

---

# 📋 SECTION 1: REVISED PROBLEM STATEMENT

---

```
TITLE:
"Design and Development of an AI-Powered Smart
 Examination Integrity System Using Embedded Camera
 Processing, Mobile Integration, and a Minimal
 Web-Based Monitoring Platform for Automated
 Malpractice Detection in Educational Institutions"
```

---

## 1.1 What We Removed

```
REMOVED FROM ORIGINAL PLAN:
═══════════════════════════

✗ All IoT sensor nodes (ESP32 + sensors)
✗ PIR motion sensors
✗ Sound sensors
✗ Vibration sensors
✗ IR proximity sensors
✗ Bluetooth scanners
✗ RF signal detectors
✗ Temperature/humidity sensors
✗ Light sensors
✗ RFID readers and cards
✗ Ultrasonic counters
✗ Door sensors
✗ Panic buttons
✗ LED indicator strips
✗ Buzzer modules
✗ ESP32-CAM modules
✗ MQTT broker and protocol
✗ Sensor fusion engine
✗ All IoT-related firmware
✗ All IoT node assembly
✗ All sensor calibration
✗ All IoT deployment steps
```

---

## 1.2 What We Keep and Focus On

```
RETAINED AND ENHANCED:
══════════════════════

✓ AI/ML Computer Vision (Core)
✓ YOLOv8 Object Detection
✓ MediaPipe Head Pose Estimation
✓ ByteTrack Person Tracking
✓ Video Upload Processing
✓ Mobile Camera Live Connection
✓ Embedded System Camera Processing
✓ Point-Based Scoring Engine
✓ Web Dashboard (3 Pages Only)
✓ Claymorphism Light Theme Design
✓ Mobile + Laptop Responsive
✓ Commercial Grade UI/UX
✓ Phase-Wise Detection
✓ Head Count Feature
✓ Prohibited Item Detection
```

---

---

---

# 📋 SECTION 2: REVISED ABSTRACT

---

```
This project presents the design and implementation
of an AI-Powered Smart Examination Integrity System
that uses Computer Vision and Deep Learning running
on an embedded processing unit combined with a
minimal three-page web-based monitoring platform
to automate detection and prevention of examination
malpractice.

The system accepts video input through TWO methods:

  METHOD 1: MOBILE CAMERA CONNECTION
  - Invigilator connects their smartphone camera
  - Phone acts as a wireless IP camera
  - Live video streams to the processing server
  - Real-time AI analysis on live feed

  METHOD 2: VIDEO UPLOAD
  - Pre-recorded examination footage uploaded
  - Batch AI processing on uploaded video
  - Post-exam analysis and report generation
  - Evidence extraction from recordings

The AI engine uses YOLOv8 for detecting persons
and prohibited objects (phones, earphones, smart
watches, chits, slips, textbooks, notebooks),
MediaPipe for head pose and body posture analysis,
and ByteTrack for persistent multi-person tracking
enabling individual student monitoring throughout
the examination.

Detection operates in THREE PHASES:

  PHASE 1: HEAD COUNT
  - Automatic counting of students present
  - Comparison with expected attendance
  - Seat occupancy mapping
  - Entry/exit tracking

  PHASE 2: BEHAVIOR ANALYSIS
  - Head movement pattern detection
  - Suspicious posture identification
  - Student interaction detection
  - Gaze direction analysis

  PHASE 3: PROHIBITED ITEM DETECTION
  - Mobile phones (in hand, on desk, hidden)
  - Earphones and earbuds (wired/wireless)
  - Smart watches
  - Chits and paper slips
  - Textbooks and notebooks
  - Any electronic devices

The web platform consists of ONLY THREE PAGES
designed with a modern claymorphism light theme,
commercial-grade typography, smooth animations,
loading skeletons, and full mobile/laptop
responsiveness. No mobile app installation needed.

The system runs on a single embedded processing
unit (laptop/mini PC with GPU) making it a true
embedded system project with AI/ML integration
and web-based output.

KEYWORDS: Artificial Intelligence, Computer Vision,
Embedded Systems, YOLOv8, MediaPipe, Examination
Monitoring, Malpractice Detection, Web Dashboard,
Claymorphism, Mobile Camera, Video Processing.
```

---

---

---

# 📋 SECTION 3: SYSTEM ARCHITECTURE

---

## 3.1 Simplified System Overview

```
SYSTEM PILLARS (Revised — Only 3):
═══════════════════════════════════

  ┌─────────────────────────────────────────┐
  │                                         │
  │  PILLAR 1       PILLAR 2     PILLAR 3   │
  │  ────────       ────────     ────────   │
  │                                         │
  │  EMBEDDED    +  AI/ML     +  WEB        │
  │  CAMERA         ENGINE       PLATFORM   │
  │  INPUT                                  │
  │                                         │
  │  Mobile         YOLOv8       3 Pages    │
  │  Camera +       MediaPipe    Claymorphism│
  │  Video          ByteTrack    Light Theme │
  │  Upload         Scoring      Responsive  │
  │                                         │
  └─────────────────────────────────────────┘
                    │
                    ▼
          ┌───────────────────┐
          │  DETECTION        │
          │  + SCORING        │
          │  + ALERTS         │
          │  + EVIDENCE       │
          └───────────────────┘
```

---

## 3.2 Input Methods — Detailed

```
INPUT METHOD 1: MOBILE CAMERA CONNECTION
═════════════════════════════════════════

HOW IT WORKS:
─────────────

Step 1: Invigilator opens any IP camera app
        on their smartphone
        (e.g., IP Webcam for Android,
         EpocCam for iOS — both free)

Step 2: App converts phone into WiFi IP camera
        Phone and server on same network

Step 3: Phone broadcasts video stream via
        HTTP/RTSP on local network
        Example: http://192.168.1.5:8080/video

Step 4: Our system connects to this stream URL
        entered on the web dashboard

Step 5: Server pulls frames from phone camera
        at 5-10 FPS for AI processing

Step 6: Real-time results displayed on dashboard

ADVANTAGES:
├── No special hardware camera needed
├── Any smartphone works (Android/iOS)
├── Multiple phones = multiple camera angles
├── Invigilator can reposition easily
├── WiFi connection — no cables
├── Free IP camera apps available
└── Camera quality depends on phone (usually good)

SUPPORTED CONFIGURATIONS:
├── 1 phone = 1 camera angle (minimum)
├── 2 phones = front + back coverage
├── 3 phones = front + back + side
├── 4 phones = all corners (maximum coverage)
└── Mix of phones and existing IP cameras


INPUT METHOD 2: VIDEO UPLOAD
═════════════════════════════

HOW IT WORKS:
─────────────

Step 1: Exam is recorded using any camera
        (phone recording, CCTV recording,
         handheld camera, etc.)

Step 2: After exam, video file is uploaded
        via the web dashboard

Step 3: Supported formats:
        MP4, AVI, MOV, MKV, WEBM

Step 4: Server processes video frame by frame
        through the same AI pipeline

Step 5: Processing progress shown on dashboard
        with loading skeleton animation

Step 6: Complete analysis report generated
        after processing finishes

Step 7: All detections timestamped to
        original video timeline

ADVANTAGES:
├── Post-exam analysis possible
├── No real-time processing pressure
├── Can process higher resolution
├── Review old exam footage
├── Generate evidence from recordings
├── Batch process multiple videos
└── Works without network during exam

USE CASES:
├── Analyzing complaints after exam
├── Reviewing suspicious incidents
├── Training the AI model
├── Evidence preparation for committees
└── Audit of past examinations
```

---

## 3.3 Revised Block Diagram

```
═══════════════════════════════════════════════
        COMPLETE REVISED BLOCK DIAGRAM
═══════════════════════════════════════════════

 ┌──────── VIDEO INPUT SOURCES ────────────┐
 │                                          │
 │  ┌────────────────┐  ┌────────────────┐  │
 │  │ MOBILE CAMERA  │  │ VIDEO FILE     │  │
 │  │ (IP Webcam App)│  │ UPLOAD         │  │
 │  │                │  │                │  │
 │  │ Live Stream    │  │ MP4/AVI/MOV    │  │
 │  │ via WiFi       │  │ via Web Form   │  │
 │  │                │  │                │  │
 │  │ RTSP/HTTP      │  │ File Upload    │  │
 │  │ Stream URL     │  │ API            │  │
 │  └───────┬────────┘  └───────┬────────┘  │
 │          │                   │           │
 └──────────┼───────────────────┼───────────┘
            │                   │
            ▼                   ▼
 ┌──────────────────────────────────────────┐
 │        STREAM / FILE INGESTION          │
 │                                          │
 │  ┌─────────────┐  ┌──────────────────┐  │
 │  │ Live Stream  │  │ Video File       │  │
 │  │ Reader       │  │ Reader           │  │
 │  │ (OpenCV      │  │ (OpenCV          │  │
 │  │  VideoCapture│  │  VideoCapture    │  │
 │  │  RTSP/HTTP)  │  │  from file)      │  │
 │  └──────┬──────┘  └────────┬─────────┘  │
 │         │                  │             │
 │         └────────┬─────────┘             │
 │                  │                       │
 │                  ▼                       │
 │         ┌────────────────┐               │
 │         │ Frame Queue    │               │
 │         │ (Buffer)       │               │
 │         └───────┬────────┘               │
 │                 │                        │
 └─────────────────┼────────────────────────┘
                   │
                   ▼
╔══════════════════════════════════════════════╗
║      EMBEDDED AI PROCESSING ENGINE          ║
║      (Laptop/Mini PC with GPU)              ║
║                                              ║
║  ┌────────────────────────────────────────┐  ║
║  │  PHASE 1: HEAD COUNT                  │  ║
║  │  ─────────────────────                │  ║
║  │                                        │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ YOLOv8 Person Detection          │  │  ║
║  │  │ ├── Detect all persons in frame  │  │  ║
║  │  │ ├── Count total persons          │  │  ║
║  │  │ ├── Compare with expected count  │  │  ║
║  │  │ ├── ByteTrack assigns unique IDs │  │  ║
║  │  │ ├── Track each person across     │  │  ║
║  │  │ │   frames persistently          │  │  ║
║  │  │ ├── Map person ID to seat zone   │  │  ║
║  │  │ ├── Detect empty seats           │  │  ║
║  │  │ └── Detect extra persons         │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  │  OUTPUT: Person count, person IDs,     │  ║
║  │          bounding boxes, seat mapping  │  ║
║  └──────────────┬─────────────────────────┘  ║
║                 │                             ║
║                 ▼                             ║
║  ┌────────────────────────────────────────┐  ║
║  │  PHASE 2: BEHAVIOR ANALYSIS           │  ║
║  │  ──────────────────────────            │  ║
║  │                                        │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ MediaPipe Head Pose Estimation   │  │  ║
║  │  │ ├── Yaw angle (left/right turn)  │  │  ║
║  │  │ ├── Pitch angle (up/down tilt)   │  │  ║
║  │  │ ├── Roll angle (head tilt)       │  │  ║
║  │  │ ├── Detect looking at neighbor   │  │  ║
║  │  │ ├── Detect looking down at lap   │  │  ║
║  │  │ ├── Detect looking back          │  │  ║
║  │  │ └── Track head pose over time    │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ MediaPipe Body Pose Estimation   │  │  ║
║  │  │ ├── Upper body keypoints         │  │  ║
║  │  │ ├── Leaning toward neighbor      │  │  ║
║  │  │ ├── Hand position analysis       │  │  ║
║  │  │ ├── Arm reaching gesture         │  │  ║
║  │  │ ├── Passing object gesture       │  │  ║
║  │  │ └── Abnormal posture detection   │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ Interaction Analysis             │  │  ║
║  │  │ ├── Two students facing each     │  │  ║
║  │  │ │   other simultaneously         │  │  ║
║  │  │ ├── Synchronized movements       │  │  ║
║  │  │ ├── Proximity analysis           │  │  ║
║  │  │ └── Gesture exchange patterns    │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  │  OUTPUT: Behavior flags per person,    │  ║
║  │          confidence scores,            │  ║
║  │          interaction pairs             │  ║
║  └──────────────┬─────────────────────────┘  ║
║                 │                             ║
║                 ▼                             ║
║  ┌────────────────────────────────────────┐  ║
║  │  PHASE 3: PROHIBITED ITEM DETECTION   │  ║
║  │  ─────────────────────────────────     │  ║
║  │                                        │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ YOLOv8 Custom Object Detection   │  │  ║
║  │  │                                  │  │  ║
║  │  │ DETECTION CLASSES:               │  │  ║
║  │  │ ─────────────────                │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 1: MOBILE PHONE            │  │  ║
║  │  │ ├── In hand                      │  │  ║
║  │  │ ├── On desk                      │  │  ║
║  │  │ ├── Partially hidden             │  │  ║
║  │  │ ├── Screen visible under desk    │  │  ║
║  │  │ └── In lap area                  │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 2: EARPHONES / EARBUDS     │  │  ║
║  │  │ ├── Wired earphones              │  │  ║
║  │  │ ├── Wireless earbuds             │  │  ║
║  │  │ ├── In ear (visible)             │  │  ║
║  │  │ ├── In hand                      │  │  ║
║  │  │ └── On desk                      │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 3: SMART WATCH             │  │  ║
║  │  │ ├── On wrist (screen active)     │  │  ║
║  │  │ ├── Being looked at              │  │  ║
║  │  │ └── Interaction detected         │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 4: CHITS / PAPER SLIPS     │  │  ║
║  │  │ ├── Small paper in hand          │  │  ║
║  │  │ ├── Paper being passed           │  │  ║
║  │  │ ├── Hidden paper revealed        │  │  ║
║  │  │ └── Paper under question paper   │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 5: TEXTBOOK                │  │  ║
║  │  │ ├── Open textbook on desk        │  │  ║
║  │  │ ├── Book in bag being accessed   │  │  ║
║  │  │ ├── Book under desk              │  │  ║
║  │  │ └── Book in lap                  │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 6: NOTEBOOK                │  │  ║
║  │  │ ├── Extra notebook on desk       │  │  ║
║  │  │ ├── Notes being referenced       │  │  ║
║  │  │ └── Hidden notebook              │  │  ║
║  │  │                                  │  │  ║
║  │  │ CLASS 7: ELECTRONIC DEVICE       │  │  ║
║  │  │ ├── Tablet                       │  │  ║
║  │  │ ├── Calculator (if not allowed)  │  │  ║
║  │  │ ├── Any unidentified device      │  │  ║
║  │  │ └── Recording device             │  │  ║
║  │  │                                  │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  │  OUTPUT: Object class, bounding box,   │  ║
║  │          confidence score, association │  ║
║  │          with nearest person           │  ║
║  └──────────────┬─────────────────────────┘  ║
║                 │                             ║
║                 ▼                             ║
║  ┌────────────────────────────────────────┐  ║
║  │  SCORING ENGINE                       │  ║
║  │  ──────────────                       │  ║
║  │                                        │  ║
║  │  INPUT: All phase results combined     │  ║
║  │                                        │  ║
║  │  POINT ALLOCATION TABLE:               │  ║
║  │  ┌────────────────────────┬──────────┐ │  ║
║  │  │ Violation Type         │ Points   │ │  ║
║  │  ├────────────────────────┼──────────┤ │  ║
║  │  │ Phone detected         │   25     │ │  ║
║  │  │ Earphone detected      │   30     │ │  ║
║  │  │ Smart watch active     │   20     │ │  ║
║  │  │ Chit/slip detected     │   20     │ │  ║
║  │  │ Textbook detected      │   35     │ │  ║
║  │  │ Notebook detected      │   30     │ │  ║
║  │  │ Electronic device      │   25     │ │  ║
║  │  │ Head turned (sustained)│   10     │ │  ║
║  │  │ Looking at neighbor    │    8     │ │  ║
║  │  │ Leaning toward other   │   10     │ │  ║
║  │  │ Passing gesture        │   15     │ │  ║
║  │  │ Head count mismatch    │   40     │ │  ║
║  │  │ Extra person in hall   │   50     │ │  ║
║  │  └────────────────────────┴──────────┘ │  ║
║  │                                        │  ║
║  │  SCORE MODIFIERS:                      │  ║
║  │  ├── AI Confidence Weight:             │  ║
║  │  │   Points × (confidence / 100)       │  ║
║  │  │   Example: 25 × 0.85 = 21.25 pts   │  ║
║  │  │                                     │  ║
║  │  ├── Cooldown: Same violation type     │  ║
║  │  │   ignored for 30 seconds after      │  ║
║  │  │   first detection (prevents spam)   │  ║
║  │  │                                     │  ║
║  │  ├── Decay: -2 points per minute of    │  ║
║  │  │   clean behavior (forgiveness)      │  ║
║  │  │                                     │  ║
║  │  └── Repeat Multiplier: Same violation │  ║
║  │      detected 3+ times = 1.5× points  │  ║
║  │                                        │  ║
║  │  ALERT THRESHOLDS:                     │  ║
║  │  ┌──────────────────────────────────┐  │  ║
║  │  │ Score Range    │ Alert Level     │  │  ║
║  │  ├──────────────────────────────────┤  │  ║
║  │  │  0 - 15        │ 🟢 GREEN       │  │  ║
║  │  │                │ Normal          │  │  ║
║  │  │                │ No alert        │  │  ║
║  │  │                │                 │  │  ║
║  │  │ 16 - 35        │ 🟡 YELLOW      │  │  ║
║  │  │                │ Watch closely   │  │  ║
║  │  │                │ Log only        │  │  ║
║  │  │                │                 │  │  ║
║  │  │ 36 - 60        │ 🟠 ORANGE      │  │  ║
║  │  │                │ Suspicious      │  │  ║
║  │  │                │ Notify invgltr  │  │  ║
║  │  │                │                 │  │  ║
║  │  │ 61 - 85        │ 🔴 RED         │  │  ║
║  │  │                │ Action needed   │  │  ║
║  │  │                │ Urgent alert    │  │  ║
║  │  │                │                 │  │  ║
║  │  │ 86+            │ 🚨 CRITICAL    │  │  ║
║  │  │                │ Immediate       │  │  ║
║  │  │                │ intervention    │  │  ║
║  │  └──────────────────────────────────┘  │  ║
║  │                                        │  ║
║  └──────────────┬─────────────────────────┘  ║
║                 │                             ║
║                 ▼                             ║
║  ┌────────────────────────────────────────┐  ║
║  │  EVIDENCE CAPTURE                     │  ║
║  │  ────────────────                     │  ║
║  │                                        │  ║
║  │  On each violation detection:          │  ║
║  │  ├── Screenshot with AI bounding box   │  ║
║  │  ├── 10-second video clip extraction   │  ║
║  │  ├── Detection metadata (JSON)         │  ║
║  │  │   ├── Timestamp                     │  ║
║  │  │   ├── Person tracking ID            │  ║
║  │  │   ├── Violation type                │  ║
║  │  │   ├── Confidence score              │  ║
║  │  │   ├── Bounding box coordinates      │  ║
║  │  │   └── Current suspicion score       │  ║
║  │  └── Stored in local file system       │  ║
║  │      + database reference              │  ║
║  └──────────────┬─────────────────────────┘  ║
║                 │                             ║
╚═════════════════╧════════════════════════════╝
                  │
                  ▼
╔══════════════════════════════════════════════╗
║         WEB APPLICATION SERVER              ║
║                                              ║
║  ┌────────────────────────────────────────┐  ║
║  │ Backend: FastAPI (Python)              │  ║
║  │ ├── REST API endpoints                │  ║
║  │ ├── WebSocket for real-time updates   │  ║
║  │ ├── File upload handling              │  ║
║  │ ├── Video processing queue            │  ║
║  │ └── Database operations               │  ║
║  └────────────────────────────────────────┘  ║
║                                              ║
║  ┌────────────────────────────────────────┐  ║
║  │ Database: SQLite / PostgreSQL          │  ║
║  │ ├── Exam sessions                     │  ║
║  │ ├── Detection events                  │  ║
║  │ ├── Student scores                    │  ║
║  │ ├── Evidence references               │  ║
║  │ └── Alert history                     │  ║
║  └────────────────────────────────────────┘  ║
║                                              ║
║  ┌────────────────────────────────────────┐  ║
║  │ Frontend: React.js                    │  ║
║  │ ├── 3 Pages Only                      │  ║
║  │ ├── Claymorphism Light Theme          │  ║
║  │ ├── Mobile + Laptop Responsive        │  ║
║  │ ├── Commercial Icons & Fonts          │  ║
║  │ ├── Smooth Animations                 │  ║
║  │ ├── Loading Skeletons                 │  ║
║  │ └── Hover Effects                     │  ║
║  └────────────────────────────────────────┘  ║
║                                              ║
╚══════════════════════════════════════════════╝
                  │
      ┌───────────┼───────────────┐
      │           │               │
      ▼           ▼               ▼
┌──────────┐ ┌──────────┐ ┌──────────────┐
│  PAGE 1  │ │  PAGE 2  │ │   PAGE 3     │
│  ──────  │ │  ──────  │ │   ──────     │
│ LIVE     │ │ UPLOAD   │ │  REPORTS     │
│ MONITOR  │ │ ANALYZE  │ │  HISTORY     │
│          │ │          │ │              │
│ Laptop   │ │ Laptop   │ │  Laptop      │
│    +     │ │    +     │ │     +        │
│ Mobile   │ │ Mobile   │ │  Mobile      │
└──────────┘ └──────────┘ └──────────────┘
```

---

---

---

# 📋 SECTION 4: WEBSITE DESIGN — 3 PAGES

---

## 4.1 Design System Overview

```
DESIGN PHILOSOPHY:
══════════════════

THEME: CLAYMORPHISM (Light)
─────────────────────────────

What is Claymorphism:
├── Soft, rounded, 3D-like UI elements
├── Looks like molded clay or soft plastic
├── Light pastel backgrounds
├── Subtle inner and outer shadows
├── Rounded corners (16px-24px radius)
├── Feels tactile and modern
├── Warm and approachable aesthetic
└── NOT flat, NOT glassmorphism, NOT neumorphism

Claymorphism CSS Properties:
├── Background: Soft pastel colors
│   (Light lavender, soft mint, warm cream)
├── Border-radius: 20px-30px
├── Box-shadow: Dual shadows
│   ├── Outer shadow (depth)
│   └── Inner shadow (clay effect)
├── No sharp edges anywhere
├── Subtle gradients on surfaces
└── Slightly inflated, puffy appearance


COLOR PALETTE:
──────────────

┌──────────────────────────────────────────┐
│  PRIMARY COLORS                          │
│                                          │
│  Background:   #F5F0EB  (Warm cream)    │
│  Card Base:    #FFFFFF  (Pure white)     │
│  Primary:      #6C5CE7  (Soft purple)   │
│  Secondary:    #00B894  (Mint green)     │
│  Accent:       #FDCB6E  (Warm yellow)   │
│  Danger:       #FF6B6B  (Soft red)      │
│  Warning:      #FFA502  (Orange)        │
│  Success:      #26DE81  (Green)         │
│  Text Primary: #2D3436  (Dark gray)     │
│  Text Light:   #636E72  (Medium gray)   │
│  Border:       #E8E2DC  (Soft border)   │
│                                          │
│  ALERT LEVEL COLORS                     │
│  Green:    #26DE81                       │
│  Yellow:   #FFC312                       │
│  Orange:   #F79F1F                       │
│  Red:      #EA2027                       │
│  Critical: #EA2027 (pulsing animation) │
│                                          │
└──────────────────────────────────────────┘


TYPOGRAPHY:
───────────

┌──────────────────────────────────────────┐
│  FONTS (Google Fonts — Free Commercial)  │
│                                          │
│  Headings:  "Plus Jakarta Sans"          │
│             ├── Weight: 700 (Bold)       │
│             ├── Modern, geometric        │
│             └── Excellent readability    │
│                                          │
│  Body Text: "Inter"                      │
│             ├── Weight: 400, 500, 600    │
│             ├── Designed for screens     │
│             └── Perfect for data display │
│                                          │
│  Monospace:  "JetBrains Mono"            │
│  (Numbers)  ├── Weight: 500             │
│             └── For scores, counts, IDs  │
│                                          │
│  All three are:                          │
│  ├── Free for commercial use             │
│  ├── Available on Google Fonts           │
│  ├── Excellent screen rendering          │
│  └── Support all needed characters       │
│                                          │
└──────────────────────────────────────────┘


ICONS:
──────

┌──────────────────────────────────────────┐
│  ICON LIBRARY: Lucide Icons              │
│                                          │
│  ├── License: ISC (fully commercial)     │
│  ├── Style: Clean, consistent stroke     │
│  ├── 1000+ icons available               │
│  ├── React component library             │
│  ├── Customizable size and color         │
│  └── Matches claymorphism aesthetic      │
│                                          │
│  ALTERNATIVE: Phosphor Icons             │
│  ├── License: MIT (fully commercial)     │
│  ├── Multiple weights (thin to bold)     │
│  ├── Duotone variant available           │
│  └── 6000+ icons                         │
│                                          │
│  KEY ICONS USED:                         │
│  ├── Camera / Video → Live feed          │
│  ├── Upload / Cloud-Upload → Upload page │
│  ├── BarChart / PieChart → Reports       │
│  ├── Shield / ShieldCheck → Security     │
│  ├── AlertTriangle → Warnings            │
│  ├── Users → Head count                  │
│  ├── Smartphone → Phone detection        │
│  ├── Headphones → Earphone detection     │
│  ├── Watch → Smart watch detection       │
│  ├── FileText → Chit/slip detection      │
│  ├── BookOpen → Textbook detection       │
│  ├── Notebook → Notebook detection       │
│  ├── Eye → Monitoring                    │
│  ├── Activity → Live status              │
│  ├── Download → Export reports            │
│  └── CheckCircle → Acknowledged          │
│                                          │
└──────────────────────────────────────────┘


ANIMATIONS:
───────────

┌──────────────────────────────────────────┐
│  ANIMATION LIBRARY: Framer Motion        │
│                                          │
│  ├── License: MIT (commercial free)      │
│  ├── React-native animation library      │
│  └── Used for all UI animations          │
│                                          │
│  ANIMATIONS USED:                        │
│                                          │
│  1. PAGE TRANSITIONS                     │
│     ├── Fade in + slide up on page load  │
│     ├── Duration: 300ms                  │
│     └── Easing: ease-out                 │
│                                          │
│  2. CARD HOVER EFFECTS                   │
│     ├── Scale up to 1.02 on hover        │
│     ├── Shadow deepens on hover          │
│     ├── Subtle lift effect               │
│     └── Duration: 200ms                  │
│                                          │
│  3. LOADING SKELETONS                    │
│     ├── Shimmer animation (left to right)│
│     ├── Pulse animation for placeholders │
│     ├── Shown while data loads           │
│     ├── Matches card shapes exactly      │
│     └── Smooth transition to real content│
│                                          │
│  4. ALERT ANIMATIONS                     │
│     ├── Slide in from right              │
│     ├── Bounce effect on critical alerts │
│     ├── Pulse glow on active alerts      │
│     └── Fade out on dismiss              │
│                                          │
│  5. SCORE COUNTER                        │
│     ├── Number counting animation        │
│     ├── Color transition on threshold    │
│     └── Smooth increment/decrement       │
│                                          │
│  6. PROGRESS BARS                        │
│     ├── Smooth fill animation            │
│     ├── Color gradient change            │
│     └── Used for upload and processing   │
│                                          │
│  7. BUTTON INTERACTIONS                  │
│     ├── Press down effect (scale 0.97)   │
│     ├── Ripple effect on click           │
│     └── Color transition on hover        │
│                                          │
│  8. TAB/NAV TRANSITIONS                  │
│     ├── Active indicator slides           │
│     ├── Content cross-fades              │
│     └── Smooth underline animation       │
│                                          │
│  9. CHART ANIMATIONS                     │
│     ├── Bars grow from zero              │
│     ├── Pie slices expand from center    │
│     ├── Lines draw progressively         │
│     └── Data points pop in sequentially  │
│                                          │
│  10. MODAL/POPUP                         │
│      ├── Scale from 0.8 to 1.0           │
│      ├── Backdrop fade in                │
│      └── Content staggers in             │
│                                          │
└──────────────────────────────────────────┘


LOADING SKELETONS:
──────────────────

┌──────────────────────────────────────────┐
│  WHERE SKELETONS APPEAR:                 │
│                                          │
│  1. Video feed area → Gray rectangle    │
│     with shimmer while connecting        │
│                                          │
│  2. Score cards → Rounded rectangles    │
│     pulsing while data loads             │
│                                          │
│  3. Alert list → Row-shaped skeletons   │
│     stacked vertically                   │
│                                          │
│  4. Student table → Row skeletons with  │
│     columns matching actual table        │
│                                          │
│  5. Charts → Chart-shaped skeleton      │
│     placeholder                          │
│                                          │
│  6. Upload progress → Progress bar      │
│     skeleton before upload starts        │
│                                          │
│  7. Report cards → Card-shaped          │
│     skeletons in grid layout             │
│                                          │
│  SKELETON STYLE:                         │
│  ├── Base color: #E8E2DC (light gray)   │
│  ├── Shimmer color: #F5F0EB (lighter)   │
│  ├── Border-radius: Same as real element│
│  ├── Animation: 1.5s shimmer loop       │
│  └── Transition: 300ms fade to content  │
│                                          │
└──────────────────────────────────────────┘


RESPONSIVE BREAKPOINTS:
───────────────────────

┌──────────────────────────────────────────┐
│                                          │
│  MOBILE:      320px - 767px              │
│  ├── Single column layout                │
│  ├── Stacked cards                       │
│  ├── Bottom navigation bar               │
│  ├── Full-width video feed               │
│  ├── Collapsed sidebar                   │
│  └── Touch-optimized buttons (48px min)  │
│                                          │
│  TABLET:      768px - 1023px             │
│  ├── Two column layout                   │
│  ├── Side-by-side cards                  │
│  ├── Top navigation bar                  │
│  └── Adjusted video feed size            │
│                                          │
│  LAPTOP:      1024px - 1439px            │
│  ├── Full multi-column layout            │
│  ├── Sidebar visible                     │
│  ├── Video feed + panels side by side    │
│  └── Full dashboard experience           │
│                                          │
│  DESKTOP:     1440px+                    │
│  ├── Maximum content width: 1400px       │
│  ├── Centered with side margins          │
│  └── Optimal data density                │
│                                          │
└──────────────────────────────────────────┘


SPACING SYSTEM:
───────────────

┌──────────────────────────────────────────┐
│  SPACIOUS DESIGN PRINCIPLES:             │
│                                          │
│  ├── Base unit: 8px                      │
│  ├── XS:  8px  (tight internal)          │
│  ├── SM:  16px (internal padding)        │
│  ├── MD:  24px (card padding)            │
│  ├── LG:  32px (between sections)        │
│  ├── XL:  48px (major sections)          │
│  ├── 2XL: 64px (page top/bottom)        │
│  │                                       │
│  ├── Card padding: 24px-32px             │
│  ├── Card gap: 24px                      │
│  ├── Section gap: 48px                   │
│  ├── Line height: 1.6 (body text)        │
│  ├── Letter spacing: 0.01em             │
│  └── Generous whitespace everywhere      │
│                                          │
│  PRINCIPLE: "When in doubt, add more     │
│  space. Cramped UI feels cheap."         │
│                                          │
└──────────────────────────────────────────┘
```

---

## 4.2 Navigation Design

```
NAVIGATION STRUCTURE:
═════════════════════

ONLY 3 NAVIGATION ITEMS (Clean & Minimal)

┌─────────────────────────────────────────────┐
│                                             │
│  LAPTOP/DESKTOP: Top Navigation Bar         │
│  ┌─────────────────────────────────────────┐│
│  │                                         ││
│  │  🛡️ ExamShield    📺 Live    📤 Upload  ││
│  │                    Monitor    & Analyze  ││
│  │                                         ││
│  │                              📊 Reports ││
│  │                              & History  ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
│                                             │
│  MOBILE: Bottom Navigation Bar              │
│  ┌─────────────────────────────────────────┐│
│  │                                         ││
│  │   📺           📤           📊          ││
│  │   Live         Upload       Reports     ││
│  │                                         ││
│  └─────────────────────────────────────────┘│
│                                             │
│  Active tab: Highlighted with primary color │
│  Inactive tabs: Muted gray                  │
│  Transition: Smooth underline slide         │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 4.3 PAGE 1: LIVE MONITOR

```
PAGE 1: LIVE MONITOR
═════════════════════

PURPOSE: Real-time examination monitoring
         using mobile camera connection

URL PATH: / or /live


LAPTOP LAYOUT:
──────────────

┌─────────────────────────────────────────────────┐
│  🛡️ ExamShield    [📺 Live]  📤 Upload  📊 Reports │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌── CONNECTION PANEL (Clay Card) ────────────┐ │
│  │                                             │ │
│  │  📡 Camera Connection                       │ │
│  │                                             │ │
│  │  Stream URL: [http://192.168.1.5:8080___] │ │
│  │                                             │ │
│  │  [🔗 Connect Camera]    Status: ● Connected│ │
│  │                                             │ │
│  │  Quick Guide:                               │ │
│  │  "Open IP Webcam app on your phone →       │ │
│  │   Start server → Enter the URL shown       │ │
│  │   in the app here"                          │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐│
│  │                     │ │                     ││
│  │  VIDEO FEED         │ │  DETECTION PANEL    ││
│  │  (Large Area)       │ │  (Clay Card)        ││
│  │                     │ │                     ││
│  │  ┌───────────────┐  │ │  HEAD COUNT         ││
│  │  │               │  │ │  ┌───────────────┐  ││
│  │  │  Live camera  │  │ │  │ 👥 Detected: 34│  ││
│  │  │  feed with    │  │ │  │ 📋 Expected: 36│  ││
│  │  │  AI overlay   │  │ │  │ ⚠️ Missing: 2  │  ││
│  │  │  (bounding    │  │ │  └───────────────┘  ││
│  │  │   boxes,      │  │ │                     ││
│  │  │   labels,     │  │ │  DETECTIONS NOW     ││
│  │  │   scores)     │  │ │  ┌───────────────┐  ││
│  │  │               │  │ │  │📱 Phone: 2     │  ││
│  │  │               │  │ │  │🎧 Earphone: 0  │  ││
│  │  │  Loading:     │  │ │  │⌚ Watch: 1     │  ││
│  │  │  Skeleton     │  │ │  │📄 Chit: 0      │  ││
│  │  │  rectangle    │  │ │  │📕 Textbook: 0  │  ││
│  │  │  with shimmer │  │ │  │📓 Notebook: 1  │  ││
│  │  │  until feed   │  │ │  │📳 Device: 0    │  ││
│  │  │  connects     │  │ │  └───────────────┘  ││
│  │  │               │  │ │                     ││
│  │  └───────────────┘  │ │  PHASE INDICATOR    ││
│  │                     │ │  ┌───────────────┐  ││
│  │  Controls:          │ │  │ ✅ Phase 1     │  ││
│  │  [⏸ Pause]          │ │  │ ✅ Phase 2     │  ││
│  │  [📸 Screenshot]    │ │  │ ✅ Phase 3     │  ││
│  │  [🔴 Record Clip]   │ │  │ All active     │  ││
│  │                     │ │  └───────────────┘  ││
│  └─────────────────────┘ └─────────────────────┘│
│                                                  │
│  ┌── ALERT FEED (Clay Card, Scrollable) ──────┐ │
│  │                                             │ │
│  │  🚨 Recent Alerts                           │ │
│  │                                             │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │ 🔴 14:23:45 │ Seat B3 │ PHONE      │    │ │
│  │  │ Score: 67 │ Conf: 92% │ [📷 View] │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │                                             │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │ 🟠 14:22:12 │ Seat D5 │ HEAD TURN  │    │ │
│  │  │ Score: 42 │ Conf: 78% │ [📷 View] │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │                                             │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │ 🟡 14:20:55 │ Seat A7 │ LEANING    │    │ │
│  │  │ Score: 28 │ Conf: 65% │ [📷 View] │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │                                             │ │
│  │  Loading: Alert row skeletons with shimmer  │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌── SCORE OVERVIEW (Clay Card) ──────────────┐ │
│  │                                             │ │
│  │  Top Flagged Students                       │ │
│  │                                             │ │
│  │  ┌──────┬──────┬────────┬─────────────┐    │ │
│  │  │ Rank │ Seat │ Score  │ Status      │    │ │
│  │  ├──────┼──────┼────────┼─────────────┤    │ │
│  │  │  1   │ B3   │  67    │ 🔴 RED      │    │ │
│  │  │  2   │ D5   │  42    │ 🟠 ORANGE   │    │ │
│  │  │  3   │ A7   │  28    │ 🟡 YELLOW   │    │ │
│  │  │  4   │ C2   │  18    │ 🟡 YELLOW   │    │ │
│  │  │  5   │ F1   │  12    │ 🟢 GREEN    │    │ │
│  │  └──────┴──────┴────────┴─────────────┘    │ │
│  │                                             │ │
│  │  Loading: Table row skeletons               │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘


MOBILE LAYOUT:
──────────────

┌───────────────────────────┐
│  🛡️ ExamShield            │
├───────────────────────────┤
│                           │
│  CONNECTION (Collapsed)   │
│  ┌───────────────────┐    │
│  │ 📡 Camera: ● On   │    │
│  │ [Change URL]      │    │
│  └───────────────────┘    │
│                           │
│  VIDEO FEED (Full Width)  │
│  ┌───────────────────┐    │
│  │                   │    │
│  │  Live feed with   │    │
│  │  AI overlay       │    │
│  │                   │    │
│  │  (16:9 ratio)     │    │
│  │                   │    │
│  └───────────────────┘    │
│                           │
│  QUICK STATS (Horizontal) │
│  ┌─────┐ ┌─────┐ ┌─────┐ │
│  │👥 34│ │📱 2 │ │🚨 3 │ │
│  │Count│ │Phone│ │Alert│ │
│  └─────┘ └─────┘ └─────┘ │
│                           │
│  ALERTS (Scrollable List) │
│  ┌───────────────────┐    │
│  │🔴 B3 │ PHONE │ 67 │    │
│  ├───────────────────┤    │
│  │🟠 D5 │ HEAD  │ 42 │    │
│  ├───────────────────┤    │
│  │🟡 A7 │ LEAN  │ 28 │    │
│  └───────────────────┘    │
│                           │
│  ┌───────────────────┐    │
│  │  📺      📤     📊  │    │
│  │  Live   Upload  Rpts│    │
│  └───────────────────┘    │
└───────────────────────────┘


INTERACTIONS ON THIS PAGE:
──────────────────────────

├── Connect Button:
│   ├── Hover: Scale 1.02, shadow deepens
│   ├── Click: Ripple effect
│   ├── Loading: Spinner inside button
│   └── Success: Green checkmark animation
│
├── Video Feed Area:
│   ├── Before connect: Skeleton shimmer
│   ├── Connecting: Pulsing animation
│   ├── Connected: Smooth fade-in of feed
│   └── Error: Red tint with retry button
│
├── Alert Cards:
│   ├── New alert: Slides in from right
│   ├── Hover: Slight lift + shadow
│   ├── Click: Expands to show evidence
│   └── Critical: Pulsing red glow border
│
├── Score Table:
│   ├── Numbers: Counting animation on update
│   ├── Color: Smooth transition on threshold
│   ├── Row hover: Highlight with soft color
│   └── Loading: Row skeletons with shimmer
│
├── Detection Counters:
│   ├── Number change: Scale bounce + count
│   ├── New detection: Counter flashes briefly
│   └── Zero state: Grayed out with check icon
│
└── Phase Indicators:
    ├── Active: Green check with pulse
    ├── Processing: Spinning loader
    └── Inactive: Gray dot
```

---

## 4.4 PAGE 2: UPLOAD & ANALYZE

```
PAGE 2: UPLOAD & ANALYZE
═════════════════════════

PURPOSE: Upload pre-recorded exam video for
         AI analysis and detection

URL PATH: /upload


LAPTOP LAYOUT:
──────────────

┌─────────────────────────────────────────────────┐
│  🛡️ ExamShield    📺 Live  [📤 Upload]  📊 Reports │
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌── UPLOAD AREA (Clay Card, Large) ──────────┐ │
│  │                                             │ │
│  │  📤 Upload Examination Video                │ │
│  │                                             │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │                                     │    │ │
│  │  │      ┌───────────────────┐          │    │ │
│  │  │      │                   │          │    │ │
│  │  │      │   ☁️ DRAG & DROP   │          │    │ │
│  │  │      │   your video here │          │    │ │
│  │  │      │                   │          │    │ │
│  │  │      │   or              │          │    │ │
│  │  │      │                   │          │    │ │
│  │  │      │  [Browse Files]   │          │    │ │
│  │  │      │                   │          │    │ │
│  │  │      └───────────────────┘          │    │ │
│  │  │                                     │    │ │
│  │  │  Supported: MP4, AVI, MOV, MKV, WEBM│    │ │
│  │  │  Max size: 2GB                      │    │ │
│  │  │                                     │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │                                             │ │
│  │  Exam Details (Optional):                   │ │
│  │  ┌─────────────┐ ┌──────────────────────┐  │ │
│  │  │ Exam Name   │ │ Expected Students    │  │ │
│  │  │ [________]  │ │ [___]                │  │ │
│  │  └─────────────┘ └──────────────────────┘  │ │
│  │                                             │ │
│  │  [🚀 Start Analysis]                       │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│  ═══ AFTER UPLOAD — PROCESSING VIEW ═══         │
│                                                  │
│  ┌── PROCESSING STATUS (Clay Card) ───────────┐ │
│  │                                             │ │
│  │  📊 Analysis in Progress                    │ │
│  │                                             │ │
│  │  Video: exam_hall_A_20240115.mp4            │ │
│  │  Duration: 2h 45m │ Frames: 297,000        │ │
│  │                                             │ │
│  │  Progress:                                  │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │████████████████░░░░░░░░░░░░░░░░░░░░│    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │  42% Complete │ ETA: 18 minutes             │ │
│  │                                             │ │
│  │  Current Phase:                             │ │
│  │  ✅ Phase 1: Head Count ─── Complete        │ │
│  │  🔄 Phase 2: Behavior ──── Processing...    │ │
│  │  ⏳ Phase 3: Objects ───── Waiting          │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌─────────────────────┐ ┌─────────────────────┐│
│  │                     │ │                     ││
│  │  CURRENT FRAME      │ │  RUNNING STATS      ││
│  │  (Clay Card)        │ │  (Clay Card)        ││
│  │                     │ │                     ││
│  │  ┌───────────────┐  │ │  Head Count: 35     ││
│  │  │               │  │ │  Violations: 12     ││
│  │  │  Frame being  │  │ │  ┌───────────────┐  ││
│  │  │  processed    │  │ │  │📱 Phones: 3    │  ││
│  │  │  with AI      │  │ │  │🎧 Earphone: 1 │  ││
│  │  │  overlay      │  │ │  │⌚ Watch: 2    │  ││
│  │  │               │  │ │  │📄 Chits: 1    │  ││
│  │  │  (Updates     │  │ │  │📕 Textbook: 0 │  ││
│  │  │   every few   │  │ │  │📓 Notebook: 2 │  ││
│  │  │   seconds)    │  │ │  └───────────────┘  ││
│  │  │               │  │ │                     ││
│  │  └───────────────┘  │ │  Timeline Markers:  ││
│  │                     │ │  🔴 14:23 Phone B3  ││
│  │  Frame: 124,800     │ │  🟠 14:35 Watch D2  ││
│  │  Time: 1:09:20      │ │  🟡 14:42 Head A6   ││
│  │                     │ │                     ││
│  └─────────────────────┘ └─────────────────────┘│
│                                                  │
│                                                  │
│  ═══ AFTER PROCESSING — RESULTS VIEW ═══        │
│                                                  │
│  ┌── ANALYSIS COMPLETE (Clay Card) ───────────┐ │
│  │                                             │ │
│  │  ✅ Analysis Complete!                      │ │
│  │                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ 👥 35    │ │ 🚨 12    │ │ 🔴 3     │    │ │
│  │  │ Students │ │ Total    │ │ Critical │    │ │
│  │  │ Counted  │ │ Violatn  │ │ Students │    │ │
│  │  │          │ │          │ │          │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘    │ │
│  │                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ 📱 3     │ │ 🎧 1     │ │ ⌚ 2     │    │ │
│  │  │ Phones   │ │ Earphone │ │ Watches  │    │ │
│  │  │          │ │          │ │          │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘    │ │
│  │                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ 📄 1     │ │ 📕 0     │ │ 📓 2     │    │ │
│  │  │ Chits    │ │ Textbook │ │ Notebook │    │ │
│  │  │          │ │          │ │          │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘    │ │
│  │                                             │ │
│  │  [📊 View Full Report]  [📥 Download PDF]  │ │
│  │  [🎬 View Flagged Clips]                   │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌── FLAGGED STUDENTS TABLE (Clay Card) ──────┐ │
│  │                                             │ │
│  │  Students Exceeding Thresholds              │ │
│  │                                             │ │
│  │  ┌────┬───────┬────────┬──────────┬──────┐  │ │
│  │  │ #  │ Seat  │ Score  │ Top      │ View │  │ │
│  │  │    │       │        │ Violatn  │      │  │ │
│  │  ├────┼───────┼────────┼──────────┼──────┤  │ │
│  │  │ 1  │ B3    │  78    │ Phone    │ [👁] │  │ │
│  │  │ 2  │ D2    │  65    │ Watch    │ [👁] │  │ │
│  │  │ 3  │ F4    │  52    │ Notebook │ [👁] │  │ │
│  │  └────┴───────┴────────┴──────────┴──────┘  │ │
│  │                                             │ │
│  │  Loading: Table skeleton with shimmer rows  │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘


MOBILE LAYOUT:
──────────────

┌───────────────────────────┐
│  🛡️ ExamShield            │
├───────────────────────────┤
│                           │
│  UPLOAD AREA              │
│  ┌───────────────────┐    │
│  │                   │    │
│  │  ☁️ Tap to Upload  │    │
│  │  or Drag & Drop   │    │
│  │                   │    │
│  │  [Choose File]    │    │
│  │                   │    │
│  └───────────────────┘    │
│                           │
│  [Exam Name: _________]  │
│  [Students: ____]        │
│                           │
│  [🚀 Start Analysis]     │
│                           │
│  ─── PROCESSING ───       │
│                           │
│  ┌───────────────────┐    │
│  │ █████████░░░░░ 42%│    │
│  │ ETA: 18 min       │    │
│  │ Phase: 2/3        │    │
│  └───────────────────┘    │
│                           │
│  ─── RESULTS ───          │
│                           │
│  ┌──────┐ ┌──────┐       │
│  │👥 35 │ │🚨 12 │       │
│  └──────┘ └──────┘       │
│  ┌──────┐ ┌──────┐       │
│  │📱 3  │ │🎧 1  │       │
│  └──────┘ └──────┘       │
│                           │
│  [📊 Full Report]        │
│  [📥 Download PDF]       │
│                           │
│  ┌───────────────────┐    │
│  │  📺      📤     📊  │    │
│  │  Live   Upload  Rpts│    │
│  └───────────────────┘    │
└───────────────────────────┘


INTERACTIONS ON THIS PAGE:
──────────────────────────

├── Drag & Drop Zone:
│   ├── Hover: Dashed border animates
│   ├── File dragged over: Zone highlights
│   │   with blue tint and scale 1.01
│   ├── File dropped: Check animation
│   └── Invalid file: Shake animation + error
│
├── Upload Progress:
│   ├── Progress bar fills with gradient
│   ├── Percentage counts up smoothly
│   ├── Phase indicators transition
│   │   ├── Waiting: Gray dot
│   │   ├── Active: Blue spinning
│   │   └── Done: Green check (pop-in)
│   └── ETA updates every 10 seconds
│
├── Processing Frame Preview:
│   ├── Before processing: Skeleton shimmer
│   ├── During: Frame updates every 2-3 sec
│   └── AI overlay visible on frame
│
├── Result Cards:
│   ├── Appear: Stagger animation (one by one)
│   ├── Numbers: Count up from zero
│   ├── Hover: Scale 1.03 + shadow lift
│   └── Zero values: Muted with check icon
│
├── Start Analysis Button:
│   ├── Disabled until file selected
│   ├── Hover: Gradient shift + shadow
│   ├── Click: Transforms to progress bar
│   └── Processing: Shows cancel option
│
└── Download/View Report:
    ├── Hover: Icon animates (download bounces)
    ├── Click: File download starts
    └── Loading: Button shows spinner
```

---

## 4.5 PAGE 3: REPORTS & HISTORY

```
PAGE 3: REPORTS & HISTORY
═════════════════════════

PURPOSE: View past analysis results,
         statistics, and evidence history

URL PATH: /reports


LAPTOP LAYOUT:
──────────────

┌─────────────────────────────────────────────────┐
│  🛡️ ExamShield    📺 Live  📤 Upload  [📊 Reports]│
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌── SUMMARY STATS (Clay Cards Row) ──────────┐ │
│  │                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ 📋 12    │ │ 🚨 47    │ │ 📱 18    │    │ │
│  │  │ Total    │ │ Total    │ │ Phones   │    │ │
│  │  │ Sessions │ │ Violatns │ │ Detected │    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ Hover:   │ │          │ │          │    │ │
│  │  │ Lift +   │ │          │ │          │    │ │
│  │  │ shadow   │ │          │ │          │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘    │ │
│  │                                             │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐    │ │
│  │  │          │ │          │ │          │    │ │
│  │  │ 🎧 5     │ │ ⌚ 8     │ │ 📄 16    │    │ │
│  │  │ Earphone │ │ Watches  │ │ Chits    │    │ │
│  │  │          │ │          │ │          │    │ │
│  │  └──────────┘ └──────────┘ └──────────┘    │ │
│  │                                             │ │
│  │  Loading: 6 card skeletons with shimmer     │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌── CHARTS SECTION (Clay Cards) ─────────────┐ │
│  │                                             │ │
│  │  ┌─────────────────────┐ ┌────────────────┐ │ │
│  │  │                     │ │                │ │ │
│  │  │  VIOLATION TYPE     │ │  VIOLATIONS    │ │ │
│  │  │  DISTRIBUTION       │ │  OVER TIME     │ │ │
│  │  │  (Donut Chart)      │ │  (Line Chart)  │ │ │
│  │  │                     │ │                │ │ │
│  │  │  ┌──────────────┐   │ │  ┌──────────┐  │ │ │
│  │  │  │   ┌─────┐    │   │ │  │  📈      │  │ │ │
│  │  │  │   │     │    │   │ │  │          │  │ │ │
│  │  │  │   │ PIE │    │   │ │  │  Line    │  │ │ │
│  │  │  │   │     │    │   │ │  │  chart   │  │ │ │
│  │  │  │   └─────┘    │   │ │  │  over    │  │ │ │
│  │  │  │              │   │ │  │  exams   │  │ │ │
│  │  │  │  📱 38%      │   │ │  │          │  │ │ │
│  │  │  │  🎧 10%      │   │ │  └──────────┘  │ │ │
│  │  │  │  ⌚ 17%      │   │ │                │ │ │
│  │  │  │  📄 34%      │   │ │  Animation:    │ │ │
│  │  │  │  📓  1%      │   │ │  Line draws    │ │ │
│  │  │  │              │   │ │  progressively │ │ │
│  │  │  └──────────────┘   │ │                │ │ │
│  │  │                     │ │                │ │ │
│  │  │  Animation:         │ │                │ │ │
│  │  │  Slices expand      │ │                │ │ │
│  │  │  from center        │ │                │ │ │
│  │  │                     │ │                │ │ │
│  │  └─────────────────────┘ └────────────────┘ │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│  ┌── SESSION HISTORY (Clay Card) ─────────────┐ │
│  │                                             │ │
│  │  📋 Past Exam Sessions                      │ │
│  │                                             │ │
│  │  ┌── Search/Filter ─────────────────────┐   │ │
│  │  │ [🔍 Search exam name...]  [📅 Date]  │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                             │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │                                      │   │ │
│  │  │  SESSION CARD (Clay, Hoverable)      │   │ │
│  │  │  ┌──────────────────────────────┐    │   │ │
│  │  │  │ 📋 Mathematics Final Exam    │    │   │ │
│  │  │  │ 📅 15 Jan 2025 │ ⏰ 2h 45m   │    │   │ │
│  │  │  │ 👥 35 Students │ 🚨 8 Alerts │    │   │ │
│  │  │  │                              │    │   │ │
│  │  │  │ Detections:                  │    │   │ │
│  │  │  │ 📱3  🎧1  ⌚0  📄2  📕0  📓2 │    │   │ │
│  │  │  │                              │    │   │ │
│  │  │  │ [👁 View Details] [📥 PDF]   │    │   │ │
│  │  │  └──────────────────────────────┘    │   │ │
│  │  │                                      │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                             │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │  SESSION CARD                        │   │ │
│  │  │  ┌──────────────────────────────┐    │   │ │
│  │  │  │ 📋 Physics Mid-Term         │    │   │ │
│  │  │  │ 📅 10 Jan 2025 │ ⏰ 1h 30m   │    │   │ │
│  │  │  │ 👥 42 Students │ 🚨 3 Alerts │    │   │ │
│  │  │  │                              │    │   │ │
│  │  │  │ Detections:                  │    │   │ │
│  │  │  │ 📱1  🎧0  ⌚1  📄0  📕0  📓1 │    │   │ │
│  │  │  │                              │    │   │ │
│  │  │  │ [👁 View Details] [📥 PDF]   │    │   │ │
│  │  │  └──────────────────────────────┘    │   │ │
│  │  │                                      │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                             │ │
│  │  Loading: Session card skeletons stacked    │ │
│  │                                             │ │
│  │  [Load More...]                             │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
│                                                  │
│  ═══ EXPANDED SESSION DETAIL (Modal/Inline) ═══ │
│                                                  │
│  ┌── SESSION DETAIL VIEW ─────────────────────┐ │
│  │                                             │ │
│  │  📋 Mathematics Final Exam                  │ │
│  │  📅 15 Jan 2025 │ ⏰ 9:00 AM - 11:45 AM    │ │
│  │                                             │ │
│  │  DETECTION TIMELINE:                        │ │
│  │  ┌─────────────────────────────────────┐    │ │
│  │  │                                     │    │ │
│  │  │  Timeline bar with markers:         │    │ │
│  │  │  ──●──────●●────────●──────●──      │    │ │
│  │  │  9:00    9:45     10:30   11:15     │    │ │
│  │  │                                     │    │ │
│  │  │  Click marker → see detection       │    │ │
│  │  │                                     │    │ │
│  │  └─────────────────────────────────────┘    │ │
│  │                                             │ │
│  │  EVIDENCE GALLERY:                          │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐          │ │
│  │  │ 📷     │ │ 📷     │ │ 📷     │          │ │
│  │  │ Phone  │ │ Chit   │ │ Watch  │          │ │
│  │  │ B3     │ │ D5     │ │ A2     │          │ │
│  │  │ 14:23  │ │ 14:35  │ │ 15:02  │          │ │
│  │  └────────┘ └────────┘ └────────┘          │ │
│  │                                             │ │
│  │  Click thumbnail → Full evidence viewer     │ │
│  │  with screenshot + AI overlay + metadata    │ │
│  │                                             │ │
│  │  FLAGGED STUDENTS:                          │ │
│  │  ┌────┬───────┬────────┬──────────┐         │ │
│  │  │ #  │ Seat  │ Score  │ Items    │         │ │
│  │  ├────┼───────┼────────┼──────────┤         │ │
│  │  │ 1  │ B3    │  78    │ 📱📱     │         │ │
│  │  │ 2  │ D5    │  52    │ 📄       │         │ │
│  │  │ 3  │ A2    │  45    │ ⌚       │         │ │
│  │  └────┴───────┴────────┴──────────┘         │ │
│  │                                             │ │
│  │  [📥 Download Full Report PDF]              │ │
│  │  [📥 Download All Evidence (ZIP)]           │ │
│  │                                             │ │
│  └─────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘


MOBILE LAYOUT:
──────────────

┌───────────────────────────┐
│  🛡️ ExamShield            │
├───────────────────────────┤
│                           │
│  STATS (Horizontal Scroll)│
│  ┌──────┐ ┌──────┐ ►     │
│  │📋 12 │ │🚨 47 │       │
│  │Sessns│ │Violtn│       │
│  └──────┘ └──────┘       │
│                           │
│  CHART (Full Width)       │
│  ┌───────────────────┐    │
│  │  Donut chart      │    │
│  │  (Swipe for next) │    │
│  └───────────────────┘    │
│                           │
│  SESSIONS (List)          │
│  ┌───────────────────┐    │
│  │📋 Math Final      │    │
│  │📅 15 Jan │ 🚨 8   │    │
│  │📱3 🎧1 ⌚0 📄2    │    │
│  │[View] [PDF]       │    │
│  ├───────────────────┤    │
│  │📋 Physics Mid     │    │
│  │📅 10 Jan │ 🚨 3   │    │
│  │📱1 🎧0 ⌚1 📄0    │    │
│  │[View] [PDF]       │    │
│  └───────────────────┘    │
│                           │
│  ┌───────────────────┐    │
│  │  📺      📤     📊  │    │
│  │  Live   Upload  Rpts│    │
│  └───────────────────┘    │
└───────────────────────────┘


INTERACTIONS ON THIS PAGE:
──────────────────────────

├── Summary Stat Cards:
│   ├── Load: Stagger fade-in (left to right)
│   ├── Numbers: Count up animation
│   ├── Hover: Lift + deeper shadow
│   └── Loading: Card skeleton shimmer
│
├── Charts:
│   ├── Donut: Slices expand from center
│   ├── Line: Draws progressively left to right
│   ├── Hover on data: Tooltip appears
│   └── Loading: Chart-shaped skeleton
│
├── Session Cards:
│   ├── Load: Stagger slide-up animation
│   ├── Hover: Lift effect + border highlight
│   ├── Click "View": Expands inline or modal
│   │   ├── Modal: Scale from 0.9 to 1.0
│   │   ├── Backdrop: Fade in
│   │   └── Content: Stagger in
│   └── Loading: Card skeleton stack
│
├── Evidence Thumbnails:
│   ├── Hover: Scale 1.05 + overlay info
│   ├── Click: Full-screen evidence viewer
│   │   ├── Image loads with skeleton first
│   │   ├── Metadata fades in
│   │   └── Close: Scale down + fade out
│   └── Gallery: Horizontal scroll on mobile
│
├── Search/Filter:
│   ├── Type: Debounced live search
│   ├── Results: Fade transition
│   └── No results: Empty state illustration
│
├── Download Buttons:
│   ├── Hover: Icon bounces
│   ├── Click: Download indicator
│   └── Complete: Checkmark animation
│
└── Load More:
    ├── Click: Button shows spinner
    ├── New items: Slide up into view
    └── All loaded: "No more" message fade in
```

---

---

---

# 📋 SECTION 6: AI/ML PIPELINE — DETAILED

---

## 6.1 Phase-Wise Detection Architecture

```
AI/ML PIPELINE ARCHITECTURE:
═════════════════════════════

VIDEO INPUT (from phone or file)
        │
        ▼
┌──────────────────────┐
│ FRAME EXTRACTION     │
│ ├── Live: 5-10 FPS   │
│ ├── Upload: 3-5 FPS  │
│ ├── Resize to 640x480│
│ └── Color correction │
└──────────┬───────────┘
           │
           ▼
╔══════════════════════════════════════╗
║                                      ║
║  PHASE 1: HEAD COUNT                 ║
║  ════════════════════                ║
║                                      ║
║  MODEL: YOLOv8n (nano) or           ║
║         YOLOv8s (small)              ║
║                                      ║
║  TASK: Detect all persons in frame   ║
║                                      ║
║  PROCESS:                            ║
║  ├── Run YOLOv8 person detection     ║
║  ├── Filter for "person" class only  ║
║  ├── Count total detections          ║
║  ├── ByteTrack assigns persistent ID ║
║  │   to each person across frames    ║
║  ├── Track person movement over time ║
║  ├── Map person to approximate seat  ║
║  │   based on bounding box position  ║
║  ├── Compare count with expected     ║
║  │   student number (if provided)    ║
║  ├── Flag if count exceeds expected  ║
║  │   (unauthorized person)           ║
║  └── Flag if count drops            ║
║      (someone left)                  ║
║                                      ║
║  OUTPUTS:                            ║
║  ├── Total person count              ║
║  ├── Person bounding boxes           ║
║  ├── Unique tracking IDs             ║
║  ├── Seat zone assignments           ║
║  ├── Count mismatch alerts           ║
║  └── Person movement history         ║
║                                      ║
║  PERFORMANCE:                        ║
║  ├── YOLOv8n: ~30 FPS on laptop GPU  ║
║  ├── YOLOv8s: ~20 FPS on laptop GPU  ║
║  └── Accuracy: 90%+ for person det.  ║
║                                      ║
╚══════════════════╤═══════════════════╝
                   │
                   ▼
╔══════════════════════════════════════╗
║                                      ║
║  PHASE 2: BEHAVIOR ANALYSIS         ║
║  ════════════════════════            ║
║                                      ║
║  MODEL: MediaPipe Face Mesh +        ║
║         MediaPipe Pose               ║
║                                      ║
║  TASK: Analyze head pose and body    ║
║        posture for suspicious        ║
║        behavior patterns             ║
║                                      ║
║  FOR EACH DETECTED PERSON:           ║
║  ─────────────────────────           ║
║                                      ║
║  A. HEAD POSE ESTIMATION:            ║
║  ├── Extract face region from bbox   ║
║  ├── Run MediaPipe Face Mesh         ║
║  ├── Get 468 face landmarks          ║
║  ├── Calculate head angles:          ║
║  │   ├── YAW: Left/right rotation    ║
║  │   │   ├── Normal: -15° to +15°    ║
║  │   │   ├── Slight turn: 15°-30°    ║
║  │   │   └── Suspicious: 30°+        ║
║  │   ├── PITCH: Up/down tilt         ║
║  │   │   ├── Normal: -10° to +10°    ║
║  │   │   ├── Looking down: -10° to   ║
║  │   │   │   -30° (checking lap?)    ║
║  │   │   └── Very down: -30°+        ║
║  │   │       (phone in lap?)         ║
║  │   └── ROLL: Side tilt             ║
║  │       └── Used for posture        ║
║  ├── Track angles over time window   ║
║  │   (last 30 seconds)              ║
║  ├── Detect SUSTAINED head turns:    ║
║  │   ├── Head turned >30° for >3 sec ║
║  │   │   = Looking at neighbor       ║
║  │   ├── Repeated turns (>3 in 60s)  ║
║  │   │   = Copying pattern           ║
║  │   └── Head down >5 sec            ║
║  │       = Possible phone/chit       ║
║  └── Calculate gaze direction        ║
║      (approximate, from face angle)  ║
║                                      ║
║  B. BODY POSTURE ANALYSIS:           ║
║  ├── Run MediaPipe Pose on person    ║
║  ├── Get 33 body keypoints           ║
║  ├── Focus on upper body:            ║
║  │   ├── Shoulders (alignment)       ║
║  │   ├── Elbows (hand position)      ║
║  │   ├── Wrists (reaching gesture?)  ║
║  │   └── Torso lean angle            ║
║  ├── Detect suspicious postures:     ║
║  │   ├── Leaning heavily toward      ║
║  │   │   adjacent seat               ║
║  │   ├── Hand extended toward        ║
║  │   │   neighbor (passing object?)  ║
║  │   ├── Arm under desk for          ║
║  │   │   extended time               ║
║  │   ├── Hand near ear (earpiece?)   ║
║  │   └── Unusual body angle          ║
║  └── Track posture changes over time ║
║                                      ║
║  C. INTERACTION DETECTION:           ║
║  ├── For each pair of adjacent       ║
║  │   tracked persons:                ║
║  ├── Check if both are facing        ║
║  │   each other simultaneously       ║
║  ├── Check for synchronized          ║
║  │   head movements                  ║
║  ├── Check for hand proximity        ║
║  │   between persons (object pass?)  ║
║  └── Flag interaction pairs          ║
║                                      ║
║  BEHAVIOR FLAGS GENERATED:           ║
║  ├── HEAD_TURN_LEFT                  ║
║  ├── HEAD_TURN_RIGHT                 ║
║  ├── HEAD_TURN_BACK                  ║
║  ├── HEAD_DOWN_SUSTAINED             ║
║  ├── REPEATED_HEAD_TURNS             ║
║  ├── LEANING_TOWARD_NEIGHBOR         ║
║  ├── HAND_NEAR_EAR                   ║
║  ├── ARM_EXTENDED_TO_NEIGHBOR        ║
║  ├── HAND_UNDER_DESK                 ║
║  ├── MUTUAL_FACING                   ║
║  └── SUSPICIOUS_POSTURE_CHANGE       ║
║                                      ║
║  PERFORMANCE:                        ║
║  ├── MediaPipe Face: ~15-25 FPS      ║
║  ├── MediaPipe Pose: ~15-20 FPS      ║
║  └── Combined: ~10-15 FPS per person ║
║      (process top-N suspicious only) ║
║                                      ║
╚══════════════════╤═══════════════════╝
                   │
                   ▼
╔══════════════════════════════════════╗
║                                      ║
║  PHASE 3: PROHIBITED ITEM DETECTION ║
║  ════════════════════════════════    ║
║                                      ║
║  MODEL: YOLOv8 Custom Trained       ║
║                                      ║
║  TASK: Detect specific prohibited    ║
║        objects associated with       ║
║        each person                   ║
║                                      ║
║  CUSTOM TRAINING REQUIRED:           ║
║  ──────────────────────────          ║
║                                      ║
║  DATASET CREATION:                   ║
║  ├── Collect images of each object   ║
║  │   type in exam-like settings      ║
║  ├── Sources for training data:      ║
║  │   ├── Self-captured (mock exam)   ║
║  │   ├── Open datasets (COCO subset)║
║  │   ├── Roboflow public datasets    ║
║  │   └── Augmented from above        ║
║  ├── Minimum per class: 300-500 imgs ║
║  ├── Label using Roboflow or LabelImg║
║  └── Total dataset: ~3000-5000 images║
║                                      ║
║  DETECTION CLASSES (7 Classes):      ║
║  ─────────────────────────────       ║
║                                      ║
║  CLASS 1: mobile_phone               ║
║  ├── Training images: phones in hand,║
║  │   on desk, partially hidden,      ║
║  │   in lap, screen glowing          ║
║  ├── Various phone models/colors     ║
║  ├── Different angles and lighting   ║
║  └── ~500 labeled images             ║
║                                      ║
║  CLASS 2: earphone                   ║
║  ├── Wired earphones (cable visible) ║
║  ├── Wireless earbuds (AirPods-like) ║
║  ├── In ear, in hand, on desk       ║
║  ├── Various colors (white, black)   ║
║  └── ~400 labeled images             ║
║                                      ║
║  CLASS 3: smart_watch                ║
║  ├── Watch on wrist (screen lit)     ║
║  ├── Student looking at watch        ║
║  ├── Various watch types             ║
║  └── ~300 labeled images             ║
║                                      ║
║  CLASS 4: chit_slip                  ║
║  ├── Small paper in hand             ║
║  ├── Paper being passed              ║
║  ├── Folded paper/chit               ║
║  ├── Paper hidden under sheet        ║
║  └── ~400 labeled images             ║
║                                      ║
║  CLASS 5: textbook                   ║
║  ├── Open textbook on desk           ║
║  ├── Book partially visible          ║
║  ├── Book in lap                     ║
║  ├── Book cover visible              ║
║  └── ~400 labeled images             ║
║                                      ║
║  CLASS 6: notebook                   ║
║  ├── Extra notebook on desk          ║
║  ├── Notebook being referenced       ║
║  ├── Spiral notebook visible         ║
║  ├── Handwritten notes visible       ║
║  └── ~350 labeled images             ║
║                                      ║
║  CLASS 7: electronic_device          ║
║  ├── Tablets                         ║
║  ├── Calculators (if prohibited)     ║
║  ├── Any unidentified electronics    ║
║  ├── Recording devices               ║
║  └── ~300 labeled images             ║
║                                      ║
║  TRAINING CONFIGURATION:             ║
║  ├── Base model: YOLOv8s pretrained  ║
║  ├── Fine-tune on custom dataset     ║
║  ├── Epochs: 100-200                 ║
║  ├── Image size: 640x640             ║
║  ├── Batch size: 16                  ║
║  ├── Augmentations:                  ║
║  │   ├── Random flip                 ║
║  │   ├── Rotation (±15°)            ║
║  │   ├── Brightness/contrast         ║
║  │   ├── Scale (0.5x-1.5x)          ║
║  │   ├── Mosaic augmentation         ║
║  │   └── Mixup augmentation          ║
║  ├── Optimizer: AdamW                ║
║  └── Training time: ~2-4 hours       ║
║      (on laptop GPU)                 ║
║                                      ║
║  INFERENCE PROCESS:                  ║
║  ├── Run custom YOLOv8 on each frame ║
║  ├── Get all detected objects        ║
║  ├── For each detected object:       ║
║  │   ├── Class label (what is it)    ║
║  │   ├── Confidence score            ║
║  │   ├── Bounding box coordinates    ║
║  │   └── Associate with nearest      ║
║  │       person (from Phase 1)       ║
║  ├── Filter: confidence > 0.5       ║
║  └── Generate violation event        ║
║                                      ║
║  PERFORMANCE:                        ║
║  ├── YOLOv8s custom: ~15-20 FPS      ║
║  ├── Expected mAP: 75-85%            ║
║  └── False positive rate: <15%       ║
║                                      ║
╚══════════════════╤═══════════════════╝
                   │
                   ▼
┌──────────────────────────────────────┐
│  COMBINED BEHAVIOR CLASSIFIER       │
│  ─────────────────────────────       │
│                                      │
│  INPUTS:                             │
│  ├── Phase 1: Person tracking data   │
│  ├── Phase 2: Behavior flags         │
│  └── Phase 3: Object detections      │
│                                      │
│  FUSION LOGIC (Rule-Based):          │
│  ├── Head down + phone detected      │
│  │   = PHONE_USAGE (high confidence) │
│  │                                   │
│  ├── Hand near ear + earphone det.   │
│  │   = EARPIECE_USAGE (high conf)    │
│  │                                   │
│  ├── Head turn + no object           │
│  │   = LOOKING_AT_NEIGHBOR (med)     │
│  │                                   │
│  ├── Arm extended + chit detected    │
│  │   = PASSING_CHIT (high conf)      │
│  │                                   │
│  ├── Head down + textbook/notebook   │
│  │   = USING_NOTES (high conf)       │
│  │                                   │
│  ├── Looking at wrist + watch det.   │
│  │   = SMARTWATCH_USAGE (high conf)  │
│  │                                   │
│  └── Multiple flags + objects        │
│      = COMBINED_VIOLATION (critical) │
│                                      │
│  OUTPUT → SCORING ENGINE             │
│                                      │
└──────────────────┬───────────────────┘
                   │
                   ▼
┌──────────────────────────────────────┐
│  SCORING ENGINE                      │
│  ──────────────                      │
│                                      │
│  (Same scoring system as described   │
│   in Section 3.3 of this document)   │
│                                      │
│  Per student (tracked by ID):        │
│  ├── Accumulate points per violation │
│  ├── Apply confidence weighting      │
│  ├── Apply cooldown timers           │
│  ├── Apply decay for clean behavior  │
│  ├── Evaluate against thresholds     │
│  └── Generate alert level            │
│                                      │
│  OUTPUT → Web Dashboard via WebSocket│
│                                      │
└──────────────────────────────────────┘
```

---

## 6.2 Model Optimization Strategy

```
MODEL OPTIMIZATION FOR EMBEDDED:
═════════════════════════════════

Since we run on laptop/embedded device,
optimization is important:

1. MODEL SELECTION:
   ├── Use YOLOv8n (nano) for real-time
   │   if GPU is weak
   ├── Use YOLOv8s (small) for better
   │   accuracy if GPU is decent
   └── Avoid YOLOv8m/l/x (too heavy)

2. INTEL OpenVINO OPTIMIZATION:
   ├── Convert PyTorch → OpenVINO IR format
   ├── 2-3x speedup on Intel CPUs
   ├── Useful for laptops without NVIDIA GPU
   └── Free and open-source

3. ONNX RUNTIME:
   ├── Export YOLOv8 to ONNX format
   ├── Cross-platform acceleration
   ├── GPU and CPU support
   └── Easier deployment

4. NVIDIA TensorRT:
   ├── If laptop has NVIDIA GPU
   ├── Convert to TensorRT engine
   ├── 3-5x speedup
   └── Best inference performance

5. FRAME SKIP STRATEGY:
   ├── Don't process every frame
   ├── Process every 2nd or 3rd frame
   ├── Interpolate results between
   └── Maintains tracking accuracy

6. SELECTIVE PROCESSING:
   ├── Phase 2 (MediaPipe) only on
   │   persons near alert threshold
   ├── Phase 3 (Object det.) on
   │   full frame but skip if no
   │   behavior flags
   └── Prioritize suspicious regions

7. RESOLUTION MANAGEMENT:
   ├── Phase 1: Full frame 640x480
   ├── Phase 2: Cropped person region
   ├── Phase 3: Full frame 640x480
   └── Evidence: Full resolution
```

---

---

---

# 📋 SECTION 7: SOFTWARE TECHNOLOGY STACK

---

```
COMPLETE SOFTWARE STACK:
════════════════════════

BACKEND:
────────
┌──────────────────────────────────────────┐
│  Language:    Python 3.10+               │
│  Framework:   FastAPI                    │
│  License:     MIT (commercial free)      │
│                                          │
│  WHY FastAPI:                            │
│  ├── Fastest Python web framework        │
│  ├── Built-in WebSocket support          │
│  ├── Async capable (non-blocking)        │
│  ├── Auto-generated API docs             │
│  ├── Perfect for ML serving              │
│  └── Type-safe with Pydantic             │
│                                          │
│  AI/ML Libraries:                        │
│  ├── ultralytics (YOLOv8) — AGPL        │
│  ├── mediapipe — Apache 2.0             │
│  ├── opencv-python — Apache 2.0         │
│  ├── numpy — BSD                        │
│  ├── torch/torchvision — BSD            │
│  └── supervision (ByteTrack) — MIT      │
│                                          │
│  Other Backend:                          │
│  ├── SQLAlchemy (ORM) — MIT             │
│  ├── Pydantic (validation) — MIT        │
│  ├── python-multipart (upload) — Apache │
│  ├── websockets — BSD                   │
│  ├── aiofiles — Apache                  │
│  ├── Pillow (images) — HPND            │
│  ├── reportlab (PDF) — BSD              │
│  └── uvicorn (ASGI server) — BSD        │
│                                          │
└──────────────────────────────────────────┘


FRONTEND:
─────────
┌──────────────────────────────────────────┐
│  Framework:   React.js 18+               │
│  License:     MIT (commercial free)      │
│                                          │
│  UI Libraries:                           │
│  ├── Tailwind CSS — MIT                  │
│  │   (utility-first CSS framework)       │
│  │   (perfect for claymorphism custom)   │
│  │                                       │
│  ├── Framer Motion — MIT                 │
│  │   (animations, transitions, hover)    │
│  │                                       │
│  ├── Lucide React — ISC                  │
│  │   (commercial icons)                  │
│  │                                       │
│  ├── Recharts — MIT                      │
│  │   (charts: pie, line, bar)            │
│  │                                       │
│  ├── React Router — MIT                  │
│  │   (page navigation)                   │
│  │                                       │
│  └── React Dropzone — MIT               │
│      (drag & drop file upload)           │
│                                          │
│  Fonts (Google Fonts — free commercial): │
│  ├── Plus Jakarta Sans (headings)        │
│  ├── Inter (body text)                   │
│  └── JetBrains Mono (numbers/code)       │
│                                          │
│  Build Tool: Vite — MIT                  │
│  (fast React build tool)                 │
│                                          │
└──────────────────────────────────────────┘


DATABASE:
─────────
┌──────────────────────────────────────────┐
│  Primary:    SQLite                      │
│  License:    Public Domain               │
│                                          │
│  WHY SQLite:                             │
│  ├── Zero configuration                  │
│  ├── File-based (portable)               │
│  ├── Perfect for embedded systems        │
│  ├── No separate server needed           │
│  ├── Handles our data volume easily      │
│  └── Upgrade to PostgreSQL if needed     │
│                                          │
│  TABLES:                                 │
│  ├── exam_sessions                       │
│  ├── detections                          │
│  ├── student_scores                      │
│  ├── alerts                              │
│  ├── evidence_files                      │
│  └── system_config                       │
│                                          │
└──────────────────────────────────────────┘


FILE STORAGE:
─────────────
┌──────────────────────────────────────────┐
│  Location:   Local filesystem            │
│                                          │
│  Structure:                              │
│  /data/                                  │
│  ├── /uploads/     (uploaded videos)     │
│  ├── /evidence/                          │
│  │   ├── /screenshots/  (detection imgs) │
│  │   └── /clips/        (video clips)    │
│  ├── /models/      (AI model files)      │
│  ├── /reports/     (generated PDFs)      │
│  └── /db/          (SQLite database)     │
│                                          │
└──────────────────────────────────────────┘


COMMUNICATION:
──────────────
┌──────────────────────────────────────────┐
│  Real-Time:  WebSocket                   │
│  ├── Server pushes updates to dashboard  │
│  ├── Detection events                    │
│  ├── Score updates                       │
│  ├── Alert notifications                 │
│  └── Video feed frames (processed)       │
│                                          │
│  API:        REST (FastAPI)              │
│  ├── Upload video                        │
│  ├── Get session data                    │
│  ├── Get reports                         │
│  ├── Configuration                       │
│  └── Evidence download                   │
│                                          │
│  Video Stream: HTTP MJPEG or WebSocket   │
│  ├── Processed frames sent to browser    │
│  ├── AI overlay drawn on frames          │
│  └── Browser displays in <img> or canvas │
│                                          │
└──────────────────────────────────────────┘


TOTAL SOFTWARE COST: $0
───────────────────────
All open-source, all commercially usable.
```

---

---

---

# 📋 SECTION 8: PHASE-WISE DEVELOPMENT PLAN

---

```
DEVELOPMENT PHASES:
═══════════════════

PHASE A: FOUNDATION (Weeks 1-3)
─────────────────────────────────

Week 1: Environment Setup
├── Install Python, Node.js, CUDA drivers
├── Set up project structure
├── Install all libraries
├── Set up Git repository
├── Configure VS Code / IDE
└── Test YOLOv8 basic inference

Week 2: Video Input System
├── Build OpenCV video capture module
├── Implement RTSP/HTTP stream reader
│   (for mobile camera connection)
├── Implement file upload reader
├── Build frame queue/buffer system
├── Test with phone IP camera app
└── Test with sample video files

Week 3: Backend Foundation
├── Set up FastAPI project structure
├── Create database schema (SQLite)
├── Build REST API endpoints (basic)
├── Set up WebSocket server
├── Build file upload endpoint
└── Test API with Postman/curl


PHASE B: AI PIPELINE (Weeks 4-8)
──────────────────────────────────

Week 4: Phase 1 — Head Count
├── Integrate YOLOv8 person detection
├── Implement ByteTrack person tracking
├── Build person counting logic
├── Implement seat zone mapping
├── Build count mismatch detection
└── Test and validate accuracy

Week 5: Phase 2 — Behavior (Part 1)
├── Integrate MediaPipe Face Mesh
├── Implement head pose angle extraction
├── Build yaw/pitch/roll calculation
├── Implement head turn detection logic
├── Build temporal tracking (time windows)
└── Test head movement detection

Week 6: Phase 2 — Behavior (Part 2)
├── Integrate MediaPipe Pose
├── Implement body keypoint extraction
├── Build posture analysis logic
├── Implement interaction detection
│   between adjacent persons
├── Build behavior flag generation
└── Test and validate behavior analysis

Week 7: Phase 3 — Object Detection (Part 1)
├── Collect training dataset
│   ├── Capture images in mock exam setup
│   ├── Download relevant public datasets
│   └── Aim for 3000+ images
├── Label all images (Roboflow/LabelImg)
│   with 7 classes
├── Prepare dataset (train/val/test split)
└── Begin YOLOv8 custom training

Week 8: Phase 3 — Object Detection (Part 2)
├── Complete model training
├── Evaluate model (mAP, precision, recall)
├── Fine-tune if needed (adjust augmentations)
├── Integrate custom model into pipeline
├── Build object-to-person association
├── Build combined behavior classifier
│   (fusion logic from all 3 phases)
├── Implement scoring engine
└── End-to-end AI pipeline testing


PHASE C: WEB PLATFORM (Weeks 9-13)
────────────────────────────────────

Week 9: Frontend Foundation
├── Set up React + Vite + Tailwind
├── Configure fonts (Jakarta Sans, Inter)
├── Set up Lucide icons
├── Build claymorphism component library:
│   ├── Clay Card component
│   ├── Clay Button component
│   ├── Clay Input component
│   ├── Clay Badge component
│   └── Clay Navigation component
├── Implement light theme + color palette
├── Build responsive layout framework
└── Set up Framer Motion

Week 10: Page 1 — Live Monitor
├── Build camera connection panel
├── Build video feed display component
│   (receiving processed frames via WebSocket)
├── Build detection panel (head count +
│   object detection counters)
├── Build alert feed (scrollable list)
├── Build score overview table
├── Build phase indicator
├── Implement loading skeletons for all areas
├── Add hover effects and animations
├── Mobile responsive adjustments
└── WebSocket integration for real-time data

Week 11: Page 2 — Upload & Analyze
├── Build drag-and-drop upload zone
├── Build exam detail input form
├── Build upload progress component
├── Build processing progress component
│   (phase indicators, progress bar, ETA)
├── Build current frame preview
├── Build running stats display
├── Build results view (stat cards grid)
├── Build flagged students table
├── Implement loading skeletons
├── Mobile responsive adjustments
└── REST API integration for upload/results

Week 12: Page 3 — Reports & History
├── Build summary stats cards row
├── Build charts (donut + line) with Recharts
├── Build session history list with search
├── Build session detail view (modal/inline)
├── Build evidence gallery with thumbnails
├── Build detection timeline component
├── Build PDF download functionality
├── Implement loading skeletons
├── Mobile responsive adjustments
└── REST API integration for history data

Week 13: Frontend Polish
├── Final animation tuning
├── Loading skeleton refinement
├── Hover effect consistency check
├── Mobile testing on real devices
├── Cross-browser testing
├── Performance optimization
│   (lazy loading, code splitting)
├── Accessibility improvements
└── Error states and empty states design


PHASE D: INTEGRATION & TESTING (Weeks 14-16)
──────────────────────────────────────────────

Week 14: Full Integration
├── Connect all backend endpoints to frontend
├── WebSocket real-time flow testing
├── Video upload → processing → results flow
├── Live camera → detection → alert flow
├── Evidence capture and storage
├── PDF report generation
└── End-to-end flow validation

Week 15: Testing
├── Unit tests for AI pipeline
├── Unit tests for API endpoints
├── Integration tests (upload → process → report)
├── Mock exam simulation (volunteer students)
├── Measure detection accuracy per class
├── Measure false positive rate
├── Measure latency (detection → alert)
├── Performance testing (concurrent users)
└── Mobile responsiveness testing

Week 16: Optimization & Documentation
├── AI model optimization (if needed)
│   ├── ONNX export
│   ├── Quantization
│   └── Frame skip tuning
├── Frontend performance optimization
├── Bug fixes from testing
├── Write user documentation
├── Write technical documentation
├── Prepare demo video
├── Prepare presentation materials
└── Final system packaging


TOTAL TIMELINE: 16 WEEKS (~4 MONTHS)
─────────────────────────────────────

PHASE SUMMARY:
├── Phase A: Foundation      │ 3 weeks
├── Phase B: AI Pipeline     │ 5 weeks
├── Phase C: Web Platform    │ 5 weeks
├── Phase D: Integration     │ 3 weeks
└── TOTAL                    │ 16 weeks
```

---

---

---

# 📋 SECTION 9: SYSTEM WORKING (Step-by-Step)

---

```
COMPLETE SYSTEM WORKING FLOW:
═════════════════════════════

SCENARIO 1: LIVE MONITORING (Using Phone Camera)
─────────────────────────────────────────────────

STEP 1: SETUP (Before Exam)
├── Place laptop on invigilator desk or corner
├── Open web browser → go to ExamShield dashboard
├── Install "IP Webcam" app on smartphone
├── Mount phone on tripod/stand facing students
├── Start IP Webcam app → note the URL shown
├── Enter expected student count (optional)
└── System ready

STEP 2: CONNECT CAMERA
├── On Page 1 (Live Monitor), enter stream URL
├── Click "Connect Camera"
├── Dashboard shows "Connecting..." skeleton
├── Connection established → live feed appears
├── AI processing begins automatically
└── Phase indicators show all phases active

STEP 3: MONITORING (During Exam — Automatic)
├── System processes frames continuously
├── PHASE 1 runs: Counts students, tracks each
├── PHASE 2 runs: Monitors head movements,
│   body posture for each tracked person
├── PHASE 3 runs: Scans for phones, earphones,
│   watches, chits, textbooks, notebooks
├── Scoring engine accumulates points
├── Dashboard updates in real-time via WebSocket:
│   ├── Video feed shows AI overlay
│   │   (bounding boxes, labels, scores)
│   ├── Head count updates
│   ├── Detection counters update
│   ├── Alert feed shows new violations
│   └── Score table highlights flagged students

STEP 4: ALERT RECEIVED
├── Student B3 caught with phone (score hits 61)
├── Alert card slides into alert feed: 🔴 RED
├── Alert shows: "PHONE DETECTED — Seat B3"
├── Evidence screenshot auto-captured
├── Invigilator sees alert on their device
│   (phone/tablet browser also shows dashboard)
├── Invigilator walks to seat B3 to investigate
└── Alert stays in feed for record

STEP 5: EXAM ENDS
├── Click "Stop Monitoring" on dashboard
├── System generates session summary
├── All detections saved with evidence
├── Navigate to Page 3 (Reports) to see results
├── Download PDF report if needed
└── Session archived in history


SCENARIO 2: VIDEO UPLOAD ANALYSIS
──────────────────────────────────

STEP 1: NAVIGATE TO UPLOAD PAGE
├── Open Page 2 (Upload & Analyze)
├── Drag and drop video file onto upload zone
│   OR click "Browse Files" to select video
├── Enter exam name and expected student count
└── Click "Start Analysis"

STEP 2: UPLOAD
├── Upload progress bar fills (shows %)
├── File transferred to server
├── Upload complete → processing begins
└── Upload zone transforms to processing view

STEP 3: PROCESSING
├── Progress bar shows overall completion
├── Phase indicators show which phase active:
│   ├── Phase 1 (Head Count): ✅ → 🔄 → ✅
│   ├── Phase 2 (Behavior): ⏳ → 🔄 → ✅
│   └── Phase 3 (Objects): ⏳ → 🔄 → ✅
├── Current frame preview updates periodically
├── Running stats update as detections found
├── Timeline markers appear for each violation
└── ETA countdown shows estimated time remaining

STEP 4: RESULTS
├── Processing complete → results view appears
├── Summary stat cards animate in (count up)
├── Violation breakdown by type shown
├── Flagged students table populated
├── Click "View Details" for any student →
│   see evidence screenshots + violation timeline
├── Click "View Full Report" → comprehensive view
├── Click "Download PDF" → report downloads
└── Session saved in Reports history (Page 3)

STEP 5: REVIEW (Page 3)
├── Navigate to Reports & History
├── New session appears in session list
├── Click to expand and see full details
├── Evidence gallery shows all captured images
├── Detection timeline shows when violations
│   occurred in the video
├── Charts update with new session data
└── Download evidence ZIP if needed
```

---

---

---

# 📋 SECTION 10: OUTPUTS

---

```
SYSTEM FINAL OUTPUTS:
═════════════════════

OUTPUT 1: LIVE MONITORING DASHBOARD (Page 1)
├── Real-time video feed with AI overlay
│   ├── Bounding boxes around persons
│   ├── Bounding boxes around detected objects
│   ├── Labels (phone, earphone, chit, etc.)
│   ├── Confidence percentage on each detection
│   └── Color coding (green=normal, red=alert)
├── Live head count with mismatch warning
├── Detection counters per object type
├── Alert feed with priority levels
├── Score overview table
└── Phase activity indicators

OUTPUT 2: VIDEO ANALYSIS RESULTS (Page 2)
├── Processing progress with phase tracking
├── Summary statistics (counts per category)
├── Flagged student list with scores
├── Evidence screenshots per detection
├── Detection timeline
└── Downloadable results

OUTPUT 3: REPORTS & ANALYTICS (Page 3)
├── Historical session list with search
├── Violation type distribution chart
├── Violations over time trend chart
├── Session detail view with evidence gallery
├── Detection timeline per session
├── Summary statistics across all sessions
└── Downloadable PDF reports

OUTPUT 4: EVIDENCE PACKAGE (Per Detection)
├── Screenshot with AI bounding box overlay
├── Detection metadata:
│   ├── Timestamp
│   ├── Person tracking ID
│   ├── Estimated seat zone
│   ├── Violation type
│   ├── Object class detected
│   ├── AI confidence score
│   └── Current suspicion score
└── Linked to exam session

OUTPUT 5: PDF REPORT (Per Exam Session)
├── Exam details (name, date, duration)
├── Total students detected
├── Violation summary by category:
│   ├── Phones detected: X
│   ├── Earphones detected: X
│   ├── Smart watches detected: X
│   ├── Chits/slips detected: X
│   ├── Textbooks detected: X
│   ├── Notebooks detected: X
│   └── Electronic devices detected: X
├── Behavior violations:
│   ├── Suspicious head turns: X
│   ├── Leaning/interaction: X
│   └── Passing gestures: X
├── Flagged students table
│   (ID, seat, score, top violation, count)
├── System metrics
│   (processing time, frames analyzed)
└── Evidence index (reference to screenshots)
```

---

---

---

# 📋 SECTION 11: ADVANTAGES

---

```
ADVANTAGES OF REVISED SYSTEM:
═════════════════════════════

SIMPLICITY ADVANTAGES:
├── A1: Only 3 web pages (easy to use)
├── A2: No IoT hardware to assemble/maintain
├── A3: No sensor nodes to calibrate
├── A4: No MQTT broker to manage
├── A5: Use existing phone as camera
├── A6: Use existing laptop as processor
├── A7: Minimal setup time (minutes, not hours)
├── A8: Single-device deployment
└── A9: Anyone can operate (invigilator-friendly)

AI/ML ADVANTAGES:
├── A10: 7-class object detection covers
│        all common prohibited items
├── A11: 3-phase analysis (count → behavior
│        → objects) is comprehensive
├── A12: Point-based scoring reduces
│        false alarm notifications
├── A13: Temporal analysis (sustained behavior
│        vs momentary) improves accuracy
├── A14: Person tracking links all detections
│        to specific individuals
├── A15: Confidence weighting prevents
│        low-quality detections from alerting
└── A16: Open-source models (YOLOv8, MediaPipe)
         continuously improving

MOBILE INTEGRATION:
├── A17: Phone camera = instant deployment
│        (no waiting for hardware delivery)
├── A18: Multiple phones = multiple angles
├── A19: Invigilator can monitor from
│        their own phone browser
├── A20: Responsive web = works on any device
└── A21: No app installation required

VIDEO UPLOAD:
├── A22: Post-exam analysis capability
├── A23: Can process old exam recordings
├── A24: No real-time pressure (thorough analysis)
├── A25: Evidence preparation for committees
└── A26: Training data collection for AI improvement

UI/UX ADVANTAGES:
├── A27: Claymorphism = modern, professional look
├── A28: Light theme = comfortable for long use
├── A29: Loading skeletons = perceived performance
├── A30: Smooth animations = polished experience
├── A31: Commercial-grade typography
├── A32: Spacious layout = easy scanning
├── A33: Hover effects = interactive feel
└── A34: Responsive = works everywhere

COST ADVANTAGES:
├── A35: Hardware cost: $0 (use existing devices)
├── A36: Software cost: $0 (all open-source)
├── A37: No recurring license fees
├── A38: No cloud dependency
├── A39: No vendor lock-in
└── A40: Total deployment: essentially $0
         for a student project

EMBEDDED SYSTEM VALUE:
├── A41: Qualifies as embedded system project
│        (dedicated single-purpose computer
│         processing specific input continuously)
├── A42: Real-time processing constraint
├── A43: Hardware-software co-design
├── A44: Resource optimization required
└── A45: Practical, deployable system
```

---

---

---

# 📋 SECTION 12: APPLICATIONS

---

```
REAL-WORLD APPLICATIONS:
════════════════════════

Same applications as original plan apply.
The simplified system is EVEN MORE deployable
because of lower requirements:

TIER 1: IMMEDIATE APPLICATIONS
├── University semester exams
├── College internal exams
├── School annual exams
├── Coaching center tests
└── Any classroom exam with a phone and laptop

TIER 2: SCALED APPLICATIONS
├── Board examination centers
├── Competitive exam centers
├── Professional certification
├── Government recruitment exams
└── Corporate training assessments

TIER 3: EXTENDED APPLICATIONS
├── Online exam proctoring (webcam-based)
├── Library monitoring
├── Classroom discipline monitoring
├── Training session attention tracking
└── Workshop compliance monitoring

KEY ADVANTAGE FOR DEPLOYMENT:
├── Developing countries with budget constraints
├── Rural schools with minimal infrastructure
├── Temporary exam centers (rented halls)
├── Pop-up testing centers
└── Any location with WiFi and a phone

---

# 📋 SECTION 14: DOCUMENT SUMMARY

---

```
═══════════════════════════════════════════════
              REVISED PLAN SUMMARY
═══════════════════════════════════════════════

SYSTEM: ExamShield AI — Smart Examination
        Integrity System (Revised)

TYPE: Embedded System Project with AI/ML

WHAT WE REMOVED:
├── All IoT sensor nodes
├── All ESP32 microcontrollers
├── All environmental sensors
├── MQTT protocol
├── Sensor fusion engine
├── All sensor-related hardware
└── Complex multi-device architecture

WHAT WE KEPT & ENHANCED:
├── AI Computer Vision (core)
├── Mobile phone as camera
├── Video upload processing
├── Web-based dashboard
├── Phase-wise detection
├── Scoring engine
└── Evidence management

INPUT METHODS:
├── Method 1: Mobile phone camera (live)
└── Method 2: Video file upload (post-exam)

AI PIPELINE (3 Phases):
├── Phase 1: Head Count (YOLOv8 + ByteTrack)
├── Phase 2: Behavior Analysis (MediaPipe)
└── Phase 3: Prohibited Item Detection
    (YOLOv8 Custom — 7 classes)
    ├── Mobile phones
    ├── Earphones / earbuds
    ├── Smart watches
    ├── Chits / paper slips
    ├── Textbooks
    ├── Notebooks
    └── Electronic devices

WEBSITE: 3 Pages Only
├── Page 1: Live Monitor
├── Page 2: Upload & Analyze
└── Page 3: Reports & History

DESIGN:
├── Theme: Claymorphism (Light)
├── Fonts: Plus Jakarta Sans + Inter
├── Icons: Lucide Icons (commercial free)
├── Animations: Framer Motion
├── Loading: Skeleton shimmer everywhere
├── Hover: Lift + shadow on all interactive
├── Responsive: Mobile + Tablet + Laptop
└── Spacious: 8px grid, generous whitespace

TECHNOLOGY STACK:
├── AI: YOLOv8 + MediaPipe + ByteTrack
├── Backend: FastAPI (Python)
├── Frontend: React.js + Tailwind CSS
├── Database: SQLite
├── Real-Time: WebSocket
└── All: Open-source, commercially usable

HARDWARE:
├── Processing: Existing laptop ($0)
├── Camera: Existing smartphone ($0)
└── Total: ~$5-$10 for project

TIMELINE: 16 weeks (~4 months)
├── Phase A: Foundation (3 weeks)
├── Phase B: AI Pipeline (5 weeks)
├── Phase C: Web Platform (5 weeks)
└── Phase D: Integration (3 weeks)

COST: $5-$10 (student project)
      $500-$1,100 (institutional deployment)

═══════════════════════════════════════════════
              END OF REVISED PLAN
═══════════════════════════════════════════════
```

---

This complete revised plan gives you everything needed to build, present, and deploy the ExamShield AI system as an embedded system project with AI/ML capabilities, mobile camera integration, video upload processing, and a beautiful 3-page claymorphism web platform — all within practical budget and timeline constraints.

