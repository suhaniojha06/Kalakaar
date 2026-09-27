import { CraftMetadata } from './product';

export interface AudioMetadata {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  durationSeconds: number;
  sampleRate?: number;
  channels?: number;
}

export type AudioProcessingStage =
  | 'idle'
  | 'recording'
  | 'reading'
  | 'analyzing'
  | 'transcribing'
  | 'extracting'
  | 'complete'
  | 'error';

export interface AudioProcessingStatus {
  stage: AudioProcessingStage;
  progress: number; // 0 to 100
  message: string;
  detectedLanguage?: string;
  confidence?: number;
}

export interface AudioInputDetails {
  uri?: string;
  blob?: Blob;
  file?: File;
  name?: string;
  type?: string;
  durationSeconds?: number;
  base64?: string;
  sampleId?: string;
}

export type AudioInputSource = AudioInputDetails | Blob | File | string;

export interface AudioTranscriptionResult {
  transcript: string;
  confidence: number;
  detectedLanguage: string;
  durationSeconds: number;
  audioUrl?: string;
  audioMetadata?: AudioMetadata;
  extractedMetadata?: Partial<CraftMetadata>;
}

export interface ProcessAudioOptions {
  language?: string;
  onProgress?: (status: AudioProcessingStatus) => void;
  craftContext?: string;
}
