import React from 'react';
import { 
  Shield, 
  Code, 
  Heart, 
  Github, 
  Linkedin, 
  Mail, 
  Globe,
  Cpu,
  Database,
  Lock
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                  Mal-Sim
                </h3>
                <p className="text-gray-400 text-sm">Next Generation Malware Detection</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Advanced AI-powered malware detection system utilizing machine learning algorithms 
              and behavioral analysis to protect against emerging cyber threats in real-time.
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-green-400">
                <Cpu className="w-4 h-4" />
                <span className="text-xs">ML Powered</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <Database className="w-4 h-4" />
                <span className="text-xs">Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-purple-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs">Secure</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: 'Dashboard', href: '/' },
                { name: 'File Scanner', href: '/scan' },
                { name: 'ML Analysis', href: '/ml-input' },
                { name: 'Documentation', href: '#' },
                { name: 'API Reference', href: '#' },
                { name: 'Support', href: '#' }
              ].map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.href}
                    className="text-gray-400 hover:text-green-400 transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developer Info */}
          <div>
            <h4 className="text-gray-200 font-semibold mb-4">Developer</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Code className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-gray-200 font-medium text-sm">APP</p>
                  <p className="text-gray-400 text-xs">Full Stack Developer</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-400">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-xs">Built with passion for cybersecurity</span>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-3 pt-2">
                <a 
                  href="#" 
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  title="GitHub"
                >
                  <Github className="w-4 h-4 text-gray-400 group-hover:text-white" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-blue-400" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  title="Email"
                >
                  <Mail className="w-4 h-4 text-gray-400 group-hover:text-green-400" />
                </a>
                <a 
                  href="#" 
                  className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors group"
                  title="Portfolio"
                >
                  <Globe className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Copyright */}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <span>© {currentYear} Mal-Sim. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Developed by <span className="text-green-400 font-medium">APP</span>
                <Code className="w-3 h-3 text-green-400" />
              </span>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                Security
              </a>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-400 rounded-full" />
                React + TypeScript
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                TensorFlow.js
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full" />
                Machine Learning
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                Real-time Analysis
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-400 rounded-full" />
                Cybersecurity
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;