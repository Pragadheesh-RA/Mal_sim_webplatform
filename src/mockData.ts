import { MalwareAnalysis } from './types';

export const mockAnalysis: MalwareAnalysis = {
  id: "mal-001",
  filename: "suspicious_file.exe",
  timestamp: new Date().toISOString(),
  threatLevel: "low",
  confidence: 0,
  detectedMalwareTypes: [],
  signatures: [],
  systemImpact: {
    cpu: 0,
    memory: 0,
    network: 0,
    disk: 0,
    processes: 0
  },
  behaviorAnalysis: {
    fileSystem: {
      accessed: 0,
      modified: 0,
      created: 0,
      deleted: 0
    },
    network: {
      connections: 0,
      dataTransferred: 0,
      suspiciousIPs: 0,
      protocols: []
    },
    registry: {
      modifications: 0,
      creations: 0,
      deletions: 0
    }
  },
  mlFeatures: {
    entropy: 0,
    sectionCount: 0,
    importCount: 0,
    stringCount: 0,
    suspiciousStrings: 0,
    packedProbability: 0,
    apiUsageScore: 0
  },
  logs: [],
  recommendations: []
};

export const historicalData = [
  { timestamp: '2024-03-01', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-02', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-03', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-04', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-05', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-06', malwareCount: 0, threatLevel: 'low' },
  { timestamp: '2024-03-07', malwareCount: 0, threatLevel: 'low' }
];