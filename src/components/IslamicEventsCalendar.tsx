import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  Info, 
  Share2, 
  Copy, 
  Check, 
  Moon, 
  Sun, 
  Star, 
  X, 
  Grid, 
  List, 
  SlidersHorizontal,
  Bookmark,
  Bell,
  MessageCircle,
  ExternalLink,
  Send
} from 'lucide-react';
import { IslamicEvent } from '../types';
import { initialIslamicEvents } from '../data';

interface IslamicEventsCalendarProps {
  language: 'ur' | 'en';
  events?: IslamicEvent[];
  hijriAdjustment?: number;
  onSelectEvent?: (event: IslamicEvent) => void;
  className?: string;
}

// Names of Hijri Months
const HIJRI_MONTHS_EN = [
  'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
  'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', "Sha'ban",
  'Ramadan', 'Shawwal', 'Dhul Qa\'dah', 'Dhul Hijjah'
];

const HIJRI_MONTHS_UR = [
  'محرم الحرام', 'صفر المظفر', 'ربیع الاول', 'ربیع الثانی',
  'جمادی الاول', 'جمادی الثانی', 'رجب المرجب', 'شعبان المعظم',
  'رمضان المبارک', 'شوال المکرم', 'ذو القعدۃ', 'ذو الحجۃ'
];

// Gregorian Month Names
const GREG_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const GREG_MONTHS_UR = [
  'جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون',
  'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'
];

// Days of week
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_UR = ['اتوار', 'پیر', 'منگل', 'بدھ', 'جمعرات', 'جمعہ', 'ہفتہ'];

// Helper to calculate approximate Hijri date from Gregorian date
export function getApproxHijriDate(gregorianDate: Date, adjustmentDays: number = 0): {
  day: number;
  month: number; // 1-12
  year: number;
  monthNameEn: string;
  monthNameUr: string;
} {
  // Apply moon adjustment offset
  const adjDate = new Date(gregorianDate);
  adjDate.setDate(adjDate.getDate() + adjustmentDays);

  // Ku-Piet / Julian Day calculation for Hijri conversion
  const day = adjDate.getDate();
  const month = adjDate.getMonth();
  const year = adjDate.getFullYear();

  let m = month + 1;
  let y = year;
  if (m < 3) {
    y -= 1;
    m += 12;
  }

  const a = Math.floor(y / 100);
  const b = 2 - a + Math.floor(a / 4);
  const jd = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;

  const islamicEpoch = 1948439.5;
  const daysSinceEpoch = jd - islamicEpoch;
  const cycle = Math.floor(daysSinceEpoch / 10631);
  const remainingDays = daysSinceEpoch - cycle * 10631;

  const yearInCycle = Math.min(29, Math.floor((remainingDays - 0.1388) / 354.366));
  const hijriYear = Math.floor(cycle * 30 + yearInCycle + 1);

  const dayOfYear = remainingDays - Math.floor(yearInCycle * 354.366 + 0.1388);
  const hijriMonth = Math.min(11, Math.floor((dayOfYear + 0.5) / 29.5));
  const hijriDay = Math.floor(dayOfYear - Math.floor(hijriMonth * 29.5) + 1);

  const monthIdx = Math.max(0, Math.min(11, hijriMonth));

  return {
    day: Math.max(1, Math.min(30, hijriDay)),
    month: monthIdx + 1,
    year: hijriYear,
    monthNameEn: HIJRI_MONTHS_EN[monthIdx] || 'Hijri',
    monthNameUr: HIJRI_MONTHS_UR[monthIdx] || 'ہجری'
  };
}

export const IslamicEventsCalendar: React.FC<IslamicEventsCalendarProps> = ({
  language,
  events = initialIslamicEvents,
  hijriAdjustment: initialAdjustment = 0,
  onSelectEvent,
  className = ''
}) => {
  const isUr = language === 'ur';

  // State
  const today = new Date();
  const [currentDate, setCurrentDate] = useState<Date>(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(today.getDate());
  const [selectedEvent, setSelectedEvent] = useState<IslamicEvent | null>(null);
  const [hijriOffset, setHijriOffset] = useState<number>(initialAdjustment);
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'eid' | 'holy_night' | 'fasting' | 'historical'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0 - 11

  // Handle Month Navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDayNum(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDayNum(null);
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentDate(new Date(now.getFullYear(), now.getMonth(), 1));
    setSelectedDayNum(now.getDate());
  };

  // Days in month calculation
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay(); // 0 = Sun, 1 = Mon...

  // Map calendar days with Hijri dates and events
  const calendarDays = useMemo(() => {
    const daysArr = [];

    // Padding empty cells for days before the 1st
    for (let i = 0; i < firstDayOfWeek; i++) {
      daysArr.push({ isPadding: true, key: `pad-${i}` });
    }

    // Actual days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const gDate = new Date(currentYear, currentMonth, d);
      const hDate = getApproxHijriDate(gDate, hijriOffset);
      const isToday = 
        d === today.getDate() && 
        currentMonth === today.getMonth() && 
        currentYear === today.getFullYear();
      
      const dayOfWeek = gDate.getDay();
      const isFriday = dayOfWeek === 5; // Jumu'ah

      // Find events that fall on this Hijri Day & Month
      const dayEvents = events.filter(evt => {
        const matchesDate = evt.hijriMonth === hDate.month && evt.hijriDay === hDate.day;
        if (!matchesDate) return false;
        if (categoryFilter === 'all') return true;
        return evt.category === categoryFilter;
      });

      // Special Sunnah Fasting Days (Ayyam al-Beed - 13, 14, 15 of Hijri month)
      const isAyyamAlBeed = hDate.day === 13 || hDate.day === 14 || hDate.day === 15;

      daysArr.push({
        isPadding: false,
        dayNum: d,
        gregorianDate: gDate,
        hijriDate: hDate,
        isToday,
        isFriday,
        isAyyamAlBeed,
        events: dayEvents,
        key: `day-${d}`
      });
    }

    return daysArr;
  }, [currentYear, currentMonth, daysInMonth, firstDayOfWeek, hijriOffset, events, categoryFilter, today]);

  // Currently selected day details
  const selectedDayInfo = useMemo(() => {
    if (!selectedDayNum) return null;
    const gDate = new Date(currentYear, currentMonth, selectedDayNum);
    const hDate = getApproxHijriDate(gDate, hijriOffset);
    const dayEvents = events.filter(evt => evt.hijriMonth === hDate.month && evt.hijriDay === hDate.day);
    return {
      dayNum: selectedDayNum,
      gregorianDate: gDate,
      hijriDate: hDate,
      events: dayEvents
    };
  }, [selectedDayNum, currentYear, currentMonth, hijriOffset, events]);

  // Filtered event list for List View
  const listEvents = useMemo(() => {
    return events.filter(evt => {
      if (categoryFilter !== 'all' && evt.category !== categoryFilter) return false;
      return true;
    });
  }, [events, categoryFilter]);

  // Format event text for sharing
  const getEventShareText = (evt: IslamicEvent) => {
    const monthUr = HIJRI_MONTHS_UR[evt.hijriMonth - 1] || '';
    const monthEn = HIJRI_MONTHS_EN[evt.hijriMonth - 1] || '';
    return `🌙 *${evt.titleUrdu}*\n${evt.title}\n\n📅 Hijri Date: ${evt.hijriDay} ${monthUr} (${monthEn})\n\n${evt.descriptionUrdu}\n\n${evt.description}\n\n✨ Shared via Islamic Utilities App`;
  };

  // Native Web Share API with fallback to WhatsApp
  const handleShareEvent = async (evt: IslamicEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareText = getEventShareText(evt);
    const shareTitle = evt.titleUrdu || evt.title;
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Fallback if Native Share fails or isn't supported
    handleWhatsAppShare(evt, e);
  };

  // Direct WhatsApp Share
  const handleWhatsAppShare = (evt: IslamicEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = getEventShareText(evt);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Copy Event details
  const handleCopyEventDetails = (evt: IslamicEvent, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const text = getEventShareText(evt);
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const getCategoryBadge = (cat: IslamicEvent['category']) => {
    switch (cat) {
      case 'eid':
        return {
          bg: 'bg-amber-500/20 dark:bg-amber-500/30 text-amber-800 dark:text-amber-200 border-amber-500/40',
          dot: 'bg-amber-500',
          labelEn: 'Eid / Festival',
          labelUr: 'عید و اسلامی تہوار'
        };
      case 'holy_night':
        return {
          bg: 'bg-emerald-500/20 dark:bg-emerald-500/30 text-emerald-800 dark:text-emerald-200 border-emerald-500/40',
          dot: 'bg-emerald-500',
          labelEn: 'Blessed Night',
          labelUr: 'مبارک و متبرک رات'
        };
      case 'fasting':
        return {
          bg: 'bg-cyan-500/20 dark:bg-cyan-500/30 text-cyan-800 dark:text-cyan-200 border-cyan-500/40',
          dot: 'bg-cyan-500',
          labelEn: 'Sunnah Fasting',
          labelUr: 'مسنون روزہ / عبادات'
        };
      case 'historical':
      default:
        return {
          bg: 'bg-purple-500/20 dark:bg-purple-500/30 text-purple-800 dark:text-purple-200 border-purple-500/40',
          dot: 'bg-purple-500',
          labelEn: 'Historical Event',
          labelUr: 'تاریخی واقعہ و شہادت'
        };
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden text-slate-800 dark:text-slate-100 ${className}`}>
      
      {/* 1. Header Toolbar */}
      <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-4 space-y-3">
        
        {/* Top Title & View Switches */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-800/60 border border-emerald-600/50 rounded-xl text-amber-300">
              <CalendarIcon size={20} />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg leading-tight flex items-center gap-1.5">
                <span>{isUr ? 'اسلامی تقویم و اہم ایام' : 'Islamic Events Calendar'}</span>
                <span className="text-[10px] font-mono bg-amber-400 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  {currentYear}
                </span>
              </h3>
              <p className="text-[11px] text-emerald-200/80 font-serif">
                {isUr ? 'ہجری اور عیسوی تقویم، اہم اسلامی واقعات و برکات' : 'Dual Hijri & Gregorian monthly grid with interactive event markers'}
              </p>
            </div>
          </div>

          {/* View Mode & Today Quick Jump */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'grid' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <Grid size={14} />
              <span className="text-[10px] hidden sm:inline">{isUr ? 'گرڈ' : 'Grid'}</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'list' 
                  ? 'bg-emerald-600 text-white shadow-xs' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List size={14} />
              <span className="text-[10px] hidden sm:inline">{isUr ? 'فہرست' : 'List'}</span>
            </button>

            <button
              onClick={handleGoToday}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-lg transition-colors shadow-xs ml-1"
            >
              {isUr ? 'آج' : 'Today'}
            </button>
          </div>
        </div>

        {/* Month Selector Bar & Moon Adjustment */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-emerald-800/60">
          
          {/* Month Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-300 transition-colors"
              title="Previous Month"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="text-center min-w-[140px] sm:min-w-[170px]">
              <span className="font-serif font-bold text-sm sm:text-base text-white block leading-tight">
                {isUr ? GREG_MONTHS_UR[currentMonth] : GREG_MONTHS_EN[currentMonth]} {currentYear}
              </span>
              <span className="text-[10px] text-amber-300 font-mono block">
                {getApproxHijriDate(new Date(currentYear, currentMonth, 15), hijriOffset).monthNameUr} / {getApproxHijriDate(new Date(currentYear, currentMonth, 15), hijriOffset).monthNameEn}
              </span>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-emerald-300 transition-colors"
              title="Next Month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Moon Sighting Offset Adjuster */}
          <div className="flex items-center gap-1.5 text-xs bg-slate-950/70 px-2.5 py-1.5 rounded-xl border border-slate-800">
            <Moon size={13} className="text-amber-300 shrink-0" />
            <span className="text-[10px] text-slate-300 whitespace-nowrap">
              {isUr ? 'چاند ایڈجسٹمنٹ:' : 'Moon Offset:'}
            </span>
            <div className="flex items-center gap-1">
              {[-2, -1, 0, 1, 2].map(adj => (
                <button
                  key={adj}
                  onClick={() => setHijriOffset(adj)}
                  className={`w-5 h-5 rounded text-[10px] font-mono font-bold transition-all ${
                    hijriOffset === adj 
                      ? 'bg-amber-400 text-slate-950 font-extrabold shadow-xs' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {adj > 0 ? `+${adj}` : adj}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Category Filters Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] scrollbar-none">
          {[
            { id: 'all', labelEn: 'All Events', labelUr: 'تمام ایام' },
            { id: 'eid', labelEn: 'Eids & Festivals', labelUr: 'اعیاد و مسرت' },
            { id: 'holy_night', labelEn: 'Blessed Nights', labelUr: 'مبارک راتیں' },
            { id: 'fasting', labelEn: 'Fasting Days', labelUr: 'ایامِ روزه' },
            { id: 'historical', labelEn: 'Historical & Shuhada', labelUr: 'تاریخی و شہداء' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                categoryFilter === cat.id
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-extrabold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {isUr ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Main View Content */}
      <div className="p-3">
        {viewMode === 'grid' ? (
          <div>
            {/* Days of Week Header */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              {(isUr ? DAYS_UR : DAYS_EN).map((dayName, idx) => (
                <div 
                  key={dayName} 
                  className={`py-1.5 rounded-lg text-[11px] font-serif ${idx === 5 ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-bold' : ''}`}
                >
                  {dayName}
                </div>
              ))}
            </div>

            {/* Monthly Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
              {calendarDays.map((item) => {
                if (item.isPadding) {
                  return (
                    <div 
                      key={item.key} 
                      className="min-h-[52px] sm:min-h-[70px] bg-slate-50/40 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200/50 dark:border-slate-800/40 opacity-30" 
                    />
                  );
                }

                const isSelected = selectedDayNum === item.dayNum;
                const hasEvents = item.events && item.events.length > 0;

                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedDayNum(item.dayNum!)}
                    className={`min-h-[56px] sm:min-h-[76px] p-1.5 rounded-xl border transition-all text-left flex flex-col justify-between relative group ${
                      isSelected 
                        ? 'ring-2 ring-amber-400 border-amber-400 bg-amber-500/10 dark:bg-amber-500/15 shadow-md z-10' 
                        : item.isToday
                        ? 'bg-emerald-500/15 dark:bg-emerald-500/20 border-emerald-500/50 shadow-xs'
                        : item.isFriday
                        ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200/60 dark:border-emerald-800/50 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40'
                        : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Gregorian Day Number & Today/Friday Badges */}
                    <div className="flex items-center justify-between w-full">
                      <span className={`font-mono font-bold text-xs sm:text-sm leading-none ${
                        item.isToday 
                          ? 'text-emerald-700 dark:text-emerald-300 bg-emerald-200 dark:bg-emerald-800 px-1.5 py-0.5 rounded-md' 
                          : 'text-slate-800 dark:text-slate-100'
                      }`}>
                        {item.dayNum}
                      </span>

                      {item.isFriday && (
                        <span className="text-[8px] font-serif font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-1 rounded border border-emerald-300/40" title="Jumu'ah Mubarak">
                          {isUr ? 'جمعہ' : 'Fri'}
                        </span>
                      )}
                    </div>

                    {/* Middle: Event Markers / Chips */}
                    <div className="my-1 space-y-0.5 w-full">
                      {hasEvents && item.events?.map((evt) => {
                        const style = getCategoryBadge(evt.category);
                        return (
                          <div
                            key={evt.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedDayNum(item.dayNum!);
                              setSelectedEvent(evt);
                              if (onSelectEvent) onSelectEvent(evt);
                            }}
                            className={`text-[9px] sm:text-[10px] font-medium px-1.5 py-0.5 rounded-md border truncate leading-tight flex items-center gap-1 shadow-xs cursor-pointer hover:scale-102 transition-transform ${style.bg}`}
                            title={isUr ? evt.titleUrdu : evt.title}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
                            <span className="truncate font-serif">{isUr ? evt.titleUrdu : evt.title}</span>
                          </div>
                        );
                      })}

                      {/* Sunnah Fast Indicator (13, 14, 15 Hijri) */}
                      {!hasEvents && item.isAyyamAlBeed && (
                        <div className="text-[8px] text-cyan-700 dark:text-cyan-300 bg-cyan-100/80 dark:bg-cyan-950/60 px-1 py-0.5 rounded border border-cyan-300/40 truncate">
                          🌙 {isUr ? 'ایام بیض' : 'White Fast'}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Hijri Date Indicator */}
                    <div className="flex items-center justify-end w-full">
                      <span className="text-[9px] font-mono font-semibold text-slate-500 dark:text-slate-400 truncate">
                        {item.hijriDate?.day} {item.hijriDate?.monthNameEn.slice(0, 3)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          /* List View for Events */
          <div className="space-y-2.5">
            <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{isUr ? 'سالانہ اسلامی ایام و واقعات کی فہرست' : 'Annual Islamic Events Directory'}</span>
              <span className="text-emerald-500 font-mono text-[11px]">{listEvents.length} Events</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {listEvents.map((evt) => {
                const style = getCategoryBadge(evt.category);
                return (
                  <div
                    key={evt.id}
                    onClick={() => {
                      setSelectedEvent(evt);
                      if (onSelectEvent) onSelectEvent(evt);
                    }}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/80 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border inline-block mb-1 ${style.bg}`}>
                          {isUr ? style.labelUr : style.labelEn}
                        </span>
                        <h5 className="font-serif font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-amber-500 transition-colors">
                          {isUr ? evt.titleUrdu : evt.title}
                        </h5>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 font-serif">
                          {evt.title}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-1 rounded-lg border border-emerald-300/40 block">
                          {evt.hijriDay} {HIJRI_MONTHS_EN[evt.hijriMonth - 1]?.slice(0, 4)}
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                          {HIJRI_MONTHS_UR[evt.hijriMonth - 1]}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-serif">
                      {isUr ? evt.descriptionUrdu : evt.description}
                    </p>

                    {/* Quick Action Buttons on List Cards */}
                    <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-end gap-1.5" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={(e) => handleShareEvent(evt, e)}
                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                        title="Share via Native Share API / Apps"
                      >
                        <Share2 size={11} />
                        <span>{isUr ? 'شیئر' : 'Share'}</span>
                      </button>

                      <button
                        onClick={(e) => handleWhatsAppShare(evt, e)}
                        className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                        title="Share directly via WhatsApp"
                      >
                        <MessageCircle size={11} />
                        <span>WhatsApp</span>
                      </button>

                      <button
                        onClick={(e) => handleCopyEventDetails(evt, e)}
                        className="p-1 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] transition-colors"
                        title="Copy text"
                      >
                        <Copy size={11} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. Selected Day Detailed Inspector Banner / Modal */}
        {selectedDayInfo && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
            
            {/* Inspector Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 font-mono font-bold flex items-center justify-center text-sm shadow-xs">
                  {selectedDayInfo.dayNum}
                </div>
                <div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-tight">
                    {selectedDayInfo.gregorianDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h4>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-serif font-bold">
                    {selectedDayInfo.hijriDate.day} {selectedDayInfo.hijriDate.monthNameUr} ({selectedDayInfo.hijriDate.monthNameEn}) {selectedDayInfo.hijriDate.year} AH
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                {selectedDayInfo.events.length > 0 && (
                  <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full border border-amber-500/30">
                    {selectedDayInfo.events.length} {isUr ? 'ایام' : 'Event'}
                  </span>
                )}
              </div>
            </div>

            {/* Events falling on this day */}
            {selectedDayInfo.events.length > 0 ? (
              <div className="space-y-3">
                {selectedDayInfo.events.map((evt) => {
                  const style = getCategoryBadge(evt.category);
                  return (
                    <div 
                      key={evt.id} 
                      className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-emerald-500/30 shadow-xs space-y-2.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.bg}`}>
                          {isUr ? style.labelUr : style.labelEn}
                        </span>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => handleShareEvent(evt, e)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                            title="Share event via Native API / Messaging Apps"
                          >
                            <Share2 size={12} />
                            <span>{isUr ? 'شیئر کریں' : 'Share'}</span>
                          </button>

                          <button
                            onClick={(e) => handleWhatsAppShare(evt, e)}
                            className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                            title="Share via WhatsApp"
                          >
                            <MessageCircle size={12} />
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>

                          <button
                            onClick={(e) => handleCopyEventDetails(evt, e)}
                            className="text-[11px] text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors"
                          >
                            {copiedToast ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                            <span className="hidden sm:inline">{copiedToast ? (isUr ? 'کاپی ہوگیا' : 'Copied') : (isUr ? 'کاپی' : 'Copy')}</span>
                          </button>
                        </div>
                      </div>

                      <div>
                        <h5 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 leading-snug">
                          {evt.titleUrdu}
                        </h5>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-serif">
                          {evt.title}
                        </p>
                      </div>

                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-serif pt-1 border-t border-slate-100 dark:border-slate-800">
                        {isUr ? evt.descriptionUrdu : evt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-3 text-xs text-slate-500 dark:text-slate-400 font-serif space-y-1">
                <p>{isUr ? 'اس تاریخ پر کوئی خاص سالانہ واقعہ درج نہیں ہے۔' : 'No major annual event scheduled for this specific date.'}</p>
                {selectedDayInfo.hijriDate.day === 13 || selectedDayInfo.hijriDate.day === 14 || selectedDayInfo.hijriDate.day === 15 ? (
                  <p className="text-cyan-600 dark:text-cyan-400 font-bold">
                    ✨ {isUr ? 'مستحب ایامِ بیض (روزه رکھنا سنت ہے)' : 'Sunnah Fasting Day (Ayyam al-Beed)'}
                  </p>
                ) : null}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 4. Interactive Event Detail View Overlay Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-slate-900 border border-emerald-500/40 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden text-slate-800 dark:text-slate-100 relative"
            >
              {/* Header Banner */}
              <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 p-5 text-white relative space-y-2">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <X size={18} />
                </button>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCategoryBadge(selectedEvent.category).bg}`}>
                    {isUr ? getCategoryBadge(selectedEvent.category).labelUr : getCategoryBadge(selectedEvent.category).labelEn}
                  </span>
                  <span className="text-[10px] font-mono text-amber-300 font-bold bg-amber-500/20 px-2 py-0.5 rounded-md border border-amber-500/30">
                    {selectedEvent.hijriDay} {HIJRI_MONTHS_EN[selectedEvent.hijriMonth - 1]}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-xl leading-snug text-white pt-1">
                  {selectedEvent.titleUrdu}
                </h3>
                <p className="text-xs text-emerald-200/90 font-serif">
                  {selectedEvent.title}
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                {/* Date highlight block */}
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between text-xs font-serif">
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isUr ? 'ہجری تاریخ' : 'Hijri Calendar'}</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-300">
                      {selectedEvent.hijriDay} {HIJRI_MONTHS_UR[selectedEvent.hijriMonth - 1]}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{isUr ? 'تقریبی انگریزی ماہ' : 'Hijri Month'}</span>
                    <span className="font-mono font-bold text-slate-700 dark:text-slate-200">
                      Month #{selectedEvent.hijriMonth} ({HIJRI_MONTHS_EN[selectedEvent.hijriMonth - 1]})
                    </span>
                  </div>
                </div>

                {/* Urdu Description */}
                <div className="space-y-1">
                  <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-serif">
                    {isUr ? 'تفصیل و فضل' : 'Urdu Description'}
                  </h6>
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-serif leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {selectedEvent.descriptionUrdu}
                  </p>
                </div>

                {/* English Description */}
                <div className="space-y-1">
                  <h6 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-serif">
                    English Overview
                  </h6>
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-serif leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* Action Toolbar */}
                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {/* Native Share API Button */}
                    <button
                      onClick={(e) => handleShareEvent(selectedEvent, e)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Share2 size={14} />
                      <span>{isUr ? 'شیئر کریں' : 'Share Event'}</span>
                    </button>

                    {/* WhatsApp Direct Share Button */}
                    <button
                      onClick={(e) => handleWhatsAppShare(selectedEvent, e)}
                      className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Copy details button */}
                    <button
                      onClick={(e) => handleCopyEventDetails(selectedEvent, e)}
                      className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-200 dark:border-slate-700"
                    >
                      {copiedToast ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      <span>{copiedToast ? (isUr ? 'کاپی ہو گیا' : 'Copied') : (isUr ? 'کاپی' : 'Copy')}</span>
                    </button>

                    <button
                      onClick={() => setSelectedEvent(null)}
                      className="px-3 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-medium transition-colors"
                    >
                      {isUr ? 'بند کریں' : 'Close'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IslamicEventsCalendar;
