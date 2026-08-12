import React, { useState } from 'react';
import { Share as CapacitorShare } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { 
  Share2, 
  Sparkles, 
  Moon, 
  Sun, 
  Sunset, 
  Sunrise, 
  Phone, 
  Loader2, 
  X,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { PrayerTimings, HadeesItem } from '../types';
import { dailyHadeesCollection } from '../data';
import { generatePrayerCardCanvasJPEG } from '../lib/prayerCardCanvasGenerator';

export interface ShareCardProps {
  isUr: boolean;
  cityName: string;
  gregorianDate?: string;
  hijriDate?: string;
  timings?: PrayerTimings | null;
  hadith?: HadeesItem | null;
  appName?: string;
  contactNumber?: string;
  buttonClassName?: string;
}

interface PrayerCardContentProps {
  isUr: boolean;
  cityName: string;
  todayFormatted: string;
  displayHijri: string;
  appName: string;
  contactNumber: string;
  sehriTime: string;
  iftarTime: string;
  activeTimings: PrayerTimings;
  activeHadith: HadeesItem;
}

/**
 * Unified Prayer Card Inner Component
 * Renders cleanly in Preview Modal.
 * Designed with explicit inline colors & exact typographic constraints matching output JPEG.
 */
const PrayerCardContent: React.FC<PrayerCardContentProps> = ({
  isUr,
  cityName,
  todayFormatted,
  displayHijri,
  appName,
  contactNumber,
  sehriTime,
  iftarTime,
  activeTimings,
  activeHadith
}) => {
  return (
    <div 
      className="p-6 rounded-3xl border-2 shadow-2xl space-y-4 text-left relative overflow-hidden"
      style={{ 
        width: '600px', 
        boxSizing: 'border-box',
        background: 'radial-gradient(ellipse at top, #064e3b 0%, #022c22 60%, #020617 100%)',
        borderColor: '#f59e0b',
        color: '#ffffff',
        fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}
    >
      {/* Main Content Area */}
      <div className="space-y-4">
        
        {/* Header Section: Organization Branding */}
        <div 
          className="rounded-2xl p-4 text-center space-y-2 shadow-md border relative z-10"
          style={{ backgroundColor: '#022c22', borderColor: '#f59e0b' }}
        >
          <div className="flex items-center justify-center gap-2 px-2">
            <Sparkles size={20} style={{ color: '#f59e0b' }} className="shrink-0" />
            <h2 
              className="font-nastaliq text-2xl sm:text-3xl font-bold text-center leading-normal whitespace-normal break-words px-1" 
              dir="rtl" 
              style={{ color: '#f59e0b', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
            >
              حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ
            </h2>
            <Sparkles size={20} style={{ color: '#f59e0b' }} className="shrink-0" />
          </div>
          <p 
            className="font-english text-xs sm:text-sm font-extrabold tracking-widest uppercase text-center whitespace-normal break-words px-2" 
            style={{ color: '#a7f3d0', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            Halqa E Usmania Muhammadia Rasheedia Qadeeriya
          </p>
        </div>

        {/* City Name Header */}
        <div className="text-center pt-1 pb-1">
          <h1 
            className="font-black text-4xl sm:text-5xl text-center tracking-wider" 
            style={{ color: '#f59e0b', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            {cityName}
          </h1>
        </div>

        {/* Gregorian & Hijri Date Badge */}
        <div 
          className="flex items-center justify-center gap-3 text-sm py-2 px-5 rounded-xl border w-fit mx-auto shadow-sm" 
          style={{ backgroundColor: '#064e3b', borderColor: '#047857' }}
        >
          <span 
            className="font-bold text-white text-sm" 
            style={{ color: '#ffffff', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            {todayFormatted}
          </span>
          <span className="font-black" style={{ color: '#f59e0b' }}>•</span>
          <span 
            className="font-nastaliq font-bold text-base" 
            style={{ color: '#f59e0b', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
          >
            {displayHijri}
          </span>
        </div>

        {/* Sehri & Iftar Banner */}
        <div className="grid grid-cols-2 gap-3.5">
          {/* Sehri Box */}
          <div 
            className="p-3.5 rounded-2xl flex items-center justify-between border shadow-md" 
            style={{ backgroundColor: '#0f172a', borderColor: '#f59e0b' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl border shrink-0" 
                style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b' }}
              >
                <Moon size={22} />
              </div>
              <div>
                <span 
                  className="text-sm font-bold block leading-tight" 
                  style={{ color: '#f59e0b', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                >
                  {isUr ? 'سحری (ختم)' : 'Sehri Time'}
                </span>
                <span 
                  className="text-xs font-medium" 
                  style={{ color: '#cbd5e1', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  {isUr ? 'امساک / فجر' : 'Imsak / Fajr'}
                </span>
              </div>
            </div>
            <span 
              className="font-mono text-xl font-black px-3.5 py-1.5 rounded-xl border shrink-0 shadow-inner" 
              style={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#f59e0b' }}
            >
              {sehriTime}
            </span>
          </div>

          {/* Iftar Box */}
          <div 
            className="p-3.5 rounded-2xl flex items-center justify-between border shadow-md" 
            style={{ backgroundColor: '#0f172a', borderColor: '#10b981' }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="p-2.5 rounded-xl border shrink-0" 
                style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)', borderColor: 'rgba(16, 185, 129, 0.4)', color: '#6ee7b7' }}
              >
                <Sunset size={22} />
              </div>
              <div>
                <span 
                  className="text-sm font-bold block leading-tight" 
                  style={{ color: '#6ee7b7', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
                >
                  {isUr ? 'افطار (مغرب)' : 'Iftar Time'}
                </span>
                <span 
                  className="text-xs font-medium" 
                  style={{ color: '#a7f3d0', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
                >
                  {isUr ? 'غروبِ آفتاب' : 'Sunset'}
                </span>
              </div>
            </div>
            <span 
              className="font-mono text-xl font-black px-3.5 py-1.5 rounded-xl border shrink-0 shadow-inner" 
              style={{ backgroundColor: '#020617', borderColor: '#1e293b', color: '#6ee7b7' }}
            >
              {iftarTime}
            </span>
          </div>
        </div>

        {/* The 5 Prayer Times Grid */}
        <div 
          className="space-y-2 p-4 rounded-2xl border shadow-md" 
          style={{ backgroundColor: '#0f172a', borderColor: '#047857' }}
        >
          <div 
            className="text-xs font-bold uppercase tracking-widest pb-2 border-b flex justify-between" 
            style={{ color: '#f59e0b', borderColor: '#065f46', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            <span>{isUr ? 'نماز' : 'PRAYER'}</span>
            <span>{isUr ? 'وقت' : 'TIME'}</span>
          </div>

          {[
            { label: 'Fajr', labelUrdu: 'فجر', time: activeTimings.Fajr, icon: Sunrise },
            { label: 'Dhuhr', labelUrdu: 'ظہر', time: activeTimings.Dhuhr, icon: Sun },
            { label: 'Asr', labelUrdu: 'عصر', time: activeTimings.Asr, icon: Sun },
            { label: 'Maghrib', labelUrdu: 'مغرب', time: activeTimings.Maghrib, icon: Sunset },
            { label: 'Isha', labelUrdu: 'عشاء', time: activeTimings.Isha, icon: Moon }
          ].map((p) => {
            const Icon = p.icon;
            return (
              <div 
                key={p.label}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl border shadow-sm"
                style={{ backgroundColor: '#ffffff', color: '#020617', borderColor: '#e2e8f0' }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="p-1.5 rounded-lg shrink-0" 
                    style={{ backgroundColor: '#d1fae5', color: '#065f46' }}
                  >
                    <Icon size={18} />
                  </div>
                  <span 
                    className="text-lg font-bold" 
                    style={{ 
                      color: '#020617', 
                      fontFamily: isUr ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Plus Jakarta Sans', system-ui, sans-serif" 
                    }}
                  >
                    {isUr ? p.labelUrdu : p.label}
                  </span>
                </div>
                <span 
                  className="font-mono text-xl font-black" 
                  style={{ color: '#020617' }}
                >
                  {p.time}
                </span>
              </div>
            );
          })}
        </div>

        {/* Daily Hadith Box */}
        <div 
          className="border-2 p-4.5 rounded-2xl space-y-3 shadow-md" 
          style={{ backgroundColor: '#022c22', borderColor: '#059669', color: '#ecfdf5' }}
        >
          <div 
            className="flex items-center justify-between text-xs font-bold border-b pb-2" 
            style={{ color: '#f59e0b', borderColor: '#065f46' }}
          >
            <span className="flex items-center gap-1.5">
              <Sparkles size={15} style={{ color: '#f59e0b' }} />
              <span 
                className="text-sm font-bold" 
                style={{ fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif", color: '#f59e0b' }}
              >
                {isUr ? 'حدیثِ مبارکہ' : 'Daily Hadith'}
              </span>
            </span>
            <span 
              className="font-bold text-xs" 
              style={{ color: '#6ee7b7', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
            >
              {activeHadith.book}
            </span>
          </div>

          {/* Arabic Text in Muhammadi Quranic / Amiri font */}
          {activeHadith.arabicText && (
            <p 
              className="text-2xl sm:text-3xl font-bold text-center leading-loose py-2 tracking-normal whitespace-normal break-words px-2" 
              dir="rtl" 
              style={{ color: '#f59e0b', fontFamily: "'Muhammadi Quranic', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif" }}
            >
              {activeHadith.arabicText}
            </p>
          )}

          {/* Urdu/English Translation in Noori Nastaleeq font */}
          <p 
            className="text-lg text-center leading-relaxed font-medium whitespace-normal break-words px-2" 
            style={{ 
              color: '#ecfdf5', 
              fontFamily: isUr ? "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" : "'Plus Jakarta Sans', system-ui, sans-serif" 
            }}
          >
            "{isUr ? activeHadith.textUrdu : activeHadith.text}"
          </p>

          <div 
            className="text-xs font-bold text-right pt-1 border-t" 
            style={{ color: '#f59e0b', borderColor: '#065f46', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
          >
            — {activeHadith.reference}
          </div>
        </div>

        {/* Card Footer: Contact Info & Organization Branding */}
        <div 
          className="pt-2 border-t flex items-center justify-between text-xs" 
          style={{ borderColor: '#065f46' }}
        >
          <div className="flex items-center gap-1.5">
            <Phone size={15} style={{ color: '#f59e0b' }} className="shrink-0" />
            <span 
              className="font-mono font-black text-sm" 
              style={{ color: '#f59e0b' }}
            >
              {contactNumber}
            </span>
          </div>
          <span 
            className="text-sm font-bold" 
            style={{ color: '#a7f3d0', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
          >
            حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ
          </span>
        </div>

      </div>
    </div>
  );
};

export const ShareCard: React.FC<ShareCardProps> = ({
  isUr,
  cityName,
  gregorianDate,
  hijriDate,
  timings,
  hadith,
  appName = 'حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ',
  contactNumber = '+92 311 4992292',
  buttonClassName = ''
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);

  // Fallback default values
  const defaultTimings: PrayerTimings = {
    Fajr: '04:15',
    Sunrise: '05:45',
    Dhuhr: '12:20',
    Asr: '15:45',
    Sunset: '19:10',
    Maghrib: '19:10',
    Isha: '20:45',
    Imsak: '04:05',
    Midnight: '00:15',
    Firstthird: '22:30',
    Lastthird: '02:00'
  };

  const activeTimings = timings || defaultTimings;
  const activeHadith = hadith || dailyHadeesCollection[0];

  // Format today's Gregorian Date
  const todayFormatted = gregorianDate || new Date().toLocaleDateString(isUr ? 'ur-PK' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const displayHijri = hijriDate || '19 Safar 1448 AH';

  const sehriTime = activeTimings.Imsak || activeTimings.Fajr;
  const iftarTime = activeTimings.Maghrib;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Perform Native Share / Web Share / File Share via Direct HTML5 Canvas Generator
  const handleShare = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const result = await generatePrayerCardCanvasJPEG({
        isUr,
        cityName,
        todayFormatted,
        displayHijri,
        appName,
        contactNumber,
        sehriTime,
        iftarTime,
        activeTimings,
        activeHadith
      });

      if (!result) {
        showToast(isUr ? 'کارڈ تیار کرنے میں خطاء ہوئی۔ دوبارہ کوشش کریں۔' : 'Failed to generate card image.');
        setIsGenerating(false);
        return;
      }

      const { blob, dataUrl } = result;
      const fileName = `Prayer_Times_${cityName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.jpg`;
      const file = new File([blob], fileName, { type: 'image/jpeg' });

      // Check if running in Capacitor Native Environment
      const isCapacitorNative = typeof (window as any) !== 'undefined' && (window as any).Capacitor?.isNativePlatform();

      if (isCapacitorNative) {
        try {
          // Write JPEG file to Cache directory using Capacitor Filesystem
          const base64Data = dataUrl.split(',')[1];
          const savedFile = await Filesystem.writeFile({
            path: fileName,
            data: base64Data,
            directory: Directory.Cache
          });

          // Open Native Share Sheet (WhatsApp, etc.)
          await CapacitorShare.share({
            title: isUr ? `اوقاتِ نماز - ${cityName}` : `Prayer Times - ${cityName}`,
            text: isUr 
              ? `آج کے اوقاتِ نماز و حدیثِ مبارکہ (${cityName})\n${appName} - رابطہ: ${contactNumber}`
              : `Today's Prayer Times & Hadith for ${cityName}\n${appName} - Contact: ${contactNumber}`,
            files: [savedFile.uri]
          });

          showToast(isUr ? 'کامیابی سے شئیر کر دیا گیا!' : 'Shared successfully!');
          setIsGenerating(false);
          return;
        } catch (capErr) {
          console.warn('Capacitor native share failed, falling back to Web Share API', capErr);
        }
      }

      // Check if Web Share API with file attachments is supported by browser
      if (typeof navigator !== 'undefined' && navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            title: isUr ? `اوقاتِ نماز - ${cityName}` : `Prayer Times - ${cityName}`,
            text: isUr 
              ? `آج کے اوقاتِ نماز و حدیثِ مبارکہ (${cityName})\n${appName} - رابطہ: ${contactNumber}`
              : `Today's Prayer Times & Hadith for ${cityName}\n${appName} - Contact: ${contactNumber}`,
            files: [file]
          });
          showToast(isUr ? 'کامیابی سے شئیر کر دیا گیا!' : 'Shared successfully!');
        } catch (shareErr: any) {
          if (shareErr.name !== 'AbortError') {
            console.warn('Web Share aborted or failed, downloading JPEG file', shareErr);
            triggerFallbackDownload(blob, fileName);
          }
        }
      } else {
        // Fallback: Download JPEG & notify user
        triggerFallbackDownload(blob, fileName);
      }
    } catch (error) {
      console.error('Share action error:', error);
      showToast(isUr ? 'شئیرنگ کے دوران دشواری پیش آئی' : 'An error occurred while sharing');
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerFallbackDownload = (blob: Blob, fileName: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(
      isUr 
        ? 'تصویر (JPEG) ڈاؤن لوڈ ہو گئی ہے! واٹس ایپ یا سوشل میڈیا پر منسلک کر کے شئیر فرمائیں۔' 
        : 'Prayer Times Card downloaded (JPEG)! Open WhatsApp to share.'
    );
  };

  return (
    <>
      {/* Trigger Buttons: Share Card & Preview */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleShare}
          disabled={isGenerating}
          className={
            buttonClassName ||
            "px-3 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 shrink-0 border border-amber-300/60"
          }
          title={isUr ? 'نماز کارڈ واٹس ایپ و سوشل میڈیا پر شئیر کریں' : 'Share Prayer Times Card'}
        >
          {isGenerating ? (
            <Loader2 size={14} className="animate-spin text-slate-950" />
          ) : (
            <Share2 size={14} className="text-slate-950" />
          )}
          <span>
            {isGenerating
              ? (isUr ? 'کارڈ تیار ہو رہا ہے...' : 'Generating Card...')
              : (isUr ? 'شئیر نماز کارڈ 📤' : 'Share Prayer Card 📤')}
          </span>
        </button>

        <button
          onClick={() => setShowPreviewModal(true)}
          className="p-1.5 bg-emerald-900/80 hover:bg-emerald-800 text-amber-300 border border-emerald-600/60 rounded-xl transition-colors shrink-0"
          title={isUr ? 'کارڈ دیکھیں' : 'Preview Card'}
        >
          <Eye size={15} />
        </button>
      </div>

      {/* PREVIEW MODAL */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-emerald-600/60 rounded-3xl max-w-2xl w-full p-4 sm:p-5 space-y-4 shadow-2xl relative my-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-amber-300">
                <Sparkles size={18} />
                <h3 className="font-serif font-bold text-base">
                  {isUr ? 'اوقاتِ نماز کارڈ پیش منظر' : 'Prayer Times Share Card Preview'}
                </h3>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Card Container */}
            <div className="flex justify-center overflow-x-auto p-1 max-h-[75vh]">
              <PrayerCardContent
                isUr={isUr}
                cityName={cityName}
                todayFormatted={todayFormatted}
                displayHijri={displayHijri}
                appName={appName}
                contactNumber={contactNumber}
                sehriTime={sehriTime}
                iftarTime={iftarTime}
                activeTimings={activeTimings}
                activeHadith={activeHadith}
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={handleShare}
                disabled={isGenerating}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shadow-md"
              >
                {isGenerating ? <Loader2 size={15} className="animate-spin" /> : <Share2 size={15} />}
                <span>{isUr ? 'واٹس ایپ پر شئیر کریں (JPEG)' : 'Share via WhatsApp (JPEG)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 border border-amber-500/50 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold z-50 flex items-center gap-2 max-w-sm text-center animate-fade-in">
          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </>
  );
};
