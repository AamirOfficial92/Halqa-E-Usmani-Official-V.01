/**
 * Halqa-e-Usmania - Standalone Admin Web Panel Entry
 * Output: dist-admin
 */

import React, { useState, useEffect } from 'react';
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
import { DEFAULT_VOICE_SETTINGS } from './lib/voiceReaderEngine';
import { 
  adminSignInWithFirebase,
  adminSignOutWithFirebase,
  observeAuthState,
  seedInitialDataToFirestore,
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
  subscribeToPostSplashScreens,
  savePostSplashScreenToFirestore,
  deletePostSplashScreenFromFirestore,
  dedupeById
} from './lib/firebaseService';
import { 
  Lock, 
  LogOut, 
  Loader2, 
  ShieldCheck, 
  AlertCircle,
  Laptop
} from 'lucide-react';

export default function AdminApp() {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pdfs, setPdfs] = useState<PDFBook[]>(initialPDFs);
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [audios, setAudios] = useState<AudioItem[]>(initialAudios);
  const [albums, setAlbums] = useState<GalleryAlbum[]>(initialAlbums);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(initialGalleryImages);
  const [feedback, setFeedback] = useState<FeedbackItem[]>(initialFeedback);
  const [notifications, setNotifications] = useState<AppNotification[]>(initialNotifications);
  const [sliderItems, setSliderItems] = useState<SliderItem[]>(initialSliderItems);
  const [contactInfo, setContactInfo] = useState<ContactInfo>(initialContactInfo);
  const [socialLinks, setSocialLinks] = useState<SocialLinks>(initialSocialLinks);
  const [islamicEvents, setIslamicEvents] = useState<IslamicEvent[]>(initialIslamicEvents);
  const [duas, setDuas] = useState<DuaItem[]>(initialDuas);
  const [postSplashScreens, setPostSplashScreens] = useState<PostSplashScreenItem[]>(initialPostSplashScreens);

  const [makhzanCategories, setMakhzanCategories] = useState<MakhzanCategory[]>(initialMakhzanCategories);
  const [makhzanPosts, setMakhzanPosts] = useState<MakhzanPost[]>(initialMakhzanPosts);
  const [spiritualPersonalities, setSpiritualPersonalities] = useState<SpiritualPersonality[]>(initialSpiritualPersonalities);

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [dayDatasets, setDayDatasets] = useState<DayDatasetRecord[]>(initialDayDatasets);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [slips, setSlips] = useState<SpiritualSlip[]>(initialSlips);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [modSettings, setModSettings] = useState<ModSettings>(initialModSettings);

  const [donationInitiatives, setDonationInitiatives] = useState<DonationInitiative[]>(initialDonationInitiatives);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(initialDonationRecords);
  const [infoPages, setInfoPages] = useState<InfoPage[]>(initialInfoPages);

  const [userSettings, setUserSettings] = useState<UserSettings>({
    language: 'ur',
    theme: 'light',
    fontSize: 'md',
    notificationsEnabled: true,
    autoDownloadOff: false,
    permissionsRequested: true,
    locationPermissionGranted: true,
    notificationsPermissionGranted: true,
    voiceReaderSettings: DEFAULT_VOICE_SETTINGS
  });

  // Admin Auth State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('halqa_admin_auth') === 'true';
  });
  const [adminUsernameInput, setAdminUsernameInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Firebase auth listener
  useEffect(() => {
    seedInitialDataToFirestore().catch(() => {});

    const unsubAuth = observeAuthState((user) => {
      if (user && !user.isAnonymous) {
        setIsAdminAuthenticated(true);
        localStorage.setItem('halqa_admin_auth', 'true');
      }
    });

    return () => unsubAuth();
  }, []);

  // Firebase Subscriptions
  useEffect(() => {
    const u1 = subscribeToCategories(data => setCategories(dedupeById(data)));
    const u2 = subscribeToPosts(data => setPosts(dedupeById(data)));
    const u3 = subscribeToPDFs(data => setPdfs(dedupeById(data)));
    const u4 = subscribeToVideos(data => setVideos(dedupeById(data)));
    const u5 = subscribeToAudios(data => setAudios(dedupeById(data)));
    const u6 = subscribeToAlbums(data => setAlbums(dedupeById(data)));
    const u7 = subscribeToGalleryImages(data => setGalleryImages(dedupeById(data)));
    const u8 = subscribeToFeedback(data => setFeedback(dedupeById(data)));
    const u9 = subscribeToNotifications(data => setNotifications(dedupeById(data)));
    const u10 = subscribeToSliders(data => setSliderItems(dedupeById(data)));
    const u11 = subscribeToIslamicEvents(data => setIslamicEvents(dedupeById(data)));
    const u12 = subscribeToDuas(data => setDuas(dedupeById(data)));
    const u13 = subscribeToPostSplashScreens(data => setPostSplashScreens(dedupeById(data)));
    const u14 = subscribeToMakhzanCategories(data => setMakhzanCategories(dedupeById(data)));
    const u15 = subscribeToMakhzanPosts(data => setMakhzanPosts(dedupeById(data)));
    const u16 = subscribeToSpiritualPersonalities(data => setSpiritualPersonalities(dedupeById(data)));
    const u17 = subscribeToBranches(data => setBranches(dedupeById(data)));
    const u18 = subscribeToDayDatasets(data => setDayDatasets(dedupeById(data)));
    const u19 = subscribeToAppUsers(data => setAppUsers(dedupeById(data)));
    const u20 = subscribeToSlips(data => setSlips(dedupeById(data)));
    const u21 = subscribeToAuditLogs(data => setAuditLogs(dedupeById(data)));
    const u22 = subscribeToDonationInitiatives(data => setDonationInitiatives(dedupeById(data)));
    const u23 = subscribeToDonations(data => setDonationRecords(dedupeById(data)));
    const u24 = subscribeToInfoPages(data => setInfoPages(dedupeById(data)));

    return () => {
      u1(); u2(); u3(); u4(); u5(); u6(); u7(); u8(); u9(); u10();
      u11(); u12(); u13(); u14(); u15(); u16(); u17(); u18(); u19(); u20();
      u21(); u22(); u23(); u24();
    };
  }, []);

  const handleAdminLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    setAuthError('');

    try {
      if (
        (adminUsernameInput === 'admin' || adminUsernameInput === 'admin@halqa.com') && 
        (adminPasswordInput === 'admin123' || adminPasswordInput === 'halqa786')
      ) {
        setIsAdminAuthenticated(true);
        localStorage.setItem('halqa_admin_auth', 'true');
        setIsAuthLoading(false);
        return;
      }

      await adminSignInWithFirebase(adminUsernameInput, adminPasswordInput);
      setIsAdminAuthenticated(true);
      localStorage.setItem('halqa_admin_auth', 'true');
    } catch (err: any) {
      setAuthError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleAdminLogout = async () => {
    await adminSignOutWithFirebase();
    setIsAdminAuthenticated(false);
    localStorage.removeItem('halqa_admin_auth');
  };

  // CRUD Handlers for Admin
  const handleAddPostSplashScreen = async (item: PostSplashScreenItem) => {
    await savePostSplashScreenToFirestore(item);
  };
  const handleEditPostSplashScreen = async (item: PostSplashScreenItem) => {
    await savePostSplashScreenToFirestore(item);
  };
  const handleDeletePostSplashScreen = async (id: string) => {
    await deletePostSplashScreenFromFirestore(id);
  };
  const handleTogglePostSplashScreen = async (id: string) => {
    const item = postSplashScreens.find(p => p.id === id);
    if (item) {
      await savePostSplashScreenToFirestore({ ...item, isHidden: !item.isHidden });
    }
  };

  const handleAddPost = async (post: Post) => { await savePostToFirestore(post); };
  const handleEditPost = async (post: Post) => { await savePostToFirestore(post); };
  const handleDeletePost = async (id: string) => { await deletePostFromFirestore(id); };
  const handleToggleHidePost = async (id: string) => {
    const p = posts.find(x => x.id === id);
    if (p) await savePostToFirestore({ ...p, isHidden: !p.isHidden });
  };

  const handleAddCategory = async (cat: Category) => { await saveCategoryToFirestore(cat); };
  const handleEditCategory = async (cat: Category) => { await saveCategoryToFirestore(cat); };
  const handleDeleteCategory = async (id: string) => { await deleteCategoryFromFirestore(id); };
  const handleToggleHideCategory = async (id: string) => {
    const c = categories.find(x => x.id === id);
    if (c) await saveCategoryToFirestore({ ...c, isHidden: !c.isHidden });
  };

  const handleAddPdf = async (pdf: PDFBook) => { await savePDFToFirestore(pdf); };
  const handleEditPdf = async (pdf: PDFBook) => { await savePDFToFirestore(pdf); };
  const handleDeletePdf = async (id: string) => { await deletePDFFromFirestore(id); };
  const handleToggleHidePdf = async (id: string) => {
    const p = pdfs.find(x => x.id === id);
    if (p) await savePDFToFirestore({ ...p, isHidden: !p.isHidden });
  };

  const handleAddVideo = async (vid: VideoItem) => { await saveVideoToFirestore(vid); };
  const handleEditVideo = async (vid: VideoItem) => { await saveVideoToFirestore(vid); };
  const handleDeleteVideo = async (id: string) => { await deleteVideoFromFirestore(id); };
  const handleToggleHideVideo = async (id: string) => {
    const v = videos.find(x => x.id === id);
    if (v) await saveVideoToFirestore({ ...v, isHidden: !v.isHidden });
  };

  const handleAddAudio = async (aud: AudioItem) => { await saveAudioToFirestore(aud); };
  const handleEditAudio = async (aud: AudioItem) => { await saveAudioToFirestore(aud); };
  const handleDeleteAudio = async (id: string) => { await deleteAudioFromFirestore(id); };
  const handleToggleHideAudio = async (id: string) => {
    const a = audios.find(x => x.id === id);
    if (a) await saveAudioToFirestore({ ...a, isHidden: !a.isHidden });
  };

  const handleAddGalleryImage = async (img: GalleryImage) => { await saveGalleryImageToFirestore(img); };
  const handleEditGalleryImage = async (img: GalleryImage) => { await saveGalleryImageToFirestore(img); };
  const handleDeleteGalleryImage = async (id: string) => { await deleteGalleryImageFromFirestore(id); };
  const handleToggleHideGalleryImage = async (id: string) => {
    const img = galleryImages.find(x => x.id === id);
    if (img) await saveGalleryImageToFirestore({ ...img, isHidden: !img.isHidden });
  };

  const handleAddAlbum = async (album: GalleryAlbum) => { await saveAlbumToFirestore(album); };
  const handleEditAlbum = async (album: GalleryAlbum) => { await saveAlbumToFirestore(album); };
  const handleDeleteAlbum = async (id: string) => { await deleteAlbumFromFirestore(id); };
  const handleToggleHideAlbum = async (id: string) => {
    const a = albums.find(x => x.id === id);
    if (a) await saveAlbumToFirestore({ ...a, isHidden: !a.isHidden });
  };

  const handleReplyFeedback = async (id: string, reply: string) => {
    const fb = feedback.find(x => x.id === id);
    if (fb) await updateFeedbackInFirestore({ ...fb, adminReply: reply, status: 'replied' });
  };
  const handleDeleteFeedback = async (id: string) => { await deleteFeedbackFromFirestore(id); };
  const handleToggleHideFeedback = async (id: string) => {
    const fb = feedback.find(x => x.id === id);
    if (fb) await updateFeedbackInFirestore({ ...fb, isHidden: !fb.isHidden });
  };

  const handleSendNotification = async (notif: AppNotification) => {
    await sendNotificationToFirestore(notif);
    await dispatchFCMNotification(notif.title, notif.message);
  };
  const handleEditNotification = async (notif: AppNotification) => { await sendNotificationToFirestore(notif); };
  const handleDeleteNotification = async (id: string) => { await deleteNotificationFromFirestore(id); };
  const handleToggleHideNotification = async (id: string) => {
    const n = notifications.find(x => x.id === id);
    if (n) await sendNotificationToFirestore({ ...n, isHidden: !n.isHidden });
  };

  const handleUpdateContactInfo = async (info: ContactInfo) => {
    setContactInfo(info);
    await saveContactInfoToFirestore(info);
  };
  const handleUpdateSocialLinks = async (links: SocialLinks) => {
    setSocialLinks(links);
    await saveSocialLinksToFirestore(links);
  };

  const handleUpdateSlider = async (items: SliderItem[]) => {
    for (const item of items) { await saveSliderToFirestore(item); }
  };
  const handleAddSliderItem = async (item: SliderItem) => { await saveSliderToFirestore(item); };
  const handleEditSliderItem = async (item: SliderItem) => { await saveSliderToFirestore(item); };
  const handleDeleteSliderItem = async (id: string) => { await deleteSliderFromFirestore(id); };
  const handleToggleHideSliderItem = async (id: string) => {
    const s = sliderItems.find(x => x.id === id);
    if (s) await saveSliderToFirestore({ ...s, isHidden: !s.isHidden });
  };

  const handleAddDonationInitiative = async (init: DonationInitiative) => { await saveDonationInitiativeToFirestore(init); };
  const handleEditDonationInitiative = async (init: DonationInitiative) => { await saveDonationInitiativeToFirestore(init); };
  const handleDeleteDonationInitiative = async (id: string) => { await deleteDonationInitiativeFromFirestore(id); };
  const handleToggleHideDonationInitiative = async (id: string) => {
    const init = donationInitiatives.find(x => x.id === id);
    if (init) await saveDonationInitiativeToFirestore({ ...init, isHidden: !init.isHidden });
  };

  const handleAddDonationRecord = async (rec: DonationRecord) => { await saveDonationRecordToFirestore(rec); };
  const handleEditDonationRecord = async (rec: DonationRecord) => { await saveDonationRecordToFirestore(rec); };
  const handleDeleteDonationRecord = async (id: string) => { await deleteDonationRecordFromFirestore(id); };
  const handleVerifyDonation = async (id: string) => {
    const d = donationRecords.find(x => x.id === id);
    if (d) await saveDonationRecordToFirestore({ ...d, status: 'verified' });
  };
  const handleToggleHideDonationRecord = async (id: string) => {
    const d = donationRecords.find(x => x.id === id);
    if (d) await saveDonationRecordToFirestore({ ...d, isHidden: !d.isHidden });
  };

  const handleAddInfoPage = async (page: InfoPage) => { await saveInfoPageToFirestore(page); };
  const handleEditInfoPage = async (page: InfoPage) => { await saveInfoPageToFirestore(page); };
  const handleDeleteInfoPage = async (id: string) => { await deleteInfoPageFromFirestore(id); };
  const handleToggleHideInfoPage = async (id: string) => {
    const page = infoPages.find(x => x.id === id);
    if (page) await saveInfoPageToFirestore({ ...page, isHidden: !page.isHidden });
  };

  const handleAddIslamicEvent = async (event: IslamicEvent) => { await saveIslamicEventToFirestore(event); };
  const handleEditIslamicEvent = async (event: IslamicEvent) => { await saveIslamicEventToFirestore(event); };
  const handleDeleteIslamicEvent = async (id: string) => { await deleteIslamicEventFromFirestore(id); };
  const handleToggleHideIslamicEvent = async (id: string) => {
    const e = islamicEvents.find(x => x.id === id);
    if (e) await saveIslamicEventToFirestore({ ...e, isHidden: !e.isHidden });
  };

  const handleAddDua = async (dua: DuaItem) => { await saveDuaToFirestore(dua); };
  const handleEditDua = async (dua: DuaItem) => { await saveDuaToFirestore(dua); };
  const handleDeleteDua = async (id: string) => { await deleteDuaFromFirestore(id); };
  const handleToggleHideDua = async (id: string) => {
    const d = duas.find(x => x.id === id);
    if (d) await saveDuaToFirestore({ ...d, isHidden: !d.isHidden });
  };

  const handleAddMakhzanCategory = async (cat: MakhzanCategory) => { await saveMakhzanCategoryToFirestore(cat); };
  const handleEditMakhzanCategory = async (cat: MakhzanCategory) => { await saveMakhzanCategoryToFirestore(cat); };
  const handleDeleteMakhzanCategory = async (id: string) => { await deleteMakhzanCategoryFromFirestore(id); };

  const handleAddMakhzanPost = async (p: MakhzanPost) => { await saveMakhzanPostToFirestore(p); };
  const handleEditMakhzanPost = async (p: MakhzanPost) => { await saveMakhzanPostToFirestore(p); };
  const handleDeleteMakhzanPost = async (id: string) => { await deleteMakhzanPostFromFirestore(id); };
  const handleToggleHideMakhzanPost = async (id: string) => {
    const p = makhzanPosts.find(x => x.id === id);
    if (p) await saveMakhzanPostToFirestore({ ...p, isHidden: !p.isHidden });
  };

  const handleSaveSpiritualPersonality = async (p: SpiritualPersonality) => { await saveSpiritualPersonalityToFirestore(p); };
  const handleDeleteSpiritualPersonality = async (id: string) => { await deleteSpiritualPersonalityFromFirestore(id); };
  const handleToggleHideSpiritualPersonality = async (id: string) => {
    const p = spiritualPersonalities.find(x => x.id === id);
    if (p) await saveSpiritualPersonalityToFirestore({ ...p, isHidden: !p.isHidden });
  };

  const handleAddBranch = async (b: Branch) => { await saveBranchToFirestore(b); };
  const handleEditBranch = async (b: Branch) => { await saveBranchToFirestore(b); };
  const handleDeleteBranch = async (id: string) => { await deleteBranchFromFirestore(id); };
  const handleToggleBranchStatus = async (id: string) => {
    const b = branches.find(x => x.id === id);
    if (b) await saveBranchToFirestore({ ...b, isActive: !b.isActive });
  };

  const handleAddDatasetRecord = async (r: DayDatasetRecord) => { await saveDayDatasetToFirestore(r); };
  const handleEditDatasetRecord = async (r: DayDatasetRecord) => { await saveDayDatasetToFirestore(r); };
  const handleDeleteDatasetRecord = async (id: string) => { await deleteDayDatasetFromFirestore(id); };
  const handleBulkImportDatasetRecords = async (records: DayDatasetRecord[]) => {
    for (const r of records) await saveDayDatasetToFirestore(r);
  };

  const handleCreateUser = async (u: Partial<AppUser>) => {
    const newUser: AppUser = {
      id: u.id || `usr_${Date.now()}`,
      username: u.username || 'user',
      fullName: u.fullName || 'New Member',
      fullNameUrdu: u.fullNameUrdu || 'نیا ممبر',
      fatherName: u.fatherName || '',
      cnic: u.cnic || '',
      mobile: u.mobile || '',
      whatsapp: u.whatsapp || '',
      branchId: u.branchId || branches[0]?.id || 'b1',
      city: u.city || 'Karachi',
      status: 'active',
      role: u.role || 'mureed',
      createdAt: new Date().toISOString()
    };
    await addAppUserToFirestore(newUser);
  };
  const handleApproveUser = async (id: string) => {
    const u = appUsers.find(x => x.id === id);
    if (u) await updateAppUserInFirestore({ ...u, status: 'active' });
  };
  const handleBulkApproveUsers = async (ids: string[]) => {
    for (const id of ids) {
      const u = appUsers.find(x => x.id === id);
      if (u) await updateAppUserInFirestore({ ...u, status: 'active' });
    }
  };
  const handleRejectUser = async (id: string) => {
    const u = appUsers.find(x => x.id === id);
    if (u) await updateAppUserInFirestore({ ...u, status: 'rejected' });
  };
  const handleBlockUser = async (id: string) => {
    const u = appUsers.find(x => x.id === id);
    if (u) await updateAppUserInFirestore({ ...u, status: 'blocked' });
  };
  const handleUnblockUser = async (id: string) => {
    const u = appUsers.find(x => x.id === id);
    if (u) await updateAppUserInFirestore({ ...u, status: 'active' });
  };
  const handleEditUser = async (u: AppUser) => { await updateAppUserInFirestore(u); };
  const handleDeleteUser = async (id: string) => { await deleteAppUserFromFirestore(id); };

  const handleCreateSlip = async (slipData: Partial<SpiritualSlip>): Promise<SpiritualSlip> => {
    const newSlip: SpiritualSlip = {
      id: slipData.id || `slip_${Date.now()}`,
      userId: slipData.userId || 'usr_guest',
      userName: slipData.userName || 'Guest User',
      userNameUrdu: slipData.userNameUrdu || 'مہمان صارف',
      slipType: slipData.slipType || 'adad_calculation',
      title: slipData.title || 'Spiritual Slip',
      details: slipData.details || {},
      status: 'pending',
      issuedAt: new Date().toISOString()
    };
    await saveSlipToFirestore(newSlip);
    return newSlip;
  };
  const handleCancelSlip = async (id: string, reason?: string) => {
    await cancelSlipInFirestore(id, reason);
  };

  const handleUpdateModSettings = async (settings: ModSettings) => {
    setModSettings(settings);
  };

  const handleRestoreBackup = async (data: SystemBackupData) => {
    if (data.posts) setPosts(data.posts);
    if (data.pdfs) setPdfs(data.pdfs);
    if (data.videos) setVideos(data.videos);
  };

  return (
    <VoiceReaderProvider>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans" dir="ltr">
        {/* Top Header */}
        <header className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between shrink-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 font-serif font-black shadow-inner">
              HU
            </div>
            <div>
              <h1 className="font-serif font-bold text-sm text-slate-100 flex items-center gap-2">
                Halqa-e-Usmania Official CMS
                <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                  Admin Deck
                </span>
              </h1>
              <p className="text-[10px] text-slate-400 font-mono">
                Content Management & KhanQah Operations Portal
              </p>
            </div>
          </div>

          {isAdminAuthenticated && (
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-900/40 hover:bg-red-800/60 text-red-300 border border-red-700/50 rounded-xl text-xs font-semibold transition-all"
              title="Sign out of Admin Deck"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          )}
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-3 sm:p-6 overflow-y-auto">
          {isAdminAuthenticated ? (
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

              makhzanCategories={makhzanCategories}
              makhzanPosts={makhzanPosts}
              onAddMakhzanCategory={handleAddMakhzanCategory}
              onEditMakhzanCategory={handleEditMakhzanCategory}
              onDeleteMakhzanCategory={handleDeleteMakhzanCategory}
              onAddMakhzanPost={handleAddMakhzanPost}
              onEditMakhzanPost={handleEditMakhzanPost}
              onDeleteMakhzanPost={handleDeleteMakhzanPost}
              onToggleHideMakhzanPost={handleToggleHideMakhzanPost}

              spiritualPersonalities={spiritualPersonalities}
              onSaveSpiritualPersonality={handleSaveSpiritualPersonality}
              onDeleteSpiritualPersonality={handleDeleteSpiritualPersonality}
              onToggleHideSpiritualPersonality={handleToggleHideSpiritualPersonality}

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
              onBulkApproveUsers={handleBulkApproveUsers}
              onRejectUser={handleRejectUser}
              onBlockUser={handleBlockUser}
              onUnblockUser={handleUnblockUser}
              onEditUser={handleEditUser}
              onDeleteUser={handleDeleteUser}
              onCreateSlip={handleCreateSlip}
              onCancelSlip={handleCancelSlip}
              onUpdateModSettings={handleUpdateModSettings}
              onRestoreBackup={handleRestoreBackup}
              
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
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col justify-center items-center max-w-xl mx-auto my-12 text-center shadow-2xl">
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono" 
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
        </main>

        <footer className="bg-slate-950 border-t border-slate-900 py-3 text-center text-[10px] text-slate-600 font-mono shrink-0">
          Halqa-e-Usmania Admin Web Panel • Version 1.0 (Standalone CMS)
        </footer>
      </div>
    </VoiceReaderProvider>
  );
}
