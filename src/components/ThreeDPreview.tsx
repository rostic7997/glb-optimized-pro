import React, { Suspense, useState, useRef } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment, Grid, useGLTF } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { motion } from 'framer-motion';
import { FileData } from '../types';
import { Eye, Grid3x3, RotateCcw, ZoomIn, Move3d, AlertCircle } from 'lucide-react';
import * as THREE from 'three';

interface ThreeDPreviewProps {
  originalFile: FileData;
  optimizedFile: FileData | null;
  wireframeMode: boolean;
  onWireframeToggle: (enabled: boolean) => void;
}

// GLB Model Component
const GLBModel: React.FC<{ url: string; wireframe: boolean; color?: string }> = ({ 
  url, 
  wireframe, 
  color 
}) => {
  const gltf = useGLTF(url);
  const meshRef = useRef<THREE.Group>(null);

  React.useEffect(() => {
    if (gltf.scene && meshRef.current) {
      // Apply wireframe mode to all meshes
      gltf.scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (wireframe) {
            child.material = new THREE.MeshBasicMaterial({
              color: color || '#3B82F6',
              wireframe: true,
              transparent: true,
              opacity: 0.8
            });
          } else {
            // Restore original material or apply color
            if (color && child.material instanceof THREE.MeshStandardMaterial) {
              child.material.color.setHex(parseInt(color.replace('#', '0x')));
            }
          }
        }
      });
    }
  }, [gltf.scene, wireframe, color]);

  return <primitive ref={meshRef} object={gltf.scene} />;
};

// Fallback Model Component
const FallbackModel: React.FC<{ wireframe: boolean; color: string }> = ({ wireframe, color }) => {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial 
        color={color} 
        wireframe={wireframe}
        transparent={wireframe}
        opacity={wireframe ? 0.8 : 1}
      />
    </mesh>
  );
};

// Model Loader with Error Handling
const ModelLoader: React.FC<{ 
  file: FileData; 
  wireframe: boolean; 
  color: string;
  onError?: (error: Error) => void;
}> = ({ file, wireframe, color, onError }) => {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error) => {
    console.error('Failed to load GLB model:', error);
    setHasError(true);
    onError?.(error);
  };

  if (hasError) {
    return <FallbackModel wireframe={wireframe} color={color} />;
  }

  try {
    return (
      <Suspense fallback={<FallbackModel wireframe={wireframe} color={color} />}>
        <GLBModel 
          url={file.url} 
          wireframe={wireframe} 
          color={color}
        />
      </Suspense>
    );
  } catch (error) {
    handleError(error as Error);
    return <FallbackModel wireframe={wireframe} color={color} />;
  }
};

const Scene: React.FC<{ 
  file: FileData; 
  wireframe: boolean; 
  modelColor: string;
  onModelError?: (error: Error) => void;
}> = ({ file, wireframe, modelColor, onModelError }) => {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -5]} intensity={0.3} />
      
      <ModelLoader 
        file={file}
        wireframe={wireframe} 
        color={modelColor}
        onError={onModelError}
      />
      
      <Grid 
        args={[20, 20]} 
        cellSize={1} 
        cellColor="white" 
        sectionColor="white" 
        fadeDistance={10}
        fadeStrength={1}
        infiniteGrid
      />
      <Environment preset="studio" />
    </>
  );
};

const ThreeDPreview: React.FC<ThreeDPreviewProps> = ({
  originalFile,
  optimizedFile,
  wireframeMode,
  onWireframeToggle
}) => {
  const [activeView, setActiveView] = useState<'original' | 'optimized' | 'split'>('split');
  const [modelError, setModelError] = useState<string | null>(null);
  const controlsRef = useRef<any>(null);

  const handleModelError = (error: Error) => {
    setModelError('Failed to load 3D model. Using fallback preview.');
  };

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const ViewerControls = () => (
    <div className="absolute top-4 right-4 flex space-x-2 z-10">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onWireframeToggle(!wireframeMode)}
        className={`
          p-2 rounded-lg transition-colors backdrop-blur-sm
          ${wireframeMode 
            ? 'bg-blue-500 text-white' 
            : 'bg-white/10 text-white hover:bg-white/20'
          }
        `}
        title="Toggle Wireframe"
      >
        <Grid3x3 className="w-4 h-4" />
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={resetCamera}
        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4" />
      </motion.button>
    </div>
  );

  const ViewModeSelector = () => (
    <div className="absolute top-4 left-4 flex space-x-1 bg-black/20 backdrop-blur-sm rounded-lg p-1 z-10">
      {[
        { key: 'original', label: 'Original', icon: Eye },
        { key: 'optimized', label: 'Optimized', icon: ZoomIn, disabled: !optimizedFile },
        { key: 'split', label: 'Compare', icon: Move3d, disabled: !optimizedFile }
      ].map(({ key, label, icon: Icon, disabled }) => (
        <motion.button
          key={key}
          whileHover={!disabled ? { scale: 1.02 } : {}}
          whileTap={!disabled ? { scale: 0.98 } : {}}
          onClick={() => !disabled && setActiveView(key as any)}
          disabled={disabled}
          className={`
            flex items-center space-x-2 px-3 py-2 rounded-md transition-all text-sm
            ${activeView === key 
              ? 'bg-blue-500 text-white' 
              : disabled 
                ? 'text-gray-500 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }
          `}
        >
          <Icon className="w-4 h-4" />
          <span>{label}</span>
        </motion.button>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
    >
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">3D Preview</h3>
            <p className="text-gray-400">Interactive model viewer with real-time comparison</p>
          </div>
          {modelError && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">Using fallback preview</span>
            </div>
          )}
        </div>
      </div>

      <div className="relative h-96 bg-gray-900">
        <ViewerControls />
        <ViewModeSelector />
        
        {activeView === 'split' && optimizedFile ? (
          <div className="flex h-full">
            <div className="flex-1 relative border-r border-white/20">
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs z-10">
                Original
              </div>
              <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <Scene 
                  file={originalFile}
                  wireframe={wireframeMode} 
                  modelColor="#3B82F6"
                  onModelError={handleModelError}
                />
                <OrbitControls 
                  ref={controlsRef}
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  maxDistance={20}
                  minDistance={2}
                />
              </Canvas>
            </div>
            <div className="flex-1 relative">
              <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs z-10">
                Optimized
              </div>
              <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
                <Scene 
                  file={optimizedFile}
                  wireframe={wireframeMode} 
                  modelColor="#10B981"
                  onModelError={handleModelError}
                />
                <OrbitControls 
                  enablePan={true} 
                  enableZoom={true} 
                  enableRotate={true}
                  maxDistance={20}
                  minDistance={2}
                />
              </Canvas>
            </div>
          </div>
        ) : (
          <div className="relative h-full">
            <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs z-10">
              {activeView === 'optimized' ? 'Optimized' : 'Original'}
            </div>
            <Canvas camera={{ position: [5, 5, 5], fov: 50 }}>
              <Scene 
                file={activeView === 'optimized' && optimizedFile ? optimizedFile : originalFile}
                wireframe={wireframeMode} 
                modelColor={activeView === 'optimized' ? '#10B981' : '#3B82F6'}
                onModelError={handleModelError}
              />
              <OrbitControls 
                ref={controlsRef}
                enablePan={true} 
                enableZoom={true} 
                enableRotate={true}
                maxDistance={20}
                minDistance={2}
              />
            </Canvas>
          </div>
        )}
      </div>

      <div className="p-4 bg-black/20">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4 text-gray-400">
            <span>🖱️ Rotate</span>
            <span>📏 Pan</span>
            <span>🔍 Zoom</span>
          </div>
          <div className="text-gray-400">
            {activeView === 'split' ? 'Side-by-side comparison' : 
             activeView === 'optimized' ? 'Optimized model view' : 'Original model view'}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThreeDPreview;