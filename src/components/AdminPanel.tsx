/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PostSplashScreenItem,
  Post, 
  Category, 
  PDFBook, 
  VideoItem, 
  AudioItem, 
  GalleryAlbum, 
  GalleryImage, 
  FeedbackItem, 
  AppNotification, 
  SliderItem, 
  ContactInfo, 
  SocialLinks,
  DonationInitiative,
  DonationRecord,
  InfoPage,
  InfoPageExternalLink,
  IslamicEvent,
  DuaItem,
  Branch,
  DayDatasetRecord,
  AppUser,
  SpiritualSlip,
  ModSettings,
  UserRole,
  AuditLog,
  SystemBackupData,
  MakhzanCategory,
  MakhzanPost,
  SpiritualPersonality,
  OfflineQueueItem,
  VoiceReaderSettings
} from '../types';
import { DEFAULT_VOICE_SETTINGS } from '../lib/voiceReaderEngine';
import { initialIslamicEvents, initialDuas } from '../data';
import { BranchMasterManager } from './admin/BranchMasterManager';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { GoogleDriveLinkInput } from './GoogleDriveLinkInput';
import { DayDatasetsManager } from './admin/DayDatasetsManager';
import { UserRegistrationManager } from './admin/UserRegistrationManager';
import { MasterSlipsManager } from './admin/MasterSlipsManager';
import { ModSettingsManager } from './admin/ModSettingsManager';
import { AuditLogViewer } from './admin/AuditLogViewer';
import { BackupRestoreManager } from './admin/BackupRestoreManager';
import { MakhzanManager } from './admin/MakhzanManager';
import { SpiritualPersonalitiesManager } from './admin/SpiritualPersonalitiesManager';
import { DailyAdadWeeklyChart } from './admin/DailyAdadWeeklyChart';
import { BranchPerformanceChart } from './admin/BranchPerformanceChart';
import { OfflineQueueManager } from './admin/OfflineQueueManager';
import { ImageCropperModal } from './admin/ImageCropperModal';
import { VoiceReaderSettingsScreen } from '../screens/admin/VoiceReaderSettingsScreen';
import { AdhanSchedulerManager } from './admin/AdhanSchedulerManager';
import { PostSplashManager } from './admin/PostSplashManager';
import { HeroSliderManager } from './admin/HeroSliderManager';
import { WysiwygEditor } from './admin/WysiwygEditor';
import { 
  Plus,
  Tv,
  Trash2, 
  Edit, 
  UserCheck,
  BarChart, 
  FileText, 
  BookOpen, 
  Music, 
  Video, 
  MessageSquare, 
  Bell, 
  Share2, 
  Settings, 
  Users, 
  Check, 
  HeartHandshake,
  Image as ImageIcon,
  Globe,
  Eye,
  EyeOff,
  Link,
  Youtube,
  Compass,
  Volume2,
  Radio,
  Sparkles,
  Menu,
  X,
  Building2,
  Database,
  FileCheck,
  ShieldCheck,
  HardDrive,
  FolderHeart,
  Wifi,
  WifiOff,
  Crop,
  Upload,
  Maximize2,
  RefreshCw,
  ZoomIn
} from 'lucide-react';


interface AdminPanelProps {
  postSplashScreens?: PostSplashScreenItem[];
  onAddPostSplashScreen?: (screen: PostSplashScreenItem) => void;
  onEditPostSplashScreen?: (screen: PostSplashScreenItem) => void;
  onDeletePostSplashScreen?: (id: string) => void;
  onTogglePostSplashScreen?: (screen: PostSplashScreenItem) => void;

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
  donationInitiatives: DonationInitiative[];
  donationRecords: DonationRecord[];
  infoPages: InfoPage[];
  islamicEvents?: IslamicEvent[];
  duas?: DuaItem[];
  voiceReaderSettings?: VoiceReaderSettings;
  onUpdateVoiceReaderSettings?: (settings: VoiceReaderSettings) => void;
  
  // State updaters
  onAddPost: (post: Post) => void;
  onEditPost: (post: Post) => void;
  onDeletePost: (id: string) => void;
  onToggleHidePost?: (post: Post) => void;

  onAddCategory: (category: Category) => void;
  onEditCategory?: (category: Category) => void;
  onDeleteCategory?: (id: string) => void;
  onToggleHideCategory?: (category: Category) => void;

  onAddPdf: (pdf: PDFBook) => void;
  onEditPdf?: (pdf: PDFBook) => void;
  onDeletePdf?: (id: string) => void;
  onToggleHidePdf?: (pdf: PDFBook) => void;

  onAddVideo: (video: VideoItem) => void;
  onEditVideo?: (video: VideoItem) => void;
  onDeleteVideo?: (id: string) => void;
  onToggleHideVideo?: (video: VideoItem) => void;

  onAddAudio: (audio: AudioItem) => void;
  onEditAudio?: (audio: AudioItem) => void;
  onDeleteAudio?: (id: string) => void;
  onToggleHideAudio?: (audio: AudioItem) => void;

  onAddGalleryImage: (img: GalleryImage) => void;
  onEditGalleryImage?: (img: GalleryImage) => void;
  onDeleteGalleryImage?: (id: string) => void;
  onToggleHideGalleryImage?: (img: GalleryImage) => void;

  onAddAlbum?: (album: GalleryAlbum) => void;
  onEditAlbum?: (album: GalleryAlbum) => void;
  onDeleteAlbum?: (id: string) => void;
  onToggleHideAlbum?: (album: GalleryAlbum) => void;

  onReplyFeedback: (feedbackId: string, replyMessage: string) => void;
  onDeleteFeedback?: (id: string) => void;
  onToggleHideFeedback?: (feedback: FeedbackItem) => void;

  onSendNotification: (notification: AppNotification) => void;
  onEditNotification?: (notification: AppNotification) => void;
  onDeleteNotification?: (id: string) => void;
  onToggleHideNotification?: (notification: AppNotification) => void;

  onUpdateContactInfo: (contact: ContactInfo) => void;
  onUpdateSocialLinks: (links: SocialLinks) => void;
  onUpdateSlider: (items: SliderItem[]) => void;
  onAddSliderItem?: (item: SliderItem) => void;
  onEditSliderItem?: (item: SliderItem) => void;
  onDeleteSliderItem?: (id: string) => void;
  onToggleHideSliderItem?: (item: SliderItem) => void;

  onAddDonationInitiative: (initiative: DonationInitiative) => void;
  onEditDonationInitiative: (initiative: DonationInitiative) => void;
  onDeleteDonationInitiative: (id: string) => void;
  onToggleHideDonationInitiative?: (initiative: DonationInitiative) => void;

  onAddDonationRecord?: (record: DonationRecord) => void;
  onEditDonationRecord?: (record: DonationRecord) => void;
  onDeleteDonationRecord?: (id: string) => void;
  onVerifyDonation: (id: string, status: 'verified' | 'rejected') => void;
  onToggleHideDonationRecord?: (record: DonationRecord) => void;

  onAddInfoPage: (page: InfoPage) => void;
  onEditInfoPage: (page: InfoPage) => void;
  onDeleteInfoPage: (id: string) => void;
  onToggleHideInfoPage?: (page: InfoPage) => void;

  onAddIslamicEvent?: (event: IslamicEvent) => void;
  onEditIslamicEvent?: (event: IslamicEvent) => void;
  onDeleteIslamicEvent?: (id: string) => void;
  onToggleHideIslamicEvent?: (event: IslamicEvent) => void;

  onAddDua?: (dua: DuaItem) => void;
  onEditDua?: (dua: DuaItem) => void;
  onDeleteDua?: (id: string) => void;
  onToggleHideDua?: (dua: DuaItem) => void;

  // KhanQah Admin Props
  branches?: Branch[];
  dayDatasets?: DayDatasetRecord[];
  appUsers?: AppUser[];
  slips?: SpiritualSlip[];
  auditLogs?: AuditLog[];
  modSettings?: ModSettings;

  onAddBranch?: (branch: Omit<Branch, 'id' | 'createdAt'>) => void;
  onEditBranch?: (branch: Branch) => void;
  onDeleteBranch?: (id: string) => void;
  onToggleBranchStatus?: (id: string) => void;

  onAddDayRecord?: (rec: Omit<DayDatasetRecord, 'id' | 'createdAt'>) => void;
  onEditDayRecord?: (rec: DayDatasetRecord) => void;
  onDeleteDayRecord?: (id: string) => void;
  onBulkImportDayRecords?: (records: Omit<DayDatasetRecord, 'id' | 'createdAt'>[]) => void;

  onApproveUser?: (userId: string, branchCode: string, role: UserRole) => void;
  onBulkApproveUsers?: (userIds: string[], assignedRole?: UserRole, assignedBranchId?: string) => void;
  onRejectUser?: (userId: string, reason: string) => void;
  onBlockUser?: (userId: string, reason: string) => void;
  onUnblockUser?: (userId: string) => void;
  onCreateUser?: (userData: Omit<AppUser, 'id' | 'createdAt'>) => void;
  onEditUser?: (user: AppUser) => void;
  onDeleteUser?: (userId: string) => void;

  onCancelSlip?: (slipId: string, reason: string) => void;
  onUpdateModSettings?: (settings: ModSettings) => void;
  onRestoreBackup?: (backup: SystemBackupData) => void;

  // Makhzan-e-Khas Props
  makhzanCategories?: MakhzanCategory[];
  makhzanPosts?: MakhzanPost[];
  onAddMakhzanCategory?: (cat: MakhzanCategory) => void;
  onEditMakhzanCategory?: (cat: MakhzanCategory) => void;
  onDeleteMakhzanCategory?: (id: string) => void;
  onAddMakhzanPost?: (post: MakhzanPost) => void;
  onEditMakhzanPost?: (post: MakhzanPost) => void;
  onDeleteMakhzanPost?: (id: string) => void;
  onToggleHideMakhzanPost?: (id: string) => void;

  // Spiritual Personalities Props
  spiritualPersonalities?: SpiritualPersonality[];
  onSaveSpiritualPersonality?: (personality: SpiritualPersonality) => void;
  onDeleteSpiritualPersonality?: (id: string) => void;
  onToggleHideSpiritualPersonality?: (id: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  postSplashScreens = [],
  onAddPostSplashScreen,
  onEditPostSplashScreen,
  onDeletePostSplashScreen,
  onTogglePostSplashScreen,

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
  donationInitiatives,
  donationRecords,
  infoPages = [],
  islamicEvents = initialIslamicEvents,
  duas = initialDuas,
  voiceReaderSettings,
  onUpdateVoiceReaderSettings,
  branches = [],
  dayDatasets = [],
  appUsers = [],
  slips = [],
  auditLogs = [],
  modSettings = { enableModFormula: false, modDivisor: 7, remainderMode: 'rem', enabled: false, divisor: 7, mode: 'remainder' },
  onAddBranch = () => {},
  onEditBranch = () => {},
  onDeleteBranch = () => {},
  onToggleBranchStatus = () => {},
  onAddDayRecord = () => {},
  onEditDayRecord = () => {},
  onDeleteDayRecord = () => {},
  onBulkImportDayRecords = () => {},
  onApproveUser = () => {},
  onBulkApproveUsers,
  onRejectUser = () => {},
  onBlockUser = () => {},
  onUnblockUser = () => {},
  onCreateUser = () => {},
  onEditUser = () => {},
  onDeleteUser = () => {},
  onCancelSlip = () => {},
  onUpdateModSettings = () => {},
  onRestoreBackup = () => {},
  onAddPost,
  onEditPost,
  onDeletePost,
  onToggleHidePost,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onToggleHideCategory,
  onAddPdf,
  onEditPdf,
  onDeletePdf,
  onToggleHidePdf,
  onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onToggleHideVideo,
  onAddAudio,
  onEditAudio,
  onDeleteAudio,
  onToggleHideAudio,
  onAddGalleryImage,
  onEditGalleryImage,
  onDeleteGalleryImage,
  onToggleHideGalleryImage,
  onAddAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onToggleHideAlbum,
  onReplyFeedback,
  onDeleteFeedback,
  onToggleHideFeedback,
  onSendNotification,
  onEditNotification,
  onDeleteNotification,
  onToggleHideNotification,
  onUpdateContactInfo,
  onUpdateSocialLinks,
  onUpdateSlider,
  onAddSliderItem,
  onEditSliderItem,
  onDeleteSliderItem,
  onToggleHideSliderItem,
  onAddDonationInitiative,
  onEditDonationInitiative,
  onDeleteDonationInitiative,
  onToggleHideDonationInitiative,
  onAddDonationRecord,
  onEditDonationRecord,
  onDeleteDonationRecord,
  onVerifyDonation,
  onToggleHideDonationRecord,
  onAddInfoPage,
  onEditInfoPage,
  onDeleteInfoPage,
  onToggleHideInfoPage,
  onAddIslamicEvent,
  onEditIslamicEvent,
  onDeleteIslamicEvent,
  onToggleHideIslamicEvent,
  onAddDua,
  onEditDua,
  onDeleteDua,
  onToggleHideDua,
  makhzanCategories = [],
  makhzanPosts = [],
  onAddMakhzanCategory = () => {},
  onEditMakhzanCategory = () => {},
  onDeleteMakhzanCategory = () => {},
  onAddMakhzanPost = () => {},
  onEditMakhzanPost = () => {},
  onDeleteMakhzanPost = () => {},
  onToggleHideMakhzanPost = () => {},
  spiritualPersonalities = [],
  onSaveSpiritualPersonality = () => {},
  onDeleteSpiritualPersonality = () => {},
  onToggleHideSpiritualPersonality = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'stats' | 'branches' | 'day_datasets' | 'user_management' | 'slips_master' | 'audit_logs' | 'backup_restore' | 'offline_queue' | 'mod_settings' | 'voice_reader' | 'adhan_scheduler' | 'makhzan' | 'spiritual_personalities' | 'posts' | 'categories' | 'pdfs' | 'media' | 'feedback' | 'notifications' | 'settings' | 'donations' | 'info_pages' | 'islamic_utilities' | 'post_splash'>('stats');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [deleteConfirmState, setDeleteConfirmState] = useState<{ title?: string; message?: string; onConfirm: () => void } | null>(null);

  // Admin toast notification system
  const [adminToast, setAdminToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showAdminToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setAdminToast({ message, type });
    setTimeout(() => {
      setAdminToast(null);
    }, 4000);
  };

  // Image cropper state for post image editing (16:9 Standard)
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string;
    mode: 'cover' | 'gallery';
    galleryIndex?: number;
  }>({
    isOpen: false,
    imageSrc: '',
    mode: 'cover'
  });

  const handlePostImageCropped = (croppedBase64: string) => {
    if (cropperModal.mode === 'cover') {
      setPostForm((prev) => ({ ...prev, coverImage: croppedBase64 }));
      showAdminToast('Post cover image cropped to 16:9 standard!', 'success');
    } else if (cropperModal.mode === 'gallery') {
      if (cropperModal.galleryIndex !== undefined) {
        setPostForm((prev) => {
          const updated = [...(prev.images || [])];
          updated[cropperModal.galleryIndex!] = croppedBase64;
          return { ...prev, images: updated };
        });
      } else {
        setPostForm((prev) => ({
          ...prev,
          images: [...(prev.images || []), croppedBase64]
        }));
      }
      showAdminToast('Post gallery image cropped to 16:9 standard!', 'success');
    }
  };

  // CMS Posts Multi-select Bulk Actions State
  const [selectedCmsPostIds, setSelectedCmsPostIds] = useState<string[]>([]);

  const isAllCmsPostsSelected = posts.length > 0 && selectedCmsPostIds.length === posts.length;

  const handleSelectAllCmsPosts = () => {
    if (isAllCmsPostsSelected) {
      setSelectedCmsPostIds([]);
    } else {
      setSelectedCmsPostIds(posts.map(p => p.id));
    }
  };

  const handleSelectCmsPost = (id: string) => {
    setSelectedCmsPostIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBulkDeleteCmsPosts = () => {
    if (selectedCmsPostIds.length === 0) return;
    setDeleteConfirmState({
      title: 'Bulk Delete Posts',
      message: `Are you sure you want to permanently delete ${selectedCmsPostIds.length} selected post(s)?`,
      onConfirm: () => {
        selectedCmsPostIds.forEach(id => {
          if (editingPost?.id === id) {
            setEditingPost(null);
          }
          onDeletePost(id);
        });
        showAdminToast(`Successfully deleted ${selectedCmsPostIds.length} post(s)!`, 'success');
        setSelectedCmsPostIds([]);
      }
    });
  };

  const handleBulkHideCmsPosts = () => {
    if (selectedCmsPostIds.length === 0 || !onToggleHidePost) return;
    selectedCmsPostIds.forEach(id => {
      const p = posts.find(item => item.id === id);
      if (p && p.status === 'published') {
        onToggleHidePost(p);
      }
    });
    showAdminToast(`Selected posts updated to hidden status!`, 'success');
  };

  const handleBulkShowCmsPosts = () => {
    if (selectedCmsPostIds.length === 0 || !onToggleHidePost) return;
    selectedCmsPostIds.forEach(id => {
      const p = posts.find(item => item.id === id);
      if (p && p.status !== 'published') {
        onToggleHidePost(p);
      }
    });
    showAdminToast(`Selected posts published successfully!`, 'success');
  };

  // Offline detection and offline queue state
  const [isOnline, setIsOnline] = useState<boolean>(typeof window !== 'undefined' ? navigator.onLine : true);
  const [isSimulatedOffline, setIsSimulatedOffline] = useState<boolean>(false);
  const [isSyncingOfflineQueue, setIsSyncingOfflineQueue] = useState<boolean>(false);
  const [offlineQueueItems, setOfflineQueueItems] = useState<OfflineQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('khanqah_offline_queue');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'off-demo-1',
        timestamp: new Date().toISOString(),
        actionType: 'UPDATE_DATASET',
        title: 'Monday Day Dataset Adad Update (Queued)',
        titleUrdu: 'پیر کے روزانہ اعداد کی آف لائن تبدیلی',
        category: 'Khanqah Datasets',
        payload: { day: 'monday', adadValue: 450 },
        status: 'pending'
      }
    ];
  });

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem('khanqah_offline_queue', JSON.stringify(offlineQueueItems));
    } catch (e) {}
  }, [offlineQueueItems]);

  const handleAddOfflineQueueItem = (item: Omit<OfflineQueueItem, 'id' | 'timestamp' | 'status'>) => {
    const newItem: OfflineQueueItem = {
      ...item,
      id: `off-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    setOfflineQueueItems(prev => [newItem, ...prev]);
  };

  const handleRemoveOfflineQueueItem = (id: string) => {
    setOfflineQueueItems(prev => prev.filter(i => i.id !== id));
  };

  const handleClearSyncedQueueItems = () => {
    setOfflineQueueItems(prev => prev.filter(i => i.status !== 'synced'));
  };

  const handleClearAllOfflineQueue = () => {
    setOfflineQueueItems([]);
  };

  const handleSyncOfflineQueue = async () => {
    setIsSyncingOfflineQueue(true);
    await new Promise(res => setTimeout(res, 800));
    setOfflineQueueItems(prev => prev.map(item => item.status === 'pending' ? { ...item, status: 'synced' } : item));
    setIsSyncingOfflineQueue(false);
  };

  // Sub-forms local states
  const [isUploadingAudio, setIsUploadingAudio] = useState<boolean>(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [postForm, setPostForm] = useState<Partial<Post>>({
    title: '', titleUrdu: '', category: 'caliphs', shortDescription: '', shortDescriptionUrdu: '',
    completeArticle: '', completeArticleUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
    images: [], pdfUrl: '', audioUrl: '', humanVoiceUrl: '', language: 'auto', videoUrl: '', tags: [], city: '', country: '', shrineName: '', scholarName: '', isDraft: false
  });

  const [voiceSettingsForm, setVoiceSettingsForm] = useState<VoiceReaderSettings>(
    voiceReaderSettings || DEFAULT_VOICE_SETTINGS
  );

  const [categoryForm, setCategoryForm] = useState({ name: '', nameUrdu: '', icon: 'BookOpen', description: '' });
  const [pdfForm, setPdfForm] = useState({ title: '', titleUrdu: '', author: '', authorUrdu: '', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf', size: '10 MB', pages: 100, description: '', descriptionUrdu: '' });
  const [videoForm, setVideoForm] = useState({ title: '', titleUrdu: '', youtubeId: 'dQw4w9WgXcQ', category: 'bayan' as any, duration: '20:00', speaker: 'Allama Usmani' });
  const [audioForm, setAudioForm] = useState({ title: '', titleUrdu: '', artist: '', artistUrdu: '', category: 'bayan' as any, audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '10:00', size: '5 MB' });
  const [galleryForm, setGalleryForm] = useState({ albumId: albums[0]?.id || '', title: '', titleUrdu: '', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', description: '' });
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [albumForm, setAlbumForm] = useState({ name: '', nameUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', type: 'photos' as 'photos' | 'posters' | 'events' });
  const [editingGalleryImage, setEditingGalleryImage] = useState<GalleryImage | null>(null);
  
  const [feedbackReply, setFeedbackReply] = useState<{ [id: string]: string }>({});
  const [notificationForm, setNotificationForm] = useState({ title: '', titleUrdu: '', body: '', bodyUrdu: '', type: 'announcement' as any, targetId: '' });
  
  const [contactForm, setContactForm] = useState<ContactInfo>({ ...contactInfo });
  const [socialForm, setSocialForm] = useState<SocialLinks>({ ...socialLinks });

  const [initiativeForm, setInitiativeForm] = useState({
    title: '',
    titleUrdu: '',
    description: '',
    descriptionUrdu: '',
    goalAmount: 500000,
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
    active: true
  });

  // Information Center CMS local state
  const [editingInfoPage, setEditingInfoPage] = useState<InfoPage | null>(null);
  const [infoPageForm, setInfoPageForm] = useState<Partial<InfoPage>>({
    title: '',
    titleUrdu: '',
    slug: '',
    shortDescription: '',
    shortDescriptionUrdu: '',
    content: '',
    contentUrdu: '',
    bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    featuredImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
    status: 'published',
    displayOrder: 1,
    youtubeUrl: '',
    externalLinks: []
  });
  const [linkInput, setLinkInput] = useState<{ label: string; url: string }>({ label: '', url: '' });

  const handleInfoPageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = (infoPageForm.title || '').trim();
    const titleUrduVal = (infoPageForm.titleUrdu || '').trim();

    if (!titleVal && !titleUrduVal) {
      alert('براہ کرم انگریزی یا اردو میں عنوان درج کریں۔ (Please enter a page title in English or Urdu)');
      return;
    }

    const finalTitle = titleVal || titleUrduVal;
    const finalTitleUrdu = titleUrduVal || titleVal;

    const generatedSlug = infoPageForm.slug 
      ? infoPageForm.slug.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      : finalTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const nowIso = new Date().toISOString();

    if (editingInfoPage) {
      onEditInfoPage({
        ...editingInfoPage,
        ...infoPageForm,
        title: finalTitle,
        titleUrdu: finalTitleUrdu,
        slug: generatedSlug,
        updatedAt: nowIso
      } as InfoPage);
      setEditingInfoPage(null);
    } else {
      const newPage: InfoPage = {
        id: `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: finalTitle,
        titleUrdu: finalTitleUrdu,
        slug: generatedSlug || `page-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        shortDescription: infoPageForm.shortDescription || '',
        shortDescriptionUrdu: infoPageForm.shortDescriptionUrdu || '',
        content: infoPageForm.content || '<p>Page content goes here...</p>',
        contentUrdu: infoPageForm.contentUrdu || '<p>صفحے کی تفصیلات...</p>',
        bannerImage: infoPageForm.bannerImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
        featuredImage: infoPageForm.featuredImage || 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
        status: infoPageForm.status || 'published',
        displayOrder: Number(infoPageForm.displayOrder) || (infoPages.length + 1),
        createdAt: nowIso,
        updatedAt: nowIso,
        youtubeUrl: infoPageForm.youtubeUrl || '',
        externalLinks: infoPageForm.externalLinks || []
      };
      onAddInfoPage(newPage);
    }

    // Reset form
    setInfoPageForm({
      title: '',
      titleUrdu: '',
      slug: '',
      shortDescription: '',
      shortDescriptionUrdu: '',
      content: '',
      contentUrdu: '',
      bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
      featuredImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
      status: 'published',
      displayOrder: infoPages.length + 2,
      youtubeUrl: '',
      externalLinks: []
    });
  };

  // Islamic Events CMS local state & modal handlers
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<IslamicEvent | null>(null);
  const [eventForm, setEventForm] = useState<{
    title: string;
    titleUrdu: string;
    description: string;
    descriptionUrdu: string;
    hijriMonth: number;
    hijriDay: number;
    category: 'eid' | 'fasting' | 'holy_night' | 'historical';
  }>({
    title: '',
    titleUrdu: '',
    description: '',
    descriptionUrdu: '',
    hijriMonth: 1,
    hijriDay: 1,
    category: 'holy_night'
  });

  const openAddEventModal = () => {
    setEditingEvent(null);
    setEventForm({
      title: '',
      titleUrdu: '',
      description: '',
      descriptionUrdu: '',
      hijriMonth: 1,
      hijriDay: 1,
      category: 'holy_night'
    });
    setShowEventModal(true);
  };

  const openEditEventModal = (evt: IslamicEvent) => {
    setEditingEvent(evt);
    setEventForm({
      title: evt.title,
      titleUrdu: evt.titleUrdu || '',
      description: evt.description || '',
      descriptionUrdu: evt.descriptionUrdu || '',
      hijriMonth: evt.hijriMonth || 1,
      hijriDay: evt.hijriDay || 1,
      category: evt.category || 'holy_night'
    });
    setShowEventModal(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = eventForm.title.trim();
    const titleUrduVal = eventForm.titleUrdu.trim();

    if (!titleVal && !titleUrduVal) {
      alert('براہ کرم تقریب کا عنوان انگریزی یا اردو میں درج کریں۔ (Please enter an event title in English or Urdu)');
      return;
    }

    const finalTitle = titleVal || titleUrduVal;
    const finalTitleUrdu = titleUrduVal || titleVal;

    if (editingEvent) {
      if (onEditIslamicEvent) {
        onEditIslamicEvent({
          ...editingEvent,
          title: finalTitle,
          titleUrdu: finalTitleUrdu,
          description: eventForm.description.trim(),
          descriptionUrdu: eventForm.descriptionUrdu.trim(),
          hijriMonth: Number(eventForm.hijriMonth) || 1,
          hijriDay: Number(eventForm.hijriDay) || 1,
          category: eventForm.category
        });
      }
    } else {
      if (onAddIslamicEvent) {
        onAddIslamicEvent({
          id: 'evt-' + Date.now(),
          title: finalTitle,
          titleUrdu: finalTitleUrdu,
          description: eventForm.description.trim(),
          descriptionUrdu: eventForm.descriptionUrdu.trim(),
          hijriMonth: Number(eventForm.hijriMonth) || 1,
          hijriDay: Number(eventForm.hijriDay) || 1,
          category: eventForm.category,
          status: 'published'
        });
      }
    }
    setShowEventModal(false);
  };

  // Masnoon Duas CMS local state & modal handlers
  const [showDuaModal, setShowDuaModal] = useState(false);
  const [editingDua, setEditingDua] = useState<DuaItem | null>(null);
  const [duaForm, setDuaForm] = useState<{
    title: string;
    titleUrdu: string;
    arabicText: string;
    translation: string;
    category: 'daily' | 'morning_evening' | 'protection' | 'special' | 'salawat';
  }>({
    title: '',
    titleUrdu: '',
    arabicText: '',
    translation: '',
    category: 'daily'
  });

  const openAddDuaModal = () => {
    setEditingDua(null);
    setDuaForm({
      title: '',
      titleUrdu: '',
      arabicText: '',
      translation: '',
      category: 'daily'
    });
    setShowDuaModal(true);
  };

  const openEditDuaModal = (dua: DuaItem) => {
    setEditingDua(dua);
    setDuaForm({
      title: dua.title,
      titleUrdu: dua.titleUrdu || '',
      arabicText: dua.arabicText || '',
      translation: dua.translation || '',
      category: (dua.category as any) || 'daily'
    });
    setShowDuaModal(true);
  };

  const handleSaveDua = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = duaForm.title.trim();
    const titleUrduVal = duaForm.titleUrdu.trim();

    if (!titleVal && !titleUrduVal) {
      alert('براہ کرم دعا کا عنوان انگریزی یا اردو میں درج کریں۔ (Please enter a dua title in English or Urdu)');
      return;
    }

    const finalTitle = titleVal || titleUrduVal;
    const finalTitleUrdu = titleUrduVal || titleVal;

    if (editingDua) {
      if (onEditDua) {
        onEditDua({
          ...editingDua,
          title: finalTitle,
          titleUrdu: finalTitleUrdu,
          arabicText: duaForm.arabicText.trim(),
          translation: duaForm.translation.trim(),
          category: duaForm.category as any
        });
      }
    } else {
      if (onAddDua) {
        onAddDua({
          id: 'dua-' + Date.now(),
          title: finalTitle,
          titleUrdu: finalTitleUrdu,
          arabicText: duaForm.arabicText.trim(),
          translation: duaForm.translation.trim(),
          category: duaForm.category as any,
          status: 'published'
        });
      }
    }
    setShowDuaModal(false);
  };

  // Handle Post submission
  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const titleVal = (postForm.title || '').trim();
    const titleUrduVal = (postForm.titleUrdu || '').trim();

    if (!titleVal && !titleUrduVal) {
      alert('براہ کرم تحریر کا عنوان انگریزی یا اردو میں درج کریں۔ (Please enter a post title in English or Urdu)');
      return;
    }

    const finalTitle = titleVal || titleUrduVal;
    const finalTitleUrdu = titleUrduVal || titleVal;
    
    if (editingPost) {
      onEditPost({
        ...editingPost,
        ...postForm,
        title: finalTitle,
        titleUrdu: finalTitleUrdu,
        publishDate: new Date().toISOString().split('T')[0]
      } as Post);
      setEditingPost(null);
      showAdminToast(`Post "${finalTitle}" updated successfully!`, 'success');
    } else {
      onAddPost({
        id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        title: finalTitle,
        titleUrdu: finalTitleUrdu,
        category: postForm.category || 'articles',
        shortDescription: postForm.shortDescription || '',
        shortDescriptionUrdu: postForm.shortDescriptionUrdu || '',
        completeArticle: postForm.completeArticle || '',
        completeArticleUrdu: postForm.completeArticleUrdu || '',
        coverImage: postForm.coverImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
        images: postForm.images || [],
        pdfUrl: postForm.pdfUrl,
        audioUrl: postForm.audioUrl,
        videoUrl: postForm.videoUrl,
        tags: postForm.tags || [],
        city: postForm.city || 'Karachi',
        country: postForm.country || 'Pakistan',
        shrineName: postForm.shrineName,
        scholarName: postForm.scholarName,
        publishDate: new Date().toISOString().split('T')[0],
        isDraft: postForm.isDraft || false,
        status: 'published',
        views: 0,
        bookmarksCount: 0
      });
      showAdminToast(`New post "${finalTitle}" published live!`, 'success');
    }
    
    // reset
    setPostForm({
      title: '', titleUrdu: '', category: 'caliphs', shortDescription: '', shortDescriptionUrdu: '',
      completeArticle: '', completeArticleUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
      images: [], pdfUrl: '', audioUrl: '', videoUrl: '', tags: [], city: '', country: '', shrineName: '', scholarName: '', isDraft: false
    });
  };

  // Handle Category creation
  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nameVal = (categoryForm.name || '').trim();
    const nameUrduVal = (categoryForm.nameUrdu || '').trim();

    if (!nameVal && !nameUrduVal) {
      alert('براہ کرم زمرہ کا نام انگریزی یا اردو میں درج کریں۔ (Please enter a category name in English or Urdu)');
      return;
    }

    const finalName = nameVal || nameUrduVal;
    const finalNameUrdu = nameUrduVal || nameVal;

    onAddCategory({
      id: finalName.toLowerCase().replace(/\s+/g, '-'),
      name: finalName,
      nameUrdu: finalNameUrdu,
      icon: categoryForm.icon,
      description: categoryForm.description
    });
    setCategoryForm({ name: '', nameUrdu: '', icon: 'BookOpen', description: '' });
  };

  // Handle PDF additions
  const handlePdfSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPdf({
      id: `pdf-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: pdfForm.title,
      titleUrdu: pdfForm.titleUrdu,
      author: pdfForm.author,
      authorUrdu: pdfForm.authorUrdu,
      coverImage: pdfForm.coverImage,
      pdfUrl: pdfForm.pdfUrl,
      size: pdfForm.size,
      pages: Number(pdfForm.pages) || 50,
      description: pdfForm.description,
      descriptionUrdu: pdfForm.descriptionUrdu,
      views: 0,
      downloadsCount: 0
    });
    setPdfForm({ title: '', titleUrdu: '', author: '', authorUrdu: '', coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=600', pdfUrl: 'https://pdfobject.com/pdf/sample.pdf', size: '10 MB', pages: 100, description: '', descriptionUrdu: '' });
  };

  // Trigger Notifications
  const handleNotificationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendNotification({
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: notificationForm.title,
      titleUrdu: notificationForm.titleUrdu,
      body: notificationForm.body,
      bodyUrdu: notificationForm.bodyUrdu,
      type: notificationForm.type,
      targetId: notificationForm.targetId || undefined,
      date: new Date().toISOString().split('T')[0]
    });
    setNotificationForm({ title: '', titleUrdu: '', body: '', bodyUrdu: '', type: 'announcement', targetId: '' });
    alert('Push Notification broadcasted successfully to all devices!');
  };

  // Quick stats calculations
  const totalViews = posts.reduce((acc, p) => acc + (Number(p.views) || 0), 0) + pdfs.reduce((acc, p) => acc + (Number(p.views) || 0), 0);
  const pendingFeedback = feedback.filter(f => !f.replied).length;
  const pendingDonations = donationRecords.filter(r => r.status === 'pending').length;
  const pendingUsers = appUsers.filter(u => u.status === 'pending').length;

  const pendingOfflineItems = offlineQueueItems.filter(i => i.status === 'pending').length;
  const effectiveOnlineStatus = isOnline && !isSimulatedOffline;

  const adminCategories = [
    {
      category: "Overview & Analytics",
      items: [
        { id: "stats", label: "Dashboard Stats", icon: BarChart }
      ]
    },
    {
      category: "Spiritual & Branch Core",
      items: [
        { id: "branches", label: "Branch Master", icon: Building2 },
        { id: "day_datasets", label: "Day Spiritual Datasets", icon: Database },
        { id: "slips_master", label: "Master Slips Ledger", icon: FileCheck },
        { id: "makhzan", label: "Makhzan-e-Khas (مخزنِ خاص)", icon: FolderHeart },
        { id: "spiritual_personalities", label: "Spiritual Personalities (بزرگانِ سلسلہ)", icon: UserCheck }
      ]
    },
    {
      category: "Content & Knowledge Base",
      items: [
        { id: "hero_slider", label: "Hero Slider & Banners (سلائیڈر و بینرز)", icon: ImageIcon },
        { id: "posts", label: "Islamic CMS (Articles)", icon: FileText },
        { id: "categories", label: "CMS Categories", icon: Settings },
        { id: "pdfs", label: "PDF Library", icon: BookOpen },
        { id: "media", label: "Audio & Video Center", icon: Music },
        { id: "info_pages", label: "Information Center", icon: Globe },
        { id: "islamic_utilities", label: "Islamic Suite & Events", icon: Compass },
        { id: "post_splash", label: "Post-Splash Screen (درود پاک)", icon: Tv },
      ]
    },
    {
      category: "Community & Engagement",
      items: [
        { id: "user_management", label: "User Registrations", icon: Users, badge: pendingUsers },
        { id: "donations", label: "Donation Ledger", icon: HeartHandshake, badge: pendingDonations },
        { id: "feedback", label: "Feedback Replies", icon: MessageSquare, badge: pendingFeedback },
        { id: "notifications", label: "Broadcast Notifications", icon: Bell }
      ]
    },
    {
      category: "System & Engine Settings",
      items: [
        { id: "mod_settings", label: "Abjad Engine Settings", icon: Sparkles },
        { id: "voice_reader", label: "Voice Reader Settings", icon: Volume2 },
        { id: "adhan_scheduler", label: "Adhan Audio Scheduler", icon: Radio },
        { id: "offline_queue", label: "Offline Queue", icon: !effectiveOnlineStatus ? WifiOff : Wifi, badge: pendingOfflineItems },
        { id: "audit_logs", label: "Audit Log Ledger", icon: ShieldCheck },
        { id: "backup_restore", label: "Backup & Restore", icon: HardDrive },
        { id: "settings", label: "App Configurations", icon: Share2 }
      ]
    }
  ];

  return (
    <div className="bg-slate-900 text-white rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col h-full border border-slate-800 relative">
      {adminToast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-3 transition-all animate-bounce ${
          adminToast.type === 'error' ? 'bg-rose-950 text-rose-200 border-rose-800' :
          adminToast.type === 'info' ? 'bg-sky-950 text-sky-200 border-sky-800' :
          'bg-emerald-950 text-emerald-200 border-emerald-800'
        }`}>
          <span>{adminToast.message}</span>
          <button onClick={() => setAdminToast(null)} className="ml-2 text-slate-400 hover:text-white font-mono">✕</button>
        </div>
      )}
      
      {/* Admin Responsive Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Mobile Drawer Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 bg-slate-800 text-emerald-400 rounded-xl border border-slate-700 hover:bg-slate-700"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div>
            <h2 className="text-base sm:text-xl font-bold tracking-tight text-emerald-400">Halqa-e-Usmania Admin Deck</h2>
            <p className="text-[10px] sm:text-xs text-slate-400">Responsive Management System • Mobile, Tablet & Desktop</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Offline Status Indicator Badge */}
          <button
            onClick={() => setActiveTab('offline_queue')}
            className={`px-3 py-1.5 rounded-xl text-[10px] sm:text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              !effectiveOnlineStatus
                ? 'bg-amber-950/80 text-amber-300 border-amber-500/50 animate-pulse'
                : 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/60'
            }`}
            title="Click to view & sync Offline Queue"
          >
            {!effectiveOnlineStatus ? (
              <>
                <WifiOff size={13} className="text-amber-400" />
                <span>Offline ({pendingOfflineItems} Pending)</span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block"></span>
                <Wifi size={13} className="text-emerald-400" />
                <span>Online Mode {pendingOfflineItems > 0 && `(${pendingOfflineItems} Queued)`}</span>
              </>
            )}
          </button>

          <div className="bg-slate-800 text-amber-300 font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl text-[10px] sm:text-xs border border-slate-700 shrink-0">
            🔑 Super Administrator
          </div>
        </div>
      </div>

      {/* Main Container: Grid layout on Tablet/Desktop, Drawer on Mobile */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 flex-1 overflow-hidden relative min-h-0 min-w-0">
        
        {/* Desktop / Tablet Sidebar Nav + Mobile Drawer overlay */}
        <div className={`
          md:col-span-3 bg-slate-950/80 md:bg-slate-950/40 p-3 rounded-2xl border border-slate-800 flex flex-col gap-1 overflow-y-auto min-w-0 min-h-0
          ${mobileMenuOpen ? 'fixed inset-x-4 top-20 z-50 bg-slate-950 border-emerald-700/80 shadow-2xl block md:relative md:inset-auto md:z-0' : 'hidden md:flex'}
        `}>
          {adminCategories.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-2.5 last:mb-0">
              <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400/90 px-2 py-1 text-left border-b border-slate-800/80 mb-1.5 flex items-center justify-between">
                <span>{group.category}</span>
                <span className="text-[9px] font-mono text-slate-400 bg-slate-900/90 px-1.5 py-0.5 rounded-md border border-slate-800">{group.items.length}</span>
              </div>
              <div className="space-y-0.5">
                {group.items.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-bold rounded-xl transition-all ${
                      activeTab === tab.id 
                        ? "bg-gradient-to-r from-emerald-800 to-emerald-700 text-white shadow-md border border-emerald-500/50" 
                        : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <tab.icon size={15} className={`shrink-0 ${activeTab === tab.id ? "text-amber-300" : "text-slate-400"}`} />
                      <span className="truncate text-left">{tab.label}</span>
                    </div>

                    {tab.badge && tab.badge > 0 ? (
                      <span className="bg-amber-400 text-slate-950 text-[10px] px-1.5 py-0.2 rounded-full font-black animate-pulse shrink-0 ml-1">
                        {tab.badge}
                      </span>
                    ) : null}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-9 flex-1 overflow-y-auto pr-1 min-w-0 min-h-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12, scale: 0.995 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.995 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* ==================== STATS / ANALYTICS TAB ==================== */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            
            {/* Bento statistics grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Articles</span>
                <h3 className="text-2xl font-black mt-1 text-emerald-400">{posts.length}</h3>
                <p className="text-[9px] text-slate-500">{posts.filter(p => p.isDraft).length} Drafts | {posts.filter(p => !p.isDraft).length} Published</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Quranic Categories</span>
                <h3 className="text-2xl font-black mt-1 text-teal-400">{categories.length}</h3>
                <p className="text-[9px] text-slate-500">CMS filter classifications</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Digital Library PDFs</span>
                <h3 className="text-2xl font-black mt-1 text-blue-400">{pdfs.length}</h3>
                <p className="text-[9px] text-slate-500">{pdfs.reduce((acc, p) => acc + (Number(p.downloadsCount) || 0), 0)} Total downloads</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800 text-left">
                <span className="text-[10px] uppercase font-bold text-slate-400">Accumulated Views</span>
                <h3 className="text-2xl font-black mt-1 text-amber-400">{isNaN(totalViews) ? 0 : totalViews}</h3>
                <p className="text-[9px] text-slate-500">Articles & books read online</p>
              </div>

            </div>

            {/* Recharts Daily Adad & Weekly Spiritual Participation Dashboard Card */}
            <DailyAdadWeeklyChart dayDatasets={dayDatasets} slips={slips} />

            {/* Recharts Branch Performance Overview Card (Active vs Pending Registrations per Branch Code) */}
            <BranchPerformanceChart branches={branches} appUsers={appUsers} />

            {/* Custom SVG Graphic Charts of Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Media Views Chart */}
              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left">
                <h4 className="font-bold text-xs text-slate-300 mb-4">📈 Digital Content Traffic (Last 6 Months)</h4>
                
                {/* SVG Line Chart */}
                <div className="h-44 w-full flex items-end gap-5">
                  {[
                    { month: 'Feb', views: 320 },
                    { month: 'Mar', views: 540 },
                    { month: 'Apr', views: 890 },
                    { month: 'May', views: 1240 },
                    { month: 'Jun', views: 1560 },
                    { month: 'Jul', views: isNaN(totalViews) ? 0 : totalViews }
                  ].map((d, idx) => {
                    const maxVal = 2500;
                    const safeViews = Number(d.views) || 0;
                    const heightPercent = maxVal > 0 ? Math.min(100, Math.max(0, (safeViews / maxVal) * 100)) : 0;
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] font-mono text-emerald-400 font-bold">{safeViews}</span>
                        <div className="w-full bg-slate-800 rounded-md relative flex-1">
                          <div 
                            style={{ height: `${heightPercent}%` }}
                            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-emerald-600 to-amber-400 rounded-md transition-all duration-500"
                          ></div>
                        </div>
                        <span className="text-[10px] text-slate-500">{d.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category distribution chart */}
              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left">
                <h4 className="font-bold text-xs text-slate-300 mb-4">📊 Articles Per Category</h4>
                <div className="space-y-2.5 max-h-44 overflow-y-auto">
                  {categories.slice(0, 5).map((cat) => {
                    const count = posts.filter(p => p.category === cat.id).length;
                    const totalPostsCount = posts.length;
                    const percent = (count > 0 && totalPostsCount > 0) ? Math.round((count / totalPostsCount) * 100) : 0;
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-300">
                          <span>{cat.name} ({cat.nameUrdu})</span>
                          <span className="font-bold text-amber-400">{count} posts</span>
                        </div>
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div style={{ width: `${percent}%` }} className="bg-emerald-500 h-full"></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="bg-emerald-950/20 border border-emerald-800/40 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
              <div className="text-left">
                <h4 className="font-bold text-sm text-emerald-400">Quick Alert Broadcast</h4>
                <p className="text-[10px] text-slate-400">Immediately send instant announcements or emergency updates directly to all active mobile simulators.</p>
              </div>
              <button 
                onClick={() => setActiveTab('notifications')}
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-4 rounded-xl"
              >
                Launch Broadcaster
              </button>
            </div>

          </div>
        )}

        {/* ==================== KHANQAH BRANCH MASTER TAB ==================== */}
        {activeTab === 'branches' && (
          <BranchMasterManager
            branches={branches}
            appUsers={appUsers}
            onAddBranch={onAddBranch}
            onEditBranch={onEditBranch}
            onDeleteBranch={onDeleteBranch}
            onToggleBranchStatus={onToggleBranchStatus}
          />
        )}

        {/* ==================== KHANQAH DAY SPIRITUAL DATASETS TAB ==================== */}
        {activeTab === 'day_datasets' && (
          <DayDatasetsManager
            dayDatasets={dayDatasets}
            onAddRecord={onAddDayRecord}
            onEditRecord={onEditDayRecord}
            onDeleteRecord={onDeleteDayRecord}
            onBulkImportRecords={onBulkImportDayRecords}
          />
        )}

        {/* ==================== KHANQAH USER REGISTRATION & ROLES TAB ==================== */}
        {activeTab === 'user_management' && (
          <UserRegistrationManager
            appUsers={appUsers}
            branches={branches}
            onApproveUser={onApproveUser}
            onBulkApproveUsers={onBulkApproveUsers}
            onRejectUser={onRejectUser}
            onBlockUser={onBlockUser}
            onUnblockUser={onUnblockUser}
            onCreateUser={onCreateUser}
            onEditUser={onEditUser}
            onDeleteUser={onDeleteUser}
          />
        )}

        {/* ==================== KHANQAH MASTER SLIPS LEDGER TAB ==================== */}
        {activeTab === 'slips_master' && (
          <MasterSlipsManager
            slips={slips}
            branches={branches}
            onCancelSlip={onCancelSlip}
          />
        )}

        {/* ==================== KHANQAH AUDIT LOG LEDGER TAB ==================== */}
        {activeTab === 'audit_logs' && (
          <AuditLogViewer
            auditLogs={auditLogs}
            branches={branches}
          />
        )}

        {/* ==================== KHANQAH BACKUP & RESTORE TAB ==================== */}
        {activeTab === 'backup_restore' && (
          <BackupRestoreManager
            branches={branches}
            dayDatasets={dayDatasets}
            appUsers={appUsers}
            slips={slips}
            auditLogs={auditLogs}
            modSettings={modSettings}
            onRestoreBackup={onRestoreBackup}
          />
        )}

        {/* ==================== OFFLINE ACTION QUEUE TAB ==================== */}
        {activeTab === 'offline_queue' && (
          <OfflineQueueManager
            isOnline={isOnline}
            isSimulatedOffline={isSimulatedOffline}
            onToggleSimulatedOffline={() => setIsSimulatedOffline(!isSimulatedOffline)}
            queueItems={offlineQueueItems}
            onAddQueueItem={handleAddOfflineQueueItem}
            onRemoveQueueItem={handleRemoveOfflineQueueItem}
            onClearSyncedItems={handleClearSyncedQueueItems}
            onClearAllQueue={handleClearAllOfflineQueue}
            onSyncQueue={handleSyncOfflineQueue}
            isSyncing={isSyncingOfflineQueue}
          />
        )}

        {/* ==================== KHANQAH MOD ENGINE SETTINGS TAB ==================== */}
        {activeTab === 'mod_settings' && (
          <ModSettingsManager
            modSettings={modSettings}
            onUpdateModSettings={onUpdateModSettings}
          />
        )}

        {/* ==================== VOICE READER SETTINGS TAB ==================== */}
        {activeTab === 'voice_reader' && (
          <VoiceReaderSettingsScreen
            showToast={(msg, type) => showAdminToast(msg, type)}
          />
        )}

        {/* ==================== AUTOMATED ADHAN SCHEDULER TAB ==================== */}
        {activeTab === 'adhan_scheduler' && (
          <AdhanSchedulerManager
            showToast={(msg, type) => showAdminToast(msg, type)}
          />
        )}

        {/* ==================== EXCLUSIVE CONTENT LIBRARY (MAKHZAN-E-KHAS) TAB ==================== */}
        {activeTab === 'makhzan' && (
          <MakhzanManager
            categories={makhzanCategories}
            posts={makhzanPosts}
            branches={branches}
            onAddCategory={onAddMakhzanCategory}
            onEditCategory={onEditMakhzanCategory}
            onDeleteCategory={onDeleteMakhzanCategory}
            onAddPost={onAddMakhzanPost}
            onEditPost={onEditMakhzanPost}
            onDeletePost={onDeleteMakhzanPost}
            onToggleHidePost={onToggleHideMakhzanPost}
          />
        )}

        {/* ==================== SPIRITUAL PERSONALITIES TAB ==================== */}
        {activeTab === 'spiritual_personalities' && (
          <SpiritualPersonalitiesManager
            personalities={spiritualPersonalities}
            onSave={onSaveSpiritualPersonality}
            onDelete={onDeleteSpiritualPersonality}
            onToggleHide={onToggleHideSpiritualPersonality}
          />
        )}

        {/* ==================== ISLAMIC CMS / ARTICLES TAB ==================== */}
        {activeTab === 'posts' && (
          <div className="space-y-6">
            
            {/* Create/Edit Post Form */}
            <form onSubmit={handlePostSubmit} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">
                {editingPost ? `✍️ Edit Article: ${editingPost.title}` : '➕ Add New Islamic Article / Post'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Article Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={postForm.title || ''} 
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Article Title (Urdu / اردو عنوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={postForm.titleUrdu || ''} 
                    onChange={(e) => setPostForm({ ...postForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Islamic Category</label>
                  <select 
                    value={postForm.category || 'articles'} 
                    onChange={(e) => setPostForm({ ...postForm, category: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.nameUrdu})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Scholar / Speaker Name</label>
                  <input 
                    type="text" 
                    value={postForm.scholarName || ''} 
                    onChange={(e) => setPostForm({ ...postForm, scholarName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Sacred Shrine Name (if any)</label>
                  <input 
                    type="text" 
                    value={postForm.shrineName || ''} 
                    onChange={(e) => setPostForm({ ...postForm, shrineName: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Short Description (English)</label>
                  <textarea 
                    rows={2} 
                    value={postForm.shortDescription || ''} 
                    onChange={(e) => setPostForm({ ...postForm, shortDescription: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Short Description (Urdu / اردو خلاصہ)</label>
                  <textarea 
                    rows={2} 
                    value={postForm.shortDescriptionUrdu || ''} 
                    onChange={(e) => setPostForm({ ...postForm, shortDescriptionUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div>
                  <WysiwygEditor
                    label="Complete Article (English Content & Rich Formatting)"
                    value={postForm.completeArticle || ''}
                    onChange={(html) => setPostForm({ ...postForm, completeArticle: html })}
                    placeholder="Compose complete English article with rich formatting, headings, quotes..."
                    isUrdu={false}
                    minHeight="220px"
                  />
                </div>
                <div>
                  <WysiwygEditor
                    label="Complete Article (Urdu Content / مکمل مضمون و قرآنی آیات)"
                    value={postForm.completeArticleUrdu || ''}
                    onChange={(html) => setPostForm({ ...postForm, completeArticleUrdu: html })}
                    placeholder="مکمل مضمون، قرآنی آیات اور احادیثِ مبارکہ یہاں تحریر کریں..."
                    isUrdu={true}
                    minHeight="220px"
                  />
                </div>
              </div>

              {/* 16:9 Image Cropper Studio Section for Posts */}
              <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded-lg">
                      <Crop className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Post Images Studio (16:9 Standard Cropper)</span>
                      <span className="text-[10px] text-slate-400 block">Crop uploaded photos or URLs to 16:9 widescreen format</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 tracking-wider uppercase">
                    16:9 Ratio Locked
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                  {/* Cover Image 16:9 Preview Card */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-slate-300">Cover Image Preview (16:9)</label>
                      <span className="text-[10px] text-slate-400 font-mono">16:9 Widescreen</span>
                    </div>
                    <div className="relative aspect-video w-full bg-slate-950 rounded-2xl overflow-hidden border-2 border-slate-800 group shadow-lg">
                      {postForm.coverImage ? (
                        <>
                          <img 
                            src={postForm.coverImage} 
                            alt="Cover Preview" 
                            className="max-h-full max-w-full object-contain mx-auto" 
                          />
                          <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-3">
                            <button
                              type="button"
                              onClick={() => setCropperModal({ isOpen: true, imageSrc: postForm.coverImage || '', mode: 'cover' })}
                              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition"
                            >
                              <Crop className="w-4 h-4" />
                              <span>Crop Cover Image (16:9)</span>
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2 p-4 text-center">
                          <ImageIcon className="w-8 h-8 text-slate-600" />
                          <span className="text-xs font-medium">No cover image selected</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      <label className="px-3 py-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-2 transition shadow-sm">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload File & Crop (16:9)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                setCropperModal({ isOpen: true, imageSrc: reader.result as string, mode: 'cover' });
                              };
                              reader.readAsDataURL(file);
                            }
                            e.target.value = '';
                          }}
                          className="hidden"
                        />
                      </label>

                      {postForm.coverImage && (
                        <button
                          type="button"
                          onClick={() => setCropperModal({ isOpen: true, imageSrc: postForm.coverImage || '', mode: 'cover' })}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition border border-slate-700"
                        >
                          <Crop className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Crop Existing Cover</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Inputs & Gallery */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block mb-1">Cover Image URL / Base64</label>
                      <input 
                        type="text" 
                        value={postForm.coverImage || ''} 
                        onChange={(e) => setPostForm({ ...postForm, coverImage: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                        placeholder="https://... or cropped base64"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <GoogleDriveLinkInput
                          label="Associated PDF (Optional Google Drive / PDF URL)"
                          placeholder="Paste Google Drive URL or direct PDF link..."
                          value={postForm.pdfUrl || ''}
                          onChange={(url) => setPostForm({ ...postForm, pdfUrl: url })}
                          expectedType="pdf"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 block mb-1">Background Audio MP3 (Optional)</label>
                        <input 
                          type="text" 
                          value={postForm.audioUrl || ''} 
                          onChange={(e) => setPostForm({ ...postForm, audioUrl: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                        />
                      </div>
                    </div>

                    {/* Human Voice Recording MP3 & Language Selection */}
                    <div className="p-3.5 bg-emerald-950/40 border border-emerald-800/80 rounded-xl space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                          🎙️ Official Recitation Recording (رسمی تلاوت/ریکارڈنگ)
                        </span>
                        
                        <label className="flex items-center gap-1.5 cursor-pointer bg-slate-900 border border-slate-700 px-2.5 py-1 rounded-lg">
                          <input 
                            type="checkbox"
                            checked={postForm.voiceReaderEnabled !== false}
                            onChange={(e) => setPostForm({ ...postForm, voiceReaderEnabled: e.target.checked })}
                            className="w-4 h-4 accent-emerald-500 rounded"
                          />
                          <span className="text-[10px] font-bold text-slate-300">Voice Reader enabled for this post</span>
                        </label>
                      </div>

                      {/* File Upload & Audio Preview Section */}
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-2">
                        <label className="text-[10px] font-bold text-slate-300 block">
                          Upload Official Recording (MP3)
                        </label>

                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            accept="audio/mp3,audio/*"
                            disabled={isUploadingAudio}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file && postForm.id) {
                                try {
                                  setIsUploadingAudio(true);
                                  showAdminToast('Uploading official audio MP3...', 'info');
                                  const { uploadOfficialAudio } = await import('../lib/firestoreVoiceReader');
                                  const url = await uploadOfficialAudio(postForm.id, file);
                                  setPostForm(prev => ({ ...prev, officialAudioUrl: url, humanVoiceUrl: url }));
                                  showAdminToast('Official audio MP3 uploaded successfully!', 'success');
                                } catch (err: any) {
                                  showAdminToast('Audio upload failed: ' + err.message, 'error');
                                } finally {
                                  setIsUploadingAudio(false);
                                }
                              } else if (!postForm.id) {
                                showAdminToast('Please save post details first before uploading file.', 'error');
                              }
                            }}
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900 cursor-pointer disabled:opacity-50"
                          />

                          {isUploadingAudio && (
                            <span className="text-xs text-amber-400 font-bold flex items-center gap-1.5 shrink-0">
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>Uploading...</span>
                            </span>
                          )}
                        </div>

                        {/* Inline Audio Preview & Remove Button */}
                        {(postForm.officialAudioUrl || postForm.humanVoiceUrl) ? (
                          <div className="pt-2 border-t border-slate-900 space-y-2">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="text-emerald-400 font-bold flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Official Recording Active</span>
                              </span>

                              <button
                                type="button"
                                onClick={() => {
                                  setDeleteConfirmState({
                                    title: 'Remove Audio Recording',
                                    message: 'Are you sure you want to remove the official audio recording for this post?',
                                    onConfirm: async () => {
                                      try {
                                        const { removeOfficialAudio } = await import('../lib/firestoreVoiceReader');
                                        if (postForm.id) {
                                          await removeOfficialAudio(postForm.id);
                                        }
                                        setPostForm(prev => ({ ...prev, officialAudioUrl: '', humanVoiceUrl: '' }));
                                        showAdminToast('Official audio recording removed.', 'info');
                                      } catch (err: any) {
                                        showAdminToast('Failed to remove audio: ' + err.message, 'error');
                                      }
                                    }
                                  });
                                }}
                                className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 transition"
                              >
                                <Trash2 className="w-3 h-3" />
                                <span>Remove Audio</span>
                              </button>
                            </div>

                            <audio 
                              controls 
                              src={postForm.officialAudioUrl || postForm.humanVoiceUrl} 
                              className="w-full h-9 rounded-lg"
                            />
                          </div>
                        ) : null}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Official Audio URL (Optional Link)</label>
                          <input 
                            type="text" 
                            placeholder="https://..."
                            value={postForm.officialAudioUrl || postForm.humanVoiceUrl || ''} 
                            onChange={(e) => setPostForm({ 
                              ...postForm, 
                              officialAudioUrl: e.target.value,
                              humanVoiceUrl: e.target.value 
                            })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-400 block mb-1">Speech Language (تلاوت کی زبان)</label>
                          <select 
                            value={postForm.language || 'auto'} 
                            onChange={(e) => setPostForm({ ...postForm, language: e.target.value as any })}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="auto">✨ Auto Detect (خودکار زبان کی شناخت)</option>
                            <option value="ur">🇵🇰 Urdu (اردو تلاوت)</option>
                            <option value="ar">🇸🇦 Arabic (العربية / tajweed tone)</option>
                            <option value="en">🇬🇧 English (انگریزی)</option>
                          </select>
                        </div>
                      </div>

                      <p className="text-[10px] text-emerald-200/70">
                        * Note: If officialAudioUrl is provided, the app plays the real human recitation recording. Otherwise, it generates high-quality AI voice recitation automatically.
                      </p>
                    </div>

                    {/* Additional Gallery Images Section */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-slate-300">Article Gallery Images (16:9)</label>
                        <label className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold rounded-lg cursor-pointer flex items-center gap-1 transition border border-slate-700">
                          <Plus className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add Gallery Image & Crop</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = () => {
                                  setCropperModal({ isOpen: true, imageSrc: reader.result as string, mode: 'gallery' });
                                };
                                reader.readAsDataURL(file);
                              }
                              e.target.value = '';
                            }}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {postForm.images && postForm.images.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 pt-1">
                          {postForm.images.map((img, idx) => (
                            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 group bg-slate-950 flex items-center justify-center">
                              <img src={img} alt={`Gallery ${idx}`} className="max-h-full max-w-full object-contain mx-auto" />
                              <div className="absolute inset-0 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setCropperModal({ isOpen: true, imageSrc: img, mode: 'gallery', galleryIndex: idx })}
                                  className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition"
                                  title="Crop this image to 16:9"
                                >
                                  <Crop className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPostForm({ ...postForm, images: postForm.images?.filter((_, i) => i !== idx) })}
                                  className="p-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg transition"
                                  title="Remove image"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-slate-500 italic pt-1">No additional gallery images added.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-xs">
                    <input 
                      type="checkbox" 
                      checked={postForm.isDraft || false} 
                      onChange={(e) => setPostForm({ ...postForm, isDraft: e.target.checked })}
                      className="w-4 h-4 text-emerald-800"
                    />
                    Save as Draft (Draft status)
                  </label>
                </div>
                <div className="flex gap-2">
                  {editingPost && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingPost(null);
                        setPostForm({
                          title: '', titleUrdu: '', category: 'caliphs', shortDescription: '', shortDescriptionUrdu: '',
                          completeArticle: '', completeArticleUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
                          images: [], pdfUrl: '', audioUrl: '', videoUrl: '', tags: [], city: '', country: '', shrineName: '', scholarName: '', isDraft: false
                        });
                      }}
                      className="bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2 px-4 rounded-xl"
                    >
                      Cancel Edit
                    </button>
                  )}
                  <button 
                    type="submit" 
                    className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
                  >
                    {editingPost ? 'Update Post' : 'Save & Publish Post'}
                  </button>
                </div>
              </div>
            </form>

            {/* List of current CMS posts with Bulk Actions & Checkboxes */}
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-slate-300">Published CMS Articles ({posts.length})</h4>
                <span className="text-[10px] text-slate-400 font-mono">Multi-select enabled</span>
              </div>

              {/* Bulk Actions Floating Bar */}
              {selectedCmsPostIds.length > 0 && (
                <div className="bg-emerald-950/95 text-white p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl border border-emerald-700/80 animate-fadeIn">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-xs text-emerald-200">
                      {selectedCmsPostIds.length} Post(s) Selected
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBulkShowCmsPosts}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-emerald-600 shadow-sm"
                      title="Publish/Show Selected Posts"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show / Publish</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkHideCmsPosts}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-amber-600 shadow-sm"
                      title="Hide Selected Posts"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkDeleteCmsPosts}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-rose-500 shadow-sm"
                      title="Delete Selected Posts"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedCmsPostIds([])}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700"
                      title="Clear Selection"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-inner">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 select-none">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllCmsPostsSelected}
                            onChange={handleSelectAllCmsPosts}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-700 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            title="Select / Deselect All Posts"
                          />
                        </th>
                        <th className="p-3">Title & Category</th>
                        <th className="p-3">Published Date</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80">
                      {posts.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-slate-500 italic">
                            No articles published yet.
                          </td>
                        </tr>
                      ) : (
                        posts.map((post) => {
                          const isSelected = selectedCmsPostIds.includes(post.id);

                          return (
                            <tr 
                              key={post.id} 
                              className={`transition ${
                                isSelected ? 'bg-emerald-950/40 border-l-4 border-l-emerald-500' : 'hover:bg-slate-800/30'
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectCmsPost(post.id)}
                                  className="w-4 h-4 text-emerald-600 rounded border-slate-700 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                />
                              </td>
                              <td className="p-3">
                                <div className="font-bold text-slate-100 text-xs">{post.title}</div>
                                {post.titleUrdu && <div className="text-[11px] text-slate-400 font-urdu">{post.titleUrdu}</div>}
                                <span className="text-[9px] uppercase font-bold text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/50 inline-block mt-1">
                                  {post.category}
                                </span>
                              </td>
                              <td className="p-3 text-slate-400 font-mono text-[11px]">
                                📅 {post.publishDate}
                              </td>
                              <td className="p-3">
                                {post.status === 'published' ? (
                                  <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded font-bold text-[10px]">
                                    Published
                                  </span>
                                ) : (
                                  <span className="bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-bold text-[10px]">
                                    Hidden
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  {onToggleHidePost && (
                                    <button
                                      type="button"
                                      title={post.status === 'published' ? 'Hide Post' : 'Publish Post'}
                                      onClick={() => onToggleHidePost(post)}
                                      className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                                        post.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900' : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                                      }`}
                                    >
                                      {post.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                                    </button>
                                  )}
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setEditingPost(post);
                                      setPostForm({ ...post });
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="p-1.5 bg-slate-800 text-emerald-400 border border-slate-700 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors"
                                    title="Edit Post"
                                  >
                                    <Edit size={14} />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setDeleteConfirmState({
                                        title: 'Delete Article / Post',
                                        message: `Are you sure you want to permanently delete post "${post.titleUrdu || post.title}"?`,
                                        onConfirm: () => {
                                          if (editingPost?.id === post.id) {
                                            setEditingPost(null);
                                          }
                                          onDeletePost(post.id);
                                          showAdminToast(`Post "${post.titleUrdu || post.title}" deleted successfully!`, 'success');
                                        }
                                      });
                                    }}
                                    className="p-1.5 bg-slate-800 text-rose-400 border border-slate-700 hover:bg-rose-900 hover:text-white rounded-lg transition-colors"
                                    title="Delete Post"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ==================== INFORMATION CENTER CMS TAB ==================== */}
        {activeTab === 'info_pages' && (
          <div className="space-y-6">
            
            {/* Create / Edit Info Page Form */}
            <form onSubmit={handleInfoPageSubmit} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-emerald-400">
                  {editingInfoPage ? `✍️ Edit Information Page: ${editingInfoPage.title}` : '➕ Create New Dynamic Information Page'}
                </h3>
                {editingInfoPage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingInfoPage(null);
                      setInfoPageForm({
                        title: '', titleUrdu: '', slug: '', shortDescription: '', shortDescriptionUrdu: '',
                        content: '', contentUrdu: '',
                        bannerImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
                        featuredImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600',
                        status: 'published', displayOrder: infoPages.length + 1, youtubeUrl: '', externalLinks: []
                      });
                    }}
                    className="text-[10px] bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg hover:bg-slate-700 font-bold"
                  >
                    Cancel Editing
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Page Title (English) *</label>
                  <input 
                    type="text" 
                    required 
                    value={infoPageForm.title || ''} 
                    onChange={(e) => {
                      const title = e.target.value;
                      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setInfoPageForm({ ...infoPageForm, title, slug: editingInfoPage ? infoPageForm.slug : slug });
                    }}
                    placeholder="e.g., About Us, Terms & Conditions"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Page Title (Urdu / اردو عنوان)</label>
                  <input 
                    type="text" 
                    value={infoPageForm.titleUrdu || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, titleUrdu: e.target.value })}
                    placeholder="مثلاً: ہمارے بارے میں، قواعد و ضوابط"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">URL Slug (Auto-generated)</label>
                  <input 
                    type="text" 
                    value={infoPageForm.slug || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, slug: e.target.value })}
                    placeholder="e.g. about-us, privacy-policy"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-emerald-400" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Short Description (English)</label>
                  <textarea 
                    rows={2}
                    value={infoPageForm.shortDescription || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, shortDescription: e.target.value })}
                    placeholder="Brief summary of this page for list view cards..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white resize-none" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Short Description (Urdu / مختصر تفصیل)</label>
                  <textarea 
                    rows={2}
                    value={infoPageForm.shortDescriptionUrdu || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, shortDescriptionUrdu: e.target.value })}
                    placeholder="صفحے کا مختصر خلاصہ اردو میں..."
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right resize-none" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Banner Image URL</label>
                  <input 
                    type="text" 
                    value={infoPageForm.bannerImage || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, bannerImage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Featured Image URL</label>
                  <input 
                    type="text" 
                    value={infoPageForm.featuredImage || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, featuredImage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Publication Status</label>
                    <select 
                      value={infoPageForm.status || 'published'} 
                      onChange={(e) => setInfoPageForm({ ...infoPageForm, status: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="published">🟢 Published</option>
                      <option value="draft">🟡 Draft</option>
                      <option value="hidden">🔴 Hidden</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Display Order</label>
                    <input 
                      type="number" 
                      min={1}
                      value={infoPageForm.displayOrder || 1} 
                      onChange={(e) => setInfoPageForm({ ...infoPageForm, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Embedded YouTube Video URL (Optional)</label>
                <input 
                  type="text" 
                  value={infoPageForm.youtubeUrl || ''} 
                  onChange={(e) => setInfoPageForm({ ...infoPageForm, youtubeUrl: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Full HTML/Rich Content (English)</label>
                  <textarea 
                    rows={6}
                    value={infoPageForm.content || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, content: e.target.value })}
                    placeholder="<h3>Section Title</h3><p>Detailed body content with HTML formatting...</p>"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono resize-y" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Full HTML/Rich Content (Urdu / اردو تفصیلات)</label>
                  <textarea 
                    rows={6}
                    value={infoPageForm.contentUrdu || ''} 
                    onChange={(e) => setInfoPageForm({ ...infoPageForm, contentUrdu: e.target.value })}
                    placeholder="<h3>سرخی</h3><p>مفصل تفاصیل ایچ ٹی ایم ایل کے ساتھ...</p>"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right font-mono resize-y" 
                  />
                </div>
              </div>

              {/* External links section */}
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                <label className="text-[10px] font-bold text-slate-400 block mb-2">External Links (Optional)</label>
                <div className="flex gap-2 mb-2">
                  <input 
                    type="text" 
                    value={linkInput.label} 
                    onChange={(e) => setLinkInput({ ...linkInput, label: e.target.value })}
                    placeholder="Link Label (e.g. Official Website)" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                  <input 
                    type="url" 
                    value={linkInput.url} 
                    onChange={(e) => setLinkInput({ ...linkInput, url: e.target.value })}
                    placeholder="https://example.com" 
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!linkInput.label || !linkInput.url) return;
                      const links = infoPageForm.externalLinks || [];
                      setInfoPageForm({ ...infoPageForm, externalLinks: [...links, linkInput] });
                      setLinkInput({ label: '', url: '' });
                    }}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs"
                  >
                    Add Link
                  </button>
                </div>
                {infoPageForm.externalLinks && infoPageForm.externalLinks.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {infoPageForm.externalLinks.map((lnk, idx) => (
                      <span key={idx} className="bg-slate-800 border border-slate-700 text-slate-300 text-[11px] px-2.5 py-1 rounded-lg flex items-center gap-1.5">
                        <Link size={12} className="text-emerald-400" />
                        <strong>{lnk.label}</strong>: {lnk.url}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = infoPageForm.externalLinks?.filter((_, i) => i !== idx);
                            setInfoPageForm({ ...infoPageForm, externalLinks: updated });
                          }}
                          className="text-red-400 hover:text-red-300 ml-1 font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="submit" 
                  className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg"
                >
                  <Plus size={14} /> {editingInfoPage ? 'Update Information Page' : 'Publish Information Page'}
                </button>
              </div>
            </form>

            {/* List of Current Information Pages */}
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-xs text-slate-300">
                  Information Center CMS Pages ({infoPages.length})
                </h4>
                <span className="text-[10px] text-slate-500">
                  Synced directly with Firestore <code className="text-emerald-400">info_pages</code> collection
                </span>
              </div>

              <div className="space-y-2">
                {infoPages
                  .slice()
                  .sort((a, b) => a.displayOrder - b.displayOrder)
                  .map((page) => (
                    <div key={page.id} className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl border border-slate-700 shrink-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                          <img 
                            src={page.featuredImage || page.bannerImage || undefined} 
                            alt={page.title} 
                            className="max-h-full max-w-full object-contain mx-auto" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h5 className="font-bold text-xs text-white">{page.title}</h5>
                            <span className="text-[10px] font-bold text-amber-400 font-serif">{page.titleUrdu}</span>
                            
                            {/* Order badge */}
                            <span className="text-[9px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded-full border border-slate-700">
                              Order: #{page.displayOrder}
                            </span>

                            {/* Status badge */}
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              page.status === 'published' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800' :
                              page.status === 'draft' ? 'bg-amber-950/80 text-amber-400 border border-amber-800' :
                              'bg-red-950/80 text-red-400 border border-red-800'
                            }`}>
                              {page.status}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{page.shortDescription}</p>
                          
                          <div className="flex items-center gap-3 text-[10px] text-slate-500 font-mono mt-1">
                            <span>Slug: /{page.slug}</span>
                            <span>Updated: {new Date(page.updatedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center gap-1.5 self-end md:self-center shrink-0">
                        {/* Quick toggle status */}
                        <button
                          title={page.status === 'published' ? 'Hide Page' : 'Publish Page'}
                          onClick={() => {
                            const newStatus = page.status === 'published' ? 'hidden' : 'published';
                            onEditInfoPage({ ...page, status: newStatus, updatedAt: new Date().toISOString() });
                          }}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            page.status === 'published' ? 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900' : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {page.status === 'published' ? <Eye size={14} /> : <EyeOff size={14} />}
                        </button>

                        {/* Edit button */}
                        <button 
                          onClick={() => {
                            setEditingInfoPage(page);
                            setInfoPageForm({ ...page });
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-1.5 bg-slate-800 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors"
                          title="Edit Page"
                        >
                          <Edit size={14} />
                        </button>

                        {/* Delete button */}
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Info Page',
                              message: `Are you sure you want to delete "${page.title}" page?`,
                              onConfirm: () => onDeleteInfoPage(page.id)
                            });
                          }}
                          className="p-1.5 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
                          title="Delete Page"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== CATEGORIES TAB ==================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            
            {/* Create Category form */}
            <form onSubmit={handleCategorySubmit} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">➕ Create New Content Category</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Category English Name</label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.name} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Category Urdu Name (اردو نام)</label>
                  <input 
                    type="text" 
                    required 
                    value={categoryForm.nameUrdu} 
                    onChange={(e) => setCategoryForm({ ...categoryForm, nameUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Category Description</label>
                <input 
                  type="text" 
                  value={categoryForm.description} 
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                />
              </div>

              <button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
              >
                Create Category
              </button>
            </form>

            {/* List of current Categories */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active Content Categories ({categories.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {categories.map(c => (
                  <div key={c.id} className="p-2.5 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-xs">{c.name}</h5>
                      <p className="text-[9px] text-emerald-400 mt-0.5">{c.nameUrdu}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {onToggleHideCategory && (
                        <button
                          title={(c as any).status === 'hidden' ? 'Unhide Category' : 'Hide Category'}
                          onClick={() => onToggleHideCategory(c)}
                          className={`p-1 rounded text-xs font-bold transition-all ${
                            (c as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(c as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      )}
                      {onDeleteCategory && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Category',
                              message: `Are you sure you want to delete category "${c.name}"?`,
                              onConfirm: () => onDeleteCategory(c.id)
                            });
                          }}
                          className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors"
                          title="Delete Category"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== PDF LIBRARY TAB ==================== */}
        {activeTab === 'pdfs' && (
          <div className="space-y-6">
            
            {/* Create PDF Form */}
            <form onSubmit={handlePdfSubmit} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl text-left space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">➕ Digitization: Upload PDF Book to Library</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Book Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={pdfForm.title} 
                    onChange={(e) => setPdfForm({ ...pdfForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Book Title (Urdu / اردو کتاب کا نام)</label>
                  <input 
                    type="text" 
                    required 
                    value={pdfForm.titleUrdu} 
                    onChange={(e) => setPdfForm({ ...pdfForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Author Name (English & Urdu)</label>
                  <input 
                    type="text" 
                    required 
                    value={pdfForm.author} 
                    onChange={(e) => setPdfForm({ ...pdfForm, author: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Pages Count</label>
                  <input 
                    type="number" 
                    value={pdfForm.pages} 
                    onChange={(e) => setPdfForm({ ...pdfForm, pages: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">File Size</label>
                  <input 
                    type="text" 
                    value={pdfForm.size} 
                    onChange={(e) => setPdfForm({ ...pdfForm, size: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    value={pdfForm.coverImage} 
                    onChange={(e) => setPdfForm({ ...pdfForm, coverImage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <GoogleDriveLinkInput
                    label="PDF File URL / Google Drive Link"
                    placeholder="Paste Google Drive link or direct PDF URL..."
                    value={pdfForm.pdfUrl}
                    onChange={(url) => setPdfForm({ ...pdfForm, pdfUrl: url })}
                    expectedType="pdf"
                    required
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
              >
                Upload & Digitizing PDF Book
              </button>
            </form>

            {/* List of current PDFs */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active Library PDFs ({pdfs.length})</h4>
              <div className="space-y-2">
                {pdfs.map(b => (
                  <div key={b.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-xs">{b.title}</h5>
                      <p className="text-[9px] text-slate-400">👤 Author: {b.author} | Pages: {b.pages} | Size: {b.size}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {onToggleHidePdf && (
                        <button
                          title={(b as any).status === 'hidden' ? 'Unhide PDF' : 'Hide PDF'}
                          onClick={() => onToggleHidePdf(b)}
                          className={`p-1 rounded text-xs font-bold transition-all ${
                            (b as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(b as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      )}
                      {onDeletePdf && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete PDF Book',
                              message: `Are you sure you want to delete PDF book "${b.title}"?`,
                              onConfirm: () => onDeletePdf(b.id)
                            });
                          }}
                          className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors"
                          title="Delete PDF"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== MEDIA CENTER TAB ==================== */}
        {activeTab === 'media' && (
          <div className="space-y-6 text-left">
            
            {/* Audio Upload form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddAudio({
                id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                title: audioForm.title,
                titleUrdu: audioForm.titleUrdu,
                artist: audioForm.artist,
                artistUrdu: audioForm.artistUrdu,
                category: audioForm.category,
                audioUrl: audioForm.audioUrl,
                duration: audioForm.duration,
                size: audioForm.size,
                publishDate: new Date().toISOString().split('T')[0]
              });
              setAudioForm({ title: '', titleUrdu: '', artist: '', artistUrdu: '', category: 'bayan', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '10:00', size: '5 MB' });
              alert('New spiritual audio track successfully added!');
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">🎵 Add New Spiritual Audio (Bayan/Naat/Dhikr)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Audio Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={audioForm.title} 
                    onChange={(e) => setAudioForm({ ...audioForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Audio Title (Urdu / کلام عنوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={audioForm.titleUrdu} 
                    onChange={(e) => setAudioForm({ ...audioForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Artist (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={audioForm.artist} 
                    onChange={(e) => setAudioForm({ ...audioForm, artist: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Artist (Urdu / ثناء خوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={audioForm.artistUrdu} 
                    onChange={(e) => setAudioForm({ ...audioForm, artistUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Classification Category</label>
                  <select 
                    value={audioForm.category} 
                    onChange={(e) => setAudioForm({ ...audioForm, category: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="bayan">Bayan (Sermons)</option>
                    <option value="naat">Naat Sharif</option>
                    <option value="dhikr">Dhikr Gathering</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Track Duration</label>
                  <input 
                    type="text" 
                    value={audioForm.duration} 
                    onChange={(e) => setAudioForm({ ...audioForm, duration: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
              >
                Upload Audio Track
              </button>
            </form>

            {/* Video Upload Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onAddVideo({
                id: `vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                title: videoForm.title,
                titleUrdu: videoForm.titleUrdu,
                youtubeId: videoForm.youtubeId,
                category: videoForm.category,
                duration: videoForm.duration,
                speaker: videoForm.speaker,
                publishDate: new Date().toISOString().split('T')[0]
              });
              setVideoForm({ title: '', titleUrdu: '', youtubeId: 'dQw4w9WgXcQ', category: 'bayan', duration: '20:00', speaker: 'Allama Usmani' });
              alert('New video sermon has been embedded successfully!');
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-red-500">🎥 Embed YouTube Video (Lectures/Shorts/Naats)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Video Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={videoForm.title} 
                    onChange={(e) => setVideoForm({ ...videoForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Video Title (Urdu / ویڈیو خطاب عنوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={videoForm.titleUrdu} 
                    onChange={(e) => setVideoForm({ ...videoForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">YouTube Video ID (or URL)</label>
                  <input 
                    type="text" 
                    required 
                    value={videoForm.youtubeId} 
                    onChange={(e) => setVideoForm({ ...videoForm, youtubeId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Video Classification</label>
                  <select 
                    value={videoForm.category} 
                    onChange={(e) => setVideoForm({ ...videoForm, category: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="bayan">Bayan (Lectures)</option>
                    <option value="naat">Naat Sharif</option>
                    <option value="live">Live Broadcasting</option>
                    <option value="shorts">Shorts</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Speaker / Preacher</label>
                  <input 
                    type="text" 
                    value={videoForm.speaker} 
                    onChange={(e) => setVideoForm({ ...videoForm, speaker: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-red-700 hover:bg-red-600 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
              >
                Embed Video
              </button>
            </form>

            {/* List of current Audio Tracks */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active Audio Tracks ({audios.length})</h4>
              <div className="space-y-2">
                {audios.map(a => (
                  <div key={a.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-xs">{a.title} <span className="text-amber-400 text-[10px] font-serif">({a.titleUrdu})</span></h5>
                      <p className="text-[9px] text-slate-400">🎤 {a.artist} | Category: {a.category} | Duration: {a.duration}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {onToggleHideAudio && (
                        <button
                          title={(a as any).status === 'hidden' ? 'Unhide Track' : 'Hide Track'}
                          onClick={() => onToggleHideAudio(a)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            (a as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(a as any).status === 'hidden' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      {onDeleteAudio && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Audio Track',
                              message: `Are you sure you want to delete audio track "${a.title}"?`,
                              onConfirm: () => onDeleteAudio(a.id)
                            });
                          }}
                          className="p-1.5 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
                          title="Delete Audio"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of current YouTube Videos */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active YouTube Videos ({videos.length})</h4>
              <div className="space-y-2">
                {videos.map(v => (
                  <div key={v.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center">
                    <div>
                      <h5 className="font-bold text-xs">{v.title} <span className="text-amber-400 text-[10px] font-serif">({v.titleUrdu})</span></h5>
                      <p className="text-[9px] text-slate-400">👤 Preacher: {v.speaker} | Category: {v.category} | Duration: {v.duration}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {onToggleHideVideo && (
                        <button
                          title={(v as any).status === 'hidden' ? 'Unhide Video' : 'Hide Video'}
                          onClick={() => onToggleHideVideo(v)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            (v as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(v as any).status === 'hidden' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      {onDeleteVideo && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Video',
                              message: `Are you sure you want to delete video "${v.title}"?`,
                              onConfirm: () => onDeleteVideo(v.id)
                            });
                          }}
                          className="p-1.5 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
                          title="Delete Video"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Album Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingAlbum) {
                if (onEditAlbum) {
                  onEditAlbum({
                    ...editingAlbum,
                    name: albumForm.name,
                    nameUrdu: albumForm.nameUrdu,
                    coverImage: albumForm.coverImage,
                    type: albumForm.type
                  });
                }
                setEditingAlbum(null);
                alert('Gallery album updated!');
              } else {
                if (onAddAlbum) {
                  onAddAlbum({
                    id: `alb-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    name: albumForm.name,
                    nameUrdu: albumForm.nameUrdu,
                    coverImage: albumForm.coverImage,
                    type: albumForm.type,
                    status: 'published'
                  });
                }
                alert('New gallery album created!');
              }
              setAlbumForm({ name: '', nameUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', type: 'photos' });
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">
                {editingAlbum ? '✏️ Edit Gallery Album' : '🖼️ Create New Gallery Album'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Album Name (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={albumForm.name} 
                    onChange={(e) => setAlbumForm({ ...albumForm, name: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Album Name (Urdu / البم کا نام)</label>
                  <input 
                    type="text" 
                    required 
                    value={albumForm.nameUrdu} 
                    onChange={(e) => setAlbumForm({ ...albumForm, nameUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Cover Image URL</label>
                  <input 
                    type="text" 
                    required 
                    value={albumForm.coverImage} 
                    onChange={(e) => setAlbumForm({ ...albumForm, coverImage: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Album Category Type</label>
                  <select 
                    value={albumForm.type} 
                    onChange={(e) => setAlbumForm({ ...albumForm, type: e.target.value as any })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="photos">Photos (تصاویر)</option>
                    <option value="posters">Posters & Wallpapers (پوسٹرز)</option>
                    <option value="events">Events & Programs (پروگرامز)</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
                >
                  {editingAlbum ? 'Update Album' : 'Create Album'}
                </button>
                {editingAlbum && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingAlbum(null);
                      setAlbumForm({ name: '', nameUrdu: '', coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', type: 'photos' });
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* List of Gallery Albums */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active Gallery Albums ({albums.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {albums.map(alb => (
                  <div key={alb.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg border border-slate-700 shrink-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                        <img src={alb.coverImage} alt={alb.name} className="max-h-full max-w-full object-contain mx-auto" />
                      </div>
                      <div>
                        <h5 className="font-bold text-xs">{alb.name} <span className="text-amber-400 text-[10px] font-serif">({alb.nameUrdu})</span></h5>
                        <p className="text-[9px] text-slate-400 uppercase font-mono">Type: {alb.type} | {galleryImages.filter(g => g.albumId === alb.id).length} photos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {onToggleHideAlbum && (
                        <button
                          title={(alb as any).status === 'hidden' ? 'Unhide Album' : 'Hide Album'}
                          onClick={() => onToggleHideAlbum(alb)}
                          className={`p-1.5 rounded-lg text-xs font-bold transition-all ${
                            (alb as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(alb as any).status === 'hidden' ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      )}
                      <button
                        title="Edit Album"
                        onClick={() => {
                          setEditingAlbum(alb);
                          setAlbumForm({ name: alb.name, nameUrdu: alb.nameUrdu, coverImage: alb.coverImage, type: alb.type });
                        }}
                        className="p-1.5 bg-slate-800 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded-lg transition-colors"
                      >
                        <Edit size={14} />
                      </button>
                      {onDeleteAlbum && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Gallery Album',
                              message: `Are you sure you want to delete album "${alb.name}"?`,
                              onConfirm: () => onDeleteAlbum(alb.id)
                            });
                          }}
                          className="p-1.5 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded-lg transition-colors"
                          title="Delete Album"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery Image Upload / Edit Form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              if (editingGalleryImage) {
                if (onEditGalleryImage) {
                  onEditGalleryImage({
                    ...editingGalleryImage,
                    albumId: galleryForm.albumId || albums[0]?.id || '1',
                    title: galleryForm.title,
                    titleUrdu: galleryForm.titleUrdu,
                    imageUrl: galleryForm.imageUrl,
                    description: galleryForm.description
                  });
                }
                setEditingGalleryImage(null);
                alert('Gallery photo updated!');
              } else {
                if (onAddGalleryImage) {
                  onAddGalleryImage({
                    id: `img-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                    albumId: galleryForm.albumId || albums[0]?.id || '1',
                    title: galleryForm.title,
                    titleUrdu: galleryForm.titleUrdu,
                    imageUrl: galleryForm.imageUrl,
                    description: galleryForm.description,
                    status: 'published'
                  });
                }
                alert('New photo added to gallery!');
              }
              setGalleryForm({ albumId: albums[0]?.id || '', title: '', titleUrdu: '', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', description: '' });
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-cyan-400">
                {editingGalleryImage ? '✏️ Edit Gallery Photo' : '📷 Add Photo to Gallery Album'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Gallery Album</label>
                  <select 
                    value={galleryForm.albumId} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, albumId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    {albums.map(alb => (
                      <option key={alb.id} value={alb.id}>{alb.name} ({alb.nameUrdu})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Photo Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={galleryForm.title} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Photo Title (Urdu / عنوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={galleryForm.titleUrdu} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Image URL</label>
                  <input 
                    type="text" 
                    required 
                    value={galleryForm.imageUrl} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Short Description (Optional)</label>
                  <input 
                    type="text" 
                    value={galleryForm.description} 
                    onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button 
                  type="submit" 
                  className="bg-cyan-800 hover:bg-cyan-700 text-white text-xs font-bold py-2 px-5 rounded-xl shadow-md"
                >
                  {editingGalleryImage ? 'Update Photo' : 'Add Photo to Gallery'}
                </button>
                {editingGalleryImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingGalleryImage(null);
                      setGalleryForm({ albumId: albums[0]?.id || '', title: '', titleUrdu: '', imageUrl: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=600', description: '' });
                    }}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold py-2 px-4 rounded-xl"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>

            {/* List of Gallery Images */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">Active Gallery Photos ({galleryImages.length})</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {galleryImages.map(img => {
                  const parentAlbum = albums.find(a => a.id === img.albumId);
                  return (
                    <div key={img.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex flex-col justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg border border-slate-700 shrink-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                        <img src={img.imageUrl} alt={img.title} className="max-h-full max-w-full object-contain mx-auto" />
                      </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-xs truncate">{img.title}</h5>
                          <p className="text-[10px] text-amber-400 font-serif truncate">{img.titleUrdu}</p>
                          <p className="text-[9px] text-slate-400 mt-0.5">📁 {parentAlbum ? parentAlbum.name : 'General'}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-slate-800/60">
                        {onToggleHideGalleryImage && (
                          <button
                            title={(img as any).status === 'hidden' ? 'Unhide Photo' : 'Hide Photo'}
                            onClick={() => onToggleHideGalleryImage(img)}
                            className={`p-1 rounded text-xs font-bold transition-all ${
                              (img as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                            }`}
                          >
                            {(img as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        )}
                        <button
                          title="Edit Photo"
                          onClick={() => {
                            setEditingGalleryImage(img);
                            setGalleryForm({ albumId: img.albumId, title: img.title, titleUrdu: img.titleUrdu, imageUrl: img.imageUrl, description: img.description || '' });
                          }}
                          className="p-1 bg-slate-800 text-emerald-400 hover:bg-emerald-800 hover:text-white rounded transition-colors"
                        >
                          <Edit size={13} />
                        </button>
                        {onDeleteGalleryImage && (
                          <button 
                            onClick={() => {
                              setDeleteConfirmState({
                                title: 'Delete Gallery Photo',
                                message: `Are you sure you want to delete photo "${img.title}"?`,
                                onConfirm: () => onDeleteGalleryImage(img.id)
                              });
                            }}
                            className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors"
                            title="Delete Photo"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ==================== FEEDBACK TAB ==================== */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 text-left">
            <h4 className="font-bold text-xs text-slate-300">Incoming Feedback from Members ({feedback.length})</h4>
            
            {feedback.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No feedback received yet.</p>
            ) : (
              <div className="space-y-3">
                {feedback.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-800/40 rounded-2xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-sm text-emerald-400">{item.name}</h5>
                        <p className="text-[10px] text-slate-400">{item.email} | {item.contactNumber}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-slate-500 font-mono">{item.date}</span>
                        {onToggleHideFeedback && (
                          <button
                            title={(item as any).status === 'hidden' ? 'Unhide Feedback' : 'Hide Feedback'}
                            onClick={() => onToggleHideFeedback(item)}
                            className={`p-1 rounded text-xs font-bold transition-all ${
                              (item as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                            }`}
                          >
                            {(item as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        )}
                        {onDeleteFeedback && (
                          <button 
                            onClick={() => {
                              setDeleteConfirmState({
                                title: 'Delete Feedback',
                                message: `Are you sure you want to delete feedback from "${item.name}"?`,
                                onConfirm: () => onDeleteFeedback(item.id)
                              });
                            }}
                            className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors"
                            title="Delete Feedback"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="border-l-2 border-slate-700 pl-3 py-1">
                      <p className="text-xs font-bold text-slate-200">Subject: {item.subject}</p>
                      <p className="text-xs text-slate-300 mt-1">{item.message}</p>
                    </div>

                    {/* Reply section */}
                    {item.replied ? (
                      <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-900 text-xs">
                        <span className="font-bold text-emerald-400">Your reply ({item.replyDate}):</span>
                        <p className="mt-1 text-slate-300 italic">"{item.replyMessage}"</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase font-bold text-slate-400 block">Formulate Reply message</label>
                        <div className="flex gap-2">
                          <input 
                            type="text" 
                            placeholder="Write compassionate reply..."
                            value={feedbackReply[item.id] || ''}
                            onChange={(e) => setFeedbackReply({ ...feedbackReply, [item.id]: e.target.value })}
                            className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs"
                          />
                          <button 
                            onClick={() => {
                              const msg = feedbackReply[item.id];
                              if (!msg) return;
                              onReplyFeedback(item.id, msg);
                              setFeedbackReply({ ...feedbackReply, [item.id]: '' });
                            }}
                            className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-1.5 px-4 rounded-xl"
                          >
                            Send Reply
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== BROADCAST NOTIFICATIONS TAB ==================== */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 text-left">
            
            {/* Broadcaster form */}
            <form onSubmit={handleNotificationSubmit} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-amber-500">📢 Firebase Cloud Messaging: Send Global Push Notification</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Notification Title (English)</label>
                  <input 
                    type="text" 
                    required 
                    value={notificationForm.title} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, title: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Notification Title (Urdu / نوٹیفکیشن عنوان)</label>
                  <input 
                    type="text" 
                    required 
                    value={notificationForm.titleUrdu} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Body Text (English)</label>
                  <textarea 
                    rows={2} 
                    required 
                    value={notificationForm.body} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, body: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Body Text (Urdu / پیغام)</label>
                  <textarea 
                    rows={2} 
                    required 
                    value={notificationForm.bodyUrdu} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, bodyUrdu: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Notification Type</label>
                  <select 
                    value={notificationForm.type} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, type: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="announcement">Announcement (اعلانات)</option>
                    <option value="article">New Article (مضمون)</option>
                    <option value="pdf">New Book PDF (کتاب)</option>
                    <option value="video">New Video (ویڈیو)</option>
                    <option value="event">Event Reminder (پروگرام)</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Action ID (Optional navigation to post/book)</label>
                  <select 
                    value={notificationForm.targetId} 
                    onChange={(e) => setNotificationForm({ ...notificationForm, targetId: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="">No redirection (Open Home)</option>
                    <option disabled value="">--- Articles ---</option>
                    {posts.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                    <option disabled value="">--- PDFs ---</option>
                    {pdfs.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black py-2.5 px-6 rounded-xl shadow-lg flex items-center gap-2"
              >
                <Bell size={16} /> Broadcast Notification via FCM
              </button>
            </form>

            {/* Notification History list */}
            <div className="space-y-2 text-left">
              <h4 className="font-bold text-xs text-slate-300">History of Sent Notifications ({notifications.length})</h4>
              <div className="space-y-2">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 bg-slate-800/40 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <h5 className="font-bold text-amber-400">{n.title}</h5>
                      <p className="text-slate-300 mt-0.5">{n.body}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                        {n.date}
                      </span>
                      {onToggleHideNotification && (
                        <button
                          title={(n as any).status === 'hidden' ? 'Unhide Notification' : 'Hide Notification'}
                          onClick={() => onToggleHideNotification(n)}
                          className={`p-1 rounded text-xs font-bold transition-all ${
                            (n as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                          }`}
                        >
                          {(n as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      )}
                      {onDeleteNotification && (
                        <button 
                          onClick={() => {
                            setDeleteConfirmState({
                              title: 'Delete Notification',
                              message: `Are you sure you want to delete notification "${n.title}"?`,
                              onConfirm: () => onDeleteNotification(n.id)
                            });
                          }}
                          className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors"
                          title="Delete Notification"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ==================== APP CONFIGS & SOCIAL SETTINGS ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 text-left">
            
            {/* Contact info form */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateContactInfo(contactForm);
              alert('Contact information updated successfully inside mobile databases!');
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-emerald-400">📞 Contact & Address Information Configuration</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Phone Helpline Number</label>
                  <input 
                    type="text" 
                    value={contactForm.mobile} 
                    onChange={(e) => setContactForm({ ...contactForm, mobile: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">WhatsApp Channel Number</label>
                  <input 
                    type="text" 
                    value={contactForm.whatsApp} 
                    onChange={(e) => setContactForm({ ...contactForm, whatsApp: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={contactForm.email} 
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Official Website Domain</label>
                  <input 
                    type="text" 
                    value={contactForm.website} 
                    onChange={(e) => setContactForm({ ...contactForm, website: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">Office Location Address (English)</label>
                <input 
                  type="text" 
                  value={contactForm.officeAddress} 
                  onChange={(e) => setContactForm({ ...contactForm, officeAddress: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                />
              </div>

              <button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl"
              >
                Update Contact Information
              </button>
            </form>

            {/* Social Links Config */}
            <form onSubmit={(e) => {
              e.preventDefault();
              onUpdateSocialLinks(socialForm);
              alert('Official social channel connections synchronized!');
            }} className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <h3 className="font-bold text-sm text-blue-400">🔗 Official Social Media Integration Handles</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Facebook Handle</label>
                  <input 
                    type="text" 
                    value={socialForm.facebook} 
                    onChange={(e) => setSocialForm({ ...socialForm, facebook: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">YouTube Channel URL</label>
                  <input 
                    type="text" 
                    value={socialForm.youtube} 
                    onChange={(e) => setSocialForm({ ...socialForm, youtube: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Instagram Handle</label>
                  <input 
                    type="text" 
                    value={socialForm.instagram} 
                    onChange={(e) => setSocialForm({ ...socialForm, instagram: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Telegram Group link</label>
                  <input 
                    type="text" 
                    value={socialForm.telegram} 
                    onChange={(e) => setSocialForm({ ...socialForm, telegram: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2 px-5 rounded-xl"
              >
                Synchronize Social Channels
              </button>
            </form>

            {/* AI Voice Reader / Audio Recitation Configuration Form */}
            <form onSubmit={async (e) => {
              e.preventDefault();
              try {
                const { updateVoiceReaderSettings } = await import('../lib/firestoreVoiceReader');
                await updateVoiceReaderSettings(voiceSettingsForm);
              } catch (err) {
                console.warn('Note on Firestore update:', err);
              }
              if (onUpdateVoiceReaderSettings) {
                onUpdateVoiceReaderSettings(voiceSettingsForm);
              }
              showAdminToast('AI Voice Reader & Speech Recitation configuration saved to Firestore!', 'success');
            }} className="bg-slate-800/30 border border-emerald-800/60 p-5 rounded-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-bold text-sm text-amber-300 flex items-center gap-2 font-serif">
                  <span>🔊</span>
                  <span>AI Voice Reader & Audio Recitation Engine Config (Firestore: settings/voiceReader)</span>
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold px-2.5 py-0.5 rounded-full">
                  Urdu / Arabic / English TTS
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-white block">Enable Global AI Voice Reader (globalEnabled)</label>
                    <span className="text-[10px] text-slate-400 block">Show "Listen (🔊 سنیں)" button across all articles</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={voiceSettingsForm.globalEnabled !== false && voiceSettingsForm.enabled !== false}
                    onChange={(e) => setVoiceSettingsForm({ 
                      ...voiceSettingsForm, 
                      globalEnabled: e.target.checked,
                      enabled: e.target.checked 
                    })}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-white block">Auto Language Detection (autoLanguageDetection)</label>
                    <span className="text-[10px] text-slate-400 block">Detect language automatically based on text script</span>
                  </div>
                  <input 
                    type="checkbox"
                    checked={voiceSettingsForm.autoLanguageDetection !== false}
                    onChange={(e) => setVoiceSettingsForm({ ...voiceSettingsForm, autoLanguageDetection: e.target.checked })}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Default Urdu Voice (defaultVoiceUr)</label>
                  <input 
                    type="text" 
                    value={voiceSettingsForm.defaultVoiceUr || 'ur-PK'} 
                    onChange={(e) => setVoiceSettingsForm({ ...voiceSettingsForm, defaultVoiceUr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="ur-PK"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Default Arabic Voice (defaultVoiceAr)</label>
                  <input 
                    type="text" 
                    value={voiceSettingsForm.defaultVoiceAr || 'ar-SA'} 
                    onChange={(e) => setVoiceSettingsForm({ ...voiceSettingsForm, defaultVoiceAr: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="ar-SA"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Default English Voice (defaultVoiceEn)</label>
                  <input 
                    type="text" 
                    value={voiceSettingsForm.defaultVoiceEn || 'en-US'} 
                    onChange={(e) => setVoiceSettingsForm({ ...voiceSettingsForm, defaultVoiceEn: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    placeholder="en-US"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Default Speed (defaultSpeed: 0.75 - 1.5)</label>
                  <select 
                    value={voiceSettingsForm.defaultSpeed ?? voiceSettingsForm.readingSpeed ?? 1.0} 
                    onChange={(e) => setVoiceSettingsForm({ 
                      ...voiceSettingsForm, 
                      defaultSpeed: parseFloat(e.target.value),
                      readingSpeed: parseFloat(e.target.value)
                    })}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value={0.75}>0.75x (Slow, Melodious & Clear)</option>
                    <option value={1.0}>1.0x (Normal Pace - Recommended)</option>
                    <option value={1.25}>1.25x (Slightly Faster)</option>
                    <option value={1.5}>1.5x (Fast Reading)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Default Volume (defaultVolume: {Math.round((voiceSettingsForm.defaultVolume ?? voiceSettingsForm.volume ?? 1) * 100)}%)</label>
                  <input 
                    type="range"
                    min={0.1}
                    max={1.0}
                    step={0.1}
                    value={voiceSettingsForm.defaultVolume ?? voiceSettingsForm.volume ?? 1.0}
                    onChange={(e) => setVoiceSettingsForm({ 
                      ...voiceSettingsForm, 
                      defaultVolume: parseFloat(e.target.value),
                      volume: parseFloat(e.target.value)
                    })}
                    className="w-full h-2 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-slate-800 mt-2"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-black py-2.5 px-6 rounded-xl shadow-lg flex items-center gap-2 transition"
              >
                <span>💾</span> Save Voice Reader Settings to Firestore
              </button>
            </form>

          </div>
        )}

        {/* ==================== 19. DONATIONS AND CAMPAIGNS LEDGER TAB ==================== */}
        {activeTab === 'donations' && (
          <div className="space-y-6 text-left">
            
            {/* Header statistics info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Total Funds Raised</span>
                <h3 className="text-2xl font-black mt-1 text-emerald-400">
                  PKR {donationInitiatives.reduce((acc, init) => acc + (Number(init.raisedAmount) || 0), 0).toLocaleString()}
                </h3>
                <p className="text-[9px] text-slate-500">Across all active & completed campaigns</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Pending Receipts</span>
                <h3 className="text-2xl font-black mt-1 text-amber-400">
                  {donationRecords.filter(r => r.status === 'pending').length}
                </h3>
                <p className="text-[9px] text-slate-500">Awaiting Super Admin manual verification</p>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-2xl border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400">Campaign Campaigns</span>
                <h3 className="text-2xl font-black mt-1 text-blue-400">
                  {donationInitiatives.length}
                </h3>
                <p className="text-[9px] text-slate-500">{donationInitiatives.filter(i => i.active).length} Active | {donationInitiatives.filter(i => !i.active).length} Closed</p>
              </div>
            </div>

            {/* Campaign Form & Existing Initiatives */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Campaign creation */}
              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4 lg:col-span-1">
                <h3 className="font-bold text-sm text-emerald-400">📢 Launch Campaign Campaign</h3>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!initiativeForm.title || !initiativeForm.titleUrdu) return;
                    onAddDonationInitiative({
                      id: `init-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                      title: initiativeForm.title,
                      titleUrdu: initiativeForm.titleUrdu,
                      description: initiativeForm.description,
                      descriptionUrdu: initiativeForm.descriptionUrdu,
                      goalAmount: Number(initiativeForm.goalAmount) || 0,
                      raisedAmount: 0,
                      image: initiativeForm.image,
                      active: true
                    });
                    setInitiativeForm({
                      title: '',
                      titleUrdu: '',
                      description: '',
                      descriptionUrdu: '',
                      goalAmount: 500000,
                      image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=600',
                      active: true
                    });
                    alert('New campaign initiative published to mobile devices!');
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Campaign Title (English)</label>
                    <input 
                      type="text" 
                      required
                      value={initiativeForm.title}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, title: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Campaign Title (Urdu)</label>
                    <input 
                      type="text" 
                      required
                      value={initiativeForm.titleUrdu}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, titleUrdu: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right font-serif" 
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Description (English)</label>
                    <textarea 
                      rows={2}
                      value={initiativeForm.description}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, description: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Description (Urdu)</label>
                    <textarea 
                      rows={2}
                      value={initiativeForm.descriptionUrdu}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, descriptionUrdu: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white text-right font-serif" 
                      dir="rtl"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Target Goal (PKR)</label>
                    <input 
                      type="number" 
                      value={initiativeForm.goalAmount}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, goalAmount: Number(e.target.value) || 0 })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-bold" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Campaign Cover Photo URL</label>
                    <input 
                      type="text" 
                      value={initiativeForm.image}
                      onChange={(e) => setInitiativeForm({ ...initiativeForm, image: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="w-full bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-xl transition-all shadow-md"
                  >
                    🚀 Launch Campaign
                  </button>
                </form>
              </div>

              {/* Existing Initiatives list */}
              <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4 lg:col-span-2">
                <h3 className="font-bold text-sm text-blue-400">📋 Published Initiatives & Trackers</h3>
                
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {donationInitiatives.map((init) => {
                    const raised = Number(init.raisedAmount) || 0;
                    const goal = Number(init.goalAmount) || 1;
                    const rawPercent = Math.round((raised / (goal > 0 ? goal : 1)) * 100);
                    const percent = isNaN(rawPercent) ? 0 : Math.min(100, Math.max(0, rawPercent));
                    return (
                      <div 
                        key={init.id}
                        className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                      >
                        <div className="flex gap-3 items-center min-w-0 flex-1">
                          <div className="w-14 h-14 rounded-lg border border-slate-700 shrink-0 bg-slate-950 flex items-center justify-center overflow-hidden">
                            <img src={init.image || undefined} className="max-h-full max-w-full object-contain mx-auto" alt="" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-200 leading-tight flex items-center gap-1.5">
                              <span>{init.title}</span>
                              <span className="text-[9px] font-serif font-normal text-emerald-500">({init.titleUrdu})</span>
                            </h4>
                            <p className="text-[10px] text-slate-500 truncate max-w-sm mt-0.5">{init.description}</p>
                            
                            {/* Progress info */}
                            <div className="flex items-center gap-2 mt-1.5">
                              <div className="w-32 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                              </div>
                              <span className="text-[9px] font-mono text-slate-400 font-bold">
                                {percent}% ({(Number(init.raisedAmount) || 0).toLocaleString()} / {(Number(init.goalAmount) || 0).toLocaleString()} PKR)
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              onEditDonationInitiative({
                                ...init,
                                active: !init.active
                              });
                              alert(`Campaign status updated to ${!init.active ? 'Active' : 'Closed'}`);
                            }}
                            className={`text-[9px] font-bold px-2.5 py-1.5 rounded-lg border ${init.active ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                          >
                            {init.active ? 'Close campaign' : 'Reopen campaign'}
                          </button>
                          <button 
                            onClick={() => {
                              setDeleteConfirmState({
                                title: 'Delete Campaign',
                                message: 'Are you sure you want to delete this campaign? All history will be preserved.',
                                onConfirm: () => onDeleteDonationInitiative(init.id)
                              });
                            }}
                            className="p-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Receipts Audit Trail Table */}
            <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4 text-left">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-sm text-amber-400">🛡️ Receipts Audit Trail & Manual Verification</h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">Audit transaction references sent by users. Match against bank/wallet records before approving.</p>
                </div>
                <span className="text-[9px] font-bold bg-slate-800 px-2 py-1 rounded-lg border border-slate-700">
                  Total receipts: {donationRecords.length}
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-800 rounded-xl" dir="ltr">
                <table className="w-full text-xs text-left text-slate-300">
                  <thead className="bg-slate-900 text-[10px] text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Donor details</th>
                      <th className="px-4 py-3">Campaign Target</th>
                      <th className="px-4 py-3">Receipt Ref</th>
                      <th className="px-4 py-3">Method</th>
                      <th className="px-4 py-3 text-right">Fund Value</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {donationRecords.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-slate-500 italic">No contribution records reported yet.</td>
                      </tr>
                    ) : (
                      [...donationRecords].reverse().map((record) => {
                        const initiative = donationInitiatives.find(i => i.id === record.initiativeId);
                        return (
                          <React.Fragment key={record.id}>
                            <tr className={`hover:bg-slate-800/20 transition-all ${record.status === 'pending' ? 'bg-amber-500/5' : ''}`}>
                              <td className="px-4 py-3 whitespace-nowrap text-[10px] font-mono text-slate-500">
                                {record.date}
                              </td>
                              <td className="px-4 py-3">
                                <div className="font-bold text-slate-200">{record.donorName}</div>
                                <div className="text-[9px] text-slate-500">{record.donorEmail} | {record.donorMobile}</div>
                              </td>
                              <td className="px-4 py-3 font-semibold text-slate-300 truncate max-w-[150px]">
                                {initiative ? initiative.title : 'General Fund'}
                              </td>
                              <td className="px-4 py-3 font-mono font-bold text-blue-400 text-[11px]">
                                {record.referenceNumber}
                              </td>
                              <td className="px-4 py-3">
                                <span className="uppercase text-[9px] font-bold bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded">
                                  {record.paymentMethod.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right font-bold text-emerald-400 font-mono text-[11px] whitespace-nowrap">
                                {(Number(record.amount) || 0).toLocaleString()} {record.currency}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                {record.status === 'pending' ? (
                                  <span className="text-amber-500 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase animate-pulse">
                                    ● Pending check
                                  </span>
                                ) : record.status === 'verified' ? (
                                  <span className="text-green-500 bg-green-500/10 border border-green-500/25 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                                    ✓ Approved
                                  </span>
                                ) : (
                                  <span className="text-red-500 bg-red-500/10 border border-red-500/25 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase">
                                    ✕ Rejected
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center whitespace-nowrap">
                                {record.status === 'pending' ? (
                                  <div className="flex gap-1.5 justify-center">
                                    <button 
                                      onClick={() => {
                                        onVerifyDonation(record.id, 'verified');
                                        alert('Receipt reference verified! Total campaign funds updated.');
                                      }}
                                      className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[9px] px-2 py-1 rounded"
                                    >
                                      Approve
                                    </button>
                                    <button 
                                      onClick={() => {
                                        onVerifyDonation(record.id, 'rejected');
                                        alert('Receipt reference flagged as Rejected.');
                                      }}
                                      className="bg-red-950 hover:bg-red-900 text-red-400 font-bold text-[9px] px-2 py-1 rounded border border-red-800/30"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex gap-1.5 justify-center items-center">
                                    <span className="text-[10px] text-slate-500 italic mr-1">Audit Done</span>
                                    {record.status === 'verified' && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          const refNo = record.referenceNumber;
                                          
                                          // Text/plain download
                                          const element = document.createElement("a");
                                          const content = `
=========================================
HALQA-E-USMANIA OFFICIAL TRUST RECEIPT
=========================================
Receipt ID: HU-REC-${record.id.replace('don-', '')}
Date: ${record.date}
Donor Name: ${record.donorName}
Donor Contact: ${record.donorMobile}
Cause: ${initiative ? initiative.title : 'General Welfare Fund'}
Amount: ${record.amount.toLocaleString()} ${record.currency}
Payment Method: ${record.paymentMethod.replace('_', ' ')}
Reference Number: ${record.referenceNumber}
Status: VERIFIED & SECURED (DIGITALLY SIGNED)
=========================================
جَزَاكَ اللَّهُ خَيْرًا فِي الدُّنْيَا وَالْآخِرَةِ
"May Almighty Allah accept your noble contribution as Sadaqah Jariyah and grant you, your parents, and your family infinite blessings."
=========================================
`;
                                          const file = new Blob([content], {type: 'text/plain'});
                                          element.href = URL.createObjectURL(file);
                                          element.download = `HU-Admin-Receipt-${refNo}.txt`;
                                          document.body.appendChild(element);
                                          element.click();
                                          document.body.removeChild(element);
                                          
                                          // Dynamic printable iframe
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
                                                    <title>Receipt HU-REC-${record.id}</title>
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
                                                        <div class="detail-row"><span>Receipt ID:</span><strong>HU-REC-${record.id.replace('don-', '')}</strong></div>
                                                        <div class="detail-row"><span>Date:</span><strong>${record.date}</strong></div>
                                                        <div class="detail-row"><span>Donor Name:</span><strong>${record.donorName}</strong></div>
                                                        <div class="detail-row"><span>Donor Contact:</span><strong>${record.donorMobile}</strong></div>
                                                        <div class="detail-row"><span>Payment Method:</span><strong style="text-transform: uppercase;">${record.paymentMethod.replace('_', ' ')}</strong></div>
                                                        <div class="detail-row"><span>Reference Ref:</span><strong>${record.referenceNumber}</strong></div>
                                                        <div class="amount-banner"><span>Amount:</span><span class="amount-val">${record.amount.toLocaleString()} ${record.currency}</span></div>
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
                                        className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-[9px] px-2 py-1 rounded inline-flex items-center gap-1 ml-1"
                                      >
                                        Print Receipt
                                      </button>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                            {record.notes && (
                              <tr className="bg-slate-900/40 text-[10px] text-slate-400">
                                <td colSpan={8} className="px-4 py-2 border-t-0 border-slate-800/40 italic">
                                  <span className="font-bold text-slate-500">Donor notes & prayers:</span> "{record.notes}"
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================== ISLAMIC UTILITIES & EVENTS TAB ==================== */}
        {activeTab === 'islamic_utilities' && (
          <div className="space-y-6 text-left">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-amber-300 flex items-center gap-2">
                  <Compass size={20} className="text-emerald-400" />
                  <span>Islamic Utilities & Hijri Calendar Control</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage worldwide prayer timing defaults, moon-sighting adjustment (+/- days), Islamic calendar events, and Daily Duas.
                </p>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-700 text-xs text-emerald-400 font-mono">
                ✓ Global GPS / API Active
              </div>
            </div>

            {/* Moon Sighting Adjustment Card */}
            <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-3">
              <h4 className="font-bold text-sm text-emerald-400 flex items-center gap-2">
                <Sparkles size={16} />
                <span>Hijri Moon-Sighting Adjustment (Global Offset)</span>
              </h4>
              <p className="text-xs text-slate-400">
                If the local moon sighting differs by 1 or 2 days from the astronomical calculation, adjust the offset here so all app users see the correct Hijri date.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-slate-300">Default Moon Offset:</span>
                <span className="bg-amber-400 text-slate-950 px-3 py-1 rounded-lg text-xs font-bold font-mono">
                  Synced with User GPS & Settings
                </span>
              </div>
            </div>

            {/* List of Islamic Calendar Events */}
            <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-emerald-400">📅 Islamic Calendar Events List</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{islamicEvents.length} Events</span>
                  <button
                    onClick={openAddEventModal}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Event</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                {islamicEvents.map(evt => (
                  <div key={evt.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex justify-between items-start gap-2">
                    <div>
                      <h5 className="font-bold text-xs text-white">{evt.title}</h5>
                      <p className="text-[10px] text-amber-400 font-serif">{evt.titleUrdu}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{evt.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-800">
                        M{evt.hijriMonth}/D{evt.hijriDay}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditEventModal(evt)}
                          className="p-1 bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200 rounded transition-colors cursor-pointer"
                          title="Edit Event"
                        >
                          <Edit size={13} />
                        </button>
                        {onToggleHideIslamicEvent && (
                          <button
                            title={(evt as any).status === 'hidden' ? 'Unhide Event' : 'Hide Event'}
                            onClick={() => onToggleHideIslamicEvent(evt)}
                            className={`p-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              (evt as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                            }`}
                          >
                            {(evt as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        )}
                        {onDeleteIslamicEvent && (
                          <button 
                            onClick={() => {
                              setDeleteConfirmState({
                                title: 'Delete Islamic Event',
                                message: `Are you sure you want to delete event "${evt.title}"?`,
                                onConfirm: () => onDeleteIslamicEvent(evt.id)
                              });
                            }}
                            className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* List of Daily Duas */}
            <div className="bg-slate-800/30 border border-slate-800 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h4 className="font-bold text-sm text-emerald-400">🤲 Masnoon Duas & Azkar Library</h4>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-slate-400">{duas.length} Active Duas</span>
                  <button
                    onClick={openAddDuaModal}
                    className="bg-emerald-800 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 shadow cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add Dua</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                {duas.map(dua => (
                  <div key={dua.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-bold text-xs text-amber-300">{dua.title}</h5>
                        <p className="text-[10px] text-emerald-400 font-serif">{dua.titleUrdu}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-400 uppercase">
                          {dua.category}
                        </span>
                        <button
                          onClick={() => openEditDuaModal(dua)}
                          className="p-1 bg-slate-800 text-amber-300 hover:bg-slate-700 hover:text-amber-200 rounded transition-colors cursor-pointer"
                          title="Edit Dua"
                        >
                          <Edit size={13} />
                        </button>
                        {onToggleHideDua && (
                          <button
                            title={(dua as any).status === 'hidden' ? 'Unhide Dua' : 'Hide Dua'}
                            onClick={() => onToggleHideDua(dua)}
                            className={`p-1 rounded text-xs font-bold transition-all cursor-pointer ${
                              (dua as any).status === 'hidden' ? 'bg-slate-800 text-slate-400 hover:text-white' : 'bg-emerald-950 text-emerald-400 hover:bg-emerald-900'
                            }`}
                          >
                            {(dua as any).status === 'hidden' ? <EyeOff size={13} /> : <Eye size={13} />}
                          </button>
                        )}
                        {onDeleteDua && (
                          <button 
                            onClick={() => {
                              setDeleteConfirmState({
                                title: 'Delete Masnoon Dua',
                                message: `Are you sure you want to delete Dua "${dua.title}"?`,
                                onConfirm: () => onDeleteDua(dua.id)
                              });
                            }}
                            className="p-1 bg-slate-800 text-red-400 hover:bg-red-800 hover:text-white rounded transition-colors cursor-pointer"
                            title="Delete Dua"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                    <p className="font-serif text-xs text-right text-amber-200 bg-slate-950 p-2 rounded border border-slate-800/80">
                      {dua.arabicText}
                    </p>
                    <p className="text-[10px] text-slate-300 italic">{dua.translation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* Hero Slider & Banners Manager Tab */}
        {activeTab === 'hero_slider' && (
          <HeroSliderManager
            sliderItems={sliderItems}
            posts={posts}
            pdfs={pdfs}
            videos={videos}
            onAddSliderItem={onAddSliderItem || ((item) => onUpdateSlider([item, ...sliderItems]))}
            onEditSliderItem={onEditSliderItem || ((item) => onUpdateSlider(sliderItems.map(s => s.id === item.id ? item : s)))}
            onDeleteSliderItem={onDeleteSliderItem || ((id) => onUpdateSlider(sliderItems.filter(s => s.id !== id)))}
            onToggleHideSliderItem={onToggleHideSliderItem || ((item) => onUpdateSlider(sliderItems.map(s => s.id === item.id ? { ...item, status: item.status === 'hidden' ? 'published' : 'hidden' } : s)))}
            onUpdateSlider={onUpdateSlider}
          />
        )}

        {/* Post-Splash Screen / Darood Pak Manager Tab */}
        {activeTab === 'post_splash' && (
          <PostSplashManager
            postSplashScreens={postSplashScreens}
            onAddPostSplashScreen={onAddPostSplashScreen}
            onEditPostSplashScreen={onEditPostSplashScreen}
            onDeletePostSplashScreen={onDeletePostSplashScreen}
            onTogglePostSplashScreen={onTogglePostSplashScreen}
          />
        )}

          </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Add / Edit Islamic Event Modal */}
      <AnimatePresence>
        {showEventModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingEvent ? 'Edit Islamic Event' : 'Add New Islamic Event'}
              </h3>
              <button onClick={() => setShowEventModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEvent} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Event Title (English / اردو عنوان)
                  </label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. Laylatul Qadr"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Title (Urdu)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={eventForm.titleUrdu}
                    onChange={(e) => setEventForm({ ...eventForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-300 font-serif"
                    placeholder="شبِ قدر"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Hijri Month (1-12) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={12}
                    value={eventForm.hijriMonth}
                    onChange={(e) => setEventForm({ ...eventForm, hijriMonth: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Hijri Day (1-30) *
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={30}
                    value={eventForm.hijriDay}
                    onChange={(e) => setEventForm({ ...eventForm, hijriDay: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Category
                  </label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="holy_night">Holy Night</option>
                    <option value="eid">Eid / Celebration</option>
                    <option value="fasting">Fasting</option>
                    <option value="historical">Historical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={2}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200"
                  placeholder="Short description..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Description (Urdu)
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={eventForm.descriptionUrdu}
                  onChange={(e) => setEventForm({ ...eventForm, descriptionUrdu: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 font-serif"
                  placeholder="اردو تفصیل..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2 cursor-pointer"
              >
                {editingEvent ? 'Save Event Changes' : 'Create Event'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Add / Edit Masnoon Dua Modal */}
      <AnimatePresence>
        {showDuaModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 text-left space-y-4 shadow-2xl"
            >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white">
                {editingDua ? 'Edit Masnoon Dua' : 'Add New Masnoon Dua'}
              </h3>
              <button onClick={() => setShowDuaModal(false)} className="text-slate-400 hover:text-white p-1 cursor-pointer">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDua} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Dua Title (English / اردو عنوان)
                  </label>
                  <input
                    type="text"
                    value={duaForm.title}
                    onChange={(e) => setDuaForm({ ...duaForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    placeholder="e.g. Morning Dua"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Title (Urdu)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={duaForm.titleUrdu}
                    onChange={(e) => setDuaForm({ ...duaForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-emerald-400 font-serif"
                    placeholder="صبح کی دعا"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Category
                </label>
                <select
                  value={duaForm.category}
                  onChange={(e) => setDuaForm({ ...duaForm, category: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase"
                >
                  <option value="daily">Daily / روزمرہ</option>
                  <option value="morning_evening">Morning & Evening / صبح و شام</option>
                  <option value="protection">Protection / تحفظ و استعاذہ</option>
                  <option value="special">Special / خاص مواقع</option>
                  <option value="salawat">Salawat / درود پاک</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Arabic Text (متن) *
                </label>
                <textarea
                  rows={2}
                  required
                  dir="rtl"
                  value={duaForm.arabicText}
                  onChange={(e) => setDuaForm({ ...duaForm, arabicText: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-amber-200 font-serif"
                  placeholder="عربی دعا..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                  Translation / Meaning
                </label>
                <textarea
                  rows={2}
                  dir="rtl"
                  value={duaForm.translation}
                  onChange={(e) => setDuaForm({ ...duaForm, translation: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 font-serif"
                  placeholder="اردو ترجمہ..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md mt-2 cursor-pointer"
              >
                {editingDua ? 'Save Dua Changes' : 'Create Dua'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 16:9 Image Cropper Modal */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageSrc={cropperModal.imageSrc}
        onClose={() => setCropperModal((prev) => ({ ...prev, isOpen: false }))}
        onCropComplete={handlePostImageCropped}
        aspectRatio={16 / 9}
        title="16:9 Post Image Cropper"
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirmState}
        title={deleteConfirmState?.title}
        message={deleteConfirmState?.message}
        onClose={() => setDeleteConfirmState(null)}
        onConfirm={() => {
          if (deleteConfirmState?.onConfirm) {
            deleteConfirmState.onConfirm();
          }
          setDeleteConfirmState(null);
        }}
      />
    </div>
  );
};
