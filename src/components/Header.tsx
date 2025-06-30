import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Github, Star } from 'lucide-react';
import AuthButton from './AuthButton';

const Header: React.FC = () => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/10 bg-black/20 backdrop-blur-md"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                GLB Optimizer Pro
              </h1>
              <p className="text-gray-400 text-sm">Professional 3D Model Optimization</p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.a
              href="https://github.com/your-repo/glb-optimizer-pro"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            >
              <Star className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm">Star on GitHub</span>
            </motion.a>
            
            <AuthButton />
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;