import React from 'react';

interface ConfidenceGaugeProps {
  value: number;
}

const ConfidenceGauge: React.FC<ConfidenceGaugeProps> = ({ value }) => {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg className="transform -rotate-90 w-48 h-48">
        <circle
          className="text-gray-700"
          strokeWidth="12"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
        <circle
          className="text-green-400"
          strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx="96"
          cy="96"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-3xl font-bold text-green-400">{value}%</span>
        <span className="text-sm text-gray-400">Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;