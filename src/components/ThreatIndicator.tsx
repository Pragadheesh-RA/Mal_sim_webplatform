import React from 'react';
import { AlertTriangle, Shield, ShieldAlert, Skull } from 'lucide-react';

interface ThreatIndicatorProps {
  level: 'low' | 'medium' | 'high' | 'critical';
}

const ThreatIndicator: React.FC<ThreatIndicatorProps> = ({ level }) => {
  const getColor = () => {
    switch (level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getIcon = () => {
    switch (level) {
      case 'low': return <Shield className="w-6 h-6" />;
      case 'medium': return <AlertTriangle className="w-6 h-6" />;
      case 'high': return <ShieldAlert className="w-6 h-6" />;
      case 'critical': return <Skull className="w-6 h-6" />;
      default: return null;
    }
  };

  return (
    <div className={`flex items-center gap-2 ${getColor()}`}>
      {getIcon()}
      <span className="font-semibold capitalize">{level}</span>
    </div>
  );
};

export default ThreatIndicator;