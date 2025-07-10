import React from 'react';
import { MalwareSignature } from '../types';
import { Shield, AlertTriangle, AlertOctagon } from 'lucide-react';

interface SignatureDetailsProps {
  signatures: MalwareSignature[];
}

const SignatureDetails: React.FC<SignatureDetailsProps> = ({ signatures }) => {
  const getIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertOctagon className="w-5 h-5 text-red-400" />;
      case 'high':
        return <AlertTriangle className="w-5 h-5 text-orange-400" />;
      default:
        return <Shield className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-500/20 text-red-400';
      case 'high':
        return 'bg-orange-500/20 text-orange-400';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Signature Matches</h3>
      <div className="space-y-3">
        {signatures.map((sig, index) => (
          <div
            key={index}
            className="bg-gray-800/50 p-3 rounded-lg flex items-start gap-3"
          >
            {getIcon(sig.severity)}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-gray-200 font-medium">{sig.name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">
                    Matches: <span className="text-indigo-400">{sig.matchCount}</span>
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${getSeverityColor(sig.severity)}`}>
                    {sig.severity}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-400">{sig.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SignatureDetails;