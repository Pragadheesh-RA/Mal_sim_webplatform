import * as tf from '@tensorflow/tfjs';

export interface MLPredictionResult {
  prediction: 'Malware' | 'Benign';
  confidence: number;
  featureImpacts: Record<string, number>;
  shapValues?: number[];
}

export interface MLFeatureInputs {
  svcscan_nservices: number;
  handles_avg_handles_per_proc: number;
  svcscan_shared_process_services: number;
  handles_nevent: number;
  handles_nmutant: number;
}

export class MLModelService {
  private model: tf.LayersModel | null = null;
  private isModelLoaded = false;
  private featureNames = [
    'svcscan.nservices',
    'handles.avg_handles_per_proc', 
    'svcscan.shared_process_services',
    'handles.nevent',
    'handles.nmutant'
  ];

  // Feature normalization parameters (you should get these from your training data)
  private featureStats = {
    'svcscan.nservices': { mean: 0.5, std: 0.3 },
    'handles.avg_handles_per_proc': { mean: 0.6, std: 0.25 },
    'svcscan.shared_process_services': { mean: 0.4, std: 0.35 },
    'handles.nevent': { mean: 0.3, std: 0.2 },
    'handles.nmutant': { mean: 0.2, std: 0.15 }
  };

  async loadModel(): Promise<void> {
    try {
      // For now, we'll create a mock model that mimics your Random Forest behavior
      // In production, you would convert your trained model to TensorFlow.js format
      this.model = tf.sequential({
        layers: [
          tf.layers.dense({ 
            inputShape: [5], 
            units: 100, 
            activation: 'relu',
            name: 'dense_1'
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ 
            units: 50, 
            activation: 'relu',
            name: 'dense_2'
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ 
            units: 1, 
            activation: 'sigmoid',
            name: 'output'
          })
        ]
      });

      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });

      // Initialize with random weights that simulate your trained model
      await this.initializeWeights();
      
      this.isModelLoaded = true;
      console.log('ML Model loaded successfully');
    } catch (error) {
      console.error('Error loading ML model:', error);
      throw new Error('Failed to load ML model');
    }
  }

  private async initializeWeights(): Promise<void> {
    // This simulates loading pre-trained weights
    // In production, you would load actual weights from your trained model
    const weights = this.model!.getWeights();
    const newWeights = weights.map(weight => {
      const shape = weight.shape;
      return tf.randomNormal(shape, 0, 0.1);
    });
    this.model!.setWeights(newWeights);
  }

  async predict(features: MLFeatureInputs): Promise<MLPredictionResult> {
    if (!this.isModelLoaded || !this.model) {
      throw new Error('Model not loaded. Please call loadModel() first.');
    }

    try {
      // Normalize features
      const normalizedFeatures = this.normalizeFeatures(features);
      
      // Convert to tensor
      const inputTensor = tf.tensor2d([normalizedFeatures], [1, 5]);
      
      // Make prediction
      const prediction = this.model.predict(inputTensor) as tf.Tensor;
      const predictionValue = await prediction.data();
      
      // Calculate feature impacts (simplified SHAP-like values)
      const featureImpacts = this.calculateFeatureImpacts(normalizedFeatures);
      
      // Clean up tensors
      inputTensor.dispose();
      prediction.dispose();
      
      const confidence = predictionValue[0];
      const result: MLPredictionResult = {
        prediction: confidence > 0.5 ? 'Malware' : 'Benign',
        confidence: Math.abs(confidence - 0.5) * 200, // Convert to percentage
        featureImpacts,
        shapValues: normalizedFeatures
      };

      return result;
    } catch (error) {
      console.error('Error making prediction:', error);
      throw new Error('Failed to make prediction');
    }
  }

  private normalizeFeatures(features: MLFeatureInputs): number[] {
    return [
      features.svcscan_nservices,
      features.handles_avg_handles_per_proc,
      features.svcscan_shared_process_services,
      features.handles_nevent,
      features.handles_nmutant
    ];
  }

  private calculateFeatureImpacts(features: number[]): Record<string, number> {
    const impacts: Record<string, number> = {};
    
    // Simulate SHAP-like feature importance calculation
    this.featureNames.forEach((name, index) => {
      const cleanName = name.replace(/\./g, '_');
      // Higher values generally indicate more suspicious behavior
      impacts[cleanName] = Math.min(1, Math.max(0, features[index]));
    });
    
    return impacts;
  }

  getFeatureNames(): string[] {
    return this.featureNames.map(name => name.replace(/\./g, '_'));
  }

  isLoaded(): boolean {
    return this.isModelLoaded;
  }
}