import React from 'react';
import { motion } from 'framer-motion';
import { FileData, OptimizationResult } from '../types';
import { File, Triangle, Image, HardDrive, TrendingDown, Download, Share2, CheckCircle } from 'lucide-react';

interface StatsPanelProps {
  originalFile: FileData;
  optimizedFile: FileData | null;
  onDownload?: () => void;
  optimizationResult?: OptimizationResult | null;
}

const StatsPanel: React.FC<StatsPanelProps> = ({ 
  originalFile, 
  optimizedFile, 
  onDownload,
  optimizationResult 
}) => {
  const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  const calculateReduction = (original: number, optimized: number): number => {
    return Math.round(((original - optimized) / original) * 100);
  };

  const stats = [
    {
      icon: HardDrive,
      label: 'File Size',
      original: formatFileSize(originalFile.size),
      optimized: optimizedFile ? formatFileSize(optimizedFile.size) : '—',
      reduction: optimizedFile ? calculateReduction(originalFile.size, optimizedFile.size) : 0,
      color: 'blue'
    },
    {
      icon: Triangle,
      label: 'Polygons',
      original: formatNumber(originalFile.polyCount),
      optimized: optimizedFile ? formatNumber(optimizedFile.polyCount) : '—',
      reduction: optimizedFile ? calculateReduction(originalFile.polyCount, optimizedFile.polyCount) : 0,
      color: 'green'
    },
    {
      icon: Image,
      label: 'Textures',
      original: formatNumber(originalFile.textureCount),
      optimized: optimizedFile ? formatNumber(optimizedFile.textureCount) : '—',
      reduction: optimizedFile ? calculateReduction(originalFile.textureCount, optimizedFile.textureCount) : 0,
      color: 'purple'
    }
  ];

  const actualReduction = optimizationResult?.stats.reduction || 
    (optimizedFile ? calculateReduction(originalFile.size, optimizedFile.size) : 0);

  return (
    <div className="space-y-6">
      {/* File Info Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <File className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white">File Analysis</h3>
            <p className="text-gray-400">{originalFile.name}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white/5 rounded-xl p-4 border border-white/10"
            >
              <div className="flex items-center space-x-2 mb-3">
                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                <span className="text-gray-300 text-sm font-medium">{stat.label}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Original</span>
                  <span className="text-white font-mono">{stat.original}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400">Optimized</span>
                  <span className="text-white font-mono">{stat.optimized}</span>
                </div>
                {optimizedFile && stat.reduction > 0 && (
                  <div className="flex items-center space-x-2 pt-1 border-t border-white/10">
                    <TrendingDown className="w-3 h-3 text-green-400" />
                    <span className="text-green-400 text-xs font-medium">
                      -{stat.reduction}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Download Section */}
      {optimizedFile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">Optimization Complete!</h3>
                <p className="text-gray-300">
                  Reduced file size by {actualReduction}%
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                -{actualReduction}%
              </div>
              <div className="text-xs text-gray-400">Size Reduction</div>
            </div>
          </div>

          <div className="flex space-x-3">
            <motion.button
              onClick={onDownload}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Download Optimized</span>
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center space-x-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium transition-colors"
              onClick={() => {
                if (navigator.share && optimizedFile.optimizedBlob) {
                  const file = new File([optimizedFile.optimizedBlob], originalFile.name.replace('.glb', '_optimized.glb'), {
                    type: 'model/gltf-binary'
                  });
                  navigator.share({
                    title: 'Optimized GLB Model',
                    text: `Optimized GLB model with ${actualReduction}% size reduction`,
                    files: [file]
                  }).catch(console.error);
                } else {
                  // Fallback: copy link to clipboard
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </motion.button>
          </div>

          {optimizationResult && (
            <div className="mt-4 p-3 bg-black/20 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Original Size:</span>
                  <span className="text-white ml-2 font-mono">
                    {formatFileSize(optimizationResult.stats.originalSize)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Optimized Size:</span>
                  <span className="text-white ml-2 font-mono">
                    {formatFileSize(optimizationResult.stats.optimizedSize)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StatsPanel;