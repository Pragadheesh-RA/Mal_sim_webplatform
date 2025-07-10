export type ThreatLevel = 'low' | 'medium' | 'high' | 'critical';
export type LogLevel = 'info' | 'warning' | 'error';
export type ModuleType = 'scanner' | 'static' | 'behavior' | 'network';
export type ActionPriority = 'low' | 'medium' | 'high';

export interface MalwareSignature {
  name: string;
  description: string;
  matched: boolean;
  severity: ThreatLevel;
  matchCount: number;
}

export interface SystemImpact {
  cpu: number;
  memory: number;
  network: number;
  disk: number;
  processes: number;
}

export interface BehaviorAnalysis {
  fileSystem: {
    accessed: number;
    modified: number;
    created: number;
    deleted: number;
  };
  network: {
    connections: number;
    dataTransferred: number;
    suspiciousIPs: number;
    protocols: string[];
  };
  registry: {
    modifications: number;
    creations: number;
    deletions: number;
  };
}

export interface MLFeatures {
  entropy: number;
  sectionCount: number;
  importCount: number;
  stringCount: number;
  suspiciousStrings: number;
  packedProbability: number;
  apiUsageScore: number;
}

export interface Log {
  timestamp: string;
  level: LogLevel;
  message: string;
  module: ModuleType;
}

export interface Recommendation {
  action: string;
  priority: ActionPriority;
  description: string;
}

export interface MalwareAnalysis {
  id: string;
  filename: string;
  timestamp: string;
  threatLevel: ThreatLevel;
  confidence: number;
  detectedMalwareTypes: string[];
  signatures: MalwareSignature[];
  systemImpact: SystemImpact;
  behaviorAnalysis: BehaviorAnalysis;
  mlFeatures: MLFeatures;
  logs: Log[];
  recommendations: Recommendation[];
}

export interface HistoricalData {
  timestamp: string;
  malwareCount: number;
  threatLevel: ThreatLevel;
}