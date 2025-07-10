import { MalwareAnalysis } from '../types';

export class DatabaseService {
  private storageKey = 'malware_analyses';

  // Get all analyses from localStorage
  async getAllAnalyses(): Promise<MalwareAnalysis[]> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const analyses = JSON.parse(stored);
        return Array.isArray(analyses) ? analyses : [];
      }
      
      // If no data exists, create some sample data
      const sampleData = this.generateSampleData();
      await this.saveAnalyses(sampleData);
      return sampleData;
    } catch (error) {
      console.error('Error loading analyses:', error);
      return [];
    }
  }

  // Save analysis to localStorage
  async saveAnalysis(analysis: MalwareAnalysis): Promise<void> {
    try {
      const existing = await this.getAllAnalyses();
      const updated = [analysis, ...existing];
      await this.saveAnalyses(updated);
    } catch (error) {
      console.error('Error saving analysis:', error);
      throw error;
    }
  }

  // Delete analysis by ID
  async deleteAnalysis(id: string): Promise<void> {
    try {
      const existing = await this.getAllAnalyses();
      const filtered = existing.filter(analysis => analysis.id !== id);
      await this.saveAnalyses(filtered);
    } catch (error) {
      console.error('Error deleting analysis:', error);
      throw error;
    }
  }

  // Get analysis by ID
  async getAnalysisById(id: string): Promise<MalwareAnalysis | null> {
    try {
      const analyses = await this.getAllAnalyses();
      return analyses.find(analysis => analysis.id === id) || null;
    } catch (error) {
      console.error('Error getting analysis by ID:', error);
      return null;
    }
  }

  // Save all analyses to localStorage
  private async saveAnalyses(analyses: MalwareAnalysis[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(analyses));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      throw error;
    }
  }

  // Generate sample data for demonstration
  private generateSampleData(): MalwareAnalysis[] {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    
    return [
      {
        id: 'mal-001',
        filename: 'suspicious_installer.exe',
        timestamp: new Date(now - oneDay * 1).toISOString(),
        threatLevel: 'high',
        confidence: 87,
        detectedMalwareTypes: ['Trojan', 'Backdoor'],
        signatures: [
          {
            name: 'Suspicious API Calls',
            description: 'Detected unusual system API usage patterns',
            matched: true,
            severity: 'high',
            matchCount: 15
          },
          {
            name: 'Registry Modification',
            description: 'Attempts to modify critical registry keys',
            matched: true,
            severity: 'critical',
            matchCount: 8
          }
        ],
        systemImpact: {
          cpu: 45,
          memory: 67,
          network: 23,
          disk: 1024000,
          processes: 12
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: 156,
            modified: 23,
            created: 8,
            deleted: 3
          },
          network: {
            connections: 12,
            dataTransferred: 2048000,
            suspiciousIPs: 3,
            protocols: ['HTTP', 'HTTPS', 'TCP']
          },
          registry: {
            modifications: 15,
            creations: 5,
            deletions: 2
          }
        },
        mlFeatures: {
          entropy: 7.2,
          sectionCount: 6,
          importCount: 145,
          stringCount: 1234,
          suspiciousStrings: 23,
          packedProbability: 0.85,
          apiUsageScore: 0.78
        },
        logs: [],
        recommendations: [
          {
            action: 'isolate',
            priority: 'high',
            description: 'Immediately isolate the affected system'
          },
          {
            action: 'scan',
            priority: 'high',
            description: 'Perform full system antivirus scan'
          }
        ]
      },
      {
        id: 'mal-002',
        filename: 'document_macro.docx',
        timestamp: new Date(now - oneDay * 2).toISOString(),
        threatLevel: 'medium',
        confidence: 65,
        detectedMalwareTypes: ['Macro Virus'],
        signatures: [
          {
            name: 'Macro Detection',
            description: 'Document contains potentially malicious macros',
            matched: true,
            severity: 'medium',
            matchCount: 3
          }
        ],
        systemImpact: {
          cpu: 12,
          memory: 34,
          network: 8,
          disk: 512000,
          processes: 3
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: 45,
            modified: 5,
            created: 2,
            deleted: 0
          },
          network: {
            connections: 2,
            dataTransferred: 128000,
            suspiciousIPs: 1,
            protocols: ['HTTP']
          },
          registry: {
            modifications: 3,
            creations: 1,
            deletions: 0
          }
        },
        mlFeatures: {
          entropy: 4.8,
          sectionCount: 3,
          importCount: 67,
          stringCount: 567,
          suspiciousStrings: 8,
          packedProbability: 0.32,
          apiUsageScore: 0.45
        },
        logs: [],
        recommendations: [
          {
            action: 'quarantine',
            priority: 'medium',
            description: 'Quarantine the document file'
          },
          {
            action: 'monitor',
            priority: 'low',
            description: 'Monitor system for unusual activity'
          }
        ]
      },
      {
        id: 'mal-003',
        filename: 'system_utility.exe',
        timestamp: new Date(now - oneDay * 3).toISOString(),
        threatLevel: 'low',
        confidence: 25,
        detectedMalwareTypes: [],
        signatures: [],
        systemImpact: {
          cpu: 8,
          memory: 16,
          network: 2,
          disk: 256000,
          processes: 1
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: 23,
            modified: 1,
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
          entropy: 3.2,
          sectionCount: 4,
          importCount: 34,
          stringCount: 234,
          suspiciousStrings: 2,
          packedProbability: 0.15,
          apiUsageScore: 0.22
        },
        logs: [],
        recommendations: [
          {
            action: 'monitor',
            priority: 'low',
            description: 'Continue monitoring system activity'
          }
        ]
      },
      {
        id: 'mal-004',
        filename: 'crypto_miner.exe',
        timestamp: new Date(now - oneDay * 4).toISOString(),
        threatLevel: 'critical',
        confidence: 95,
        detectedMalwareTypes: ['Cryptocurrency Miner', 'Trojan'],
        signatures: [
          {
            name: 'Mining Pool Connection',
            description: 'Detected connection to known mining pools',
            matched: true,
            severity: 'critical',
            matchCount: 25
          },
          {
            name: 'High CPU Usage',
            description: 'Excessive CPU utilization detected',
            matched: true,
            severity: 'high',
            matchCount: 18
          },
          {
            name: 'Process Injection',
            description: 'Attempts to inject code into system processes',
            matched: true,
            severity: 'critical',
            matchCount: 12
          }
        ],
        systemImpact: {
          cpu: 95,
          memory: 78,
          network: 45,
          disk: 2048000,
          processes: 8
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: 234,
            modified: 45,
            created: 12,
            deleted: 5
          },
          network: {
            connections: 25,
            dataTransferred: 5120000,
            suspiciousIPs: 8,
            protocols: ['TCP', 'UDP', 'HTTP']
          },
          registry: {
            modifications: 23,
            creations: 8,
            deletions: 3
          }
        },
        mlFeatures: {
          entropy: 8.1,
          sectionCount: 8,
          importCount: 234,
          stringCount: 2345,
          suspiciousStrings: 45,
          packedProbability: 0.92,
          apiUsageScore: 0.89
        },
        logs: [],
        recommendations: [
          {
            action: 'isolate',
            priority: 'high',
            description: 'Immediately disconnect from network'
          },
          {
            action: 'terminate',
            priority: 'high',
            description: 'Terminate all related processes'
          },
          {
            action: 'scan',
            priority: 'high',
            description: 'Perform comprehensive system scan'
          }
        ]
      },
      {
        id: 'mal-005',
        filename: 'update_checker.exe',
        timestamp: new Date(now - oneDay * 5).toISOString(),
        threatLevel: 'low',
        confidence: 18,
        detectedMalwareTypes: [],
        signatures: [],
        systemImpact: {
          cpu: 5,
          memory: 12,
          network: 15,
          disk: 128000,
          processes: 1
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: 12,
            modified: 0,
            created: 0,
            deleted: 0
          },
          network: {
            connections: 3,
            dataTransferred: 64000,
            suspiciousIPs: 0,
            protocols: ['HTTPS']
          },
          registry: {
            modifications: 0,
            creations: 0,
            deletions: 0
          }
        },
        mlFeatures: {
          entropy: 2.8,
          sectionCount: 3,
          importCount: 28,
          stringCount: 156,
          suspiciousStrings: 1,
          packedProbability: 0.08,
          apiUsageScore: 0.15
        },
        logs: [],
        recommendations: [
          {
            action: 'allow',
            priority: 'low',
            description: 'File appears to be legitimate'
          }
        ]
      }
    ];
  }

  // Clear all data (for testing)
  async clearAllData(): Promise<void> {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('Error clearing data:', error);
      throw error;
    }
  }

  // Get statistics
  async getStatistics(): Promise<{
    total: number;
    threats: number;
    avgConfidence: number;
    recentScans: number;
    threatDistribution: Record<string, number>;
  }> {
    try {
      const analyses = await this.getAllAnalyses();
      const total = analyses.length;
      const threats = analyses.filter(a => a.threatLevel === 'high' || a.threatLevel === 'critical').length;
      const avgConfidence = total > 0 
        ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / total)
        : 0;
      const recentScans = analyses.filter(a => 
        new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
      ).length;

      const threatDistribution: Record<string, number> = {};
      analyses.forEach(a => {
        threatDistribution[a.threatLevel] = (threatDistribution[a.threatLevel] || 0) + 1;
      });

      return {
        total,
        threats,
        avgConfidence,
        recentScans,
        threatDistribution
      };
    } catch (error) {
      console.error('Error getting statistics:', error);
      return {
        total: 0,
        threats: 0,
        avgConfidence: 0,
        recentScans: 0,
        threatDistribution: {}
      };
    }
  }
}