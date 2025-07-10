import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { format } from 'date-fns';
import { 
  Activity, 
  Shield, 
  BarChart2, 
  Terminal, 
  Database,
  Bug,
  AlertTriangle,
  Zap,
  Brain
} from 'lucide-react';
import { mockAnalysis } from './mockData';
import FileUpload from './components/FileUpload';
import ResultModal from './components/ResultModal';
import FeatureChart from './components/FeatureChart';
import MLFeatureAnalysis from './components/MLFeatureAnalysis';
import BehaviorAnalysis from './components/BehaviorAnalysis';
import SignatureDetails from './components/SignatureDetails';
import Recommendations from './components/Recommendations';
import EnhancedConfidenceGauge from './components/EnhancedConfidenceGauge';
import MLFeatureInput from './components/MLFeatureInput';
import ResultsPage from './components/ResultsPage';
import LoadingScreen from './components/LoadingScreen';
import Footer from './components/Footer';
import PredictionChoice from './components/PredictionChoice';
import DatabasePage from './components/DatabasePage';
import { MalwareAnalysis } from './types';
import { FileAnalysisService } from './services/fileAnalysisService';
import { DatabaseService } from './services/databaseService';

const fileAnalysisService = new FileAnalysisService();
const databaseService = new DatabaseService();

// Dashboard statistics interface
interface DashboardStats {
  totalScans: number;
  threatsDetected: number;
  systemHealth: number;
  activeThreats: number;
  avgConfidence: number;
  recentActivity: Array<{
    time: string;
    value: number;
    threatLevel: string;
  }>;
}

function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [analysis, setAnalysis] = useState<MalwareAnalysis>(mockAnalysis);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalScans: 1234,
    threatsDetected: 89,
    systemHealth: 92,
    activeThreats: 12,
    avgConfidence: 85,
    recentActivity: [
      { time: '00:00', value: 65, threatLevel: 'low' },
      { time: '04:00', value: 78, threatLevel: 'medium' },
      { time: '08:00', value: 42, threatLevel: 'low' },
      { time: '12:00', value: 89, threatLevel: 'high' },
      { time: '16:00', value: 56, threatLevel: 'low' },
      { time: '20:00', value: 73, threatLevel: 'medium' },
      { time: '24:00', value: 62, threatLevel: 'low' },
    ]
  });

  // Check for tab parameter in URL and auto-scroll to upload section
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab) {
      setActiveTab(tab);
      
      // If redirected to scan tab, scroll to upload section after a short delay
      if (tab === 'scan') {
        setTimeout(() => {
          const uploadSection = document.querySelector('.file-upload-section');
          if (uploadSection) {
            uploadSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, []);

  // Load initial dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const analyses = await databaseService.getAllAnalyses();
      updateDashboardStats(analyses);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateDashboardStats = (analyses: MalwareAnalysis[]) => {
    const totalScans = analyses.length;
    const threatsDetected = analyses.filter(a => 
      a.threatLevel === 'high' || a.threatLevel === 'critical'
    ).length;
    
    const avgConfidence = analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + a.confidence, 0) / analyses.length)
      : 85;

    const activeThreats = analyses.filter(a => 
      a.threatLevel === 'high' || a.threatLevel === 'critical'
    ).filter(a => 
      new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    ).length;

    // Calculate system health based on recent threat activity
    const recentThreats = analyses.filter(a => 
      new Date(a.timestamp).getTime() > Date.now() - 24 * 60 * 60 * 1000
    );
    const threatRatio = recentThreats.length > 0 ? threatsDetected / recentThreats.length : 0;
    const systemHealth = Math.max(20, Math.min(100, 100 - (threatRatio * 50)));

    // Generate recent activity data from actual analyses
    const recentActivity = generateRecentActivityData(analyses);

    setDashboardStats({
      totalScans: Math.max(totalScans, 1234), // Keep minimum for demo
      threatsDetected: Math.max(threatsDetected, 89),
      systemHealth: Math.round(systemHealth),
      activeThreats: Math.max(activeThreats, 12),
      avgConfidence,
      recentActivity
    });
  };

  const generateRecentActivityData = (analyses: MalwareAnalysis[]) => {
    const now = new Date();
    const hours = [];
    
    // Generate data for last 24 hours
    for (let i = 6; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 4 * 60 * 60 * 1000);
      const timeStr = time.getHours().toString().padStart(2, '0') + ':00';
      
      // Find analyses in this time window
      const windowStart = time.getTime();
      const windowEnd = windowStart + 4 * 60 * 60 * 1000;
      
      const windowAnalyses = analyses.filter(a => {
        const analysisTime = new Date(a.timestamp).getTime();
        return analysisTime >= windowStart && analysisTime < windowEnd;
      });

      let value = 30 + Math.random() * 40; // Base activity
      let threatLevel = 'low';

      if (windowAnalyses.length > 0) {
        const avgThreatScore = windowAnalyses.reduce((sum, a) => {
          const score = a.threatLevel === 'critical' ? 4 : 
                       a.threatLevel === 'high' ? 3 :
                       a.threatLevel === 'medium' ? 2 : 1;
          return sum + score;
        }, 0) / windowAnalyses.length;

        value = Math.min(100, 20 + avgThreatScore * 20 + windowAnalyses.length * 5);
        
        if (avgThreatScore >= 3) threatLevel = 'high';
        else if (avgThreatScore >= 2) threatLevel = 'medium';
      }

      hours.push({
        time: timeStr,
        value: Math.round(value),
        threatLevel
      });
    }

    return hours;
  };

  const handleFileSelect = async (file: File) => {
    setIsAnalyzing(true);
    
    try {
      // Show immediate feedback
      console.log(`Starting analysis of ${file.name} (${file.size} bytes)`);
      
      // Analyze the uploaded file
      const fileAnalysis = await fileAnalysisService.analyzeFile(file);
      
      // Convert to MalwareAnalysis format
      const newAnalysis: MalwareAnalysis = {
        ...mockAnalysis,
        id: `mal-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        mlFeatures: {
          entropy: fileAnalysis.metadata.entropy || 0,
          sectionCount: fileAnalysis.metadata.sections || 0,
          importCount: fileAnalysis.metadata.imports?.length || 0,
          stringCount: Math.floor(Math.random() * 2000) + 500,
          suspiciousStrings: Math.floor(Math.random() * 30),
          packedProbability: fileAnalysis.features.svcscan_shared_process_services,
          apiUsageScore: fileAnalysis.features.handles_avg_handles_per_proc
        },
        // Determine threat level based on features
        threatLevel: (() => {
          const avgFeatureValue = Object.values(fileAnalysis.features).reduce((a, b) => a + b, 0) / 5;
          if (avgFeatureValue > 0.7) return 'high' as const;
          if (avgFeatureValue > 0.4) return 'medium' as const;
          return 'low' as const;
        })(),
        confidence: (() => {
          const avgFeatureValue = Object.values(fileAnalysis.features).reduce((a, b) => a + b, 0) / 5;
          return Math.round(Math.abs(avgFeatureValue - 0.5) * 200);
        })(),
        detectedMalwareTypes: (() => {
          const avgFeatureValue = Object.values(fileAnalysis.features).reduce((a, b) => a + b, 0) / 5;
          if (avgFeatureValue > 0.6) {
            return ['Trojan', 'Suspicious Behavior'];
          }
          return [];
        })(),
        signatures: (() => {
          const features = fileAnalysis.features;
          const signatures = [];
          
          if (features.svcscan_nservices > 0.5) {
            signatures.push({
              name: 'High Service Activity',
              description: 'Unusual number of system services detected',
              matched: true,
              severity: 'medium' as const,
              matchCount: Math.floor(features.svcscan_nservices * 10)
            });
          }
          
          if (features.handles_avg_handles_per_proc > 0.7) {
            signatures.push({
              name: 'Excessive Handle Usage',
              description: 'High average handles per process detected',
              matched: true,
              severity: 'high' as const,
              matchCount: Math.floor(features.handles_avg_handles_per_proc * 15)
            });
          }
          
          if (features.handles_nmutant > 0.6) {
            signatures.push({
              name: 'Mutex Manipulation',
              description: 'Suspicious mutex handle activity detected',
              matched: true,
              severity: 'critical' as const,
              matchCount: Math.floor(features.handles_nmutant * 8)
            });
          }
          
          return signatures;
        })(),
        recommendations: (() => {
          const avgFeatureValue = Object.values(fileAnalysis.features).reduce((a, b) => a + b, 0) / 5;
          
          if (avgFeatureValue > 0.6) {
            return [
              {
                action: 'isolate',
                priority: 'high' as const,
                description: 'Immediately isolate the system from network'
              },
              {
                action: 'scan',
                priority: 'high' as const,
                description: 'Perform full system antivirus scan'
              },
              {
                action: 'backup',
                priority: 'medium' as const,
                description: 'Backup critical data before remediation'
              }
            ];
          } else {
            return [
              {
                action: 'monitor',
                priority: 'low' as const,
                description: 'Continue monitoring system for suspicious activity'
              }
            ];
          }
        })(),
        systemImpact: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 100,
          disk: file.size,
          processes: Math.floor(Math.random() * 20) + 1
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: Math.floor(Math.random() * 200),
            modified: Math.floor(Math.random() * 50),
            created: Math.floor(Math.random() * 20),
            deleted: Math.floor(Math.random() * 10)
          },
          network: {
            connections: Math.floor(Math.random() * 50),
            dataTransferred: Math.floor(Math.random() * 2000000),
            suspiciousIPs: Math.floor(Math.random() * 10),
            protocols: ['HTTP', 'HTTPS', 'DNS', 'TCP']
          },
          registry: {
            modifications: Math.floor(Math.random() * 50),
            creations: Math.floor(Math.random() * 20),
            deletions: Math.floor(Math.random() * 5)
          }
        },
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: `Analysis completed for ${file.name}`,
            module: 'scanner'
          }
        ]
      };
      
      // Save to database
      await databaseService.saveAnalysis(newAnalysis);
      
      // Update dashboard stats immediately
      const updatedAnalyses = await databaseService.getAllAnalyses();
      updateDashboardStats(updatedAnalyses);
      
      setAnalysis(newAnalysis);
      setShowModal(true);
      
      console.log('Analysis completed successfully');
    } catch (error) {
      console.error('Error analyzing file:', error);
      // Show error analysis
      const errorAnalysis: MalwareAnalysis = {
        ...mockAnalysis,
        id: `mal-error-${Date.now()}`,
        filename: file.name,
        timestamp: new Date().toISOString(),
        threatLevel: 'low',
        confidence: 0,
        recommendations: [
          {
            action: 'retry',
            priority: 'medium',
            description: 'File analysis failed. Please try uploading again.'
          }
        ],
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'error',
            message: `Analysis failed for ${file.name}: ${error}`,
            module: 'scanner'
          }
        ]
      };
      
      setAnalysis(errorAnalysis);
      setShowModal(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Listen for ML predictions to update dashboard
  useEffect(() => {
    const handleMLPrediction = (event: CustomEvent) => {
      const { prediction, features } = event.detail;
      
      // Create a mock analysis from ML prediction
      const mlAnalysis: MalwareAnalysis = {
        ...mockAnalysis,
        id: `ml-${Date.now()}`,
        filename: 'ML Feature Analysis',
        timestamp: new Date().toISOString(),
        threatLevel: prediction.prediction === 'Malware' ? 'high' : 'low',
        confidence: prediction.confidence,
        detectedMalwareTypes: prediction.prediction === 'Malware' ? ['ML Detected Threat'] : [],
        mlFeatures: {
          entropy: features.svcscan_nservices * 8,
          sectionCount: Math.floor(features.handles_avg_handles_per_proc * 10),
          importCount: Math.floor(features.svcscan_shared_process_services * 200),
          stringCount: Math.floor(features.handles_nevent * 1000),
          suspiciousStrings: Math.floor(features.handles_nmutant * 50),
          packedProbability: features.svcscan_shared_process_services,
          apiUsageScore: features.handles_avg_handles_per_proc
        },
        signatures: [],
        recommendations: prediction.prediction === 'Malware' ? [
          {
            action: 'investigate',
            priority: 'high',
            description: 'ML model detected potential malware behavior'
          }
        ] : [
          {
            action: 'monitor',
            priority: 'low',
            description: 'ML analysis indicates benign behavior'
          }
        ],
        systemImpact: {
          cpu: Math.random() * 100,
          memory: Math.random() * 100,
          network: Math.random() * 100,
          disk: Math.random() * 1000000,
          processes: Math.floor(Math.random() * 10) + 1
        },
        behaviorAnalysis: {
          fileSystem: {
            accessed: Math.floor(Math.random() * 100),
            modified: Math.floor(Math.random() * 20),
            created: Math.floor(Math.random() * 10),
            deleted: Math.floor(Math.random() * 5)
          },
          network: {
            connections: Math.floor(Math.random() * 20),
            dataTransferred: Math.floor(Math.random() * 1000000),
            suspiciousIPs: Math.floor(Math.random() * 5),
            protocols: ['HTTP', 'HTTPS']
          },
          registry: {
            modifications: Math.floor(Math.random() * 20),
            creations: Math.floor(Math.random() * 10),
            deletions: Math.floor(Math.random() * 3)
          }
        },
        logs: [
          {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: 'ML feature analysis completed',
            module: 'ml'
          }
        ]
      };

      // Save ML analysis and update dashboard
      databaseService.saveAnalysis(mlAnalysis).then(async () => {
        const updatedAnalyses = await databaseService.getAllAnalyses();
        updateDashboardStats(updatedAnalyses);
      });
    };

    window.addEventListener('mlPredictionComplete', handleMLPrediction as EventListener);
    
    return () => {
      window.removeEventListener('mlPredictionComplete', handleMLPrediction as EventListener);
    };
  }, []);

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-12 gap-4">
        {/* Header Stats - Now Dynamic */}
        <div className="col-span-12 grid grid-cols-4 gap-4 mb-4">
          <div className="dashboard-card flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors">
            <div>
              <h3 className="text-sm text-gray-400">Total Scans</h3>
              <p className="text-2xl font-bold text-green-400 transition-all duration-500">
                {dashboardStats.totalScans.toLocaleString()}
              </p>
              <div className="text-xs text-gray-500 mt-1">
                +{Math.floor(Math.random() * 10) + 1} today
              </div>
            </div>
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          
          <div className="dashboard-card flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors">
            <div>
              <h3 className="text-sm text-gray-400">Threats Detected</h3>
              <p className="text-2xl font-bold text-red-400 transition-all duration-500">
                {dashboardStats.threatsDetected}
              </p>
              <div className="text-xs text-gray-500 mt-1">
                {dashboardStats.activeThreats} active
              </div>
            </div>
            <Bug className="w-8 h-8 text-red-400" />
          </div>
          
          <div className="dashboard-card flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors">
            <div>
              <h3 className="text-sm text-gray-400">System Health</h3>
              <p className="text-2xl font-bold text-blue-400 transition-all duration-500">
                {dashboardStats.systemHealth}%
              </p>
              <div className="text-xs text-gray-500 mt-1">
                {dashboardStats.systemHealth >= 90 ? 'Excellent' : 
                 dashboardStats.systemHealth >= 70 ? 'Good' : 'Needs Attention'}
              </div>
            </div>
            <Zap className="w-8 h-8 text-blue-400" />
          </div>
          
          <div className="dashboard-card flex items-center justify-between p-4 hover:bg-gray-700/50 transition-colors">
            <div>
              <h3 className="text-sm text-gray-400">Avg Confidence</h3>
              <p className="text-2xl font-bold text-purple-400 transition-all duration-500">
                {dashboardStats.avgConfidence}%
              </p>
              <div className="text-xs text-gray-500 mt-1">
                Detection accuracy
              </div>
            </div>
            <Brain className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        {/* Main Content */}
        <div className="col-span-8 space-y-4">
          <div className="dashboard-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-200">Real-time Threat Activity</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Live Updates</span>
              </div>
            </div>
            <FeatureChart data={dashboardStats.recentActivity} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="dashboard-card">
              <MLFeatureAnalysis features={analysis.mlFeatures} />
            </div>
            <div className="dashboard-card">
              <BehaviorAnalysis data={analysis.behaviorAnalysis} />
            </div>
          </div>
        </div>

        {/* Sidebar - Dynamic Confidence */}
        <div className="col-span-4 space-y-4">
          <div className="dashboard-card">
            <EnhancedConfidenceGauge 
              value={dashboardStats.avgConfidence} 
              threatLevel={
                dashboardStats.avgConfidence >= 90 ? 'low' :
                dashboardStats.avgConfidence >= 70 ? 'medium' :
                dashboardStats.avgConfidence >= 50 ? 'high' : 'critical'
              }
            />
          </div>

          <div className="dashboard-card">
            <SignatureDetails signatures={analysis.signatures} />
          </div>

          <div className="dashboard-card">
            <Recommendations recommendations={analysis.recommendations} />
          </div>
        </div>
      </div>

      {/* Prediction Choice Section */}
      <PredictionChoice />
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'scan':
        return (
          <div className="space-y-8">
            <div className="dashboard-card p-8 file-upload-section">
              <h2 className="text-2xl font-bold mb-6 text-center text-gray-200">Universal Malware Scanner</h2>
              <FileUpload onFileSelect={handleFileSelect} />
              {isAnalyzing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 bg-blue-500/20 rounded-lg">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent" />
                    <span className="text-blue-400">Analyzing file...</span>
                  </div>
                </div>
              )}
            </div>
            <PredictionChoice />
          </div>
        );
      case 'database':
        return <DatabasePage />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="w-8 h-8 text-green-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Mal-Sim
                </h1>
                <p className="text-xs text-gray-400">Next Generation Malware Detection</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = '/ml-input'}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <Brain className="w-4 h-4" />
                ML Analysis
              </button>
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-green-400 animate-pulse" />
                <span className="text-green-400">Live Analysis</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <nav className="bg-gray-800/50 border-b border-gray-700">
        <div className="container mx-auto px-4">
          <div className="flex space-x-4">
            {[
              { id: 'dashboard', icon: BarChart2, label: 'Dashboard' },
              { id: 'scan', icon: Terminal, label: 'Universal Scanner' },
              { id: 'database', icon: Database, label: 'Database' }
            ].map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`px-4 py-3 flex items-center space-x-2 transition-colors ${
                  activeTab === id 
                    ? 'text-green-400 border-b-2 border-green-400' 
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        {renderContent()}
      </main>

      {activeTab !== 'database' && <Footer />}

      {showModal && (
        <ResultModal
          analysis={analysis}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/ml-input" element={<MLFeatureInput />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;