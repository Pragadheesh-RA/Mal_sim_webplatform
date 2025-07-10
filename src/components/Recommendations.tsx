import React from 'react';
import { Recommendation } from '../types';
import { AlertTriangle, Shield, Activity } from 'lucide-react';

interface RecommendationsProps {
  recommendations: Recommendation[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  const getIcon = (action: string) => {
    switch (action) {
      case 'isolate':
        return <Shield className="w-5 h-5 text-red-400" />;
      case 'backup':
        return <Activity className="w-5 h-5 text-yellow-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-blue-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      case 'low':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Recommended Actions</h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-3"
          >
            {getIcon(rec.action)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-gray-200 font-medium capitalize">{rec.action}</h4>
                <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(rec.priority)}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-gray-400">{rec.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;