/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Post {
  id: string;
  title: string;
  titleUrdu: string;
  category: string;
  shortDescription: string;
  shortDescriptionUrdu: string;
  completeArticle: string;
  completeArticleUrdu: string;
  coverImage: string;
  images: string[];
  pdfUrl?: string;
  audioUrl?: string;
  humanVoiceUrl?: string; // Admin-uploaded MP3 human recording URL (alias)
  officialAudioUrl?: string; // Firebase Storage URL to an admin-uploaded human MP3 recording for this specific post
  officialAudioDurationSec?: number; // Duration of official audio in seconds
  voiceReaderEnabled?: boolean; // Per-post override; if false, hide Listen button for this post even if global setting is on
  language?: 'ur' | 'ar' | 'en' | 'auto'; // Manually settable by admin, defaults to "auto"
  videoUrl?: string; // YouTube video ID or full URL
  tags: string[];
  city: string;
  country: string;
  shrineName?: string;
  scholarName?: string;
  publishDate: string;
  isDraft: boolean;
  status?: 'published' | 'draft' | 'hidden';
  views: number;
  bookmarksCount: number;
}

export interface VoiceReaderSettings {
  globalEnabled: boolean; // default true
  defaultVoiceUr: string; // identifier of the chosen Urdu voice (e.g., 'ur-PK')
  defaultVoiceAr: string; // identifier of the chosen Arabic voice (e.g., 'ar-SA')
  defaultVoiceEn: string; // identifier of the chosen English voice (e.g., 'en-US')
  defaultSpeed: number; // 0.75 - 1.5, default 1.0
  defaultVolume: number; // 0 - 1, default 1.0
  autoLanguageDetection: boolean; // default true
  // Backward compatibility fields
  enabled?: boolean;
  defaultVoice?: string;
  readingSpeed?: number;
  volume?: number;
  honorificPronunciation?: boolean;
  cacheAudio?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string; // Lucide icon name
  description: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface PDFBook {
  id: string;
  title: string;
  titleUrdu: string;
  author: string;
  authorUrdu: string;
  coverImage: string;
  pdfUrl: string;
  size: string;
  pages: number;
  description: string;
  descriptionUrdu: string;
  views: number;
  downloadsCount: number;
  status?: 'published' | 'draft' | 'hidden';
}

export interface VideoItem {
  id: string;
  title: string;
  titleUrdu: string;
  youtubeId: string;
  category: 'latest' | 'live' | 'bayan' | 'naat' | 'shorts' | 'playlist';
  duration: string;
  speaker: string;
  publishDate: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface AudioItem {
  id: string;
  title: string;
  titleUrdu: string;
  artist: string;
  artistUrdu: string;
  category: 'bayan' | 'naat' | 'dhikr';
  audioUrl: string;
  duration: string;
  size: string;
  publishDate: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface GalleryImage {
  id: string;
  albumId: string;
  title: string;
  titleUrdu: string;
  imageUrl: string;
  description?: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface GalleryAlbum {
  id: string;
  name: string;
  nameUrdu: string;
  coverImage: string;
  type: 'photos' | 'posters' | 'events';
  status?: 'published' | 'draft' | 'hidden';
}

export interface FeedbackItem {
  id: string;
  name: string;
  email: string;
  contactNumber: string;
  subject: string;
  message: string;
  date: string;
  replied: boolean;
  replyMessage?: string;
  replyDate?: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface AppNotification {
  id: string;
  title: string;
  titleUrdu: string;
  body: string;
  bodyUrdu: string;
  type: 'announcement' | 'article' | 'pdf' | 'video' | 'event';
  targetId?: string; // ID of post/video/pdf to navigate to
  date: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface SliderItem {
  id: string;
  title: string;
  titleUrdu: string;
  imageUrl: string;
  linkToType: 'post' | 'pdf' | 'video' | 'url';
  targetId: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface ContactInfo {
  mobile: string;
  whatsApp: string;
  email: string;
  website: string;
  officeAddress: string;
  officeAddressUrdu: string;
  googleMapEmbedUrl: string;
}

export interface SocialLinks {
  facebook: string;
  youtube: string;
  instagram: string;
  tiktok: string;
  telegram: string;
  whatsAppChannel: string;
  website: string;
}

export interface UserSettings {
  language: 'ur' | 'en';
  theme: 'light' | 'dark';
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  notificationsEnabled: boolean;
  autoDownloadOff: boolean;
  permissionsRequested?: boolean;
  locationPermissionGranted?: boolean;
  notificationsPermissionGranted?: boolean;
  voiceReaderSettings?: VoiceReaderSettings;
}

export interface AppState {
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
  voiceReaderSettings?: VoiceReaderSettings;
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
    role: 'visitor' | 'admin';
  };
}

export interface DonationInitiative {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  descriptionUrdu: string;
  goalAmount?: number;
  raisedAmount: number;
  image: string;
  active: boolean;
  status?: 'published' | 'draft' | 'hidden';
}

export interface InfoPageExternalLink {
  label: string;
  url: string;
}

export interface InfoPage {
  id: string;
  title: string;
  titleUrdu: string;
  slug: string;
  shortDescription: string;
  shortDescriptionUrdu: string;
  content: string;
  contentUrdu: string;
  bannerImage: string;
  featuredImage: string;
  status: 'published' | 'draft' | 'hidden';
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
  youtubeUrl?: string;
  externalLinks?: InfoPageExternalLink[];
}

export interface SpiritualPersonality {
  id: string;
  name: string;
  nameUrdu?: string;
  title?: string;
  titleUrdu?: string;
  era?: string;
  eraUrdu?: string;
  bio: string;
  biography?: string;
  biographyUrdu?: string;
  imageUrl?: string;
  images: string[];
  audioUrl?: string;
  videoUrl?: string;
  pdfUrl?: string;
  status: 'published' | 'hidden' | 'draft';
  createdAt: string;
  updatedAt: string;
}

export interface PostComment {
  id: string;
  postId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  date: string;
  likesCount: number;
}

export interface PostEngagement {
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  userLiked?: boolean;
}

export interface PrayerTimeSetting {
  city: string;
  country: string;
  latitude?: number;
  longitude?: number;
  method: number; // 1: Karachi, 2: ISNA, 3: MWL, 4: Umm Al-Qura, 5: Egyptian, etc.
  school: number; // 0: Shafi/Hanbali/Maliki, 1: Hanafi
  autoLocation: boolean;
  hijriAdjustment: number; // -2 to +2 days
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
  Firstthird: string;
  Lastthird: string;
}

export interface IslamicEvent {
  id: string;
  title: string;
  titleUrdu: string;
  hijriMonth: number; // 1 - 12
  hijriDay: number; // 1 - 30
  gregorianApproxDate?: string;
  description: string;
  descriptionUrdu: string;
  category: 'eid' | 'fasting' | 'holy_night' | 'historical';
  status?: 'published' | 'draft' | 'hidden';
}

export interface DuaItem {
  id: string;
  title: string;
  titleUrdu: string;
  arabicText: string;
  transliteration?: string;
  translation: string;
  translationUrdu: string;
  reference: string;
  category: 'morning_evening' | 'prayer' | 'forgiveness' | 'protection' | 'daily_life' | 'ramadan';
  virtues?: string;
  virtuesUrdu?: string;
  status?: 'published' | 'draft' | 'hidden';
}

export interface DonationRecord {
  id: string;
  initiativeId: string;
  initiativeTitle: string;
  donorName: string;
  donorEmail: string;
  donorMobile: string;
  amount: number;
  currency: 'PKR' | 'USD';
  paymentMethod: 'bank_transfer' | 'easy_paisa' | 'jazz_cash' | 'credit_card';
  referenceNumber: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  isHidden?: boolean;
  notes?: string;
}

// KHANQAH & AASTANA CORE TYPES

export interface Branch {
  id: string;
  name: string;
  code: string; // e.g. MALIR01, GULSHAN01, LANDHI01, HYDERABAD, DUBAI
  city: string;
  country: string;
  status: 'active' | 'inactive';
  address?: string;
  phone?: string;
  createdAt: string;
}

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface DayDatasetRecord {
  id: string;
  adad?: number;
  adadValue?: number;
  sadqaAdad?: number; // 0..6
  marzAdad?: number; // 0..3
  day: DayOfWeek | string;
  dayName?: string;
  mizaj: string; // e.g., 'Aatashi / آتشین', 'Baadi / بادی', 'Aabi / آبی', 'Khaaki / خاکی'
  tashkhees: string[];
  mashwara?: string; // Advice field
  sadqa: string[]; // Recommended Charity
  methodOfSadqa?: string; // Editable method of performing Sadqa
  tanbeehNote?: string; // Editable warning / tanbeeh note
  wazifa?: string;
  duration?: string;
  recommendedDays?: string;
  notes?: string;
  specialNotes?: string;
  references?: string;
  referenceText?: string;
  createdAt?: string;
}

export type UserRole = 'super_admin' | 'central_admin' | 'branch_admin' | 'muhaqqiq' | 'registered_user';
export type UserAccountStatus = 'active' | 'approved' | 'pending' | 'rejected' | 'blocked';

export interface AppUser {
  id: string; // Format: HU-[BranchCode]-U[6-digit number], e.g. HU-MALIR01-U000245
  userId?: string;
  fullName: string;
  username?: string;
  parentName?: string; // Parent/Mother's name
  motherName?: string;
  mobile: string;
  phone?: string;
  cnic?: string;
  email?: string;
  address?: string;
  city: string;
  country: string;
  branchId: string;
  branchCode: string;
  branchName: string;
  role: UserRole;
  status: UserAccountStatus;
  registrationDate: string;
  password?: string;
  notes?: string;
  rejectionReason?: string;
  blockedReason?: string;
}

export interface SpiritualSlip {
  id: string; // Format: HU-[BranchCode]-[Year]-[Month]-[MonthlySlipNo]-[OverallSlipNo] e.g. HU-MALIR01-2026-07-0008-00564
  slipId?: string;
  userId?: string;
  userName: string;
  motherName?: string; // optional (or '-' if blank)
  dob?: string;
  gender?: string;
  branchId: string;
  branchCode: string;
  branchName: string;
  year: number;
  month: number;
  monthlySlipNo: number; // 4-digit reset monthly per branch
  overallSlipNo: number; // 6-digit non-reset system wide
  nameAdad: number;
  motherAdad: number;
  dayAdad?: number;
  totalAdad: number;
  sadqaAdad?: number; // Renamed from finalAdad to Sadqa Adad (0..6)
  finalAdad?: number; // Backwards compatible fallback
  marzAdad?: number;  // 0..3
  modFormulaApplied?: string;
  day: DayOfWeek;
  mizaj: string;
  tashkhees?: string[]; // Kept for operator audit/result, omitted from petitioner slip image
  mashwara?: string; // Advice
  sadqa: string[]; // Recommended Charity
  methodOfSadqa?: string;
  tanbeehNote?: string;
  wazifa?: string;
  duration?: string;
  notes?: string;
  operatorName: string;
  operatorRole: string;
  createdAt: string;
  status: 'active' | 'cancelled';
  cancellationReason?: string;
  mobileNumber?: string;
}

export interface ModSettings {
  enableModFormula?: boolean;
  modDivisor?: number;
  remainderMode?: 'rem' | 'mod1';
  enabled: boolean;
  divisor: number; // e.g. 7, 12, 28
  mode: 'remainder' | 'exact_or_mod'; // e.g. if rem is 0 -> divisor or 0
}

export interface MakhzanCategory {
  id: string;
  name: string;
  nameUrdu: string;
  icon: string;
  description: string;
  descriptionUrdu?: string;
  order: number;
  status: 'published' | 'hidden' | 'draft';
}

export interface MakhzanPost {
  id: string;
  title: string;
  titleUrdu?: string;
  categoryId: string;
  contentType: 'text' | 'image' | 'text_image' | 'pdf';
  bodyText: string;
  images: string[];
  pdfUrl?: string;
  audioUrl?: string;
  officialAudioUrl?: string;
  humanVoiceUrl?: string;
  voiceReaderEnabled?: boolean;
  language?: 'ur' | 'ar' | 'en' | 'auto';
  tags: string[];
  status: 'published' | 'hidden' | 'draft';
  accessLevel: 'all_registered' | 'specific_role' | 'specific_branch';
  targetRole?: UserRole;
  targetBranchCode?: string;
  enableSharing: boolean;
  createdBy: string;
  updatedOn: string;
  order?: number;
  viewsCount?: number;
  bookmarksCount?: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: 'LOGIN' | 'LOGIN_ATTEMPT' | 'LOGIN_BLOCKED' | 'USER_APPROVED' | 'USER_REJECTED' | 'USER_BLOCKED' | 'USER_UNBLOCKED' | 'SLIP_CREATED' | 'SLIP_CANCELLED' | 'BRANCH_CREATED' | 'BRANCH_UPDATED' | 'DATASET_UPDATED' | 'BACKUP_CREATED' | 'BACKUP_RESTORED' | 'MAKHZAN_POST_CREATED' | 'MAKHZAN_POST_UPDATED' | 'MAKHZAN_POST_DELETED' | 'MAKHZAN_CATEGORY_UPDATED' | 'POST_SAVED' | 'POST_DELETED' | 'PERSONALITY_SAVED' | 'PERSONALITY_DELETED';
  performedBy: string;
  role?: string;
  branchCode?: string;
  details: string;
  deviceInfo?: string;
  ipAddress?: string;
}

export interface SystemBackupData {
  exportDate: string;
  version: string;
  branches: Branch[];
  dayDatasets: DayDatasetRecord[];
  appUsers: AppUser[];
  slips: SpiritualSlip[];
  auditLogs: AuditLog[];
  modSettings: ModSettings;
  makhzanCategories?: MakhzanCategory[];
  makhzanPosts?: MakhzanPost[];
}

export interface HadeesItem {
  id: string;
  reference: string;
  book: string;
  narrator?: string;
  narratorUrdu?: string;
  arabicText?: string;
  text: string;
  textUrdu: string;
  category?: string;
  categoryUrdu?: string;
}

export interface DownloadProgressItem {
  id: string;
  type: 'pdfs' | 'audios';
  title: string;
  titleUrdu?: string;
  size?: string;
  progress: number; // 0 - 100
  status: 'idle' | 'downloading' | 'completed' | 'failed' | 'paused';
  downloadedBytes?: string;
  totalBytes?: string;
  speed?: string;
  updatedAt: number;
}

export interface DailyPrayerLogItem {
  date: string; // YYYY-MM-DD
  dayName: string;
  dayUrdu: string;
  prayers: {
    Fajr: 'offered' | 'offered_jamaat' | 'missed' | 'pending';
    Dhuhr: 'offered' | 'offered_jamaat' | 'missed' | 'pending';
    Asr: 'offered' | 'offered_jamaat' | 'missed' | 'pending';
    Maghrib: 'offered' | 'offered_jamaat' | 'missed' | 'pending';
    Isha: 'offered' | 'offered_jamaat' | 'missed' | 'pending';
  };
}

export interface OfflineQueueItem {
  id: string;
  timestamp: string;
  actionType: string;
  title: string;
  titleUrdu?: string;
  category: string;
  payload: any;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  errorMessage?: string;
}







export interface PostSplashScreenItem {
  id: string;
  title: string;
  titleEnglish?: string;
  bismillahText?: string;
  mainArabicText: string;
  urduTranslation: string;
  imageUrl?: string;
  audioUrl?: string;
  durationSeconds: number;
  isEnabled: boolean;
  order: number;
  createdAt?: string;
}
