import React from 'react';
import { Info, Brain, Zap } from 'lucide-react';

const MLModelInfo: React.FC = () => {
  return (
    <div className="bg-gray-800/50 p-4 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
        <Brain className="w-5 h-5 text-purple-400" />
        ML Model Information
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h4 className="text-gray-200 font-medium">Model Architecture</h4>
            <p className="text-sm text-gray-400">
              Random Forest Classifier optimized for malware detection with feature importance analysis
            </p>
          </div>
        </div>
        
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-yellow-400 mt-1" />
          <div>
            <h4 className="text-gray-200 font-medium">Key Features</h4>
            <ul className="text-sm text-gray-400 list-disc list-inside space-y-1">
              <li>Entropy analysis</li>
              <li>API usage patterns</li>
              <li>Packing detection</li>
              <li>String analysis</li>
              <li>Import table analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MLModelInfo;