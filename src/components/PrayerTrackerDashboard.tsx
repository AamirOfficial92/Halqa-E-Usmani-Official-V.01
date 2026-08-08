import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  Award,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Check,
  Flame,
  UserCheck,
  ShieldCheck,
  Star,
  Target,
  X,
  Sliders
} from 'lucide-react';
import { DailyPrayerLogItem } from '../types';
import { DeleteConfirmModal } from './DeleteConfirmModal';

export interface PrayerTrackerDashboardProps {
  isUr: boolean;
  onClose?: () => void;
}

type PrayerKey = 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';

const PRAYER_NAMES: Record<PrayerKey, { en: string; ur: string }> = {
  Fajr: { en: 'Fajr', ur: 'فجر' },
  Dhuhr: { en: 'Dhuhr', ur: 'ظہر' },
  Asr: { en: 'Asr', ur: 'عصر' },
  Maghrib: { en: 'Maghrib', ur: 'مغرب' },
  Isha: { en: 'Isha', ur: 'عشاء' }
};

const MONTH_NAMES: Array<{ en: string; ur: string }> = [
  { en: 'January', ur: 'جنوری' },
  { en: 'February', ur: 'فروری' },
  { en: 'March', ur: 'مارچ' },
  { en: 'April', ur: 'اپریل' },
  { en: 'May', ur: 'مئی' },
  { en: 'June', ur: 'جون' },
  { en: 'July', ur: 'جولائی' },
  { en: 'August', ur: 'اگست' },
  { en: 'September', ur: 'ستمبر' },
  { en: 'October', ur: 'اکتوبر' },
  { en: 'November', ur: 'نومبر' },
  { en: 'December', ur: 'دسمبر' }
];

const WEEKDAY_NAMES: Array<{ enShort: string; urShort: string; enFull: string; urFull: string }> = [
  { enShort: 'Mon', urShort: 'پیر', enFull: 'Monday', urFull: 'پیر' },
  { enShort: 'Tue', urShort: 'منگل', enFull: 'Tuesday', urFull: 'منگل' },
  { enShort: 'Wed', urShort: 'بدھ', enFull: 'Wednesday', urFull: 'بدھ' },
  { enShort: 'Thu', urShort: 'جمعرات', enFull: 'Thursday', urFull: 'جمعرات' },
  { enShort: 'Fri', urShort: 'جمعہ', enFull: 'Friday', urFull: 'جمعہ المبارک' },
  { enShort: 'Sat', urShort: 'ہفتہ', enFull: 'Saturday', urFull: 'ہفتہ' },
  { enShort: 'Sun', urShort: 'اتوار', enFull: 'Sunday', urFull: 'اتوار' }
];

// Helper to format date YYYY-MM-DD
const formatDateStr = (d: Date): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Generate default initial month logs for a given year & month
const generateInitialMonthLogs = (year: number, month: number): DailyPrayerLogItem[] => {
  const totalDays = new Date(year, month, 0).getDate();
  const logs: DailyPrayerLogItem[] = [];
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() + 1 === month;
  const todayDateNum = today.getDate();

  for (let d = 1; d <= totalDays; d++) {
    const dateObj = new Date(year, month - 1, d);
    const dateStr = formatDateStr(dateObj);

    // Get Day of week (0 = Sun, 1 = Mon...)
    const jsDay = dateObj.getDay();
    // Map JS Sunday(0) -> index 6, Monday(1) -> 0, etc.
    const dayIdx = jsDay === 0 ? 6 : jsDay - 1;
    const dayInfo = WEEKDAY_NAMES[dayIdx];

    let fajr: DailyPrayerLogItem['prayers']['Fajr'] = 'pending';
    let dhuhr: DailyPrayerLogItem['prayers']['Dhuhr'] = 'pending';
    let asr: DailyPrayerLogItem['prayers']['Asr'] = 'pending';
    let maghrib: DailyPrayerLogItem['prayers']['Maghrib'] = 'pending';
    let isha: DailyPrayerLogItem['prayers']['Isha'] = 'pending';

    const isFuture = isCurrentMonth ? d > todayDateNum : dateObj > today;

    if (!isFuture) {
      if (isCurrentMonth && d === todayDateNum) {
        // Today's partial status
        const hour = today.getHours();
        fajr = hour >= 5 ? 'offered_jamaat' : 'pending';
        dhuhr = hour >= 13 ? 'offered_jamaat' : 'pending';
        asr = hour >= 16 ? 'offered' : 'pending';
        maghrib = hour >= 19 ? 'offered_jamaat' : 'pending';
        isha = hour >= 21 ? 'offered_jamaat' : 'pending';
      } else {
        // Seed realistic sample data for past days of the month
        fajr = d % 5 === 0 ? 'missed' : 'offered_jamaat';
        dhuhr = d % 7 === 2 ? 'offered' : 'offered_jamaat';
        asr = d % 9 === 3 ? 'missed' : 'offered_jamaat';
        maghrib = 'offered_jamaat';
        isha = d % 6 === 1 ? 'offered' : 'offered_jamaat';
      }
    }

    logs.push({
      date: dateStr,
      dayName: dayInfo.enShort,
      dayUrdu: dayInfo.urShort,
      prayers: {
        Fajr: fajr,
        Dhuhr: dhuhr,
        Asr: asr,
        Maghrib: maghrib,
        Isha: isha
      }
    });
  }

  return logs;
};

export const PrayerTrackerDashboard: React.FC<PrayerTrackerDashboardProps> = ({ isUr, onClose }) => {
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(today.getMonth() + 1); // 1-12

  // Key for localStorage
  const storageKey = `halqa_prayer_monthly_logs_${selectedYear}_${selectedMonth}`;

  // Load logs for selected month
  const [logs, setLogs] = useState<DailyPrayerLogItem[]>(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 28) return parsed;
      } catch (e) {
        console.warn('Failed to parse saved monthly prayer logs', e);
      }
    }
    return generateInitialMonthLogs(selectedYear, selectedMonth);
  });

  // Default selected day index (0 to totalDays - 1)
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() => {
    if (today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth) {
      return today.getDate() - 1;
    }
    return 0;
  });

  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  // Sync state when month/year changes
  useEffect(() => {
    const key = `halqa_prayer_monthly_logs_${selectedYear}_${selectedMonth}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 28) {
          setLogs(parsed);
          if (today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth) {
            setSelectedDayIndex(Math.min(today.getDate() - 1, parsed.length - 1));
          } else {
            setSelectedDayIndex(0);
          }
          return;
        }
      } catch (e) {
        console.warn('Error reading month logs from storage', e);
      }
    }

    const newMonthLogs = generateInitialMonthLogs(selectedYear, selectedMonth);
    setLogs(newMonthLogs);
    if (today.getFullYear() === selectedYear && today.getMonth() + 1 === selectedMonth) {
      setSelectedDayIndex(Math.min(today.getDate() - 1, newMonthLogs.length - 1));
    } else {
      setSelectedDayIndex(0);
    }
  }, [selectedYear, selectedMonth]);

  // Persist logs changes
  useEffect(() => {
    if (logs.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(logs));
    }
  }, [logs, storageKey]);

  // Total days in current selected month
  const totalDaysInMonth = logs.length || new Date(selectedYear, selectedMonth, 0).getDate();

  // Calculate first weekday offset for calendar grid (0 = Mon, 1 = Tue, ..., 6 = Sun)
  const firstDayWeekdayOffset = useMemo(() => {
    const firstDate = new Date(selectedYear, selectedMonth - 1, 1);
    const jsDay = firstDate.getDay(); // 0 = Sun, 1 = Mon...
    return jsDay === 0 ? 6 : jsDay - 1;
  }, [selectedYear, selectedMonth]);

  // Previous & Next Month Handlers
  const handlePrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Calculate Monthly Statistics
  const stats = useMemo(() => {
    let totalOffered = 0;
    let totalJamaat = 0;
    let totalMissed = 0;
    let totalPending = 0;
    let perfectDays = 0;

    const prayerBreakdown: Record<PrayerKey, { offered: number; missed: number; jamaat: number }> = {
      Fajr: { offered: 0, missed: 0, jamaat: 0 },
      Dhuhr: { offered: 0, missed: 0, jamaat: 0 },
      Asr: { offered: 0, missed: 0, jamaat: 0 },
      Maghrib: { offered: 0, missed: 0, jamaat: 0 },
      Isha: { offered: 0, missed: 0, jamaat: 0 }
    };

    // Day level offered counts for streaks
    const dayOfferedCounts: number[] = [];

    logs.forEach((dayLog) => {
      let dayOffered = 0;
      let dayEvaluated = 0;

      (Object.keys(dayLog.prayers) as PrayerKey[]).forEach((pkey) => {
        const st = dayLog.prayers[pkey];
        if (st === 'offered' || st === 'offered_jamaat') {
          totalOffered++;
          dayOffered++;
          dayEvaluated++;
          prayerBreakdown[pkey].offered++;
          if (st === 'offered_jamaat') {
            totalJamaat++;
            prayerBreakdown[pkey].jamaat++;
          }
        } else if (st === 'missed') {
          totalMissed++;
          dayEvaluated++;
          prayerBreakdown[pkey].missed++;
        } else {
          totalPending++;
        }
      });

      if (dayOffered === 5) {
        perfectDays++;
      }
      dayOfferedCounts.push(dayOffered);
    });

    const totalPossible = totalDaysInMonth * 5;
    const totalEvaluated = totalOffered + totalMissed;
    const completionRate = totalEvaluated > 0 ? Math.round((totalOffered / totalEvaluated) * 100) : 0;
    const jamaatRate = totalOffered > 0 ? Math.round((totalJamaat / totalOffered) * 100) : 0;

    // Calculate Best & Current Streak of days with >= 4 prayers offered
    let bestStreak = 0;
    let tempStreak = 0;
    for (let i = 0; i < dayOfferedCounts.length; i++) {
      if (dayOfferedCounts[i] >= 4) {
        tempStreak++;
        if (tempStreak > bestStreak) bestStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    let currentStreak = 0;
    for (let i = dayOfferedCounts.length - 1; i >= 0; i--) {
      if (dayOfferedCounts[i] >= 4) {
        currentStreak++;
      } else {
        break;
      }
    }

    return {
      totalPossible,
      totalOffered,
      totalJamaat,
      totalMissed,
      totalPending,
      totalEvaluated,
      completionRate,
      jamaatRate,
      perfectDays,
      currentStreak,
      bestStreak,
      prayerBreakdown
    };
  }, [logs, totalDaysInMonth]);

  const [showRecordCelebration, setShowRecordCelebration] = useState<boolean>(false);
  const prevBestStreakRef = useRef<number>(stats.bestStreak);

  // Trigger celebration animation when a new record Best Streak is achieved
  useEffect(() => {
    if (stats.bestStreak > prevBestStreakRef.current && prevBestStreakRef.current > 0) {
      setShowRecordCelebration(true);
      const timer = setTimeout(() => setShowRecordCelebration(false), 4500);
      return () => clearTimeout(timer);
    }
    prevBestStreakRef.current = stats.bestStreak;
  }, [stats.bestStreak]);

  // Chart Data for Recharts Bar Chart (Day 1 to Day N)
  const chartData = useMemo(() => {
    return logs.map((dayLog, idx) => {
      let offeredCount = 0;
      let missedCount = 0;
      let jamaatCount = 0;
      let pendingCount = 0;

      (Object.keys(dayLog.prayers) as PrayerKey[]).forEach((pkey) => {
        const st = dayLog.prayers[pkey];
        if (st === 'offered' || st === 'offered_jamaat') {
          offeredCount++;
          if (st === 'offered_jamaat') jamaatCount++;
        } else if (st === 'missed') {
          missedCount++;
        } else {
          pendingCount++;
        }
      });

      const dayNum = idx + 1;

      return {
        dayNum,
        dayName: isUr ? dayLog.dayUrdu : dayLog.dayName,
        dateStr: dayLog.date,
        offered: offeredCount,
        missed: missedCount,
        jamaat: jamaatCount,
        pending: pendingCount
      };
    });
  }, [logs, isUr]);

  // Toggle Prayer Status for Selected Day
  const handleTogglePrayer = (dayIdx: number, pkey: PrayerKey) => {
    if (dayIdx < 0 || dayIdx >= logs.length) return;
    const updated = [...logs];
    const currentStatus = updated[dayIdx].prayers[pkey];

    let nextStatus: DailyPrayerLogItem['prayers']['Fajr'];
    if (currentStatus === 'pending') nextStatus = 'offered_jamaat';
    else if (currentStatus === 'offered_jamaat') nextStatus = 'offered';
    else if (currentStatus === 'offered') nextStatus = 'missed';
    else nextStatus = 'pending';

    updated[dayIdx].prayers[pkey] = nextStatus;
    setLogs(updated);
  };

  // Mark all prayers offered for selected day
  const handleMarkAllOffered = (dayIdx: number) => {
    if (dayIdx < 0 || dayIdx >= logs.length) return;
    const updated = [...logs];
    updated[dayIdx].prayers = {
      Fajr: 'offered_jamaat',
      Dhuhr: 'offered_jamaat',
      Asr: 'offered_jamaat',
      Maghrib: 'offered_jamaat',
      Isha: 'offered_jamaat'
    };
    setLogs(updated);
  };

  // Reset current month logs
  const handleResetLogs = () => {
    setShowResetConfirm(true);
  };

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-emerald-600/60 p-3 rounded-xl shadow-xl text-white font-sans text-xs space-y-1.5 z-50">
          <p className="font-serif font-bold text-amber-300 border-b border-slate-800 pb-1 flex justify-between gap-4">
            <span>{isUr ? `تاریخ ${data.dayNum} (${data.dayName})` : `Day ${data.dayNum} (${data.dayName})`}</span>
            <span className="font-mono text-emerald-400">{data.dateStr}</span>
          </p>
          <div className="space-y-1 font-mono text-[11px]">
            <div className="flex justify-between items-center text-emerald-400 font-bold">
              <span>{isUr ? 'اداء (Offered):' : 'Offered:'}</span>
              <span>{data.offered} / 5</span>
            </div>
            {data.jamaat > 0 && (
              <div className="flex justify-between items-center text-amber-300 text-[10px]">
                <span>{isUr ? '• باجماعت:' : '• Congregation:'}</span>
                <span>{data.jamaat}</span>
              </div>
            )}
            <div className="flex justify-between items-center text-rose-400 font-bold">
              <span>{isUr ? 'قضاء (Missed):' : 'Missed:'}</span>
              <span>{data.missed} / 5</span>
            </div>
            {data.pending > 0 && (
              <div className="flex justify-between items-center text-slate-400">
                <span>{isUr ? 'باقی (Pending):' : 'Pending:'}</span>
                <span>{data.pending}</span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  const selectedDayLog = logs[selectedDayIndex] || logs[0];
  const currentMonthName = isUr ? MONTH_NAMES[selectedMonth - 1].ur : MONTH_NAMES[selectedMonth - 1].en;

  return (
    <div id="prayer-tracker-dashboard" className="bg-slate-950 text-white rounded-3xl border border-emerald-700/60 shadow-2xl p-4 sm:p-6 space-y-6 font-sans relative overflow-hidden">
      {/* Decorative Background Accents */}
      <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header Bar with Title & Month/Year Navigation Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-emerald-800/50">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 font-bold shadow-sm">
              <Calendar size={20} />
            </div>
            <h2 className="font-serif font-black text-lg sm:text-2xl text-amber-300 tracking-wide">
              {isUr ? 'ماہانہ نماز کارکردگی ٹریکر ڈیش بورڈ' : 'Monthly Prayer Performance Tracker'}
            </h2>
          </div>
          <p className="text-xs text-emerald-200/90 font-serif">
            {isUr
              ? 'پورے ماہ کی پنجگانہ نمازوں کی اداء اور قضاء کا مکمل ریکارڈ اور تجزیہ رکھیں'
              : 'Complete monthly record & analytics of daily offered vs. missed prayers'}
          </p>
        </div>

        {/* Month & Year Navigation Control Panel */}
        <div className="flex items-center gap-2 flex-wrap w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center bg-slate-900 border border-emerald-700/60 rounded-2xl p-1 shadow-inner gap-1">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-emerald-800/80 text-amber-300 hover:text-amber-200 rounded-xl transition-colors"
              title={isUr ? 'پچھلا ماہ' : 'Previous Month'}
            >
              <ChevronLeft size={18} />
            </button>

            <div className="flex items-center gap-1.5 px-2">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-transparent border-none text-xs font-serif font-bold text-amber-300 focus:ring-0 cursor-pointer py-1"
              >
                {MONTH_NAMES.map((m, idx) => (
                  <option key={m.en} value={idx + 1} className="bg-slate-900 text-white font-serif">
                    {isUr ? m.ur : m.en}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-transparent border-none text-xs font-mono font-extrabold text-emerald-300 focus:ring-0 cursor-pointer py-1"
              >
                {[2024, 2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr} className="bg-slate-900 text-white font-mono">
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-emerald-800/80 text-amber-300 hover:text-amber-200 rounded-xl transition-colors"
              title={isUr ? 'اگلا ماہ' : 'Next Month'}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleResetLogs}
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              title={isUr ? 'اس ماہ کا ڈیٹا ری سیٹ کریں' : 'Reset Month Data'}
            >
              <RotateCcw size={16} />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MONTHLY OVERVIEW STAT CARDS GRID (6 Key Analytics) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total Offered Card */}
        <div className="bg-gradient-to-br from-emerald-950/90 via-slate-900 to-slate-950 border border-emerald-600/50 p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'اداء نمازیں' : 'Total Offered'}</span>
            <CheckCircle2 size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-emerald-400">
              {stats.totalOffered}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ {stats.totalPossible}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-900/60 font-serif">
            <span>{isUr ? 'شرح اداء' : 'Offered Rate'}</span>
            <span className="font-mono font-bold text-amber-300">{stats.completionRate}%</span>
          </div>
        </div>

        {/* Total Missed Card */}
        <div className="bg-gradient-to-br from-rose-950/70 via-slate-900 to-slate-950 border border-rose-800/50 p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-rose-400">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'قضاء نمازیں' : 'Total Missed'}</span>
            <XCircle size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-rose-400">
              {stats.totalMissed}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ {stats.totalPossible}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-rose-300/80 pt-1 border-t border-rose-950/60 font-serif">
            <span>{isUr ? 'شرح قضاء' : 'Missed Rate'}</span>
            <span className="font-mono font-bold text-rose-300">
              {stats.totalEvaluated > 0 ? Math.round((stats.totalMissed / stats.totalEvaluated) * 100) : 0}%
            </span>
          </div>
        </div>

        {/* Perfect Days Card (5/5 Prayers) */}
        <div className="bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border border-amber-400/50 p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'مکمل ایام (5/5)' : 'Perfect Days'}</span>
            <Star size={15} className="text-amber-400 fill-amber-400" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-amber-300">
              {stats.perfectDays}
            </span>
            <span className="text-[10px] text-slate-400 font-serif">{isUr ? ` / ${totalDaysInMonth} ایام` : ` / ${totalDaysInMonth} days`}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-amber-200/80 pt-1 border-t border-amber-900/60 font-serif">
            <span>{isUr ? 'مکمل حاضری' : 'Perfect Rate'}</span>
            <span className="font-mono font-bold text-amber-400">
              {Math.round((stats.perfectDays / totalDaysInMonth) * 100)}%
            </span>
          </div>
        </div>

        {/* Congregation (Jamaat) Card */}
        <div className="bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/40 p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-emerald-400">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'باجماعت' : 'Jamaat Prayers'}</span>
            <UserCheck size={15} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-amber-300">
              {stats.totalJamaat}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">/ {stats.totalOffered || 1}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-900/60 font-serif">
            <span>{isUr ? 'شرح جماعت' : 'Jamaat Rate'}</span>
            <span className="font-mono font-bold text-amber-400">{stats.jamaatRate}%</span>
          </div>
        </div>

        {/* Current Streak Card */}
        <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 border border-emerald-500/40 p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'موجودہ تسلسل' : 'Current Streak'}</span>
            <Flame size={15} className="text-amber-400 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-mono text-2xl font-black text-amber-300">
              {stats.currentStreak}
            </span>
            <span className="text-[10px] text-slate-400 font-serif">{isUr ? 'روزانہ' : 'Days'}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-emerald-300/80 pt-1 border-t border-emerald-900/60 font-serif">
            <span>{isUr ? 'استقامت' : 'Streak Status'}</span>
            <span className="font-mono font-bold text-emerald-400">
              {stats.currentStreak >= 5 ? 'عمدہ 🔥' : stats.currentStreak > 0 ? 'جارہی 👍' : 'نئی شروعات'}
            </span>
          </div>
        </div>

        {/* Best Streak Card */}
        <div
          onClick={() => setShowRecordCelebration(true)}
          className={`p-3.5 rounded-2xl shadow-md space-y-1.5 relative overflow-hidden transition-all duration-500 cursor-pointer ${
            showRecordCelebration
              ? 'bg-gradient-to-br from-amber-900 via-amber-950 to-slate-950 border-2 border-amber-300 shadow-[0_0_35px_rgba(245,158,11,0.75)] scale-[1.04] ring-2 ring-amber-400/80 z-20'
              : 'bg-gradient-to-br from-slate-900 via-amber-950 to-slate-950 border border-amber-500/40 hover:border-amber-400/80'
          }`}
          title={isUr ? 'بہترین تسلسل - نیا ریکارڈ ٹیسٹ کرنے کے لیے کلک کریں' : 'Best Streak - Tap to preview celebration'}
        >
          <AnimatePresence>
            {showRecordCelebration && (
              <>
                {/* Floating Confetti / Gold Sparkles Burst */}
                {Array.from({ length: 14 }).map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: [1, 1, 0],
                      scale: [0, 1.3, 0.7],
                      x: (Math.sin(i * 0.5) * 70) + (Math.random() - 0.5) * 30,
                      y: (Math.cos(i * 0.5) * -70) + (Math.random() - 0.5) * 20,
                      rotate: Math.random() * 360
                    }}
                    transition={{ duration: 1.8, delay: i * 0.04 }}
                    className="absolute top-1/2 left-1/2 pointer-events-none z-30"
                  >
                    <Sparkles
                      size={10 + (i % 3) * 5}
                      className={i % 2 === 0 ? 'text-amber-300 fill-amber-300' : 'text-yellow-200 fill-yellow-200'}
                    />
                  </motion.div>
                ))}

                {/* Shimmer Light Sweep Effect */}
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '220%' }}
                  transition={{ duration: 1.2, repeat: 1, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/35 to-transparent pointer-events-none z-20"
                />

                {/* New Record Badge Banner */}
                <motion.div
                  initial={{ scale: 0, y: -10 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 right-2 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full shadow-xl flex items-center gap-1 z-30 animate-bounce"
                >
                  <Award size={11} className="text-slate-950" />
                  <span>{isUr ? 'نیا ریکارڈ! 🏆' : 'NEW RECORD! 🏆'}</span>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between text-amber-300">
            <span className="text-[11px] font-serif font-bold">{isUr ? 'بہترین تسلسل' : 'Best Streak'}</span>
            <Award size={15} className={`text-amber-400 ${showRecordCelebration ? 'animate-bounce text-amber-200' : ''}`} />
          </div>
          <div className="flex items-baseline gap-1.5">
            <motion.span
              key={`${stats.bestStreak}-${showRecordCelebration}`}
              initial={showRecordCelebration ? { scale: 0.6, y: 5 } : false}
              animate={showRecordCelebration ? { scale: [1, 1.35, 1], y: 0 } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              className="font-mono text-2xl font-black text-amber-300 drop-shadow-[0_0_10px_rgba(251,191,36,0.7)]"
            >
              {stats.bestStreak}
            </motion.span>
            <span className="text-[10px] text-slate-400 font-serif">{isUr ? 'ایام' : 'Days'}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-amber-200/80 pt-1 border-t border-amber-900/60 font-serif">
            <span>{isUr ? 'ریکارڈ' : 'Record'}</span>
            <span className="font-mono font-bold text-amber-400">🏆 {stats.bestStreak}d</span>
          </div>
        </div>
      </div>

      {/* MONTHLY CHART SECTION (Recharts Bar Chart across 28-31 Days) */}
      <div className="bg-slate-900/90 border border-emerald-800/60 p-4 rounded-2xl shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <h3 className="font-serif font-bold text-sm text-amber-300">
              {isUr
                ? `ماہانہ نماز کارکردگی گراف (${currentMonthName} ${selectedYear})`
                : `Monthly Prayer Completion Chart (${currentMonthName} ${selectedYear})`}
            </h3>
          </div>

          <div className="flex items-center gap-4 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
              <span>{isUr ? 'اداء (Offered)' : 'Offered'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-400">
              <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
              <span>{isUr ? 'قضاء (Missed)' : 'Missed'}</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart */}
        <div className="w-full h-64 pt-2 overflow-x-auto">
          <div className="min-w-[650px] sm:min-w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                barGap={2}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="dayNum"
                  stroke="#94a3b8"
                  tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fill: '#94a3b8', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#334155' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey="offered"
                  name={isUr ? 'اداء' : 'Offered'}
                  fill="#10b981"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
                <Bar
                  dataKey="missed"
                  name={isUr ? 'قضاء' : 'Missed'}
                  fill="#f43f5e"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={18}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* MONTHLY CALENDAR GRID VIEW (28–31 Days Cells) */}
      <div className="bg-slate-900/90 border border-emerald-800/60 p-4 rounded-2xl shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-serif font-bold text-sm text-emerald-300 flex items-center gap-2">
              <Calendar size={16} className="text-amber-400" />
              <span>
                {isUr
                  ? `ماہانہ نماز کیلنڈر (${currentMonthName} ${selectedYear})`
                  : `Monthly Prayer Calendar (${currentMonthName} ${selectedYear})`}
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              {isUr
                ? 'کسی بھی تاریخ پر ٹیپ کر کے اس دن کی نمازیں دیکھیں اور لاگ اپ ڈیٹ کریں'
                : 'Tap any day cell to open & log detailed prayer records for that date'}
            </p>
          </div>

          <button
            onClick={() => handleMarkAllOffered(selectedDayIndex)}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600/60 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Check size={14} />
            <span>
              {isUr ? `تاریخ ${selectedDayIndex + 1} کی تمام نمازیں اداء مارک کریں` : `Mark All Offered for Day ${selectedDayIndex + 1}`}
            </span>
          </button>
        </div>

        {/* 7-Column Calendar Grid Header (Mon to Sun) */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-serif font-bold text-amber-400 border-b border-slate-800/80 pb-2">
          {WEEKDAY_NAMES.map((wd) => (
            <div key={wd.enShort} className="p-1">
              {isUr ? wd.urShort : wd.enShort}
            </div>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {/* Offset Blank Cells */}
          {Array.from({ length: firstDayWeekdayOffset }).map((_, idx) => (
            <div key={`blank-${idx}`} className="p-2 min-h-[52px] bg-slate-950/30 rounded-xl border border-slate-900/40 opacity-30"></div>
          ))}

          {/* Day Cells (1 to Total Days) */}
          {logs.map((dayLog, idx) => {
            const dayNum = idx + 1;
            const isSelected = selectedDayIndex === idx;

            const isToday =
              today.getFullYear() === selectedYear &&
              today.getMonth() + 1 === selectedMonth &&
              today.getDate() === dayNum;

            const offeredCount = Object.values(dayLog.prayers).filter((s) => s === 'offered' || s === 'offered_jamaat').length;
            const missedCount = Object.values(dayLog.prayers).filter((s) => s === 'missed').length;
            const jamaatCount = Object.values(dayLog.prayers).filter((s) => s === 'offered_jamaat').length;

            const isPerfect = offeredCount === 5;

            return (
              <button
                key={dayLog.date}
                onClick={() => setSelectedDayIndex(idx)}
                className={`p-1.5 sm:p-2 rounded-xl text-center transition-all border relative flex flex-col justify-between min-h-[58px] sm:min-h-[64px] ${
                  isSelected
                    ? 'bg-amber-400 text-slate-950 font-black border-amber-300 shadow-lg scale-[1.03] z-10 ring-2 ring-amber-300'
                    : isToday
                    ? 'bg-emerald-950 text-amber-300 border-amber-400/80 font-bold shadow-md'
                    : isPerfect
                    ? 'bg-emerald-950/60 text-emerald-100 border-emerald-600/60 hover:border-amber-400/60'
                    : 'bg-slate-950/80 text-slate-300 border-slate-800 hover:border-emerald-600/60'
                }`}
              >
                {/* Header Date & Star */}
                <div className="flex items-center justify-between w-full text-[10px] sm:text-xs">
                  <span className={`font-mono font-extrabold ${isSelected ? 'text-slate-950' : 'text-amber-300'}`}>
                    {dayNum}
                  </span>
                  {isPerfect && (
                    <Star size={10} className={isSelected ? 'text-slate-950 fill-slate-950' : 'text-amber-400 fill-amber-400'} />
                  )}
                </div>

                {/* Day Name */}
                <span className={`text-[9.5px] sm:text-[10px] font-serif block ${isSelected ? 'text-slate-900 font-bold' : 'text-slate-400'}`}>
                  {isUr ? dayLog.dayUrdu : dayLog.dayName}
                </span>

                {/* Indicators / Offered Count Badge */}
                <div className="flex items-center justify-center gap-1 font-mono text-[9px] sm:text-[10px] mt-0.5">
                  <span className={`px-1 py-0.2 rounded ${isSelected ? 'bg-slate-950 text-emerald-400 font-bold' : 'bg-emerald-950/90 text-emerald-400 border border-emerald-700/50'}`}>
                    ✓{offeredCount}
                  </span>
                  {missedCount > 0 && (
                    <span className={`px-1 py-0.2 rounded ${isSelected ? 'bg-rose-950 text-rose-300 font-bold' : 'bg-rose-950/90 text-rose-400 border border-rose-800/50'}`}>
                      ✕{missedCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED DAY DETAILED INTERACTIVE PRAYER LOGGER */}
      <div className="p-4 bg-slate-900/90 border border-emerald-800/60 rounded-2xl space-y-3.5 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs font-serif border-b border-slate-800 pb-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-amber-400 text-slate-950 font-bold text-xs rounded-md font-mono">
              {isUr ? `تاریخ ${selectedDayIndex + 1}` : `Day ${selectedDayIndex + 1}`}
            </span>
            <span className="text-amber-300 font-bold text-sm">
              {isUr
                ? `روزانہ ریکارڈ: ${selectedDayLog.dayUrdu} (${selectedDayLog.date})`
                : `Logging for ${selectedDayLog.dayName} (${selectedDayLog.date})`}
            </span>
          </div>

          <span className="text-slate-400 text-[11px]">
            {isUr ? 'کسی بھی نماز پر ٹیپ کر کے حالت تبدیل کریں (باجماعت / اداء / قضاء / باقی)' : 'Tap any prayer card to cycle status'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {(Object.keys(PRAYER_NAMES) as PrayerKey[]).map((pkey) => {
            const status = selectedDayLog.prayers[pkey];
            const pInfo = PRAYER_NAMES[pkey];

            let badgeStyle = 'bg-slate-950 text-slate-400 border-slate-800';
            let statusText = isUr ? 'غیر فعال' : 'Pending';

            if (status === 'offered_jamaat') {
              badgeStyle = 'bg-emerald-950/90 text-amber-300 border-amber-400/70 font-bold shadow-xs';
              statusText = isUr ? 'باجماعت ✓★' : 'Jamaat ✓★';
            } else if (status === 'offered') {
              badgeStyle = 'bg-emerald-900/60 text-emerald-300 border-emerald-600/60 font-bold';
              statusText = isUr ? 'انفرادی اداء ✓' : 'Offered ✓';
            } else if (status === 'missed') {
              badgeStyle = 'bg-rose-950/80 text-rose-300 border-rose-600/60 font-bold';
              statusText = isUr ? 'قضاء ✕' : 'Missed ✕';
            }

            return (
              <div
                key={pkey}
                onClick={() => handleTogglePrayer(selectedDayIndex, pkey)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-2 hover:scale-[1.02] active:scale-95 ${badgeStyle}`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm">
                    {isUr ? pInfo.ur : pInfo.en}
                  </span>
                  <Clock size={14} className="opacity-70" />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[11px] font-mono">
                  <span>{statusText}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* INDIVIDUAL PRAYER MONTHLY PERFORMANCE BREAKDOWN */}
      <div className="bg-slate-900/90 border border-emerald-800/60 p-4 rounded-2xl shadow-lg space-y-3">
        <h3 className="font-serif font-bold text-sm text-amber-300 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Award size={16} className="text-amber-400" />
          <span>
            {isUr
              ? `پنجگانہ نمازوں کی انفرادی ماہانہ کارکردگی (${currentMonthName})`
              : `Individual Prayer Monthly Performance Breakdown (${currentMonthName})`}
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {(Object.keys(PRAYER_NAMES) as PrayerKey[]).map((pkey) => {
            const pInfo = PRAYER_NAMES[pkey];
            const pData = stats.prayerBreakdown[pkey];
            const pct = Math.round((pData.offered / totalDaysInMonth) * 100);

            return (
              <div key={pkey} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-bold text-white">{isUr ? pInfo.ur : pInfo.en}</span>
                  <span className="font-mono text-emerald-400 font-bold">{pData.offered}/{totalDaysInMonth}</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                  <span>{isUr ? `باجماعت: ${pData.jamaat}` : `Jamaat: ${pData.jamaat}`}</span>
                  <span>{pct}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Dashboard Footer Note */}
      <div className="p-3 bg-emerald-950/60 rounded-2xl border border-emerald-800/40 text-[11.5px] text-emerald-200/90 font-serif flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-400 shrink-0" />
          <span>
            {isUr
              ? 'فرمانِ نبوی ﷺ: "نماز دین کا ستون ہے۔" ماہانہ باقاعدگی سے اپنی نمازیں وقت پر ادا فرمائیں۔'
              : 'Hadith: "Prayer is the pillar of religion." Maintain your daily prayers consistently on time.'}
          </span>
        </div>
        <span className="font-mono text-[10px] text-amber-300 font-bold shrink-0">
          حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ
        </span>
      </div>

      <DeleteConfirmModal
        isOpen={showResetConfirm}
        title={isUr ? 'ڈیٹا ری سیٹ تصدیق' : 'Reset Prayer Logs Confirmation'}
        message={
          isUr 
            ? `کیا آپ واقعی ${MONTH_NAMES[selectedMonth - 1].ur} ${selectedYear} کا ڈیٹا ری سیٹ کرنا چاہتے ہیں؟`
            : `Are you sure you want to reset prayer logs for ${MONTH_NAMES[selectedMonth - 1].en} ${selectedYear}?`
        }
        onClose={() => setShowResetConfirm(false)}
        onConfirm={() => {
          const fresh = generateInitialMonthLogs(selectedYear, selectedMonth);
          setLogs(fresh);
          setShowResetConfirm(false);
        }}
      />
    </div>
  );
};
