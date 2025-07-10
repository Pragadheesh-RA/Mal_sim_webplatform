import React from 'react';
import { Wifi, Server, Laptop, Shield, AlertTriangle } from 'lucide-react';

const NetworkMap: React.FC = () => {
  const nodes = [
    { id: 1, type: 'server', status: 'secure', x: 50, y: 50 },
    { id: 2, type: 'device', status: 'compromised', x: 30, y: 70 },
    { id: 3, type: 'router', status: 'secure', x: 70, y: 30 },
    { id: 4, type: 'device', status: 'secure', x: 80, y: 80 },
  ];

  const getIcon = (type: string, status: string) => {
    switch (type) {
      case 'server':
        return <Server className={status === 'secure' ? 'cyber-text' : 'text-red-500'} />;
      case 'router':
        return <Wifi className={status === 'secure' ? 'cyber-text' : 'text-red-500'} />;
      case 'device':
        return <Laptop className={status === 'secure' ? 'cyber-text' : 'text-red-500'} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-[600px] cyber-border rounded-lg p-4">
      <div className="absolute inset-0 network-lines" />
      
      {nodes.map((node) => (
        <div
          key={node.id}
          className="absolute"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="relative">
            <div className="w-12 h-12 glow-card rounded-full flex items-center justify-center">
              {getIcon(node.type, node.status)}
            </div>
            {node.status === 'compromised' && (
              <div className="absolute -top-2 -right-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="absolute bottom-4 right-4 flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 cyber-text" />
          <span className="text-sm">Secure</span>
        </div>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm">Compromised</span>
        </div>
      </div>
    </div>
  );
};

export default NetworkMap;