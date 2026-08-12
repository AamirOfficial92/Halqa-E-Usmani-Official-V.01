import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Check, 
  X, 
  ExternalLink, 
  ArrowUp, 
  ArrowDown, 
  FileText, 
  BookOpen, 
  Video, 
  Sparkles,
  Link as LinkIcon
} from 'lucide-react';
import { SliderItem, Post, PDFBook, VideoItem } from '../../types';

interface HeroSliderManagerProps {
  sliderItems: SliderItem[];
  posts: Post[];
  pdfs: PDFBook[];
  videos: VideoItem[];
  onAddSliderItem: (item: SliderItem) => void;
  onEditSliderItem: (item: SliderItem) => void;
  onDeleteSliderItem: (id: string) => void;
  onToggleHideSliderItem: (item: SliderItem) => void;
  onUpdateSlider: (items: SliderItem[]) => void;
}

const PRESET_BANNER_IMAGES = [
  { label: 'Masjid Nabawi Green Dome', url: 'https://images.unsplash.com/photo-1590076175571-4b5459efb08c?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Illuminated Shrine', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Islamic Calligraphy Art', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Holy Quran & Rosary', url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Spiritual Mosque Interior', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200' }
];

export const HeroSliderManager: React.FC<HeroSliderManagerProps> = ({
  sliderItems,
  posts,
  pdfs,
  videos,
  onAddSliderItem,
  onEditSliderItem,
  onDeleteSliderItem,
  onToggleHideSliderItem,
  onUpdateSlider
}) => {
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SliderItem | null>(null);

  const [formState, setFormState] = useState<Partial<SliderItem>>({
    title: '',
    titleUrdu: '',
    imageUrl: '',
    linkToType: 'post',
    targetId: '',
    status: 'published'
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormState({
      title: '',
      titleUrdu: '',
      imageUrl: PRESET_BANNER_IMAGES[0].url,
      linkToType: 'post',
      targetId: posts[0]?.id || '',
      status: 'published'
    });
    setShowModal(true);
  };

  const handleOpenEdit = (item: SliderItem) => {
    setEditingItem(item);
    setFormState({
      title: item.title || '',
      titleUrdu: item.titleUrdu || '',
      imageUrl: item.imageUrl || '',
      linkToType: item.linkToType || 'post',
      targetId: item.targetId || '',
      status: item.status || 'published'
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title && !formState.titleUrdu) return;

    if (editingItem) {
      const updated: SliderItem = {
        ...editingItem,
        title: formState.title || '',
        titleUrdu: formState.titleUrdu || '',
        imageUrl: formState.imageUrl || '',
        linkToType: (formState.linkToType as any) || 'post',
        targetId: formState.targetId || '',
        status: formState.status || 'published'
      };
      onEditSliderItem(updated);
    } else {
      const newItem: SliderItem = {
        id: `slide-${Date.now()}`,
        title: formState.title || '',
        titleUrdu: formState.titleUrdu || '',
        imageUrl: formState.imageUrl || PRESET_BANNER_IMAGES[0].url,
        linkToType: (formState.linkToType as any) || 'post',
        targetId: formState.targetId || '',
        status: formState.status || 'published'
      };
      onAddSliderItem(newItem);
    }

    setShowModal(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newItems = [...sliderItems];
    const temp = newItems[index - 1];
    newItems[index - 1] = newItems[index];
    newItems[index] = temp;
    onUpdateSlider(newItems);
  };

  const handleMoveDown = (index: number) => {
    if (index === sliderItems.length - 1) return;
    const newItems = [...sliderItems];
    const temp = newItems[index + 1];
    newItems[index + 1] = newItems[index];
    newItems[index] = temp;
    onUpdateSlider(newItems);
  };

  return (
    <div className="space-y-6 text-left" dir="ltr">
      {/* Top Banner & Action */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-slate-900 border border-amber-600/30 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
              <Image size={22} />
            </span>
            <h2 className="text-xl font-bold text-white font-serif">
              Home Hero Sliders & Banners (ہوم سلائیڈر و بینرز)
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-2 max-w-2xl">
            Create, edit, reorder, and update the main featured carousel banners displayed at the top of the mobile home screen. Link banners directly to specific Posts, PDF Books, Audio/Video, or external URLs.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center gap-2 shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus size={18} />
          <span>Add New Home Banner (نیا بینر بنائیں)</span>
        </button>
      </div>

      {/* Slider Items Grid/List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            Active Banners Carousel ({sliderItems.length} items)
          </span>
          <span className="text-[11px] text-amber-400/80 font-medium">
            Changes sync live across all mobile app users
          </span>
        </div>

        {sliderItems.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-3">
            <Image size={40} className="mx-auto text-slate-600" />
            <h3 className="text-sm font-bold text-slate-300">No Banners Found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click the button above to add your first Hero Banner for the main app dashboard.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus size={16} />
              <span>Create Banner</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sliderItems.map((item, idx) => {
              const isHidden = item.status === 'hidden';

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-slate-900 border rounded-3xl overflow-hidden shadow-lg transition-all flex flex-col justify-between ${
                    isHidden ? 'border-red-900/40 opacity-60' : 'border-slate-800 hover:border-amber-500/40'
                  }`}
                >
                  {/* Banner Preview Area */}
                  <div className="relative h-44 w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                    <img
                      src={item.imageUrl || PRESET_BANNER_IMAGES[0].url}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                    />
                    <img
                      src={item.imageUrl || PRESET_BANNER_IMAGES[0].url}
                      alt={item.title}
                      className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent p-4 flex flex-col justify-between">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] bg-amber-500 text-slate-950 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                          #{idx + 1} {item.linkToType?.toUpperCase()}
                        </span>

                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            isHidden
                              ? 'bg-red-900/80 text-red-200 border border-red-700'
                              : 'bg-emerald-900/80 text-emerald-200 border border-emerald-700'
                          }`}
                        >
                          {isHidden ? 'Hidden' : 'Published'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h3 className="text-white font-bold text-sm line-clamp-1 font-serif">
                          {item.title || 'Untitled Banner'}
                        </h3>
                        {item.titleUrdu && (
                          <p className="text-amber-300 font-bold text-xs line-clamp-1 font-serif text-right" dir="rtl">
                            {item.titleUrdu}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Details & Actions Footer */}
                  <div className="p-4 bg-slate-900 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] truncate">
                      <LinkIcon size={14} className="text-amber-400 shrink-0" />
                      <span className="truncate">Target ID: {item.targetId || 'None'}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleMoveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up in Carousel"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg cursor-pointer transition-all"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        onClick={() => handleMoveDown(idx)}
                        disabled={idx === sliderItems.length - 1}
                        title="Move Down in Carousel"
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-300 rounded-lg cursor-pointer transition-all"
                      >
                        <ArrowDown size={14} />
                      </button>

                      <button
                        onClick={() => onToggleHideSliderItem(item)}
                        title={isHidden ? 'Publish / Show Banner' : 'Hide Banner'}
                        className={`p-1.5 rounded-lg cursor-pointer transition-all ${
                          isHidden
                            ? 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                      </button>

                      <button
                        onClick={() => handleOpenEdit(item)}
                        title="Edit Banner Settings"
                        className="p-1.5 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 rounded-lg cursor-pointer transition-all"
                      >
                        <Edit3 size={14} />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this home banner?')) {
                            onDeleteSliderItem(item.id);
                          }
                        }}
                        title="Delete Banner"
                        className="p-1.5 bg-red-950 text-red-400 hover:bg-red-900 rounded-lg cursor-pointer transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Banner Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 text-left space-y-5 shadow-2xl my-8"
            >
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Image className="text-amber-400" size={20} />
                  <span>{editingItem ? 'Edit Home Banner' : 'Add New Home Banner'}</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Live Card Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold uppercase text-slate-400">
                  Live Banner Card Preview:
                </span>
                <div className="relative h-36 w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner flex items-center justify-center">
                  <img
                    src={formState.imageUrl || PRESET_BANNER_IMAGES[0].url}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
                  />
                  <img
                    src={formState.imageUrl || PRESET_BANNER_IMAGES[0].url}
                    alt="Preview"
                    className="relative z-10 max-h-full max-w-full object-contain mx-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3.5 flex flex-col justify-end">
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider self-start mb-1 font-mono">
                      {formState.linkToType?.toUpperCase()}
                    </span>
                    <h4 className="text-white font-bold text-sm line-clamp-1 font-serif">
                      {formState.title || 'Enter Title...'}
                    </h4>
                    {formState.titleUrdu && (
                      <p className="text-amber-300 font-bold text-xs line-clamp-1 font-serif text-right" dir="rtl">
                        {formState.titleUrdu}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title (English/Roman) */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                    Banner Heading Title (Roman English / Title) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formState.title || ''}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    placeholder="e.g. Annual Urs Mubarak Celebration"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                {/* Title (Urdu) */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                    عنوان اردو میں (Urdu Title)
                  </label>
                  <input
                    type="text"
                    dir="rtl"
                    value={formState.titleUrdu || ''}
                    onChange={(e) => setFormState({ ...formState, titleUrdu: e.target.value })}
                    placeholder="مثلاً: سالانہ عرس مبارک کی تیاریاں"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-amber-300 font-bold focus:border-amber-500 focus:outline-none text-right"
                  />
                </div>

                {/* Image URL & Presets */}
                <div className="space-y-2">
                  <label className="text-[11px] font-bold uppercase text-slate-300 block">
                    Banner Background Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formState.imageUrl || ''}
                    onChange={(e) => setFormState({ ...formState, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />

                  {/* Image Presets */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">Presets:</span>
                    {PRESET_BANNER_IMAGES.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        type="button"
                        onClick={() => setFormState({ ...formState, imageUrl: p.url })}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0 transition-all cursor-pointer ${
                          formState.imageUrl === p.url
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400'
                            : 'bg-slate-950 text-slate-400 border-slate-800 hover:bg-slate-800'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Link Type & Target Dropdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                      Link Destination Type
                    </label>
                    <select
                      value={formState.linkToType || 'post'}
                      onChange={(e) => {
                        const newType = e.target.value as any;
                        let defaultTarget = '';
                        if (newType === 'post') defaultTarget = posts[0]?.id || '';
                        if (newType === 'pdf') defaultTarget = pdfs[0]?.id || '';
                        if (newType === 'video') defaultTarget = videos[0]?.id || '';
                        setFormState({ ...formState, linkToType: newType, targetId: defaultTarget });
                      }}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                    >
                      <option value="post">Article / Post (مضمون / پوسٹ)</option>
                      <option value="pdf">PDF Book (پی ڈی ایف کتاب)</option>
                      <option value="video">Video (ویڈیو)</option>
                      <option value="url">External Link (بیرونی لنک)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                      Target Content ID / Link
                    </label>
                    {formState.linkToType === 'post' && (
                      <select
                        value={formState.targetId || ''}
                        onChange={(e) => setFormState({ ...formState, targetId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="">-- Select Post --</option>
                        {posts.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.title} ({p.titleUrdu || 'Urdu'})
                          </option>
                        ))}
                      </select>
                    )}

                    {formState.linkToType === 'pdf' && (
                      <select
                        value={formState.targetId || ''}
                        onChange={(e) => setFormState({ ...formState, targetId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="">-- Select PDF Book --</option>
                        {pdfs.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.title}
                          </option>
                        ))}
                      </select>
                    )}

                    {formState.linkToType === 'video' && (
                      <select
                        value={formState.targetId || ''}
                        onChange={(e) => setFormState({ ...formState, targetId: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                      >
                        <option value="">-- Select Video --</option>
                        {videos.map((v) => (
                          <option key={v.id} value={v.id}>
                            {v.title}
                          </option>
                        ))}
                      </select>
                    )}

                    {formState.linkToType === 'url' && (
                      <input
                        type="text"
                        value={formState.targetId || ''}
                        onChange={(e) => setFormState({ ...formState, targetId: e.target.value })}
                        placeholder="https://..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                      />
                    )}
                  </div>
                </div>

                {/* Status Selection */}
                <div>
                  <label className="text-[11px] font-bold uppercase text-slate-300 block mb-1">
                    Display Status
                  </label>
                  <select
                    value={formState.status || 'published'}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="published">Published (Visible on Home Screen)</option>
                    <option value="hidden">Hidden (Temporarily Hide)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Check size={16} />
                    <span>{editingItem ? 'Update Banner' : 'Save New Banner'}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
