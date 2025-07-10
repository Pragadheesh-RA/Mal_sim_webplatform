import * as tf from '@tensorflow/tfjs';
import { MalwareAnalysis, MLFeatures } from '../types';

export class MLService {
  private model: tf.LayersModel | null = null;
  private selectedFeatures: string[] = [
    'entropy',
    'apiUsageScore',
    'packedProbability',
    'suspiciousStrings',
    'importCount'
  ];

  // Function to normalize input features
  private normalizeFeatures(features: Record<string, number>): number[] {
    return this.selectedFeatures.map(feature => {
      const value = features[feature];
      // Apply the same normalization logic as your Python scaler
      return Math.max(0, Math.min(1, value));
    });
  }

  // Function to load your ML model
  async loadModel() {
    try {
      // For demo purposes, we'll create a simple model
      // In production, you would load your converted Random Forest model
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ inputShape: [5], units: 10, activation: 'relu' }),
          tf.layers.dense({ units: 1, activation: 'sigmoid' })
        ]
      });
      
      // Compile the model
      this.model.compile({
        optimizer: 'adam',
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      console.log('Model initialized successfully');
    } catch (error) {
      console.error('Error loading model:', error);
      throw error;
    }
  }

  // Function to make predictions
  async predict(features: MLFeatures) {
    try {
      const normalizedFeatures = this.normalizeFeatures(features);
      
      // For demo purposes, we'll use a simple heuristic
      // In production, this would use the actual model prediction
      const riskScore = normalizedFeatures.reduce((acc, val) => acc + val, 0) / normalizedFeatures.length;
      
      return {
        result: riskScore > 0.5 ? 'Malware' : 'Benign' as 'Malware' | 'Benign',
        confidence: Math.abs(riskScore - 0.5) * 200, // Convert to percentage
        featureImpact: Object.fromEntries(
          this.selectedFeatures.map((feature, i) => [feature, normalizedFeatures[i]])
        )
      };
    } catch (error) {
      console.error('Error making prediction:', error);
      throw error;
    }
  }

  // Function to analyze file and get predictions
  async analyzeMalware(file: File): Promise<MalwareAnalysis> {
    try {
      // Extract features from the file
      const features = await this.extractFeatures(file);
      
      // Make prediction
      const { result, confidence, featureImpact } = await this.predict(features);
      
      // Generate complete analysis
      return {
        id: `mal-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        threatLevel: result === 'Malware' ? 'high' : 'low',
        confidence,
        detectedMalwareTypes: result === 'Malware' ? ['Unknown Malware'] : [],
        signatures: this.generateSignatures(featureImpact),
        systemImpact: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 100,
          disk: Math.random() * 100,
          processes: Math.floor(Math.random() * 100)
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: Math.floor(Math.random() * 200),
            modified: Math.floor(Math.random() * 50),
            created: Math.floor(Math.random() * 20),
            deleted: Math.floor(Math.random() * 10)
          },
          network: {
            connections: Math.floor(Math.random() * 50),
            dataTransferred: Math.floor(Math.random() * 2000000),
            suspiciousIPs: Math.floor(Math.random() * 10),
            protocols: ['HTTP', 'HTTPS', 'DNS', 'TCP']
          },
          registry: {
            modifications: Math.floor(Math.random() * 50),
            creations: Math.floor(Math.random() * 20),
            deletions: Math.floor(Math.random() * 5)
          }
        },
        mlFeatures: features,
        logs: this.generateLogs(file.name, features),
        recommendations: this.generateRecommendations(result === 'Malware')
      };
    } catch (error) {
      console.error('Error analyzing file:', error);
      throw error;
    }
  }

  // Extract features from file
  private async extractFeatures(file: File): Promise<MLFeatures> {
    // In a real implementation, you would analyze the file content
    // For now, we'll generate random features
    return {
      entropy: Math.random() * 8,
      sectionCount: Math.floor(Math.random() * 10) + 1,
      importCount: Math.floor(Math.random() * 200) + 50,
      stringCount: Math.floor(Math.random() * 2000) + 500,
      suspiciousStrings: Math.floor(Math.random() * 30),
      packedProbability: Math.random(),
      apiUsageScore: Math.random()
    };
  }

  private generateSignatures(featureImpact: Record<string, number>) {
    return Object.entries(featureImpact)
      .filter(([_, impact]) => impact > 0.5)
      .map(([feature, impact]) => ({
        name: `High ${feature}`,
        description: `Suspicious level of ${feature} detected`,
        matched: true,
        severity: impact > 0.8 ? 'critical' : impact > 0.6 ? 'high' : 'medium',
        matchCount: Math.floor(impact * 20)
      }));
  }

  private generateLogs(filename: string, features: MLFeatures) {
    const now = Date.now();
    return [
      {
        timestamp: new Date(now - 5000).toISOString(),
        level: 'info',
        message: `Started analysis of ${filename}`,
        module: 'scanner'
      },
      {
        timestamp: new Date(now - 4000).toISOString(),
        level: 'info',
        message: 'Performing static analysis',
        module: 'static'
      },
      {
        timestamp: new Date(now - 3000).toISOString(),
        level: features.apiUsageScore > 0.7 ? 'warning' : 'info',
        message: `API usage score: ${features.apiUsageScore.toFixed(2)}`,
        module: 'behavior'
      },
      {
        timestamp: new Date(now - 2000).toISOString(),
        level: features.entropy > 7 ? 'warning' : 'info',
        message: `Entropy level: ${features.entropy.toFixed(2)}`,
        module: 'static'
      },
      {
        timestamp: new Date(now - 1000).toISOString(),
        level: features.packedProbability > 0.8 ? 'error' : 'info',
        message: `Packed probability: ${features.packedProbability.toFixed(2)}`,
        module: 'static'
      }
    ];
  }

  private generateRecommendations(isMalware: boolean) {
    if (!isMalware) {
      return [
        {
          action: 'monitor',
          priority: 'low',
          description: 'Continue monitoring system for suspicious activity'
        }
      ];
    }

    return [
      {
        action: 'isolate',
        priority: 'high',
        description: 'Isolate affected system from network'
      },
      {
        action: 'backup',
        priority: 'medium',
        description: 'Create backup of critical data'
      },
      {
        action: 'monitor',
        priority: 'medium',
        description: 'Monitor system for additional suspicious activity'
      }
    ];
  }
}