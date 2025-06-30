export interface FileData {
  file: File;
  url: string;
  name: string;
  size: number;
  polyCount: number;
  textureCount: number;
  optimizedBlob?: Blob;
}

export interface OptimizationSettings {
  meshDecimation: number;
  textureQuality: 'high' | 'medium' | 'low';
  dracoCompression: {
    enabled: boolean;
    level: number;
  };
  wireframeMode: boolean;
}

export interface ProcessingState {
  isProcessing: boolean;
  progress: number;
  stage: 'idle' | 'analyzing' | 'optimizing' | 'compressing' | 'finalizing' | 'completed';
}

export interface Stats {
  fileSizeReduction: number;
  polyCountReduction: number;
  textureReduction: number;
}

export interface OptimizationResult {
  optimizedBlob: Blob;
  stats: {
    originalSize: number;
    optimizedSize: number;
    reduction: number;
  };
}