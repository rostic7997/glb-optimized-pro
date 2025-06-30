import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Download, Trash2, Calendar, FileText, TrendingDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface OptimizationRecord {
  id: string;
  filename: string;
  originalSize: number;
  optimizedSize: number;
  reduction: number;
  timestamp: Date;
  settings: any;
}

const OptimizationHistory: React.FC = () => {
  const { user } = useAuth();
  const [history, setHistory] = useState<OptimizationRecord[]>([]);

  useEffect(() => {
    if (user) {
      // Load optimization history from localStorage
      const savedHistory = localStorage.getItem(`optimization_history_${user.id}`);
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed.map((record: any) => ({
          ...record,
          timestamp: new Date(record.timestamp)
        })));
      }
    }
  }, [user]);

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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const deleteRecord = (id: string) => {
    const updatedHistory = history.filter(record => record.id !== id);
    setHistory(updatedHistory);
    if (user) {
      localStorage.setItem(`optimization_history_${user.id}`, JSON.stringify(updatedHistory));
    }
  };

  const clearHistory = () => {
    setHistory([]);
    if (user) {
      localStorage.removeItem(`optimization_history_${user.id}`);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <History className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-white">Optimization History</h3>
        </div>
        
        {history.length > 0 && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={clearHistory}
            className="flex items-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear All</span>
          </motion.button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No optimization history yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Your optimization history will appear here after processing files
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((record) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h4 className="text-white font-medium truncate max-w-xs">
                      {record.filename}
                    </h4>
                    <div className="flex items-center space-x-1 text-green-400 text-sm">
                      <TrendingDown className="w-3 h-3" />
                      <span>-{record.reduction}%</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{formatDate(record.timestamp)}</span>
                    </div>
                    <span>
                      {formatFileSize(record.originalSize)} → {formatFileSize(record.optimizedSize)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg text-blue-400 transition-colors"
                    title="Download again"
                  >
                    <Download className="w-4 h-4" />
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => deleteRecord(record.id)}
                    className="p-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-400 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OptimizationHistory;