import React from 'react';
import { BehaviorAnalysis as BehaviorAnalysisType } from '../types';
import { FileText, Network, Database } from 'lucide-react';

interface BehaviorAnalysisComponentProps {
  data: BehaviorAnalysisType;
}

const BehaviorAnalysis: React.FC<BehaviorAnalysisComponentProps> = ({ data }) => {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-200 mb-4">Behavior Analysis</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {/* File System Activity */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-400" />
            <h4 className="text-gray-200">File System Activity</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-400">Created</p>
              <p className="text-lg font-semibold text-blue-400">{data.fileSystem.created}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Modified</p>
              <p className="text-lg font-semibold text-yellow-400">{data.fileSystem.modified}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Accessed</p>
              <p className="text-lg font-semibold text-green-400">{data.fileSystem.accessed}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Deleted</p>
              <p className="text-lg font-semibold text-red-400">{data.fileSystem.deleted}</p>
            </div>
          </div>
        </div>

        {/* Network Activity */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Network className="w-5 h-5 text-purple-400" />
            <h4 className="text-gray-200">Network Activity</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-400">Connections</p>
              <p className="text-lg font-semibold text-purple-400">{data.network.connections}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Data Transferred</p>
              <p className="text-lg font-semibold text-purple-400">
                {formatBytes(data.network.dataTransferred)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Suspicious IPs</p>
              <p className="text-lg font-semibold text-red-400">{data.network.suspiciousIPs}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Protocols</p>
              <div className="flex flex-wrap gap-1">
                {data.network.protocols.map((protocol) => (
                  <span
                    key={protocol}
                    className="px-1.5 py-0.5 bg-purple-900/50 text-purple-400 rounded text-xs"
                  >
                    {protocol}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Registry Activity */}
        <div className="bg-gray-800/50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-3">
            <Database className="w-5 h-5 text-emerald-400" />
            <h4 className="text-gray-200">Registry Activity</h4>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-sm text-gray-400">Modifications</p>
              <p className="text-lg font-semibold text-emerald-400">{data.registry.modifications}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Creations</p>
              <p className="text-lg font-semibold text-emerald-400">{data.registry.creations}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Deletions</p>
              <p className="text-lg font-semibold text-red-400">{data.registry.deletions}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BehaviorAnalysis;