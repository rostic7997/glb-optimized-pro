import React from 'react';
import { motion } from 'framer-motion';
import { Sliders, Zap, RotateCcw, Settings, Layers, Image, Compass as Compress } from 'lucide-react';
import { OptimizationSettings } from '../types';

interface OptimizationControlsProps {
  settings: OptimizationSettings;
  onSettingsChange: (settings: OptimizationSettings) => void;
  onOptimize: () => void;
  onReset: () => void;
  isProcessing: boolean;
}

const OptimizationControls: React.FC<OptimizationControlsProps> = ({
  settings,
  onSettingsChange,
  onOptimize,
  onReset,
  isProcessing
}) => {
  const handleSliderChange = (field: keyof OptimizationSettings, value: number) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleSelectChange = (field: keyof OptimizationSettings, value: any) => {
    onSettingsChange({ ...settings, [field]: value });
  };

  const handleDracoChange = (field: keyof OptimizationSettings['dracoCompression'], value: any) => {
    onSettingsChange({
      ...settings,
      dracoCompression: { ...settings.dracoCompression, [field]: value }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <Settings className="w-4 h-4 text-white" />
        </div>
        <h3 className="text-xl font-semibold text-white">Optimization Settings</h3>
      </div>

      <div className="space-y-6">
        {/* Mesh Decimation */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-blue-400" />
              <label className="text-white font-medium">Mesh Decimation</label>
            </div>
            <span className="text-blue-400 font-mono">{settings.meshDecimation}%</span>
          </div>
          <div className="relative">
            <input
              type="range"
              min="0"
              max="100"
              value={settings.meshDecimation}
              onChange={(e) => handleSliderChange('meshDecimation', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>No reduction</span>
              <span>Maximum</span>
            </div>
          </div>
          <p className="text-xs text-gray-400">
            Reduces polygon count. Higher values = smaller files but lower quality.
          </p>
        </div>

        {/* Texture Quality */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-green-400" />
            <label className="text-white font-medium">Texture Quality</label>
          </div>
          <select
            value={settings.textureQuality}
            onChange={(e) => handleSelectChange('textureQuality', e.target.value)}
            className="w-full p-3 bg-gray-800/80 border border-gray-600 rounded-lg text-white focus:border-blue-400 focus:outline-none"
          >
            <option value="high">High Quality (100%)</option>
            <option value="medium">Medium Quality (50%)</option>
            <option value="low">Low Quality (25%)</option>
          </select>
        </div>

        {/* Draco Compression */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compress className="w-4 h-4 text-purple-400" />
              <label className="text-white font-medium">Draco Compression</label>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.dracoCompression.enabled}
                onChange={(e) => handleDracoChange('enabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-500"></div>
            </label>
          </div>
          
          {settings.dracoCompression.enabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Compression Level</span>
                <span className="text-purple-400 font-mono">{settings.dracoCompression.level}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={settings.dracoCompression.level}
                onChange={(e) => handleDracoChange('level', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
            </motion.div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-4 border-t border-white/10">
          <motion.button
            onClick={onOptimize}
            disabled={isProcessing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all
              ${isProcessing 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
              }
            `}
          >
            <Zap className="w-4 h-4" />
            <span>{isProcessing ? 'Processing...' : 'Optimize Model'}</span>
          </motion.button>

          <motion.button
            onClick={onReset}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-white/10 hover:bg-white/20 rounded-lg text-white font-medium transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Settings</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default OptimizationControls;