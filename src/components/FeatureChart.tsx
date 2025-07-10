import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface FeatureChartProps {
  data?: Array<{
    time: string;
    value: number;
    threatLevel: string;
  }>;
}

const FeatureChart: React.FC<FeatureChartProps> = ({ data }) => {
  // Default data if none provided
  const defaultData = [
    { time: '00:00', value: 65, threatLevel: 'low' },
    { time: '04:00', value: 78, threatLevel: 'medium' },
    { time: '08:00', value: 42, threatLevel: 'low' },
    { time: '12:00', value: 89, threatLevel: 'high' },
    { time: '16:00', value: 56, threatLevel: 'low' },
    { time: '20:00', value: 73, threatLevel: 'medium' },
    { time: '24:00', value: 62, threatLevel: 'low' },
  ];

  const chartData = data || defaultData;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 font-medium">{`Time: ${label}`}</p>
          <p className="text-green-400">{`Activity: ${payload[0].value}%`}</p>
          <p className={`text-sm capitalize ${
            data.threatLevel === 'high' ? 'text-red-400' :
            data.threatLevel === 'medium' ? 'text-yellow-400' : 'text-green-400'
          }`}>
            Threat Level: {data.threatLevel}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34D399" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#34D399" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorValueHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorValueMedium" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="time" 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={[0, 100]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#34D399"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorValue)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FeatureChart;