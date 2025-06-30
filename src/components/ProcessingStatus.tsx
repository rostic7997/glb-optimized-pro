import React from 'react';
import { motion } from 'framer-motion';
import { ProcessingState } from '../types';
import { Loader2, Search, Zap, Compass as Compress, CheckCircle } from 'lucide-react';

interface ProcessingStatusProps {
  progress: number;
  stage: ProcessingState['stage'];
}

const ProcessingStatus: React.FC<ProcessingStatusProps> = ({ progress, stage }) => {
  const getStageInfo = (currentStage: ProcessingState['stage']) => {
    const stages = {
      analyzing: { icon: Search, label: 'Analyzing Model', color: 'blue' },
      optimizing: { icon: Zap, label: 'Optimizing Geometry', color: 'yellow' },
      compressing: { icon: Compress, label: 'Compressing Assets', color: 'purple' },
      finalizing: { icon: CheckCircle, label: 'Finalizing Output', color: 'green' },
      completed: { icon: CheckCircle, label: 'Completed', color: 'green' },
      idle: { icon: Loader2, label: 'Idle', color: 'gray' }
    };
    
    return stages[currentStage] || stages.idle;
  };

  const stageInfo = getStageInfo(stage);
  const StageIcon = stageInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
    >
      <div className="flex items-center space-x-4 mb-6">
        <div className={`w-12 h-12 bg-gradient-to-br from-${stageInfo.color}-500 to-${stageInfo.color}-600 rounded-full flex items-center justify-center`}>
          <StageIcon className={`w-6 h-6 text-white ${stage !== 'completed' ? 'animate-spin' : ''}`} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">{stageInfo.label}</h3>
          <p className="text-gray-400">Processing your GLB file...</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-300">Progress</span>
          <span className={`text-${stageInfo.color}-400 font-mono`}>{Math.round(progress)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full bg-gradient-to-r from-${stageInfo.color}-500 to-${stageInfo.color}-400 rounded-full`}
          />
        </div>
      </div>

      {/* Stage Timeline */}
      <div className="mt-6 flex justify-between">
        {['analyzing', 'optimizing', 'compressing', 'finalizing'].map((stageName, index) => {
          const isActive = stageName === stage;
          const isCompleted = ['analyzing', 'optimizing', 'compressing', 'finalizing'].indexOf(stage) > index;
          
          return (
            <div key={stageName} className="flex flex-col items-center space-y-2">
              <div className={`
                w-3 h-3 rounded-full transition-all duration-300
                ${isActive ? 'bg-blue-400 scale-125' : isCompleted ? 'bg-green-400' : 'bg-gray-600'}
              `} />
              <span className={`
                text-xs capitalize transition-colors duration-300
                ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}
              `}>
                {stageName}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ProcessingStatus;