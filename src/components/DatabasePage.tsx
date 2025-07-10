import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Trash2, 
  Calendar,
  FileText,
  AlertTriangle,
  Shield,
  BarChart3,
  Clock,
  Hash,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { MalwareAnalysis } from '../types';
import { DatabaseService } from '../services/databaseService';

const databaseService = new DatabaseService();

const DatabasePage: React.FC = () => {
  const [analyses, setAnalyses] = useState<MalwareAnalysis[]>([]);
  const [filteredAnalyses, setFilteredAnalyses] = useState<MalwareAnalysis[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterThreat, setFilterThreat] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'filename' | 'confidence' | 'threatLevel'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedAnalysis, setSelectedAnalysis] = useState<MalwareAnalysis | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAnalyses();
  }, []);

  useEffect(() => {
    filterAndSortAnalyses();
  }, [analyses, searchTerm, filterThreat, sortBy, sortOrder]);

  const loadAnalyses = async () => {
    setIsLoading(true);
    try {
      const data = await databaseService.getAllAnalyses();
      setAnalyses(data);
    } catch (error) {
      console.error('Error loading analyses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortAnalyses = () => {
    let filtered = [...analyses];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(analysis =>
        analysis.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        analysis.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply threat level filter
    if (filterThreat !== 'all') {
      filtered = filtered.filter(analysis => analysis.threatLevel === filterThreat);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortBy];
      let bValue: any = b[sortBy];

      if (sortBy === 'timestamp') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredAnalyses(filtered);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      try {
        await databaseService.deleteAnalysis(id);
        setAnalyses(prev => prev.filter(analysis => analysis.id !== id));
      } catch (error) {
        console.error('Error deleting analysis:', error);
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = JSON.stringify(filteredAnalyses, null, 2);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `malware_analyses_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting data:', error);
    }
  };

  const getThreatColor = (threatLevel: string) => {
    switch (threatLevel) {
      case 'critical': return 'text-red-400 bg-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getStats = () => {
    const total = analyses.length;
    const threats = analyses.filter(a => a.threatLevel === 'high' || a.threatLevel === 'critical').length;
    const avgConfidence = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length)
      : 0;
    const recentScans = analyses.filter(a => 
      new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    return { total, threats, avgConfidence, recentScans };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-400" />
          <p className="text-gray-400">Loading database...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <Database className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-200">Analysis Database</h1>
                <p className="text-gray-400">Manage and review all malware analysis results</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={loadAnalyses}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-400">Total Analyses</h3>
                <p className="text-2xl font-bold text-blue-400">{stats.total}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-400">Threats Detected</h3>
                <p className="text-2xl font-bold text-red-400">{stats.threats}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </div>
          
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-400">Avg Confidence</h3>
                <p className="text-2xl font-bold text-green-400">{stats.avgConfidence}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </div>
          
          <div className="dashboard-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm text-gray-400">Recent Scans (24h)</h3>
                <p className="text-2xl font-bold text-purple-400">{stats.recentScans}</p>
              </div>
              <Clock className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="dashboard-card p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by filename or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Threat Level Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterThreat}
                onChange={(e) => setFilterThreat(e.target.value)}
                className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="all">All Threats</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="timestamp">Date</option>
                <option value="filename">Filename</option>
                <option value="confidence">Confidence</option>
                <option value="threatLevel">Threat Level</option>
              </select>
              
              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 rounded-lg text-gray-300 transition-colors"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Table */}
        <div className="dashboard-card overflow-hidden">
          {filteredAnalyses.length === 0 ? (
            <div className="p-12 text-center">
              <Database className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No analyses found</h3>
              <p className="text-gray-500">
                {searchTerm || filterThreat !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Upload files to start building your analysis database'
                }
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      File
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Threat Level
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Confidence
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredAnalyses.map((analysis) => (
                    <tr key={analysis.id} className="hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <FileText className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="text-gray-200 font-medium">{analysis.filename}</p>
                            <p className="text-gray-400 text-sm flex items-center gap-1">
                              <Hash className="w-3 h-3" />
                              {analysis.id}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getThreatColor(analysis.threatLevel)}`}>
                          {analysis.threatLevel.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${analysis.confidence}%` }}
                            />
                          </div>
                          <span className="text-gray-300 text-sm">{analysis.confidence}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-300">
                          <p className="text-sm">{new Date(analysis.timestamp).toLocaleDateString()}</p>
                          <p className="text-xs text-gray-400">{new Date(analysis.timestamp).toLocaleTimeString()}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAnalysis(analysis);
                              setShowModal(true);
                            }}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(analysis.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredAnalyses.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <p className="text-gray-400 text-sm">
              Showing {filteredAnalyses.length} of {analyses.length} analyses
            </p>
          </div>
        )}
      </div>

      {/* Analysis Detail Modal */}
      {showModal && selectedAnalysis && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-200">Analysis Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                >
                  ×
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">File Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Filename:</span>
                      <span className="text-gray-300">{selectedAnalysis.filename}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Analysis ID:</span>
                      <span className="text-gray-300 font-mono">{selectedAnalysis.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Timestamp:</span>
                      <span className="text-gray-300">{new Date(selectedAnalysis.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Threat Assessment</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Threat Level:</span>
                      <span className={`px-2 py-1 rounded text-xs ${getThreatColor(selectedAnalysis.threatLevel)}`}>
                        {selectedAnalysis.threatLevel.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Confidence:</span>
                      <span className="text-gray-300">{selectedAnalysis.confidence}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Malware Types:</span>
                      <span className="text-gray-300">{selectedAnalysis.detectedMalwareTypes.length || 'None'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ML Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">ML Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedAnalysis.mlFeatures).map(([key, value]) => (
                    <div key={key} className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-400 text-sm capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <span className="text-gray-300 font-mono">
                          {typeof value === 'number' ? value.toFixed(2) : value}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Signatures */}
              {selectedAnalysis.signatures.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-200 mb-3">Detected Signatures</h3>
                  <div className="space-y-2">
                    {selectedAnalysis.signatures.map((sig, index) => (
                      <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 font-medium">{sig.name}</span>
                          <span className={`px-2 py-1 rounded text-xs ${getThreatColor(sig.severity)}`}>
                            {sig.severity}
                          </span>
                        </div>
                        <p className="text-gray-400 text-sm mt-1">{sig.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-200 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {selectedAnalysis.recommendations.map((rec, index) => (
                    <div key={index} className="bg-gray-700/50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          rec.priority === 'high' ? 'bg-red-400' :
                          rec.priority === 'medium' ? 'bg-yellow-400' : 'bg-green-400'
                        }`} />
                        <span className="text-gray-300 font-medium capitalize">{rec.action}</span>
                      </div>
                      <p className="text-gray-400 text-sm mt-1">{rec.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatabasePage;