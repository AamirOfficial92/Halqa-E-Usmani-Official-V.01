import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
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
 * Renders identically in both Preview Modal and html2canvas Image Capture.
 * Designed with explicit inline colors & exact typographic constraints for 100% html2canvas fidelity.
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
          className="rounded-2xl p-3 text-center space-y-1.5 shadow-md border"
          style={{ backgroundColor: '#022c22', borderColor: '#f59e0b' }}
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles size={18} style={{ color: '#f59e0b' }} className="shrink-0" />
            <h2 
              className="font-nastaliq text-xl sm:text-2xl font-bold text-center leading-tight" 
              dir="rtl" 
              style={{ color: '#f59e0b', fontFamily: "'Jameel Noori Nastaleeq', 'Noto Nastaliq Urdu', serif" }}
            >
              حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ
            </h2>
            <Sparkles size={18} style={{ color: '#f59e0b' }} className="shrink-0" />
          </div>
          <p 
            className="font-english text-xs font-bold tracking-widest uppercase text-center" 
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
              className="text-2xl sm:text-3xl font-bold text-center leading-loose py-2 tracking-normal" 
              dir="rtl" 
              style={{ color: '#f59e0b', fontFamily: "'Muhammadi Quranic', 'Amiri', 'Scheherazade New', 'Noto Naskh Arabic', serif" }}
            >
              {activeHadith.arabicText}
            </p>
          )}

          {/* Urdu/English Translation in Noori Nastaleeq font */}
          <p 
            className="text-lg text-center leading-relaxed font-medium" 
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
  const cardRef = useRef<HTMLDivElement>(null);
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

  // Helper to convert oklab CSS color values mathematically to standard rgb/rgba
  const oklabToRgb = (oklabStr: string): string => {
    try {
      const match = oklabStr.match(/oklab\s*\(\s*([^)]+)\s*\)/i);
      if (!match) return '#10b981';

      const content = match[1].trim();
      const slashParts = content.split('/');
      const colorPart = slashParts[0].trim().replace(/,/g, ' ');
      const alphaPart = slashParts[1] ? slashParts[1].trim() : null;

      const parts = colorPart.split(/\s+/).filter(Boolean);
      if (parts.length < 3) return '#10b981';

      let L_val = parts[0];
      let a_val = parts[1];
      let b_val = parts[2];

      let L = L_val.endsWith('%') ? parseFloat(L_val) / 100 : parseFloat(L_val);
      let a = a_val.endsWith('%') ? (parseFloat(a_val) / 100) * 0.4 : parseFloat(a_val);
      let b = b_val.endsWith('%') ? (parseFloat(b_val) / 100) * 0.4 : parseFloat(b_val);

      if (isNaN(L)) L = 0.5;
      if (isNaN(a)) a = 0;
      if (isNaN(b)) b = 0;

      let alpha = 1;
      if (alphaPart) {
        alpha = alphaPart.endsWith('%') ? parseFloat(alphaPart) / 100 : parseFloat(alphaPart);
        if (isNaN(alpha)) alpha = 1;
      } else if (parts[3]) {
        alpha = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
        if (isNaN(alpha)) alpha = 1;
      }

      // Convert OKLAB to Linear RGB
      const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
      const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
      const s_ = L - 0.0894841775 * a - 1.2914855480 * b;

      const l = l_ ** 3;
      const m = m_ ** 3;
      const s = s_ ** 3;

      const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      const transfer = (c: number) =>
        c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;

      const r = Math.min(255, Math.max(0, Math.round(transfer(r_lin) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(transfer(g_lin) * 255)));
      const blue = Math.min(255, Math.max(0, Math.round(transfer(b_lin) * 255)));

      if (alpha < 1) {
        return `rgba(${r}, ${g}, ${blue}, ${alpha.toFixed(3)})`;
      }
      return `rgb(${r}, ${g}, ${blue})`;
    } catch (err) {
      return '#10b981';
    }
  };

  // Helper to convert oklch CSS color values mathematically to standard rgb/rgba
  const oklchToRgb = (oklchStr: string): string => {
    try {
      const match = oklchStr.match(/oklch\s*\(\s*([^)]+)\s*\)/i);
      if (!match) return '#10b981';

      const content = match[1].trim();
      const slashParts = content.split('/');
      const colorPart = slashParts[0].trim().replace(/,/g, ' ');
      const alphaPart = slashParts[1] ? slashParts[1].trim() : null;

      const parts = colorPart.split(/\s+/).filter(Boolean);
      if (parts.length < 3) return '#10b981';

      let L_val = parts[0];
      let C_val = parts[1];
      let H_val = parts[2];

      let L = L_val.endsWith('%') ? parseFloat(L_val) / 100 : parseFloat(L_val);
      let C = C_val === 'none' ? 0 : (C_val.endsWith('%') ? (parseFloat(C_val) / 100) * 0.4 : parseFloat(C_val));
      let H = H_val === 'none' ? 0 : parseFloat(H_val);

      if (isNaN(L)) L = 0.5;
      if (isNaN(C)) C = 0;
      if (isNaN(H)) H = 0;

      let alpha = 1;
      if (alphaPart) {
        alpha = alphaPart.endsWith('%') ? parseFloat(alphaPart) / 100 : parseFloat(alphaPart);
        if (isNaN(alpha)) alpha = 1;
      } else if (parts[3]) {
        alpha = parts[3].endsWith('%') ? parseFloat(parts[3]) / 100 : parseFloat(parts[3]);
        if (isNaN(alpha)) alpha = 1;
      }

      // Convert OKLCH to OKLAB
      const rad = (H * Math.PI) / 180;
      const lab_a = C * Math.cos(rad);
      const lab_b = C * Math.sin(rad);

      // Convert OKLAB to Linear RGB
      const l_ = L + 0.3963377774 * lab_a + 0.2158037573 * lab_b;
      const m_ = L - 0.1055613458 * lab_a - 0.0638541728 * lab_b;
      const s_ = L - 0.0894841775 * lab_a - 1.2914855480 * lab_b;

      const l = l_ ** 3;
      const m = m_ ** 3;
      const s = s_ ** 3;

      const r_lin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
      const g_lin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
      const b_lin = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s;

      const transfer = (c: number) =>
        c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(Math.max(0, c), 1 / 2.4) - 0.055;

      const r = Math.min(255, Math.max(0, Math.round(transfer(r_lin) * 255)));
      const g = Math.min(255, Math.max(0, Math.round(transfer(g_lin) * 255)));
      const blue = Math.min(255, Math.max(0, Math.round(transfer(b_lin) * 255)));

      if (alpha < 1) {
        return `rgba(${r}, ${g}, ${blue}, ${alpha.toFixed(3)})`;
      }
      return `rgb(${r}, ${g}, ${blue})`;
    } catch (err) {
      return '#10b981';
    }
  };

  // Replace unsupported CSS color functions (oklab, oklch, color(srgb...)) with rgb/rgba
  const replaceColorFunctions = (cssText: string): string => {
    if (!cssText) return cssText;
    
    let result = cssText;
    
    // Replace oklab(...)
    result = result.replace(/oklab\s*\([^)]+\)/gi, (match) => oklabToRgb(match));
    
    // Replace oklch(...)
    result = result.replace(/oklch\s*\([^)]+\)/gi, (match) => oklchToRgb(match));

    // Fallbacks for color(srgb ...)
    result = result.replace(/color\s*\(\s*srgb\s+[^)]+\)/gi, '#10b981');
      
    return result;
  };

  // Generate JPEG Blob and Data URI from the reference card element
  const generateCardImage = async (): Promise<{ blob: Blob; dataUrl: string } | null> => {
    if (!cardRef.current) return null;
    try {
      // Ensure all custom fonts are completely loaded before capturing
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }

      // Brief delay for font rendering pass
      await new Promise((resolve) => setTimeout(resolve, 150));

      const canvas = await html2canvas(cardRef.current, {
        scale: 2, // High resolution output
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#020617', // Deep Islamic background
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure cloned card root is 100% visible
          const clonedCardRoot = clonedDoc.getElementById('share-card-capture-root');
          if (clonedCardRoot) {
            clonedCardRoot.style.opacity = '1';
            clonedCardRoot.style.visibility = 'visible';
            if (clonedCardRoot.parentElement) {
              clonedCardRoot.parentElement.style.opacity = '1';
              clonedCardRoot.parentElement.style.visibility = 'visible';
            }
          }

          // 1. Proxy getComputedStyle on clonedDoc.defaultView to intercept any oklab/oklch queries
          if (clonedDoc.defaultView) {
            const origGetComputedStyle = clonedDoc.defaultView.getComputedStyle.bind(clonedDoc.defaultView);
            clonedDoc.defaultView.getComputedStyle = (elt: Element, pseudoElt?: string | null) => {
              const style = origGetComputedStyle(elt, pseudoElt);
              return new Proxy(style, {
                get(target, prop, receiver) {
                  if (prop === 'getPropertyValue') {
                    return (property: string) => {
                      const res = target.getPropertyValue(property);
                      if (typeof res === 'string' && /(oklab|oklch|color\()/i.test(res)) {
                        return replaceColorFunctions(res);
                      }
                      return res;
                    };
                  }
                  const val = Reflect.get(target, prop, receiver);
                  if (typeof val === 'string' && /(oklab|oklch|color\()/i.test(val)) {
                    return replaceColorFunctions(val);
                  }
                  if (typeof val === 'function') {
                    return val.bind(target);
                  }
                  return val;
                }
              });
            };
          }

          // 2. Process all <style> elements in clonedDoc and replace node so CSSStyleSheet rules are re-parsed
          const styleTags = Array.from(clonedDoc.getElementsByTagName('style'));
          styleTags.forEach((oldStyle) => {
            if (oldStyle.textContent) {
              const sanitizedText = replaceColorFunctions(oldStyle.textContent);
              const newStyle = clonedDoc.createElement('style');
              newStyle.textContent = sanitizedText;
              if (oldStyle.parentNode) {
                oldStyle.parentNode.replaceChild(newStyle, oldStyle);
              }
            }
          });

          // 3. Convert link stylesheets into inline style tags and replace oklch/oklab or strip if inaccessible
          const linkTags = Array.from(clonedDoc.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]'));
          linkTags.forEach((link) => {
            try {
              const sheet = link.sheet as CSSStyleSheet | null;
              if (sheet && sheet.cssRules) {
                const cssTexts: string[] = [];
                for (let i = 0; i < sheet.cssRules.length; i++) {
                  cssTexts.push(sheet.cssRules[i].cssText);
                }
                const sanitizedText = replaceColorFunctions(cssTexts.join('\n'));
                const newStyle = clonedDoc.createElement('style');
                newStyle.textContent = sanitizedText;
                if (link.parentNode) {
                  link.parentNode.replaceChild(newStyle, link);
                }
              } else {
                link.parentNode?.removeChild(link);
              }
            } catch (e) {
              link.parentNode?.removeChild(link);
            }
          });

          // 4. Inlining explicit sanitized computed styles from live DOM to cloned DOM
          if (cardRef.current) {
            const origCard = cardRef.current;
            if (clonedCardRoot) {
              const origElements = [origCard, ...Array.from(origCard.querySelectorAll<HTMLElement>('*'))];
              const cloneElements = [clonedCardRoot, ...Array.from(clonedCardRoot.querySelectorAll<HTMLElement>('*'))];

              const propsToInline = [
                'color',
                'backgroundColor',
                'borderColor',
                'borderTopColor',
                'borderRightColor',
                'borderBottomColor',
                'borderLeftColor',
                'boxShadow',
                'fill',
                'stroke',
                'outlineColor',
                'textDecorationColor'
              ];

              for (let i = 0; i < origElements.length && i < cloneElements.length; i++) {
                const origEl = origElements[i];
                const cloneEl = cloneElements[i];
                const computed = window.getComputedStyle(origEl);

                propsToInline.forEach((prop) => {
                  const val = (computed as any)[prop];
                  if (val && typeof val === 'string' && val !== 'none' && val !== 'transparent') {
                    if (/(oklab|oklch|color\()/i.test(val)) {
                      (cloneEl.style as any)[prop] = replaceColorFunctions(val);
                    } else if (!cloneEl.style.getPropertyValue(prop)) {
                      (cloneEl.style as any)[prop] = val;
                    }
                  }
                });
              }
            }
          }

          // 5. Sanitize any remaining inline style attributes on cloned elements
          const allElements = Array.from(clonedDoc.querySelectorAll<HTMLElement>('*'));
          allElements.forEach((el) => {
            if (el.style && el.style.cssText && /(oklch|oklab|color\()/i.test(el.style.cssText)) {
              el.style.cssText = replaceColorFunctions(el.style.cssText);
            }
          });
        }
      });

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve({ blob, dataUrl });
          } else {
            resolve(null);
          }
        }, 'image/jpeg', 0.95);
      });
    } catch (err) {
      console.error('html2canvas capture error:', err);
      return null;
    }
  };

  // Perform Native Share / Web Share / File Share
  const handleShare = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const result = await generateCardImage();
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
            triggerFallbackDownload(blob, fileName, dataUrl);
          }
        }
      } else {
        // Fallback: Download JPEG & notify user
        triggerFallbackDownload(blob, fileName, dataUrl);
      }
    } catch (error) {
      console.error('Share action error:', error);
      showToast(isUr ? 'شئیرنگ کے دوران دشواری پیش آئی' : 'An error occurred while sharing');
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerFallbackDownload = (blob: Blob, fileName: string, dataUrl: string) => {
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

      {/* OFF-SCREEN CAPTURE DIV FOR HTML2CANVAS */}
      <div 
        style={{
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '600px',
          overflow: 'hidden'
        }}
      >
        <div ref={cardRef} id="share-card-capture-root" style={{ width: '600px', backgroundColor: '#020617' }}>
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
      </div>

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
