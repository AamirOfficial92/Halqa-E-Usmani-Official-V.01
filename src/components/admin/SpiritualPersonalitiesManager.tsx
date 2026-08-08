import React, { useState } from 'react';
import { SpiritualPersonality } from '../../types';
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, Music, Video, FileText, Check, X, UserCheck } from 'lucide-react';
import { DeleteConfirmModal } from '../DeleteConfirmModal';

interface SpiritualPersonalitiesManagerProps {
  personalities: SpiritualPersonality[];
  onSave: (personality: SpiritualPersonality) => void;
  onDelete: (id: string) => void;
  onToggleHide: (id: string) => void;
}

export const SpiritualPersonalitiesManager: React.FC<SpiritualPersonalitiesManagerProps> = ({
  personalities,
  onSave,
  onDelete,
  onToggleHide
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SpiritualPersonality | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [nameUrdu, setNameUrdu] = useState('');
  const [title, setTitle] = useState('');
  const [titleUrdu, setTitleUrdu] = useState('');
  const [era, setEra] = useState('');
  const [eraUrdu, setEraUrdu] = useState('');
  const [bio, setBio] = useState('');
  const [biographyUrdu, setBiographyUrdu] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [audioUrl, setAudioUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'hidden' | 'draft'>('published');

  const resetForm = () => {
    setName('');
    setNameUrdu('');
    setTitle('');
    setTitleUrdu('');
    setEra('');
    setEraUrdu('');
    setBio('');
    setBiographyUrdu('');
    setImages(['']);
    setAudioUrl('');
    setVideoUrl('');
    setPdfUrl('');
    setStatus('published');
    setIsAdding(false);
    setEditingId(null);
  };

  const handleEditInit = (p: SpiritualPersonality) => {
    setName(p.name || p.nameUrdu || '');
    setNameUrdu(p.nameUrdu || p.name || '');
    setTitle(p.title || p.titleUrdu || '');
    setTitleUrdu(p.titleUrdu || p.title || '');
    setEra(p.era || p.eraUrdu || '');
    setEraUrdu(p.eraUrdu || p.era || '');
    setBio(p.bio || p.biography || p.biographyUrdu || '');
    setBiographyUrdu(p.biographyUrdu || p.biography || p.bio || '');
    setImages(p.images && p.images.length > 0 ? [...p.images] : (p.imageUrl ? [p.imageUrl] : ['']));
    setAudioUrl(p.audioUrl || '');
    setVideoUrl(p.videoUrl || '');
    setPdfUrl(p.pdfUrl || '');
    setStatus(p.status || 'published');
    setEditingId(p.id);
    setIsAdding(true);
  };

  const handleAddImageRow = () => {
    setImages((prev) => [...prev, '']);
  };

  const handleImageChange = (index: number, val: string) => {
    setImages((prev) => {
      const copy = [...prev];
      copy[index] = val;
      return copy;
    });
  };

  const handleRemoveImageRow = (index: number) => {
    setImages((prev) => {
      const copy = prev.filter((_, i) => i !== index);
      return copy.length === 0 ? [''] : copy;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || (!bio.trim() && !biographyUrdu.trim())) return;

    // Filter empty image URLs
    const filteredImages = images.map((i) => i.trim()).filter((i) => i.length > 0);
    const mainImage = filteredImages[0] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800';

    const now = new Date().toISOString();
    const existing = personalities.find((p) => p.id === editingId);

    const finalBio = bio.trim() || biographyUrdu.trim();
    const finalUrduBio = biographyUrdu.trim() || bio.trim();

    const newItem: SpiritualPersonality = {
      id: editingId || `sp-${Date.now()}`,
      name: name.trim(),
      nameUrdu: nameUrdu.trim() || name.trim(),
      title: title.trim() || undefined,
      titleUrdu: titleUrdu.trim() || title.trim() || undefined,
      era: era.trim() || undefined,
      eraUrdu: eraUrdu.trim() || era.trim() || undefined,
      bio: finalBio,
      biography: finalBio,
      biographyUrdu: finalUrduBio,
      imageUrl: mainImage,
      images: filteredImages.length > 0 ? filteredImages : [mainImage],
      audioUrl: audioUrl.trim() || undefined,
      videoUrl: videoUrl.trim() || undefined,
      pdfUrl: pdfUrl.trim() || undefined,
      status,
      createdAt: existing ? existing.createdAt : now,
      updatedAt: now
    };

    onSave(newItem);
    resetForm();
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-base font-bold text-emerald-400 flex items-center gap-2">
            <UserCheck size={20} />
            Spiritual Personalities Manager (بزرگانِ سلسلہ)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Islamic spiritual personalities, biographies, media links, and image galleries.
          </p>
        </div>
        {!isAdding && (
          <button
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg"
          >
            <Plus size={16} /> Add Personality
          </button>
        )}
      </div>

      {/* Add / Edit Form Modal or Panel */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-emerald-500/30 p-5 rounded-2xl space-y-4 shadow-xl">
          <div className="flex justify-between items-center border-b border-slate-700/80 pb-3">
            <h3 className="font-bold text-sm text-emerald-300">
              {editingId ? '✍️ Edit Spiritual Personality' : '➕ Add New Spiritual Personality (بزرگِ سلسلہ)'}
            </h3>
            <button
              type="button"
              onClick={resetForm}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700/50"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Personality Name (نام) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="مثلاً: حضرت پیر سید حسام الدین عثمانی"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-right focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Title / Honorific (منصب یا خطاب)
              </label>
              <input
                type="text"
                placeholder="مثلاً: سرپرستِ اعلیٰ و پیرِ طریقہ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-right focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Era / Period (دور / زمانہ)
              </label>
              <input
                type="text"
                placeholder="مثلاً: عہدِ حاضر / 14ویں صدی ہجری"
                value={era}
                onChange={(e) => setEra(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-right focus:border-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-300 block mb-1">
                Primary Image URL (بنیادی تصویر)
              </label>
              <input
                type="url"
                placeholder="https://example.com/image.jpg"
                value={images[0] || ''}
                onChange={(e) => handleImageChange(0, e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Biography Textarea */}
          <div>
            <label className="text-[11px] font-bold text-slate-300 block mb-1">
              Biography / Description (مفصل سوانحِ حیات) <span className="text-rose-400">*</span>
            </label>
            <textarea
              required
              rows={5}
              placeholder="مکمل تفصیلی سوانح حیات، تعلیمات اور خدمات درج کریں..."
              value={bio}
              onChange={(e) => {
                setBio(e.target.value);
                setBiographyUrdu(e.target.value);
              }}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white text-right focus:border-emerald-500 outline-none leading-relaxed"
            />
          </div>

          {/* Dynamic Images Section */}
          <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-slate-700/60">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                <ImageIcon size={14} className="text-emerald-400" /> Image URLs Gallery (تصاویر کے لنکس)
              </label>
              <button
                type="button"
                onClick={handleAddImageRow}
                className="text-[11px] bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold px-3 py-1 rounded-lg border border-slate-700 flex items-center gap-1"
              >
                <Plus size={12} /> Add Image
              </button>
            </div>

            <div className="space-y-2">
              {images.map((imgUrl, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-mono w-5">{idx + 1}.</span>
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={imgUrl}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-emerald-500 outline-none font-mono"
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveImageRow(idx)}
                      className="p-1.5 text-rose-400 hover:bg-rose-950/50 rounded-lg border border-rose-900/40"
                      title="Remove image row"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 italic mt-1">
              Add as many image links as needed. Tapping 'Add Image' appends a new input row.
            </p>
          </div>

          {/* Media Links (Audio, Video, PDF) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                <Music size={12} className="text-amber-400" /> Audio URL (ملفوظات صوتی)
              </label>
              <input
                type="url"
                placeholder="https://.../audio.mp3"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                <Video size={12} className="text-red-400" /> Video URL (ویڈیو بیانات)
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-300 flex items-center gap-1 mb-1">
                <FileText size={12} className="text-blue-400" /> PDF URL (رسائل و کتب)
              </label>
              <input
                type="url"
                placeholder="https://.../document.pdf"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-emerald-500 outline-none font-mono"
              />
            </div>
          </div>

          {/* Status Selection */}
          <div className="flex items-center gap-4">
            <label className="text-[11px] font-bold text-slate-300">Publish Status:</label>
            <div className="flex gap-3">
              {(['published', 'hidden', 'draft'] as const).map((st) => (
                <label key={st} className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer capitalize">
                  <input
                    type="radio"
                    name="status"
                    value={st}
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="accent-emerald-500"
                  />
                  {st}
                </label>
              ))}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-700/80">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 rounded-xl border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl flex items-center gap-1.5 shadow-md"
            >
              <Check size={16} /> {editingId ? 'Update Personality' : 'Save Personality'}
            </button>
          </div>
        </form>
      )}

      {/* List View */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-800/80 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-bold text-xs text-slate-300">
            All Personalities ({personalities.length})
          </h3>
        </div>

        {personalities.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500 italic">
            No spiritual personalities added yet. Click 'Add Personality' above to create one.
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {personalities.map((item) => (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-800/40 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <img
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800'}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-sm text-white truncate text-right font-serif">
                        {item.name}
                      </h4>
                      {item.title && (
                        <span className="text-[10px] bg-emerald-950/80 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-serif">
                          {item.title}
                        </span>
                      )}
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          item.status === 'published'
                            ? 'bg-emerald-900/60 text-emerald-300'
                            : item.status === 'hidden'
                            ? 'bg-amber-900/60 text-amber-300'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 text-right leading-relaxed font-serif">
                      {item.bio}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[10px] text-slate-400">
                      <span>🖼️ {item.images?.length || 0} Images</span>
                      {item.audioUrl && <span className="text-amber-400 font-mono">🎵 Audio</span>}
                      {item.videoUrl && <span className="text-red-400 font-mono">🎬 Video</span>}
                      {item.pdfUrl && <span className="text-blue-400 font-mono">📄 PDF</span>}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 align-self-end sm:align-self-center">
                  <button
                    onClick={() => onToggleHide(item.id)}
                    className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1 transition-all ${
                      item.status === 'hidden'
                        ? 'bg-amber-950/40 border-amber-800 text-amber-400 hover:bg-amber-900/60'
                        : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                    }`}
                    title={item.status === 'hidden' ? 'Unhide Personality' : 'Hide Personality'}
                  >
                    {item.status === 'hidden' ? <EyeOff size={14} /> : <Eye size={14} />}
                    <span className="hidden md:inline">{item.status === 'hidden' ? 'Hidden' : 'Hide'}</span>
                  </button>

                  <button
                    onClick={() => handleEditInit(item)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold flex items-center gap-1"
                    title="Edit Personality"
                  >
                    <Edit2 size={14} />
                    <span className="hidden md:inline">Edit</span>
                  </button>

                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="p-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-900/50 text-xs font-bold flex items-center gap-1 transition-all"
                    title="Delete Personality"
                  >
                    <Trash2 size={14} />
                    <span className="hidden md:inline">Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Spiritual Personality (حذفِ شخصیت)"
        message={`Are you sure you want to delete "${deleteTarget?.nameUrdu || deleteTarget?.name || 'this personality'}"? This will permanently delete the entry from Firestore.`}
        onConfirm={() => {
          if (deleteTarget) {
            if (editingId === deleteTarget.id) {
              resetForm();
            }
            onDelete(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
