
export interface ExamSession {
  id: string;
  name: string;
  date: string;
  duration: string;
  alerts: number;
}

export enum AlertLevel {
  STABLE = 'STABLE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type DetectionType =
  | 'PHONE'
  | 'CHIT'
  | 'TEXTBOOK'
  | 'NOTEBOOK'
  | 'DEVICE'
  | 'HEAD_TURN'
  | 'LEANING'
  | 'MULTIPLE_PEOPLE'
  | 'NO_PERSON';

export interface ProctorAlert {
  id: string;
  timestamp: Date;
  type: DetectionType;
  seat: string;
  level: AlertLevel;
  description: string;
  confidence: number;
  score: number;
  screenshot?: string;
}

export interface DetectionStats {
  phone: number;
  chit: number;
  textbook: number;
  notebook: number;
  device: number;
  headTurn: number;
  leaning: number;
  multiplePeople: number;
  detectedCount: number;
  expectedCount: number;
}

export interface AnalysisResult {
  alerts: Omit<ProctorAlert, 'id' | 'timestamp' | 'screenshot'>[];
  overallIntegrityScore: number;
  stats: Omit<DetectionStats, 'expectedCount'>;
}

export interface VideoAnalysisSummary {
  studentCount: number;
  totalViolations: number;
  criticalStudents: number;
  stats: Omit<DetectionStats, 'expectedCount' | 'detectedCount'>;
  flaggedStudents: {
    rank: number;
    seat: string;
    score: number;
    topViolation: string;
  }[];
}

export interface AIDetection {
  person_count: number;
  prohibited_items: {
    exam_type?: string;
    class?: string;
  }[];
  behaviors: {
    type: string;
  }[];
}

export function getDetectionStats(result: AIDetection): DetectionStats {
  const stats: DetectionStats = {
    phone: 0,
    chit: 0,
    textbook: 0,
    notebook: 0,
    device: 0,
    headTurn: 0,
    leaning: 0,
    multiplePeople: 0,
    detectedCount: result.person_count,
    expectedCount: 0,
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
