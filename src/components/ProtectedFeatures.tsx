import React from 'react';
import { motion } from 'framer-motion';
import { Lock, Github, Zap, Download, Cloud, History } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedFeaturesProps {
  children: React.ReactNode;
  feature?: string;
}

const ProtectedFeatures: React.FC<ProtectedFeaturesProps> = ({ 
  children, 
  feature = "advanced optimization" 
}) => {
  const { user, login } = useAuth();

  if (user) {
    return <>{children}</>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative"
    >
      {/* Blurred content */}
      <div className="filter blur-sm pointer-events-none opacity-50">
        {children}
      </div>
      
      {/* Overlay */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 max-w-md"
        >
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Lock className="w-8 h-8 text-white" />
          </div>
          
          <h3 className="text-xl font-semibold text-white mb-2">
            Sign in to unlock {feature}
          </h3>
          
          <p className="text-gray-300 mb-6 text-sm">
            Get access to advanced optimization features, cloud storage, and optimization history.
          </p>
          
          <div className="grid grid-cols-2 gap-3 mb-6 text-xs">
            <div className="flex items-center space-x-2 text-gray-300">
              <Zap className="w-3 h-3 text-blue-400" />
              <span>Advanced Settings</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Download className="w-3 h-3 text-green-400" />
              <span>Batch Processing</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <Cloud className="w-3 h-3 text-purple-400" />
              <span>Cloud Storage</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-300">
              <History className="w-3 h-3 text-yellow-400" />
              <span>History & Analytics</span>
            </div>
          </div>
          
          <motion.button
            onClick={login}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center space-x-2 w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg text-white font-medium transition-all"
          >
            <Github className="w-4 h-4" />
            <span>Sign in with GitHub</span>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ProtectedFeatures;