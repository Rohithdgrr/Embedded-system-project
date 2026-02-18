const AI_SERVER_URL = 'http://localhost:5000';

export interface HeadPose {
  yaw: number;
  pitch: number;
  roll: number;
  looking_away: boolean;
  looking_down: boolean;
  head_turn: boolean;
  bbox: number[];
}

export interface AIDetection {
  frame_number: number;
  timestamp: number;
  detections: Array<{
    class: string;
    exam_type?: string;
    confidence: number;
    raw_confidence?: number;
    bbox: number[];
  }>;
  person_count: number;
  prohibited_items: Array<{
    class: string;
    exam_type?: string;
    confidence: number;
    raw_confidence?: number;
    bbox: number[];
  }>;
  behaviors: Array<{
    type: string;
    confidence: number;
    yaw?: number;
    pitch?: number;
    distance?: number;
  }>;
  head_poses?: HeadPose[];
  annotated_frame?: string;
}

export interface HealthStatus {
  status: string;
  model_loaded: boolean;
  mediapipe_loaded: boolean;
  stream_active: boolean;
  webcam_active: boolean;
  current_stream: string | null;
}

export interface CameraDevice {
  index: number;
  name: string;
  resolution: string;
}

// Violation point threshold — email is sent once total points exceed this
export const VIOLATION_EMAIL_THRESHOLD = 50;

export const aiService = {
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${AI_SERVER_URL}/health`);
      return response.ok;
    } catch {
      return false;
    }
  },

  async getHealthDetails(): Promise<HealthStatus | null> {
    try {
      const response = await fetch(`${AI_SERVER_URL}/health`);
      if (response.ok) return response.json();
      return null;
    } catch {
      return null;
    }
  },

  async listCameras(): Promise<CameraDevice[]> {
    try {
      const response = await fetch(`${AI_SERVER_URL}/cameras`);
      if (response.ok) {
        const data = await response.json();
        return data.cameras || [];
      }
      return [];
    } catch {
      return [];
    }
  },

  // ── Webcam (Laptop Camera) ──────────────────────────────────────

  async startWebcam(cameraIndex: number = 0): Promise<{ status: string; message: string }> {
    const response = await fetch(`${AI_SERVER_URL}/webcam/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ camera_index: cameraIndex })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to start webcam');
    }
    return data;
  },

  async stopWebcam(): Promise<void> {
    await fetch(`${AI_SERVER_URL}/webcam/stop`, { method: 'POST' });
  },

  async getWebcamFrame(): Promise<{ frame: string; result: AIDetection }> {
    const response = await fetch(`${AI_SERVER_URL}/webcam/frame`);
    if (!response.ok) {
      throw new Error('No webcam frame available');
    }
    return response.json();
  },

  getWebcamMjpegUrl(): string {
    return `${AI_SERVER_URL}/webcam/mjpeg`;
  },

  // ── IP Camera / DroidCam ────────────────────────────────────────

  async startStream(streamUrl: string): Promise<void> {
    const response = await fetch(`${AI_SERVER_URL}/stream/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stream_url: streamUrl })
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to start stream');
    }
  },

  async stopStream(): Promise<void> {
    await fetch(`${AI_SERVER_URL}/stream/stop`, { method: 'POST' });
  },

  async getFrame(): Promise<{ frame: string; result: AIDetection }> {
    const response = await fetch(`${AI_SERVER_URL}/stream/frame`);
    if (!response.ok) {
      throw new Error('No frame available');
    }
    return response.json();
  },

  getMjpegUrl(): string {
    return `${AI_SERVER_URL}/stream/mjpeg`;
  },

  // ── Single Frame Analysis ──────────────────────────────────────

  async analyzeImage(base64Image: string): Promise<AIDetection> {
    const response = await fetch(`${AI_SERVER_URL}/detect/frame`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image })
    });

    if (!response.ok) {
      throw new Error('Failed to analyze frame');
    }

    return response.json();
  },

  // ── Alert / Score Helpers ──────────────────────────────────────

  convertDetectionsToAlerts(result: AIDetection): Array<{
    type: string;
    seat: string;
    level: string;
    description: string;
    confidence: number;
    score: number;
  }> {
    const alerts: Array<{
      type: string;
      seat: string;
      level: string;
      description: string;
      confidence: number;
      score: number;
    }> = [];

    const examTypeToScore: Record<string, number> = {
      'PHONE': 30,
      'CHIT': 25,
      'TEXTBOOK': 30,
      'NOTEBOOK': 25,
      'DEVICE': 20,
    };

    // Fallback: old COCO class name -> type mapping
    const classToType: Record<string, string> = {
      'cell phone': 'PHONE',
      'book': 'TEXTBOOK',
      'notebook': 'NOTEBOOK',
      'remote': 'DEVICE',
      'laptop': 'DEVICE',
      'tv': 'DEVICE',
      'scissors': 'CHIT',
    };

    // Friendly labels for each exam type
    const typeLabels: Record<string, string> = {
      'PHONE': 'Mobile Phone',
      'CHIT': 'Chit/Paper Note',
      'TEXTBOOK': 'Textbook',
      'NOTEBOOK': 'Notebook',
      'DEVICE': 'Electronic Device',
    };

    // Skip earphone & watch detections entirely
    const SKIP_TYPES = new Set(['EARPHONE', 'WATCH', 'EARPHONE_CANDIDATE', 'WATCH_CANDIDATE']);

    let seatCounter = 65;
    for (const item of result.prohibited_items) {
      const type = item.exam_type || classToType[item.class] || 'DEVICE';

      // Skip earphone / watch
      if (SKIP_TYPES.has(type)) continue;

      const score = examTypeToScore[type] || 15;
      const level = score >= 30 ? 'HIGH' : score >= 20 ? 'MEDIUM' : 'LOW';
      const label = typeLabels[type] || item.class;

      if (item.confidence >= 0.20) {
        alerts.push({
          type,
          seat: String.fromCharCode(seatCounter++) + '1',
          level,
          description: `${label} detected with ${(item.confidence * 100).toFixed(0)}% confidence`,
          confidence: item.confidence,
          score
        });
      }
    }

    for (const behavior of result.behaviors) {
      if (behavior.type === 'PROXIMITY_ALERT') {
        alerts.push({
          type: 'MULTIPLE_PEOPLE',
          seat: 'SEAT-A1',
          level: 'HIGH',
          description: 'Students sitting too close together',
          confidence: behavior.confidence,
          score: 20
        });
      } else if (behavior.type === 'HEAD_TURN') {
        alerts.push({
          type: 'HEAD_TURN',
          seat: 'SEAT-A1',
          level: 'HIGH',
          description: `Head turned away (yaw: ${behavior.yaw?.toFixed(0)}°)`,
          confidence: behavior.confidence,
          score: 20
        });
      } else if (behavior.type === 'LOOKING_DOWN') {
        alerts.push({
          type: 'LEANING',
          seat: 'SEAT-A1',
          level: 'MEDIUM',
          description: `Looking down (pitch: ${behavior.pitch?.toFixed(0)}°)`,
          confidence: behavior.confidence,
          score: 15
        });
      } else if (behavior.type === 'LOOKING_AWAY') {
        alerts.push({
          type: 'HEAD_TURN',
          seat: 'SEAT-A1',
          level: 'MEDIUM',
          description: `Looking away (yaw: ${behavior.yaw?.toFixed(0)}°)`,
          confidence: behavior.confidence,
          score: 15
        });
      }
    }

    return alerts;
  },

  calculateIntegrityScore(result: AIDetection): number {
    let score = 100;

    for (const item of result.prohibited_items) {
      const examType = item.exam_type || 'DEVICE';
      if (examType === 'EARPHONE' || examType === 'WATCH') continue;
      const deductions: Record<string, number> = {
        'PHONE': 20,
        'CHIT': 18,
        'TEXTBOOK': 20,
        'NOTEBOOK': 15,
        'DEVICE': 12,
      };
      score -= (deductions[examType] || 10);
    }

    for (const behavior of result.behaviors) {
      if (behavior.type === 'PROXIMITY_ALERT') score -= 10;
      else if (behavior.type === 'HEAD_TURN') score -= 12;
      else if (behavior.type === 'LOOKING_DOWN') score -= 5;
      else if (behavior.type === 'LOOKING_AWAY') score -= 8;
    }

    if (result.person_count > 20) {
      score -= 5;
    }

    return Math.max(0, Math.min(100, score));
  },

  getDetectionStats(result: AIDetection) {
    const stats = {
      phone: 0,
      chit: 0,
      textbook: 0,
      notebook: 0,
      device: 0,
      headTurn: 0,
      leaning: 0,
      multiplePeople: 0,
      detectedCount: result.person_count
    };

    for (const item of result.prohibited_items) {
      const examType = item.exam_type;

      if (examType) {
        switch (examType) {
          case 'PHONE': stats.phone++; break;
          case 'CHIT': stats.chit++; break;
          case 'TEXTBOOK': stats.textbook++; break;
          case 'NOTEBOOK': stats.notebook++; break;
          case 'DEVICE': stats.device++; break;
          // EARPHONE & WATCH are intentionally skipped
          default: stats.device++; break;
        }
      } else {
        switch (item.class) {
          case 'cell phone': stats.phone++; break;
          case 'book': stats.textbook++; break;
          case 'notebook': stats.notebook++; break;
          default: stats.device++; break;
        }
      }
    }

    // Count behavioral detections
    for (const behavior of result.behaviors) {
      switch (behavior.type) {
        case 'HEAD_TURN': stats.headTurn++; break;
        case 'LOOKING_DOWN': stats.leaning++; break;
        case 'LOOKING_AWAY': stats.headTurn++; break;
        case 'PROXIMITY_ALERT': stats.multiplePeople++; break;
      }
    }

    return stats;
  }
};
