import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MLFeatures } from '../types';

interface FeatureImpactChartProps {
  features: MLFeatures;
}

const FeatureImpactChart: React.FC<FeatureImpactChartProps> = ({ features }) => {
  const featureData = [
    { name: 'Entropy', value: features.entropy / 8 }, // Normalize to 0-1
    { name: 'API Score', value: features.apiUsageScore },
    { name: 'Packed Prob', value: features.packedProbability },
    { name: 'Susp. Strings', value: features.suspiciousStrings / 30 }, // Normalize to 0-1
    { name: 'Imports', value: features.importCount / 200 } // Normalize to 0-1
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={featureData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="name" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={[0, 1]}
            tickFormatter={(value) => `${(value * 100).toFixed(0)}%`}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '0.375rem'
            }}
            formatter={(value: number) => `${(value * 100).toFixed(1)}%`}
          />
          <Bar 
            dataKey="value" 
            fill="#6366f1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureImpactChart;