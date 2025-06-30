import React, { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, File, AlertCircle, Folder, Image } from 'lucide-react';

interface FileUploadProps {
  onFileUpload: (file: File, textureFiles?: File[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'glb' | 'gltf'>('glb');
  const [selectedFiles, setSelectedFiles] = useState<{
    gltf?: File;
    textures: File[];
  }>({ textures: [] });

  const validateGLBFile = useCallback((file: File): string | null => {
    if (!file.name.toLowerCase().endsWith('.glb')) {
      return 'Please select a .glb file';
    }
    if (file.size > 500 * 1024 * 1024) {
      return 'File size must be less than 500MB';
    }
    return null;
  }, []);

  const validateGLTFFiles = useCallback((files: File[]): string | null => {
    const gltfFiles = files.filter(f => f.name.toLowerCase().endsWith('.gltf'));
    const textureFiles = files.filter(f => 
      f.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/i)
    );

    if (gltfFiles.length !== 1) {
      return 'Please select exactly one .gltf file';
    }

    if (textureFiles.length === 0) {
      return 'Please include texture files (.png, .jpg, .jpeg, .webp)';
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);
    if (totalSize > 500 * 1024 * 1024) {
      return 'Total file size must be less than 500MB';
    }

    return null;
  }, []);

  const handleGLBFile = useCallback((file: File) => {
    const validationError = validateGLBFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onFileUpload(file);
  }, [onFileUpload, validateGLBFile]);

  const handleGLTFFiles = useCallback((files: File[]) => {
    const validationError = validateGLTFFiles(files);
    if (validationError) {
      setError(validationError);
      return;
    }

    const gltfFile = files.find(f => f.name.toLowerCase().endsWith('.gltf'))!;
    const textureFiles = files.filter(f => 
      f.name.toLowerCase().match(/\.(png|jpg|jpeg|webp)$/i)
    );

    setError(null);
    onFileUpload(gltfFile, textureFiles);
  }, [onFileUpload, validateGLTFFiles]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    
    if (uploadMode === 'glb') {
      if (files.length === 1) {
        handleGLBFile(files[0]);
      } else {
        setError('Please drop only one .glb file');
      }
    } else {
      handleGLTFFiles(files);
    }
  }, [uploadMode, handleGLBFile, handleGLTFFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    
    if (uploadMode === 'glb') {
      if (fileArray.length === 1) {
        handleGLBFile(fileArray[0]);
      } else {
        setError('Please select only one .glb file');
      }
    } else {
      handleGLTFFiles(fileArray);
    }
  }, [uploadMode, handleGLBFile, handleGLTFFiles]);

  const handleFolderInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    handleGLTFFiles(fileArray);
  }, [handleGLTFFiles]);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-white">
          Optimize Your 3D Models
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Reduce file sizes, optimize meshes, and compress textures while maintaining visual quality.
          Perfect for web applications, games, and AR/VR experiences.
        </p>
      </motion.div>

      {/* Upload Mode Selector */}
      <div className="flex justify-center space-x-1 bg-black/20 backdrop-blur-sm rounded-lg p-1 max-w-md mx-auto">
        <button
          onClick={() => setUploadMode('glb')}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-md transition-all text-sm
            ${uploadMode === 'glb' 
              ? 'bg-blue-500 text-white' 
              : 'text-white hover:bg-white/10'
            }
          `}
        >
          <File className="w-4 h-4" />
          <span>GLB File</span>
        </button>
        <button
          onClick={() => setUploadMode('gltf')}
          className={`
            flex items-center space-x-2 px-4 py-2 rounded-md transition-all text-sm
            ${uploadMode === 'gltf' 
              ? 'bg-blue-500 text-white' 
              : 'text-white hover:bg-white/10'
            }
          `}
        >
          <Folder className="w-4 h-4" />
          <span>GLTF + Textures</span>
        </button>
      </div>

      <motion.div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${isDragging 
            ? 'border-blue-400 bg-blue-500/10 scale-105' 
            : 'border-gray-600 hover:border-gray-500 bg-white/5'
          }
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {uploadMode === 'glb' ? (
          <input
            type="file"
            accept=".glb"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        ) : (
          <>
            <input
              type="file"
              accept=".gltf,.png,.jpg,.jpeg,.webp"
              multiple
              onChange={handleFileInput}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <input
              type="file"
              webkitdirectory=""
              onChange={handleFolderInput}
              className="hidden"
              id="folder-input"
            />
          </>
        )}
        
        <motion.div
          animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
          className="space-y-4"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            {uploadMode === 'glb' ? (
              <Upload className="w-8 h-8 text-white" />
            ) : (
              <Folder className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragging 
                ? `Drop your ${uploadMode.toUpperCase()} ${uploadMode === 'gltf' ? 'files' : 'file'} here` 
                : `Upload ${uploadMode.toUpperCase()} ${uploadMode === 'gltf' ? 'Files' : 'File'}`
              }
            </h3>
            <p className="text-gray-400">
              {uploadMode === 'glb' 
                ? 'Drag and drop your .glb file here, or click to browse'
                : 'Drag and drop your .gltf file and textures, or click to browse'
              }
            </p>
            {uploadMode === 'gltf' && (
              <div className="mt-2">
                <label
                  htmlFor="folder-input"
                  className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm cursor-pointer transition-colors"
                >
                  <Folder className="w-4 h-4" />
                  <span>Select Folder</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <File className="w-4 h-4" />
              <span>Max 500MB</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>
                {uploadMode === 'glb' ? 'GLB Format' : 'GLTF + PNG/JPG'}
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg"
        >
          <AlertCircle className="w-5 h-5 text-red-400" />
          <span className="text-red-400">{error}</span>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="grid md:grid-cols-3 gap-6 mt-12"
      >
        {[
          { icon: '🎯', title: 'Smart Optimization', desc: 'Preserves model integrity' },
          { icon: '⚡', title: 'Safe Processing', desc: 'Validates before and after' },
          { icon: '🔒', title: 'Secure & Private', desc: 'Files processed locally' }
        ].map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 + index * 0.1 }}
            className="text-center p-6 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="text-3xl mb-3">{feature.icon}</div>
            <h4 className="text-white font-semibold mb-2">{feature.title}</h4>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FileUpload;