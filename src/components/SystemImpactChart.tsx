import React from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer } from 'recharts';

interface SystemImpactProps {
  data: {
    cpu: number;
    memory: number;
    network: number;
  };
}

const SystemImpactChart: React.FC<SystemImpactProps> = ({ data }) => {
  const chartData = [
    { name: 'CPU', value: data.cpu },
    { name: 'Memory', value: data.memory },
    { name: 'Network', value: data.network },
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis dataKey="name" />
          <Radar
            name="Impact"
            dataKey="value"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.6}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SystemImpactChart;