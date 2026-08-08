import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { 
  FolderHeart, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Sparkles, 
  Check, 
  X, 
  Lock, 
  Unlock, 
  FileText, 
  Image as ImageIcon, 
  Share2, 
  Building2, 
  ShieldCheck, 
  Upload, 
  Tag, 
  ArrowUp, 
  ArrowDown,
  ChevronRight,
  ChevronLeft,
  Crop,
  Mic,
  Music,
  Volume2
} from 'lucide-react';
import { MakhzanCategory, MakhzanPost, UserRole, Branch } from '../../types';
import { ImageCropperModal } from './ImageCropperModal';

interface MakhzanManagerProps {
  categories: MakhzanCategory[];
  posts: MakhzanPost[];
  branches: Branch[];
  onAddCategory: (category: MakhzanCategory) => void;
  onEditCategory: (category: MakhzanCategory) => void;
  onDeleteCategory: (id: string) => void;
  onAddPost: (post: MakhzanPost) => void;
  onEditPost: (post: MakhzanPost) => void;
  onDeletePost: (id: string) => void;
  onToggleHidePost: (postId: string) => void;
}

export const MakhzanManager: React.FC<MakhzanManagerProps> = ({
  categories,
  posts,
  branches,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
  onAddPost,
  onEditPost,
  onDeletePost,
  onToggleHidePost
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'categories'>('posts');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [makhzanDeleteModal, setMakhzanDeleteModal] = useState<{ title?: string; message?: string; onConfirm: () => void } | null>(null);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MakhzanCategory | null>(null);
  const [categoryForm, setCategoryForm] = useState<Omit<MakhzanCategory, 'id'>>({
    name: '',
    nameUrdu: '',
    icon: 'BookOpen',
    description: '',
    descriptionUrdu: '',
    order: categories.length + 1,
    status: 'published'
  });

  // Post Modal State
  const [showPostModal, setShowPostModal] = useState(false);
  const [editingPost, setEditingPost] = useState<MakhzanPost | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isUploadingAudio, setIsUploadingAudio] = useState(false);
  const [postForm, setPostForm] = useState<Omit<MakhzanPost, 'id' | 'createdBy' | 'updatedOn'>>({
    title: '',
    titleUrdu: '',
    categoryId: categories[0]?.id || 'sadqa-guidance',
    contentType: 'text_image',
    bodyText: '',
    images: [],
    pdfUrl: '',
    audioUrl: '',
    officialAudioUrl: '',
    humanVoiceUrl: '',
    voiceReaderEnabled: true,
    language: 'auto',
    tags: [],
    status: 'published',
    accessLevel: 'all_registered',
    targetRole: 'muhaqqiq',
    targetBranchCode: branches[0]?.code || 'MALIR01',
    enableSharing: true,
    order: posts.length + 1
  });

  // Open Category Add/Edit Modal
  const handleOpenCategoryModal = (cat?: MakhzanCategory) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        nameUrdu: cat.nameUrdu,
        icon: cat.icon,
        description: cat.description,
        descriptionUrdu: cat.descriptionUrdu || '',
        order: cat.order,
        status: cat.status
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        nameUrdu: '',
        icon: 'BookOpen',
        description: '',
        descriptionUrdu: '',
        order: categories.length + 1,
        status: 'published'
      });
    }
    setShowCategoryModal(true);
  };

  // Submit Category
  const handleSubmitCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.nameUrdu.trim()) return;

    if (editingCategory) {
      onEditCategory({
        ...editingCategory,
        ...categoryForm
      });
    } else {
      const newCategory: MakhzanCategory = {
        id: 'mk-cat-' + Date.now(),
        ...categoryForm
      };
      onAddCategory(newCategory);
    }
    setShowCategoryModal(false);
  };

  // Open Post Add/Edit Modal
  const handleOpenPostModal = (post?: MakhzanPost) => {
    if (post) {
      setEditingPost(post);
      setPostForm({
        title: post.title,
        titleUrdu: post.titleUrdu || '',
        categoryId: post.categoryId,
        contentType: post.contentType,
        bodyText: post.bodyText,
        images: [...post.images],
        pdfUrl: post.pdfUrl || '',
        audioUrl: post.audioUrl || '',
        officialAudioUrl: post.officialAudioUrl || post.humanVoiceUrl || '',
        humanVoiceUrl: post.humanVoiceUrl || post.officialAudioUrl || '',
        voiceReaderEnabled: post.voiceReaderEnabled !== false,
        language: post.language || 'auto',
        tags: [...post.tags],
        status: post.status,
        accessLevel: post.accessLevel,
        targetRole: post.targetRole || 'muhaqqiq',
        targetBranchCode: post.targetBranchCode || branches[0]?.code || 'MALIR01',
        enableSharing: post.enableSharing,
        order: post.order || 1
      });
    } else {
      setEditingPost(null);
      setPostForm({
        title: '',
        titleUrdu: '',
        categoryId: categories[0]?.id || 'sadqa-guidance',
        contentType: 'text_image',
        bodyText: '',
        images: [],
        pdfUrl: '',
        audioUrl: '',
        officialAudioUrl: '',
        humanVoiceUrl: '',
        voiceReaderEnabled: true,
        language: 'auto',
        tags: [],
        status: 'published',
        accessLevel: 'all_registered',
        targetRole: 'muhaqqiq',
        targetBranchCode: branches[0]?.code || 'MALIR01',
        enableSharing: true,
        order: posts.length + 1
      });
    }
    setImageUrlInput('');
    setShowPostModal(true);
  };

  // Image Cropper Modal State for Makhzan Posts
  const [cropperModal, setCropperModal] = useState<{
    isOpen: boolean;
    imageSrc: string;
    galleryIndex?: number;
  }>({
    isOpen: false,
    imageSrc: ''
  });

  const handleCroppedMakhzanImage = (croppedBase64: string) => {
    if (cropperModal.galleryIndex !== undefined) {
      setPostForm((prev) => {
        const updated = [...prev.images];
        updated[cropperModal.galleryIndex!] = croppedBase64;
        return { ...prev, images: updated };
      });
    } else {
      setPostForm((prev) => ({
        ...prev,
        images: [...prev.images, croppedBase64]
      }));
    }
  };

  // Bulk Selection State for Makhzan Posts
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>([]);

  // Add Image to Post Form
  const handleAddImage = () => {
    if (imageUrlInput.trim()) {
      setCropperModal({
        isOpen: true,
        imageSrc: imageUrlInput.trim()
      });
      setImageUrlInput('');
    }
  };

  // Handle Image File Upload (Opens 16:9 Cropper)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setCropperModal({
          isOpen: true,
          imageSrc: reader.result as string
        });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Remove Image from Post Form
  const handleRemoveImage = (index: number) => {
    setPostForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Handle MP3 / Audio File Upload
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        setPostForm(prev => ({
          ...prev,
          audioUrl: reader.result as string
        }));
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Submit Post
  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.titleUrdu.trim() && !postForm.title.trim()) return;

    const tagsArray = typeof postForm.tags === 'string'
      ? (postForm.tags as string).split(',').map(t => t.trim()).filter(Boolean)
      : postForm.tags;

    if (editingPost) {
      onEditPost({
        ...editingPost,
        ...postForm,
        tags: tagsArray,
        updatedOn: new Date().toISOString().split('T')[0]
      });
    } else {
      const newPost: MakhzanPost = {
        id: 'mk-post-' + Date.now(),
        ...postForm,
        tags: tagsArray,
        createdBy: 'Central Admin',
        updatedOn: new Date().toISOString().split('T')[0],
        viewsCount: 0,
        bookmarksCount: 0
      };
      onAddPost(newPost);
    }
    setShowPostModal(false);
  };

  // Filter Posts for Admin List
  const filteredPosts = posts.filter(post => {
    if (selectedCategoryId !== 'all' && post.categoryId !== selectedCategoryId) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        (post.titleUrdu && post.titleUrdu.toLowerCase().includes(q)) ||
        post.bodyText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const isAllPostsSelected = filteredPosts.length > 0 && selectedPostIds.length === filteredPosts.length;

  const handleSelectAllPosts = () => {
    if (isAllPostsSelected) {
      setSelectedPostIds([]);
    } else {
      setSelectedPostIds(filteredPosts.map(p => p.id));
    }
  };

  const handleSelectPost = (postId: string) => {
    setSelectedPostIds(prev =>
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const handleBulkDeletePosts = () => {
    if (selectedPostIds.length === 0) return;
    setMakhzanDeleteModal({
      title: 'حذف کی تصدیق (Bulk Delete Posts)',
      message: `کیا آپ واقعی ${selectedPostIds.length} منتخب شدہ تحاریر کو حذف کرنا چاہتے ہیں؟ یہ عمل ناقابلِ واپسی ہے۔`,
      onConfirm: () => {
        selectedPostIds.forEach(id => {
          if (editingPost?.id === id) {
            setEditingPost(null);
            setShowPostModal(false);
          }
          onDeletePost(id);
        });
        setSelectedPostIds([]);
      }
    });
  };

  const handleBulkHidePosts = () => {
    if (selectedPostIds.length === 0) return;
    selectedPostIds.forEach(id => {
      const post = posts.find(p => p.id === id);
      if (post && post.status !== 'hidden') {
        onToggleHidePost(id);
      }
    });
  };

  const handleBulkShowPosts = () => {
    if (selectedPostIds.length === 0) return;
    selectedPostIds.forEach(id => {
      const post = posts.find(p => p.id === id);
      if (post && post.status === 'hidden') {
        onToggleHidePost(id);
      }
    });
  };

  return (
    <div className="space-y-6 text-right font-sans">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white rounded-2xl p-6 shadow-xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/20 text-amber-300 border border-amber-400/30 text-xs px-3 py-0.5 rounded-full font-bold">
              مخزنِ خاص ایڈمن / Admin Module
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full">
              {posts.length} کل تحاریر
            </span>
          </div>
          <h2 className="text-2xl font-bold font-serif text-amber-200">
            مخزنِ خاص مواد و زمرہ جات کنٹرول
          </h2>
          <p className="text-slate-300 text-xs mt-1 font-urdu">
            مخصوص اراکین کے لیے وظائف، نقوش، صدقات، اور ہدایات کا انتظام کریں اور رسائی کی سطح مقفل کریں۔
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenCategoryModal()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition flex items-center gap-1.5 font-urdu"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>نیا زمرہ بنائیں</span>
          </button>

          <button
            onClick={() => handleOpenPostModal()}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-1.5 font-urdu"
          >
            <Plus className="w-4 h-4" />
            <span>نئی تحریر شامل کریں</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex items-center justify-between border-b dark:border-slate-800 pb-2">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>تحاریر و مواد ({posts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'categories'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span>زمرہ جات / Categories ({categories.length})</span>
          </button>
        </div>

        {/* Filter Controls for Posts tab */}
        {activeTab === 'posts' && (
          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryId}
              onChange={(e) => setSelectedCategoryId(e.target.value)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs px-3 py-2 rounded-xl text-slate-700 dark:text-slate-200 font-urdu focus:outline-none"
            >
              <option value="all">تمام زمرہ جات</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.nameUrdu} ({c.name})</option>
              ))}
            </select>

            <div className="relative w-60">
              <input
                type="text"
                placeholder="سرچ تحریر..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs pl-8 pr-3 py-2 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none font-urdu"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>
        )}
      </div>

      {/* TAB CONTENT WITH FRAMER MOTION ANIMATION */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* TAB 1: POSTS LIST */}
          {activeTab === 'posts' && (
            <div className="space-y-4">
              {/* Bulk Actions Floating Bar */}
              {selectedPostIds.length > 0 && (
                <div className="bg-emerald-950/95 text-white p-3.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xl border border-emerald-700/80 animate-fadeIn font-urdu">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="font-bold text-xs text-emerald-200">
                      {selectedPostIds.length} تحاریر منتخب کی گئیں
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleBulkShowPosts}
                      className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 active:bg-emerald-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-emerald-600 shadow-sm"
                      title="منتخب تحاریر ظاہر کریں"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>ظاہر کریں (Bulk Show)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkHidePosts}
                      className="px-3 py-1.5 bg-amber-800 hover:bg-amber-700 active:bg-amber-900 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-amber-600 shadow-sm"
                      title="منتخب تحاریر مخفی کریں"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>مخفی کریں (Bulk Hide)</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleBulkDeletePosts}
                      className="px-3 py-1.5 bg-rose-700 hover:bg-rose-600 active:bg-rose-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition border border-rose-500 shadow-sm"
                      title="منتخب تحاریر حذف کریں"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف کریں (Bulk Delete)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPostIds([])}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition border border-slate-700"
                      title="انتخاب منسوخ کریں"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-xs">
                    <thead className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 font-urdu border-b dark:border-slate-800 select-none">
                      <tr>
                        <th className="p-3 w-10 text-center">
                          <input
                            type="checkbox"
                            checked={isAllPostsSelected}
                            onChange={handleSelectAllPosts}
                            className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                            title="تمام تحاریر منتخب کریں"
                          />
                        </th>
                        <th className="p-3">عنوان (Title)</th>
                        <th className="p-3">زمرہ (Category)</th>
                        <th className="p-3">رسائی سطح (Access Level)</th>
                        <th className="p-3">مواد کی قسم</th>
                        <th className="p-3">شئیرنگ اجازت</th>
                        <th className="p-3">حالت (Status)</th>
                        <th className="p-3 text-center">اقدامات (Actions)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-500 font-urdu">
                            کوئی تحریر نہیں ملی۔
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map((post) => {
                          const category = categories.find(c => c.id === post.categoryId);
                          const isSelected = selectedPostIds.includes(post.id);

                          return (
                            <tr 
                              key={post.id} 
                              className={`transition ${
                                isSelected 
                                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-l-4 border-l-emerald-500' 
                                  : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/40'
                              }`}
                            >
                              <td className="p-3 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleSelectPost(post.id)}
                                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 dark:border-slate-700 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
                                />
                              </td>

                              <td className="p-3">
                            <div className="font-bold text-slate-900 dark:text-slate-100 font-urdu text-sm">
                              {post.titleUrdu || post.title}
                            </div>
                            <div className="text-[11px] text-slate-500">{post.title}</div>
                          </td>

                          <td className="p-3">
                            <span className="bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold font-urdu">
                              {category?.nameUrdu || post.categoryId}
                            </span>
                          </td>

                          <td className="p-3">
                            {post.accessLevel === 'all_registered' && (
                              <span className="text-slate-600 dark:text-slate-400 font-urdu">تمام رجسٹرڈ اراکین</span>
                            )}
                            {post.accessLevel === 'specific_role' && (
                              <span className="bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 px-2 py-0.5 rounded text-[11px] font-bold font-urdu">
                                عہدہ: {post.targetRole}
                              </span>
                            )}
                            {post.accessLevel === 'specific_branch' && (
                              <span className="bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded text-[11px] font-bold font-urdu">
                                برانچ: {post.targetBranchCode}
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            <span className="text-slate-600 dark:text-slate-400 font-mono">
                              {post.contentType}
                            </span>
                          </td>

                          <td className="p-3">
                            {post.enableSharing ? (
                              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 font-urdu">
                                <Share2 className="w-3.5 h-3.5" />
                                کھلی ہے
                              </span>
                            ) : (
                              <span className="text-rose-600 dark:text-rose-400 font-bold flex items-center gap-1 font-urdu">
                                <Lock className="w-3.5 h-3.5" />
                                مقفل
                              </span>
                            )}
                          </td>

                          <td className="p-3">
                            {post.status === 'published' && (
                              <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded font-bold">
                                شائع شدہ
                              </span>
                            )}
                            {post.status === 'hidden' && (
                              <span className="bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300 px-2 py-0.5 rounded font-bold">
                                مخفی (Hidden)
                              </span>
                            )}
                            {post.status === 'draft' && (
                              <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 px-2 py-0.5 rounded font-bold">
                                ڈرافٹ
                              </span>
                            )}
                          </td>

                          <td className="p-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => onToggleHidePost(post.id)}
                                className={`p-1.5 rounded-lg border transition ${
                                  post.status === 'hidden'
                                    ? 'bg-amber-50 text-amber-600 border-amber-300'
                                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:text-slate-900'
                                }`}
                                title={post.status === 'hidden' ? 'ظاہر کریں' : 'مخفی کریں'}
                              >
                                {post.status === 'hidden' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>

                              <button
                                onClick={() => handleOpenPostModal(post)}
                                className="p-1.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition"
                                title="ترمیم کریں"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setMakhzanDeleteModal({
                                    title: 'مضمون حذف کریں (Delete Post)',
                                    message: `کیا آپ واقعی تحریر "${post.titleUrdu || post.title}" کو حذف کرنا چاہتے ہیں؟ یہ عمل ناقابلِ واپسی ہے۔`,
                                    onConfirm: () => {
                                      if (editingPost?.id === post.id) {
                                        setEditingPost(null);
                                        setShowPostModal(false);
                                      }
                                      onDeletePost(post.id);
                                    }
                                  });
                                }}
                                className="p-1.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 transition"
                                title="حذف کریں"
                              >
                                <Trash2 className="w-4 h-4" />
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
      )}

      {/* TAB 2: CATEGORIES LIST */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const catPosts = posts.filter(p => p.categoryId === cat.id);

            return (
              <div
                key={cat.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2.5 py-0.5 rounded-full font-bold font-urdu">
                    ترتیب: {cat.order}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenCategoryModal(cat)}
                      className="p-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 transition"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setMakhzanDeleteModal({
                          title: 'زمرہ حذف کریں (Delete Category)',
                          message: `کیا آپ زمرہ "${cat.nameUrdu}" حذف کرنا چاہتے ہیں؟`,
                          onConfirm: () => onDeleteCategory(cat.id)
                        });
                      }}
                      className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 font-urdu">
                    {cat.nameUrdu}
                  </h3>
                  <p className="text-xs text-slate-500">{cat.name}</p>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-400 font-urdu">
                  {cat.descriptionUrdu || cat.description}
                </p>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 font-urdu">
                  <span>شامل تحاریر: {catPosts.length}</span>
                  <span className={cat.status === 'published' ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                    حالت: {cat.status === 'published' ? 'شائع' : 'مخفی'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
        </motion.div>
      </AnimatePresence>

      {/* MODAL 1: ADD/EDIT CATEGORY */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-amber-500/30 font-urdu space-y-4"
            >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-amber-600">
                {editingCategory ? 'زمرہ میں ترمیم کریں' : 'نیا زمرہ بنائیں'}
              </h3>
              <button onClick={() => setShowCategoryModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold mb-1">زمرہ کا نام اردو میں (Required)</label>
                <input
                  type="text"
                  required
                  placeholder="مثلاً: صدقہ و ہدایات"
                  value={categoryForm.nameUrdu}
                  onChange={(e) => setCategoryForm({ ...categoryForm, nameUrdu: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl font-urdu focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">English Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Sadqa Guidance"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">آئیکن (Lucide Icon Name)</label>
                <select
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                >
                  <option value="HeartHandshake">HeartHandshake (صدقہ)</option>
                  <option value="Users">Users (بچوں کے نام)</option>
                  <option value="Sparkles">Sparkles (نقوش)</option>
                  <option value="BookOpen">BookOpen (وظائف)</option>
                  <option value="FolderHeart">FolderHeart (خاص مواد)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold mb-1">تفصیل (Urdu Description)</label>
                <textarea
                  rows={2}
                  value={categoryForm.descriptionUrdu}
                  onChange={(e) => setCategoryForm({ ...categoryForm, descriptionUrdu: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl font-urdu focus:outline-none"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ترتیب نمبر (Order)</label>
                  <input
                    type="number"
                    value={categoryForm.order}
                    onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">حالت (Status)</label>
                  <select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="published">شائع شدہ (Published)</option>
                    <option value="hidden">مخفی (Hidden)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-md hover:bg-amber-600 transition"
                >
                  حفظ کریں
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* MODAL 2: ADD/EDIT POST */}
      <AnimatePresence>
        {showPostModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 12 }}
              transition={{ duration: 0.18 }}
              className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-amber-500/30 font-urdu space-y-4 max-h-[90vh] overflow-y-auto"
            >
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-xl font-bold text-amber-600">
                {editingPost ? 'تحریر میں ترمیم کریں' : 'مخزنِ خاص میں نئی تحریر شامل کریں'}
              </h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitPost} className="space-y-4 text-xs">
              {/* Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">عنوان اردو میں (Urdu Title) *</label>
                  <input
                    type="text"
                    required
                    placeholder="مثلاً: مزاج کے مطابق صدقہ دینے کا طریقہ"
                    value={postForm.titleUrdu}
                    onChange={(e) => setPostForm({ ...postForm, titleUrdu: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl font-urdu focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">English Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Sadqa Rules by Element"
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Content Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">زمرہ (Category) *</label>
                  <select
                    value={postForm.categoryId}
                    onChange={(e) => setPostForm({ ...postForm, categoryId: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl font-urdu focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.nameUrdu} ({c.name})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">مواد کی قسم (Content Type)</label>
                  <select
                    value={postForm.contentType}
                    onChange={(e) => setPostForm({ ...postForm, contentType: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                  >
                    <option value="text">صرف متن (Text Only)</option>
                    <option value="image">صرف تصویر/نقش (Image Only)</option>
                    <option value="text_image">متن اور تصویر (Text + Image)</option>
                    <option value="pdf">پی ڈی ایف دستاویز (PDF Document)</option>
                  </select>
                </div>
              </div>

              {/* Access Control Settings */}
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 space-y-3">
                <h4 className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2 text-sm">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>رسائی و سیکیورٹی قوانین (Access Control Settings)</span>
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold mb-1">کون دیکھ سکتا ہے؟</label>
                    <select
                      value={postForm.accessLevel}
                      onChange={(e) => setPostForm({ ...postForm, accessLevel: e.target.value as any })}
                      className="w-full bg-white dark:bg-slate-900 border p-2 rounded-lg focus:outline-none font-urdu"
                    >
                      <option value="all_registered">تمام رجسٹرڈ اراکین</option>
                      <option value="specific_role">مخصوص عہدہ/رول (Role)</option>
                      <option value="specific_branch">مخصوص برانچ کوڈ (Branch)</option>
                    </select>
                  </div>

                  {postForm.accessLevel === 'specific_role' && (
                    <div>
                      <label className="block font-bold mb-1">مخصوص عہدہ چنیں</label>
                      <select
                        value={postForm.targetRole}
                        onChange={(e) => setPostForm({ ...postForm, targetRole: e.target.value as UserRole })}
                        className="w-full bg-white dark:bg-slate-900 border p-2 rounded-lg focus:outline-none"
                      >
                        <option value="super_admin">مرکزی نگرانِ اعلیٰ (Super Admin)</option>
                        <option value="central_admin">سینٹرل ایڈمن</option>
                        <option value="branch_admin">برانچ ایڈمن</option>
                        <option value="muhaqqiq">مجاز محقق (Muhaqqiq)</option>
                        <option value="muhaqqiq_operator">محقق اپریٹر</option>
                        <option value="user">عام طالب</option>
                      </select>
                    </div>
                  )}

                  {postForm.accessLevel === 'specific_branch' && (
                    <div>
                      <label className="block font-bold mb-1">مخصوص برانچ چنیں</label>
                      <select
                        value={postForm.targetBranchCode}
                        onChange={(e) => setPostForm({ ...postForm, targetBranchCode: e.target.value })}
                        className="w-full bg-white dark:bg-slate-900 border p-2 rounded-lg focus:outline-none"
                      >
                        {branches.map(b => (
                          <option key={b.id} value={b.code}>{b.code} - {b.name}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold mb-1">شئیرنگ اجازت (Share Permission)</label>
                    <label className="flex items-center gap-2 mt-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={postForm.enableSharing}
                        onChange={(e) => setPostForm({ ...postForm, enableSharing: e.target.checked })}
                        className="w-4 h-4 text-amber-500 rounded"
                      />
                      <span className="font-urdu">واٹس ایپ اور پی ڈی ایف شئیرنگ کی اجازت دیں</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Body Text */}
              <div>
                <label className="block font-bold mb-1">تفصیلی متن (Body Text) *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="مضمون کا مکمل متن اردو میں درج کریں..."
                  value={postForm.bodyText}
                  onChange={(e) => setPostForm({ ...postForm, bodyText: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-3 rounded-xl font-urdu focus:outline-none leading-relaxed text-sm"
                ></textarea>
              </div>

              {/* Images Section (URLs + Upload) */}
              <div className="space-y-2">
                <label className="block font-bold">تصاویر شامل کریں (Image Gallery & Bulk Upload)</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="تصویر کا یو آر ایل درج کریں (Image URL)..."
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    className="flex-1 bg-slate-50 dark:bg-slate-800 border p-2 rounded-xl focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700"
                  >
                    شامل کریں
                  </button>
                  <label className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl cursor-pointer hover:bg-amber-600 transition flex items-center gap-1">
                    <Upload className="w-4 h-4" />
                    <span>فائل منتخب کریں</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Added Images Preview with 16:9 Crop option */}
                {postForm.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2">
                    {postForm.images.map((img, idx) => (
                      <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-slate-700 bg-slate-950 group">
                        <img src={img} alt="preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => setCropperModal({ isOpen: true, imageSrc: img, galleryIndex: idx })}
                            className="p-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg transition text-xs font-bold flex items-center gap-1"
                            title="16:9 کراپ کریں"
                          >
                            <Crop className="w-3.5 h-3.5" />
                            <span>کراپ</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 bg-rose-700 hover:bg-rose-600 text-white rounded-lg transition"
                            title="حذف کریں"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Voice Reader & Official Recording MP3 */}
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

                {/* Upload Section */}
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
                        const targetId = editingPost?.id || 'mk-post-' + Date.now();
                        if (file) {
                          try {
                            setIsUploadingAudio(true);
                            const { uploadOfficialAudio } = await import('../../lib/firestoreVoiceReader');
                            const url = await uploadOfficialAudio(targetId, file);
                            setPostForm(prev => ({ ...prev, officialAudioUrl: url, humanVoiceUrl: url }));
                          } catch (err: any) {
                            alert('Audio upload failed: ' + err.message);
                          } finally {
                            setIsUploadingAudio(false);
                          }
                        }
                      }}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-[11px] text-slate-300 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-semibold file:bg-emerald-950 file:text-emerald-300 hover:file:bg-emerald-900 cursor-pointer disabled:opacity-50"
                    />

                    {isUploadingAudio && (
                      <span className="text-xs text-amber-400 font-bold flex items-center gap-1 shrink-0">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
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
                            setMakhzanDeleteModal({
                              title: 'Remove Audio Recording',
                              message: 'Are you sure you want to remove the official audio recording for this post?',
                              onConfirm: async () => {
                                try {
                                  if (editingPost?.id) {
                                    const { removeOfficialAudio } = await import('../../lib/firestoreVoiceReader');
                                    await removeOfficialAudio(editingPost.id);
                                  }
                                  setPostForm(prev => ({ ...prev, officialAudioUrl: '', humanVoiceUrl: '' }));
                                } catch (err: any) {
                                  console.error('Failed to remove audio:', err);
                                }
                              }
                            });
                          }}
                          className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800/80 rounded-lg text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
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
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono" 
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block mb-1">Speech Language (تلاوت کی زبان)</label>
                    <select 
                      value={postForm.language || 'auto'} 
                      onChange={(e) => setPostForm({ ...postForm, language: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="auto">✨ Auto Detect (خودکار زبان کی شناخت)</option>
                      <option value="ur">🇵🇰 Urdu (اردو تلاوت)</option>
                      <option value="ar">🇸🇦 Arabic (العربية / tajweed tone)</option>
                      <option value="en">🇬🇧 English (انگریزی)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* PDF Url */}
              <div>
                <label className="block font-bold mb-1">پی ڈی ایف فائل لنک (PDF Attachment URL)</label>
                <input
                  type="text"
                  placeholder="https://example.com/document.pdf"
                  value={postForm.pdfUrl}
                  onChange={(e) => setPostForm({ ...postForm, pdfUrl: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                />
              </div>

              {/* Tags & Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">ٹیگز (Tags - Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Sadqa, Mizaj, Diagnosis"
                    value={Array.isArray(postForm.tags) ? postForm.tags.join(', ') : postForm.tags}
                    onChange={(e) => setPostForm({ ...postForm, tags: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">اشاعت کی حالت (Publication Status)</label>
                  <select
                    value={postForm.status}
                    onChange={(e) => setPostForm({ ...postForm, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border p-2.5 rounded-xl focus:outline-none font-urdu"
                  >
                    <option value="published">شائع شدہ (Published)</option>
                    <option value="hidden">مخفی (Hidden)</option>
                    <option value="draft">مسودہ (Draft)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 flex items-center justify-end gap-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-800 rounded-xl font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-md hover:from-amber-600 hover:to-amber-700 transition"
                >
                  حفظ کریں
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 16:9 Image Cropper Modal for Makhzan Posts */}
      <ImageCropperModal
        isOpen={cropperModal.isOpen}
        imageSrc={cropperModal.imageSrc}
        onClose={() => setCropperModal((prev) => ({ ...prev, isOpen: false }))}
        onCropComplete={handleCroppedMakhzanImage}
        aspectRatio={16 / 9}
        title="مضمون تصویر کراپ ٹول (16:9 Aspect Ratio)"
      />

      {/* Reusable Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!makhzanDeleteModal}
        title={makhzanDeleteModal?.title || 'حذف کی تصدیق (Confirm Deletion)'}
        message={makhzanDeleteModal?.message || 'کیا آپ واقعی اس عنصر کو حذف کرنا چاہتے ہیں؟'}
        onConfirm={() => {
          makhzanDeleteModal?.onConfirm();
          setMakhzanDeleteModal(null);
        }}
        onCancel={() => setMakhzanDeleteModal(null)}
      />
    </div>
  );
};
