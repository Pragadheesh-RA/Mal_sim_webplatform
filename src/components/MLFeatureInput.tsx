import React, { useState, useEffect } from 'react';
import { Brain, AlertTriangle, Check, Loader, BarChart3, FileText, Home } from 'lucide-react';
import { MLModelService, MLFeatureInputs, MLPredictionResult } from '../services/mlModelService';
import { useNavigate } from 'react-router-dom';
import PredictionModal from './PredictionModal';

const mlModelService = new MLModelService();

interface FeatureConfig {
  key: keyof MLFeatureInputs;
  label: string;
  description: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

const featureConfigs: FeatureConfig[] = [
  {
    key: 'svcscan_nservices',
    label: 'SvcScan Services',
    description: 'Number of services detected by service scan (normalized 0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'normalized'
  },
  {
    key: 'handles_avg_handles_per_proc',
    label: 'Avg Handles per Process',
    description: 'Average number of handles per process (normalized 0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'normalized'
  },
  {
    key: 'svcscan_shared_process_services',
    label: 'Shared Process Services',
    description: 'Number of services sharing processes (normalized 0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'normalized'
  },
  {
    key: 'handles_nevent',
    label: 'Event Handles',
    description: 'Number of event handles (normalized 0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'normalized'
  },
  {
    key: 'handles_nmutant',
    label: 'Mutant Handles',
    description: 'Number of mutant handles (normalized 0-1)',
    min: 0,
    max: 1,
    step: 0.01,
    unit: 'normalized'
  }
];

const MLFeatureInput: React.FC = () => {
  const navigate = useNavigate();
  const [features, setFeatures] = useState<MLFeatureInputs>({
    svcscan_nservices: 0,
    handles_avg_handles_per_proc: 0,
    svcscan_shared_process_services: 0,
    handles_nevent: 0,
    handles_nmutant: 0
  });

  const [isModelLoading, setIsModelLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [modelError, setModelError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<MLPredictionResult | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const initializeModel = async () => {
      try {
        setIsModelLoading(true);
        await mlModelService.loadModel();
        setIsModelLoading(false);
      } catch (error) {
        console.error('Error loading model:', error);
        setModelError('Failed to load ML model. Please refresh the page.');
        setIsModelLoading(false);
      }
    };

    initializeModel();
  }, []);

  const handleFeatureChange = (key: keyof MLFeatureInputs, value: number) => {
    setFeatures(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handlePredict = async () => {
    if (!mlModelService.isLoaded()) {
      setModelError('Model not loaded. Please refresh the page.');
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await mlModelService.predict(features);
      setPrediction(result);
      setShowModal(true);

      // Dispatch custom event to update dashboard
      const event = new CustomEvent('mlPredictionComplete', {
        detail: { prediction: result, features }
      });
      window.dispatchEvent(event);
    } catch (error) {
      console.error('Prediction error:', error);
      setModelError('Error making prediction. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleViewDetails = () => {
    if (prediction) {
      setShowModal(false);
      navigate('/results', { 
        state: { 
          prediction, 
          features,
          timestamp: new Date().toISOString()
        } 
      });
    }
  };

  const resetFeatures = () => {
    setFeatures({
      svcscan_nservices: 0,
      handles_avg_handles_per_proc: 0,
      svcscan_shared_process_services: 0,
      handles_nevent: 0,
      handles_nmutant: 0
    });
    setPrediction(null);
  };

  const loadSampleData = (type: 'malware' | 'benign') => {
    if (type === 'malware') {
      // Sample data that typically indicates malware
      setFeatures({
        svcscan_nservices: 0.5,
        handles_avg_handles_per_proc: 1.0,
        svcscan_shared_process_services: 0.5,
        handles_nevent: 0.2,
        handles_nmutant: 1.0
      });
    } else {
      // Sample data that typically indicates benign software
      setFeatures({
        svcscan_nservices: 0.1,
        handles_avg_handles_per_proc: 0.1,
        svcscan_shared_process_services: 0.5,
        handles_nevent: 0.2,
        handles_nmutant: 0.1
      });
    }
  };

  if (isModelLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-16 h-16 animate-spin mx-auto mb-6 text-purple-400" />
          <h2 className="text-2xl font-bold text-gray-200 mb-2">Loading ML Model</h2>
          <p className="text-gray-400">Initializing Random Forest Classifier...</p>
          <div className="mt-4 w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (modelError) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-red-400" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Model Loading Error</h2>
          <p className="text-gray-400 mb-6">{modelError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Reload Page
            </button>
            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Home className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-200">ML Feature Analysis</h1>
                <p className="text-gray-400">Random Forest Malware Prediction System</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => loadSampleData('benign')}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm"
            >
              Load Benign Sample
            </button>
            <button
              onClick={() => loadSampleData('malware')}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
            >
              Load Malware Sample
            </button>
            <button
              onClick={resetFeatures}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors text-sm"
            >
              Reset All
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="dashboard-card p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature Input Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Feature Input (Top 5 Features)
              </h2>
              
              {featureConfigs.map((config) => (
                <div key={config.key} className="bg-gray-800/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-gray-200 font-medium">
                      {config.label}
                    </label>
                    <span className="text-purple-400 font-mono text-lg bg-gray-700 px-3 py-1 rounded">
                      {features[config.key].toFixed(2)}
                    </span>
                  </div>
                  
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    step={config.step}
                    value={features[config.key]}
                    onChange={(e) => handleFeatureChange(config.key, parseFloat(e.target.value))}
                    className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span>{config.min}</span>
                    <span>{config.max}</span>
                  </div>
                  
                  <p className="text-xs text-gray-400 mt-2">{config.description}</p>
                </div>
              ))}
            </div>

            {/* Visualization Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Real-time Feature Impact
              </h2>
              
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <div className="space-y-4">
                  {featureConfigs.map((config) => (
                    <div key={config.key} className="flex items-center gap-3">
                      <div className="w-32 text-sm text-gray-400 truncate">
                        {config.label}
                      </div>
                      <div className="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
                        <div 
                          className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-4 rounded-full transition-all duration-300"
                          style={{ width: `${features[config.key] * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-sm text-gray-400 font-mono">
                        {(features[config.key] * 100).toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Model Info */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Model Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Algorithm:</span>
                      <span className="text-purple-400">Random Forest</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Features:</span>
                      <span className="text-purple-400">5 (Top Important)</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Accuracy:</span>
                      <span className="text-green-400">99.99%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status:</span>
                      <span className="text-green-400">Ready</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Indicator */}
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Risk Indicator</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Current Risk Level:</span>
                    <span className={`font-medium ${
                      Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.6 ? 'text-red-400' :
                      Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.3 ? 'text-yellow-400' : 'text-green-400'
                    }`}>
                      {Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.6 ? 'High' :
                       Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.3 ? 'Medium' : 'Low'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.6 ? 'bg-red-500' :
                        Object.values(features).reduce((a, b) => a + b, 0) / 5 > 0.3 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(Object.values(features).reduce((a, b) => a + b, 0) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Prediction Button */}
          <div className="mt-8 text-center">
            <button
              onClick={handlePredict}
              disabled={isAnalyzing}
              className="px-12 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg transform hover:scale-105"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                  Analyzing Features...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-3">
                  <Brain className="w-6 h-6" />
                  Predict Malware
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Prediction Modal */}
      {prediction && (
        <PredictionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          prediction={prediction}
          onViewDetails={handleViewDetails}
        />
      )}
    </div>
  );
};

export default MLFeatureInput;