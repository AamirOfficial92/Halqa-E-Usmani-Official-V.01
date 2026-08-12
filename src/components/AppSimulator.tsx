/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import appLogo from '../assets/images/app-logo.jpg';
import { 
  motion, 
  AnimatePresence 
} from 'motion/react';
import { 
  BookOpen, 
  FileText, 
  Milestone, 
  UserCheck, 
  HeartHandshake, 
  Home, 
  Users, 
  Award, 
  Sparkles, 
  Bookmark, 
  Notebook, 
  Flame, 
  Sun, 
  Music, 
  CalendarDays, 
  BellRing, 
  HelpCircle, 
  FolderHeart, 
  Search, 
  Download, 
  Share2, 
  Copy, 
  ArrowLeft, 
  Settings, 
  User, 
  Folder, 
  Play, 
  Edit3,
  Pause, 
  ChevronRight, 
  ChevronLeft, 
  Laptop,
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  ExternalLink, 
  Bell, 
  Moon, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Check, 
  Volume2, 
  Video, 
  BookOpenCheck,
  Smartphone,
  Send,
  Globe,
  Info,
  Compass,
  Calculator,
  FileCheck,
  Lock,
  Shield,
  X,
  Maximize2,
  Minimize2,
  Shuffle,
  Wifi,
  WifiOff,
  Loader2,
  CheckCircle2,
  CloudDownload,
  AlertCircle
} from 'lucide-react';
import { IslamicUtilities } from './IslamicUtilities';
import { PostSplashScreenItem, Post, Category, PDFBook, VideoItem, AudioItem, GalleryAlbum, GalleryImage, FeedbackItem, AppNotification, SliderItem, ContactInfo, SocialLinks, UserSettings, DonationInitiative, DonationRecord, InfoPage, Branch, DayDatasetRecord, AppUser, SpiritualSlip, ModSettings, MakhzanCategory, MakhzanPost, SpiritualPersonality, HadeesItem, DownloadProgressItem } from '../types';
import { ayatOfTheDay, hadithOfTheDay, quoteOfTheDay, upcomingPrograms, latestAnnouncement, featuredPersonality, dailyHadeesCollection } from '../data';
import { PrayerWidget } from './PrayerWidget';
import { AdhanAlarmModal } from './AdhanAlarmModal';
import { SalawatScreen } from './SalawatScreen';
import { AbjadTashkheesCalculator } from './AbjadTashkheesCalculator';
import { UserSlipsHistory } from './UserSlipsHistory';
import { UserAuthScreen } from './UserAuthScreen';
import { MakhzanEKhas } from './MakhzanEKhas';
import { VoicePlayer } from './VoicePlayer';
import { PdfViewerModal } from './PdfViewerModal';
import { voiceReaderEngine, detectLanguage } from '../lib/voiceReaderEngine';
import { onFCMMessage } from '../lib/firebaseService';

interface AppSimulatorProps {
  postSplashScreens?: PostSplashScreenItem[];
  posts: Post[];
  categories: Category[];
  pdfs: PDFBook[];
  videos: VideoItem[];
  audios: AudioItem[];
  albums: GalleryAlbum[];
  galleryImages: GalleryImage[];
  feedback: FeedbackItem[];
  notifications: AppNotification[];
  sliderItems: SliderItem[];
  contactInfo: ContactInfo;
  socialLinks: SocialLinks;
  infoPages?: InfoPage[];

  // Makhzan-e-Khas Props
  makhzanCategories?: MakhzanCategory[];
  makhzanPosts?: MakhzanPost[];

  // Spiritual Personalities Props
  spiritualPersonalities?: SpiritualPersonality[];

  // KhanQah Props
  branches?: Branch[];
  dayDatasets?: DayDatasetRecord[];
  appUsers?: AppUser[];
  slips?: SpiritualSlip[];
  modSettings?: ModSettings;
  activeAppUser?: AppUser | null;
  onSelectActiveUser?: (user: AppUser | null) => void;
  onSelfRegisterUser?: (userData: any) => AppUser;
  onCreateSlip?: (slipData: any) => SpiritualSlip;
  bookmarks: {
    posts: string[];
    videos: string[];
    pdfs: string[];
    audios: string[];
  };
  downloads: {
    pdfs: string[];
    audios: string[];
  };
  currentUser: {
    name: string;
    email: string;
    mobile: string;
    city: string;
  };
  onUpdateBookmarks: (type: 'posts' | 'videos' | 'pdfs' | 'audios', id: string) => void;
  onUpdateDownloads: (type: 'pdfs' | 'audios', id: string) => void;
  onSubmitFeedback: (name: string, email: string, mobile: string, subject: string, message: string) => void;
  onUpdateProfile: (profile: { name: string; email: string; mobile: string; city: string }) => void;
  notificationsEnabled: boolean;
  onToggleNotificationSettings: () => void;
  userSettings: UserSettings;
  onUpdateUserSettings: (settings: Partial<UserSettings>) => void;
  donationInitiatives: DonationInitiative[];
  donationRecords: DonationRecord[];
  onSubmitDonation: (
    donorName: string,
    donorEmail: string,
    donorMobile: string,
    amount: number,
    currency: 'PKR' | 'USD',
    paymentMethod: 'bank_transfer' | 'easy_paisa' | 'jazz_cash' | 'credit_card',
    referenceNumber: string,
    initiativeId: string,
    notes?: string
  ) => void;
  viewMode?: 'both' | 'simulator' | 'admin';
  onSwitchViewMode?: (mode: 'both' | 'simulator' | 'admin') => void;
}

// Icon mapper helper
export const IconMapper: React.FC<{ name: string; className?: string; size?: number }> = ({ name, className = '', size = 20 }) => {
  const icons: { [key: string]: any } = {
    BookOpen, FileText, Milestone, UserCheck, HeartHandshake, Home, Users, 
    Award, Sparkles, Bookmark, Notebook, Flame, Sun, Music, CalendarDays, 
    BellRing, HelpCircle, FolderHeart, Search, Download, Share2, Copy, 
    ArrowLeft, Settings, User, Folder, Play, Pause, Bell, Moon, Trash2, Globe, Info
  };
  const IconComponent = icons[name] || HelpCircle;
  return <IconComponent className={className} size={size} />;
};

export const AppSimulator: React.FC<AppSimulatorProps> = ({
  postSplashScreens = [],
  posts,
  categories,
  pdfs,
  videos,
  audios,
  albums,
  galleryImages,
  feedback,
  notifications,
  sliderItems,
  contactInfo,
  socialLinks,
  infoPages = [],
  makhzanCategories = [],
  makhzanPosts = [],
  spiritualPersonalities = [],
  branches = [],
  dayDatasets = [],
  appUsers = [],
  slips = [],
  modSettings = { enableModFormula: false, modDivisor: 7, remainderMode: 'rem' },
  activeAppUser = null,
  onSelectActiveUser,
  onSelfRegisterUser,
  onCreateSlip,
  bookmarks,
  downloads,
  currentUser,
  onUpdateBookmarks,
  onUpdateDownloads,
  onSubmitFeedback,
  onUpdateProfile,
  userSettings,
  onUpdateUserSettings,
  donationInitiatives,
  donationRecords,
  onSubmitDonation,
  viewMode,
  onSwitchViewMode
}) => {
  // Filter out hidden items for live user app simulator
  const activePosts = posts.filter(p => !p.isDraft && p.status !== 'hidden');
  const activeCategories = categories.filter(c => c.status !== 'hidden');
  const activePdfs = pdfs.filter(p => p.status !== 'hidden');
  const activeVideos = videos.filter(v => v.status !== 'hidden');
  const activeAudios = audios.filter(a => a.status !== 'hidden');
  const activeGalleryImages = galleryImages.filter(g => g.status !== 'hidden');
  const activeNotifications = notifications.filter(n => n.status !== 'hidden');
  const activeSliderItems = sliderItems.filter(s => s.status !== 'hidden');
  const activeDonationInitiatives = donationInitiatives.filter(d => d.active && d.status !== 'hidden');
  const activeInfoPages = infoPages.filter(p => p.status === 'published');
  const activeSpiritualPersonalities = spiritualPersonalities.filter(p => p.status !== 'hidden');

  // Navigation & Page state
  const [activeScreen, setActiveScreen] = useState<'splash' | 'salawat' | 'home' | 'categories' | 'media' | 'pdfs' | 'more' | 'post-detail' | 'pdf-reader' | 'category-posts' | 'profile' | 'feedback' | 'contact' | 'bookmarks' | 'downloads' | 'settings' | 'donations' | 'donate-form' | 'info-center' | 'info-page-detail' | 'islamic-utilities' | 'abjad-calc' | 'my-slips' | 'user-account' | 'makhzan' | 'spiritual-personalities' | 'personality-detail'>('splash');
  
  // Detail views selection
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<PDFBook | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedInfoPage, setSelectedInfoPage] = useState<InfoPage | null>(null);
  const [selectedPersonality, setSelectedPersonality] = useState<SpiritualPersonality | null>(null);
  const [activePersonalityImageIndex, setActivePersonalityImageIndex] = useState<number>(0);
  
  // Interactive UI states inside simulator
  const [sliderIndex, setSliderIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ name: currentUser.name, email: currentUser.email, mobile: currentUser.mobile, subject: '', message: '' });
  
  // Donation states
  const [selectedInitiative, setSelectedInitiative] = useState<DonationInitiative | null>(null);
  const [donationForm, setDonationForm] = useState({
    amount: 5000,
    currency: 'PKR' as 'PKR' | 'USD',
    paymentMethod: 'easy_paisa' as 'bank_transfer' | 'easy_paisa' | 'jazz_cash' | 'credit_card',
    referenceNumber: '',
    notes: ''
  });
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [donationsTab, setDonationsTab] = useState<'campaigns' | 'receipts'>('campaigns');
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<DonationRecord | null>(null);
  const [pdfZoom, setPdfZoom] = useState(100);
  const [pdfCurrentPage, setPdfCurrentPage] = useState(1);
  const pdfContainerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      const doc = document as any;
      setIsFullscreen(!!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!pdfContainerRef.current) return;
    const elem = pdfContainerRef.current as any;
    const doc = document as any;

    if (!doc.fullscreenElement && !doc.webkitFullscreenElement && !doc.mozFullScreenElement && !doc.msFullscreenElement) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen().catch((err: any) => console.error(err));
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen();
      }
    } else {
      if (doc.exitFullscreen) {
        doc.exitFullscreen().catch((err: any) => console.error(err));
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Daily Hadees & Reminders State
  const [hadeesIndex, setHadeesIndex] = useState<number>(() => {
    const today = new Date();
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    return dayOfYear % (dailyHadeesCollection.length || 1);
  });
  const [isSpeakingHadees, setIsSpeakingHadees] = useState<boolean>(false);

  const activeHadees: HadeesItem = dailyHadeesCollection[hadeesIndex % (dailyHadeesCollection.length || 1)] || dailyHadeesCollection[0];

  const handleFetchRandomHadees = () => {
    if (dailyHadeesCollection.length <= 1) return;
    let nextIdx = Math.floor(Math.random() * dailyHadeesCollection.length);
    if (nextIdx === (hadeesIndex % dailyHadeesCollection.length)) {
      nextIdx = (nextIdx + 1) % dailyHadeesCollection.length;
    }
    setHadeesIndex(nextIdx);
  };

  const handleSpeakHadees = (textToSpeak: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isSpeakingHadees) {
      window.speechSynthesis.cancel();
      setIsSpeakingHadees(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = userSettings.language === 'ur' ? 'ur-PK' : 'en-US';
    utterance.onend = () => setIsSpeakingHadees(false);
    utterance.onerror = () => setIsSpeakingHadees(false);
    setIsSpeakingHadees(true);
    window.speechSynthesis.speak(utterance);
  };
  const [notificationToast, setNotificationToast] = useState<AppNotification | null>(null);
  const [fcmToast, setFcmToast] = useState<{
    title: string;
    titleUrdu?: string;
    body: string;
    bodyUrdu?: string;
    type: string;
    targetId?: string;
    timestamp?: string;
  } | null>(null);

  // ---------------- Network Online/Offline Detector ----------------
  const [isOnline, setIsOnline] = useState<boolean>(() => 
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // ---------------- Download Progress State Engine ----------------
  const [downloadProgressMap, setDownloadProgressMap] = useState<Record<string, DownloadProgressItem>>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem('halqa_download_progress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      return {};
    }
  });

  // Save to localStorage whenever downloadProgressMap updates
  useEffect(() => {
    try {
      localStorage.setItem('halqa_download_progress', JSON.stringify(downloadProgressMap));
    } catch (e) {
      console.error('Error saving download progress:', e);
    }
  }, [downloadProgressMap]);

  // Sync prop downloads with downloadProgressMap
  useEffect(() => {
    setDownloadProgressMap((prev) => {
      let updated = false;
      const nextMap = { ...prev };

      pdfs.forEach((book) => {
        if (downloads.pdfs.includes(book.id) && (!nextMap[book.id] || nextMap[book.id].status !== 'completed')) {
          nextMap[book.id] = {
            id: book.id,
            type: 'pdfs',
            title: book.title,
            titleUrdu: book.titleUrdu,
            size: book.size || '4.5 MB',
            progress: 100,
            status: 'completed',
            downloadedBytes: book.size || '4.5 MB',
            totalBytes: book.size || '4.5 MB',
            speed: 'Offline Ready',
            updatedAt: Date.now()
          };
          updated = true;
        }
      });

      audios.forEach((audio) => {
        if (downloads.audios.includes(audio.id) && (!nextMap[audio.id] || nextMap[audio.id].status !== 'completed')) {
          nextMap[audio.id] = {
            id: audio.id,
            type: 'audios',
            title: audio.title,
            titleUrdu: audio.titleUrdu,
            size: audio.size || '8.0 MB',
            progress: 100,
            status: 'completed',
            downloadedBytes: audio.size || '8.0 MB',
            totalBytes: audio.size || '8.0 MB',
            speed: 'Offline Ready',
            updatedAt: Date.now()
          };
          updated = true;
        }
      });

      return updated ? nextMap : prev;
    });
  }, [downloads, pdfs, audios]);

  const downloadTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const startOrToggleDownload = (
    id: string,
    type: 'pdfs' | 'audios',
    title: string,
    titleUrdu?: string,
    sizeStr?: string
  ) => {
    const existing = downloadProgressMap[id];
    const isAlreadyDownloaded = downloads[type].includes(id) || existing?.status === 'completed';

    // If currently downloading, pause or cancel
    if (existing?.status === 'downloading') {
      if (downloadTimersRef.current[id]) {
        clearInterval(downloadTimersRef.current[id]);
        delete downloadTimersRef.current[id];
      }
      setDownloadProgressMap((prev) => ({
        ...prev,
        [id]: { ...prev[id], status: 'paused', speed: 'Paused' }
      }));
      return;
    }

    // If completed or in downloads, remove from downloaded items
    if (isAlreadyDownloaded) {
      if (downloadTimersRef.current[id]) {
        clearInterval(downloadTimersRef.current[id]);
        delete downloadTimersRef.current[id];
      }
      onUpdateDownloads(type, id);
      setDownloadProgressMap((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      return;
    }

    // Start download process
    const totalBytesVal = sizeStr || (type === 'pdfs' ? '4.8 MB' : '7.5 MB');
    const initialItem: DownloadProgressItem = {
      id,
      type,
      title,
      titleUrdu,
      size: totalBytesVal,
      progress: existing?.status === 'paused' ? existing.progress : 5,
      status: 'downloading',
      downloadedBytes: '0.2 MB',
      totalBytes: totalBytesVal,
      speed: isOnline ? '2.1 MB/s' : 'Cached Sync',
      updatedAt: Date.now()
    };

    setDownloadProgressMap((prev) => ({
      ...prev,
      [id]: initialItem
    }));

    if (downloadTimersRef.current[id]) {
      clearInterval(downloadTimersRef.current[id]);
    }

    let currentProg = initialItem.progress;
    const interval = setInterval(() => {
      const step = Math.floor(Math.random() * 14) + 12; // 12% to 25% step
      currentProg += step;

      if (currentProg >= 100) {
        currentProg = 100;
        clearInterval(downloadTimersRef.current[id]);
        delete downloadTimersRef.current[id];

        setDownloadProgressMap((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            progress: 100,
            status: 'completed',
            downloadedBytes: totalBytesVal,
            speed: 'Offline Ready',
            updatedAt: Date.now()
          }
        }));

        if (!downloads[type].includes(id)) {
          onUpdateDownloads(type, id);
        }
      } else {
        const totalMb = parseFloat(totalBytesVal) || 5.0;
        const dlMb = ((currentProg / 100) * totalMb).toFixed(1);
        setDownloadProgressMap((prev) => ({
          ...prev,
          [id]: {
            ...prev[id],
            progress: currentProg,
            downloadedBytes: `${dlMb} MB`,
            speed: `${(Math.random() * 1.6 + 1.2).toFixed(1)} MB/s`,
            updatedAt: Date.now()
          }
        }));
      }
    }, 280);

    downloadTimersRef.current[id] = interval;
  };

  const handleClearAllOfflineCache = () => {
    Object.keys(downloadTimersRef.current).forEach((key) => {
      clearInterval(downloadTimersRef.current[key]);
      delete downloadTimersRef.current[key];
    });
    setDownloadProgressMap({});
    localStorage.removeItem('halqa_download_progress');

    // Remove all items in downloads
    [...downloads.pdfs].forEach((pdfId) => onUpdateDownloads('pdfs', pdfId));
    [...downloads.audios].forEach((audioId) => onUpdateDownloads('audios', audioId));
  };
  
  // Media filters (Videos vs Audios vs Gallery)
  const [mediaTab, setMediaTab] = useState<'videos' | 'audios' | 'gallery'>('videos');
  const [videoCategory, setVideoCategory] = useState<'all' | 'live' | 'bayan' | 'naat' | 'shorts'>('all');
  const [audioCategory, setAudioCategory] = useState<'all' | 'bayan' | 'naat' | 'dhikr'>('all');
  const [galleryAlbum, setGalleryAlbum] = useState<GalleryAlbum | null>(null);
  
  // Global Audio Player state
  const [currentAudio, setCurrentAudio] = useState<AudioItem | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0); // 0 to 100
  const [audioDurationStr, setAudioDurationStr] = useState('00:00');
  const [audioElapsedStr, setAudioElapsedStr] = useState('00:00');
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Splash Screen progress & automatic redirect
  const [splashProgress, setSplashProgress] = useState(0);

  useEffect(() => {
    if (activeScreen === 'splash') {
      const startTime = Date.now();
      const duration = 2400; // 2.4s total

      // Preload splash image
      const img = new Image();
      img.src = '/splash.jpg';

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const currentPct = Math.min(100, Math.round((elapsed / duration) * 100));
        setSplashProgress(currentPct);

        if (elapsed >= duration) {
          clearInterval(interval);
          setActiveScreen('salawat');
        }
      }, 30);

      return () => clearInterval(interval);
    }
  }, [activeScreen]);

  // Audio Player simulation
  useEffect(() => {
    if (audioPlaying && currentAudio) {
      const totalSeconds = parseDurationToSeconds(currentAudio.duration);
      let currentSeconds = Math.floor((audioProgress / 100) * totalSeconds);
      
      audioIntervalRef.current = setInterval(() => {
        currentSeconds += 1;
        if (currentSeconds >= totalSeconds) {
          setAudioPlaying(false);
          setAudioProgress(100);
          setAudioElapsedStr(currentAudio.duration);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        } else {
          const progress = (currentSeconds / totalSeconds) * 100;
          setAudioProgress(progress);
          setAudioElapsedStr(formatSeconds(currentSeconds));
        }
      }, 1000);
    } else {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    }
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, [audioPlaying, currentAudio]);

  // Trigger simulated notification when new ones arrive
  useEffect(() => {
    if (notifications.length > 0 && userSettings.notificationsEnabled) {
      const latest = notifications[0];
      // Only trigger toast for notifications generated in this session (newer)
      setNotificationToast(latest);
      const timer = setTimeout(() => {
        setNotificationToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notifications, userSettings.notificationsEnabled]);

  // FCM Cloud Messaging Toast listener effect
  useEffect(() => {
    const unsubFCM = onFCMMessage((payload) => {
      if (!userSettings.notificationsEnabled) return;
      const notif = payload.notification || {};
      const data = payload.data || {};

      setFcmToast({
        title: notif.title || payload.title || 'FCM Cloud Notification',
        titleUrdu: notif.titleUrdu || payload.titleUrdu || notif.title || 'پش نوٹیفکیشن',
        body: notif.body || payload.body || '',
        bodyUrdu: notif.bodyUrdu || payload.bodyUrdu || notif.body || '',
        type: data.type || payload.type || 'general',
        targetId: data.targetId || payload.targetId || '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Play subtle notification audio chime
      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(659.25, audioCtx.currentTime + 0.12); // E5
        osc.frequency.exponentialRampToValueAtTime(783.99, audioCtx.currentTime + 0.25); // G5
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.35);
      } catch {}
    });

    return () => {
      unsubFCM();
    };
  }, [userSettings.notificationsEnabled]);

  useEffect(() => {
    if (fcmToast) {
      const timer = setTimeout(() => {
        setFcmToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [fcmToast]);

  const parseDurationToSeconds = (dur: string): number => {
    const parts = dur.split(':').map(Number);
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 300; // default 5 minutes
  };

  const formatSeconds = (sec: number): string => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const mins = Math.floor(sec / 60);
    const secs = Math.floor(sec % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayAudio = (audio: AudioItem) => {
    setCurrentAudio(audio);
    setAudioProgress(0);
    setAudioElapsedStr('00:00');
    setAudioPlaying(true);
  };

  // Translations dictionary
  const t = {
    ur: {
      bismillah: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      appTitle: 'حلقہ عثمانیہ',
      appSubtitle: 'آفیشل اینڈرائیڈ ایپ',
      home: 'ہوم',
      categories: 'اقسام',
      media: 'میڈیا سینٹر',
      pdfs: 'کتب خانہ',
      more: 'مزید',
      todayAyat: 'آج کی آیت مبارکہ',
      todayHadith: 'آج کی حدیثِ پاک',
      todayQuote: 'آج کا قولِ مبارک',
      announcements: 'اہم اعلانات',
      upcomingPrograms: 'آمدہ پروگرامز',
      featuredPersonality: 'سوانحِ اولیاء (نمایاں شخصیت)',
      searchPlaceholder: 'مضامین، کتب، آڈیوز، مزارات تلاش کریں...',
      bookmark: 'محفوظ کریں',
      bookmarked: 'محفوظ شدہ',
      copy: 'کاپی کریں',
      copied: 'کاپی کر لیا!',
      share: 'شیئر',
      download: 'ڈاؤنلوڈ',
      fontSize: 'حروف کا سائز',
      relatedPosts: 'متعلقہ مضامین',
      author: 'مصنف',
      views: 'مشاہدات',
      downloads: 'ڈاؤنلوڈز',
      pages: 'صفحات',
      size: 'سائز',
      readOnline: 'آن لائن پڑھیں',
      lastRead: 'آخری بار پڑھا گیا',
      continueReading: 'پڑھنا جاری رکھیں',
      bayan: 'بیانات',
      naat: 'نعتیں',
      dhikr: 'محفلِ ذکر',
      gallery: 'تصاویر و پوسٹرز',
      videos: 'ویڈیو سینٹر',
      audios: 'آڈیو سینٹر',
      all: 'تمام',
      contactUs: 'رابطہ کریں',
      feedback: 'رائے و تجویز',
      socialMedia: 'سوشل میڈیا لنکس',
      bookmarksCenter: 'بک مارکس سینٹر',
      downloadCenter: 'ڈاؤنلوڈ سینٹر',
      profile: 'پروفائل',
      settings: 'سیٹنگز',
      name: 'نام',
      email: 'ایمیل',
      mobile: 'موبائل نمبر',
      city: 'شہر',
      subject: 'موضوع',
      message: 'آپ کا پیغام',
      submit: 'ارسال کریں',
      successFeedback: 'آپ کا پیغام کامیابی سے موصول ہو گیا ہے!',
      language: 'زبان',
      darkMode: 'ڈارک موڈ',
      lightMode: 'لائٹ موڈ',
      notifications: 'نوٹیفیکیشنز',
      autoDownload: 'آٹو ڈاؤنلوڈ بند کریں',
      clearCache: 'کیشے صاف کریں',
      cacheCleared: 'ایپ کیشے کامیابی سے صاف کر دیا گیا!',
      unlimitedImages: 'گیلری تصاویر',
      lyrics: 'کلام',
      history: 'ڈاؤنلوڈ ہسٹری',
      shrine: 'مزار مبارک',
      scholar: 'مبلغ/عالم'
    },
    en: {
      bismillah: 'In the name of Allah, the Most Gracious, the Most Merciful',
      appTitle: 'Halqa-e-Usmania',
      appSubtitle: 'Official Android App',
      home: 'Home',
      categories: 'Categories',
      media: 'Media Center',
      pdfs: 'PDF Library',
      more: 'More',
      todayAyat: 'Today\'s Holy Ayat',
      todayHadith: 'Today\'s Noble Hadith',
      todayQuote: 'Today\'s Spiritual Quote',
      announcements: 'Announcements',
      upcomingPrograms: 'Upcoming Programs',
      featuredPersonality: 'Featured Sufi Saint Biography',
      searchPlaceholder: 'Search articles, PDFs, audio, scholars...',
      bookmark: 'Bookmark',
      bookmarked: 'Bookmarked',
      copy: 'Copy Link',
      copied: 'Copied!',
      share: 'Share',
      download: 'Download',
      fontSize: 'Text Size',
      relatedPosts: 'Related Articles',
      author: 'Author',
      views: 'Views',
      downloads: 'Downloads',
      pages: 'Pages',
      size: 'Size',
      readOnline: 'Read Online',
      lastRead: 'Last Read',
      continueReading: 'Continue Reading',
      bayan: 'Sermons',
      naat: 'Naats',
      dhikr: 'Dhikr Gathering',
      gallery: 'Gallery & Albums',
      videos: 'Videos',
      audios: 'Audios',
      all: 'All',
      contactUs: 'Contact Us',
      feedback: 'Feedback System',
      socialMedia: 'Social Media',
      bookmarksCenter: 'Saved Bookmarks',
      downloadCenter: 'Download Center',
      profile: 'User Profile',
      settings: 'App Settings',
      name: 'Full Name',
      email: 'Email Address',
      mobile: 'Mobile Number',
      city: 'City',
      subject: 'Subject',
      message: 'Your Message',
      submit: 'Submit Feedback',
      successFeedback: 'Feedback submitted successfully to admin!',
      language: 'Language',
      darkMode: 'Dark Mode',
      lightMode: 'Light Mode',
      notifications: 'Push Notifications',
      autoDownload: 'Auto Download WiFi Only',
      clearCache: 'Clear Cache Files',
      cacheCleared: 'Application cache cleared successfully!',
      unlimitedImages: 'Image Gallery',
      lyrics: 'Recitation',
      history: 'Download History',
      shrine: 'Shrine',
      scholar: 'Scholar'
    }
  };

  const isUr = userSettings.language === 'ur';
  const localT = isUr ? t.ur : t.en;

  // Text size class mappings
  const fontSizeClass = {
    sm: 'text-sm leading-relaxed',
    md: 'text-base leading-relaxed',
    lg: 'text-lg leading-relaxed',
    xl: 'text-xl leading-relaxed'
  }[userSettings.fontSize];

  // Copy text utility
  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Feedback submit inside simulator
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackForm.name || !feedbackForm.message) return;
    onSubmitFeedback(
      feedbackForm.name,
      feedbackForm.email,
      feedbackForm.mobile,
      feedbackForm.subject || 'General Feedback',
      feedbackForm.message
    );
    setFeedbackSuccess(true);
    setTimeout(() => {
      setFeedbackSuccess(false);
      setFeedbackForm({ name: currentUser.name, email: currentUser.email, mobile: currentUser.mobile, subject: '', message: '' });
      setActiveScreen('home');
    }, 2000);
  };

  // Profile save inside simulator
  const [profileForm, setProfileForm] = useState({ ...currentUser });
  useEffect(() => {
    setProfileForm({ ...currentUser });
  }, [currentUser]);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(profileForm);
    alert(isUr ? 'پروفائل کامیابی سے تبدیل ہو گئی!' : 'Profile updated successfully!');
    setActiveScreen('home');
  };

  // Simulated Global search logic
  const getFilteredItems = () => {
    if (!searchTerm) return { posts: [], pdfs: [], videos: [], audios: [] };
    const term = searchTerm.toLowerCase();
    
    const filteredPosts = posts.filter(p => 
      !p.isDraft && p.status !== 'hidden' && (
        p.title.toLowerCase().includes(term) ||
        p.titleUrdu.includes(term) ||
        p.shortDescription.toLowerCase().includes(term) ||
        p.shortDescriptionUrdu.includes(term) ||
        p.city.toLowerCase().includes(term) ||
        p.scholarName?.toLowerCase().includes(term) ||
        p.shrineName?.toLowerCase().includes(term) ||
        p.tags.some(t => t.toLowerCase().includes(term))
      )
    );

    const filteredPdfs = pdfs.filter(b => 
      b.title.toLowerCase().includes(term) ||
      b.titleUrdu.includes(term) ||
      b.author.toLowerCase().includes(term) ||
      b.authorUrdu.includes(term)
    );

    const filteredVideos = videos.filter(v => 
      v.title.toLowerCase().includes(term) ||
      v.titleUrdu.includes(term) ||
      v.speaker.toLowerCase().includes(term)
    );

    const filteredAudios = audios.filter(a => 
      a.title.toLowerCase().includes(term) ||
      a.titleUrdu.includes(term) ||
      a.artist.toLowerCase().includes(term)
    );

    return { posts: filteredPosts, pdfs: filteredPdfs, videos: filteredVideos, audios: filteredAudios };
  };

  const searchResults = getFilteredItems();
  const searchResultsCount = searchResults.posts.length + searchResults.pdfs.length + searchResults.videos.length + searchResults.audios.length;

  return (
    <div className={`w-full h-full min-h-[100dvh] flex flex-col font-sans relative overflow-x-hidden transition-colors duration-300 ${userSettings.theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Official Facebook-Style Native App Header */}
      {activeScreen !== 'splash' && activeScreen !== 'pdf-reader' && (
        <header 
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}
          className="fixed top-0 left-0 right-0 z-30 bg-emerald-950 border-b border-slate-800/80 px-3 sm:px-6 py-2.5 shadow-md flex justify-between items-center select-none shrink-0"
        >
          <div className="max-w-3xl lg:max-w-4xl mx-auto w-full flex items-center justify-between gap-2">
            
            {/* App Brand & Logo */}
            <div 
              onClick={() => setActiveScreen('home')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group shrink-0"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-emerald-800 to-emerald-950 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-500/60 shadow-inner group-hover:scale-105 transition-transform overflow-hidden shrink-0">
                <img src={appLogo} alt="Halqa-e-Usmania Logo" className="w-full h-full object-cover" />
              </div>
              <div className="text-left">
                <h1 className="font-serif font-bold text-xs sm:text-base leading-none text-white tracking-wide">
                  {isUr ? 'حلقۂ عثمانیہ' : 'Halqa-e-Usmania'}
                </h1>
                <p className="text-[9px] text-emerald-400/90 font-mono mt-0.5 hidden sm:block">
                  {localT.appSubtitle}
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Search Input */}
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder={localT.searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-28 sm:w-48 md:w-64 bg-slate-900/80 border border-slate-800 focus:border-amber-500 rounded-full px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none transition-all pr-8"
                />
                <Search size={14} className="absolute right-2.5 text-slate-400 pointer-events-none" />
              </div>

              {/* Notifications Button */}
              <button 
                onClick={() => setActiveScreen('more')}
                className="p-1.5 sm:p-2 rounded-full hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors relative"
                title="Notifications"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                )}
              </button>

              {/* Settings Button */}
              <button 
                onClick={() => setActiveScreen('settings')}
                className="p-1.5 sm:p-2 rounded-full hover:bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
                title={localT.settings}
              >
                <Settings size={18} />
              </button>
            </div>

          </div>
        </header>
      )}

      {/* Firebase Cloud Messaging (FCM) Custom UI Notification Toast Banner */}
      <AnimatePresence>
        {fcmToast && (
          <motion.div 
            initial={{ y: -80, opacity: 0, scale: 0.95 }}
            animate={{ y: 12, opacity: 1, scale: 1 }}
            exit={{ y: -80, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="fixed top-14 left-4 right-4 max-w-md mx-auto bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400 text-white p-3.5 rounded-2xl shadow-2xl z-50 flex flex-col gap-2 backdrop-blur-md"
          >
            <div className="flex items-center justify-between border-b border-emerald-800/60 pb-2">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
                </span>
                <span className="text-[10px] uppercase font-mono font-bold tracking-wider text-amber-300 flex items-center gap-1">
                  <Sparkles size={11} className="text-amber-400 animate-spin" />
                  {isUr ? 'ایف سی ایم پش نوٹیفکیشن' : 'FCM Cloud Notification'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-mono text-slate-400">{fcmToast.timestamp}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setFcmToast(null);
                  }}
                  className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
                  aria-label="Dismiss notification"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div 
              onClick={() => {
                if (fcmToast.type === 'post' || fcmToast.type === 'article') {
                  if (fcmToast.targetId) {
                    const p = posts.find(pt => pt.id === fcmToast.targetId);
                    if (p) setSelectedPost(p);
                  }
                  setActiveScreen('post-detail');
                } else if (fcmToast.type === 'event') {
                  setActiveScreen('islamic-utilities');
                } else {
                  setActiveScreen('home');
                }
                setFcmToast(null);
              }}
              className="flex items-start gap-3 cursor-pointer group"
            >
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-400 p-2 rounded-xl group-hover:scale-110 transition-transform">
                <BellRing size={18} className="animate-pulse" />
              </div>

              <div className="flex-1 text-left" dir={isUr ? 'rtl' : 'ltr'}>
                <h4 className="font-bold text-xs text-amber-300 group-hover:text-amber-200 transition-colors">
                  {isUr ? fcmToast.titleUrdu || fcmToast.title : fcmToast.title}
                </h4>
                <p className="text-[11px] text-slate-200 line-clamp-2 mt-0.5 leading-snug">
                  {isUr ? fcmToast.bodyUrdu || fcmToast.body : fcmToast.body}
                </p>
                <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-emerald-400 group-hover:underline">
                  <span>{isUr ? (fcmToast.type === 'event' ? 'واقعہ اور کیلنڈر دیکھیں ←' : 'پوسٹ دیکھیں ←') : (fcmToast.type === 'event' ? 'View Event Calendar →' : 'Read Article →')}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Standard Notification Toast Banner */}
      <AnimatePresence>
        {!fcmToast && notificationToast && (
          <motion.div 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 10, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            onClick={() => {
              if (notificationToast.type === 'pdf' && notificationToast.targetId) {
                const b = pdfs.find(p => p.id === notificationToast.targetId);
                if (b) { setSelectedPdf(b); setActiveScreen('pdf-reader'); }
              } else if (notificationToast.type === 'article' && notificationToast.targetId) {
                const p = posts.find(pt => pt.id === notificationToast.targetId);
                if (p) { setSelectedPost(p); setActiveScreen('post-detail'); }
              } else {
                setActiveScreen('home');
              }
              setNotificationToast(null);
            }}
            className="fixed top-14 left-4 right-4 max-w-md mx-auto bg-emerald-900 border border-amber-500 text-white p-3 rounded-2xl shadow-2xl z-50 flex items-start gap-3 cursor-pointer hover:bg-emerald-800"
          >
            <div className="bg-amber-500 text-slate-900 p-1.5 rounded-xl">
              <Bell size={16} className="animate-bounce" />
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-xs text-amber-400">{isUr ? notificationToast.titleUrdu : notificationToast.title}</h4>
              <p className="text-[10px] text-slate-200 line-clamp-2 mt-0.5">{isUr ? notificationToast.bodyUrdu : notificationToast.body}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Render Main Android Container */}
      <div 
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 64px)' }}
        className="flex-1 overflow-y-auto overscroll-contain pb-28 px-2 sm:px-4 md:px-6 flex flex-col items-center w-full min-h-0" 
        dir={isUr ? 'rtl' : 'ltr'}
      >
        <div className="w-full max-w-3xl lg:max-w-4xl flex flex-col flex-1">
        <AnimatePresence mode="wait">
          
          {/* ==================== 1. SPLASH SCREEN ==================== */}
          {activeScreen === 'splash' && (
            <motion.div 
              key="splash"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 bg-[#051c14] flex flex-col justify-between items-center overflow-hidden select-none"
            >
              {/* Ambient Blurred Background to eliminate blank borders on ultra-wide screens or tablets */}
              <div 
                className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110 pointer-events-none"
                style={{ backgroundImage: `url('/splash.jpg')` }}
              />

              {/* Main Full-Screen Custom Splash Image with Ken Burns Zoom Effect */}
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                <motion.img 
                  src="/splash.jpg" 
                  alt="Halqa-e-Usmania Splash"
                  initial={{ scale: 1 }}
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 2.8, ease: 'easeOut' }}
                  className="w-full h-full object-contain max-h-[100dvh] object-center relative z-10 drop-shadow-2xl"
                />
              </div>

              {/* Modern Animated Progress Bar at the Bottom */}
              <div className="absolute bottom-6 sm:bottom-10 left-6 right-6 max-w-xs mx-auto z-20 flex flex-col items-center space-y-2">
                <div className="w-full h-1.5 bg-black/60 backdrop-blur-md border border-amber-500/40 rounded-full overflow-hidden p-0.5 shadow-lg">
                  <motion.div 
                    style={{ width: `${splashProgress}%` }}
                    className="h-full bg-gradient-to-r from-amber-500 via-amber-300 to-amber-500 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.8)] transition-all duration-75 ease-out"
                  />
                </div>
                <div className="flex items-center justify-between w-full px-1 text-[10px] font-mono tracking-wider text-amber-300/90 font-medium">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                    <span>LOADING...</span>
                  </span>
                  <span>{splashProgress}%</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 1.5. SALAWAT SCREEN (AFTER SPLASH) ==================== */}
          {activeScreen === 'salawat' && (
            <SalawatScreen
              key="salawat"
              onComplete={() => setActiveScreen('home')}
              screens={postSplashScreens}
            />
          )}

          {/* ==================== 2. HOME DASHBOARD ==================== */}
          {activeScreen === 'home' && (
            <motion.div 
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-5"
            >
              {/* Header inside simulator */}
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-800 text-amber-400 flex items-center justify-center font-bold text-sm border border-amber-500 overflow-hidden shrink-0">
                    <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm leading-tight text-emerald-700 dark:text-emerald-400">
                      {isUr ? 'حلقۂ عثمانیہ' : 'Halqa-e-Usmania'}
                    </h3>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">{localT.appSubtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setActiveScreen('settings')}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300"
                  >
                    <Settings size={18} />
                  </button>
                  <button 
                    onClick={() => setActiveScreen('bookmarks')}
                    className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 relative"
                  >
                    <Bookmark size={18} />
                    {(bookmarks.posts.length + bookmarks.pdfs.length + bookmarks.videos.length + bookmarks.audios.length) > 0 && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-amber-500 rounded-full border border-white"></span>
                    )}
                  </button>
                </div>
              </div>

              {/* Slider / Image Carousel */}
              {(activeSliderItems.length > 0 || sliderItems.length > 0) && (() => {
                const itemsToUse = activeSliderItems.length > 0 ? activeSliderItems : sliderItems;
                const safeIndex = sliderIndex % itemsToUse.length;
                const currentItem = itemsToUse[safeIndex] || itemsToUse[0];
                if (!currentItem) return null;

                return (
                  <div className="relative h-44 rounded-2xl overflow-hidden shadow-md group bg-slate-950 flex items-center justify-center">
                    {/* Quick Admin Edit Button overlay */}
                    {onSwitchViewMode && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSwitchViewMode('admin');
                        }}
                        title="Edit Home Banners in Admin Panel / سلائیڈر میں ترمیم کریں"
                        className="absolute top-2.5 right-2.5 z-20 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-bold rounded-lg flex items-center gap-1 shadow-lg cursor-pointer transition-all border border-amber-300/50"
                      >
                        <Edit3 size={12} />
                        <span>Edit Banner (ترمیم)</span>
                      </button>
                    )}
                    {currentItem.imageUrl && (
                      <img 
                        src={currentItem.imageUrl} 
                        alt="" 
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                      />
                    )}
                    <img 
                      src={currentItem.imageUrl || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'} 
                      alt="" 
                      className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-3.5 text-left" dir="ltr">
                      {currentItem.linkToType && (
                        <span className="text-[9px] bg-amber-500 text-slate-900 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider self-start mb-1">
                          {String(currentItem.linkToType).toUpperCase()}
                        </span>
                      )}
                      <h4 className="text-white font-serif font-semibold text-sm line-clamp-1">
                        {isUr ? (currentItem.titleUrdu || currentItem.title || '') : (currentItem.title || currentItem.titleUrdu || '')}
                      </h4>
                      <button 
                        onClick={() => {
                          if (currentItem.linkToType === 'post') {
                            const p = posts.find(pt => pt.id === currentItem.targetId);
                            if (p) { setSelectedPost(p); setActiveScreen('post-detail'); }
                          } else if (currentItem.linkToType === 'pdf') {
                            const b = pdfs.find(pt => pt.id === currentItem.targetId);
                            if (b) { setSelectedPdf(b); setActiveScreen('pdf-reader'); }
                          }
                        }}
                        className="text-[10px] text-amber-400 font-medium underline mt-1 text-left self-start"
                      >
                        {isUr ? 'تفصیلات دیکھیں ←' : 'Read Detail →'}
                      </button>
                    </div>
                    {/* Dots */}
                    {itemsToUse.length > 1 && (
                      <div className="absolute bottom-2 right-3 flex gap-1 z-10">
                        {itemsToUse.map((_, idx) => (
                          <button 
                            key={idx}
                            onClick={() => setSliderIndex(idx)}
                            className={`w-1.5 h-1.5 rounded-full transition-all ${idx === safeIndex ? 'bg-amber-400 w-3' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Quick Search trigger */}
              <div 
                onClick={() => setActiveScreen('settings')} // Goes to search via setting search
                className="flex items-center gap-2.5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 cursor-pointer text-slate-400 text-xs"
              >
                <Search size={16} className="text-slate-400" />
                <span onClick={(e) => { e.stopPropagation(); setActiveScreen('settings'); }} className="flex-1 text-left">
                  {localT.searchPlaceholder}
                </span>
              </div>

              {/* Information Center Banner (Public General Section) */}
              <div 
                onClick={() => setActiveScreen('info-center')}
                className="bg-gradient-to-r from-emerald-900 to-slate-900 border border-emerald-700/60 rounded-2xl p-3.5 text-right text-white shadow-md cursor-pointer hover:border-amber-400/80 transition-all group relative overflow-hidden" 
                dir="rtl"
              >
                <div className="flex justify-between items-center relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 border border-amber-500/40 flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform">
                      <Globe size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-serif font-bold text-xs text-white">
                          {isUr ? 'معلومات سینٹر' : 'Information Center'}
                        </h3>
                        <span className="text-[8px] bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded-full font-bold">
                          CMS
                        </span>
                      </div>
                      <p className="text-[9.5px] text-emerald-200/90 mt-0.5">
                        {isUr ? 'تنظیم، خدمات، قواعد، منشور اور معلوماتی صفحات' : 'Official guide, services, policies, and trust info'}
                      </p>
                    </div>
                  </div>

                  <ChevronLeft size={18} className="text-amber-400 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>

              {/* Prayer Timings Widget */}
              <PrayerWidget 
                isUr={isUr} 
                currentUserCity={currentUser.city} 
                contactNumber={contactInfo.mobile}
                hadith={activeHadees}
              />

              {/* Daily Wisdom Card (Ayat / Hadith / Quote) Tabs */}
              <div className="bg-emerald-950/50 dark:bg-emerald-950/80 border border-emerald-800/60 rounded-2xl p-4 text-center space-y-2 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-amber-500/5 blur-xl"></div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 px-2 py-0.5 border border-amber-500/30 rounded-full inline-block">
                  {localT.todayAyat}
                </span>
                <p className="text-white text-xs font-serif leading-relaxed italic">
                  "{isUr ? ayatOfTheDay.textUrdu : ayatOfTheDay.text}"
                </p>
                <div className="flex justify-between items-center pt-2 border-t border-emerald-800/40 text-[10px] text-emerald-300">
                  <span>{ayatOfTheDay.reference}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopy(isUr ? ayatOfTheDay.textUrdu : ayatOfTheDay.text, 'ayat')}
                      className="hover:text-white p-1"
                    >
                      {copiedId === 'ayat' ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Daily Hadees & Spiritual Reminders Card */}
              <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 text-white border border-emerald-800/80 rounded-2xl p-4 space-y-3 relative overflow-hidden shadow-md">
                <div className="absolute -top-12 -left-12 w-28 h-28 rounded-full bg-amber-500/10 blur-xl pointer-events-none"></div>

                {/* Header with Title & Fetch Random Button */}
                <div className="flex items-center justify-between gap-2 border-b border-emerald-800/50 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      <Sparkles size={16} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-serif font-bold text-xs text-white">
                        {isUr ? 'حدیثِ مبارکہ و روحانی ارشاد' : 'Daily Hadees & Reminder'}
                      </h4>
                      <p className="text-[10px] text-emerald-300">
                        {activeHadees.book} • {isUr ? activeHadees.categoryUrdu || activeHadees.category : activeHadees.category}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleFetchRandomHadees}
                    className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] rounded-xl flex items-center gap-1.5 transition-all shadow-xs shrink-0 active:scale-95"
                    title={isUr ? 'بے ترتیب حدیث یا فرمان حاصل کریں' : 'Fetch random narration'}
                  >
                    <Shuffle size={12} />
                    <span>{isUr ? 'نئی حدیث' : 'Random Hadees'}</span>
                  </button>
                </div>

                {/* Arabic Text & Translation Display */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeHadees.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 text-center"
                  >
                    {activeHadees.arabicText && (
                      <p 
                        className="text-amber-300 text-sm sm:text-base font-bold font-serif leading-relaxed px-2 py-1 bg-black/20 rounded-xl border border-amber-500/10"
                        dir="rtl"
                      >
                        {activeHadees.arabicText}
                      </p>
                    )}

                    {/* Translation */}
                    <p className="text-xs sm:text-sm font-serif leading-relaxed italic text-emerald-100/90 px-1">
                      "{isUr ? activeHadees.textUrdu : activeHadees.text}"
                    </p>

                    {/* Narrator */}
                    {(activeHadees.narrator || activeHadees.narratorUrdu) && (
                      <p className="text-[10.5px] text-amber-200/80 font-medium">
                        — {isUr ? activeHadees.narratorUrdu || activeHadees.narrator : activeHadees.narrator}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Footer Controls: Reference, Audio Speech & Copy */}
                <div className="flex items-center justify-between pt-2 border-t border-emerald-800/40 text-[10px] text-emerald-300">
                  <div className="flex items-center gap-1.5 truncate max-w-[65%]">
                    <BookOpen size={13} className="text-amber-400 shrink-0" />
                    <span className="truncate font-semibold text-amber-200/90">{activeHadees.reference}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Audio TTS Button */}
                    <button
                      onClick={() => handleSpeakHadees(isUr ? activeHadees.textUrdu : activeHadees.text)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isSpeakingHadees
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border-emerald-700/50'
                      }`}
                      title={isUr ? 'حدیث سنیں' : 'Listen narration'}
                    >
                      <Volume2 size={13} className={isSpeakingHadees ? 'animate-bounce' : ''} />
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(
                        `${activeHadees.arabicText ? activeHadees.arabicText + '\n' : ''}${isUr ? activeHadees.textUrdu : activeHadees.text}\n(${activeHadees.reference})`,
                        `hadees-${activeHadees.id}`
                      )}
                      className="p-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/50 rounded-lg transition-colors"
                      title={isUr ? 'متن کاپی کریں' : 'Copy narration'}
                    >
                      {copiedId === `hadees-${activeHadees.id}` ? (
                        <Check size={13} className="text-emerald-400" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>


                  </div>
                </div>
              </div>

              {/* Latest Official Announcement Banner */}
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5 flex gap-3 items-start">
                <div className="p-1.5 bg-amber-500 text-slate-900 rounded-lg shrink-0 mt-0.5">
                  <BellRing size={16} />
                </div>
                <div className="text-left flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-widest">{localT.announcements}</span>
                    <span className="text-[9px] text-slate-400">{latestAnnouncement.date}</span>
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 dark:text-white mt-0.5">{isUr ? latestAnnouncement.titleUrdu : latestAnnouncement.title}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-300 mt-1 leading-normal">{isUr ? latestAnnouncement.descriptionUrdu : latestAnnouncement.description}</p>
                </div>
              </div>

              {/* Upcoming Programs */}
              <div className="space-y-2.5 text-left">
                <h3 className="font-serif font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-1 text-emerald-700 dark:text-emerald-400">
                  {localT.upcomingPrograms}
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {upcomingPrograms.map((prog, idx) => (
                    <div key={idx} className="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-3 border border-slate-200 dark:border-slate-800">
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? prog.titleUrdu : prog.title}</h4>
                      <div className="grid grid-cols-2 gap-1 mt-2 text-[10px] text-slate-500 dark:text-slate-400">
                        <div>📅 {prog.date}</div>
                        <div>⏰ {prog.time}</div>
                        <div className="col-span-2">📍 {isUr ? prog.venueUrdu : prog.venue}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Islamic Posts (CMS items feed) */}
              <div className="space-y-3 text-left">
                <h3 className="font-serif font-bold text-sm border-b border-slate-200 dark:border-slate-800 pb-1 text-emerald-700 dark:text-emerald-400">
                  {isUr ? 'تازہ ترین مضامین' : 'Latest Islamic Articles'}
                </h3>
                <div className="space-y-2.5">
                  {posts.filter(p => !p.isDraft && p.status !== 'hidden').slice(0, 3).map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setActiveScreen('post-detail'); }}
                      className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 flex gap-3 p-2 cursor-pointer hover:border-emerald-500/40"
                    >
                      <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-800/80 shrink-0 overflow-hidden flex items-center justify-center relative">
                        {post.coverImage && (
                          <img src={post.coverImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                        )}
                        <img src={post.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] uppercase font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md">
                            {post.category.toUpperCase()}
                          </span>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-2 mt-1 leading-snug">
                            {isUr ? post.titleUrdu : post.title}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span>👤 {post.scholarName || 'Al-Usmani'}</span>
                          <span>👁️ {post.views}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured Sufi Saint Profile Card */}
              <div className="bg-gradient-to-br from-emerald-950 to-teal-900 border border-amber-500/40 rounded-2xl p-4 text-left overflow-hidden relative text-white">
                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                <div className="flex gap-3 items-center mb-2">
                  <div className="p-1 bg-amber-500 text-slate-950 rounded-xl">
                    <UserCheck size={18} />
                  </div>
                  <div>
                    <span className="text-[9px] text-amber-400 uppercase tracking-widest font-bold">{localT.featuredPersonality}</span>
                    <h4 className="font-serif font-bold text-xs text-white">{isUr ? featuredPersonality.nameUrdu : featuredPersonality.name}</h4>
                  </div>
                </div>
                <p className="text-[10px] text-emerald-200 mt-1 line-clamp-3 leading-relaxed">
                  {isUr ? featuredPersonality.descriptionUrdu : featuredPersonality.description}
                </p>
                <div className="mt-2.5 flex items-center justify-between text-[10px] text-amber-400">
                  <span className="font-bold">🎖️ {featuredPersonality.title}</span>
                  <span className="underline cursor-pointer hover:text-white" onClick={() => {
                    // Simulating going to biography Category
                    setSelectedCategory(categories.find(c => c.id === 'biographies') || null);
                    setActiveScreen('category-posts');
                  }}>
                    {isUr ? 'مزید اولیاء سوانح حیات پڑھیں' : 'Browse Biographies'}
                  </span>
                </div>
              </div>

              {/* Highlight Featured PDF book */}
              <div className="border border-emerald-700/30 rounded-xl p-3 bg-emerald-900/5 text-left flex gap-3 items-center justify-between">
                <div className="flex gap-2.5 items-center">
                  <BookOpenCheck className="text-emerald-600 dark:text-emerald-400" size={24} />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Featured PDF Book / مایہ ناز کتاب</span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? pdfs[0].titleUrdu : pdfs[0].title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => { setSelectedPdf(pdfs[0]); setActiveScreen('pdf-reader'); }}
                  className="bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] py-1 px-3 rounded-lg font-bold"
                >
                  {localT.readOnline}
                </button>
              </div>

              {/* Highlight Featured Video */}
              <div className="border border-red-700/30 rounded-xl p-3 bg-red-900/5 text-left flex gap-3 items-center justify-between">
                <div className="flex gap-2.5 items-center">
                  <Video className="text-red-600 dark:text-red-400" size={24} />
                  <div>
                    <span className="text-[9px] uppercase font-bold text-slate-400">Featured Bayan / خصوصی ویڈیو خطاب</span>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? videos[0].titleUrdu : videos[0].title}</h4>
                  </div>
                </div>
                <button 
                  onClick={() => { setMediaTab('videos'); setActiveScreen('media'); }}
                  className="bg-red-700 hover:bg-red-600 text-white text-[10px] py-1 px-3 rounded-lg font-bold"
                >
                  {isUr ? 'دیکھیں' : 'Watch'}
                </button>
              </div>

            </motion.div>
          )}

          {/* ==================== 3. CATEGORIES SCREEN ==================== */}
          {activeScreen === 'categories' && (
            <motion.div 
              key="categories"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.categories}</h3>
                <span className="text-xs text-slate-400">({categories.length})</span>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 -mt-2">
                {isUr ? 'تمام مستند کتب، بیانات، سوانح حیات اور مضامین زمرہ جات میں دستیاب ہیں' : 'Browse specific Islamic fields and biographies.'}
              </p>

              <div className="grid grid-cols-2 gap-2.5">
                {categories.map((cat) => {
                  const postsCount = posts.filter(p => p.category === cat.id && !p.isDraft && p.status !== 'hidden').length;
                  return (
                    <div 
                      key={cat.id}
                      onClick={() => { setSelectedCategory(cat); setActiveScreen('category-posts'); }}
                      className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex flex-col justify-between h-24"
                    >
                      <div className="flex items-center justify-between">
                        <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950/80 rounded-lg text-emerald-600 dark:text-emerald-400">
                          <IconMapper name={cat.icon || 'Bookmark'} size={18} />
                        </div>
                        <span className="text-[9px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-md">
                          {postsCount}
                        </span>
                      </div>
                      <div className="mt-2 text-left">
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">{isUr ? cat.nameUrdu : cat.name}</h4>
                        <p className="text-[8px] text-slate-400 mt-0.5 line-clamp-1">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ==================== CATEGORY POSTS SCREEN ==================== */}
          {activeScreen === 'category-posts' && selectedCategory && (
            <motion.div 
              key="category-posts"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('categories')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {isUr ? selectedCategory.nameUrdu : selectedCategory.name}
                </h3>
              </div>
              
              <div className="space-y-2.5">
                {posts.filter(p => p.category === selectedCategory.id && !p.isDraft && p.status !== 'hidden').length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400">
                    {isUr ? 'اس کیٹیگری میں فی الحال کوئی مضمون دستیاب نہیں ہے۔' : 'No articles available in this category yet.'}
                  </div>
                ) : (
                  posts.filter(p => p.category === selectedCategory.id && !p.isDraft && p.status !== 'hidden').map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setActiveScreen('post-detail'); }}
                      className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm flex gap-3 p-2.5 cursor-pointer hover:border-emerald-500/40"
                    >
                      <div className="w-20 h-20 rounded-lg bg-slate-900 border border-slate-800/80 shrink-0 overflow-hidden flex items-center justify-center relative">
                        {post.coverImage && (
                          <img src={post.coverImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                        )}
                        <img src={post.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-2 leading-tight">
                            {isUr ? post.titleUrdu : post.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                            {isUr ? post.shortDescriptionUrdu : post.shortDescription}
                          </p>
                        </div>
                        <div className="flex justify-between items-center text-[9px] text-slate-400">
                          <span>👤 {post.scholarName || 'Al-Usmani'}</span>
                          <span>👁️ {post.views}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== 4. MEDIA CENTER (Video + Audio + Gallery) ==================== */}
          {activeScreen === 'media' && (
            <motion.div 
              key="media"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {isUr ? 'میڈیا سینٹر' : 'Media Center'}
                </h3>
              </div>
              {/* Tabs selector */}
              <div className="flex border-b border-slate-200 dark:border-slate-800">
                {(['videos', 'audios', 'gallery'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { setMediaTab(tab); setGalleryAlbum(null); }}
                    className={`flex-1 pb-2 text-xs font-bold text-center capitalize border-b-2 transition-all ${mediaTab === tab ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400' : 'border-transparent text-slate-400'}`}
                  >
                    {localT[tab as 'videos' | 'audios' | 'gallery']}
                  </button>
                ))}
              </div>

              {/* VIDEOS SUBSECTION */}
              {mediaTab === 'videos' && (
                <div className="space-y-4">
                  {/* Sub category filter */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1" dir="ltr">
                    {(['all', 'live', 'bayan', 'naat', 'shorts'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setVideoCategory(cat)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${videoCategory === cat ? 'bg-red-700 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* YouTube Embed Player & Video Grid */}
                  <div className="space-y-3">
                    {videos
                      .filter(v => videoCategory === 'all' || v.category === videoCategory)
                      .map((video) => (
                        <div key={video.id} className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm">
                          {/* Simulated Youtube Embed Frame */}
                          <div className="relative aspect-video bg-black flex items-center justify-center">
                            <iframe
                              className="w-full h-full"
                              src={video.youtubeId ? `https://www.youtube.com/embed/${video.youtubeId}` : undefined}
                              title={video.title}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            ></iframe>
                          </div>
                          <div className="p-3">
                            <div className="flex justify-between items-center text-[8px] text-slate-400">
                              <span className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded uppercase font-bold">{video.category}</span>
                              <span>⏱️ {video.duration}</span>
                            </div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-1.5 leading-snug">
                              {isUr ? video.titleUrdu : video.title}
                            </h4>
                            <div className="flex justify-between items-center text-[9px] text-slate-400 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                              <span>👤 {video.speaker}</span>
                              <button 
                                onClick={() => onUpdateBookmarks('videos', video.id)}
                                className="text-slate-400 hover:text-emerald-500"
                              >
                                <Bookmark size={14} className={bookmarks.videos.includes(video.id) ? "fill-emerald-500 text-emerald-500" : ""} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* AUDIOS SUBSECTION */}
              {mediaTab === 'audios' && (
                <div className="space-y-4">
                  {/* Category Filter */}
                  <div className="flex gap-1.5 overflow-x-auto pb-1" dir="ltr">
                    {(['all', 'bayan', 'naat', 'dhikr'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setAudioCategory(cat)}
                        className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase shrink-0 ${audioCategory === cat ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'}`}
                      >
                        {cat === 'all' ? localT.all : localT[cat as 'bayan' | 'naat' | 'dhikr']}
                      </button>
                    ))}
                  </div>

                  {/* Audio list */}
                  <div className="space-y-2">
                    {audios
                      .filter(a => audioCategory === 'all' || a.category === audioCategory)
                      .map((audio) => {
                        const isPlayingThis = currentAudio?.id === audio.id;
                        const dlInfo = downloadProgressMap[audio.id];
                        const isDownloaded = downloads.audios.includes(audio.id) || dlInfo?.status === 'completed';
                        const isDownloading = dlInfo?.status === 'downloading';

                        return (
                          <div 
                            key={audio.id}
                            className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${isPlayingThis ? 'bg-emerald-950/20 border-emerald-600' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex gap-3 items-center flex-1 min-w-0">
                                <button 
                                  onClick={() => {
                                    if (isPlayingThis) {
                                      setAudioPlaying(!audioPlaying);
                                    } else {
                                      handlePlayAudio(audio);
                                    }
                                  }}
                                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isPlayingThis && audioPlaying ? 'bg-amber-500 text-slate-900 animate-pulse' : 'bg-emerald-800 text-white'}`}
                                >
                                  {isPlayingThis && audioPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                                </button>
                                <div className="text-left flex-1 min-w-0">
                                  <div className="flex items-center gap-1.5">
                                    <h4 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">{isUr ? audio.titleUrdu : audio.title}</h4>
                                    {isDownloaded && (
                                      <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.2 rounded flex items-center gap-0.5 shrink-0">
                                        <CheckCircle2 size={9} />
                                        <span>Offline</span>
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">👤 {isUr ? audio.artistUrdu : audio.artist}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[9px] text-slate-400 font-mono">{audio.duration}</span>
                                <button 
                                  onClick={() => startOrToggleDownload(audio.id, 'audios', audio.title, audio.titleUrdu, audio.size)}
                                  className={`p-1.5 rounded transition-colors ${
                                    isDownloading 
                                      ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-[8px] flex items-center gap-1'
                                      : isDownloaded 
                                        ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40' 
                                        : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                  }`}
                                  title={isDownloading ? 'Downloading...' : isDownloaded ? 'Remove Offline Audio' : 'Download Audio'}
                                >
                                  {isDownloading ? (
                                    <>
                                      <Loader2 size={12} className="animate-spin text-amber-500" />
                                      <span>{dlInfo?.progress}%</span>
                                    </>
                                  ) : isDownloaded ? (
                                    <CheckCircle2 size={15} className="text-emerald-500" />
                                  ) : (
                                    <Download size={14} />
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* Live Download Progress Indicator */}
                            {isDownloading && dlInfo && (
                              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-left space-y-1">
                                <div className="flex items-center justify-between text-[8px] font-bold text-emerald-700 dark:text-emerald-300">
                                  <span className="flex items-center gap-1">
                                    <Loader2 size={10} className="animate-spin text-emerald-500" />
                                    <span>{isUr ? 'آڈیو ڈاؤن لوڈ ہو رہی ہے...' : 'Downloading Audio File...'}</span>
                                  </span>
                                  <span className="font-mono">{dlInfo.downloadedBytes} / {dlInfo.totalBytes} ({dlInfo.progress}%)</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div 
                                    className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                                    style={{ width: `${dlInfo.progress}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between items-center text-[7px] text-slate-400 font-mono">
                                  <span>Speed: {dlInfo.speed}</span>
                                  <span>{isOnline ? '🌐 Online' : '📡 Local Sync'}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                </div>
              )}

              {/* GALLERY SUBSECTION */}
              {mediaTab === 'gallery' && (
                <div className="space-y-4">
                  {!galleryAlbum ? (
                    /* Display Albums list */
                    <div className="grid grid-cols-2 gap-3">
                      {albums.map((alb) => {
                        const albumImgs = galleryImages.filter(i => i.albumId === alb.id);
                        return (
                          <div 
                            key={alb.id}
                            onClick={() => setGalleryAlbum(alb)}
                            className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40"
                          >
                            <div className="w-full h-24 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                              {alb.coverImage && (
                                <img src={alb.coverImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                              )}
                              <img src={alb.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                            </div>
                            <div className="p-2.5 text-left">
                              <span className="text-[7px] uppercase font-bold tracking-widest text-emerald-600 dark:text-emerald-400">{alb.type}</span>
                              <h4 className="font-bold text-xs text-slate-800 dark:text-white mt-0.5 line-clamp-1">{isUr ? alb.nameUrdu : alb.name}</h4>
                              <p className="text-[8px] text-slate-400 mt-0.5">{albumImgs.length} {localT.unlimitedImages}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    /* Display Selected Album details */
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setGalleryAlbum(null)}
                          className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                        >
                          <ArrowLeft size={14} />
                        </button>
                        <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">
                          {isUr ? galleryAlbum.nameUrdu : galleryAlbum.name}
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {galleryImages
                          .filter(img => img.albumId === galleryAlbum.id)
                          .map((img) => (
                            <div key={img.id} className="relative group rounded-lg overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-950 flex items-center justify-center h-28">
                              {img.imageUrl && (
                                <img src={img.imageUrl} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                              )}
                              <img src={img.imageUrl || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col justify-end p-2 text-left">
                                <h5 className="text-white font-bold text-[9px] line-clamp-1">{isUr ? img.titleUrdu : img.title}</h5>
                                <p className="text-[8px] text-slate-300 line-clamp-2 leading-tight mt-0.5">{img.description}</p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </motion.div>
          )}

          {/* ==================== 5. PDF LIBRARY SCREEN ==================== */}
          {activeScreen === 'pdfs' && (
            <motion.div 
              key="pdfs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveScreen('home')}
                    className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.pdfs}</h3>
                </div>
                <span className="text-[10px] text-slate-400">({pdfs.length} Books / تصانیف)</span>
              </div>

              {/* Continue Reading Box (Saves State of Last Opened Book) */}
              {selectedPdf && (
                <div className="bg-emerald-900/10 border border-emerald-600/30 rounded-2xl p-3 text-left">
                  <span className="text-[8px] uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400">
                    📖 {localT.continueReading}
                  </span>
                  <div className="flex gap-3 mt-1.5 items-center justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? selectedPdf.titleUrdu : selectedPdf.title}</h4>
                      <p className="text-[9px] text-slate-400">Page {pdfCurrentPage} of {selectedPdf.pages}</p>
                    </div>
                    <button 
                      onClick={() => setActiveScreen('pdf-reader')}
                      className="bg-emerald-800 hover:bg-emerald-700 text-white text-[9px] py-1 px-3 rounded-lg font-bold"
                    >
                      {isUr ? 'پڑھنا شروع کریں' : 'Open'}
                    </button>
                  </div>
                </div>
              )}

              {/* Books List */}
              <div className="space-y-3">
                {pdfs.map((book) => {
                  const isSaved = bookmarks.pdfs.includes(book.id);
                  const dlInfo = downloadProgressMap[book.id];
                  const isDownloaded = downloads.pdfs.includes(book.id) || dlInfo?.status === 'completed';
                  const isDownloading = dlInfo?.status === 'downloading';

                  return (
                    <div 
                      key={book.id}
                      className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm p-3 flex flex-col gap-2"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-22 rounded bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center relative shadow-sm">
                          {book.coverImage && (
                            <img src={book.coverImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                          )}
                          <img src={book.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                        </div>
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-snug line-clamp-1">
                                {isUr ? book.titleUrdu : book.title}
                              </h4>
                              {isDownloaded && (
                                <span className="bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 shrink-0">
                                  <CheckCircle2 size={9} />
                                  <span>{isUr ? 'آف لائن' : 'Offline'}</span>
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5">
                              {localT.author}: {isUr ? book.authorUrdu : book.author}
                            </p>
                            <p className="text-[8px] text-slate-400 mt-1 line-clamp-1">
                              {isUr ? book.descriptionUrdu : book.description}
                            </p>
                          </div>
                          
                          <div className="flex justify-between items-center text-[8px] text-slate-400 pt-1.5 border-t border-slate-50 dark:border-slate-800/80 mt-1">
                            <span>📄 {book.pages} p.</span>
                            <span>📦 {book.size}</span>
                            <div className="flex items-center gap-1.5">
                              <button 
                                onClick={() => { setSelectedPdf(book); setPdfCurrentPage(1); setActiveScreen('pdf-reader'); }}
                                className="bg-emerald-800 hover:bg-emerald-700 text-white text-[8px] px-2 py-0.5 rounded font-bold"
                              >
                                {localT.readOnline}
                              </button>

                              <button 
                                onClick={() => startOrToggleDownload(book.id, 'pdfs', book.title, book.titleUrdu, book.size)}
                                className={`p-1 rounded transition-colors ${
                                  isDownloading 
                                    ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-[8px] flex items-center gap-1'
                                    : isDownloaded 
                                      ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/40' 
                                      : 'text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                                }`}
                                title={isDownloading ? 'Downloading...' : isDownloaded ? 'Remove Offline File' : 'Download for Offline Use'}
                              >
                                {isDownloading ? (
                                  <>
                                    <Loader2 size={11} className="animate-spin text-amber-500" />
                                    <span>{dlInfo?.progress}%</span>
                                  </>
                                ) : isDownloaded ? (
                                  <CheckCircle2 size={13} className="text-emerald-500" />
                                ) : (
                                  <Download size={13} />
                                )}
                              </button>

                              <button 
                                onClick={() => onUpdateBookmarks('pdfs', book.id)}
                                className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-emerald-500"
                              >
                                <Bookmark size={12} className={isSaved ? "fill-emerald-500 text-emerald-500" : ""} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Animated Live Download Progress Indicator */}
                      {isDownloading && dlInfo && (
                        <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30 text-left space-y-1">
                          <div className="flex items-center justify-between text-[8px] font-bold text-emerald-700 dark:text-emerald-300">
                            <span className="flex items-center gap-1">
                              <Loader2 size={10} className="animate-spin text-emerald-500" />
                              <span>{isUr ? 'پی ڈی ایف ڈاؤن لوڈ ہو رہی ہے...' : 'Downloading PDF File...'}</span>
                            </span>
                            <span className="font-mono">{dlInfo.downloadedBytes} / {dlInfo.totalBytes} ({dlInfo.progress}%)</span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                              style={{ width: `${dlInfo.progress}%` }}
                            ></div>
                          </div>
                          <div className="flex justify-between items-center text-[7px] text-slate-400 font-mono">
                            <span>Speed: {dlInfo.speed}</span>
                            <span>{isOnline ? '🌐 Connected' : '📡 Offline Sync'}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </motion.div>
          )}

          {/* ==================== PDF READER VIEW SCREEN ==================== */}
          {activeScreen === 'pdf-reader' && selectedPdf && (
            <PdfViewerModal
              pdf={selectedPdf}
              onClose={() => setActiveScreen('pdfs')}
              isUrdu={isUr}
            />
          )}

          {/* ==================== 6. MORE TAB / EXTRA SCREENS ==================== */}
          {activeScreen === 'more' && (
            <motion.div 
              key="more"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.more}</h3>
              
              {/* Grid of secondary screens */}
              <div className="grid grid-cols-1 gap-2.5">
                
                {/* Secure / Exclusive Modules Area */}
                {!activeAppUser ? (
                  /* BEFORE LOGIN: Single "KhanQah Login Portal" entry point */
                  <div 
                    onClick={() => setActiveScreen('user-account')}
                    className="p-3.5 bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-xl border border-purple-500/60 shadow-md cursor-pointer hover:border-amber-400 flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-900/90 text-amber-300 rounded-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                        <Lock size={20} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xs text-amber-300 font-serif">KhanQah Login Portal (خانقاہ لاگ ان پورٹل)</h4>
                          <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">Restricted</span>
                        </div>
                        <p className="text-[9px] text-purple-200/80 mt-0.5">
                          مخزنِ خاص، علم الاعدد کیلکولیٹر اور سلیپس لیجر تک رسائی کے لیے لاگ ان کریں
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                ) : (
                  /* AFTER SUCCESSFUL LOGIN: Entry point is replaced in the same place by the actual module list */
                  <div className="space-y-2.5">
                    {/* Active User Account Status Card */}
                    <div 
                      onClick={() => setActiveScreen('user-account')}
                      className="p-3 bg-emerald-950/80 border border-emerald-600/60 rounded-xl text-white flex items-center justify-between cursor-pointer hover:border-amber-400 transition-all"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs border border-amber-300">
                          {activeAppUser.fullName.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-xs text-amber-300">{activeAppUser.fullName}</h4>
                            <span className="text-[8px] bg-emerald-800 text-emerald-200 px-1.5 py-0.2 rounded font-mono uppercase">{activeAppUser.role}</span>
                          </div>
                          <p className="text-[9px] text-slate-300 mt-0.5">فعال ممبر | آستانہ یوزر پورٹل</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-amber-400" />
                    </div>

                    {/* Module 1: Makhzan-e-Khas */}
                    <div 
                      onClick={() => setActiveScreen('makhzan')}
                      className="p-3.5 bg-gradient-to-r from-purple-950 via-slate-900 to-emerald-950 text-white rounded-xl border border-purple-500/60 shadow-md cursor-pointer hover:border-amber-400 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-900/90 text-amber-300 rounded-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                          <Lock size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-amber-300 font-serif">
                              {isUr ? 'مخزنِ خاص' : 'Makhzan-e-Khas'}
                            </h4>
                            <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">Gated</span>
                          </div>
                          <p className="text-[9px] text-purple-200/80 mt-0.5">
                            {isUr ? 'صدقہ، بچوں کے نام، نقوش، وظائف و خاص روحانی مواد' : 'Exclusive spiritual library, Naqsh, Wazaif & Baby Names'}
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Module 2: Ilm-ul-Adad Calculator */}
                    <div 
                      onClick={() => setActiveScreen('abjad-calc')}
                      className="p-3.5 bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-xl border border-amber-500/80 shadow-md cursor-pointer hover:border-amber-400 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-500 text-slate-950 rounded-xl font-bold shadow-md group-hover:scale-105 transition-transform">
                          <Calculator size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-amber-300 font-serif">روحانی تشخیص و حسابِ ابجد (Ilm-ul-Adad)</h4>
                            <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">حساب</span>
                          </div>
                          <p className="text-[9px] text-emerald-200/90 mt-0.5">
                            نام اور والدہ کے ابجد سے روحانی معائینہ، صدقہ و مسنون وظائف
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Module 3: Ledger (Spiritual Slips History) */}
                    <div 
                      onClick={() => setActiveScreen('my-slips')}
                      className="p-3.5 bg-slate-900 text-white rounded-xl border border-emerald-800/80 shadow-md cursor-pointer hover:border-emerald-500 flex items-center justify-between group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-800 text-amber-300 rounded-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                          <FileCheck size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-xs text-white">روحانی اسناد و سلیپس لیجر (Ledger)</h4>
                            <span className="text-[9px] font-bold bg-emerald-900 text-emerald-300 px-1.5 py-0.2 rounded font-mono">Ledger</span>
                          </div>
                          <p className="text-[9px] text-slate-400 mt-0.5">
                            جاری کردہ تمام اسناد و سلیپس کی ہسٹری، واٹس ایپ شیئر و پرنٹ
                          </p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )}

                {/* Information Center */}
                <div 
                  onClick={() => setActiveScreen('info-center')}
                  className="p-3.5 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-xl border border-emerald-700/60 shadow-md cursor-pointer hover:border-amber-400/80 flex items-center justify-between group transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-800/80 text-amber-300 rounded-xl border border-amber-500/30 group-hover:scale-105 transition-transform">
                      <Globe size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-xs text-white">{isUr ? 'معلومات سینٹر' : 'Information Center'}</h4>
                        <span className="text-[9px] font-bold bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded font-mono">CMS</span>
                      </div>
                      <p className="text-[9px] text-emerald-200/80 mt-0.5">
                        {isUr ? 'تنظیم، خدمات، قواعد اور معلوماتی صفحات' : 'Official guide, services, policies, and trust info'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-amber-400 group-hover:translate-x-1 transition-transform" />
                </div>
                
                {/* Profile */}
                <div 
                  onClick={() => setActiveScreen('profile')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl text-emerald-600 dark:text-emerald-400">
                    <User size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.profile}</h4>
                    <p className="text-[9px] text-slate-400">{currentUser.name} - {currentUser.city}</p>
                  </div>
                </div>

                {/* Bookmarks */}
                <div 
                  onClick={() => setActiveScreen('bookmarks')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/80 rounded-xl text-amber-500">
                    <Bookmark size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.bookmarksCenter}</h4>
                    <p className="text-[9px] text-slate-400">{bookmarks.posts.length + bookmarks.pdfs.length + bookmarks.videos.length + bookmarks.audios.length} saved items</p>
                  </div>
                </div>

                {/* Downloads */}
                <div 
                  onClick={() => setActiveScreen('downloads')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/80 rounded-xl text-blue-500">
                    <Download size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.downloadCenter}</h4>
                    <p className="text-[9px] text-slate-400">{downloads.pdfs.length + downloads.audios.length} files stored offline</p>
                  </div>
                </div>

                {/* Feedback */}
                <div 
                  onClick={() => setActiveScreen('feedback')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-teal-50 dark:bg-teal-950/80 rounded-xl text-teal-600 dark:text-teal-400">
                    <HelpCircle size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.feedback}</h4>
                    <p className="text-[9px] text-slate-400">Write directly to Halqa administration</p>
                  </div>
                </div>

                {/* Contact Us */}
                <div 
                  onClick={() => setActiveScreen('contact')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-purple-50 dark:bg-purple-950/80 rounded-xl text-purple-600 dark:text-purple-400">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.contactUs}</h4>
                    <p className="text-[9px] text-slate-400">Offices, Phone, WhatsApp, Maps location</p>
                  </div>
                </div>

                {/* Settings */}
                <div 
                  onClick={() => setActiveScreen('settings')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-300">
                    <Settings size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{localT.settings}</h4>
                    <p className="text-[9px] text-slate-400">Urdu/English, Dark/Light theme, Text sizes</p>
                  </div>
                </div>

                {/* Donations */}
                <div 
                  onClick={() => setActiveScreen('donations')}
                  className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center gap-3"
                >
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/80 rounded-xl text-amber-500">
                    <HeartHandshake size={18} />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? 'عطیات اور تعاون' : 'Donations & Support'}</h4>
                    <p className="text-[9px] text-slate-400">Contribute securely to Halqa-e-Usmania construction & welfare</p>
                  </div>
                </div>

                {/* Admin Panel */}
                {onSwitchViewMode && (
                  <div 
                    onClick={() => onSwitchViewMode(viewMode === 'admin' ? 'simulator' : 'admin')}
                    className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer hover:border-emerald-500/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-50 dark:bg-emerald-950/80 rounded-xl text-emerald-600 dark:text-emerald-400">
                        <Laptop size={18} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-800 dark:text-white">
                          {isUr ? 'ایڈمن پینل' : 'Admin Panel'}
                        </h4>
                        <p className="text-[9px] text-slate-400">
                          {isUr ? 'مواد کا انتظام (صرف منتظمین)' : 'Manage content (administrators only)'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-slate-400" />
                  </div>
                )}

              </div>

              {/* Social Media Shortcuts */}
              <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-2xl text-center space-y-3">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">{localT.socialMedia}</h4>
                <div className="flex justify-center gap-2 flex-wrap">
                  <a href={socialLinks.facebook} target="_blank" rel="referrer no-referrer" className="p-2 bg-blue-600 text-white rounded-full hover:scale-105 transition-transform"><Smartphone size={14} /></a>
                  <a href={socialLinks.youtube} target="_blank" rel="referrer no-referrer" className="p-2 bg-red-600 text-white rounded-full hover:scale-105 transition-transform"><Video size={14} /></a>
                  <a href={socialLinks.instagram} target="_blank" rel="referrer no-referrer" className="p-2 bg-pink-600 text-white rounded-full hover:scale-105 transition-transform"><Sparkles size={14} /></a>
                  <a href={socialLinks.telegram} target="_blank" rel="referrer no-referrer" className="p-2 bg-sky-500 text-white rounded-full hover:scale-105 transition-transform"><Send size={14} /></a>
                  <a href={socialLinks.whatsAppChannel} target="_blank" rel="referrer no-referrer" className="p-2 bg-green-600 text-white rounded-full hover:scale-105 transition-transform"><Phone size={14} /></a>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== POST DETAIL VIEW SCREEN ==================== */}
          {activeScreen === 'post-detail' && selectedPost && (
            <motion.div 
              key="post-detail"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              {/* Back button */}
              <div className="flex justify-between items-center">
                <button 
                  onClick={() => {
                    if (selectedPost.category === 'caliphs' || selectedPost.category === 'awliya' || selectedPost.category === 'events') {
                      setActiveScreen('home');
                    } else {
                      setActiveScreen('category-posts');
                    }
                  }}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onUpdateBookmarks('posts', selectedPost.id)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                  >
                    <Bookmark size={18} className={bookmarks.posts.includes(selectedPost.id) ? "fill-emerald-500 text-emerald-500" : ""} />
                  </button>
                  <button 
                    onClick={() => handleCopy(window.location.href, selectedPost.id)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                  >
                    {copiedId === selectedPost.id ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>

              {/* Cover Image */}
              <div className="h-48 sm:h-60 rounded-2xl overflow-hidden shadow-sm relative bg-slate-950 flex items-center justify-center border border-slate-800">
                {selectedPost.coverImage && (
                  <img src={selectedPost.coverImage} className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 pointer-events-none" alt="" />
                )}
                <img src={selectedPost.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                <div className="absolute top-2 left-2 z-20 bg-emerald-800 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">
                  {selectedPost.category}
                </div>
              </div>

              {/* Title & Meta */}
              <div>
                <h2 className="text-base font-serif font-bold text-slate-900 dark:text-white leading-tight">
                  {isUr ? selectedPost.titleUrdu : selectedPost.title}
                </h2>
                
                <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                  {selectedPost.scholarName && <span>👤 {isUr ? 'علمی نگرانی' : 'Scholar'}: {selectedPost.scholarName}</span>}
                  {selectedPost.city && <span>📍 {selectedPost.city}</span>}
                  <span>👁️ {selectedPost.views}</span>
                </div>
              </div>

              {/* AI Voice Reader & Recitation Trigger Bar */}
              <div className="p-3 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border-2 border-amber-400/50 rounded-2xl shadow-lg flex items-center justify-between gap-3 text-white">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 bg-amber-400 text-slate-950 rounded-xl font-bold shadow shrink-0">
                    <Volume2 size={20} className="animate-pulse" />
                  </div>
                  <div className="min-w-0 text-left">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-xs text-amber-300 font-serif">
                        {isUr ? 'صوتی تلاوت و مطالعہ' : 'Audio Recitation Reader'}
                      </span>
                      <span className="text-[9px] font-bold px-2 py-0.2 rounded-full border bg-emerald-950/80 text-emerald-300 border-emerald-600">
                        {selectedPost.humanVoiceUrl ? '🎙️ Human Recording' : '🤖 Respectful AI Voice'}
                      </span>
                    </div>
                    <p className="text-[9px] text-emerald-200/80 mt-0.5 truncate">
                      {isUr ? 'اردو، عربی اور انگریزی کے لیے باوقار صوتی تلفظ' : 'Respectful speech articulation for Urdu, Arabic & English'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => voiceReaderEngine.playPost(selectedPost, userSettings.voiceReaderSettings)}
                  className="px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md flex items-center gap-1.5 shrink-0 transition active:scale-95"
                >
                  <Play size={16} className="fill-slate-950" />
                  <span>{isUr ? '🔊 سنیں' : '🔊 Listen'}</span>
                </button>
              </div>

              {/* Dynamic Font Size Controller */}
              <div className="flex items-center justify-between border-y border-slate-100 dark:border-slate-800 py-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{localT.fontSize}</span>
                <div className="flex gap-1">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => onUpdateUserSettings({ fontSize: sz })}
                      className={`text-[9px] px-2 py-1 rounded font-bold uppercase transition-all ${userSettings.fontSize === sz ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Article Content */}
              <div className={`${fontSizeClass} text-slate-700 dark:text-slate-300 font-serif leading-relaxed text-left whitespace-pre-line`}>
                {isUr ? selectedPost.completeArticleUrdu : selectedPost.completeArticle}
              </div>

              {/* Embedded Video/Audio triggers if any */}
              {selectedPost.audioUrl && (
                <div className="bg-emerald-950/10 border border-emerald-600/30 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Music className="text-emerald-600" size={18} />
                    <span className="text-xs font-bold">Audio Lecture Available</span>
                  </div>
                  <button 
                    onClick={() => {
                      const a: AudioItem = {
                        id: `post-audio-${selectedPost.id}`,
                        title: selectedPost.title,
                        titleUrdu: selectedPost.titleUrdu,
                        artist: selectedPost.scholarName || 'Al-Usmani',
                        artistUrdu: selectedPost.scholarName || 'حلقہ عثمانیہ',
                        category: 'bayan',
                        audioUrl: selectedPost.audioUrl!,
                        duration: '15:00',
                        size: '8MB',
                        publishDate: selectedPost.publishDate
                      };
                      handlePlayAudio(a);
                    }}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white text-[10px] py-1 px-3 rounded font-bold"
                  >
                    Listen now
                  </button>
                </div>
              )}

              {/* Related Posts */}
              <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-left">
                <h4 className="font-bold text-xs text-emerald-700 dark:text-emerald-400">{localT.relatedPosts}</h4>
                <div className="space-y-2">
                  {posts
                    .filter(p => p.id !== selectedPost.id && p.category === selectedPost.category && !p.isDraft)
                    .slice(0, 2)
                    .map((rp) => (
                      <div 
                        key={rp.id}
                        onClick={() => setSelectedPost(rp)}
                        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-2.5 rounded-xl flex gap-3 cursor-pointer hover:border-emerald-500/30"
                      >
                        <div className="w-12 h-12 rounded bg-slate-900 border border-slate-800 shrink-0 overflow-hidden flex items-center justify-center relative">
                          {rp.coverImage && (
                            <img src={rp.coverImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                          )}
                          <img src={rp.coverImage || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                        </div>
                        <div className="flex-1">
                          <h5 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">{isUr ? rp.titleUrdu : rp.title}</h5>
                          <p className="text-[9px] text-slate-400 mt-0.5 line-clamp-1">{isUr ? rp.shortDescriptionUrdu : rp.shortDescription}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 10. CONTACT US SCREEN ==================== */}
          {activeScreen === 'contact' && (
            <motion.div 
              key="contact"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('more')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.contactUs}</h3>
              </div>

              {/* Address details */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-3.5">
                <div className="flex gap-2.5 items-start">
                  <MapPin className="text-amber-500 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-xs">Office Address</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
                      {isUr ? contactInfo.officeAddressUrdu : contactInfo.officeAddress}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Phone className="text-emerald-600 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-xs">Phone & WhatsApp</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">{contactInfo.mobile}</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <Mail className="text-blue-500 mt-0.5" size={16} />
                  <div>
                    <h5 className="font-bold text-xs">Email Support</h5>
                    <p className="text-[10px] text-slate-500 mt-0.5">{contactInfo.email}</p>
                  </div>
                </div>
              </div>

              {/* Embedded Google Map */}
              <div className="h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm relative">
                <iframe
                  title="office-location"
                  className="w-full h-full"
                  src={contactInfo.googleMapEmbedUrl}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>

              {/* Action buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <a 
                  href={`https://wa.me/${contactInfo.whatsApp.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="referrer"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <Phone size={14} /> WhatsApp Chat
                </a>
                <a 
                  href={contactInfo.website} 
                  target="_blank" 
                  rel="referrer"
                  className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <ExternalLink size={14} /> Visit Website
                </a>
              </div>
            </motion.div>
          )}

          {/* ==================== 9. FEEDBACK SYSTEM SCREEN ==================== */}
          {activeScreen === 'feedback' && (
            <motion.div 
              key="feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('more')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.feedback}</h3>
              </div>

              {feedbackSuccess ? (
                <div className="bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl p-4 text-center my-12">
                  <span className="text-xl block">✔️</span>
                  <p className="text-xs font-bold mt-2">{localT.successFeedback}</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="space-y-3.5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.name}</label>
                    <input 
                      type="text" 
                      required 
                      value={feedbackForm.name} 
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, name: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.email}</label>
                    <input 
                      type="email" 
                      value={feedbackForm.email} 
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, email: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.mobile}</label>
                    <input 
                      type="text" 
                      value={feedbackForm.mobile} 
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, mobile: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.subject}</label>
                    <input 
                      type="text" 
                      value={feedbackForm.subject} 
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, subject: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.message}</label>
                    <textarea 
                      rows={3} 
                      required 
                      value={feedbackForm.message} 
                      onChange={(e) => setFeedbackForm({ ...feedbackForm, message: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                  >
                    {localT.submit}
                  </button>
                </form>
              )}

              {/* History of feedback replies */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300">Your Feedback History / جوابات</h4>
                {feedback.filter(f => f.email === currentUser.email).length === 0 ? (
                  <p className="text-[10px] text-slate-400">No prior feedback history from your account.</p>
                ) : (
                  feedback.filter(f => f.email === currentUser.email).map((item) => (
                    <div key={item.id} className="p-3 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[9px] text-slate-400">
                        <span className="font-bold text-slate-700 dark:text-slate-300">{item.subject}</span>
                        <span>{item.date}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400">{item.message}</p>
                      {item.replied && item.replyMessage && (
                        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 border-l-2 border-emerald-600 rounded mt-1 text-[10px]">
                          <span className="font-bold text-emerald-800 dark:text-emerald-400">Admin reply ({item.replyDate}):</span>
                          <p className="mt-0.5 text-slate-600 dark:text-slate-300">{item.replyMessage}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== 16. USER PROFILE SCREEN ==================== */}
          {activeScreen === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('more')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.profile}</h3>
              </div>

              {/* Avatar section */}
              <div className="flex flex-col items-center py-4 bg-emerald-950/5 rounded-2xl border border-slate-100 dark:border-slate-800/80">
                <div className="w-16 h-16 rounded-full bg-emerald-800 text-amber-400 flex items-center justify-center font-bold text-2xl border-2 border-amber-500 shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <h4 className="font-bold text-sm mt-2 text-slate-800 dark:text-white">{currentUser.name}</h4>
                <p className="text-[9px] text-slate-400">{currentUser.email}</p>
              </div>

              {/* Form editing */}
              <form onSubmit={handleProfileSave} className="space-y-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.name}</label>
                  <input 
                    type="text" 
                    required 
                    value={profileForm.name} 
                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.email}</label>
                  <input 
                    type="email" 
                    required 
                    value={profileForm.email} 
                    onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.mobile}</label>
                  <input 
                    type="text" 
                    value={profileForm.mobile} 
                    onChange={(e) => setProfileForm({ ...profileForm, mobile: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{localT.city}</label>
                  <input 
                    type="text" 
                    value={profileForm.city} 
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500" 
                  />
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm"
                >
                  Save Profile
                </button>
              </form>
            </motion.div>
          )}

          {/* ==================== KHANQAH ABJAD TASHKHEES CALCULATOR SCREEN ==================== */}
          {activeScreen === 'abjad-calc' && (
            <motion.div
              key="abjad-calc"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 sm:p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400">
                  روحانی تشخیص و حسابِ ابجد
                </h3>
              </div>

              <AbjadTashkheesCalculator
                branches={branches}
                dayDatasets={dayDatasets}
                modSettings={modSettings}
                activeUser={activeAppUser}
                onCreateSlip={onCreateSlip || (() => ({} as SpiritualSlip))}
                onViewSlipHistory={() => setActiveScreen('my-slips')}
              />
            </motion.div>
          )}

          {/* ==================== KHANQAH SLIPS AUDIT HISTORY SCREEN ==================== */}
          {activeScreen === 'my-slips' && (
            <motion.div
              key="my-slips"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 sm:p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400">
                  روحانی اسناد و سلیپ ہسٹری
                </h3>
              </div>

              <UserSlipsHistory
                slips={slips}
                branches={branches}
                activeUser={activeAppUser}
              />
            </motion.div>
          )}

          {/* ==================== KHANQAH USER AUTH & ACCOUNT SCREEN ==================== */}
          {activeScreen === 'user-account' && (
            <motion.div
              key="user-account"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-3 sm:p-4 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400">
                  آستانہ یوزر پورٹل
                </h3>
              </div>

              <UserAuthScreen
                branches={branches}
                appUsers={appUsers}
                activeUser={activeAppUser}
                onSelectActiveUser={onSelectActiveUser || (() => {})}
                onSelfRegisterUser={onSelfRegisterUser || (() => ({} as AppUser))}
              />
            </motion.div>
          )}

          {/* ==================== 13. BOOKMARKS SCREEN ==================== */}
          {activeScreen === 'bookmarks' && (
            <motion.div 
              key="bookmarks"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('more')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.bookmarksCenter}</h3>
              </div>

              {/* Bookmarked articles */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Saved Articles ({bookmarks.posts.length})</h4>
                {bookmarks.posts.length === 0 ? (
                  <p className="text-[9px] text-slate-400 italic">No saved articles.</p>
                ) : (
                  posts.filter(p => bookmarks.posts.includes(p.id)).map((post) => (
                    <div 
                      key={post.id}
                      onClick={() => { setSelectedPost(post); setActiveScreen('post-detail'); }}
                      className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 cursor-pointer justify-between items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-800 dark:text-white truncate">{isUr ? post.titleUrdu : post.title}</h5>
                        <p className="text-[9px] text-slate-400 mt-0.5">{post.category.toUpperCase()}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateBookmarks('posts', post.id); }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Bookmarked PDFs */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Saved PDFs ({bookmarks.pdfs.length})</h4>
                {bookmarks.pdfs.length === 0 ? (
                  <p className="text-[9px] text-slate-400 italic">No saved books.</p>
                ) : (
                  pdfs.filter(b => bookmarks.pdfs.includes(b.id)).map((book) => (
                    <div 
                      key={book.id}
                      onClick={() => { setSelectedPdf(book); setActiveScreen('pdf-reader'); }}
                      className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800 flex gap-3 cursor-pointer justify-between items-center"
                    >
                      <div className="flex-1 min-w-0">
                        <h5 className="font-bold text-xs text-slate-800 dark:text-white truncate">{isUr ? book.titleUrdu : book.title}</h5>
                        <p className="text-[9px] text-slate-400 mt-0.5">{book.author}</p>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onUpdateBookmarks('pdfs', book.id); }}
                        className="text-red-500 hover:bg-red-50 p-1.5 rounded-full"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== 14. DOWNLOADS SCREEN ==================== */}
          {activeScreen === 'downloads' && (
            <motion.div 
              key="downloads"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setActiveScreen('more')}
                    className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.downloadCenter}</h3>
                </div>
                {(downloads.pdfs.length > 0 || downloads.audios.length > 0 || Object.keys(downloadProgressMap).length > 0) && (
                  <button
                    onClick={handleClearAllOfflineCache}
                    className="text-[9px] text-red-500 hover:text-red-700 font-bold bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    <Trash2 size={11} />
                    <span>{isUr ? 'آف لائن کیشے حذف کریں' : 'Clear All Cache'}</span>
                  </button>
                )}
              </div>

              {/* Network Connectivity Status Banner */}
              <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                isOnline 
                  ? 'bg-emerald-950/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-300' 
                  : 'bg-amber-950/20 border-amber-500/40 text-amber-800 dark:text-amber-300'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-xl ${isOnline ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-slate-950 animate-pulse'}`}>
                    {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">
                      {isOnline ? (isUr ? 'انٹرنیٹ فعال (آن لائن)' : 'Online Network Connected') : (isUr ? 'آف لائن موڈ فعال' : 'Offline Mode Active')}
                    </h4>
                    <p className="text-[9px] text-slate-500 dark:text-slate-400">
                      {isOnline 
                        ? (isUr ? 'تمام فائلیں بلا تاخیر ڈاؤن لوڈ کیلئے دستیاب ہیں' : 'High speed connection active for new downloads') 
                        : (isUr ? 'محفوظ شدہ مواد بغیر انٹرنیٹ کے دستیاب ہے' : 'Accessing offline files cached in persistent local storage')}
                    </p>
                  </div>
                </div>
                <div className="text-right font-mono text-[9px] font-bold text-slate-500">
                  <span>{(downloads.pdfs.length + downloads.audios.length)} Files Stored</span>
                </div>
              </div>

              {/* Active Downloads Section (In Progress) */}
              {(Object.values(downloadProgressMap) as DownloadProgressItem[]).filter(item => item.status === 'downloading' || item.status === 'paused').length > 0 && (
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/80 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="text-[10px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                    <Loader2 size={13} className="animate-spin text-amber-500" />
                    <span>{isUr ? 'جاری ڈاؤن لوڈز (Progress)' : 'Active Downloads In Progress'}</span>
                  </h4>

                  {(Object.values(downloadProgressMap) as DownloadProgressItem[])
                    .filter(item => item.status === 'downloading' || item.status === 'paused')
                    .map((item) => (
                      <div key={item.id} className="bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <h5 className="font-bold text-xs text-slate-800 dark:text-white line-clamp-1">
                              {isUr ? (item.titleUrdu || item.title) : item.title}
                            </h5>
                            <p className="text-[9px] text-slate-400 uppercase font-mono">
                              {item.type === 'pdfs' ? '📕 PDF Document' : '🎵 Audio Lecture'} • {item.size}
                            </p>
                          </div>
                          <span className="text-xs font-mono font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-lg">
                            {item.progress}%
                          </span>
                        </div>

                        {/* Animated Progress Bar */}
                        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all duration-300"
                            style={{ width: `${item.progress}%` }}
                          ></div>
                        </div>

                        <div className="flex justify-between items-center text-[8px] text-slate-400 font-mono">
                          <span>Downloaded: {item.downloadedBytes || '0 MB'} / {item.totalBytes || item.size}</span>
                          <span>Speed: {item.speed}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}


              {/* Downloaded PDFs */}
              <div className="space-y-3">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Offline PDFs ({downloads.pdfs.length})</span>
                  <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-normal">✔️ Cached Locally</span>
                </h4>
                {downloads.pdfs.length === 0 ? (
                  <p className="text-[9px] text-slate-400 italic">No offline PDF books stored yet.</p>
                ) : (
                  pdfs.filter(b => downloads.pdfs.includes(b.id)).map((book) => (
                    <div 
                      key={book.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? book.titleUrdu : book.title}</h5>
                        <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 size={11} />
                          <span>100% Offline Ready ({book.size})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => { setSelectedPdf(book); setActiveScreen('pdf-reader'); }}
                          className="bg-emerald-800 text-white text-[9px] py-1 px-3 rounded-lg font-bold hover:bg-emerald-700"
                        >
                          {isUr ? 'مطالعہ کریں' : 'Read'}
                        </button>
                        <button 
                          onClick={() => startOrToggleDownload(book.id, 'pdfs', book.title, book.titleUrdu, book.size)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg"
                          title="Delete from cache"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Downloaded Audios */}
              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <h4 className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Offline Audio Lectures ({downloads.audios.length})</span>
                  <span className="text-[8px] text-emerald-600 dark:text-emerald-400 font-normal">✔️ Cached Locally</span>
                </h4>
                {downloads.audios.length === 0 ? (
                  <p className="text-[9px] text-slate-400 italic">No audio downloaded for offline listening.</p>
                ) : (
                  audios.filter(a => downloads.audios.includes(a.id)).map((audio) => (
                    <div 
                      key={audio.id}
                      className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex justify-between items-center shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <h5 className="font-bold text-xs text-slate-800 dark:text-white">{isUr ? audio.titleUrdu : audio.title}</h5>
                        <div className="flex items-center gap-1.5 text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">
                          <CheckCircle2 size={11} />
                          <span>100% Offline Ready ({audio.size})</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handlePlayAudio(audio)}
                          className="bg-emerald-800 text-white text-[9px] py-1 px-3 rounded-lg font-bold hover:bg-emerald-700 flex items-center gap-1"
                        >
                          <Play size={10} className="fill-white" />
                          <span>{isUr ? 'سنیں' : 'Play'}</span>
                        </button>
                        <button 
                          onClick={() => startOrToggleDownload(audio.id, 'audios', audio.title, audio.titleUrdu, audio.size)}
                          className="text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 p-1.5 rounded-lg"
                          title="Delete from cache"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}


          {/* ==================== 18. APP SETTINGS SCREEN ==================== */}
          {activeScreen === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-5 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">{localT.settings}</h3>
              </div>

              {/* Search Engine (Item 12 of requirements) */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2.5">
                <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">🔍 Global Search Engine</span>
                <div className="flex gap-1.5">
                  <input 
                    type="text" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search posts, PDFs, videos, audio..."
                    className="flex-1 bg-slate-100 dark:bg-slate-950 text-xs border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2"
                  />
                  {searchTerm && (
                    <button 
                      onClick={() => setSearchTerm('')}
                      className="bg-slate-200 dark:bg-slate-800 text-xs text-slate-600 px-2.5 py-1.5 rounded-xl font-bold"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Search Output */}
                {searchTerm && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pt-2 border-t border-slate-100 dark:border-slate-800" dir="ltr">
                    <p className="text-[9px] text-slate-400 font-bold">Found {searchResultsCount} matching resources</p>
                    
                    {searchResults.posts.map(p => (
                      <div 
                        key={p.id} 
                        onClick={() => { setSelectedPost(p); setActiveScreen('post-detail'); }}
                        className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer"
                      >
                        📝 {isUr ? p.titleUrdu : p.title} (Post)
                      </div>
                    ))}

                    {searchResults.pdfs.map(b => (
                      <div 
                        key={b.id} 
                        onClick={() => { setSelectedPdf(b); setActiveScreen('pdf-reader'); }}
                        className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer"
                      >
                        📕 {isUr ? b.titleUrdu : b.title} (PDF)
                      </div>
                    ))}

                    {searchResults.videos.map(v => (
                      <div 
                        key={v.id} 
                        onClick={() => { setMediaTab('videos'); setActiveScreen('media'); }}
                        className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer"
                      >
                        🎥 {isUr ? v.titleUrdu : v.title} (Video)
                      </div>
                    ))}

                    {searchResults.audios.map(a => (
                      <div 
                        key={a.id} 
                        onClick={() => { handlePlayAudio(a); }}
                        className="p-1.5 rounded bg-slate-50 dark:bg-slate-950 text-[10px] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 cursor-pointer"
                      >
                        🎵 {isUr ? a.titleUrdu : a.title} (Audio)
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl space-y-4">
                
                {/* Language Switch */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs">{localT.language}</h5>
                    <p className="text-[9px] text-slate-400">Choose app interface language</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => onUpdateUserSettings({ language: 'ur' })}
                      className={`text-[10px] py-1 px-3 rounded-lg font-bold ${isUr ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      اردو (Urdu)
                    </button>
                    <button 
                      onClick={() => onUpdateUserSettings({ language: 'en' })}
                      className={`text-[10px] py-1 px-3 rounded-lg font-bold ${!isUr ? 'bg-emerald-800 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Theme Mode */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs">{userSettings.theme === 'dark' ? localT.darkMode : localT.lightMode}</h5>
                    <p className="text-[9px] text-slate-400">Eye-friendly visual preset</p>
                  </div>
                  <button 
                    onClick={() => onUpdateUserSettings({ theme: userSettings.theme === 'dark' ? 'light' : 'dark' })}
                    className="p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 rounded-lg text-slate-800 dark:text-slate-200"
                  >
                    {userSettings.theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                  </button>
                </div>

                {/* Push notification setup */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs">{localT.notifications}</h5>
                    <p className="text-[9px] text-slate-400">Receive announcements in real-time</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userSettings.notificationsEnabled}
                    onChange={(e) => onUpdateUserSettings({ notificationsEnabled: e.target.checked })}
                    className="w-4 h-4 text-emerald-800 focus:ring-emerald-500 rounded"
                  />
                </div>

                {/* Auto download WiFi */}
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-xs">{localT.autoDownload}</h5>
                    <p className="text-[9px] text-slate-400">Disable background files loading</p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={userSettings.autoDownloadOff}
                    onChange={(e) => onUpdateUserSettings({ autoDownloadOff: e.target.checked })}
                    className="w-4 h-4 text-emerald-800 focus:ring-emerald-500 rounded"
                  />
                </div>

                {/* Clear cache */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>
                    <h5 className="font-bold text-xs">{localT.clearCache}</h5>
                    <p className="text-[9px] text-slate-400">Wipe cache storage space</p>
                  </div>
                  <button 
                    onClick={() => alert(localT.cacheCleared)}
                    className="text-[10px] bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white py-1.5 px-3 rounded-lg font-bold"
                  >
                    Wipe
                  </button>
                </div>

              </div>
            </motion.div>
          )}

          {/* ==================== DONATIONS AND SUPPORT SCREEN ==================== */}
          {activeScreen === 'donations' && (
            <motion.div 
              key="donations"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left relative flex flex-col h-full overflow-y-auto pb-20"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('more')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {isUr ? 'عطیات اور تعاون' : 'Donations & Support'}
                </h3>
              </div>

              <div className="bg-gradient-to-br from-emerald-900/10 to-amber-500/5 border border-emerald-600/20 p-4 rounded-2xl text-xs space-y-2 leading-relaxed">
                <p className="font-serif font-semibold text-emerald-800 dark:text-emerald-400">
                  {isUr ? 'دینِ متین اور مشن عثمانیہ کی خدمت میں شامل ہوں' : 'Join the Noble Service of Halqa-e-Usmania'}
                </p>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  {isUr 
                    ? 'حلقہ عثمانیہ کے تحت چلنے والے تعلیمی، تدریسی، فلاحی اور ڈیجیٹل تبلیغی منصوبوں میں اپنی حلال روزی سے حصہ ملائیے۔ آپ کا ہر روپیہ مستحق طلباء کی کفالت اور علمِ دین کے فروغ میں استعمال ہوتا ہے۔'
                    : 'Halqa-e-Usmania operates construction projects, digital library indexing, classical manuscripts translation, and monthly welfare ration support for widows and deserving families.'}
                </p>
              </div>

              {/* Segmented Tab Selector */}
              <div className="flex bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl border border-slate-200/40 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setDonationsTab('campaigns')}
                  className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all ${
                    donationsTab === 'campaigns'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  {isUr ? 'جاری مہمات' : 'Campaigns'}
                </button>
                <button
                  type="button"
                  onClick={() => setDonationsTab('receipts')}
                  className={`flex-1 py-1.5 text-center text-[11px] font-bold rounded-lg transition-all relative ${
                    donationsTab === 'receipts'
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5 justify-center w-full">
                    <span>{isUr ? 'میری رسیدیں' : 'My Receipts'}</span>
                    {donationRecords.length > 0 && (
                      <span className="px-1.5 py-0.5 text-[8px] bg-amber-500 text-slate-950 font-extrabold rounded-full leading-none">
                        {donationRecords.length}
                      </span>
                    )}
                  </span>
                </button>
              </div>

              {donationsTab === 'campaigns' ? (
                /* Active Campaigns */
                <div className="space-y-3.5">
                  <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                    {isUr ? 'جاری مہمات و فنڈز' : 'Active Donation Campaigns'}
                  </h4>

                  {donationInitiatives.filter(init => init.active).map((init) => {
                    const raised = Number(init.raisedAmount) || 0;
                    const goal = Number(init.goalAmount) || 1;
                    const rawPercent = Math.round((raised / (goal > 0 ? goal : 1)) * 100);
                    const percent = isNaN(rawPercent) ? 0 : Math.min(100, Math.max(0, rawPercent));
                    return (
                      <div 
                        key={init.id}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm flex flex-col"
                      >
                        <div className="w-full h-32 bg-slate-950 flex items-center justify-center relative overflow-hidden">
                          {init.image && (
                            <img src={init.image} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                          )}
                          <img src={init.image || undefined} className="relative z-10 max-h-full max-w-full object-contain mx-auto" alt="" />
                        </div>
                        <div className="p-4 space-y-3">
                          <div>
                            <h4 className="font-bold text-xs text-slate-800 dark:text-white leading-tight">
                              {isUr ? init.titleUrdu : init.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 mt-1 leading-normal line-clamp-2">
                              {isUr ? init.descriptionUrdu : init.description}
                            </p>
                          </div>

                          {/* Progress Bar */}
                          <div className="space-y-1">
                            <div className="flex justify-between text-[9px] font-bold text-slate-500">
                              <span>{percent}% {isUr ? 'مکمل' : 'Raised'}</span>
                              <span>
                                {(Number(init.raisedAmount) || 0).toLocaleString()} / {init.goalAmount ? (Number(init.goalAmount) || 0).toLocaleString() : 'No Limit'} PKR
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-emerald-700 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                            </div>
                          </div>

                          {/* Action */}
                          <button 
                            onClick={() => {
                              setSelectedInitiative(init);
                              setDonationForm({
                                amount: 5000,
                                currency: 'PKR',
                                paymentMethod: 'easy_paisa',
                                referenceNumber: '',
                                notes: ''
                              });
                              setDonationSuccess(false);
                              setActiveScreen('donate-form');
                            }}
                            className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-xs transition-all shadow-sm"
                          >
                            {isUr ? 'ابھی فنڈ کریں' : 'Donate to Initiative'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Receipts and Contribution History Section */
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] uppercase font-black text-slate-400 tracking-wider">
                      {isUr ? 'عطیات کی تاریخ' : 'Contribution History'}
                    </h4>
                    <span className="text-[9px] text-slate-400">
                      {isUr ? 'تصدیق کے بعد رسید دستیاب ہوگی' : 'Receipts unlock post verification'}
                    </span>
                  </div>

                  {donationRecords.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-8 rounded-2xl text-center space-y-2">
                      <div className="text-3xl text-slate-300 dark:text-slate-750">📦</div>
                      <p className="text-xs text-slate-400">
                        {isUr ? 'آپ نے ابھی تک کوئی عطیہ جمع نہیں کروایا۔' : 'You have not submitted any donation records yet.'}
                      </p>
                      <button
                        type="button"
                        onClick={() => setDonationsTab('campaigns')}
                        className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:underline font-bold"
                      >
                        {isUr ? 'مہمات دیکھیں' : 'Browse Campaigns'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                      {[...donationRecords].reverse().map((record) => {
                        const init = donationInitiatives.find(i => i.id === record.initiativeId);
                        const isVerified = record.status === 'verified';
                        const isPending = record.status === 'pending';
                        
                        return (
                          <div 
                            key={record.id}
                            className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-100 dark:border-slate-800/80 flex justify-between items-center gap-3 shadow-sm hover:border-emerald-500/20 transition-all text-left"
                          >
                            <div className="min-w-0 flex-1 space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full uppercase leading-none ${
                                  isVerified 
                                    ? 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400 border border-green-200/50 dark:border-green-800/30' 
                                    : isPending 
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200/50 dark:border-amber-800/30 animate-pulse'
                                    : 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400 border border-red-200/50 dark:border-red-800/30'
                                }`}>
                                  {isVerified ? (isUr ? 'منظور شدہ' : 'Approved') : isPending ? (isUr ? 'زیر التوا' : 'Pending') : (isUr ? 'مسترد' : 'Rejected')}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400">{record.date}</span>
                              </div>

                              <h5 className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate">
                                {init ? (isUr ? init.titleUrdu : init.title) : record.initiativeTitle || 'General Contribution'}
                              </h5>

                              <div className="flex gap-2 text-[10px] text-slate-400 items-center">
                                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                                  {(Number(record.amount) || 0).toLocaleString()} {record.currency}
                                </span>
                                <span className="w-1 h-1 bg-slate-300 dark:bg-slate-700 rounded-full"></span>
                                <span className="font-mono text-[9px] uppercase">
                                  {record.paymentMethod.replace('_', ' ')}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0">
                              {isVerified ? (
                                <button
                                  type="button"
                                  onClick={() => setSelectedReceiptRecord(record)}
                                  className="bg-emerald-800 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm"
                                  title={isUr ? 'رسید دیکھیں' : 'View Receipt'}
                                >
                                  <FileText size={14} />
                                </button>
                              ) : (
                                <div className="text-[9px] text-slate-400 italic px-2">
                                  {isPending ? (isUr ? 'تصدیق...' : 'Pending...') : (isUr ? 'منسوخ' : 'Rejected')}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* ==================== STUNNING OFFICIAL PRINTABLE RECEIPT MODAL ==================== */}
              {selectedReceiptRecord && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col z-50 p-4 justify-center">
                  <div className="bg-white text-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92%] border-4 border-emerald-800">
                    
                    {/* Scrollable Area */}
                    <div id="printable-receipt" className="p-5 overflow-y-auto space-y-4 flex-1 text-left relative bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
                      
                      {/* Decorative Ribbon */}
                      <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-800 [clip-path:polygon(100%_0,0_0,100%_100%)] flex items-start justify-end p-1.5 text-amber-300">
                        <Award size={16} className="rotate-12" />
                      </div>

                      {/* Header */}
                      <div className="text-center space-y-1 pb-3 border-b-2 border-emerald-800/20">
                        <div className="w-9 h-9 rounded-full bg-emerald-800 flex items-center justify-center font-bold border border-amber-500 shadow-sm mx-auto overflow-hidden shrink-0">
                          <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
                        </div>
                        <h3 className="font-serif font-extrabold text-[12px] text-emerald-800 tracking-wide uppercase">
                          Halqa-e-Usmania Trust
                        </h3>
                        <p className="text-[9px] text-slate-500 font-serif leading-none">
                          حلقہ عثمانیہ اسلامک اینڈ ویلفیئر ٹرسٹ (رجسٹرڈ)
                        </p>
                        <p className="text-[7.5px] font-mono text-slate-400">Reg No: PK-TRUST-889-22-USMANIA</p>
                      </div>

                      {/* Title */}
                      <div className="text-center space-y-0.5 my-1">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          Official Contribution Receipt
                        </span>
                        <h4 className="text-[11px] font-serif font-black text-slate-800">
                          رسیدِ فنڈ برائے مالی تعاون و عطیہ
                        </h4>
                      </div>

                      {/* Details Box */}
                      <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100/80 space-y-2 text-[10.5px] leading-relaxed">
                        
                        <div className="flex justify-between items-center border-b border-dashed border-emerald-200/60 pb-1">
                          <span className="text-slate-500">Receipt ID:</span>
                          <span className="font-mono font-bold text-emerald-800">HU-REC-{selectedReceiptRecord.id.replace('don-', '')}</span>
                        </div>

                        <div className="flex justify-between items-center border-b border-dashed border-emerald-200/60 pb-1">
                          <span className="text-slate-500">Date:</span>
                          <span className="font-mono text-slate-700">{selectedReceiptRecord.date}</span>
                        </div>

                        <div className="space-y-0.5">
                          <div className="text-[8.5px] text-slate-400">Honorable Donor / عطیہ دہندہ:</div>
                          <div className="font-serif font-black text-[11px] text-slate-800 flex justify-between">
                            <span>{selectedReceiptRecord.donorName}</span>
                            <span className="text-[9px] text-emerald-800 font-normal">محترم مکرم</span>
                          </div>
                          <div className="text-[8.5px] text-slate-500 font-mono">{selectedReceiptRecord.donorEmail}</div>
                        </div>

                        <div className="space-y-0.5 pt-1 border-t border-emerald-100">
                          <div className="text-[8.5px] text-slate-400">Donation Cause / مدِ عطیہ:</div>
                          <div className="font-bold text-slate-800 text-[10px] truncate">
                            {donationInitiatives.find(i => i.id === selectedReceiptRecord.initiativeId)?.title || selectedReceiptRecord.initiativeTitle || 'General Welfare Fund'}
                          </div>
                        </div>

                        <div className="flex justify-between items-center bg-emerald-800 text-white px-2.5 py-1.5 rounded-xl mt-2">
                          <span className="text-[9px] font-bold font-serif">Amount Paid / رقم:</span>
                          <span className="font-mono text-xs font-black text-amber-300">
                            {(Number(selectedReceiptRecord.amount) || 0).toLocaleString()} {selectedReceiptRecord.currency}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-1.5 text-[9px] border-t border-dashed border-emerald-100 mt-1">
                          <div>
                            <span className="text-slate-400 block">Method:</span>
                            <span className="font-bold uppercase text-slate-700">{selectedReceiptRecord.paymentMethod.replace('_', ' ')}</span>
                          </div>
                          <div className="min-w-0">
                            <span className="text-slate-400 block">Reference No:</span>
                            <span className="font-mono font-bold text-blue-600 truncate block">{selectedReceiptRecord.referenceNumber}</span>
                          </div>
                        </div>

                      </div>

                      {/* Prayer */}
                      <div className="text-center py-1.5 border-t border-b border-emerald-100/60">
                        <p className="font-serif text-[10px] font-black text-emerald-800 leading-normal" dir="rtl">
                          جَزَاكَ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالْآخِرَةِ
                        </p>
                        <p className="text-[8px] text-slate-500 leading-normal mt-0.5">
                          "May Almighty Allah accept your contribution as Sadaqah Jariyah and grant you infinite blessings."
                        </p>
                      </div>

                      {/* Stamp & Seal */}
                      <div className="flex justify-between items-end pt-1">
                        <div className="space-y-0.5">
                          <div className="w-14 h-7 bg-slate-50 rounded border border-slate-200 flex flex-col justify-center items-center">
                            <span className="text-[5px] text-slate-400 font-mono">SECURE SIGN</span>
                            <div className="w-full bg-emerald-800 h-[1px] my-[1px]"></div>
                            <span className="text-[5px] font-mono text-emerald-800 font-bold uppercase">VERIFIED</span>
                          </div>
                          <span className="text-[7px] text-slate-400 font-mono block">Audit Stamp</span>
                        </div>

                        <div className="text-right space-y-0.5">
                          <div className="w-9 h-9 rounded-full border border-dashed border-emerald-700/30 flex items-center justify-center relative select-none rotate-12">
                            <span className="text-[6.5px] font-black text-emerald-800/40 uppercase leading-none text-center">Halqa<br/>✓</span>
                          </div>
                          <span className="text-[7px] text-slate-400 font-mono block">Trust Seal</span>
                        </div>
                      </div>

                    </div>

                    {/* Footer Controls */}
                    <div className="bg-slate-50 p-3 border-t border-slate-150 flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          const refNo = selectedReceiptRecord.referenceNumber;
                          const element = document.createElement("a");
                          const content = `
=========================================
HALQA-E-USMANIA OFFICIAL TRUST RECEIPT
=========================================
Receipt ID: HU-REC-${selectedReceiptRecord.id.replace('don-', '')}
Date: ${selectedReceiptRecord.date}
Donor Name: ${selectedReceiptRecord.donorName}
Donor Contact: ${selectedReceiptRecord.donorMobile}
Cause: ${donationInitiatives.find(i => i.id === selectedReceiptRecord.initiativeId)?.title || selectedReceiptRecord.initiativeTitle || 'General Welfare Fund'}
Amount: ${(Number(selectedReceiptRecord.amount) || 0).toLocaleString()} ${selectedReceiptRecord.currency}
Payment Method: ${selectedReceiptRecord.paymentMethod.replace('_', ' ')}
Reference Number: ${selectedReceiptRecord.referenceNumber}
Status: VERIFIED & SECURED (DIGITALLY SIGNED)
=========================================
جَزَاكَ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالْآخِرَةِ
"May Almighty Allah accept your noble contribution as Sadaqah Jariyah and grant you, your parents, and your family infinite blessings."
=========================================
`;
                          const file = new Blob([content], {type: 'text/plain'});
                          element.href = URL.createObjectURL(file);
                          element.download = `HU-Receipt-${refNo}.txt`;
                          document.body.appendChild(element);
                          element.click();
                          document.body.removeChild(element);
                          alert(isUr ? 'رسید کامیابی سے ڈاؤن لوڈ کر لی گئی ہے!' : 'Receipt downloaded successfully as text/plain certificate file!');
                        }}
                        className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Download size={13} />
                        <span>{isUr ? 'ڈاؤن لوڈ' : 'Download'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          try {
                            const iframe = document.createElement('iframe');
                            iframe.style.position = 'absolute';
                            iframe.style.width = '0px';
                            iframe.style.height = '0px';
                            iframe.style.border = 'none';
                            document.body.appendChild(iframe);
                            
                            const doc = iframe.contentWindow?.document || iframe.contentDocument;
                            if (doc) {
                              const html = `
                                <html>
                                  <head>
                                    <title>Receipt HU-REC-${selectedReceiptRecord.id}</title>
                                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
                                    <style>
                                      body { font-family: 'Inter', sans-serif; color: #0f172a; padding: 40px; margin: 0; background: white; }
                                      .receipt-box { border: 4px solid #065f46; border-radius: 24px; padding: 30px; max-width: 500px; margin: 0 auto; position: relative; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
                                      .header { text-align: center; border-b: 2px solid rgba(6, 95, 70, 0.2); padding-bottom: 20px; margin-bottom: 20px; }
                                      .logo { width: 44px; height: 44px; background: #065f46; color: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; margin: 0 auto 10px; }
                                      .title { font-size: 16px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #065f46; margin: 0; }
                                      .subtitle { font-size: 12px; color: #64748b; margin: 5px 0 0; }
                                      .detail-grid { background: #f0fdf4; border: 1px solid #d1fae5; border-radius: 16px; padding: 15px; margin-bottom: 20px; font-size: 13px; }
                                      .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #a7f3d0; }
                                      .detail-row:last-child { border-bottom: none; }
                                      .amount-banner { background: #065f46; color: white; padding: 10px 15px; border-radius: 12px; display: flex; justify-content: space-between; font-weight: bold; margin-top: 15px; }
                                      .amount-val { color: #fde047; }
                                      .prayers { text-align: center; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 15px 0; margin: 20px 0; font-size: 12px; color: #475569; }
                                      .stamp-row { display: flex; justify-content: space-between; align-items: flex-end; font-size: 10px; color: #94a3b8; }
                                      @media print {
                                        body { padding: 0; }
                                        .receipt-box { box-shadow: none; border-color: #065f46 !important; }
                                      }
                                    </style>
                                  </head>
                                  <body>
                                    <div class="receipt-box">
                                      <div class="header">
                                        <div class="logo">ح</div>
                                        <div class="title">Halqa-e-Usmania Trust</div>
                                        <div class="subtitle">Official Donation Contribution Receipt</div>
                                      </div>
                                      <div class="detail-grid">
                                        <div class="detail-row"><span>Receipt ID:</span><strong>HU-REC-${selectedReceiptRecord.id.replace('don-', '')}</strong></div>
                                        <div class="detail-row"><span>Date:</span><strong>${selectedReceiptRecord.date}</strong></div>
                                        <div class="detail-row"><span>Donor Name:</span><strong>${selectedReceiptRecord.donorName}</strong></div>
                                        <div class="detail-row"><span>Donor Contact:</span><strong>${selectedReceiptRecord.donorMobile}</strong></div>
                                        <div class="detail-row"><span>Payment Method:</span><strong style="text-transform: uppercase;">${selectedReceiptRecord.paymentMethod.replace('_', ' ')}</strong></div>
                                        <div class="detail-row"><span>Reference Ref:</span><strong>${selectedReceiptRecord.referenceNumber}</strong></div>
                                        <div class="amount-banner"><span>Amount:</span><span class="amount-val">${selectedReceiptRecord.amount.toLocaleString()} ${selectedReceiptRecord.currency}</span></div>
                                      </div>
                                      <div class="prayers">
                                        <p style="font-weight: bold; color: #065f46; margin: 0 0 5px;">جَزَاكَ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالْآخِرَةِ</p>
                                        <p style="margin: 0;">May Almighty Allah accept your noble contribution and grant your family infinite blessings.</p>
                                      </div>
                                      <div class="stamp-row">
                                        <div>DIGITALLY VERIFIED<br>HU-VERIFIED-SECURE</div>
                                        <div style="text-align: right;">OFFICIAL STAMP<br>HALQA-E-USMANIA</div>
                                      </div>
                                    </div>
                                  </body>
                                </html>
                              `;
                              doc.open();
                              doc.write(html);
                              doc.close();
                              
                              setTimeout(() => {
                                iframe.contentWindow?.print();
                                setTimeout(() => {
                                  document.body.removeChild(iframe);
                                }, 5000);
                              }, 1000);
                            }
                          } catch (err) {
                            console.error('Print error', err);
                            window.print();
                          }
                        }}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-all"
                      >
                        <Smartphone size={13} />
                        <span>{isUr ? 'پرنٹ' : 'Print'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedReceiptRecord(null)}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-xs transition-all"
                      >
                        {isUr ? 'بند' : 'Close'}
                      </button>
                    </div>

                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== SECURE DONATION FORM SCREEN ==================== */}
          {activeScreen === 'donate-form' && selectedInitiative && (
            <motion.div 
              key="donate-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 space-y-4 text-left"
            >
              <div className="flex items-center gap-2">
                <button 
                  type="button"
                  onClick={() => {
                    setActiveScreen('donations');
                  }}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-xs text-slate-700 dark:text-slate-200">
                  {isUr ? 'رقم جمع کروائیں' : 'Submit Donation'}
                </h3>
              </div>

              {donationSuccess ? (
                /* Success view (Capacitor Secure Verification Simulation) */
                <div className="bg-emerald-950/5 border border-emerald-500/30 rounded-2xl p-6 text-center my-6 space-y-4">
                  <div className="w-12 h-12 bg-emerald-800 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto shadow-md">
                    ✓
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">
                      {isUr ? 'عطیہ کی درخواست موصول ہو گئی!' : 'Donation Record Submitted!'}
                    </h4>
                    <p className="text-[10px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                      {isUr 
                        ? 'جزاک اللہ خیرا! آپ کے عطیہ کی معلومات (ریفرنس: ' + donationForm.referenceNumber + ') محفوظ کر لی گئی ہیں۔ ہمارے ناظمین بنک یا والٹ اکاؤنٹ سے تصدیق کے فوراً بعد اس مہم کا بیلنس اپڈیٹ کر دیں گے۔'
                        : 'JazakAllah! Your contribution details (Ref: ' + donationForm.referenceNumber + ') have been recorded. Our administrators will verify the bank/wallet receipt and approve the amount shortly.'}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-3.5 rounded-xl text-[10px] space-y-1 shadow-sm font-mono" dir="ltr">
                    <div className="flex justify-between"><span className="text-slate-400">Campaign:</span> <span className="font-bold truncate max-w-[160px]">{selectedInitiative.title}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Donor:</span> <span className="font-bold">{currentUser.name}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Amount:</span> <span className="font-bold text-emerald-600">{(Number(donationForm.amount) || 0).toLocaleString()} {donationForm.currency}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Method:</span> <span className="font-bold uppercase">{donationForm.paymentMethod.replace('_', ' ')}</span></div>
                    <div className="flex justify-between"><span className="text-slate-400">Status:</span> <span className="text-amber-500 font-bold uppercase">Pending Verification</span></div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      type="button"
                      onClick={() => {
                        setDonationsTab('receipts');
                        setActiveScreen('donations');
                      }}
                      className="w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-sm"
                    >
                      {isUr ? 'میری رسیدیں اور اسٹیٹس دیکھیں' : 'View My Receipts & Status'}
                    </button>

                    <button 
                      type="button"
                      onClick={() => {
                        setDonationsTab('campaigns');
                        setActiveScreen('donations');
                      }}
                      className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold py-2 rounded-xl transition-all"
                    >
                      {isUr ? 'مہمات پر واپس جائیں' : 'Return to Campaigns'}
                    </button>
                  </div>
                </div>
              ) : (
                /* Form view */
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSubmitDonation(
                      currentUser.name,
                      currentUser.email,
                      currentUser.mobile,
                      donationForm.amount,
                      donationForm.currency,
                      donationForm.paymentMethod,
                      donationForm.referenceNumber,
                      selectedInitiative.id,
                      donationForm.notes
                    );
                    setDonationSuccess(true);
                  }}
                  className="space-y-4"
                >
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60 flex gap-2.5 items-center">
                    <div className="p-1.5 bg-emerald-50 dark:bg-emerald-950 rounded-lg text-emerald-600">
                      <HeartHandshake size={15} />
                    </div>
                    <div>
                      <span className="text-[8px] uppercase font-bold text-slate-400">{isUr ? 'منتخب مہم' : 'Campaign Selected'}</span>
                      <h4 className="font-bold text-[11px] text-slate-800 dark:text-white leading-tight">
                        {isUr ? selectedInitiative.titleUrdu : selectedInitiative.title}
                      </h4>
                    </div>
                  </div>

                  {/* Donor details prefill info */}
                  <div className="grid grid-cols-2 gap-2 text-[9px] bg-slate-100/50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/40">
                    <div>
                      <span className="text-slate-400 block">{isUr ? 'مددگار کا نام:' : 'Donor Name:'}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{isUr ? 'موبائل نمبر:' : 'Contact:'}</span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser.mobile}</span>
                    </div>
                  </div>

                  {/* Amount and Currency */}
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-400 block">{isUr ? 'رقم اور کرنسی' : 'Amount & Currency'}</label>
                    <div className="flex gap-2">
                      <input 
                        type="number" 
                        min="10"
                        required
                        value={donationForm.amount}
                        onChange={(e) => setDonationForm({ ...donationForm, amount: parseInt(e.target.value) || 0 })}
                        className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-bold"
                      />
                      <select 
                        value={donationForm.currency}
                        onChange={(e) => setDonationForm({ ...donationForm, currency: e.target.value as 'PKR' | 'USD' })}
                        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 text-xs font-bold text-slate-700 dark:text-slate-300"
                      >
                        <option value="PKR">PKR (₨)</option>
                        <option value="USD">USD ($)</option>
                      </select>
                    </div>

                    {/* Quick presets */}
                    <div className="flex gap-1.5 flex-wrap pt-1" dir="ltr">
                      {donationForm.currency === 'PKR' ? (
                        [1000, 5000, 10000, 25000].map(val => (
                          <button 
                            type="button"
                            key={val}
                            onClick={() => setDonationForm({ ...donationForm, amount: val })}
                            className={`text-[9px] px-2.5 py-1 rounded-lg border font-bold ${donationForm.amount === val ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}
                          >
                            ₨ {val.toLocaleString()}
                          </button>
                        ))
                      ) : (
                        [25, 50, 100, 250].map(val => (
                          <button 
                            type="button"
                            key={val}
                            onClick={() => setDonationForm({ ...donationForm, amount: val })}
                            className={`text-[9px] px-2.5 py-1 rounded-lg border font-bold ${donationForm.amount === val ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'}`}
                          >
                            $ {val}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isUr ? 'ادائیگی کا طریقہ' : 'Select Deposit Wallet / Bank'}</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        type="button"
                        onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'easy_paisa' })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${donationForm.paymentMethod === 'easy_paisa' ? 'bg-emerald-900/10 border-emerald-600 text-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                      >
                        <span className="font-bold text-xs text-green-600 dark:text-green-400">EasyPaisa</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 font-mono">0333-9998822</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'jazz_cash' })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${donationForm.paymentMethod === 'jazz_cash' ? 'bg-emerald-900/10 border-emerald-600 text-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                      >
                        <span className="font-bold text-xs text-red-500">JazzCash</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 font-mono">0333-9998822</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'bank_transfer' })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${donationForm.paymentMethod === 'bank_transfer' ? 'bg-emerald-900/10 border-emerald-600 text-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                      >
                        <span className="font-bold text-xs text-amber-600">HBL Bank</span>
                        <span className="text-[8px] text-slate-400 mt-0.5 font-mono">1290-881273-01</span>
                      </button>

                      <button 
                        type="button"
                        onClick={() => setDonationForm({ ...donationForm, paymentMethod: 'credit_card' })}
                        className={`p-2 rounded-xl border flex flex-col items-center justify-center text-center ${donationForm.paymentMethod === 'credit_card' ? 'bg-emerald-900/10 border-emerald-600 text-slate-800 dark:text-white' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500'}`}
                      >
                        <span className="font-bold text-xs text-blue-500">Credit Card</span>
                        <span className="text-[8px] text-slate-400 mt-0.5">Secure Gateway</span>
                      </button>
                    </div>
                  </div>

                  {/* Transaction reference number */}
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-0.5">
                      {isUr ? 'ٹرانزیکشن ریفرنس / رسید نمبر' : 'Transaction Reference / Receipt ID'}
                    </label>
                    <p className="text-[8px] text-slate-400 leading-normal mb-1.5">
                      {isUr 
                        ? 'برائے مہربانی اوپر دیے گئے نمبر یا بنک اکاؤنٹ میں رقم بھیجنے کے بعد ملنے والا میسج ریفرنس یا رسید نمبر یہاں درج کریں۔'
                        : 'Deposit to the chosen account, then enter the Transaction ID or Bank Slip number here for super admin check.'}
                    </p>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. EP-220912 or REF-9921201"
                      value={donationForm.referenceNumber}
                      onChange={(e) => setDonationForm({ ...donationForm, referenceNumber: e.target.value })}
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs font-mono focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Optional Notes */}
                  <div>
                    <label className="text-[10px] uppercase font-black text-slate-400 block mb-1">{isUr ? 'خصوصی دعا / پیغام (اختیاری)' : 'Prayer / Message (Optional)'}</label>
                    <textarea 
                      rows={2}
                      value={donationForm.notes}
                      onChange={(e) => setDonationForm({ ...donationForm, notes: e.target.value })}
                      placeholder="Add any specific instruction or prayer request..."
                      className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <span>🛡️ {isUr ? 'محفوظ معلومات جمع کریں' : 'Submit Contribution Details'}</span>
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {/* ==================== 17. INFORMATION CENTER LIST SCREEN ==================== */}
          {activeScreen === 'info-center' && (
            <motion.div
              key="info-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4 text-left min-h-[80vh]"
            >
              {/* Top Navigation Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <button
                  onClick={() => setActiveScreen('more')}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors flex items-center gap-1 text-xs font-bold"
                >
                  <ArrowLeft size={18} />
                  <span>{isUr ? 'واپس' : 'Back'}</span>
                </button>
                <div className="text-center">
                  <h3 className="font-serif font-bold text-sm sm:text-base text-emerald-700 dark:text-emerald-400">
                    {isUr ? 'معلومات سینٹر' : 'Information Center'}
                  </h3>
                  <p className="text-[9px] text-slate-400">{isUr ? 'سرکاری معلومات اور رہنمائی' : 'Official Guidelines & Information'}</p>
                </div>
                <div className="w-12"></div>
              </div>

              {/* Pages Grid / List */}
              {infoPages.filter(p => p.status === 'published').length === 0 ? (
                <div className="text-center py-12 space-y-2 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                  <Globe className="mx-auto text-slate-300 dark:text-slate-700" size={40} />
                  <p className="text-xs text-slate-400 font-bold">
                    {isUr ? 'کوئی معلوماتی صفحہ دستیاب نہیں ہے' : 'No information pages available at the moment'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {infoPages
                    .filter(p => p.status === 'published')
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((page) => (
                      <div
                        key={page.id}
                        onClick={() => {
                          setSelectedInfoPage(page);
                          setActiveScreen('info-page-detail');
                        }}
                        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-500/40 transition-all cursor-pointer group flex flex-col justify-between"
                      >
                        <div>
                          {page.featuredImage ? (
                            <div className="h-32 w-full overflow-hidden relative bg-slate-950 flex items-center justify-center">
                              {page.featuredImage && (
                                <img src={page.featuredImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                              )}
                              <img
                                src={page.featuredImage || undefined}
                                alt={page.title}
                                className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                              />
                            </div>
                          ) : page.bannerImage ? (
                            <div className="h-32 w-full overflow-hidden relative bg-slate-950 flex items-center justify-center">
                              {page.bannerImage && (
                                <img src={page.bannerImage} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                              )}
                              <img
                                src={page.bannerImage || undefined}
                                alt={page.title}
                                className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                              />
                            </div>
                          ) : null}

                          <div className="p-3.5 space-y-2">
                            <div className="flex justify-between items-start gap-2">
                              <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {isUr ? (page.titleUrdu || page.title) : page.title}
                              </h4>
                            </div>

                            <p className="text-[10.5px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {isUr ? (page.shortDescriptionUrdu || page.shortDescription) : page.shortDescription}
                            </p>
                          </div>
                        </div>

                        <div className="px-3.5 pb-3.5 pt-1 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between text-[9px] text-slate-400">
                          <span className="font-mono">
                            {isUr ? 'آخری ترمیم:' : 'Updated:'} {page.updatedDate || page.createdDate}
                          </span>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                            {isUr ? 'صفحہ دیکھیں' : 'Read Page'} <ChevronRight size={12} />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== 18. INFORMATION PAGE FULL DETAIL SCREEN ==================== */}
          {activeScreen === 'info-page-detail' && selectedInfoPage && (
            <motion.div
              key="info-page-detail"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 15 }}
              className="p-0 space-y-0 text-left min-h-[90vh] bg-white dark:bg-slate-950 pb-12"
            >
              {/* Sticky Top Bar with Share & Back Button */}
              <div className="sticky top-0 z-40 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between shadow-xs">
                <button
                  onClick={() => setActiveScreen('info-center')}
                  className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5 text-xs font-bold"
                >
                  <ArrowLeft size={18} />
                  <span>{isUr ? 'معلومات سینٹر' : 'Information Center'}</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: selectedInfoPage.title,
                          text: selectedInfoPage.shortDescription,
                          url: window.location.href
                        }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(`${selectedInfoPage.title}\n${selectedInfoPage.shortDescription}\n${window.location.href}`);
                        setCopiedId(selectedInfoPage.id);
                        setTimeout(() => setCopiedId(null), 2000);
                      }
                    }}
                    className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-all flex items-center gap-1.5 text-xs font-bold"
                    title="Share Page"
                  >
                    <Share2 size={16} />
                    <span className="hidden sm:inline">{copiedId === selectedInfoPage.id ? (isUr ? 'کاپی ہوگیا!' : 'Copied!') : (isUr ? 'شیئر کریں' : 'Share')}</span>
                  </button>
                </div>
              </div>

              {/* Full Screen Header Banner Image */}
              {selectedInfoPage.bannerImage || selectedInfoPage.featuredImage ? (
                <div className="w-full h-48 sm:h-64 relative bg-slate-950 overflow-hidden flex items-center justify-center">
                  {(selectedInfoPage.bannerImage || selectedInfoPage.featuredImage) && (
                    <img
                      src={selectedInfoPage.bannerImage || selectedInfoPage.featuredImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 pointer-events-none"
                    />
                  )}
                  <img
                    src={selectedInfoPage.bannerImage || selectedInfoPage.featuredImage || undefined}
                    alt={selectedInfoPage.title}
                    className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
                    <span className="bg-amber-400 text-slate-950 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md font-mono">
                      Official Page
                    </span>
                    <h1 className="font-serif font-black text-lg sm:text-2xl text-white leading-tight drop-shadow-md">
                      {isUr ? (selectedInfoPage.titleUrdu || selectedInfoPage.title) : selectedInfoPage.title}
                    </h1>
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-emerald-950 to-slate-950 text-white p-6 sm:p-8 space-y-2">
                  <span className="bg-amber-400 text-slate-950 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md font-mono">
                    Official Page
                  </span>
                  <h1 className="font-serif font-black text-xl sm:text-2xl text-white leading-tight">
                    {isUr ? (selectedInfoPage.titleUrdu || selectedInfoPage.title) : selectedInfoPage.title}
                  </h1>
                </div>
              )}

              {/* Page Meta Info & Last Updated Date */}
              <div className="p-4 sm:p-6 space-y-5 max-w-3xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-[10px] text-slate-600 dark:text-slate-300">
                      📅 {isUr ? 'آخری تجدید:' : 'Last Updated:'} {selectedInfoPage.updatedDate || selectedInfoPage.createdDate}
                    </span>
                  </div>
                </div>

                {/* Short Description */}
                {selectedInfoPage.shortDescription && (
                  <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border-l-4 border-emerald-600 p-3.5 rounded-r-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic">
                    {isUr ? (selectedInfoPage.shortDescriptionUrdu || selectedInfoPage.shortDescription) : selectedInfoPage.shortDescription}
                  </div>
                )}

                {/* Rich Formatted HTML Content */}
                <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-3 text-slate-800 dark:text-slate-200">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: isUr ? (selectedInfoPage.contentUrdu || selectedInfoPage.content) : selectedInfoPage.content
                    }}
                  />
                </div>

                {/* Optional Embedded YouTube Video */}
                {selectedInfoPage.youtubeUrl && (
                  <div className="space-y-2 pt-4">
                    <h4 className="font-serif font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <Video size={14} className="text-red-500" />
                      {isUr ? 'ویدیو رہنمائی' : 'Video Explanation'}
                    </h4>
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 shadow-md">
                      <iframe
                        src={selectedInfoPage.youtubeUrl ? selectedInfoPage.youtubeUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/') : undefined}
                        title={selectedInfoPage.title}
                        className="w-full h-full border-0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* External Links */}
                {selectedInfoPage.externalLinks && selectedInfoPage.externalLinks.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="font-serif font-bold text-xs uppercase text-slate-400 tracking-wider flex items-center gap-1">
                      <ExternalLink size={14} className="text-emerald-500" />
                      {isUr ? 'متعلقہ لنکس اور ویب سائٹس' : 'Related Resources & External Links'}
                    </h4>
                    <div className="grid grid-cols-1 gap-2">
                      {selectedInfoPage.externalLinks.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-between hover:border-emerald-500 transition-all text-xs font-bold text-emerald-700 dark:text-emerald-400 group"
                        >
                          <span>{link.title}</span>
                          <ExternalLink size={14} className="group-hover:translate-x-1 transition-transform" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bottom Back Button */}
                <div className="pt-8 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setActiveScreen('info-center')}
                    className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={16} />
                    <span>{isUr ? 'معلومات سینٹر میں واپس جائیں' : 'Back to Information Center'}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 19. ISLAMIC UTILITIES SUITE SCREEN ==================== */}
          {activeScreen === 'islamic-utilities' && (
            <motion.div
              key="islamic-utilities-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="p-3 sm:p-5 space-y-4"
            >
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setActiveScreen('home')}
                  className="p-1 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-slate-200"
                >
                  <ArrowLeft size={16} />
                </button>
                <h3 className="font-serif font-bold text-base text-emerald-700 dark:text-emerald-400">
                  {isUr ? 'اسلامی ٹولز اور اوقاتِ نماز' : 'Islamic Utilities & Prayer Times'}
                </h3>
              </div>
              <IslamicUtilities language={userSettings.language} />
            </motion.div>
          )}

          {/* ==================== 20. EXCLUSIVE CONTENT LIBRARY (MAKHZAN-E-KHAS) SCREEN ==================== */}
          {activeScreen === 'makhzan' && (
            <motion.div
              key="makhzan-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3 sm:p-4 space-y-4"
            >
              <MakhzanEKhas
                categories={makhzanCategories}
                posts={makhzanPosts}
                activeAppUser={activeAppUser}
                branches={branches}
                bookmarks={bookmarks.posts}
                onToggleBookmark={(postId) => onUpdateBookmarks('posts', postId)}
                onOpenAuthModal={() => setActiveScreen('user-account')}
              />
            </motion.div>
          )}

          {/* ==================== 21. SPIRITUAL PERSONALITIES FEED SCREEN ==================== */}
          {activeScreen === 'spiritual-personalities' && (
            <motion.div
              key="spiritual-personalities-feed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3 sm:p-4 space-y-4 text-left"
            >
              {/* Screen Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <div>
                  <h3 className="font-serif font-bold text-lg text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <UserCheck size={20} />
                    {isUr ? 'بزرگانِ سلسلہ' : 'Spiritual Personalities'}
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {isUr ? 'سلسلہ عالیہ کے مشائخ و اکابرین کی سوانح حیات و مبارک احوال' : 'Biographies and spiritual legacies of holy personalities'}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-300 dark:border-emerald-800">
                  {activeSpiritualPersonalities.length} {isUr ? 'شخصیات' : 'Entries'}
                </span>
              </div>

              {/* Feed List */}
              <div className="space-y-3">
                {activeSpiritualPersonalities.length === 0 ? (
                  <div className="text-center py-12 text-xs text-slate-400 font-serif">
                    {isUr ? 'فی الحال کوئی شخصیات دستیاب نہیں ہیں۔' : 'No spiritual personalities available at the moment.'}
                  </div>
                ) : (
                  activeSpiritualPersonalities.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedPersonality(item);
                        setActivePersonalityImageIndex(0);
                        setActiveScreen('personality-detail');
                      }}
                      className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800/80 shadow-sm hover:shadow-md transition-all flex gap-3 p-3 cursor-pointer group hover:border-emerald-500/40"
                    >
                      <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden flex-shrink-0 bg-slate-950 border border-slate-800 relative flex items-center justify-center">
                        {item.images?.[0] && (
                          <img src={item.images[0]} className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none" alt="" />
                        )}
                        <img
                          src={item.images?.[0] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'}
                          className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                          alt={item.name}
                        />
                        {item.images && item.images.length > 1 && (
                          <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                            📷 {item.images.length}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="font-bold font-serif text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors leading-tight text-right w-full">
                              {item.name}
                            </h4>
                          </div>
                          {item.title && (
                            <span className="inline-block mt-1 text-[10px] font-serif text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md font-semibold">
                              {item.title}
                            </span>
                          )}
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed font-serif text-right">
                            {item.bio}
                          </p>
                        </div>

                        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-2 border-t border-slate-50 dark:border-slate-800/60 pt-1.5">
                          <div className="flex gap-2 font-mono text-[9px]">
                            {item.audioUrl && <span className="text-amber-500">🎵 Audio</span>}
                            {item.videoUrl && <span className="text-red-500">🎬 Video</span>}
                            {item.pdfUrl && <span className="text-blue-500">📄 PDF</span>}
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5 group-hover:translate-x-1 transition-transform">
                            {isUr ? 'تفصیل دیکھیں' : 'View Detail'} →
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* ==================== 22. SPIRITUAL PERSONALITY DETAIL VIEW SCREEN ==================== */}
          {activeScreen === 'personality-detail' && selectedPersonality && (
            <motion.div
              key="personality-detail-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="p-3 sm:p-4 space-y-4 text-left"
            >
              {/* Back Button Header */}
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  onClick={() => setActiveScreen('spiritual-personalities')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl hover:bg-slate-200 text-xs font-bold transition-all"
                >
                  <ArrowLeft size={16} />
                  <span>{isUr ? 'واپس فہرست' : 'Back to Personalities'}</span>
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleCopy(window.location.href, selectedPersonality.id)}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500"
                    title="Share"
                  >
                    {copiedId === selectedPersonality.id ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                  </button>
                </div>
              </div>

              {/* Title & Honorific */}
              <div className="space-y-1 text-right">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-900 dark:text-white leading-snug">
                  {selectedPersonality.name}
                </h2>
                {selectedPersonality.title && (
                  <span className="inline-block bg-emerald-800 text-amber-300 text-xs font-serif font-bold px-3 py-1 rounded-full shadow-sm">
                    {selectedPersonality.title}
                  </span>
                )}
              </div>

              {/* Gallery / Images */}
              {selectedPersonality.images && selectedPersonality.images.length > 0 && (
                <div className="space-y-2">
                  <div className="h-56 sm:h-72 rounded-2xl overflow-hidden shadow-md relative bg-slate-950 group border border-slate-800 flex items-center justify-center">
                    {(selectedPersonality.images[activePersonalityImageIndex] || selectedPersonality.images[0]) && (
                      <img
                        src={selectedPersonality.images[activePersonalityImageIndex] || selectedPersonality.images[0]}
                        className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 pointer-events-none"
                        alt=""
                      />
                    )}
                    <img
                      src={selectedPersonality.images[activePersonalityImageIndex] || selectedPersonality.images[0]}
                      className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                      alt={selectedPersonality.name}
                    />
                    {selectedPersonality.images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            setActivePersonalityImageIndex((prev) =>
                              prev === 0 ? selectedPersonality.images.length - 1 : prev - 1
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                        >
                          <ChevronLeft size={20} />
                        </button>
                        <button
                          onClick={() =>
                            setActivePersonalityImageIndex((prev) =>
                              prev === selectedPersonality.images.length - 1 ? 0 : prev + 1
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full transition-all"
                        >
                          <ChevronRight size={20} />
                        </button>
                        <div className="absolute bottom-2 right-2 bg-black/75 text-white text-[10px] font-bold px-2.5 py-1 rounded-full font-mono">
                          {activePersonalityImageIndex + 1} / {selectedPersonality.images.length}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Thumbnails */}
                  {selectedPersonality.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {selectedPersonality.images.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActivePersonalityImageIndex(idx)}
                          className={`w-14 h-14 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                            activePersonalityImageIndex === idx
                              ? 'border-emerald-500 scale-105 shadow-md'
                              : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} className="w-full h-full object-cover" alt="" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Bio Section */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
                <h3 className="font-bold text-xs text-emerald-700 dark:text-emerald-400 uppercase tracking-wider font-serif border-b border-slate-100 dark:border-slate-800 pb-2 text-right">
                  {isUr ? 'سوانح حیات و مبارک احوال' : 'Biography & Spiritual History'}
                </h3>
                <div className={`${fontSizeClass} text-slate-800 dark:text-slate-200 font-serif leading-relaxed whitespace-pre-line text-right`}>
                  {selectedPersonality.bio}
                </div>
              </div>

              {/* Media Buttons */}
              {(selectedPersonality.audioUrl || selectedPersonality.videoUrl || selectedPersonality.pdfUrl) && (
                <div className="space-y-2.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <h4 className="font-bold text-xs text-slate-700 dark:text-slate-300 font-serif text-right">
                    {isUr ? 'وابستہ صوتی و بصری مواد' : 'Associated Spiritual Media'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {selectedPersonality.audioUrl && (
                      <button
                        onClick={() => {
                          const a: AudioItem = {
                            id: `sp-audio-${selectedPersonality.id}`,
                            title: selectedPersonality.name,
                            titleUrdu: selectedPersonality.name,
                            artist: selectedPersonality.title || 'سلسلہ عالیہ',
                            artistUrdu: selectedPersonality.title || 'سلسلہ عالیہ',
                            category: 'bayan',
                            audioUrl: selectedPersonality.audioUrl!,
                            duration: '15:00',
                            size: 'Audio',
                            publishDate: new Date().toISOString().split('T')[0]
                          };
                          handlePlayAudio(a);
                        }}
                        className="bg-emerald-800 hover:bg-emerald-700 text-white p-2.5 rounded-xl flex items-center justify-between shadow-sm transition-all text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <Music size={16} className="text-amber-300" />
                          <span>{isUr ? 'ملفوظات صوتی' : 'Listen Audio'}</span>
                        </div>
                        <Play size={14} className="fill-white" />
                      </button>
                    )}

                    {selectedPersonality.videoUrl && (
                      <a
                        href={selectedPersonality.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-red-800 hover:bg-red-700 text-white p-2.5 rounded-xl flex items-center justify-between shadow-sm transition-all text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <Video size={16} className="text-white" />
                          <span>{isUr ? 'بیانات ویڈیو' : 'Watch Video'}</span>
                        </div>
                        <ExternalLink size={14} />
                      </a>
                    )}

                    {selectedPersonality.pdfUrl && (
                      <button
                        onClick={() => {
                          const pdf: PDFBook = {
                            id: `sp-pdf-${selectedPersonality.id}`,
                            title: selectedPersonality.name,
                            titleUrdu: selectedPersonality.name,
                            author: selectedPersonality.title || 'سلسلہ عالیہ',
                            authorUrdu: selectedPersonality.title || 'سلسلہ عالیہ',
                            coverImage: selectedPersonality.images?.[0] || '',
                            pdfUrl: selectedPersonality.pdfUrl!,
                            size: 'PDF',
                            pages: 50,
                            description: selectedPersonality.name,
                            descriptionUrdu: selectedPersonality.name,
                            views: 0,
                            downloadsCount: 0
                          };
                          setSelectedPdf(pdf);
                          setActiveScreen('pdf-reader');
                        }}
                        className="bg-blue-800 hover:bg-blue-700 text-white p-2.5 rounded-xl flex items-center justify-between shadow-sm transition-all text-xs font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-blue-200" />
                          <span>{isUr ? 'رسالہ / کتاب' : 'Read PDF'}</span>
                        </div>
                        <BookOpen size={14} />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
        </div>
      </div>

      {/* ==================== BOTTOM SYSTEM NAVIGATION BAR ==================== */}
      {activeScreen !== 'splash' && activeScreen !== 'pdf-reader' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 text-white safe-bottom shadow-2xl select-none">
          <div className="max-w-3xl lg:max-w-4xl mx-auto w-full h-14 sm:h-16 flex justify-around items-center px-1 sm:px-4">
            
            {/* Home */}
            <button 
              onClick={() => setActiveScreen('home')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${activeScreen === 'home' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {activeScreen === 'home' && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <Home size={18} className="sm:w-5 sm:h-5" />
              <span className="mt-0.5 truncate">{localT.home}</span>
            </button>

            {/* Categories */}
            <button 
              onClick={() => setActiveScreen('categories')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${activeScreen === 'categories' || activeScreen === 'category-posts' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {(activeScreen === 'categories' || activeScreen === 'category-posts') && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <Folder size={18} className="sm:w-5 sm:h-5" />
              <span className="mt-0.5 truncate">{localT.categories}</span>
            </button>

            {/* Spiritual Personalities (بزرگانِ سلسلہ) */}
            <button 
              onClick={() => setActiveScreen('spiritual-personalities')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${activeScreen === 'spiritual-personalities' || activeScreen === 'personality-detail' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {(activeScreen === 'spiritual-personalities' || activeScreen === 'personality-detail') && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <UserCheck size={18} className={activeScreen === 'spiritual-personalities' || activeScreen === 'personality-detail' ? 'text-amber-400' : 'text-emerald-400'} />
              <span className="mt-0.5 truncate">{isUr ? 'بزرگان' : 'Personalities'}</span>
            </button>

            {/* Islamic Utilities (Namaz, Calendar, Qibla) */}
            <button 
              onClick={() => setActiveScreen('islamic-utilities')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${activeScreen === 'islamic-utilities' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {activeScreen === 'islamic-utilities' && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <Compass size={18} className={activeScreen === 'islamic-utilities' ? 'text-amber-400' : 'text-emerald-400'} />
              <span className="mt-0.5 truncate">{isUr ? 'اوقات' : 'Utilities'}</span>
            </button>

            {/* Media & Books */}
            <button 
              onClick={() => setActiveScreen('media')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${activeScreen === 'media' || activeScreen === 'pdfs' ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {(activeScreen === 'media' || activeScreen === 'pdfs') && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <BookOpen size={18} className="sm:w-5 sm:h-5" />
              <span className="mt-0.5 truncate">{localT.media}</span>
            </button>

            {/* More / Profile */}
            <button 
              onClick={() => setActiveScreen('more')}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[8px] xs:text-[9px] sm:text-[10px] font-bold transition-all relative ${['more', 'profile', 'feedback', 'contact', 'bookmarks', 'downloads', 'settings', 'donations', 'donate-form', 'info-center', 'info-page-detail'].includes(activeScreen) ? 'text-amber-400 scale-105' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {['more', 'profile', 'feedback', 'contact', 'bookmarks', 'downloads', 'settings', 'donations', 'donate-form', 'info-center', 'info-page-detail'].includes(activeScreen) && (
                <span className="absolute top-0 w-6 sm:w-8 h-0.5 bg-amber-400 rounded-full"></span>
              )}
              <Plus size={20} />
              <span className="mt-0.5">{localT.more}</span>
            </button>

          </div>
        </div>
      )}

      {/* ==================== GLOBAL FLOATING AUDIO PLAYER FOOTER ==================== */}
      {currentAudio && activeScreen !== 'splash' && (
        <div className="fixed bottom-14 sm:bottom-16 left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none">
          <div className="max-w-3xl lg:max-w-4xl mx-auto w-full pointer-events-auto">
            <AnimatePresence>
              <motion.div 
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 80, opacity: 0 }}
                className="bg-emerald-950/95 border border-amber-500/50 backdrop-blur-md text-white flex items-center justify-between px-3 sm:px-4 py-2 rounded-2xl shadow-2xl"
              >
                {/* Play/Pause Button */}
                <button 
                  onClick={() => setAudioPlaying(!audioPlaying)}
                  className="w-8 h-8 rounded-full bg-amber-500 text-slate-900 flex items-center justify-center shrink-0 shadow-md hover:scale-105 transition-transform"
                >
                  {audioPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                </button>

                {/* Song details */}
                <div className="flex-1 px-3 text-left min-w-0" dir={isUr ? 'rtl' : 'ltr'}>
                  <h5 className="text-[10px] sm:text-xs font-bold text-white truncate leading-tight">
                    {isUr ? currentAudio.titleUrdu : currentAudio.title}
                  </h5>
                  <p className="text-[8px] sm:text-[9px] text-slate-300 truncate">
                    👤 {isUr ? currentAudio.artistUrdu : currentAudio.artist} | {audioElapsedStr} / {currentAudio.duration}
                  </p>
                  
                  {/* Seek progress slider */}
                  <div className="w-full bg-white/20 h-1 rounded-full mt-1 overflow-hidden relative">
                    <div style={{ width: `${audioProgress}%` }} className="bg-amber-400 h-full"></div>
                  </div>
                </div>

                {/* Close player */}
                <button 
                  onClick={() => {
                    setAudioPlaying(false);
                    setCurrentAudio(null);
                  }}
                  className="p-1.5 hover:bg-white/15 rounded-lg text-slate-400 hover:text-white shrink-0 transition-colors"
                >
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* ==================== GLOBAL FLOATING DOWNLOAD PROGRESS BAR ==================== */}
      {(Object.values(downloadProgressMap) as DownloadProgressItem[]).some(item => item.status === 'downloading') && activeScreen !== 'downloads' && (
        <div className={`fixed ${currentAudio ? 'bottom-28 sm:bottom-32' : 'bottom-16 sm:bottom-20'} left-0 right-0 z-40 px-3 sm:px-4 pointer-events-none`}>
          <div className="max-w-3xl lg:max-w-4xl mx-auto w-full pointer-events-auto">
            <AnimatePresence>
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                onClick={() => setActiveScreen('downloads')}
                className="bg-slate-900/95 border border-emerald-500/50 backdrop-blur-md text-white p-2.5 rounded-xl shadow-xl flex items-center justify-between gap-3 cursor-pointer hover:border-emerald-400 transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Loader2 size={16} className="animate-spin text-emerald-400 shrink-0" />
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex justify-between items-center text-[10px] font-bold text-emerald-300">
                      <span className="truncate">
                        {isUr ? 'ڈاؤن لوڈ جاری ہے...' : 'Downloading Files Offline...'}
                      </span>
                      <span className="font-mono">
                        {Math.round(
                          (Object.values(downloadProgressMap) as DownloadProgressItem[])
                            .filter(i => i.status === 'downloading')
                            .reduce((acc, curr) => acc + curr.progress, 0) /
                          ((Object.values(downloadProgressMap) as DownloadProgressItem[]).filter(i => i.status === 'downloading').length || 1)
                        )}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.round(
                            (Object.values(downloadProgressMap) as DownloadProgressItem[])
                              .filter(i => i.status === 'downloading')
                              .reduce((acc, curr) => acc + curr.progress, 0) /
                            ((Object.values(downloadProgressMap) as DownloadProgressItem[]).filter(i => i.status === 'downloading').length || 1)
                          )}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-800 hover:bg-emerald-700 text-white text-[9px] font-bold px-2 py-1 rounded-md shrink-0">
                  {isUr ? 'دیکھیں' : 'View'}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}


      {/* ==================== GLOBAL ADHAN PRAYER ALARM LOCAL NOTIFICATION MODAL ==================== */}
      <AdhanAlarmModal isUr={isUr} />

      {/* ==================== GLOBAL AI VOICE PLAYER BOTTOM FLOATING COMPONENT ==================== */}
      <VoicePlayer 
        isUrdu={isUr} 
        settings={userSettings.voiceReaderSettings}
        onClose={() => voiceReaderEngine.stop()}
      />

    </div>
  );
};

