import React, { useState } from 'react';
import { 
  Lock, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Share2, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Sparkles, 
  Users, 
  HeartHandshake, 
  BookOpen, 
  FolderHeart, 
  ShieldAlert, 
  ArrowLeft, 
  Check, 
  Copy, 
  Eye, 
  ChevronRight,
  Printer,
  ExternalLink,
  ShieldCheck,
  Building2,
  UserCheck,
  Tag,
  X
} from 'lucide-react';
import { MakhzanCategory, MakhzanPost, AppUser, Branch, UserRole } from '../types';
import { OfficialRecordingBadge, AIVoiceBadge } from './VoiceReaderBadges';
import { VoicePlayer } from './VoicePlayer';

interface MakhzanEKhasProps {
  categories: MakhzanCategory[];
  posts: MakhzanPost[];
  activeAppUser: AppUser | null;
  branches?: Branch[];
  bookmarks: string[]; // List of bookmarked post IDs
  onToggleBookmark: (postId: string) => void;
  onOpenAuthModal?: () => void;
}

export const MakhzanEKhas: React.FC<MakhzanEKhasProps> = ({
  categories,
  posts,
  activeAppUser,
  branches = [],
  bookmarks,
  onToggleBookmark,
  onOpenAuthModal
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedPost, setSelectedPost] = useState<MakhzanPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked'>('all');
  const [copiedShareLink, setCopiedShareLink] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // 1. GATE CHECK: Restricted ONLY to Active Logged-in Users
  const isUserActive = activeAppUser && activeAppUser.status === 'active';

  if (!isUserActive) {
    return (
      <div className="bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl border border-amber-500/30 text-center max-w-2xl mx-auto my-6">
        <div className="w-16 h-16 bg-amber-500/20 border border-amber-400/50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-300 animate-pulse">
          <Lock className="w-8 h-8" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200 mb-2">
          مخزنِ خاص (Makhzan-e-Khas)
        </h2>
        <p className="text-amber-300/80 text-sm mb-6 font-urdu">
          خانقاہ عثمانیہ کا خصوصی و مقفل روحانی کتب خانہ
        </p>

        <div className="bg-slate-900/80 rounded-xl p-5 border border-slate-800 text-right mb-6 space-y-3 text-slate-300 text-sm">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-urdu text-base">دخول کی اجازت مقفل ہے</strong>
              <p className="text-xs text-slate-400 mt-1">
                یہ شعبہ صرف خانقاہ عثمانیہ کے فعال (Active) اور تصدیق شدہ رجسٹرڈ اراکین، محققین اور برانچ اپریٹرز کے لیے مخصوص ہے۔
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 space-y-1 font-urdu">
            <p>• غیر لاگ ان صارفین کو اس مواد تک رسائی کی اجازت نہیں ہے۔</p>
            <p>• جن اکاؤنٹس کی منظوری ابھی زیرِ التواء (Pending) ہے وہ منظوری کے بعد یہاں داخل ہو سکتے ہیں۔</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <UserCheck className="w-5 h-5" />
            <span>لاگ ان کریں / لاگ ان کی درخواست بھیجیں</span>
          </button>
        </div>
      </div>
    );
  }

  // Helper: Access level permission check
  const hasAccessToPost = (post: MakhzanPost): boolean => {
    if (post.status === 'hidden' || post.status === 'draft') {
      return activeAppUser.role === 'super_admin' || activeAppUser.role === 'central_admin';
    }

    if (activeAppUser.role === 'super_admin') return true;

    if (post.accessLevel === 'all_registered') return true;

    if (post.accessLevel === 'specific_role') {
      return activeAppUser.role === post.targetRole;
    }

    if (post.accessLevel === 'specific_branch') {
      return activeAppUser.branchCode === post.targetBranchCode;
    }

    return true;
  };

  // Filter categories that are published
  const activeCategories = categories.filter(c => c.status !== 'hidden');

  // Filter posts accessible to current user
  const accessiblePosts = posts.filter(hasAccessToPost);

  // Filter posts based on search & category
  const filteredPosts = accessiblePosts.filter(post => {
    // Category match
    if (selectedCategoryId && post.categoryId !== selectedCategoryId) {
      return false;
    }

    // Bookmarks tab match
    if (activeTab === 'bookmarked' && !bookmarks.includes(post.id)) {
      return false;
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = post.title.toLowerCase().includes(q) || (post.titleUrdu && post.titleUrdu.toLowerCase().includes(q));
      const bodyMatch = post.bodyText.toLowerCase().includes(q);
      const tagMatch = post.tags.some(t => t.toLowerCase().includes(q));
      return titleMatch || bodyMatch || tagMatch;
    }

    return true;
  });

  // Category Icon Renderer
  const renderCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-amber-500" />;
      case 'Users': return <Users className="w-6 h-6 text-blue-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-purple-500" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-emerald-500" />;
      case 'FolderHeart': return <FolderHeart className="w-6 h-6 text-rose-500" />;
      default: return <BookOpen className="w-6 h-6 text-amber-500" />;
    }
  };

  // WhatsApp Share handler
  const handleWhatsAppShare = (post: MakhzanPost) => {
    if (!post.enableSharing) return;
    const shareText = `*${post.titleUrdu || post.title}*\n\n${post.bodyText.substring(0, 150)}...\n\n_خانقاہ عثمانیہ - مخزنِ خاص_`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  // Print / PDF Export handler
  const handlePrintPdf = (post: MakhzanPost) => {
    if (!post.enableSharing) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html dir="rtl" lang="ur">
        <head>
          <title>${post.titleUrdu || post.title}</title>
          <style>
            body { font-family: 'Jameel Noori Nastaliq', 'Noto Naskh Arabic', sans-serif; padding: 40px; line-height: 2; }
            h1 { color: #065f46; text-align: center; border-bottom: 2px solid #d97706; padding-bottom: 10px; }
            .meta { color: #666; font-size: 14px; text-align: center; margin-bottom: 30px; }
            .content { white-space: pre-wrap; font-size: 18px; }
            .footer { margin-top: 50px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #ddd; padding-top: 10px; }
          </style>
        </head>
        <body>
          <h1>${post.titleUrdu || post.title}</h1>
          <div class="meta">مخزنِ خاص | خانقاہ عثمانیہ | ${post.updatedOn}</div>
          <div class="content">${post.bodyText}</div>
          <div class="footer">خانقاہ عثمانیہ - طبع شدہ از مخزنِ خاص</div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="space-y-6 text-right font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-amber-500/30 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -ml-10 -mt-10 pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                مخصوص اراکین | Exclusive Vault
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full">
                {accessiblePosts.length} تحاریر و مواد
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-amber-200">
              مخزنِ خاص (Makhzan-e-Khas)
            </h1>
            <p className="text-slate-300 text-sm mt-1 font-urdu">
              خاص صدقات، تعویذات، نقوش، وظائف، اور ہدایت ناموں کا مستند مجموعہ
            </p>
          </div>

          {/* User Badge */}
          <div className="bg-slate-950/60 border border-emerald-500/30 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-3 self-stretch md:self-auto">
            <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 text-base font-bold">
              {activeAppUser.fullName.charAt(0)}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{activeAppUser.fullName}</div>
              <div className="text-amber-400 text-xs flex items-center gap-1 font-urdu">
                <span>{activeAppUser.role === 'super_admin' ? 'مرکزی نگرانِ اعلیٰ' : activeAppUser.role === 'muhaqqiq' ? 'مجاز محقق' : 'فعال رکن'}</span>
                <span>•</span>
                <span>برانچ: {activeAppUser.branchCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="mt-6 pt-6 border-t border-emerald-800/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="عنوان، ٹیگ یا مضمون تلاش کریں..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 text-white placeholder-slate-400 text-sm pl-10 pr-4 py-2.5 rounded-xl border border-emerald-700/50 focus:outline-none focus:border-amber-400 transition font-urdu"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Tab Filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => { setActiveTab('all'); setSelectedCategoryId(null); }}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'all' && !selectedCategoryId
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>تمام مواد ({accessiblePosts.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('bookmarked')}
              className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                activeTab === 'bookmarked'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'bg-slate-950/50 text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>محفوظ شدہ ({bookmarks.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Category Grid Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 font-urdu flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-amber-600" />
            <span>مخزنِ خاص کی تمام زمرہ جات (Categories)</span>
          </h2>

          {selectedCategoryId && (
            <button
              onClick={() => setSelectedCategoryId(null)}
              className="text-xs text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1 font-bold"
            >
              <span>تمام زمرہ جات دکھائیں</span>
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {activeCategories.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const categoryPostCount = accessiblePosts.filter(p => p.categoryId === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(isSelected ? null : cat.id)}
                className={`p-4 rounded-xl border text-right transition-all transform hover:-translate-y-0.5 flex flex-col justify-between h-32 relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-md ring-2 ring-amber-400/50'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 hover:border-amber-400/50 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-slate-950/10' : 'bg-slate-100 dark:bg-slate-800'}`}>
                      {renderCategoryIcon(cat.icon)}
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}>
                      {categoryPostCount} تحاریر
                    </span>
                  </div>
                  <h3 className="font-bold font-urdu text-base leading-tight">
                    {cat.nameUrdu}
                  </h3>
                  <p className={`text-[11px] truncate mt-1 ${isSelected ? 'text-slate-900' : 'text-slate-500 dark:text-slate-400'}`}>
                    {cat.name}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content / Post List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b pb-2 dark:border-slate-800">
          <div className="text-sm font-bold text-slate-700 dark:text-slate-300 font-urdu">
            {selectedCategoryId ? (
              <span>زمرہ: {activeCategories.find(c => c.id === selectedCategoryId)?.nameUrdu} ({filteredPosts.length})</span>
            ) : searchQuery ? (
              <span>تلاش کا نتیجہ برائے "{searchQuery}" ({filteredPosts.length})</span>
            ) : (
              <span>تمام دستیاب تحاریر ({filteredPosts.length})</span>
            )}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 text-slate-500">
            <ShieldAlert className="w-12 h-12 text-slate-400 mx-auto mb-3 opacity-50" />
            <h3 className="font-bold text-lg text-slate-700 dark:text-slate-300 font-urdu">کوئی تحریر نہیں ملی</h3>
            <p className="text-xs text-slate-500 mt-1 font-urdu">
              اس زمرہ یا سرچ میں فی الوقت کوئی مواد دستیاب نہیں ہے یا رسائی کی سطح مختلف ہے۔
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosts.map((post) => {
              const category = activeCategories.find(c => c.id === post.categoryId);
              const isBookmarked = bookmarks.includes(post.id);

              return (
                <div
                  key={post.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between relative group"
                >
                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 text-[11px] px-2.5 py-0.5 rounded-full font-bold font-urdu">
                        {category?.nameUrdu || post.categoryId}
                      </span>

                      {/* Access Level Badge */}
                      {post.accessLevel === 'specific_role' && (
                        <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-800 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 font-urdu">
                          <ShieldCheck className="w-3 h-3" />
                          خاص عہدہ: {post.targetRole}
                        </span>
                      )}

                      {post.accessLevel === 'specific_branch' && (
                        <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-300 dark:border-blue-800 text-[10px] px-2 py-0.5 rounded-md font-bold flex items-center gap-1 font-urdu">
                          <Building2 className="w-3 h-3" />
                          برانچ: {post.targetBranchCode}
                        </span>
                      )}

                      {post.accessLevel === 'all_registered' && (
                        <span className="text-[10px] text-slate-400 font-urdu">عام رجسٹرڈ اراکین</span>
                      )}
                    </div>

                    {/* Title & Audio Badge */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-urdu leading-snug group-hover:text-amber-600 transition">
                        {post.titleUrdu || post.title}
                      </h3>
                      {(post.officialAudioUrl || post.humanVoiceUrl) ? (
                        <OfficialRecordingBadge size="xs" showBilingual={false} />
                      ) : post.voiceReaderEnabled !== false ? (
                        <AIVoiceBadge size="xs" showBilingual={false} />
                      ) : null}
                    </div>

                    {/* Short Preview */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-urdu line-clamp-3 mb-4 leading-relaxed whitespace-pre-line">
                      {post.bodyText}
                    </p>

                    {/* Thumbnail Image if any */}
                    {post.images && post.images.length > 0 && (
                      <div className="mb-4 rounded-lg overflow-hidden h-36 bg-slate-950 border border-slate-200 dark:border-slate-700 flex items-center justify-center relative">
                        <img
                          src={post.images[0]}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none"
                        />
                        <img
                          src={post.images[0]}
                          alt={post.title}
                          className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                        />
                      </div>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] px-2 py-0.5 rounded font-urdu"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Voice Reader Player (Compact Inline in Feed Card) */}
                  {post.voiceReaderEnabled !== false && (
                    <div className="mb-2">
                      <VoicePlayer
                        postId={post.id}
                        text={`${post.titleUrdu || post.title}. ${post.bodyText}`}
                        language={post.language || 'auto'}
                        officialAudioUrl={post.officialAudioUrl || post.humanVoiceUrl}
                        compact={true}
                        postTitle={post.titleUrdu || post.title}
                      />
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
                    <button
                      onClick={() => onToggleBookmark(post.id)}
                      className={`p-1.5 rounded-lg border transition ${
                        isBookmarked
                          ? 'bg-amber-50 border-amber-300 text-amber-600 dark:bg-amber-950/40 dark:border-amber-700'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:text-slate-800'
                      }`}
                      title={isBookmarked ? 'محفوظ فہرست سے ہٹائیں' : 'محفوظ کریں'}
                    >
                      {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => setSelectedPost(post)}
                      className="px-4 py-1.5 bg-gradient-to-r from-emerald-700 to-teal-800 hover:from-emerald-800 hover:to-teal-900 text-white font-bold rounded-lg shadow-sm transition flex items-center gap-1.5 font-urdu"
                    >
                      <span>مکمل مطالعہ کریں</span>
                      <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FULL POST DETAIL MODAL */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-3xl w-full shadow-2xl border border-amber-500/30 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-900 via-teal-950 to-slate-900 text-white p-5 sm:p-6 flex items-start justify-between border-b border-amber-500/30 relative">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-0.5 rounded-full font-bold font-urdu">
                    مخزنِ خاص
                  </span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-urdu">
                    زمرہ: {activeCategories.find(c => c.id === selectedPost.categoryId)?.nameUrdu}
                  </span>

                  {!selectedPost.enableSharing && (
                    <span className="bg-rose-500/20 text-rose-300 border border-rose-400/30 text-[11px] px-2.5 py-0.5 rounded-full font-bold font-urdu flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      شئیرنگ مقفل
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-serif text-amber-200 leading-snug">
                  {selectedPost.titleUrdu || selectedPost.title}
                </h2>

                <div className="text-xs text-slate-300 mt-2 flex flex-wrap items-center gap-3 font-urdu">
                  <span>ناشر: {selectedPost.createdBy}</span>
                  <span>•</span>
                  <span>تاریخ: {selectedPost.updatedOn}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPost(null)}
                className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-full transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-right font-urdu leading-loose">
              
              {/* Access Notice if Restricted */}
              {selectedPost.accessLevel !== 'all_registered' && (
                <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>
                    یہ تحریر خاص سطح ({selectedPost.accessLevel === 'specific_role' ? `عہدہ: ${selectedPost.targetRole}` : `برانچ: ${selectedPost.targetBranchCode}`}) کے اراکین کے لیے مخصوص ہے۔
                  </span>
                </div>
              )}

              {/* Voice Reader Player (Full Player in Detail View) */}
              {selectedPost.voiceReaderEnabled !== false && (
                <div className="my-2">
                  <VoicePlayer
                    postId={selectedPost.id}
                    text={`${selectedPost.titleUrdu || selectedPost.title}. ${selectedPost.bodyText}`}
                    language={selectedPost.language || 'auto'}
                    officialAudioUrl={selectedPost.officialAudioUrl || selectedPost.humanVoiceUrl}
                    compact={false}
                    postTitle={selectedPost.titleUrdu || selectedPost.title}
                  />
                </div>
              )}

              {/* Main Rich Body */}
              <div className="text-base sm:text-lg text-slate-800 dark:text-slate-200 whitespace-pre-wrap border-b border-slate-100 dark:border-slate-800 pb-6">
                {selectedPost.bodyText}
              </div>

              {/* Image Gallery if present */}
              {selectedPost.images && selectedPost.images.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-600" />
                    <span>تصاویر و نقش گرافکس ({selectedPost.images.length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedPost.images.map((imgUrl, index) => (
                      <div
                        key={index}
                        onClick={() => setLightboxImage(imgUrl)}
                        className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 cursor-pointer group relative h-48 flex items-center justify-center"
                      >
                        <img
                          src={imgUrl}
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 pointer-events-none"
                        />
                        <img
                          src={imgUrl}
                          alt={`${selectedPost.title} image ${index + 1}`}
                          className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1">
                          <Eye className="w-4 h-4" />
                          <span>بڑی تصویر دیکھیں</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PDF Attachment if any */}
              {selectedPost.pdfUrl && (
                <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-8 h-8 text-rose-500" />
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-slate-100">پی ڈی ایف دستاویز (PDF Document)</div>
                      <div className="text-xs text-slate-500">مطالعہ و ڈاؤن لوڈ کے لیے فائل دستیاب ہے</div>
                    </div>
                  </div>

                  <a
                    href={selectedPost.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" />
                    <span>فائل کھولیں</span>
                  </a>
                </div>
              )}

              {/* Tags */}
              {selectedPost.tags && selectedPost.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5" />
                    ٹیگز:
                  </span>
                  {selectedPost.tags.map((tag, idx) => (
                    <span key={idx} className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs px-2.5 py-1 rounded-md">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer / Share Actions */}
            <div className="p-4 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => onToggleBookmark(selectedPost.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  bookmarks.includes(selectedPost.id)
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600'
                }`}
              >
                {bookmarks.includes(selectedPost.id) ? (
                  <>
                    <BookmarkCheck className="w-4 h-4" />
                    <span>محفوظ شدہ</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4" />
                    <span>فہرست میں محفوظ کریں</span>
                  </>
                )}
              </button>

              {/* Sharing Controls */}
              {selectedPost.enableSharing ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleWhatsAppShare(selectedPost)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm font-urdu"
                  >
                    <Share2 className="w-4 h-4" />
                    <span>واٹس ایپ پر شئیر کریں</span>
                  </button>

                  <button
                    onClick={() => handlePrintPdf(selectedPost)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm font-urdu"
                  >
                    <Printer className="w-4 h-4" />
                    <span>پی ڈی ایف پرنٹ کریں</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-rose-600 dark:text-rose-400 font-bold font-urdu bg-rose-50 dark:bg-rose-950/40 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-800 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  <span>اس تحریر کی شئیرنگ ایڈمن کی جانب سے مقفل (Disabled) کی گئی ہے</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR FULL IMAGE VIEW */}
      {lightboxImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 text-white bg-slate-800 p-3 rounded-full hover:bg-slate-700 transition"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Enlarged preview"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-slate-700"
          />
        </div>
      )}
    </div>
  );
};
