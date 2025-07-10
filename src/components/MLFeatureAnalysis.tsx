import React from 'react';
import { MLFeatures } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MLFeatureAnalysisProps {
  features: MLFeatures;
}

const MLFeatureAnalysis: React.FC<MLFeatureAnalysisProps> = ({ features }) => {
  const featureData = [
    { name: 'Entropy', value: features.entropy, max: 8 },
    { name: 'API Score', value: features.apiUsageScore * 100, max: 100 },
    { name: 'Packed Prob', value: features.packedProbability * 100, max: 100 },
  ];

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">ML Feature Analysis</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={featureData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: '1px solid #374151',
                borderRadius: '0.375rem',
              }}
            />
            <Bar dataKey="value" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Suspicious Strings</p>
          <p className="text-xl font-bold text-indigo-400">{features.suspiciousStrings}</p>
        </div>
        <div className="bg-gray-800 p-3 rounded-lg">
          <p className="text-sm text-gray-400">Import Count</p>
          <p className="text-xl font-bold text-indigo-400">{features.importCount}</p>
        </div>
      </div>
    </div>
  );
};

export default MLFeatureAnalysis;