export type UserRole = 'user' | 'analyst' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  birthDate?: string;
  zodiacSign?: string;
  dominantHand: 'left' | 'right';
  intention?: string;
  createdAt: string;
}

export interface Landmark2D {
  x: number; // 0..1 normalized or px
  y: number;
  z?: number;
  name?: string;
}

export interface PalmLineDetected {
  id: string;
  name: string;
  displayName: string;
  color: string;
  points: Landmark2D[];
  lengthRatio: number;
  depthScore: number; // 0..100
  curvature: number;
  branchCount: number;
  clarityConfidence: number; // 0..100
  typeVariationKey: string;
  title: string;
  meaning: string;
}

export interface HandLandmarkResult {
  landmarks: Landmark2D[];
  palmCenter: Landmark2D;
  handOrientation: 'Left' | 'Right';
  palmShape: 'Earth' | 'Air' | 'Fire' | 'Water';
  fingerRatios: {
    thumb: number;
    index: number;
    middle: number;
    ring: number;
    pinky: number;
  };
  overallConfidence: number; // 0..100
}

export interface PalmAnalysisResult {
  handLandmarks: HandLandmarkResult;
  lines: PalmLineDetected[];
  palmClass: string;
  featureScores: {
    vitality: number;
    logic: number;
    creativity: number;
    empathy: number;
    ambition: number;
    intuition: number;
  };
  processedImageUrl?: string;
  timestamp: string;
}

export interface TarotCardData {
  id: string;
  name: string;
  arcana: 'Major' | 'Minor';
  number: number;
  element: string;
  keywords: string[];
  imageUrl?: string;
  meanings: {
    upright: {
      general: string;
      career: string;
      relationship: string;
      finance: string;
      health: string;
    };
    reversed: {
      general: string;
      career: string;
      relationship: string;
      finance: string;
      health: string;
    };
  };
}

export interface SelectedTarotCard {
  card: TarotCardData;
  isReversed: boolean;
  positionName: string;
  positionDescription: string;
}

export interface TarotSpreadResult {
  spreadName: string;
  cards: SelectedTarotCard[];
  overallEnergy: string;
  elementalBalance: Record<string, number>;
  timestamp: string;
}

export interface IntegratedReadingReport {
  id: string;
  userId: string;
  title: string;
  timestamp: string;
  palmAnalysis: PalmAnalysisResult;
  tarotSpread: TarotSpreadResult;
  spiritualGuidanceScore: number; // 0..100
  confidenceScore: number; // 0..100
  archetype: {
    title: string;
    element: string;
    traits: string;
    description: string;
  };
  radarMetrics: {
    intuition: number;
    ambition: number;
    empathy: number;
    logic: number;
    resilience: number;
    creativity: number;
  };
  lifeTrends: {
    pastTrajectory: number;
    presentMomentum: number;
    futurePotential: number;
    timeline: { period: string; focus: string; score: number }[];
  };
  domainGuidance: {
    career: { score: number; text: string; actionPoints: string[] };
    relationships: { score: number; text: string; actionPoints: string[] };
    finance: { score: number; text: string; actionPoints: string[] };
    health: { score: number; text: string; actionPoints: string[] };
    personalGrowth: { score: number; text: string; actionPoints: string[] };
  };
  riskIndicators: string[];
  recommendations: {
    title: string;
    action: string;
    timeline: string;
    impact: 'High' | 'Transformative' | 'Medium';
  }[];
}

export interface DatasetSummary {
  category: string;
  folderPath: string;
  fileCount: number;
  sampleClasses: string[];
  status: 'Ready' | 'Import Pending' | 'Training Active';
  lastUpdated: string;
}

export interface ModelMetadata {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  version: string;
  weightsPath: string;
  status: 'Loaded' | 'Evaluating' | 'Training';
  lastTrained: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  role: UserRole;
  details: string;
  status: 'Success' | 'Warning' | 'Error';
}
