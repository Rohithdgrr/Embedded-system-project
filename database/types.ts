
export enum AlertLevel {
  STABLE = 'STABLE',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export type DetectionType = 
  | 'PHONE' 
  | 'EARPHONE' 
  | 'WATCH' 
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
  earphone: number;
  watch: number;
  chit: number;
  textbook: number;
  notebook: number;
  device: number;
  detectedCount: number;
  expectedCount: number;
}

export interface AnalysisResult {
  alerts: Omit<ProctorAlert, 'id' | 'timestamp' | 'screenshot'>[];
  overallIntegrityScore: number;
  stats: Omit<DetectionStats, 'expectedCount'>;
}

export interface ExamSession {
  id: string;
  name: string;
  date: string;
  duration: string;
  alerts: number;
  students: number;
  detections: {
    phone: number;
    earphone: number;
    watch: number;
    chit: number;
    [key: string]: number;
  };
}
