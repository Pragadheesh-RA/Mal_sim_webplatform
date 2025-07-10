import React from 'react';
import { X, AlertTriangle, Shield, CheckCircle, XCircle } from 'lucide-react';
import { MLPredictionResult } from '../services/mlModelService';

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  prediction: MLPredictionResult;
  onViewDetails: () => void;
}

const PredictionModal: React.FC<PredictionModalProps> = ({ 
  isOpen, 
  onClose, 
  prediction, 
  onViewDetails 
}) => {
  if (!isOpen) return null;

  const isMalware = prediction.prediction === 'Malware';
  const confidenceLevel = prediction.confidence >= 80 ? 'Very High' : 
                         prediction.confidence >= 60 ? 'High' : 
                         prediction.confidence >= 40 ? 'Medium' : 'Low';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-md w-full relative animate-pulse-once">
        {/* Header */}
        <div className={`p-6 rounded-t-lg ${isMalware ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isMalware ? (
                <div className="p-2 bg-red-500/30 rounded-full">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
              ) : (
                <div className="p-2 bg-green-500/30 rounded-full">
                  <Shield className="w-8 h-8 text-green-400" />
                </div>
              )}
              <div>
                <h2 className={`text-2xl font-bold ${isMalware ? 'text-red-400' : 'text-green-400'}`}>
                  {prediction.prediction}
                </h2>
                <p className="text-gray-300">Detection Result</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Confidence Score */}
          <div className="text-center mb-6">
            <div className={`text-4xl font-bold mb-2 ${isMalware ? 'text-red-400' : 'text-green-400'}`}>
              {prediction.confidence.toFixed(1)}%
            </div>
            <div className="text-gray-400">
              Confidence Level: <span className="text-purple-400 font-medium">{confidenceLevel}</span>
            </div>
            
            {/* Confidence Bar */}
            <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  isMalware ? 'bg-gradient-to-r from-red-600 to-red-400' : 
                             'bg-gradient-to-r from-green-600 to-green-400'
                }`}
                style={{ width: `${prediction.confidence}%` }}
              />
            </div>
          </div>

          {/* Quick Summary */}
          <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
            <h3 className="text-gray-200 font-medium mb-2 flex items-center gap-2">
              {isMalware ? (
                <XCircle className="w-5 h-5 text-red-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              Analysis Summary
            </h3>
            <p className="text-gray-400 text-sm">
              {isMalware ? (
                <>
                  The analyzed features indicate <strong className="text-red-400">malicious behavior</strong>. 
                  Immediate action is recommended to secure your system.
                </>
              ) : (
                <>
                  The analyzed features indicate <strong className="text-green-400">benign behavior</strong>. 
                  The sample appears to be safe based on the ML model analysis.
                </>
              )}
            </p>
          </div>

          {/* Top Contributing Features */}
          <div className="mb-6">
            <h3 className="text-gray-200 font-medium mb-3">Top Contributing Features</h3>
            <div className="space-y-2">
              {Object.entries(prediction.featureImpacts)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 3)
                .map(([feature, impact]) => {
                  const displayName = feature.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                  return (
                    <div key={feature} className="flex items-center gap-2">
                      <div className="w-24 text-xs text-gray-400 truncate">{displayName}</div>
                      <div className="flex-1 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${impact * 100}%` }}
                        />
                      </div>
                      <div className="w-12 text-right text-xs text-gray-400">
                        {(impact * 100).toFixed(0)}%
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onViewDetails}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              View Detailed Report
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionModal;