/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import appLogo from './assets/images/app-logo.jpg';
import { AppSimulator } from './components/AppSimulator';
import { VoiceReaderProvider } from './context/VoiceReaderContext';
import { AdminPanel } from './components/AdminPanel';
import { 
  PostSplashScreenItem,
  Post, 
  Category, 
  PDFBook, 
  VideoItem, 
  AudioItem, 
  FeedbackItem, 
  AppNotification, 
  SliderItem, 
  ContactInfo, 
  SocialLinks, 
  UserSettings,
  GalleryAlbum,
  GalleryImage,
  DonationInitiative,
  DonationRecord,
  InfoPage,
  IslamicEvent,
  DuaItem,
  Branch,
  DayDatasetRecord,
  AppUser,
  SpiritualSlip,
  ModSettings,
  AuditLog,
  SystemBackupData,
  MakhzanCategory,
  MakhzanPost,
  SpiritualPersonality
} from './types';
import { 
  initialPostSplashScreens,
  initialCategories, 
  initialPosts, 
  initialPDFs, 
  initialVideos, 
  initialAudios, 
  initialAlbums, 
  initialGalleryImages, 
  initialSliderItems, 
  initialContactInfo, 
  initialSocialLinks, 
  initialFeedback, 
  initialNotifications,
  initialDonationInitiatives,
  initialDonationRecords,
  initialInfoPages,
  initialIslamicEvents,
  initialDuas,
  initialBranches,
  initialDayDatasets,
  initialSlips,
  initialModSettings,
  initialAuditLogs,
  initialMakhzanCategories,
  initialMakhzanPosts,
  initialSpiritualPersonalities
} from './data';
import { generateSlipId, generateUserId } from './lib/slips';
import { DEFAULT_VOICE_SETTINGS } from './lib/voiceReaderEngine';
import { 
  firebaseSignInAnonymously,
  adminSignInWithFirebase,
  adminSignOutWithFirebase,
  observeAuthState,
  seedInitialDataToFirestore,
  requestFCMToken,
  subscribeToAppUsers,
  addAppUserToFirestore,
  updateAppUserInFirestore,
  deleteAppUserFromFirestore,
  subscribeToPosts,
  savePostToFirestore,
  deletePostFromFirestore,
  subscribeToCategories,
  saveCategoryToFirestore,
  deleteCategoryFromFirestore,
  subscribeToPDFs,
  savePDFToFirestore,
  deletePDFFromFirestore,
  subscribeToVideos,
  saveVideoToFirestore,
  deleteVideoFromFirestore,
  subscribeToAudios,
  saveAudioToFirestore,
  deleteAudioFromFirestore,
  subscribeToNotifications,
  sendNotificationToFirestore,
  deleteNotificationFromFirestore,
  subscribeToFeedback,
  submitFeedbackToFirestore,
  updateFeedbackInFirestore,
  deleteFeedbackFromFirestore,
  subscribeToDonations,
  submitDonationToFirestore,
  saveDonationRecordToFirestore,
  deleteDonationRecordFromFirestore,
  subscribeToDonationInitiatives,
  saveDonationInitiativeToFirestore,
  deleteDonationInitiativeFromFirestore,
  subscribeToAlbums,
  saveAlbumToFirestore,
  deleteAlbumFromFirestore,
  subscribeToSliders,
  saveSliderToFirestore,
  deleteSliderFromFirestore,
  subscribeToGalleryImages,
  saveGalleryImageToFirestore,
  deleteGalleryImageFromFirestore,
  subscribeToInfoPages,
  saveInfoPageToFirestore,
  deleteInfoPageFromFirestore,
  subscribeToIslamicEvents,
  saveIslamicEventToFirestore,
  deleteIslamicEventFromFirestore,
  subscribeToDuas,
  saveDuaToFirestore,
  deleteDuaFromFirestore,
  subscribeToSpiritualPersonalities,
  saveSpiritualPersonalityToFirestore,
  deleteSpiritualPersonalityFromFirestore,
  subscribeToMakhzanPosts,
  saveMakhzanPostToFirestore,
  deleteMakhzanPostFromFirestore,
  subscribeToMakhzanCategories,
  saveMakhzanCategoryToFirestore,
  deleteMakhzanCategoryFromFirestore,
  saveContactInfoToFirestore,
  saveSocialLinksToFirestore,
  dispatchFCMNotification,
  subscribeToBranches,
  saveBranchToFirestore,
  deleteBranchFromFirestore,
  subscribeToDayDatasets,
  saveDayDatasetToFirestore,
  deleteDayDatasetFromFirestore,
  subscribeToAuditLogs,
  addAuditLogToFirestore,
  subscribeToSlips,
  saveSlipToFirestore,
  cancelSlipInFirestore,
  deleteSlipFromFirestore,
  subscribeToPostSplashScreens,
  savePostSplashScreenToFirestore,
  deletePostSplashScreenFromFirestore,
  dedupeById
} from './lib/firebaseService';
import { 
  Lock, 
  Unlock, 
  CheckCircle, 
  RefreshCw, 
  Smartphone, 
  Laptop, 
  Globe, 
  AlertCircle,
  LogOut,
  Loader2,
  ShieldCheck,
  Bell,
  MapPin,
  Camera,
  FolderOpen
} from 'lucide-react';

export default function App() {

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('halqa_categories');
    return dedupeById(saved ? JSON.parse(saved) : initialCategories);
  });

  const [pdfs, setPdfs] = useState<PDFBook[]>(() => {
    const saved = localStorage.getItem('halqa_pdfs');
    return dedupeById(saved ? JSON.parse(saved) : initialPDFs);
  });

  const [videos, setVideos] = useState<VideoItem[]>(() => {
    const saved = localStorage.getItem('halqa_videos');
    return dedupeById(saved ? JSON.parse(saved) : initialVideos);
  });

  const [audios, setAudios] = useState<AudioItem[]>(() => {
    const saved = localStorage.getItem('halqa_audios');
    return dedupeById(saved ? JSON.parse(saved) : initialAudios);
  });

  const [albums, setAlbums] = useState<GalleryAlbum[]>(() => {
    const saved = localStorage.getItem('halqa_albums');
    return dedupeById(saved ? JSON.parse(saved) : initialAlbums);
  });

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    const saved = localStorage.getItem('halqa_gallery_images');
    return dedupeById(saved ? JSON.parse(saved) : initialGalleryImages);
  });

  const [feedback, setFeedback] = useState<FeedbackItem[]>(() => {
    const saved = localStorage.getItem('halqa_feedback');
    return dedupeById(saved ? JSON.parse(saved) : initialFeedback);
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('halqa_notifications');
    return dedupeById(saved ? JSON.parse(saved) : initialNotifications);
  });

  const [sliderItems, setSliderItems] = useState<SliderItem[]>(initialSliderItems);

  const [contactInfo, setContactInfo] = useState<ContactInfo>(() => {
    const saved = localStorage.getItem('halqa_contact_info');
    return saved ? JSON.parse(saved) : initialContactInfo;
  });

  const [socialLinks, setSocialLinks] = useState<SocialLinks>(() => {
    const saved = localStorage.getItem('halqa_social_links');
    return saved ? JSON.parse(saved) : initialSocialLinks;
  });

  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>(() => {
    const saved = localStorage.getItem('halqa_islamic_events');
    return dedupeById(saved ? JSON.parse(saved) : initialIslamicEvents);
  });

  const [duas, setDuas] = useState<DuaItem[]>(() => {
    const saved = localStorage.getItem('halqa_duas');
    return dedupeById(saved ? JSON.parse(saved) : initialDuas);
  });

  // User local bookmarks and offline downloads
  const [bookmarks, setBookmarks] = useState<{
    posts: string[];
    videos: string[];
    pdfs: string[];
    audios: string[];
  }>(() => {
    const saved = localStorage.getItem('halqa_bookmarks');
    return saved ? JSON.parse(saved) : { posts: [], videos: [], pdfs: [], audios: [] };
  });

  const [downloads, setDownloads] = useState<{
    pdfs: string[];
    audios: string[];
  }>(() => {
    const saved = localStorage.getItem('halqa_downloads');
    return saved ? JSON.parse(saved) : { pdfs: [], audios: [] };
  });

  // User Profile
  const [currentUser, setCurrentUser] = useState({
    name: 'Muhammad Amir Khan',
    email: 'hafizmuhammadamirkhan92@gmail.com',
    mobile: '+92 333 9998822',
    city: 'Karachi'
  });

  // Application configurations inside simulator
  const [userSettings, setUserSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('halqa_settings');
    const parsed = saved ? JSON.parse(saved) : {};
    return {
      language: 'ur',
      theme: 'light',
      fontSize: 'md',
      notificationsEnabled: true,
      autoDownloadOff: false,
      permissionsRequested: false,
      locationPermissionGranted: false,
      notificationsPermissionGranted: false,
      voiceReaderSettings: DEFAULT_VOICE_SETTINGS,
      ...parsed
    };
  });
  const [showPermissionModal, setShowPermissionModal] = useState<boolean>(false);

  // Prompt permissions once on launch if not requested before
  useEffect(() => {
    if (!userSettings.permissionsRequested) {
      const timer = setTimeout(() => {
        setShowPermissionModal(true);
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [userSettings.permissionsRequested]);

  const handleGrantAllPermissions = async () => {
    let notifGranted = false;
    let locGranted = false;

    // 1. Request Push Notification Permission
    if (typeof Notification !== "undefined") {
      try {
        const perm = await Notification.requestPermission();
        if (perm === "granted") notifGranted = true;
      } catch (e) {
        console.error("Notification permission error:", e);
      }
    }

    // 2. Request Geolocation Permission
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      try {
        await new Promise<void>((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => {
              locGranted = true;
              resolve();
            },
            () => {
              resolve();
            },
            { timeout: 5000 }
          );
        });
      } catch (e) {
        console.error("Geolocation permission error:", e);
      }
    }

    // Save decision permanently to localStorage so user is never asked again!
    setUserSettings((prev) => ({
      ...prev,
      permissionsRequested: true,
      locationPermissionGranted: locGranted,
      notificationsPermissionGranted: notifGranted,
      notificationsEnabled: true
    }));

    setShowPermissionModal(false);
  };

  const handleSkipPermissions = () => {
    // Save skipped state permanently so user is never asked again!
    setUserSettings((prev) => ({
      ...prev,
      permissionsRequested: true
    }));
    setShowPermissionModal(false);
  };
  // Master persistent state loaders
  
  // Post-Splash Screens State
  const [postSplashScreens, setPostSplashScreens] = useState<PostSplashScreenItem[]>(() => {
    const saved = localStorage.getItem('hu_post_splash_screens');
    return saved ? JSON.parse(saved) : initialPostSplashScreens;
  });

  useEffect(() => {
    localStorage.setItem('hu_post_splash_screens', JSON.stringify(postSplashScreens));
  }, [postSplashScreens]);

  useEffect(() => {
    const unsub = subscribeToPostSplashScreens((screensFromDb) => {
      if (screensFromDb && screensFromDb.length > 0) {
        setPostSplashScreens(dedupeById(screensFromDb));
      }
    });
    return () => unsub();
  }, []);

  const handleAddPostSplashScreen = (screen: PostSplashScreenItem) => {
    setPostSplashScreens(dedupeById([screen, ...postSplashScreens]));
    savePostSplashScreenToFirestore(screen);
    triggerSync();
  };

  const handleEditPostSplashScreen = (screen: PostSplashScreenItem) => {
    setPostSplashScreens(postSplashScreens.map(s => s.id === screen.id ? screen : s));
    savePostSplashScreenToFirestore(screen);
    triggerSync();
  };

  const handleDeletePostSplashScreen = (id: string) => {
    setPostSplashScreens(postSplashScreens.filter(s => s.id !== id));
    deletePostSplashScreenFromFirestore(id);
    triggerSync();
  };

  const handleTogglePostSplashScreen = (screen: PostSplashScreenItem) => {
    const updated = { ...screen, isEnabled: !screen.isEnabled };
    setPostSplashScreens(postSplashScreens.map(s => s.id === screen.id ? updated : s));
    savePostSplashScreenToFirestore(updated);
    triggerSync();
  };

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('halqa_posts');
    return dedupeById(saved ? JSON.parse(saved) : initialPosts);
  });

  const [donationInitiatives, setDonationInitiatives] = useState<DonationInitiative[]>(() => {
    const saved = localStorage.getItem('halqa_donation_initiatives');
    return saved ? JSON.parse(saved) : initialDonationInitiatives;
  });

  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(() => {
    const saved = localStorage.getItem('halqa_donation_records');
    return saved ? JSON.parse(saved) : initialDonationRecords;
  });

  const [infoPages, setInfoPages] = useState<InfoPage[]>(() => {
    const saved = localStorage.getItem('halqa_info_pages');
    return saved ? JSON.parse(saved) : initialInfoPages;
  });

  // KHANQAH & AASTANA CORE STATES
  const [branches, setBranches] = useState<Branch[]>(() => {
    const saved = localStorage.getItem('hu_branches');
    return saved ? JSON.parse(saved) : initialBranches;
  });

  const [dayDatasets, setDayDatasets] = useState<DayDatasetRecord[]>(() => {
    const saved = localStorage.getItem('hu_day_datasets');
    return saved ? JSON.parse(saved) : initialDayDatasets;
  });

  const [appUsers, setAppUsers] = useState<AppUser[]>([]);

  const [slips, setSlips] = useState<SpiritualSlip[]>(() => {
    const saved = localStorage.getItem('hu_slips');
    return saved ? JSON.parse(saved) : initialSlips;
  });

  const [modSettings, setModSettings] = useState<ModSettings>(() => {
    const saved = localStorage.getItem('hu_mod_settings');
    return saved ? JSON.parse(saved) : initialModSettings;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('hu_audit_logs');
    return saved ? JSON.parse(saved) : initialAuditLogs;
  });

  const [makhzanCategories, setMakhzanCategories] = useState<MakhzanCategory[]>(() => {
    const saved = localStorage.getItem('hu_makhzan_categories');
    return saved ? JSON.parse(saved) : initialMakhzanCategories;
  });

  const [makhzanPosts, setMakhzanPosts] = useState<MakhzanPost[]>(() => {
    const saved = localStorage.getItem('hu_makhzan_posts');
    return saved ? JSON.parse(saved) : initialMakhzanPosts;
  });

  const [spiritualPersonalities, setSpiritualPersonalities] = useState<SpiritualPersonality[]>(() => {
    const saved = localStorage.getItem('halqa_spiritual_personalities');
    return saved ? JSON.parse(saved) : initialSpiritualPersonalities;
  });

  const [activeAppUser, setActiveAppUser] = useState<AppUser | null>(() => {
    const saved = localStorage.getItem('hu_active_user');
    if (!saved) return null;
    try {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        (parsed.email?.includes('halqa-usmania.org') ||
          parsed.id?.startsWith('HU-MALIR01-U0000') ||
          parsed.id === 'HU-MALIR01-U000245' ||
          parsed.id?.startsWith('HU-GULSHAN01-U'))
      ) {
        localStorage.removeItem('hu_active_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const recordAuditLog = (
    action: AuditLog['action'],
    performedBy: string,
    details: string,
    branchCode?: string,
    role?: string
  ) => {
    const log: AuditLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      action,
      performedBy,
      role: role || 'super_admin',
      branchCode: branchCode || 'HQ01',
      details,
      deviceInfo: navigator.userAgent.includes('Mobile') ? 'Android/iOS Mobile Client' : 'Chrome/Desktop Client'
    };
    setAuditLogs((prev) => dedupeById([log, ...prev]));
    addAuditLogToFirestore(log);
  };

  // KHANQAH HANDLERS
  const handleAddBranch = (branch: Omit<Branch, 'id' | 'createdAt'>) => {
    const newBranch: Branch = {
      ...branch,
      id: 'br-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBranches((prev) => dedupeById([...prev, newBranch]));
    saveBranchToFirestore(newBranch);
    recordAuditLog('BRANCH_CREATED', 'Super Admin', `Created new branch ${newBranch.code} - ${newBranch.name}`, newBranch.code);
  };

  const handleEditBranch = (updated: Branch) => {
    setBranches((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
    saveBranchToFirestore(updated);
    recordAuditLog('BRANCH_UPDATED', 'Super Admin', `Updated branch parameters for ${updated.code}`, updated.code);
  };

  const handleDeleteBranch = (id: string) => {
    setBranches((prev) => prev.filter((b) => b.id !== id));
    deleteBranchFromFirestore(id);
  };

  const handleToggleBranchStatus = (id: string) => {
    setBranches((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          const updated = { ...b, status: (b.status === 'active' ? 'inactive' : 'active') as 'active' | 'inactive' };
          saveBranchToFirestore(updated);
          return updated;
        }
        return b;
      })
    );
  };

  const handleAddDatasetRecord = (record: Omit<DayDatasetRecord, 'id'>) => {
    const newRecord: DayDatasetRecord = {
      ...record,
      id: 'ds-' + Date.now() + '-' + Math.floor(Math.random() * 1000)
    };
    setDayDatasets((prev) => dedupeById([...prev, newRecord]));
    saveDayDatasetToFirestore(newRecord);
    recordAuditLog('DATASET_UPDATED', 'Admin', `Added day dataset record for ${newRecord.day} (Adad ${newRecord.adad})`);
  };

  const handleEditDatasetRecord = (updated: DayDatasetRecord) => {
    setDayDatasets((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    saveDayDatasetToFirestore(updated);
    recordAuditLog('DATASET_UPDATED', 'Admin', `Edited day dataset record ID ${updated.id}`);
  };

  const handleDeleteDatasetRecord = (id: string) => {
    setDayDatasets((prev) => prev.filter((r) => r.id !== id));
    deleteDayDatasetFromFirestore(id);
  };

  const handleBulkImportDatasetRecords = (importedRecords: Omit<DayDatasetRecord, 'id'>[]) => {
    const formatted = importedRecords.map((rec, idx) => ({
      ...rec,
      id: 'ds-imp-' + Date.now() + '-' + idx
    }));
    setDayDatasets((prev) => dedupeById([...prev, ...formatted]));
    formatted.forEach((r) => saveDayDatasetToFirestore(r));
    recordAuditLog('DATASET_UPDATED', 'Admin', `Bulk imported ${formatted.length} spiritual dataset records`);
  };

  const handleCreateUser = async (userData: Omit<AppUser, 'id' | 'registrationDate'>) => {
    const targetBranch = branches.find((b) => b.id === userData.branchId) || branches[0];
    const generatedId = generateUserId(targetBranch?.code || 'MALIR01', appUsers);
    
    const newUser: AppUser = {
      ...userData,
      id: generatedId,
      userId: generatedId,
      branchCode: targetBranch?.code || 'MALIR01',
      branchName: targetBranch?.name || 'Markaz',
      registrationDate: new Date().toISOString().split('T')[0],
      status: userData.status || 'approved'
    };
    try {
      await addAppUserToFirestore(newUser);
      recordAuditLog('USER_APPROVED', 'Admin', `Created direct user @${newUser.username || newUser.fullName} (${newUser.id})`, newUser.branchCode);
    } catch (err) {
      console.error('Error creating user in Firestore:', err);
    }
    return newUser;
  };

  const handleSelfRegisterUser = (
    userData: Omit<AppUser, 'id' | 'registrationDate' | 'status' | 'role' | 'branchCode' | 'branchName'>
  ) => {
    const targetBranch = branches.find((b) => b.id === userData.branchId) || branches[0];
    const pendingId = 'HU-PENDING-' + Date.now().toString().slice(-6);
    const pendingUser: AppUser = {
      ...userData,
      id: pendingId,
      username: userData.username || pendingId.toLowerCase(),
      branchCode: targetBranch?.code || 'MALIR01',
      branchName: targetBranch?.name || 'Markaz',
      role: 'registered_user',
      status: 'pending',
      registrationDate: new Date().toISOString().split('T')[0]
    };
    addAppUserToFirestore(pendingUser).catch((err) => console.error('Error adding pending user to Firestore:', err));
    recordAuditLog('LOGIN_ATTEMPT', userData.fullName, `Submitted registration request for branch ${pendingUser.branchCode}`, pendingUser.branchCode);
    return pendingUser;
  };

  const handleApproveUser = async (userId: string, assignedRole?: AppUser['role'], assignedBranchId?: string) => {
    const targetUser = appUsers.find((u) => u.id === userId);
    if (!targetUser) return;

    const branch = branches.find((b) => b.id === (assignedBranchId || targetUser.branchId)) || branches[0];
    const officialUserId = generateUserId(branch.code, appUsers);

    const approvedUser: AppUser = {
      ...targetUser,
      id: officialUserId,
      userId: officialUserId,
      status: 'approved',
      role: assignedRole || targetUser.role || 'registered_user',
      branchId: branch.id,
      branchCode: branch.code,
      branchName: branch.name
    };

    try {
      await addAppUserToFirestore(approvedUser);
      if (userId !== officialUserId) {
        await deleteAppUserFromFirestore(userId);
      }
      recordAuditLog('USER_APPROVED', 'Admin', `Approved user @${approvedUser.username || approvedUser.fullName}. Assigned Official ID: ${approvedUser.id}`, approvedUser.branchCode);
    } catch (err) {
      console.error('Error approving user in Firestore:', err);
    }
  };

  const handleRejectUser = async (userId: string, reason: string) => {
    const targetUser = appUsers.find((u) => u.id === userId);
    try {
      await updateAppUserInFirestore(userId, { status: 'rejected', rejectionReason: reason });
      recordAuditLog('USER_REJECTED', 'Admin', `Rejected registration request for @${targetUser?.username || userId}. Reason: ${reason}`, targetUser?.branchCode);
    } catch (err) {
      console.error('Error rejecting user:', err);
    }
  };

  const handleBlockUser = async (userId: string, reason: string) => {
    const targetUser = appUsers.find((u) => u.id === userId);
    try {
      await updateAppUserInFirestore(userId, { status: 'blocked', blockedReason: reason });
      recordAuditLog('USER_BLOCKED', 'Admin', `Blocked user login for @${targetUser?.username || userId} (${targetUser?.id}). Reason: ${reason}`, targetUser?.branchCode);
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  const handleUnblockUser = async (userId: string) => {
    const targetUser = appUsers.find((u) => u.id === userId);
    try {
      await updateAppUserInFirestore(userId, { status: 'approved', blockedReason: undefined });
      recordAuditLog('USER_UNBLOCKED', 'Admin', `Unblocked account @${targetUser?.username || userId}`, targetUser?.branchCode);
    } catch (err) {
      console.error('Error unblocking user:', err);
    }
  };

  const handleEditUser = async (updatedUser: AppUser) => {
    try {
      await updateAppUserInFirestore(updatedUser.id, updatedUser);
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteAppUserFromFirestore(userId);
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const handleCreateSlip = (
    slipData: Omit<
      SpiritualSlip,
      'id' | 'year' | 'month' | 'monthlySlipNo' | 'overallSlipNo' | 'createdAt' | 'status'
    >
  ) => {
    const generated = generateSlipId(slipData.branchCode || 'MALIR01', slips);
    const newSlip: SpiritualSlip = {
      ...slipData,
      id: generated.slipId,
      year: generated.year,
      month: generated.month,
      monthlySlipNo: generated.monthlySlipNo,
      overallSlipNo: generated.overallSlipNo,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'active'
    };
    setSlips((prev) => dedupeById([newSlip, ...prev]));
    saveSlipToFirestore(newSlip);
    recordAuditLog('SLIP_CREATED', slipData.operatorName || 'Operator', `Generated spiritual slip ${newSlip.id} for ${newSlip.userName}`, newSlip.branchCode);
    return newSlip;
  };

  const handleCancelSlip = (slipId: string, reason: string) => {
    setSlips((prev) =>
      prev.map((s) => (s.id === slipId ? { ...s, status: 'cancelled', cancellationReason: reason } : s))
    );
    cancelSlipInFirestore(slipId, reason);
    recordAuditLog('SLIP_CANCELLED', 'Admin', `Marked slip ${slipId} as CANCELLED. Reason: ${reason}`);
  };

  const handleUpdateModSettings = (settings: ModSettings) => {
    setModSettings(settings);
    recordAuditLog('DATASET_UPDATED', 'Admin', `Updated Abjad Engine MOD settings (Divisor: ${settings.divisor})`);
  };

  const handleRestoreBackup = (backup: SystemBackupData) => {
    if (backup.branches) setBranches(backup.branches);
    if (backup.dayDatasets) setDayDatasets(backup.dayDatasets);
    if (backup.appUsers) setAppUsers(backup.appUsers);
    if (backup.slips) setSlips(backup.slips);
    if (backup.auditLogs) setAuditLogs(backup.auditLogs);
    if (backup.modSettings) setModSettings(backup.modSettings);
    if (backup.makhzanCategories) setMakhzanCategories(backup.makhzanCategories);
    if (backup.makhzanPosts) setMakhzanPosts(backup.makhzanPosts);
    recordAuditLog('BACKUP_RESTORED', 'Super Admin', `Restored full system backup from snapshot exported on ${backup.exportDate}`);
  };

  // MAKHZAN-E-KHAS HANDLERS
  const handleAddMakhzanCategory = (cat: MakhzanCategory) => {
    setMakhzanCategories((prev) => dedupeById([...prev, cat]));
    saveMakhzanCategoryToFirestore(cat);
    recordAuditLog('MAKHZAN_CATEGORY_UPDATED', 'Admin', `Added new Makhzan category ${cat.nameUrdu} (${cat.name})`);
    triggerSync();
  };

  const handleEditMakhzanCategory = (updated: MakhzanCategory) => {
    setMakhzanCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    saveMakhzanCategoryToFirestore(updated);
    recordAuditLog('MAKHZAN_CATEGORY_UPDATED', 'Admin', `Updated Makhzan category ${updated.nameUrdu}`);
    triggerSync();
  };

  const handleDeleteMakhzanCategory = async (id: string) => {
    setMakhzanCategories((prev) => prev.filter((c) => c.id !== id));
    await deleteMakhzanCategoryFromFirestore(id);
    recordAuditLog('MAKHZAN_CATEGORY_UPDATED', 'Admin', `Deleted Makhzan category ID ${id}`);
    triggerSync();
  };

  const handleAddMakhzanPost = (post: MakhzanPost) => {
    setMakhzanPosts((prev) => dedupeById([post, ...prev.filter((p) => p.id !== post.id)]));
    saveMakhzanPostToFirestore(post);
    recordAuditLog('MAKHZAN_POST_CREATED', 'Admin', `Created new Makhzan post "${post.titleUrdu || post.title}" in category ${post.categoryId}`);
    triggerSync();
  };

  const handleEditMakhzanPost = (updated: MakhzanPost) => {
    setMakhzanPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    saveMakhzanPostToFirestore(updated);
    recordAuditLog('MAKHZAN_POST_UPDATED', 'Admin', `Updated Makhzan post "${updated.titleUrdu || updated.title}"`);
    triggerSync();
  };

  const handleDeleteMakhzanPost = async (id: string) => {
    setMakhzanPosts((prev) => prev.filter((p) => p.id !== id));
    await deleteMakhzanPostFromFirestore(id);
    recordAuditLog('MAKHZAN_POST_DELETED', 'Admin', `Deleted Makhzan post ID ${id}`);
    triggerSync();
  };

  const handleToggleHideMakhzanPost = (postId: string) => {
    setMakhzanPosts((prev) => {
      const updatedList = prev.map((p) => {
        if (p.id === postId) {
          const updated = { ...p, status: (p.status === 'hidden' ? 'published' : 'hidden') as 'published' | 'hidden' };
          saveMakhzanPostToFirestore(updated);
          return updated;
        }
        return p;
      });
      return updatedList;
    });
    recordAuditLog('MAKHZAN_POST_UPDATED', 'Admin', `Toggled visibility status for Makhzan post ID ${postId}`);
    triggerSync();
  };

  // SPIRITUAL PERSONALITIES HANDLERS
  const handleSaveSpiritualPersonality = async (personality: SpiritualPersonality) => {
    setSpiritualPersonalities((prev) => dedupeById([personality, ...prev.filter((p) => p.id !== personality.id)]));
    const savedSuccess = await saveSpiritualPersonalityToFirestore(personality);
    if (!savedSuccess) {
      console.error(`[Firestore Alert] Spiritual personality ${personality.name} (${personality.id}) could not be written to Firestore.`);
    }
    triggerSync();
    recordAuditLog('PERSONALITY_SAVED', 'Admin', `Saved spiritual personality ${personality.name} (${personality.id})`);
  };

  const handleDeleteSpiritualPersonality = async (id: string) => {
    setSpiritualPersonalities((prev) => prev.filter((p) => p.id !== id));
    await deleteSpiritualPersonalityFromFirestore(id);
    triggerSync();
    recordAuditLog('PERSONALITY_DELETED', 'Admin', `Deleted spiritual personality ID ${id}`);
  };

  const handleToggleHideSpiritualPersonality = (id: string) => {
    const target = spiritualPersonalities.find((p) => p.id === id);
    if (!target) return;
    const newStatus = target.status === 'hidden' ? 'published' : 'hidden';
    const updated: SpiritualPersonality = { ...target, status: newStatus, updatedAt: new Date().toISOString() };
    setSpiritualPersonalities((prev) => prev.map((p) => (p.id === id ? updated : p)));
    saveSpiritualPersonalityToFirestore(updated);
    triggerSync();
    recordAuditLog('PERSONALITY_SAVED', 'Admin', `Toggled visibility status for spiritual personality ID ${id}`);
  };

  // Authentication simulator and visual modes
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [viewMode, setViewMode] = useState<'both' | 'simulator' | 'admin'>('simulator');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced'>('synced');

  // Trigger LocalStorage persistence upon state changes
  useEffect(() => {
    localStorage.setItem('halqa_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('halqa_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('halqa_pdfs', JSON.stringify(pdfs));
  }, [pdfs]);

  useEffect(() => {
    localStorage.setItem('halqa_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('halqa_audios', JSON.stringify(audios));
  }, [audios]);

  useEffect(() => {
    localStorage.setItem('halqa_feedback', JSON.stringify(feedback));
  }, [feedback]);

  useEffect(() => {
    localStorage.setItem('halqa_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('halqa_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('halqa_downloads', JSON.stringify(downloads));
  }, [downloads]);

  useEffect(() => {
    localStorage.setItem('halqa_contact_info', JSON.stringify(contactInfo));
  }, [contactInfo]);

  useEffect(() => {
    localStorage.setItem('halqa_social_links', JSON.stringify(socialLinks));
  }, [socialLinks]);

  useEffect(() => {
    localStorage.setItem('halqa_settings', JSON.stringify(userSettings));
  }, [userSettings]);

  useEffect(() => {
    import('./lib/firestoreVoiceReader').then(({ getVoiceReaderSettings }) => {
      getVoiceReaderSettings().then((fSettings) => {
        setUserSettings((prev) => ({
          ...prev,
          voiceReaderSettings: {
            ...prev.voiceReaderSettings,
            ...fSettings
          }
        }));
      }).catch((err) => {
        console.warn('Note on loading Firestore voice reader settings:', err);
      });
    });
  }, []);

  useEffect(() => {
    localStorage.setItem('halqa_donation_initiatives', JSON.stringify(donationInitiatives));
  }, [donationInitiatives]);

  useEffect(() => {
    localStorage.setItem('halqa_donation_records', JSON.stringify(donationRecords));
  }, [donationRecords]);

  useEffect(() => {
    localStorage.setItem('halqa_info_pages', JSON.stringify(infoPages));
  }, [infoPages]);

  useEffect(() => {
    localStorage.setItem('halqa_islamic_events', JSON.stringify(islamicEvents));
  }, [islamicEvents]);

  useEffect(() => {
    localStorage.setItem('halqa_duas', JSON.stringify(duas));
  }, [duas]);

  useEffect(() => {
    localStorage.setItem('hu_branches', JSON.stringify(branches));
  }, [branches]);

  useEffect(() => {
    localStorage.setItem('hu_day_datasets', JSON.stringify(dayDatasets));
  }, [dayDatasets]);

  useEffect(() => {
    localStorage.removeItem('hu_app_users');
  }, []);

  useEffect(() => {
    localStorage.setItem('hu_slips', JSON.stringify(slips));
  }, [slips]);

  useEffect(() => {
    localStorage.setItem('hu_mod_settings', JSON.stringify(modSettings));
  }, [modSettings]);

  useEffect(() => {
    localStorage.setItem('hu_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('hu_makhzan_categories', JSON.stringify(makhzanCategories));
  }, [makhzanCategories]);

  useEffect(() => {
    localStorage.setItem('hu_makhzan_posts', JSON.stringify(makhzanPosts));
  }, [makhzanPosts]);

  useEffect(() => {
    localStorage.setItem('halqa_spiritual_personalities', JSON.stringify(spiritualPersonalities));
  }, [spiritualPersonalities]);

  useEffect(() => {
    if (activeAppUser) {
      localStorage.setItem('hu_active_user', JSON.stringify(activeAppUser));
    } else {
      localStorage.removeItem('hu_active_user');
    }
  }, [activeAppUser]);

  useEffect(() => {
    localStorage.setItem('halqa_albums', JSON.stringify(albums));
  }, [albums]);

  // Firebase Auth State Observer & Real-time Listeners
  useEffect(() => {
    let unsubAppUsers: (() => void) | undefined;
    let unsubPosts: (() => void) | undefined;
    let unsubCategories: (() => void) | undefined;
    let unsubPDFs: (() => void) | undefined;
    let unsubVideos: (() => void) | undefined;
    let unsubAudios: (() => void) | undefined;
    let unsubNotifications: (() => void) | undefined;
    let unsubFeedback: (() => void) | undefined;
    let unsubDonations: (() => void) | undefined;
    let unsubDonationInitiatives: (() => void) | undefined;
    let unsubSliders: (() => void) | undefined;
    let unsubGallery: (() => void) | undefined;
    let unsubAlbums: (() => void) | undefined;
    let unsubInfoPages: (() => void) | undefined;
    let unsubEvents: (() => void) | undefined;
    let unsubDuas: (() => void) | undefined;
    let unsubSpiritualPersonalities: (() => void) | undefined;
    let unsubMakhzanPosts: (() => void) | undefined;
    let unsubMakhzanCategories: (() => void) | undefined;
    let unsubBranches: (() => void) | undefined;
    let unsubDayDatasets: (() => void) | undefined;
    let unsubSlips: (() => void) | undefined;
    let unsubAuditLogs: (() => void) | undefined;

    const unsubAuth = observeAuthState((user) => {
      if (user && user.email === 'hafizsahab@halqausmania.app') {
        setIsAdminAuthenticated(true);
      }
    });

    const initFirebaseRealtime = async () => {
      await firebaseSignInAnonymously();

      await seedInitialDataToFirestore(
        initialPosts,
        initialCategories,
        initialPDFs,
        initialVideos,
        initialAudios,
        initialInfoPages,
        initialDonationInitiatives,
        initialAlbums,
        initialSpiritualPersonalities,
        initialBranches,
        initialDayDatasets
      );

      await requestFCMToken();

      unsubAppUsers = subscribeToAppUsers((remoteUsers) => {
        setAppUsers(remoteUsers);
        triggerSync();
      });

      unsubPosts = subscribeToPosts((remotePosts) => {
        setPosts(remotePosts);
        triggerSync();
      });

      unsubCategories = subscribeToCategories((remoteCategories) => {
        setCategories(remoteCategories);
        triggerSync();
      });

      unsubPDFs = subscribeToPDFs((remotePDFs) => {
        setPdfs(remotePDFs);
        triggerSync();
      });

      unsubVideos = subscribeToVideos((remoteVideos) => {
        setVideos(remoteVideos);
        triggerSync();
      });

      unsubAudios = subscribeToAudios((remoteAudios) => {
        setAudios(remoteAudios);
        triggerSync();
      });

      unsubNotifications = subscribeToNotifications((remoteNotifications) => {
        setNotifications(remoteNotifications);
        triggerSync();
      });

      unsubFeedback = subscribeToFeedback((remoteFeedback) => {
        setFeedback(remoteFeedback);
        triggerSync();
      });

      unsubDonations = subscribeToDonations((remoteDonations) => {
        setDonationRecords(remoteDonations);
        triggerSync();
      });

      unsubDonationInitiatives = subscribeToDonationInitiatives((remoteInitiatives) => {
        setDonationInitiatives(remoteInitiatives);
        triggerSync();
      });

      unsubSliders = subscribeToSliders((remoteSliders) => {
        setSliderItems(remoteSliders);
        triggerSync();
      });

      unsubGallery = subscribeToGalleryImages((remoteImages) => {
        setGalleryImages(remoteImages);
        triggerSync();
      });

      unsubAlbums = subscribeToAlbums((remoteAlbums) => {
        setAlbums(remoteAlbums);
        triggerSync();
      });

      unsubInfoPages = subscribeToInfoPages((remotePages) => {
        setInfoPages(remotePages);
        triggerSync();
      });

      unsubEvents = subscribeToIslamicEvents((remoteEvents) => {
        setIslamicEvents(remoteEvents);
        triggerSync();
      });

      unsubDuas = subscribeToDuas((remoteDuas) => {
        setDuas(remoteDuas);
        triggerSync();
      });

      unsubSpiritualPersonalities = subscribeToSpiritualPersonalities((remote) => {
        setSpiritualPersonalities(remote);
        triggerSync();
      });

      unsubMakhzanPosts = subscribeToMakhzanPosts((remote) => {
        setMakhzanPosts(remote);
        triggerSync();
      });

      unsubMakhzanCategories = subscribeToMakhzanCategories((remote) => {
        setMakhzanCategories(remote);
        triggerSync();
      });

      unsubBranches = subscribeToBranches((remote) => {
        setBranches(remote);
        triggerSync();
      });

      unsubDayDatasets = subscribeToDayDatasets((remote) => {
        setDayDatasets(remote);
        triggerSync();
      });

      unsubSlips = subscribeToSlips((remote) => {
        setSlips(remote);
        triggerSync();
      });

      unsubAuditLogs = subscribeToAuditLogs((remote) => {
        setAuditLogs(remote);
        triggerSync();
      });
    };

    initFirebaseRealtime();

    return () => {
      unsubAuth();
      if (unsubAppUsers) unsubAppUsers();
      if (unsubPosts) unsubPosts();
      if (unsubCategories) unsubCategories();
      if (unsubPDFs) unsubPDFs();
      if (unsubVideos) unsubVideos();
      if (unsubAudios) unsubAudios();
      if (unsubNotifications) unsubNotifications();
      if (unsubFeedback) unsubFeedback();
      if (unsubDonations) unsubDonations();
      if (unsubDonationInitiatives) unsubDonationInitiatives();
      if (unsubSliders) unsubSliders();
      if (unsubGallery) unsubGallery();
      if (unsubAlbums) unsubAlbums();
      if (unsubInfoPages) unsubInfoPages();
      if (unsubEvents) unsubEvents();
      if (unsubDuas) unsubDuas();
      if (unsubSpiritualPersonalities) unsubSpiritualPersonalities();
      if (unsubMakhzanPosts) unsubMakhzanPosts();
      if (unsubMakhzanCategories) unsubMakhzanCategories();
      if (unsubBranches) unsubBranches();
      if (unsubDayDatasets) unsubDayDatasets();
      if (unsubSlips) unsubSlips();
      if (unsubAuditLogs) unsubAuditLogs();
    };
  }, []);

  const triggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 1200);
  };

  // State handlers to bind Simulator with Admin panel & Firestore Real-time
  const handleAddPost = (p: Post) => {
    setPosts((prev) => dedupeById([p, ...prev.filter((item) => item.id !== p.id)]));
    savePostToFirestore(p);
    dispatchFCMNotification({
      title: 'New Post Published',
      titleUrdu: 'نئی تحریر/پوسٹ شائع کی گئی',
      body: p.title,
      bodyUrdu: p.titleUrdu || p.title,
      type: 'post',
      targetId: p.id
    });
    recordAuditLog('POST_SAVED', 'Admin', `Created post "${p.title}" (${p.id})`);
    triggerSync();
  };

  const handleEditPost = (p: Post) => {
    setPosts((prev) => prev.map(pt => pt.id === p.id ? p : pt));
    savePostToFirestore(p);
    recordAuditLog('POST_SAVED', 'Admin', `Updated post "${p.title}" (${p.id})`);
    triggerSync();
  };

  const handleDeletePost = async (id: string) => {
    setPosts((prev) => prev.filter(p => p.id !== id));
    setBookmarks((prev) => ({
      ...prev,
      posts: prev.posts.filter((bId) => bId !== id)
    }));
    await deletePostFromFirestore(id);
    recordAuditLog('POST_DELETED', 'Admin', `Deleted post ID ${id}`);
    triggerSync();
  };

  const handleToggleHidePost = (p: Post) => {
    const updatedStatus = p.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...p, status: updatedStatus as any };
    setPosts(posts.map(pt => pt.id === p.id ? updated : pt));
    savePostToFirestore(updated);
    triggerSync();
  };

  const handleAddCategory = (c: Category) => {
    setCategories(dedupeById([...categories, c]));
    saveCategoryToFirestore(c);
    triggerSync();
  };

  const handleEditCategory = (c: Category) => {
    setCategories(categories.map(cat => cat.id === c.id ? c : cat));
    saveCategoryToFirestore(c);
    triggerSync();
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter(c => c.id !== id));
    deleteCategoryFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideCategory = (c: Category) => {
    const updatedStatus = c.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...c, status: updatedStatus as any };
    setCategories(categories.map(cat => cat.id === c.id ? updated : cat));
    saveCategoryToFirestore(updated);
    triggerSync();
  };

  const handleAddPdf = (pdf: PDFBook) => {
    setPdfs(dedupeById([pdf, ...pdfs]));
    savePDFToFirestore(pdf);
    triggerSync();
  };

  const handleEditPdf = (pdf: PDFBook) => {
    setPdfs(pdfs.map(p => p.id === pdf.id ? pdf : p));
    savePDFToFirestore(pdf);
    triggerSync();
  };

  const handleDeletePdf = (id: string) => {
    setPdfs(pdfs.filter(p => p.id !== id));
    deletePDFFromFirestore(id);
    triggerSync();
  };

  const handleToggleHidePdf = (pdf: PDFBook) => {
    const updatedStatus = pdf.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...pdf, status: updatedStatus as any };
    setPdfs(pdfs.map(p => p.id === pdf.id ? updated : p));
    savePDFToFirestore(updated);
    triggerSync();
  };

  const handleAddVideo = (v: VideoItem) => {
    setVideos(dedupeById([v, ...videos]));
    saveVideoToFirestore(v);
    triggerSync();
  };

  const handleEditVideo = (v: VideoItem) => {
    setVideos(videos.map(item => item.id === v.id ? v : item));
    saveVideoToFirestore(v);
    triggerSync();
  };

  const handleDeleteVideo = (id: string) => {
    setVideos(videos.filter(v => v.id !== id));
    deleteVideoFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideVideo = (v: VideoItem) => {
    const updatedStatus = v.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...v, status: updatedStatus as any };
    setVideos(videos.map(item => item.id === v.id ? updated : item));
    saveVideoToFirestore(updated);
    triggerSync();
  };

  const handleAddAudio = (a: AudioItem) => {
    setAudios(dedupeById([a, ...audios]));
    saveAudioToFirestore(a);
    triggerSync();
  };

  const handleEditAudio = (a: AudioItem) => {
    setAudios(audios.map(item => item.id === a.id ? a : item));
    saveAudioToFirestore(a);
    triggerSync();
  };

  const handleDeleteAudio = (id: string) => {
    setAudios(audios.filter(a => a.id !== id));
    deleteAudioFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideAudio = (a: AudioItem) => {
    const updatedStatus = a.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...a, status: updatedStatus as any };
    setAudios(audios.map(item => item.id === a.id ? updated : item));
    saveAudioToFirestore(updated);
    triggerSync();
  };

  const handleAddGalleryImage = (img: GalleryImage) => {
    setGalleryImages(dedupeById([img, ...galleryImages]));
    saveGalleryImageToFirestore(img);
    triggerSync();
  };

  const handleEditGalleryImage = (img: GalleryImage) => {
    setGalleryImages(galleryImages.map(g => g.id === img.id ? img : g));
    saveGalleryImageToFirestore(img);
    triggerSync();
  };

  const handleDeleteGalleryImage = (id: string) => {
    setGalleryImages(galleryImages.filter(g => g.id !== id));
    deleteGalleryImageFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideGalleryImage = (img: GalleryImage) => {
    const updatedStatus = img.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...img, status: updatedStatus as any };
    setGalleryImages(galleryImages.map(g => g.id === img.id ? updated : g));
    saveGalleryImageToFirestore(updated);
    triggerSync();
  };

  const handleAddAlbum = (album: GalleryAlbum) => {
    setAlbums(dedupeById([album, ...albums]));
    saveAlbumToFirestore(album);
    triggerSync();
  };

  const handleEditAlbum = (album: GalleryAlbum) => {
    setAlbums(albums.map(a => a.id === album.id ? album : a));
    saveAlbumToFirestore(album);
    triggerSync();
  };

  const handleDeleteAlbum = (id: string) => {
    setAlbums(albums.filter(a => a.id !== id));
    deleteAlbumFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideAlbum = (album: GalleryAlbum) => {
    const updatedStatus = album.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...album, status: updatedStatus as any };
    setAlbums(albums.map(a => a.id === album.id ? updated : a));
    saveAlbumToFirestore(updated);
    triggerSync();
  };

  const handleReplyFeedback = (feedbackId: string, replyMessage: string) => {
    const updatedList = feedback.map(f => {
      if (f.id === feedbackId) {
        const item: FeedbackItem = {
          ...f,
          replied: true,
          replyMessage,
          replyDate: new Date().toISOString().split('T')[0]
        };
        updateFeedbackInFirestore(item);
        return item;
      }
      return f;
    });
    setFeedback(dedupeById(updatedList));
    triggerSync();
  };

  const handleDeleteFeedback = (id: string) => {
    setFeedback(feedback.filter(f => f.id !== id));
    deleteFeedbackFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideFeedback = (feed: FeedbackItem) => {
    const updatedStatus = feed.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...feed, status: updatedStatus as any };
    setFeedback(feedback.map(f => f.id === feed.id ? updated : f));
    updateFeedbackInFirestore(updated);
    triggerSync();
  };

  const handleSendNotification = (n: AppNotification) => {
    setNotifications(dedupeById([n, ...notifications]));
    sendNotificationToFirestore(n);
    triggerSync();
  };

  const handleEditNotification = (n: AppNotification) => {
    setNotifications(notifications.map(item => item.id === n.id ? n : item));
    sendNotificationToFirestore(n);
    triggerSync();
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
    deleteNotificationFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideNotification = (n: AppNotification) => {
    const updatedStatus = n.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...n, status: updatedStatus as any };
    setNotifications(notifications.map(item => item.id === n.id ? updated : item));
    sendNotificationToFirestore(updated);
    triggerSync();
  };

  const handleUpdateContactInfo = (c: ContactInfo) => {
    setContactInfo(c);
    saveContactInfoToFirestore(c);
    triggerSync();
  };

  const handleUpdateSocialLinks = (s: SocialLinks) => {
    setSocialLinks(s);
    saveSocialLinksToFirestore(s);
    triggerSync();
  };

  const handleUpdateSlider = (s: SliderItem[]) => {
    setSliderItems(dedupeById(s));
    s.forEach(item => saveSliderToFirestore(item));
    triggerSync();
  };

  const handleAddSliderItem = (item: SliderItem) => {
    setSliderItems(dedupeById([item, ...sliderItems]));
    saveSliderToFirestore(item);
    triggerSync();
  };

  const handleEditSliderItem = (item: SliderItem) => {
    setSliderItems(sliderItems.map(s => s.id === item.id ? item : s));
    saveSliderToFirestore(item);
    triggerSync();
  };

  const handleDeleteSliderItem = (id: string) => {
    setSliderItems(sliderItems.filter(s => s.id !== id));
    deleteSliderFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideSliderItem = (item: SliderItem) => {
    const updatedStatus = item.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...item, status: updatedStatus as any };
    setSliderItems(sliderItems.map(s => s.id === item.id ? updated : s));
    saveSliderToFirestore(updated);
    triggerSync();
  };

  // Bookmark Toggle
  const handleUpdateBookmarks = (type: 'posts' | 'videos' | 'pdfs' | 'audios', id: string) => {
    const list = bookmarks[type];
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    setBookmarks({
      ...bookmarks,
      [type]: updated
    });
  };

  // Download Toggle
  const handleUpdateDownloads = (type: 'pdfs' | 'audios', id: string) => {
    const list = downloads[type];
    const updated = list.includes(id) ? list.filter(item => item !== id) : [...list, id];
    setDownloads({
      ...downloads,
      [type]: updated
    });
  };

  // Submit Feedback from Simulator
  const handleSubmitFeedback = (name: string, email: string, mobile: string, subject: string, message: string) => {
    const feed: FeedbackItem = {
      id: `feed-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name,
      email,
      contactNumber: mobile,
      subject,
      message,
      date: new Date().toISOString().split('T')[0],
      replied: false,
      status: 'published'
    };
    setFeedback(dedupeById([feed, ...feedback]));
    submitFeedbackToFirestore({
      name,
      email,
      contactNumber: mobile,
      subject,
      message,
      date: feed.date,
      replied: false,
      status: 'published'
    });
    triggerSync();
  };

  const handleUpdateProfile = (profile: { name: string; email: string; mobile: string; city: string }) => {
    setCurrentUser(profile);
  };

  // Donation handlers
  const handleAddDonationInitiative = (init: DonationInitiative) => {
    setDonationInitiatives(dedupeById([init, ...donationInitiatives]));
    saveDonationInitiativeToFirestore(init);
    triggerSync();
  };

  const handleEditDonationInitiative = (init: DonationInitiative) => {
    setDonationInitiatives(donationInitiatives.map(i => i.id === init.id ? init : i));
    saveDonationInitiativeToFirestore(init);
    triggerSync();
  };

  const handleDeleteDonationInitiative = (id: string) => {
    setDonationInitiatives(donationInitiatives.filter(i => i.id !== id));
    deleteDonationInitiativeFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideDonationInitiative = (init: DonationInitiative) => {
    const updatedStatus = init.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...init, status: updatedStatus as any };
    setDonationInitiatives(donationInitiatives.map(i => i.id === init.id ? updated : i));
    saveDonationInitiativeToFirestore(updated);
    triggerSync();
  };

  const handleAddDonationRecord = (rec: DonationRecord) => {
    setDonationRecords(dedupeById([rec, ...donationRecords]));
    saveDonationRecordToFirestore(rec);
    triggerSync();
  };

  const handleEditDonationRecord = (rec: DonationRecord) => {
    setDonationRecords(donationRecords.map(r => r.id === rec.id ? rec : r));
    saveDonationRecordToFirestore(rec);
    triggerSync();
  };

  const handleDeleteDonationRecord = (id: string) => {
    setDonationRecords(donationRecords.filter(r => r.id !== id));
    deleteDonationRecordFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideDonationRecord = (rec: DonationRecord) => {
    const updated = { ...rec, isHidden: !rec.isHidden };
    setDonationRecords(donationRecords.map(r => r.id === rec.id ? updated : r));
    saveDonationRecordToFirestore(updated);
    triggerSync();
  };

  const handleSubmitDonation = (
    donorName: string,
    donorEmail: string,
    donorMobile: string,
    amount: number,
    currency: 'PKR' | 'USD',
    paymentMethod: 'bank_transfer' | 'easy_paisa' | 'jazz_cash' | 'credit_card',
    referenceNumber: string,
    initiativeId: string,
    notes?: string
  ) => {
    const init = donationInitiatives.find(i => i.id === initiativeId);
    const donation: DonationRecord = {
      id: `don-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      initiativeId,
      initiativeTitle: init ? init.title : 'General Initiative',
      donorName,
      donorEmail,
      donorMobile,
      amount,
      currency,
      paymentMethod,
      referenceNumber,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      notes
    };
    setDonationRecords(dedupeById([donation, ...donationRecords]));
    submitDonationToFirestore({
      initiativeId,
      initiativeTitle: donation.initiativeTitle,
      donorName,
      donorEmail,
      donorMobile,
      amount,
      currency,
      paymentMethod,
      referenceNumber,
      date: donation.date,
      status: 'pending',
      notes: notes || ''
    });
    triggerSync();
  };

  const handleVerifyDonation = (id: string, newStatus: 'verified' | 'rejected') => {
    setDonationRecords(prevRecords => {
      return prevRecords.map(rec => {
        if (rec.id === id) {
          const updated = { ...rec, status: newStatus };
          saveDonationRecordToFirestore(updated);
          const oldStatus = rec.status;
          if (oldStatus !== newStatus) {
            setDonationInitiatives(prevInits => {
              return prevInits.map(init => {
                if (init.id === rec.initiativeId) {
                  let diff = 0;
                  if (newStatus === 'verified') {
                    diff = rec.amount;
                  } else if (oldStatus === 'verified') {
                    diff = -rec.amount;
                  }
                  const updatedInit = { ...init, raisedAmount: init.raisedAmount + diff };
                  saveDonationInitiativeToFirestore(updatedInit);
                  return updatedInit;
                }
                return init;
              });
            });
          }
          return updated;
        }
        return rec;
      });
    });
    triggerSync();
  };

  // Info Pages handlers
  const handleAddInfoPage = (page: InfoPage) => {
    setInfoPages(dedupeById([page, ...infoPages]));
    saveInfoPageToFirestore(page);
    triggerSync();
  };

  const handleEditInfoPage = (page: InfoPage) => {
    setInfoPages(infoPages.map(p => p.id === page.id ? page : p));
    saveInfoPageToFirestore(page);
    triggerSync();
  };

  const handleDeleteInfoPage = (id: string) => {
    setInfoPages(infoPages.filter(p => p.id !== id));
    deleteInfoPageFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideInfoPage = (page: InfoPage) => {
    const updatedStatus = page.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...page, status: updatedStatus as any };
    setInfoPages(infoPages.map(p => p.id === page.id ? updated : p));
    saveInfoPageToFirestore(page);
    triggerSync();
  };

  // Islamic Events handlers
  const handleAddIslamicEvent = (event: IslamicEvent) => {
    setIslamicEvents(dedupeById([event, ...islamicEvents]));
    saveIslamicEventToFirestore(event);
    dispatchFCMNotification({
      title: 'New Islamic Event Added',
      titleUrdu: 'نیا اسلامی واقعہ/مناسبت شامل کی گئی',
      body: `${event.title} (${event.hijriDay} Hijri)`,
      bodyUrdu: `${event.titleUrdu || event.title} (${event.hijriDay} ہجری)`,
      type: 'event',
      targetId: event.id
    });
    triggerSync();
  };

  const handleEditIslamicEvent = (event: IslamicEvent) => {
    setIslamicEvents(islamicEvents.map(e => e.id === event.id ? event : e));
    saveIslamicEventToFirestore(event);
    triggerSync();
  };

  const handleDeleteIslamicEvent = (id: string) => {
    setIslamicEvents(islamicEvents.filter(e => e.id !== id));
    deleteIslamicEventFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideIslamicEvent = (event: IslamicEvent) => {
    const updatedStatus = event.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...event, status: updatedStatus as any };
    setIslamicEvents(islamicEvents.map(e => e.id === event.id ? updated : e));
    saveIslamicEventToFirestore(updated);
    triggerSync();
  };

  // Duas handlers
  const handleAddDua = (dua: DuaItem) => {
    setDuas(dedupeById([dua, ...duas]));
    saveDuaToFirestore(dua);
    triggerSync();
  };

  const handleEditDua = (dua: DuaItem) => {
    setDuas(duas.map(d => d.id === dua.id ? dua : d));
    saveDuaToFirestore(dua);
    triggerSync();
  };

  const handleDeleteDua = (id: string) => {
    setDuas(duas.filter(d => d.id !== id));
    deleteDuaFromFirestore(id);
    triggerSync();
  };

  const handleToggleHideDua = (dua: DuaItem) => {
    const updatedStatus = dua.status === 'hidden' ? 'published' : 'hidden';
    const updated = { ...dua, status: updatedStatus as any };
    setDuas(duas.map(d => d.id === dua.id ? updated : d));
    saveDuaToFirestore(updated);
    triggerSync();
  };

  // Firebase Authentication Handler for Admin Deck
  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (!adminUsernameInput.trim() || !adminPasswordInput.trim()) {
      setAuthError('Invalid credentials. Please contact the app administrator.');
      return;
    }

    setIsAuthLoading(true);
    const result = await adminSignInWithFirebase(adminUsernameInput, adminPasswordInput);
    setIsAuthLoading(false);

    if (result.success) {
      setIsAdminAuthenticated(true);
      setAuthError('');
      setAdminUsernameInput('');
      setAdminPasswordInput('');
    } else {
      setAuthError('Invalid credentials. Please contact the app administrator.');
    }
  };

  const handleAdminLogout = async () => {
    await adminSignOutWithFirebase();
    setIsAdminAuthenticated(false);
  };

  return (
    <VoiceReaderProvider>
      <div className="min-h-[100dvh] bg-slate-950 flex flex-col font-sans selection:bg-emerald-800 selection:text-white">
      
      {/* Premium Top Navigation Control Deck (shown in split/admin mode) */}
      {viewMode !== 'simulator' && (
        <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-3 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-emerald-800 flex items-center justify-center font-bold border border-amber-500 shadow-md overflow-hidden shrink-0">
              <img src={appLogo} alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="text-left">
              <h1 className="text-base font-bold text-white tracking-wide">Halqa-e-Usmania Master Hub</h1>
              <p className="text-[10px] text-slate-400">Integrated Android Simulator & Content Management System v1.0</p>
            </div>
          </div>

          {/* Sync & View switches */}
          <div className="flex items-center gap-3">
            
            {/* Sync indicator */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/60 rounded-xl border border-slate-800 text-[11px]">
              <span className={`w-2 h-2 rounded-full ${syncStatus === 'syncing' ? 'bg-amber-400 animate-ping' : 'bg-green-500'}`}></span>
              <span className="text-slate-300 font-mono">
                {syncStatus === 'syncing' ? 'Syncing...' : 'Real-time Database Active'}
              </span>
              <RefreshCw size={11} className={`text-slate-500 ml-1 cursor-pointer ${syncStatus === 'syncing' ? 'animate-spin' : ''}`} onClick={triggerSync} />
            </div>

            {/* View mode buttons */}
            <div className="bg-slate-950 p-1 rounded-xl flex border border-slate-800">
              <button 
                onClick={() => setViewMode('both')} 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'both' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Globe size={13} />
                <span className="hidden md:inline">Split Screen</span>
              </button>
              <button 
                onClick={() => setViewMode('simulator')} 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'simulator' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Smartphone size={13} />
                <span>Mobile App</span>
              </button>
              <button 
                onClick={() => setViewMode('admin')} 
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${viewMode === 'admin' ? 'bg-emerald-800 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                <Laptop size={13} />
                <span>Admin Deck</span>
              </button>
            </div>

            {isAdminAuthenticated && (
              <button 
                onClick={handleAdminLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-700/50 rounded-xl text-xs font-semibold transition-all"
                title="Sign out of Admin Deck"
              >
                <LogOut size={13} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}

          </div>
        </header>
      )}

      {/* Main workspace splits */}
      <main className={`flex-1 flex justify-center items-stretch ${viewMode === 'simulator' ? 'p-0 w-full min-h-[100dvh]' : 'p-3 sm:p-6 gap-6 overflow-hidden min-w-0 min-h-0'}`}>
        
        {/* LEFT COMPONENT: Android Simulator / Full Screen App */}
        {(viewMode === 'both' || viewMode === 'simulator') && (
          <div className={`flex flex-col items-center justify-center shrink-0 ${viewMode === 'both' ? 'w-full lg:w-[450px] xl:w-[480px] h-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl' : 'w-full min-h-[100dvh]'}`}>
            <AppSimulator 
              posts={posts}
              categories={categories}
              pdfs={pdfs}
              videos={videos}
              audios={audios}
              albums={albums}
              galleryImages={galleryImages}
              feedback={feedback}
              notifications={notifications}
              sliderItems={sliderItems}
              contactInfo={contactInfo}
              socialLinks={socialLinks}
              bookmarks={bookmarks}
              downloads={downloads}
              currentUser={currentUser}
              onUpdateBookmarks={handleUpdateBookmarks}
              onUpdateDownloads={handleUpdateDownloads}
              onSubmitFeedback={handleSubmitFeedback}
              onUpdateProfile={handleUpdateProfile}
              notificationsEnabled={userSettings.notificationsEnabled}
              onToggleNotificationSettings={() => setUserSettings({ ...userSettings, notificationsEnabled: !userSettings.notificationsEnabled })}
              userSettings={userSettings}
              onUpdateUserSettings={(settings) => setUserSettings({ ...userSettings, ...settings })}
              donationInitiatives={donationInitiatives}
              donationRecords={donationRecords}
              onSubmitDonation={handleSubmitDonation}
              infoPages={infoPages}
              viewMode={viewMode}
              onSwitchViewMode={(mode) => setViewMode(mode)}

              // KhanQah Props
              branches={branches}
              dayDatasets={dayDatasets}
              appUsers={appUsers}
              slips={slips}
              modSettings={modSettings}
              activeAppUser={activeAppUser}
              onSelectActiveUser={setActiveAppUser}
              onSelfRegisterUser={handleSelfRegisterUser}
              onCreateSlip={handleCreateSlip}

              // Makhzan-e-Khas
              makhzanCategories={makhzanCategories}
              makhzanPosts={makhzanPosts}

              // Spiritual Personalities
              spiritualPersonalities={spiritualPersonalities}
            />
          </div>
        )}

        {/* RIGHT COMPONENT: Admin CMS Dashboard (displays if viewMode is both or admin) */}
        {(viewMode === 'both' || viewMode === 'admin') && (
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {isAdminAuthenticated ? (
              /* Display Authenticated Admin Control Panel */
              <AdminPanel 
                postSplashScreens={postSplashScreens}
                onAddPostSplashScreen={handleAddPostSplashScreen}
                onEditPostSplashScreen={handleEditPostSplashScreen}
                onDeletePostSplashScreen={handleDeletePostSplashScreen}
                onTogglePostSplashScreen={handleTogglePostSplashScreen}
                posts={posts}
                categories={categories}
                pdfs={pdfs}
                videos={videos}
                audios={audios}
                albums={albums}
                galleryImages={galleryImages}
                feedback={feedback}
                notifications={notifications}
                sliderItems={sliderItems}
                contactInfo={contactInfo}
                socialLinks={socialLinks}
                donationInitiatives={donationInitiatives}
                donationRecords={donationRecords}
                infoPages={infoPages}
                islamicEvents={islamicEvents}
                duas={duas}

                // Makhzan-e-Khas Props & Handlers
                makhzanCategories={makhzanCategories}
                makhzanPosts={makhzanPosts}
                onAddMakhzanCategory={handleAddMakhzanCategory}
                onEditMakhzanCategory={handleEditMakhzanCategory}
                onDeleteMakhzanCategory={handleDeleteMakhzanCategory}
                onAddMakhzanPost={handleAddMakhzanPost}
                onEditMakhzanPost={handleEditMakhzanPost}
                onDeleteMakhzanPost={handleDeleteMakhzanPost}
                onToggleHideMakhzanPost={handleToggleHideMakhzanPost}

                // Spiritual Personalities Props & Handlers
                spiritualPersonalities={spiritualPersonalities}
                onSaveSpiritualPersonality={handleSaveSpiritualPersonality}
                onDeleteSpiritualPersonality={handleDeleteSpiritualPersonality}
                onToggleHideSpiritualPersonality={handleToggleHideSpiritualPersonality}

                // KhanQah Props & Handlers
                branches={branches}
                dayDatasets={dayDatasets}
                appUsers={appUsers}
                slips={slips}
                auditLogs={auditLogs}
                modSettings={modSettings}
                onAddBranch={handleAddBranch}
                onEditBranch={handleEditBranch}
                onDeleteBranch={handleDeleteBranch}
                onToggleBranchStatus={handleToggleBranchStatus}
                onAddDayRecord={handleAddDatasetRecord}
                onEditDayRecord={handleEditDatasetRecord}
                onDeleteDayRecord={handleDeleteDatasetRecord}
                onBulkImportDayRecords={handleBulkImportDatasetRecords}
                onCreateUser={handleCreateUser}
                onApproveUser={handleApproveUser}
                onRejectUser={handleRejectUser}
                onBlockUser={handleBlockUser}
                onUnblockUser={handleUnblockUser}
                onEditUser={handleEditUser}
                onDeleteUser={handleDeleteUser}
                onCreateSlip={handleCreateSlip}
                onCancelSlip={handleCancelSlip}
                onUpdateModSettings={handleUpdateModSettings}
                onRestoreBackup={handleRestoreBackup}
                
                // Complete CRUD and Hide/Unhide Handlers
                onAddPost={handleAddPost}
                onEditPost={handleEditPost}
                onDeletePost={handleDeletePost}
                onToggleHidePost={handleToggleHidePost}
                
                onAddCategory={handleAddCategory}
                onEditCategory={handleEditCategory}
                onDeleteCategory={handleDeleteCategory}
                onToggleHideCategory={handleToggleHideCategory}
                
                onAddPdf={handleAddPdf}
                onEditPdf={handleEditPdf}
                onDeletePdf={handleDeletePdf}
                onToggleHidePdf={handleToggleHidePdf}
                
                onAddVideo={handleAddVideo}
                onEditVideo={handleEditVideo}
                onDeleteVideo={handleDeleteVideo}
                onToggleHideVideo={handleToggleHideVideo}
                
                onAddAudio={handleAddAudio}
                onEditAudio={handleEditAudio}
                onDeleteAudio={handleDeleteAudio}
                onToggleHideAudio={handleToggleHideAudio}
                
                onAddGalleryImage={handleAddGalleryImage}
                onEditGalleryImage={handleEditGalleryImage}
                onDeleteGalleryImage={handleDeleteGalleryImage}
                onToggleHideGalleryImage={handleToggleHideGalleryImage}
                
                onAddAlbum={handleAddAlbum}
                onEditAlbum={handleEditAlbum}
                onDeleteAlbum={handleDeleteAlbum}
                onToggleHideAlbum={handleToggleHideAlbum}
                
                onReplyFeedback={handleReplyFeedback}
                onDeleteFeedback={handleDeleteFeedback}
                onToggleHideFeedback={handleToggleHideFeedback}
                
                onSendNotification={handleSendNotification}
                onEditNotification={handleEditNotification}
                onDeleteNotification={handleDeleteNotification}
                onToggleHideNotification={handleToggleHideNotification}
                
                onUpdateContactInfo={handleUpdateContactInfo}
                onUpdateSocialLinks={handleUpdateSocialLinks}
                onUpdateSlider={handleUpdateSlider}
                onAddSliderItem={handleAddSliderItem}
                onEditSliderItem={handleEditSliderItem}
                onDeleteSliderItem={handleDeleteSliderItem}
                onToggleHideSliderItem={handleToggleHideSliderItem}
                
                onAddDonationInitiative={handleAddDonationInitiative}
                onEditDonationInitiative={handleEditDonationInitiative}
                onDeleteDonationInitiative={handleDeleteDonationInitiative}
                onToggleHideDonationInitiative={handleToggleHideDonationInitiative}
                
                onAddDonationRecord={handleAddDonationRecord}
                onEditDonationRecord={handleEditDonationRecord}
                onDeleteDonationRecord={handleDeleteDonationRecord}
                onVerifyDonation={handleVerifyDonation}
                onToggleHideDonationRecord={handleToggleHideDonationRecord}
                
                onAddInfoPage={handleAddInfoPage}
                onEditInfoPage={handleEditInfoPage}
                onDeleteInfoPage={handleDeleteInfoPage}
                onToggleHideInfoPage={handleToggleHideInfoPage}
                
                onAddIslamicEvent={handleAddIslamicEvent}
                onEditIslamicEvent={handleEditIslamicEvent}
                onDeleteIslamicEvent={handleDeleteIslamicEvent}
                onToggleHideIslamicEvent={handleToggleHideIslamicEvent}
                
                onAddDua={handleAddDua}
                onEditDua={handleEditDua}
                onDeleteDua={handleDeleteDua}
                onToggleHideDua={handleToggleHideDua}
                voiceReaderSettings={userSettings.voiceReaderSettings}
                onUpdateVoiceReaderSettings={(vSettings) => setUserSettings(prev => ({ ...prev, voiceReaderSettings: vSettings }))}
              />
            ) : (
              /* Secure Admin Login Form */
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center h-full text-center max-w-xl mx-auto my-auto shadow-2xl">
                <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/15">
                  <Lock size={28} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-1">Administrative Authentication</h2>
                <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                  Sign in with your administrator account to access content management, system configuration, donation ledgers, and feedback channels.
                </p>

                <form onSubmit={handleAdminLoginSubmit} className="w-full space-y-4">
                  <div className="text-left">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Admin Username / Email</label>
                    <input 
                      type="text" 
                      value={adminUsernameInput}
                      onChange={(e) => setAdminUsernameInput(e.target.value)}
                      placeholder="Enter admin identifier"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                  </div>
                  <div className="text-left">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider block mb-1">Password</label>
                    <input 
                      type="password" 
                      value={adminPasswordInput}
                      onChange={(e) => setAdminPasswordInput(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors" 
                    />
                  </div>

                  {authError && (
                    <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-xs flex items-center gap-2 text-left">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{authError}</span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={isAuthLoading}
                    className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isAuthLoading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Authenticating...
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={16} /> Authenticate Admin Account
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Elegant footer banner */}
      <footer className="bg-slate-950 border-t border-slate-900 py-3 text-center text-[10px] text-slate-600 font-mono shrink-0">
        Halqa-e-Usmania Islamic Digital Initiative • Master Android Architecture Version 1.0 (PRO) • Compliant with all master specifications
      </footer>

      {/* One-Time App Permission Dialog */}
      {showPermissionModal && (
        <div className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-5 text-center relative overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <ShieldCheck size={32} />
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-extrabold text-white">درخواستِ اجازت نامہ (App Permissions)</h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                بہتر تجربے، اوقاتِ نماز کی خودکار رہنمائی اور نوٹیفکیشنز کے لیے درج ذیل اجازتیں فراہم کریں۔ یہ اجازت صرف ایک بار مانگی جائے گی اور محفوظ کر لی جائے گی۔
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-left text-xs">
              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl flex items-center gap-2.5">
                <MapPin size={18} className="text-emerald-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">موقع (Location)</div>
                  <div className="text-[10px] text-slate-400">خودکار اوقاتِ نماز</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl flex items-center gap-2.5">
                <Bell size={18} className="text-amber-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">نوٹیفکیشنز</div>
                  <div className="text-[10px] text-slate-400">اذان و اعلانات</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl flex items-center gap-2.5">
                <FolderOpen size={18} className="text-sky-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">اسٹوریج</div>
                  <div className="text-[10px] text-slate-400">ڈاؤن لوڈز و کتب</div>
                </div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 p-3 rounded-2xl flex items-center gap-2.5">
                <Camera size={18} className="text-purple-400 shrink-0" />
                <div>
                  <div className="font-bold text-slate-200">کیمرہ و آڈیو</div>
                  <div className="text-[10px] text-slate-400">تصاویری اسکین و صوتی</div>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleGrantAllPermissions}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold rounded-2xl shadow-lg border border-emerald-400/40 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
              >
                <CheckCircle size={18} /> تمام اجازتیں منظور کریں (Allow All)
              </button>

              <button
                onClick={handleSkipPermissions}
                className="w-full py-2 bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                بعد میں (Skip for now)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </VoiceReaderProvider>
  );
}
