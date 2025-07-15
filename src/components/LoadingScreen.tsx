import React, { useState, useEffect } from 'react';
import { Shield, Brain, Zap, Activity, CheckCircle, Code, Heart } from 'lucide-react';

interface LoadingScreenProps {
  onLoadingComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showLogo, setShowLogo] = useState(false);
  const [showDeveloper, setShowDeveloper] = useState(false);

  const loadingSteps = [
    { icon: Shield, text: 'Initializing Security Protocols', duration: 800 },
    { icon: Brain, text: 'Loading ML Models', duration: 1200 },
    { icon: Zap, text: 'Calibrating Detection Engine', duration: 900 },
    { icon: Activity, text: 'Establishing Real-time Monitoring', duration: 700 },
    { icon: CheckCircle, text: 'System Ready', duration: 500 }
  ];

  useEffect(() => {
    setShowLogo(true);
    
    // Show developer info after logo animation
    setTimeout(() => {
      setShowDeveloper(true);
    }, 1500);
    
    let totalDuration = 0;
    const intervals: NodeJS.Timeout[] = [];

    loadingSteps.forEach((step, index) => {
      totalDuration += step.duration;
      
      const timeout = setTimeout(() => {
        setCurrentStep(index);
        
        // Animate progress for this step
        const stepProgress = ((index + 1) / loadingSteps.length) * 100;
        const progressInterval = setInterval(() => {
          setProgress(prev => {
            const newProgress = Math.min(stepProgress, prev + 2);
            if (newProgress >= stepProgress) {
              clearInterval(progressInterval);
            }
            return newProgress;
          });
        }, 20);
        
        intervals.push(progressInterval);
      }, totalDuration - step.duration);
    });

    // Complete loading
    const completeTimeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        onLoadingComplete();
      }, 500);
    }, totalDuration);

    return () => {
      intervals.forEach(clearInterval);
      clearTimeout(completeTimeout);
    };
  }, [onLoadingComplete]);

  const CurrentIcon = loadingSteps[currentStep]?.icon || Shield;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col items-center justify-center z-50">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-green-500/10 animate-pulse" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 text-center flex-1 flex flex-col justify-center">
        {/* Logo Animation */}
        <div className={`mb-8 transition-all duration-1000 ${showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          <div className="relative">
            <div className="w-24 h-24 mx-auto mb-4 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-spin-slow opacity-20" />
              <div className="absolute inset-2 bg-gray-900 rounded-full flex items-center justify-center">
                <Shield className="w-10 h-10 text-green-400" />
              </div>
              {/* Pulse rings */}
              <div className="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Mal-Sim
            </h1>
            <p className="text-gray-400 text-lg mt-2">Next Generation Malware Detection</p>
          </div>
        </div>

        {/* Loading Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gray-800 rounded-full border border-gray-700 relative">
              <CurrentIcon className="w-6 h-6 text-green-400 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-green-400/50 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-300 text-lg font-medium">
            {loadingSteps[currentStep]?.text || 'Initializing...'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Loading</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
              <div className="absolute right-0 top-0 w-4 h-full bg-white/40 blur-sm" />
            </div>
          </div>
        </div>

        {/* Loading Dots */}
        <div className="flex justify-center mt-6 space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 bg-green-400 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      {/* Simple Developer Footer */}
      <div className={`relative z-10 w-full transition-all duration-1000 ${showDeveloper ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="bg-gray-800/60 backdrop-blur-sm border-t border-gray-600/30 p-4">
          <div className="max-w-md mx-auto text-center">
            {/* Developer Badge */}
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                  <Code className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  APP
                </h3>
                <p className="text-gray-400 text-xs">Full Stack Developer</p>
              </div>
            </div>
            
            {/* Simple Message */}
            <div className="flex items-center justify-center gap-2 text-gray-400 text-sm mb-3">
              <span>Crafted with</span>
              <Heart className="w-4 h-4 text-red-400 animate-pulse" />
              <span>for cybersecurity</span>
            </div>

            {/* Copyright */}
            <div className="text-xs text-gray-500 border-t border-gray-600/30 pt-3">
              <p>© MAY 2025 Mal-Sim • Developed by TEAM APP <p className="text-gray-400 text-xs">
                Developers -- <br/>
                Arun J Pragadheesh RA PranusshRaj MG</p></p>
               
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
