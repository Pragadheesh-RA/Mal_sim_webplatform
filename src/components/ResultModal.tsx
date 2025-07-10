import React from 'react';
import { X, AlertTriangle, Shield, FileText, Hash, Layers, Import, Import as Export } from 'lucide-react';
import { MalwareAnalysis } from '../types';

interface ResultModalProps {
  analysis: MalwareAnalysis;
  onClose: () => void;
}

const ResultModal: React.FC<ResultModalProps> = ({ analysis, onClose }) => {
  const isMalware = analysis.threatLevel === 'high' || analysis.threatLevel === 'critical';
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto relative animate-pulse-once">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200 transition-colors p-2 hover:bg-gray-700 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Header */}
        <div className={`p-6 rounded-t-lg ${isMalware ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
          <div className="flex items-center gap-4">
            {isMalware ? (
              <div className="p-3 bg-red-500/30 rounded-full">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            ) : (
              <div className="p-3 bg-green-500/30 rounded-full">
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            )}
            <div>
              <h2 className={`text-2xl font-bold ${isMalware ? 'text-red-400' : 'text-green-400'}`}>
                {isMalware ? 'THREAT DETECTED' : 'FILE SAFE'}
              </h2>
              <p className="text-gray-300">{analysis.filename}</p>
              <p className="text-sm text-gray-400">
                Analyzed at {new Date(analysis.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Threat Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-2">Threat Level</h3>
              <p className={`text-2xl font-bold capitalize ${
                analysis.threatLevel === 'critical' ? 'text-red-400' :
                analysis.threatLevel === 'high' ? 'text-orange-400' :
                analysis.threatLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
              }`}>
                {analysis.threatLevel}
              </p>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-2">Confidence</h3>
              <p className="text-2xl font-bold text-purple-400">{analysis.confidence}%</p>
              <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                <div 
                  className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
            </div>
            
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-gray-300 font-medium mb-2">File Size</h3>
              <p className="text-2xl font-bold text-blue-400">
                {(analysis.systemImpact.disk / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>

          {/* ML Features Analysis */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              ML Feature Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(analysis.mlFeatures).map(([key, value]) => {
                const displayName = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                const normalizedValue = typeof value === 'number' ? Math.min(1, Math.max(0, value / 10)) : 0;
                
                return (
                  <div key={key} className="flex items-center gap-3">
                    <div className="w-32 text-sm text-gray-400 truncate">{displayName}</div>
                    <div className="flex-1 bg-gray-600 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          normalizedValue > 0.7 ? 'bg-red-500' :
                          normalizedValue > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${normalizedValue * 100}%` }}
                      />
                    </div>
                    <div className="w-16 text-right text-sm text-gray-400 font-mono">
                      {typeof value === 'number' ? value.toFixed(2) : value}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* File Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Hash className="w-5 h-5" />
                File Hashes
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">MD5:</span>
                  <span className="text-gray-300 font-mono">a1b2c3d4e5f6...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SHA1:</span>
                  <span className="text-gray-300 font-mono">1a2b3c4d5e6f...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">SHA256:</span>
                  <span className="text-gray-300 font-mono">abc123def456...</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <Layers className="w-5 h-5" />
                File Structure
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Sections:</span>
                  <span className="text-gray-300">{analysis.mlFeatures.sectionCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Entropy:</span>
                  <span className="text-gray-300">{analysis.mlFeatures.entropy.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Imports:</span>
                  <span className="text-gray-300">{analysis.mlFeatures.importCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Detected Malware Types */}
          {analysis.detectedMalwareTypes.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-400 mb-3">Detected Malware Types</h3>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedMalwareTypes.map((type, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Signatures */}
          {analysis.signatures.length > 0 && (
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-200 mb-4">Signature Matches</h3>
              <div className="space-y-3">
                {analysis.signatures.map((sig, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-600/50 rounded-lg">
                    <AlertTriangle className={`w-5 h-5 mt-1 ${
                      sig.severity === 'critical' ? 'text-red-400' :
                      sig.severity === 'high' ? 'text-orange-400' : 'text-yellow-400'
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-gray-200 font-medium">{sig.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          sig.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          sig.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {sig.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400">{sig.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Matches: {sig.matchCount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recommendations */}
          <div className="bg-gray-700/50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Recommended Actions</h3>
            <div className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <div key={index} className="flex items-center gap-3 p-2 bg-gray-600/50 rounded">
                  <div className={`w-2 h-2 rounded-full ${
                    rec.priority === 'high' ? 'bg-red-400' :
                    rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                  }`} />
                  <span className="text-gray-300 capitalize font-medium">{rec.action}</span>
                  <span className="text-gray-400 text-sm">- {rec.description}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;