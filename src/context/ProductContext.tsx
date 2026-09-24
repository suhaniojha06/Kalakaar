import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, SampleCraft, MarketplaceChannelId, PriceBreakdown } from '../types/product';
import { AppTab, WizardStep } from '../types/navigation';
import { INITIAL_PRODUCTS } from '../data/mockProducts';
import { SAMPLE_CRAFTS } from '../data/sampleCrafts';
import { useLanguage } from './LanguageContext';

interface ProductContextType {
  products: Product[];
  activeDraft: SampleCraft;
  currentStep: WizardStep;
  activeTab: AppTab;
  previewMode: 'enhanced' | 'original';
  isRecording: boolean;
  recordingSeconds: number;
  liveTranscript: string;
  playingAudioId: string | null;
  selectedChannels: MarketplaceChannelId[];
  isExporting: boolean;
  exportSuccessModalVisible: boolean;
  lastExportedProduct: Product | null;
  userPrice: number;

  // Actions
  setActiveTab: (tab: AppTab) => void;
  setCurrentStep: (step: WizardStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setPreviewMode: (mode: 'enhanced' | 'original') => void;
  selectSampleCraft: (craft: SampleCraft) => void;
  startVoiceRecording: () => void;
  stopVoiceRecording: () => void;
  toggleAudioPlayback: (audioId: string) => void;
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

  // Voice recording simulation states
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Audio playback state
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);

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

  const getTranscriptForLanguage = (craft: SampleCraft, lang: string): string => {
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
  };

  // Sync default transcript when language or active draft changes
  useEffect(() => {
    if (!isRecording) {
      setLiveTranscript(getTranscriptForLanguage(activeDraft, currentLanguage));
    }
  }, [currentLanguage, activeDraft, isRecording]);

  // Timer for recording
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (isRecording) {
      timer = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRecording]);

  // Audio player auto-stop simulation after 6 seconds
  useEffect(() => {
    let audioTimer: ReturnType<typeof setTimeout> | undefined;
    if (playingAudioId) {
      audioTimer = setTimeout(() => {
        setPlayingAudioId(null);
      }, 6000);
    }
    return () => {
      if (audioTimer) clearTimeout(audioTimer);
    };
  }, [playingAudioId]);

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  };

  const selectSampleCraft = (craft: SampleCraft) => {
    setActiveDraft(craft);
    setUserPrice(craft.pricing.suggestedPrice);
    setPreviewMode('enhanced');
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    setLiveTranscript('...');
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    setLiveTranscript(getTranscriptForLanguage(activeDraft, currentLanguage));
  };

  const toggleAudioPlayback = (audioId: string) => {
    if (playingAudioId === audioId) {
      setPlayingAudioId(null);
    } else {
      setPlayingAudioId(audioId);
    }
  };

  const adjustPrice = (delta: number) => {
    setUserPrice((prev) => Math.max(100, prev + delta));
  };

  const setUserPriceDirect = (price: number) => {
    setUserPrice(Math.max(100, price));
  };

  const toggleChannel = (channelId: MarketplaceChannelId) => {
    setSelectedChannels((prev) => {
      if (prev.includes(channelId)) {
        // Keep at least 1 selected
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== channelId);
      } else {
        return [...prev, channelId];
      }
    });
  };

  const exportActiveProduct = () => {
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
        voiceNote: activeDraft.sampleVoiceNote,
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
  };

  const closeExportModal = () => {
    setExportSuccessModalVisible(false);
  };

  const startNewCataloging = () => {
    setExportSuccessModalVisible(false);
    setCurrentStep(1);
    setActiveTab('studio');
    // Select next sample craft to show diversity
    const currentIndex = SAMPLE_CRAFTS.findIndex((c) => c.id === activeDraft.id);
    const nextCraft = SAMPLE_CRAFTS[(currentIndex + 1) % SAMPLE_CRAFTS.length];
    selectSampleCraft(nextCraft);
  };

  const resumeDraft = (product: Product) => {
    const matchingSample = SAMPLE_CRAFTS.find((c) => c.title === product.title) || SAMPLE_CRAFTS[0];
    setActiveDraft(matchingSample);
    setUserPrice(product.pricing.userPrice);
    setCurrentStep(3); // open at smart pricing
    setActiveTab('studio');
  };

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
        startVoiceRecording,
        stopVoiceRecording,
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
