import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Zap, AlertTriangle, Shield } from 'lucide-react';

interface EnhancedConfidenceGaugeProps {
  value: number;
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
}

const EnhancedConfidenceGauge: React.FC<EnhancedConfidenceGaugeProps> = ({ value, threatLevel }) => {
  const getColors = () => {
    switch (threatLevel) {
      case 'critical':
        return { path: '#ef4444', trail: '#991b1b' };
      case 'high':
        return { path: '#f97316', trail: '#9a3412' };
      case 'medium':
        return { path: '#eab308', trail: '#854d0e' };
      case 'low':
        return { path: '#22c55e', trail: '#166534' };
    }
  };

  const colors = getColors();

  return (
    <div className="p-6 bg-gray-800/50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Threat Confidence</h3>
      <div className="flex items-center justify-center">
        <div className="w-48 h-48">
          <CircularProgressbar
            value={value}
            text={`${value}%`}
            styles={buildStyles({
              pathColor: colors.path,
              trailColor: colors.trail,
              textColor: colors.path,
              textSize: '16px',
              pathTransitionDuration: 1,
            })}
          />
        </div>
      </div>
      
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center">
          <Shield className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-sm text-gray-400">Detection</p>
          <p className="text-lg font-semibold text-green-400">Active</p>
        </div>
        <div className="text-center">
          <Zap className="w-6 h-6 mx-auto mb-2 text-yellow-400" />
          <p className="text-sm text-gray-400">Response</p>
          <p className="text-lg font-semibold text-yellow-400">Ready</p>
        </div>
        <div className="text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-red-400" />
          <p className="text-sm text-gray-400">Threats</p>
          <p className="text-lg font-semibold text-red-400">{threatLevel}</p>
        </div>
      </div>
    </div>
  );
};

export default EnhancedConfidenceGauge;