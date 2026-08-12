/**
 * Halqa-e-Usmania - Standalone Mobile Application Entry (Capacitor Android APK)
 * Output: dist
 */

import React, { useState, useEffect } from 'react';
import appLogo from './assets/images/app-logo.jpg';
import { AppSimulator } from './components/AppSimulator';
import { VoiceReaderProvider } from './context/VoiceReaderContext';
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
import { generateSlipId, generateUserId } from './lib/slips';
import { DEFAULT_VOICE_SETTINGS } from './lib/voiceReaderEngine';
import { 
  firebaseSignInAnonymously,
  observeAuthState,
  requestFCMToken,
  subscribeToAppUsers,
  addAppUserToFirestore,
  updateAppUserInFirestore,
  subscribeToPosts,
  subscribeToCategories,
  subscribeToPDFs,
  subscribeToVideos,
  subscribeToAudios,
  subscribeToNotifications,
  subscribeToFeedback,
  submitFeedbackToFirestore,
  subscribeToDonations,
  submitDonationToFirestore,
  subscribeToDonationInitiatives,
  subscribeToAlbums,
  subscribeToSliders,
  subscribeToGalleryImages,
  subscribeToInfoPages,
  subscribeToIslamicEvents,
  subscribeToDuas,
  subscribeToSpiritualPersonalities,
  subscribeToMakhzanPosts,
  subscribeToMakhzanCategories,
  subscribeToBranches,
  subscribeToDayDatasets,
  subscribeToSlips,
  saveSlipToFirestore,
  cancelSlipInFirestore,
  subscribeToPostSplashScreens,
  dedupeById
} from './lib/firebaseService';
import { 
  CheckCircle, 
  Smartphone, 
  AlertCircle,
  Bell,
  MapPin,
  Camera,
  FolderOpen
} from 'lucide-react';

export default function MobileApp() {
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

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('halqa_posts');
    return dedupeById(saved ? JSON.parse(saved) : initialPosts);
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

  const [postSplashScreens, setPostSplashScreens] = useState<PostSplashScreenItem[]>(initialPostSplashScreens);

  const [makhzanCategories, setMakhzanCategories] = useState<MakhzanCategory[]>(initialMakhzanCategories);
  const [makhzanPosts, setMakhzanPosts] = useState<MakhzanPost[]>(initialMakhzanPosts);
  const [spiritualPersonalities, setSpiritualPersonalities] = useState<SpiritualPersonality[]>(initialSpiritualPersonalities);

  const [branches, setBranches] = useState<Branch[]>(initialBranches);
  const [dayDatasets, setDayDatasets] = useState<DayDatasetRecord[]>(initialDayDatasets);
  const [appUsers, setAppUsers] = useState<AppUser[]>([]);
  const [slips, setSlips] = useState<SpiritualSlip[]>(initialSlips);

  const [donationInitiatives, setDonationInitiatives] = useState<DonationInitiative[]>(initialDonationInitiatives);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>(initialDonationRecords);
  const [infoPages, setInfoPages] = useState<InfoPage[]>(initialInfoPages);

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

    if ('Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          notifGranted = true;
          await requestFCMToken();
        }
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }

    if ('geolocation' in navigator) {
      try {
        navigator.geolocation.getCurrentPosition(() => {
          locGranted = true;
        }, (err) => {
          console.warn('Geolocation denied or unavailable:', err);
        });
      } catch (e) {
        console.warn('Geolocation error:', e);
      }
    }

    const updatedSettings: UserSettings = {
      ...userSettings,
      permissionsRequested: true,
      notificationsPermissionGranted: notifGranted,
      locationPermissionGranted: locGranted
    };
    setUserSettings(updatedSettings);
    localStorage.setItem('halqa_settings', JSON.stringify(updatedSettings));
    setShowPermissionModal(false);
  };

  const handleSkipPermissions = () => {
    const updatedSettings: UserSettings = {
      ...userSettings,
      permissionsRequested: true
    };
    setUserSettings(updatedSettings);
    localStorage.setItem('halqa_settings', JSON.stringify(updatedSettings));
    setShowPermissionModal(false);
  };

  // Firebase auth & live sync
  useEffect(() => {
    firebaseSignInAnonymously().catch(() => {});

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
    const u21 = subscribeToDonationInitiatives(data => setDonationInitiatives(dedupeById(data)));
    const u22 = subscribeToDonations(data => setDonationRecords(dedupeById(data)));
    const u23 = subscribeToInfoPages(data => setInfoPages(dedupeById(data)));

    return () => {
      u1(); u2(); u3(); u4(); u5(); u6(); u7(); u8(); u9(); u10();
      u11(); u12(); u13(); u14(); u15(); u16(); u17(); u18(); u19(); u20();
      u21(); u22(); u23();
    };
  }, []);

  // Save state to localStorage
  useEffect(() => { localStorage.setItem('halqa_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('halqa_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { localStorage.setItem('halqa_pdfs', JSON.stringify(pdfs)); }, [pdfs]);
  useEffect(() => { localStorage.setItem('halqa_videos', JSON.stringify(videos)); }, [videos]);
  useEffect(() => { localStorage.setItem('halqa_audios', JSON.stringify(audios)); }, [audios]);
  useEffect(() => { localStorage.setItem('halqa_bookmarks', JSON.stringify(bookmarks)); }, [bookmarks]);
  useEffect(() => { localStorage.setItem('halqa_downloads', JSON.stringify(downloads)); }, [downloads]);
  useEffect(() => { localStorage.setItem('halqa_settings', JSON.stringify(userSettings)); }, [userSettings]);

  // Mobile User Action Handlers
  const handleToggleBookmark = (type: 'posts' | 'videos' | 'pdfs' | 'audios', id: string) => {
    setBookmarks(prev => {
      const list = prev[type] || [];
      const exists = list.includes(id);
      const updated = exists ? list.filter(item => item !== id) : [...list, id];
      return { ...prev, [type]: updated };
    });
  };

  const handleToggleDownload = (type: 'pdfs' | 'audios', id: string) => {
    setDownloads(prev => {
      const list = prev[type] || [];
      const exists = list.includes(id);
      const updated = exists ? list.filter(item => item !== id) : [...list, id];
      return { ...prev, [type]: updated };
    });
  };

  const handleUpdateSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleAddFeedback = async (message: string) => {
    const newFeedback: FeedbackItem = {
      id: `fb_${Date.now()}`,
      userName: currentUser.name,
      userEmail: currentUser.email,
      message,
      createdAt: new Date().toLocaleDateString('ur-PK'),
      status: 'pending'
    };
    await submitFeedbackToFirestore(newFeedback);
  };

  const handleDonate = async (amount: number, isAnonymous: boolean, donorName?: string, donorEmail?: string, donorMobile?: string, paymentProofUrl?: string) => {
    const initiative = donationInitiatives[0];
    const newRecord: DonationRecord = {
      id: `don_${Date.now()}`,
      initiativeId: initiative ? initiative.id : 'general',
      donorName: isAnonymous ? 'گمنام عطیہ دہندہ (Anonymous Donor)' : (donorName || currentUser.name),
      donorEmail: donorEmail || currentUser.email,
      donorMobile: donorMobile || currentUser.mobile,
      amount,
      date: new Date().toLocaleDateString('ur-PK'),
      status: 'verified',
      paymentMethod: 'Bank Transfer / JazzCash',
      paymentProofUrl
    };
    await submitDonationToFirestore(newRecord);
  };

  const handleUserRegister = async (registrationData: Partial<AppUser>): Promise<AppUser> => {
    const newUser: AppUser = {
      id: generateUserId(),
      username: registrationData.username || `user_${Date.now().toString().slice(-4)}`,
      fullName: registrationData.fullName || 'Member',
      fullNameUrdu: registrationData.fullNameUrdu || 'عید ممبر',
      fatherName: registrationData.fatherName || '',
      cnic: registrationData.cnic || '',
      mobile: registrationData.mobile || '',
      whatsapp: registrationData.whatsapp || '',
      branchId: registrationData.branchId || branches[0]?.id || 'b1',
      city: registrationData.city || 'Karachi',
      status: 'pending',
      role: 'mureed',
      createdAt: new Date().toISOString()
    };
    await addAppUserToFirestore(newUser);
    return newUser;
  };

  const handleUserLogin = async (username: string, cnicOrMobile: string): Promise<AppUser | null> => {
    const matched = appUsers.find(u => 
      u.username.toLowerCase() === username.toLowerCase() && 
      (u.cnic === cnicOrMobile || u.mobile === cnicOrMobile)
    );
    return matched || null;
  };

  const handleCreateSlip = async (slipData: Partial<SpiritualSlip>): Promise<SpiritualSlip> => {
    const newSlip: SpiritualSlip = {
      id: generateSlipId(),
      userId: slipData.userId || 'usr_guest',
      userName: slipData.userName || currentUser.name,
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

  return (
    <VoiceReaderProvider>
      <div className="min-h-screen bg-slate-950 text-white flex flex-col justify-center items-center overflow-x-hidden font-sans" dir="ltr">
        {/* Render Mobile Simulator in standalone full-screen view */}
        <AppSimulator
          categories={categories}
          posts={posts}
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
          infoPages={infoPages}
          islamicEvents={islamicEvents}
          duas={duas}
          postSplashScreens={postSplashScreens}
          makhzanCategories={makhzanCategories}
          makhzanPosts={makhzanPosts}
          spiritualPersonalities={spiritualPersonalities}
          branches={branches}
          dayDatasets={dayDatasets}
          appUsers={appUsers}
          slips={slips}

          bookmarks={bookmarks}
          downloads={downloads}
          currentUser={currentUser}
          userSettings={userSettings}
          viewMode="simulator"

          onToggleBookmark={handleToggleBookmark}
          onToggleDownload={handleToggleDownload}
          onUpdateSettings={handleUpdateSettings}
          onAddFeedback={handleAddFeedback}
          onDonate={handleDonate}
          onUserRegister={handleUserRegister}
          onUserLogin={handleUserLogin}
          onCreateSlip={handleCreateSlip}
          onCancelSlip={handleCancelSlip}
        />

        {/* Permissions Modal on Initial Launch */}
        {showPermissionModal && (
          <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4" dir="rtl">
            <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
              <div className="w-14 h-14 bg-emerald-950 border border-emerald-500/40 rounded-2xl flex items-center justify-center mx-auto text-emerald-400 shadow-md">
                <Smartphone size={28} />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-emerald-400">حلقہ عثمانیہ آفیشل ایپ</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  بہتر کارکردگی کے لیے، براہ کرم درج ذیل اجازتیں فراہم کریں:
                </p>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-3 text-right space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Bell size={16} className="text-amber-400 shrink-0" />
                  <span>اعلانات اور دینی نوٹیفکیشنز (Notifications)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <MapPin size={16} className="text-blue-400 shrink-0" />
                  <span>درست اوقاتِ نماز و سمتِقبلہ (Location Access)</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-200">
                  <Camera size={16} className="text-emerald-400 shrink-0" />
                  <span>میڈیا و رسید اپلوڈ (Media & Storage)</span>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleGrantAllPermissions}
                  className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  <span>تمام اجازتیں فراہم کریں (Grant All)</span>
                </button>
                <button
                  onClick={handleSkipPermissions}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2 rounded-xl text-xs transition-colors"
                >
                  بعد میں دیکھیں (Skip for Now)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </VoiceReaderProvider>
  );
}
