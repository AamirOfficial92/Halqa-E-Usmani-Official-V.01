import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Tv, 
  Plus, 
  Trash2, 
  Edit, 
  Eye, 
  EyeOff, 
  Clock, 
  Image as ImageIcon, 
  Upload, 
  Sparkles, 
  Check, 
  X, 
  Play, 
  Crop,
  Layers,
  HelpCircle
} from 'lucide-react';
import { PostSplashScreenItem } from '../../types';
import { DeleteConfirmModal } from '../DeleteConfirmModal';
import { ImageCropperModal } from './ImageCropperModal';
import { SalawatScreen } from '../SalawatScreen';

interface PostSplashManagerProps {
  postSplashScreens?: PostSplashScreenItem[];
  onAddPostSplashScreen?: (screen: PostSplashScreenItem) => void;
  onEditPostSplashScreen?: (screen: PostSplashScreenItem) => void;
  onDeletePostSplashScreen?: (id: string) => void;
  onTogglePostSplashScreen?: (screen: PostSplashScreenItem) => void;
}

const PRESET_BACKGROUNDS = [
  { label: 'Mosque Illuminated', url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Islamic Calligraphy', url: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Spiritual Shrine', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1200' },
  { label: 'Minimal Emerald Pattern', url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=1200' },
];

export const PostSplashManager: React.FC<PostSplashManagerProps> = ({
  postSplashScreens = [],
  onAddPostSplashScreen,
  onEditPostSplashScreen,
  onDeletePostSplashScreen,
  onTogglePostSplashScreen
}) => {
  const [editingScreen, setEditingScreen] = useState<PostSplashScreenItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [screenForm, setScreenForm] = useState<Partial<PostSplashScreenItem>>({
    title: 'درودِ پاک و دعاۓ برکت',
    titleEnglish: 'Salawat & Blessing Prayer',
    bismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    mainArabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ عَدَدَ كُلِّ شَيْءٍ مَعْلُومٍ لَكَ، رَبِّ أَرِنِي بِجَمَالِكَ وَجَمَالَهَا يَا رَسُولَ اللَّهِ، يَا حَبِيبَ اللَّهِ، يَا خَيْرَ خَلْقِ اللَّهِ، يَا نُورَ عَرْشِ اللَّهِ، يَا نُوراً مِنْ نُورِ اللَّهِ، مُحَمَّدْ رَسُولُ اللَّهِ، صَلَّى اللَّهُ تَعَالَى عَلَيْهِ وَسَلَّمَ، يَا زَيْنَا، يَا زَيْنَا۔',
    urduTranslation: 'اللہ تعالیٰ ہمیں حضور نبی کریم ﷺ کی سچی محبت، ادب، اتباع اور شفاعت نصیب فرمائے، اور دنیا و آخرت میں آپ ﷺ کی رضا و قرب عطا فرمائے۔ آمین یا رب العالمین۔',
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
    durationSeconds: 15,
    isEnabled: true,
    order: (postSplashScreens.length || 0) + 1
  });

  // Image upload state
  const [cropperOpen, setCropperOpen] = useState(false);
  const [fileToCrop, setFileToCrop] = useState<File | null>(null);

  // Live preview modal
  const [previewActive, setPreviewActive] = useState(false);
  const [singlePreviewItem, setSinglePreviewItem] = useState<PostSplashScreenItem | null>(null);

  const resetForm = () => {
    setEditingScreen(null);
    setScreenForm({
      title: 'درودِ پاک و دعاۓ برکت',
      titleEnglish: 'Salawat & Blessing Prayer',
      bismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
      mainArabicText: '',
      urduTranslation: '',
      imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
      durationSeconds: 15,
      isEnabled: true,
      order: (postSplashScreens.length || 0) + 1
    });
  };

  const handleEditClick = (screen: PostSplashScreenItem) => {
    setEditingScreen(screen);
    setScreenForm({ ...screen });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!screenForm.title || !screenForm.mainArabicText) {
      alert('براہِ کرم عنوان اور بنیادی متن درج کریں!');
      return;
    }

    const payload: PostSplashScreenItem = {
      id: editingScreen ? editingScreen.id : `post-splash-${Date.now()}`,
      title: screenForm.title || 'درودِ پاک',
      titleEnglish: screenForm.titleEnglish || '',
      bismillahText: screenForm.bismillahText || '',
      mainArabicText: screenForm.mainArabicText || '',
      urduTranslation: screenForm.urduTranslation || '',
      imageUrl: screenForm.imageUrl || '',
      audioUrl: screenForm.audioUrl || '',
      durationSeconds: Number(screenForm.durationSeconds) || 15,
      isEnabled: screenForm.isEnabled !== false,
      order: Number(screenForm.order) || 1,
      createdAt: editingScreen?.createdAt || new Date().toISOString()
    };

    if (editingScreen) {
      if (onEditPostSplashScreen) onEditPostSplashScreen(payload);
    } else {
      if (onAddPostSplashScreen) onAddPostSplashScreen(payload);
    }

    resetForm();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileToCrop(file);
      setCropperOpen(true);
    }
  };

  const handleCroppedImage = (dataUrl: string) => {
    setScreenForm(prev => ({ ...prev, imageUrl: dataUrl }));
    setCropperOpen(false);
    setFileToCrop(null);
  };

  return (
    <div className="space-y-6 text-left" dir="ltr">
      {/* Top Banner / Intro Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 border border-emerald-500/40 p-5 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/80 border border-emerald-400/50 flex items-center justify-center text-amber-300 shadow-md">
              <Tv size={26} />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
                <span>Post-Splash Screen Management</span>
                <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-serif">
                  درود پاک و سکرین
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Manage screen slides shown immediately after the initial app splash screen (including images, Urdu/Arabic text, and screen timing duration).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setSinglePreviewItem(null);
              setPreviewActive(true);
            }}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg border border-amber-300/60 transition-all flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Play size={16} className="fill-slate-950" />
            <span>Test Live Full Flow Preview</span>
          </button>
        </div>
      </div>

      {/* Screen Form (Create / Edit) */}
      <form onSubmit={handleFormSubmit} className="bg-slate-800/40 border border-slate-700/80 p-5 rounded-2xl space-y-4 shadow-lg relative">
        <div className="flex justify-between items-center border-b border-slate-700/60 pb-3">
          <h3 className="font-extrabold text-sm text-amber-300 flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>{editingScreen ? `✍️ Edit Screen: ${editingScreen.title}` : '➕ Add New Post-Splash Screen Slide'}</span>
          </h3>

          {editingScreen && (
            <button
              type="button"
              onClick={resetForm}
              className="text-xs bg-slate-700 text-slate-200 hover:bg-slate-600 px-3 py-1 rounded-lg font-bold"
            >
              Cancel Editing
            </button>
          )}
        </div>

        {/* Form Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Screen Title Urdu */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Screen Title (اردو عنوان) *
            </label>
            <input
              type="text"
              required
              value={screenForm.title || ''}
              onChange={(e) => setScreenForm({ ...screenForm, title: e.target.value })}
              placeholder="مثلاً: درودِ پاک و دعاۓ برکت"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white text-right focus:border-amber-400 outline-none"
            />
          </div>

          {/* Screen Title English */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Title Category (English Label)
            </label>
            <input
              type="text"
              value={screenForm.titleEnglish || ''}
              onChange={(e) => setScreenForm({ ...screenForm, titleEnglish: e.target.value })}
              placeholder="e.g. Salawat & Blessing Prayer, Annual Event"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-400 outline-none"
            />
          </div>

          {/* Bismillah / Header Badge Text */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-slate-300 block mb-1">
              Top Header Badge Text (بسم اللہ یا سرخی)
            </label>
            <input
              type="text"
              value={screenForm.bismillahText || ''}
              onChange={(e) => setScreenForm({ ...screenForm, bismillahText: e.target.value })}
              placeholder="مثلاً: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ یا اعلانِ خاص"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-amber-300 text-center font-serif focus:border-amber-400 outline-none"
            />
          </div>

          {/* Main Text / Arabic Script */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-amber-300 block mb-1">
              Main Display Text / Arabic Durood Script (بنیادی متن یا عربی درود پاک) *
            </label>
            <textarea
              required
              rows={3}
              value={screenForm.mainArabicText || ''}
              onChange={(e) => setScreenForm({ ...screenForm, mainArabicText: e.target.value })}
              placeholder="درودِ پاک یا عربی متن تحریر کریں..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-sm text-amber-200 text-right font-serif leading-loose focus:border-amber-400 outline-none"
            />
          </div>

          {/* Urdu Translation & Explanation */}
          <div className="md:col-span-2">
            <label className="text-xs font-bold text-emerald-300 block mb-1">
              Urdu Translation / Explanation / Message (اردو ترجمہ، دعا یا پیغام)
            </label>
            <textarea
              rows={2}
              value={screenForm.urduTranslation || ''}
              onChange={(e) => setScreenForm({ ...screenForm, urduTranslation: e.target.value })}
              placeholder="ترجمہ یا پیغام کا متن درج کریں..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-emerald-100 text-right font-serif leading-relaxed focus:border-amber-400 outline-none"
            />
          </div>

          {/* Screen Display Timing Duration */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <Clock size={14} className="text-amber-400" />
              <span>Screen Timing Duration (Seconds) *</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={3}
                max={120}
                required
                value={screenForm.durationSeconds || 15}
                onChange={(e) => setScreenForm({ ...screenForm, durationSeconds: Number(e.target.value) })}
                className="w-24 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:border-amber-400 outline-none"
              />
              <span className="text-xs text-slate-400 font-bold">Seconds</span>

              {/* Quick Presets */}
              <div className="flex items-center gap-1 ml-auto flex-wrap">
                {[5, 10, 15, 20, 30, 60].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScreenForm({ ...screenForm, durationSeconds: s })}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                      screenForm.durationSeconds === s
                        ? 'bg-amber-500 text-slate-950 border-amber-300'
                        : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Display Order Position */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center gap-1">
              <Layers size={14} className="text-emerald-400" />
              <span>Display Order Position</span>
            </label>
            <input
              type="number"
              min={1}
              value={screenForm.order || 1}
              onChange={(e) => setScreenForm({ ...screenForm, order: Number(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:border-amber-400 outline-none"
            />
          </div>

          {/* Background Image Upload & Presets */}
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-300 block mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ImageIcon size={14} className="text-sky-400" />
                <span>Background / Feature Image</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">Upload file or pick preset image</span>
            </label>

            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <input
                type="text"
                value={screenForm.imageUrl || ''}
                onChange={(e) => setScreenForm({ ...screenForm, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/... or upload image"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:border-amber-400 outline-none w-full"
              />

              <label className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-600 shrink-0 w-full sm:w-auto justify-center">
                <Upload size={14} />
                <span>Upload Image File</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Quick Preset Images */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1">
              <span className="text-[10px] text-slate-400 font-bold shrink-0">Presets:</span>
              {PRESET_BACKGROUNDS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setScreenForm({ ...screenForm, imageUrl: preset.url })}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border shrink-0 transition-all cursor-pointer ${
                    screenForm.imageUrl === preset.url
                      ? 'bg-sky-900/80 text-sky-200 border-sky-400'
                      : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Image Thumbnail Preview */}
            {screenForm.imageUrl && (
              <div className="relative w-full h-24 rounded-xl overflow-hidden border border-slate-700 mt-2">
                <img
                  src={screenForm.imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setScreenForm({ ...screenForm, imageUrl: '' })}
                  className="absolute top-2 right-2 p-1 bg-slate-950/80 text-rose-400 rounded-lg border border-rose-500/40 hover:bg-rose-950"
                  title="Remove Image"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Enabled Status */}
          <div className="flex items-center gap-3 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-200">
              <input
                type="checkbox"
                checked={screenForm.isEnabled !== false}
                onChange={(e) => setScreenForm({ ...screenForm, isEnabled: e.target.checked })}
                className="w-4 h-4 rounded border-slate-700 text-emerald-600 focus:ring-emerald-500"
              />
              <span>Enable & Show Immediately After Splash Screen</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-700/60">
          <button
            type="button"
            onClick={() => {
              setSinglePreviewItem(screenForm as PostSplashScreenItem);
              setPreviewActive(true);
            }}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-amber-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer border border-slate-600"
          >
            <Play size={14} />
            <span>Preview Current Form</span>
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold rounded-xl shadow-lg text-xs border border-emerald-400/40 flex items-center gap-2 cursor-pointer transition-all"
          >
            <Check size={16} />
            <span>{editingScreen ? 'Save Updated Screen' : 'Add Post-Splash Screen'}</span>
          </button>
        </div>
      </form>

      {/* Screen List Table / Cards */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
            <span>Configured Post-Splash Screens</span>
            <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
              {postSplashScreens.length} Items
            </span>
          </h3>
        </div>

        {postSplashScreens.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-800 p-8 rounded-2xl text-center space-y-2">
            <Tv size={36} className="mx-auto text-slate-600" />
            <p className="text-xs text-slate-400">No custom post-splash screens configured yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {postSplashScreens
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((screen, index) => (
                <div
                  key={screen.id}
                  className={`bg-slate-800/40 border rounded-2xl p-4 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                    screen.isEnabled
                      ? 'border-emerald-500/40 shadow-md'
                      : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center text-xs font-extrabold text-amber-300 font-mono shrink-0">
                      #{index + 1}
                    </div>

                    {screen.imageUrl && (
                      <div className="w-16 h-12 rounded-lg overflow-hidden border border-slate-700 shrink-0">
                        <img
                          src={screen.imageUrl}
                          alt={screen.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-extrabold text-sm text-amber-300 text-right" dir="rtl">
                          {screen.title}
                        </h4>

                        {screen.bismillahText && (
                          <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-serif" dir="rtl">
                            {screen.bismillahText}
                          </span>
                        )}

                        <span className="text-[10px] bg-slate-900 text-amber-400 border border-slate-700 px-2 py-0.5 rounded-full font-mono font-bold flex items-center gap-1">
                          <Clock size={11} />
                          {screen.durationSeconds}s
                        </span>

                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          screen.isEnabled
                            ? 'bg-emerald-950 text-emerald-300 border-emerald-700'
                            : 'bg-rose-950 text-rose-300 border-rose-800'
                        }`}>
                          {screen.isEnabled ? 'Active' : 'Disabled'}
                        </span>
                      </div>

                      <p className="text-xs text-amber-200/90 font-serif line-clamp-1 text-right" dir="rtl">
                        {screen.mainArabicText}
                      </p>

                      {screen.urduTranslation && (
                        <p className="text-[11px] text-slate-300 font-serif line-clamp-1 text-right" dir="rtl">
                          {screen.urduTranslation}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => {
                        setSinglePreviewItem(screen);
                        setPreviewActive(true);
                      }}
                      className="p-2 bg-slate-900 hover:bg-slate-700 text-amber-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
                      title="Preview this Screen"
                    >
                      <Play size={15} />
                    </button>

                    <button
                      onClick={() => onTogglePostSplashScreen && onTogglePostSplashScreen(screen)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        screen.isEnabled
                          ? 'bg-emerald-950 text-emerald-300 border-emerald-700 hover:bg-emerald-900'
                          : 'bg-slate-900 text-slate-500 border-slate-800 hover:bg-slate-800'
                      }`}
                      title={screen.isEnabled ? 'Disable Screen' : 'Enable Screen'}
                    >
                      {screen.isEnabled ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>

                    <button
                      onClick={() => handleEditClick(screen)}
                      className="p-2 bg-slate-900 hover:bg-slate-700 text-sky-300 rounded-xl border border-slate-700 transition-all cursor-pointer"
                      title="Edit Screen"
                    >
                      <Edit size={15} />
                    </button>

                    <button
                      onClick={() => setDeleteId(screen.id)}
                      className="p-2 bg-slate-900 hover:bg-rose-950 text-rose-400 rounded-xl border border-slate-700 hover:border-rose-800 transition-all cursor-pointer"
                      title="Delete Screen"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Image Cropper Modal */}
      {cropperOpen && fileToCrop && (
        <ImageCropperModal
          file={fileToCrop}
          aspectRatio={16 / 9}
          onCropComplete={handleCroppedImage}
          onCancel={() => {
            setCropperOpen(false);
            setFileToCrop(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <DeleteConfirmModal
          title="Delete Post-Splash Screen"
          message="Are you sure you want to delete this post-splash screen? This action cannot be undone."
          onConfirm={() => {
            if (onDeletePostSplashScreen) onDeletePostSplashScreen(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}

      {/* Interactive Live Preview Overlay Modal */}
      {previewActive && (
        <div className="fixed inset-0 z-[99999] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-fadeIn">
          <div className="relative w-full max-w-xl h-[90vh] bg-slate-950 rounded-3xl overflow-hidden border border-amber-500/50 shadow-2xl flex flex-col">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex justify-between items-center z-50">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Play size={14} className="fill-amber-300" />
                <span>Live Post-Splash Screen Simulation</span>
              </span>
              <button
                onClick={() => setPreviewActive(false)}
                className="p-1 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 relative overflow-hidden">
              <SalawatScreen
                onComplete={() => setPreviewActive(false)}
                screens={singlePreviewItem ? [singlePreviewItem] : postSplashScreens}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
