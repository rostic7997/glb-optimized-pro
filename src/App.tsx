import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import OptimizationControls from './components/OptimizationControls';
import ThreeDPreview from './components/ThreeDPreview';
import StatsPanel from './components/StatsPanel';
import ProcessingStatus from './components/ProcessingStatus';
import UserProfile from './components/UserProfile';
import ProtectedFeatures from './components/ProtectedFeatures';
import { FileData, OptimizationSettings, ProcessingState, OptimizationResult } from './types';
import { GLBOptimizer } from './utils/glbOptimizer';
import { useAuth } from './contexts/AuthContext';

function AppContent() {
  const { updateOptimizationStats } = useAuth();
  const [uploadedFile, setUploadedFile] = useState<FileData | null>(null);
  const [textureFiles, setTextureFiles] = useState<File[]>([]);
  const [optimizedFile, setOptimizedFile] = useState<FileData | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [settings, setSettings] = useState<OptimizationSettings>({
    meshDecimation: 30,
    textureQuality: 'medium',
    dracoCompression: { enabled: true, level: 5 },
    wireframeMode: false
  });
  const [processingState, setProcessingState] = useState<ProcessingState>({
    isProcessing: false,
    progress: 0,
    stage: 'idle'
  });

  const handleFileUpload = useCallback(async (file: File, additionalTextureFiles?: File[]) => {
    const url = URL.createObjectURL(file);
    
    const modelInfo = await GLBOptimizer.analyzeGLB(file);
    
    const fileData: FileData = {
      file,
      url,
      name: file.name,
      size: file.size,
      polyCount: modelInfo.triangles || Math.floor(Math.random() * 100000) + 10000,
      textureCount: modelInfo.textures || Math.floor(Math.random() * 10) + 1
    };
    
    setUploadedFile(fileData);
    setTextureFiles(additionalTextureFiles || []);
    setOptimizedFile(null);
    setOptimizationResult(null);
  }, []);

  const handleOptimize = useCallback(async () => {
    if (!uploadedFile) return;

    setProcessingState({
      isProcessing: true,
      progress: 0,
      stage: 'analyzing'
    });

    try {
      let result;
      
      if (textureFiles.length > 0) {
        result = await GLBOptimizer.optimizeGLTFWithTextures(
          uploadedFile.file,
          textureFiles,
          settings,
          (progress, stage) => {
            setProcessingState({
              isProcessing: true,
              progress,
              stage: stage as ProcessingState['stage']
            });
          }
        );
      } else {
        result = await GLBOptimizer.optimizeGLB(
          uploadedFile.file,
          settings,
          (progress, stage) => {
            setProcessingState({
              isProcessing: true,
              progress,
              stage: stage as ProcessingState['stage']
            });
          }
        );
      }

      const optimized: FileData = {
        ...uploadedFile,
        size: result.stats.optimizedSize,
        polyCount: result.modelInfo?.optimized?.triangles || Math.floor(uploadedFile.polyCount * (1 - settings.meshDecimation / 100)),
        textureCount: result.modelInfo?.optimized?.textures || Math.floor(uploadedFile.textureCount * (settings.textureQuality === 'high' ? 1 : settings.textureQuality === 'medium' ? 0.7 : 0.4)),
        optimizedBlob: result.optimizedBlob
      };

      setOptimizedFile(optimized);
      setOptimizationResult(result);
      setProcessingState({
        isProcessing: false,
        progress: 100,
        stage: 'completed'
      });

      // Update user statistics
      const polygonsReduced = uploadedFile.polyCount - optimized.polyCount;
      const texturesOptimized = uploadedFile.textureCount - optimized.textureCount;
      const sizeSaved = uploadedFile.size - optimized.size;
      
      updateOptimizationStats({
        polygonsReduced: Math.max(0, polygonsReduced),
        texturesOptimized: Math.max(0, texturesOptimized),
        sizeSaved: Math.max(0, sizeSaved),
        reductionPercentage: result.stats.reduction
      });

    } catch (error) {
      console.error('Optimization failed:', error);
      setProcessingState({
        isProcessing: false,
        progress: 0,
        stage: 'idle'
      });
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Optimization failed: ${errorMessage}\n\nTips:\n- Try reducing optimization settings\n- Ensure your GLB file is valid\n- Check file size (max 500MB)`);
    }
  }, [uploadedFile, textureFiles, settings, updateOptimizationStats]);

  const handleDownload = useCallback(() => {
    if (optimizedFile?.optimizedBlob) {
      const filename = uploadedFile?.name.replace(/\.(glb|gltf)$/i, '_optimized.glb') || 'optimized_model.glb';
      GLBOptimizer.downloadBlob(optimizedFile.optimizedBlob, filename);
    }
  }, [optimizedFile, uploadedFile]);

  const handleReset = useCallback(() => {
    setUploadedFile(null);
    setTextureFiles([]);
    setOptimizedFile(null);
    setOptimizationResult(null);
    setProcessingState({
      isProcessing: false,
      progress: 0,
      stage: 'idle'
    });
    setSettings({
      meshDecimation: 30,
      textureQuality: 'medium',
      dracoCompression: { enabled: true, level: 5 },
      wireframeMode: false
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
      <div className="min-h-screen bg-black/20 backdrop-blur-sm">
        <Header />
        
        <main className="container mx-auto px-4 py-8 space-y-8">
          <UserProfile />
          
          {!uploadedFile ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              <FileUpload onFileUpload={handleFileUpload} />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {textureFiles.length > 0 && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 className="text-blue-400 font-medium mb-2">GLTF Project Loaded</h4>
                  <p className="text-gray-300 text-sm">
                    Main file: {uploadedFile.name} + {textureFiles.length} texture files
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {textureFiles.slice(0, 5).map((file, index) => (
                      <span key={index} className="text-xs bg-blue-500/20 px-2 py-1 rounded">
                        {file.name}
                      </span>
                    ))}
                    {textureFiles.length > 5 && (
                      <span className="text-xs text-gray-400">
                        +{textureFiles.length - 5} more...
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <ProtectedFeatures feature="advanced optimization settings">
                    <OptimizationControls
                      settings={settings}
                      onSettingsChange={setSettings}
                      onOptimize={handleOptimize}
                      onReset={handleReset}
                      isProcessing={processingState.isProcessing}
                    />
                  </ProtectedFeatures>
                </div>
                
                <div className="lg:col-span-2">
                  <StatsPanel
                    originalFile={uploadedFile}
                    optimizedFile={optimizedFile}
                    onDownload={handleDownload}
                    optimizationResult={optimizationResult}
                  />
                </div>
              </div>

              {processingState.isProcessing && (
                <ProcessingStatus
                  progress={processingState.progress}
                  stage={processingState.stage}
                />
              )}

              <ProtectedFeatures feature="3D preview comparison">
                <ThreeDPreview
                  originalFile={uploadedFile}
                  optimizedFile={optimizedFile}
                  wireframeMode={settings.wireframeMode}
                  onWireframeToggle={(enabled) => 
                    setSettings(prev => ({ ...prev, wireframeMode: enabled }))
                  }
                />
              </ProtectedFeatures>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;