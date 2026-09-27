import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from 'react';
import { Platform } from 'react-native';
import { Product, SampleCraft, MarketplaceChannelId } from '../types/product';
import { AppTab, WizardStep } from '../types/navigation';
import {
  AudioInputSource,
  AudioMetadata,
  AudioProcessingStatus,
  AudioTranscriptionResult,
  ProcessAudioOptions,
} from '../types/audio';
import {
  processAudioInput as processAudioInputService,
  createBrowserSpeechRecognizer,
  SpeechRecognizerHandle,
} from '../services/audioService';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import { useLanguage } from './LanguageContext';

interface ProductContextType {
  products: Product[];
  activeDraft: SampleCraft;
  currentStep: WizardStep;
  activeTab: AppTab;
  previewMode: 'enhanced' | 'original';

  // Audio recording & processing states
  isRecording: boolean;
  recordingSeconds: number;
  liveTranscript: string;
  isProcessingAudio: boolean;
  audioProcessingStatus: AudioProcessingStatus | null;
  audioMetadata: AudioMetadata | null;
  transcriptionConfidence: number | null;
  currentAudioUrl: string | null;
  playingAudioId: string | null;

  // Pricing
  userPrice: number;
  selectedChannels: MarketplaceChannelId[];
  isExporting: boolean;
  exportSuccessModalVisible: boolean;
  lastExportedProduct: Product | null;

  // Actions
  setActiveTab: (tab: AppTab) => void;
  setCurrentStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPreviewMode: (mode: 'enhanced' | 'original') => void;
  selectSampleCraft: (craft: SampleCraft) => void;

  // Audio input & processing actions
  processAudioInput: (
    audio: AudioInputSource,
    options?: ProcessAudioOptions
  ) => Promise<AudioTranscriptionResult>;
  startVoiceRecording: () => Promise<void>;
  stopVoiceRecording: () => Promise<void>;
  cancelVoiceRecording: () => void;
  uploadAudioFile: (fileOrBlob: File | Blob) => Promise<void>;
  setLiveTranscriptDirect: (text: string) => void;
  toggleAudioPlayback: (audioIdOrUrl?: string) => void;

  // Pricing & Export actions
  adjustPrice: (delta: number) => void;
  setUserPriceDirect: (price: number) => void;
  toggleChannel: (channelId: MarketplaceChannelId) => void;
  exportActiveProduct: () => void;
  closeExportModal: () => void;
  startNewCataloging: () => void;
  resumeDraft: (product: Product) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentLanguage } = useLanguage();
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [activeDraft, setActiveDraft] = useState<SampleCraft>(SAMPLE_CRAFTS[0]);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [activeTab, setActiveTab] = useState<AppTab>('studio');
  const [previewMode, setPreviewMode] = useState<'enhanced' | 'original'>('enhanced');

  // Audio states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [isProcessingAudio, setIsProcessingAudio] = useState<boolean>(false);
  const [audioProcessingStatus, setAudioProcessingStatus] = useState<AudioProcessingStatus | null>(null);
  const [audioMetadata, setAudioMetadata] = useState<AudioMetadata | null>(null);
  const [transcriptionConfidence, setTranscriptionConfidence] = useState<number | null>(0.99);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);

  const getTranscriptForLanguage = useCallback((craft: SampleCraft, lang: string): string => {
    switch (lang) {
      case 'hi':
        return craft.sampleVoiceNote.transcriptHi;
      case 'pa':
        return craft.sampleVoiceNote.transcriptPa;
      case 'te':
        return `ఇది ప్రాకృతిక రంగులతో చెక్క బ్లాకుల ద్వారా తయారుచేసిన అసలైన ${craft.title}. 28 గంటల నిరంతర శ్రమతో నేసిన సంప్రదాయ కళ.`;
      case 'ta':
        return `இது இயற்கை வண்ணங்களால் வடிவமைக்கப்பட்ட பாரம்பரிய ${craft.title}. 28 மணிநேர உழைப்பில் உருவான கைவினைப் பொருள்.`;
      case 'bn':
        return `এটি ঐতিহ্যবাহী প্রাকৃতিক রঙের তৈরি খাঁটি ${craft.title}। ২৮ ঘণ্টার নিখুঁত হাতের কাজে তৈরি।`;
      case 'mr':
        return `हे अस्सल नैसर्गिक रंगांनी हाताने तयार केलेले ${craft.title} आहे. २८ तासांच्या कारागिरीने साकारलेली पारंपारिक कला.`;
      case 'en':
      default:
        return craft.sampleVoiceNote.transcriptEn;
    }
  }, []);

  const [liveTranscript, setLiveTranscript] = useState<string>(() =>
    getTranscriptForLanguage(SAMPLE_CRAFTS[0], currentLanguage)
  );

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

  // References for live web speech recognition and media recording
  const speechRecognizerRef = useRef<SpeechRecognizerHandle | null>(null);
  const mediaRecorderRef = useRef<any>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const liveSpeechBufferRef = useRef<string>('');
  const lastProcessedRef = useRef<{ craftId: string; lang: string }>({
    craftId: SAMPLE_CRAFTS[0].id,
    lang: currentLanguage,
  });

  // Pricing
  const [userPrice, setUserPrice] = useState<number>(SAMPLE_CRAFTS[0].pricing.suggestedPrice);

  // Marketplace selection
  const [selectedChannels, setSelectedChannels] = useState<MarketplaceChannelId[]>([
    'ondc',
    'india_handmade',
    'gem',
  ]);

  // Export process
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportSuccessModalVisible, setExportSuccessModalVisible] = useState<boolean>(false);
  const [lastExportedProduct, setLastExportedProduct] = useState<Product | null>(null);

  // Sync transcript when language changes (if not actively recording or custom-transcribed)
  useEffect(() => {
    if (!isRecording && !isProcessingAudio) {
      if (
        lastProcessedRef.current.craftId !== activeDraft.id ||
        lastProcessedRef.current.lang !== currentLanguage
      ) {
        lastProcessedRef.current = { craftId: activeDraft.id, lang: currentLanguage };
        setLiveTranscript(getTranscriptForLanguage(activeDraft, currentLanguage));
      }
    }
  }, [currentLanguage, activeDraft, isRecording, isProcessingAudio, getTranscriptForLanguage]);

  // Timer for active recording
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // Audio player auto-stop
  useEffect(() => {
    if (!playingAudioId) return;
    const audioTimer = setTimeout(() => {
      setPlayingAudioId(null);
    }, 6000);
    return () => clearTimeout(audioTimer);
  }, [playingAudioId]);

  /**
   * CENTRAL AUDIO INPUTTING & PROCESSING FUNCTION
   * Takes in an audio source, processes signal, runs speech model,
   * generates accurate transcript, and extracts catalog fields.
   */
  const processAudioInput = useCallback(
    async (
      audio: AudioInputSource,
      options: ProcessAudioOptions = {}
    ): Promise<AudioTranscriptionResult> => {
      setIsProcessingAudio(true);
      try {
        const result = await processAudioInputService(audio, {
          language: currentLanguage,
          craftContext: activeDraft.id,
          onProgress: (status) => setAudioProcessingStatus(status),
          ...options,
        });

        // Update transcript with accurate generated text
        setLiveTranscript(result.transcript);
        setTranscriptionConfidence(result.confidence);
        setAudioMetadata(result.audioMetadata || null);
        if (result.audioUrl) {
          setCurrentAudioUrl(result.audioUrl);
        }

        // Auto-update craft metadata fields to match transcribed content
        if (result.extractedMetadata) {
          setActiveDraft((prev) => ({
            ...prev,
            metadata: {
              ...prev.metadata,
              ...result.extractedMetadata,
            },
          }));
        }

        return result;
      } finally {
        setIsProcessingAudio(false);
      }
    },
    [currentLanguage, activeDraft.id]
  );

  /**
   * Start Live Audio Recording
   * Initializes microphone capture and Web Speech Recognizer for real-time speech
   */
  const startVoiceRecording = useCallback(async () => {
    setRecordingSeconds(0);
    setIsRecording(true);
    setLiveTranscript('...');
    liveSpeechBufferRef.current = '';
    recordedChunksRef.current = [];

    // Web runtime speech recognition & audio recorder
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      try {
        const recognizer = createBrowserSpeechRecognizer({
          language: currentLanguage,
          onResult: (text) => {
            liveSpeechBufferRef.current = text;
            setLiveTranscript(text);
          },
          onError: () => {},
        });
        if (recognizer) {
          speechRecognizerRef.current = recognizer;
          recognizer.start();
        }
      } catch {
        // Fallback gracefully
      }

      // Record audio stream with MediaRecorder if supported
      if (typeof navigator !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          const mediaRecorder = new (window as any).MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = (event: any) => {
            if (event.data && event.data.size > 0) {
              recordedChunksRef.current.push(event.data);
            }
          };
          mediaRecorder.start(250);
        } catch {
          // Microphone permission declined or not available
        }
      }
    }
  }, [currentLanguage]);

  /**
   * Stop Voice Recording and pass audio to processAudioInput()
   */
  const stopVoiceRecording = useCallback(async () => {
    setIsRecording(false);

    // Stop speech recognition
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.stop();
      speechRecognizerRef.current = null;
    }

    // Stop media recorder and assemble audio blob
    let recordedAudioBlob: Blob | null = null;
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach((track: any) => track.stop());
        if (recordedChunksRef.current.length > 0) {
          recordedAudioBlob = new Blob(recordedChunksRef.current, { type: 'audio/webm' });
        }
      } catch {
        // MediaRecorder cleanup
      }
      mediaRecorderRef.current = null;
    }

    // Feed recorded audio into the audio inputting function!
    const audioPayload: AudioInputSource = recordedAudioBlob
      ? recordedAudioBlob
      : {
          sampleId: activeDraft.sampleVoiceNote.id,
          name: `${activeDraft.title}_live_recording.wav`,
          base64: liveSpeechBufferRef.current
            ? `recognized:${liveSpeechBufferRef.current}`
            : undefined,
          durationSeconds: Math.max(3, recordingSeconds),
        };

    await processAudioInput(audioPayload);
  }, [activeDraft, recordingSeconds, processAudioInput]);

  const cancelVoiceRecording = useCallback(() => {
    setIsRecording(false);
    if (speechRecognizerRef.current) {
      speechRecognizerRef.current.abort();
      speechRecognizerRef.current = null;
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      try {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream?.getTracks().forEach((track: any) => track.stop());
      } catch {
        // ignore
      }
      mediaRecorderRef.current = null;
    }
    setRecordingSeconds(0);
    setLiveTranscript(getTranscriptForLanguage(activeDraft, currentLanguage));
  }, [activeDraft, currentLanguage, getTranscriptForLanguage]);

  /**
   * Directly upload an audio file and process it
   */
  const uploadAudioFile = useCallback(
    async (fileOrBlob: File | Blob) => {
      await processAudioInput(fileOrBlob);
    },
    [processAudioInput]
  );

  const setLiveTranscriptDirect = useCallback((text: string) => {
    setLiveTranscript(text);
  }, []);

  const toggleAudioPlayback = useCallback(
    (audioIdOrUrl?: string) => {
      const targetId = audioIdOrUrl || currentAudioUrl || activeDraft.sampleVoiceNote.id;
      if (playingAudioId === targetId) {
        setPlayingAudioId(null);
      } else {
        setPlayingAudioId(targetId);
      }
    },
    [playingAudioId, currentAudioUrl, activeDraft.sampleVoiceNote.id]
  );

  const nextStep = useCallback(() => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  const selectSampleCraft = useCallback((craft: SampleCraft) => {
    setActiveDraft(craft);
    setUserPrice(craft.pricing.suggestedPrice);
    setPreviewMode('enhanced');
    setCurrentAudioUrl(null);
  }, []);

  const adjustPrice = useCallback((delta: number) => {
    setUserPrice((prev) => Math.max(100, prev + delta));
  }, []);

  const setUserPriceDirect = useCallback((price: number) => {
    setUserPrice(Math.max(100, price));
  }, []);

  const toggleChannel = useCallback((channelId: MarketplaceChannelId) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channelId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  }, []);

  const exportActiveProduct = useCallback(() => {
    setIsExporting(true);

    setTimeout(() => {
      const randomCatalogNum = Math.floor(1000 + Math.random() * 9000);
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        catalogId: `KLK-2026-${randomCatalogNum}`,
        title:
          currentLanguage === 'hi'
            ? activeDraft.metadata.productNameHi
            : currentLanguage === 'pa'
            ? activeDraft.metadata.productNamePa
            : activeDraft.metadata.productNameEn,
        category: activeDraft.craftType,
        status: 'exported',
        createdAt: 'Just now',
        image: {
          originalUri: activeDraft.originalImage,
          enhancedUri: activeDraft.enhancedImage,
        },
        voiceNote: {
          ...activeDraft.sampleVoiceNote,
          transcriptEn: liveTranscript,
        },
        metadata: activeDraft.metadata,
        pricing: {
          ...activeDraft.pricing,
          userPrice: userPrice,
          takeHomeProfit: Math.max(
            0,
            userPrice - activeDraft.pricing.materialCost - activeDraft.pricing.platformBuffer
          ),
        },
        exportedChannels: [...selectedChannels],
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=https://kalakar.art/catalog/KLK-2026-${randomCatalogNum}`,
      };

      setProducts((prev) => [newProduct, ...prev]);
      setLastExportedProduct(newProduct);
      setIsExporting(false);
      setExportSuccessModalVisible(true);
    }, 1500);
  }, [activeDraft, currentLanguage, liveTranscript, selectedChannels, userPrice]);

  const closeExportModal = useCallback(() => {
    setExportSuccessModalVisible(false);
  }, []);

  const startNewCataloging = useCallback(() => {
    setExportSuccessModalVisible(false);
    setCurrentStep(1);
    setActiveTab('studio');
    const currentIndex = SAMPLE_CRAFTS.findIndex((c) => c.id === activeDraft.id);
    const nextCraft = SAMPLE_CRAFTS[(currentIndex + 1) % SAMPLE_CRAFTS.length];
    selectSampleCraft(nextCraft);
  }, [activeDraft.id, selectSampleCraft]);

  const resumeDraft = useCallback(
    (product: Product) => {
      const matchingSample =
        SAMPLE_CRAFTS.find((c) => c.title === product.title) || SAMPLE_CRAFTS[0];
      setActiveDraft(matchingSample);
      setUserPrice(product.pricing.userPrice);
      setCurrentStep(3);
      setActiveTab('studio');
    },
    []
  );

  return (
    <ProductContext.Provider
      value={{
        products,
        activeDraft,
        currentStep,
        activeTab,
        previewMode,
        isRecording,
        recordingSeconds,
        liveTranscript,
        isProcessingAudio,
        audioProcessingStatus,
        audioMetadata,
        transcriptionConfidence,
        currentAudioUrl,
        playingAudioId,
        selectedChannels,
        isExporting,
        exportSuccessModalVisible,
        lastExportedProduct,
        userPrice,
        setActiveTab,
        setCurrentStep,
        nextStep,
        prevStep,
        setPreviewMode,
        selectSampleCraft,
        processAudioInput,
        startVoiceRecording,
        stopVoiceRecording,
        cancelVoiceRecording,
        uploadAudioFile,
        setLiveTranscriptDirect,
        toggleAudioPlayback,
        adjustPrice,
        setUserPriceDirect,
        toggleChannel,
        exportActiveProduct,
        closeExportModal,
        startNewCataloging,
        resumeDraft,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = (): ProductContextType => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
};
