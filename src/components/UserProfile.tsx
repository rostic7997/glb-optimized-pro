import React from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, MapPin, Link as LinkIcon, Mail, Github, Users, BookOpen, TrendingDown, Zap, Triangle, Image, HardDrive } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile: React.FC = () => {
  const { user, optimizationStats } = useAuth();

  if (!user) return null;

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
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 mb-8 overflow-hidden"
    >
      {/* Header Section */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img 
              src={user.avatar_url} 
              alt={user.name || user.login}
              className="w-20 h-20 rounded-full border-3 border-blue-400 shadow-lg"
            />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="text-2xl font-bold text-white">
                {user.name || user.login}
              </h3>
              <motion.a
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                className="p-1 bg-gray-700 hover:bg-gray-600 rounded-full transition-colors"
              >
                <Github className="w-4 h-4 text-white" />
              </motion.a>
            </div>
            
            <p className="text-blue-400 font-medium mb-3">@{user.login}</p>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300">
              {user.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span>{user.email}</span>
                </div>
              )}
              
              {user.created_at && (
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>Joined {formatDate(user.created_at)}</span>
                </div>
              )}
              
              {user.public_repos !== undefined && (
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{user.public_repos} repositories</span>
                </div>
              )}
              
              {user.followers !== undefined && (
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{user.followers} followers</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Status</div>
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">Authenticated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Optimization Statistics */}
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-4 h-4 text-white" />
          </div>
          <div>
            <h4 className="text-xl font-semibold text-white">Optimization Statistics</h4>
            <p className="text-gray-400">Your 3D model optimization achievements</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Optimizations */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-xl p-4 border border-blue-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {optimizationStats.totalOptimizations}
                </div>
                <div className="text-xs text-blue-300">Total Models</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Files optimized</div>
          </motion.div>

          {/* Polygons Reduced */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl p-4 border border-green-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                <Triangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatNumber(optimizationStats.totalPolygonsReduced)}
                </div>
                <div className="text-xs text-green-300">Polygons</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Triangles reduced</div>
          </motion.div>

          {/* Textures Optimized */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-xl p-4 border border-purple-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                <Image className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {optimizationStats.totalTexturesOptimized}
                </div>
                <div className="text-xs text-purple-300">Textures</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Images processed</div>
          </motion.div>

          {/* Size Saved */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-xl p-4 border border-orange-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <HardDrive className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {formatFileSize(optimizationStats.totalSizeSaved)}
                </div>
                <div className="text-xs text-orange-300">Saved</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Storage reduced</div>
          </motion.div>

          {/* Average Reduction */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-br from-pink-500/20 to-pink-600/20 rounded-xl p-4 border border-pink-500/30"
          >
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-pink-500 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">
                  {optimizationStats.averageReduction}%
                </div>
                <div className="text-xs text-pink-300">Average</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">Reduction rate</div>
          </motion.div>
        </div>

        {optimizationStats.totalOptimizations === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 mt-4"
          >
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
              <Zap className="w-8 h-8 text-gray-400" />
            </div>
            <h5 className="text-lg font-semibold text-white mb-2">Start Optimizing!</h5>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Upload your first GLB file to begin tracking your optimization statistics. 
              Watch as your polygon count, texture usage, and file sizes improve!
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default UserProfile;