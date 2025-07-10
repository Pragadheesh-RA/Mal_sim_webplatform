import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  AlertTriangle, 
  Shield, 
  BarChart3, 
  Brain,
  FileText,
  Clock,
  TrendingUp,
  Activity
} from 'lucide-react';
import { MLPredictionResult, MLFeatureInputs } from '../services/mlModelService';

interface LocationState {
  prediction: MLPredictionResult;
  features: MLFeatureInputs;
  timestamp: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;

  if (!state) {
    navigate('/ml-input');
    return null;
  }

  const { prediction, features, timestamp } = state;

  const featureLabels = {
    svcscan_nservices: 'SvcScan Services',
    handles_avg_handles_per_proc: 'Avg Handles per Process',
    svcscan_shared_process_services: 'Shared Process Services',
    handles_nevent: 'Event Handles',
    handles_nmutant: 'Mutant Handles'
  };

  const getResultColor = () => {
    return prediction.prediction === 'Malware' ? 'text-red-400' : 'text-green-400';
  };

  const getResultBgColor = () => {
    return prediction.prediction === 'Malware' ? 'bg-red-500/20' : 'bg-green-500/20';
  };

  const getConfidenceLevel = () => {
    if (prediction.confidence >= 80) return 'Very High';
    if (prediction.confidence >= 60) return 'High';
    if (prediction.confidence >= 40) return 'Medium';
    return 'Low';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/ml-input')}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-200">Analysis Results</h1>
              <p className="text-gray-400">ML-based Malware Detection Report</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            {new Date(timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Main Result Card */}
        <div className={`dashboard-card p-8 ${getResultBgColor()}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {prediction.prediction === 'Malware' ? (
                <AlertTriangle className="w-12 h-12 text-red-400" />
              ) : (
                <Shield className="w-12 h-12 text-green-400" />
              )}
              <div>
                <h2 className={`text-3xl font-bold ${getResultColor()}`}>
                  {prediction.prediction}
                </h2>
                <p className="text-gray-400 mt-1">
                  Classification Result
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-4xl font-bold ${getResultColor()}`}>
                {prediction.confidence.toFixed(1)}%
              </div>
              <div className="text-gray-400">
                Confidence ({getConfidenceLevel()})
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Feature Values */}
          <div className="dashboard-card p-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Input Feature Values
            </h3>
            
            <div className="space-y-4">
              {Object.entries(features).map(([key, value]) => (
                <div key={key} className="bg-gray-800/50 p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300 font-medium">
                      {featureLabels[key as keyof typeof featureLabels]}
                    </span>
                    <span className="text-purple-400 font-mono">
                      {value.toFixed(3)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Impact Analysis */}
          <div className="dashboard-card p-6">
            <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Feature Impact Analysis
            </h3>
            
            <div className="space-y-4">
              {Object.entries(prediction.featureImpacts).map(([feature, impact]) => {
                const displayName = feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                const impactLevel = impact > 0.7 ? 'High' : impact > 0.4 ? 'Medium' : 'Low';
                const impactColor = impact > 0.7 ? 'text-red-400' : impact > 0.4 ? 'text-yellow-400' : 'text-green-400';
                
                return (
                  <div key={feature} className="bg-gray-800/50 p-3 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 text-sm">{displayName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${impactColor}`}>
                          {impactLevel}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {(impact * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          impact > 0.7 ? 'bg-red-500' : 
                          impact > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${impact * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="dashboard-card p-6">
          <h3 className="text-xl font-semibold text-gray-200 mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5" />
            Detailed Analysis Report
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-5 h-5 text-blue-400" />
                <h4 className="text-gray-200 font-medium">Model Performance</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Algorithm:</span>
                  <span className="text-blue-400">Random Forest</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Accuracy:</span>
                  <span className="text-green-400">99.99%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Features Used:</span>
                  <span className="text-purple-400">5 (Top)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h4 className="text-gray-200 font-medium">Risk Assessment</h4>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Threat Level:</span>
                  <span className={prediction.prediction === 'Malware' ? 'text-red-400' : 'text-green-400'}>
                    {prediction.prediction === 'Malware' ? 'High' : 'Low'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Confidence:</span>
                  <span className="text-purple-400">{getConfidenceLevel()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Action Required:</span>
                  <span className={prediction.prediction === 'Malware' ? 'text-red-400' : 'text-green-400'}>
                    {prediction.prediction === 'Malware' ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-5 h-5 text-purple-400" />
                <h4 className="text-gray-200 font-medium">Recommendations</h4>
              </div>
              <div className="space-y-2 text-sm text-gray-400">
                {prediction.prediction === 'Malware' ? (
                  <>
                    <p>• Isolate the system immediately</p>
                    <p>• Run full system scan</p>
                    <p>• Check for data exfiltration</p>
                    <p>• Update security policies</p>
                  </>
                ) : (
                  <>
                    <p>• Continue monitoring</p>
                    <p>• Regular security updates</p>
                    <p>• Maintain current policies</p>
                    <p>• Schedule next scan</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate('/ml-input')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            Analyze Another Sample
          </button>
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            Print Report
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;