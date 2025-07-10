import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  Brain, 
  ArrowRight, 
  FileText, 
  Zap, 
  Shield,
  BarChart3,
  Cpu
} from 'lucide-react';

const PredictionChoice: React.FC = () => {
  const navigate = useNavigate();

  const options = [
    {
      id: 'file-upload',
      title: 'File Analysis',
      description: 'Upload any file for comprehensive malware detection and analysis',
      icon: Upload,
      color: 'from-blue-500 to-cyan-500',
      features: ['Universal file support', 'Real-time scanning', 'Detailed reports', 'Threat classification'],
      action: () => {
        // Set URL parameter to show scan tab and scroll to upload section
        window.location.href = '/?tab=scan';
      },
      buttonText: 'Upload & Analyze'
    },
    {
      id: 'ml-prediction',
      title: 'ML Feature Prediction',
      description: 'Input specific feature values for machine learning-based prediction',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      features: ['Manual feature input', 'ML model prediction', 'Feature impact analysis', 'Confidence scoring'],
      action: () => navigate('/ml-input'),
      buttonText: 'Start ML Analysis'
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-200">
              Choose Your Analysis Method
            </h2>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Select how you want to analyze potential threats. Upload files for comprehensive scanning 
            or input specific features for targeted ML prediction.
          </p>
        </div>

        {/* Analysis Options */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {options.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="group relative bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${option.color} opacity-5 rounded-2xl group-hover:opacity-10 transition-opacity`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-2xl font-bold text-gray-200 mb-3">
                    {option.title}
                  </h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={option.action}
                    className={`w-full bg-gradient-to-r ${option.color} hover:shadow-lg hover:shadow-blue-500/25 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 group-hover:transform group-hover:scale-105`}
                  >
                    <span>{option.buttonText}</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h4 className="text-gray-200 font-semibold">Real-time Processing</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Get instant results with our optimized analysis engine that processes files and features in real-time.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <BarChart3 className="w-6 h-6 text-blue-400" />
              <h4 className="text-gray-200 font-semibold">Detailed Analytics</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Comprehensive reports with feature breakdowns, confidence scores, and actionable recommendations.
            </p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <Cpu className="w-6 h-6 text-green-400" />
              <h4 className="text-gray-200 font-semibold">ML Powered</h4>
            </div>
            <p className="text-gray-400 text-sm">
              Advanced machine learning models trained on extensive malware datasets for accurate detection.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PredictionChoice;