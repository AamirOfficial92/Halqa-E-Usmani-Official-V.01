import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShareCard } from './ShareCard';
import { PrayerTrackerDashboard } from './PrayerTrackerDashboard';
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Sunrise, 
  Sun, 
  Sunset, 
  Moon, 
  Bell, 
  BellOff, 
  Settings, 
  Search, 
  Check, 
  ChevronDown, 
  Volume2, 
  Compass, 
  RotateCw, 
  X, 
  Sparkles,
  Info,
  TrendingUp,
  WifiOff
} from 'lucide-react';
import { 
  calculateOfflinePrayerTimes, 
  getPrayerTimesFromOfflineStorage, 
  savePrayerTimesToOfflineStorage, 
  POPULAR_CITIES 
} from '../lib/offlinePrayerEngine';
import { adhanAlarmEngine } from '../lib/adhanAlarmEngine';
import { AdhanSoundSettingsControl } from './AdhanAlarmModal';

export interface PrayerWidgetProps {
  isUr: boolean;
  currentUserCity?: string;
  showMonthlyTable?: boolean;
  contactNumber?: string;
  hadith?: any;
}

export interface PrayerTimeSetting {
  city: string;
  country: string;
  method: number;
  school: number; // 0 = Shafi, 1 = Hanafi
  autoLocation: boolean;
  latitude?: number;
  longitude?: number;
  hijriAdjustment?: number;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
}

const MAJOR_CITIES = [
  { name: 'Lahore', country: 'Pakistan', ur: 'لاہور' },
  { name: 'Karachi', country: 'Pakistan', ur: 'کراچی' },
  { name: 'Islamabad', country: 'Pakistan', ur: 'اسلام آباد' },
  { name: 'Faisalabad', country: 'Pakistan', ur: 'فیصل آباد' },
  { name: 'Rawalpindi', country: 'Pakistan', ur: 'راولپنڈی' },
  { name: 'Multan', country: 'Pakistan', ur: 'ملتان' },
  { name: 'Peshawar', country: 'Pakistan', ur: 'پشاور' },
  { name: 'Quetta', country: 'Pakistan', ur: 'کوئٹہ' },
  { name: 'Sialkot', country: 'Pakistan', ur: 'سیالکوٹ' },
  { name: 'Gujranwala', country: 'Pakistan', ur: 'گوجرانوالہ' },
  { name: 'Mecca', country: 'Saudi Arabia', ur: 'مکہ مکرمہ' },
  { name: 'Medina', country: 'Saudi Arabia', ur: 'مدینہ منورہ' },
  { name: 'London', country: 'United Kingdom', ur: 'لندن' },
  { name: 'New York', country: 'United States', ur: 'نیویارک' },
];

const CALC_METHODS = [
  { id: 1, name: 'University of Islamic Sciences, Karachi', ur: 'جامعہ علوم اسلامیہ بنوری ٹاؤن، کراچی' },
  { id: 2, name: 'ISNA (North America)', ur: 'اسلامک سوسائٹی آف نارتھ امریکہ (ISNA)' },
  { id: 3, name: 'Muslim World League (MWL)', ur: 'رابطۃ العالم الاسلامی (مکہ مکرمہ)' },
  { id: 4, name: 'Umm Al-Qura University, Makkah', ur: 'جامعہ ام القریٰ، مکہ مکرمہ' },
  { id: 5, name: 'Egyptian General Authority', ur: 'مصری عمومی ہئیت برائے مساحت' },
  { id: 12, name: 'UOIF (France)', ur: 'فرانسیسی اسلامک آرگنائزیشن' },
];

const FALLBACK_PRAYER_TIMES: PrayerTimings = {
  Fajr: '04:15',
  Sunrise: '05:45',
  Dhuhr: '12:20',
  Asr: '15:45',
  Maghrib: '19:10',
  Isha: '20:45',
  Imsak: '04:05',
  Midnight: '00:15'
};

export const PrayerWidget: React.FC<PrayerWidgetProps> = ({ 
  isUr, 
  currentUserCity,
  showMonthlyTable = false,
  contactNumber,
  hadith
}) => {
  // Saved Prayer Settings
  const [setting, setSetting] = useState<PrayerTimeSetting>(() => {
    const saved = localStorage.getItem('halqa_prayer_setting');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      city: currentUserCity || 'Karachi',
      country: 'Pakistan',
      method: 1, // Karachi University
      school: 1, // Hanafi
      autoLocation: false,
      hijriAdjustment: 0
    };
  });

  const [timings, setTimings] = useState<PrayerTimings | null>(null);
  const [loadingTimings, setLoadingTimings] = useState<boolean>(true);
  const [locationName, setLocationName] = useState<string>(setting.city);
  const [hijriDateString, setHijriDateString] = useState<string>('');
  
  const [nextPrayer, setNextPrayer] = useState<{ name: string; nameUrdu: string; time: string; timeDiff: string; percent: number } | null>(null);
  const [upcomingPrayer, setUpcomingPrayer] = useState<{ name: string; nameUrdu: string; time: string; timeDiff: string } | null>(null);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showTrackerDashboard, setShowTrackerDashboard] = useState<boolean>(false);
  const [searchCity, setSearchCity] = useState<string>('');
  const [isOffline, setIsOffline] = useState<boolean>(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Notification State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window ? Notification.permission : 'default';
  });
  const [prayerAlerts, setPrayerAlerts] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('halqa_prayer_alerts');
    return saved ? JSON.parse(saved) : { Fajr: true, Dhuhr: true, Asr: true, Maghrib: true, Isha: true };
  });
  const [alertToast, setAlertToast] = useState<string | null>(null);

  // Monthly Table State
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [monthlyData, setMonthlyData] = useState<Array<{
    dayNum: number;
    dateStr: string;
    hijriStr: string;
    fajr: string;
    sunrise: string;
    zuhr: string;
    asrShafi: string;
    asrHanafi: string;
    maghrib: string;
    isha: string;
  }> | null>(null);
  const [loadingMonthly, setLoadingMonthly] = useState<boolean>(false);

  const monthNamesEn = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const monthNamesUr = ['جنوری', 'فروری', 'مارچ', 'اپریل', 'مئی', 'جون', 'جولائی', 'اگست', 'ستمبر', 'اکتوبر', 'نومبر', 'دسمبر'];

  const getGmtString = () => {
    const offsetMins = -new Date().getTimezoneOffset();
    const hrs = Math.floor(Math.abs(offsetMins) / 60);
    const mins = Math.abs(offsetMins) % 60;
    const sign = offsetMins >= 0 ? '+' : '-';
    return `GMT${sign}${hrs}${mins ? `:${mins}` : ''}`;
  };

  // Sync settings to localStorage
  const updateSettings = (newSetting: PrayerTimeSetting) => {
    setSetting(newSetting);
    localStorage.setItem('halqa_prayer_setting', JSON.stringify(newSetting));
  };

  // Fetch Daily Prayer Timings
  useEffect(() => {
    let isMounted = true;
    setLoadingTimings(true);
    const dateKey = new Date().toISOString().split('T')[0];

    const fetchTimings = async () => {
      try {
        let url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(setting.city)}&country=${encodeURIComponent(setting.country)}&method=${setting.method}&school=${setting.school}`;
        if (setting.autoLocation && setting.latitude && setting.longitude) {
          url = `https://api.aladhan.com/v1/timings?latitude=${setting.latitude}&longitude=${setting.longitude}&method=${setting.method}&school=${setting.school}`;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          if (data.data && isMounted) {
            const rawTimings = data.data.timings;
            const cleanTime = (tStr: string) => tStr.trim().split(' ')[0];

            const parsedTimings: PrayerTimings = {
              Fajr: cleanTime(rawTimings.Fajr),
              Sunrise: cleanTime(rawTimings.Sunrise),
              Dhuhr: cleanTime(rawTimings.Dhuhr),
              Asr: cleanTime(rawTimings.Asr),
              Maghrib: cleanTime(rawTimings.Maghrib),
              Isha: cleanTime(rawTimings.Isha),
              Imsak: cleanTime(rawTimings.Imsak || rawTimings.Fajr),
              Midnight: cleanTime(rawTimings.Midnight || '00:00')
            };

            setTimings(parsedTimings);
            savePrayerTimesToOfflineStorage(setting.city, dateKey, parsedTimings);

            // Hijri Date Formatting
            if (data.data.date?.hijri) {
              const h = data.data.date.hijri;
              const adjDay = parseInt(h.day, 10) + (setting.hijriAdjustment || 0);
              const hijriFormatted = `${adjDay} ${h.month.en} ${h.year} AH`;
              setHijriDateString(hijriFormatted);
            }

            setLocationName(setting.autoLocation ? (isUr ? 'قریبی مقام (GPS)' : 'Nearby (GPS)') : setting.city);
            setLoadingTimings(false);
            return;
          }
        }
      } catch (err) {
        console.warn('Aladhan API unavailable, using cached/offline calculated timings', err);
      }

      if (isMounted) {
        // Attempt retrieval from local storage offline cache first
        const offlineCached = getPrayerTimesFromOfflineStorage(setting.city, dateKey);
        if (offlineCached) {
          setTimings(offlineCached);
        } else {
          // Calculate solar prayer timings offline
          const cityData = POPULAR_CITIES[setting.city];
          const lat = setting.latitude || (cityData ? cityData.lat : 24.8607);
          const lng = setting.longitude || (cityData ? cityData.lng : 67.0011);
          const isHanafi = setting.school === 1;

          const calculated = calculateOfflinePrayerTimes(lat, lng, new Date(), isHanafi);
          setTimings(calculated);
          savePrayerTimesToOfflineStorage(setting.city, dateKey, calculated);
        }

        setHijriDateString('27 Safar 1448 AH');
        setLocationName(setting.city + (isUr ? ' (آف لائن)' : ' (Offline)'));
        setLoadingTimings(false);
      }
    };

    fetchTimings();
    return () => { isMounted = false; };
  }, [setting, isUr]);

  // Fetch Monthly Prayer Timetable
  const fetchMonthlyTimetable = async (month: number, year: number) => {
    if (!showMonthlyTable) return;
    setLoadingMonthly(true);
    try {
      let urlShafi = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(setting.city)}&country=${encodeURIComponent(setting.country)}&method=${setting.method}&month=${month}&year=${year}&school=0`;
      let urlHanafi = `https://api.aladhan.com/v1/calendarByCity?city=${encodeURIComponent(setting.city)}&country=${encodeURIComponent(setting.country)}&method=${setting.method}&month=${month}&year=${year}&school=1`;

      if (setting.autoLocation && setting.latitude && setting.longitude) {
        urlShafi = `https://api.aladhan.com/v1/calendar?latitude=${setting.latitude}&longitude=${setting.longitude}&method=${setting.method}&month=${month}&year=${year}&school=0`;
        urlHanafi = `https://api.aladhan.com/v1/calendar?latitude=${setting.latitude}&longitude=${setting.longitude}&method=${setting.method}&month=${month}&year=${year}&school=1`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const [resShafi, resHanafi] = await Promise.all([
        fetch(urlShafi, { signal: controller.signal }),
        fetch(urlHanafi, { signal: controller.signal })
      ]);
      clearTimeout(timeoutId);

      if (resShafi.ok && resHanafi.ok) {
        const dataShafi = await resShafi.json();
        const dataHanafi = await resHanafi.json();

        if (dataShafi.data && dataHanafi.data) {
          const shafiDays = dataShafi.data;
          const hanafiDays = dataHanafi.data;
          const cleanTime = (t: string) => (t ? t.trim().split(' ')[0] : '--:--');

          const combined = shafiDays.map((sDay: any, idx: number) => {
            const hDay = hanafiDays[idx] || sDay;
            const gDate = sDay.date.gregorian;
            const hDate = sDay.date.hijri;

            return {
              dayNum: parseInt(gDate.day, 10),
              dateStr: `${gDate.day} ${gDate.month.en.slice(0, 3)}`,
              hijriStr: `${hDate.day} ${hDate.month.en}`,
              fajr: cleanTime(sDay.timings.Fajr),
              sunrise: cleanTime(sDay.timings.Sunrise),
              zuhr: cleanTime(sDay.timings.Dhuhr),
              asrShafi: cleanTime(sDay.timings.Asr),
              asrHanafi: cleanTime(hDay.timings.Asr),
              maghrib: cleanTime(sDay.timings.Maghrib),
              isha: cleanTime(sDay.timings.Isha)
            };
          });

          setMonthlyData(combined);
          setLoadingMonthly(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Network error fetching monthly calendar, using fallback', err);
    }

    // Offline / Network Failure Fallback
    const daysInMonth = new Date(year, month, 0).getDate();
    const fallbackList = [];
    const base = timings || FALLBACK_PRAYER_TIMES;

    for (let d = 1; d <= daysInMonth; d++) {
      fallbackList.push({
        dayNum: d,
        dateStr: `${String(d).padStart(2, '0')} ${monthNamesEn[month - 1].slice(0, 3)}`,
        hijriStr: `${d} Safar`,
        fajr: base.Fajr,
        sunrise: base.Sunrise,
        zuhr: base.Dhuhr,
        asrShafi: '15:30',
        asrHanafi: base.Asr,
        maghrib: base.Maghrib,
        isha: base.Isha
      });
    }
    setMonthlyData(fallbackList);
    setLoadingMonthly(false);
  };

  useEffect(() => {
    if (showMonthlyTable) {
      fetchMonthlyTimetable(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, setting, showMonthlyTable]);

  // Live Countdown & Next / Upcoming Prayer Calculation
  useEffect(() => {
    if (!timings) return;

    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const clean = timeStr.trim().split(' ')[0];
      const [h, m] = clean.split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const pList = [
        { name: 'Fajr', nameUrdu: 'فجر', time: timings.Fajr },
        { name: 'Sunrise', nameUrdu: 'طلوعِ آفتاب', time: timings.Sunrise },
        { name: 'Dhuhr', nameUrdu: 'ظہر', time: timings.Dhuhr },
        { name: 'Asr', nameUrdu: 'عصر', time: timings.Asr },
        { name: 'Maghrib', nameUrdu: 'مغرب', time: timings.Maghrib },
        { name: 'Isha', nameUrdu: 'عشاء', time: timings.Isha }
      ];

      let nextIndex = pList.findIndex(p => parseTimeToMinutes(p.time) > currentMinutes);
      let isNextDay = false;

      if (nextIndex === -1) {
        nextIndex = 0; // Fajr tomorrow
        isNextDay = true;
      }

      const nextP = pList[nextIndex];
      const upcomingIndex = (nextIndex + 1) % pList.length;
      const upcomingP = pList[upcomingIndex];
      const isUpcomingNextDay = isNextDay || upcomingIndex <= nextIndex;

      // Next Prayer Countdown
      const targetMinsNext = parseTimeToMinutes(nextP.time) + (isNextDay ? 24 * 60 : 0);
      const diffNext = targetMinsNext - currentMinutes;
      const safeDiffNext = isNaN(diffNext) || diffNext < 0 ? 0 : diffNext;
      const hrsN = Math.floor(safeDiffNext / 60);
      const minsN = safeDiffNext % 60;
      const secsN = Math.max(0, 59 - now.getSeconds());

      const formattedDiffNext = `${hrsN > 0 ? `${hrsN}h ` : ''}${minsN}m ${secsN}s`;
      const totalWindow = 5 * 60;
      const rawPercent = Math.min(100, Math.max(0, 100 - (safeDiffNext / totalWindow) * 100));

      setNextPrayer({
        name: nextP.name,
        nameUrdu: nextP.nameUrdu,
        time: nextP.time,
        timeDiff: formattedDiffNext,
        percent: isNaN(rawPercent) ? 0 : rawPercent
      });

      // Upcoming Prayer Countdown
      const targetMinsUpcoming = parseTimeToMinutes(upcomingP.time) + (isUpcomingNextDay ? 24 * 60 : 0);
      const diffUpcoming = targetMinsUpcoming - currentMinutes;
      const safeDiffUpcoming = isNaN(diffUpcoming) || diffUpcoming < 0 ? 0 : diffUpcoming;
      const hrsU = Math.floor(safeDiffUpcoming / 60);
      const minsU = safeDiffUpcoming % 60;

      const formattedDiffUpcoming = `${hrsU > 0 ? `${hrsU}h ` : ''}${minsU}m ${secsN}s`;

      setUpcomingPrayer({
        name: upcomingP.name,
        nameUrdu: upcomingP.nameUrdu,
        time: upcomingP.time,
        timeDiff: formattedDiffUpcoming
      });

      // Local Notification & Adhan Audio Alarm trigger
      if (timings && prayerAlerts) {
        adhanAlarmEngine.checkAndTrigger(timings as any, prayerAlerts, locationName || setting.city);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  // Request Notification Permissions
  const requestNotifPermission = async () => {
    if (!('Notification' in window)) {
      alert(isUr ? 'آپ کے براؤزر میں نوٹیفکیشنز کی سہولت دستیاب نہیں ہے۔' : 'Notifications are not supported in your browser.');
      return;
    }
    const res = await Notification.requestPermission();
    setNotifPermission(res);
    if (res === 'granted') {
      triggerToast(isUr ? 'نوٹیفکیشنز کی اجازت مل گئی!' : 'Notification permission granted!');
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SCHEDULE_PRAYER_ALERTS',
          payload: { timings, alerts: prayerAlerts, city: locationName }
        });
      }
    } else {
      triggerToast(isUr ? 'نوٹیفکیشنز مسترد کر دیے گئے' : 'Notification permission denied');
    }
  };

  const triggerToast = (msg: string) => {
    setAlertToast(msg);
    setTimeout(() => setAlertToast(null), 3000);
  };

  const toggleAlert = (key: string) => {
    const updated = { ...prayerAlerts, [key]: !prayerAlerts[key] };
    setPrayerAlerts(updated);
    localStorage.setItem('halqa_prayer_alerts', JSON.stringify(updated));
    triggerToast(isUr ? `${key} کا الرٹ ${updated[key] ? 'فعال' : 'غیر فعال'} کر دیا گیا` : `${key} alert ${updated[key] ? 'enabled' : 'disabled'}`);
  };

  const handleTestNotification = () => {
    if (notifPermission !== 'granted') {
      requestNotifPermission();
      return;
    }
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'TEST_NOTIFICATION',
        payload: { title: 'حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ - ٹیسٹ الرٹ', body: 'نماز کا وقت قریب ہے، تیاری کریں۔' }
      });
    } else {
      new Notification(isUr ? 'حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ - ٹیسٹ الرٹ' : 'Halqa E Usmania Muhammadia Rasheedia Qadriya - Test Alert', {
        body: isUr ? 'نماز کا وقت قریب ہے، مسجد کے لیے تشریف لے جائیں۔' : 'Prayer time is approaching, please prepare.',
        icon: '/pwa-192x192.png'
      });
    }
    triggerToast(isUr ? 'ٹیسٹ نوٹیفکیشن بھیج دیا گیا' : 'Test notification dispatched');
  };

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      alert(isUr ? 'جی پی ایس میسر نہیں ہے' : 'Geolocation is not available');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        updateSettings({
          ...setting,
          autoLocation: true,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude
        });
        setShowSettingsModal(false);
        triggerToast(isUr ? 'موقع (GPS) مل گیا' : 'GPS Location detected');
      },
      (err) => {
        alert(isUr ? 'لوکیشن کی رسائی میں ناکامی' : 'Failed to detect location');
      }
    );
  };

  const handleSelectCity = (cName: string, cCountry: string) => {
    updateSettings({
      ...setting,
      city: cName,
      country: cCountry,
      autoLocation: false
    });
    setShowSettingsModal(false);
  };

  const handleCustomCitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCity.trim()) return;
    updateSettings({
      ...setting,
      city: searchCity.trim(),
      country: '',
      autoLocation: false
    });
    setSearchCity('');
    setShowSettingsModal(false);
  };

  return (
    <div id="shared-prayer-widget" className="space-y-4">
      {/* Header: Location, GMT Offset, Hijri Date, Change Location Button */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-3.5 sm:p-4 rounded-2xl border border-emerald-700/60 shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <MapPin size={18} className="text-amber-400 shrink-0" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-white">
              {isUr ? `نماز کے اوقات - ${locationName}` : `Prayer Times in ${locationName}`}
            </h3>
            <span className="text-[10px] font-mono bg-emerald-800 text-amber-300 font-bold px-2 py-0.5 rounded-md border border-emerald-600/50">
              {getGmtString()}
            </span>
            {isOffline && (
              <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                <WifiOff size={11} className="text-amber-400" />
                <span>{isUr ? 'آف لائن کیش' : 'Offline Cache'}</span>
              </span>
            )}
          </div>
          <p className="text-[11px] text-emerald-200/90 font-serif flex items-center gap-1.5 flex-wrap">
            <Calendar size={13} className="text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">{new Date().toLocaleDateString(isUr ? 'ur-PK' : 'en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-amber-400 font-bold">•</span>
            <span className="font-bold text-amber-300">{hijriDateString || '22 Safar 1448 AH'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <ShareCard 
            isUr={isUr}
            cityName={locationName}
            hijriDate={hijriDateString}
            timings={timings}
            contactNumber={contactNumber}
            hadith={hadith}
          />
          <button
            onClick={() => setShowTrackerDashboard((prev) => !prev)}
            className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0 border border-emerald-400/40"
          >
            <TrendingUp size={14} className="text-amber-300" />
            <span>{showTrackerDashboard ? (isUr ? 'بند کریں' : 'Hide Dashboard') : (isUr ? 'نماز کارکردگی 📊' : 'Prayer Tracker 📊')}</span>
          </button>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-amber-300 border border-emerald-600/60 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <MapPin size={14} />
            <span>{isUr ? 'مقام تبدیل کریں' : 'Change Location'}</span>
          </button>
        </div>
      </div>

      {/* Embedded Prayer Performance Visualization Dashboard */}
      {showTrackerDashboard && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <PrayerTrackerDashboard 
            isUr={isUr} 
            onClose={() => setShowTrackerDashboard(false)} 
          />
        </motion.div>
      )}


      {/* Current / Next Prayer & Upcoming Prayer Side-by-Side Cards */}
      {nextPrayer && upcomingPrayer && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Next Prayer Card */}
          <div className="bg-gradient-to-br from-emerald-900 via-slate-900 to-slate-950 text-white p-4 rounded-2xl border border-emerald-600 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-amber-400 text-slate-950 font-bold text-[9px] uppercase px-2 py-0.5 rounded font-mono">
                {isUr ? 'اگلی نماز' : 'Next Prayer'}
              </span>
              <Clock size={16} className="text-amber-400 animate-pulse" />
            </div>

            <div>
              <h3 className="font-serif font-black text-2xl text-amber-300">
                {isUr ? nextPrayer.nameUrdu : nextPrayer.name} <span className="text-white text-base font-mono">({nextPrayer.time})</span>
              </h3>
              <p className="text-xs text-emerald-200/90 font-mono mt-0.5">
                {isUr ? `بقیہ وقت: ${nextPrayer.timeDiff}` : `Remaining: ${nextPrayer.timeDiff}`}
              </p>
            </div>

            {/* Sehri / Iftar pill if available */}
            {timings && (
              <div className="flex gap-2 bg-slate-950/80 p-2 rounded-xl border border-slate-800 text-[10px]">
                <div className="flex items-center gap-1.5 px-1.5 border-r border-slate-800">
                  <Moon size={12} className="text-amber-400" />
                  <div>
                    <span className="text-slate-400 block">{isUr ? 'سحری' : 'Sehri'}</span>
                    <span className="font-mono font-bold text-white">{timings.Imsak || timings.Fajr}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-1.5">
                  <Sunset size={12} className="text-amber-500" />
                  <div>
                    <span className="text-slate-400 block">{isUr ? 'افطار' : 'Iftar'}</span>
                    <span className="font-mono font-bold text-white">{timings.Maghrib}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upcoming Prayer Card */}
          <div className="bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-950 text-white p-4 rounded-2xl border border-slate-700 shadow-md relative overflow-hidden flex flex-col justify-between space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-slate-800 text-amber-300 border border-amber-500/30 font-bold text-[9px] uppercase px-2 py-0.5 rounded font-mono">
                {isUr ? 'اگلی سے اگلی نماز' : 'Upcoming Prayer'}
              </span>
              <Sunrise size={16} className="text-emerald-400" />
            </div>

            <div>
              <h3 className="font-serif font-black text-2xl text-emerald-300">
                {isUr ? upcomingPrayer.nameUrdu : upcomingPrayer.name} <span className="text-slate-200 text-base font-mono">({upcomingPrayer.time})</span>
              </h3>
              <p className="text-xs text-slate-300 font-mono mt-0.5">
                {isUr ? `بقیہ وقت: ${upcomingPrayer.timeDiff}` : `Remaining: ${upcomingPrayer.timeDiff}`}
              </p>
            </div>

            <div className="p-2 bg-emerald-950/50 rounded-xl border border-emerald-800/40 text-[10px] text-emerald-200">
              <span>🕌 {isUr ? 'نمازِ باجماعت کی تیاری رکھیں' : 'Prepare for congregation prayer'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Push Notification Control Banner */}
      <div className="p-3.5 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${notifPermission === 'granted' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
            {notifPermission === 'granted' ? <Bell size={18} className="animate-pulse" /> : <BellOff size={18} />}
          </div>
          <div className="space-y-0.5 text-left">
            <span className="font-bold text-xs sm:text-sm text-white block">
              {notifPermission === 'granted' 
                ? (isUr ? 'پش نوٹیفکیشنز الرٹ فعال ہیں' : 'Push Notification Alerts Active')
                : (isUr ? 'نماز کے پش الرٹس فعال کریں' : 'Enable Prayer Push Notifications')}
            </span>
            <p className="text-[11px] text-slate-400">
              {notifPermission === 'granted'
                ? (isUr ? 'سروس ورکر کے ذریعے وقت ہوتے ہی الرٹ موصول ہو گا' : 'Scheduled local alerts will notify you via Service Worker.')
                : (isUr ? 'بروقت نماز کے اوقات کے الرٹس موصول کرنے کے لیے اجازت دیں' : 'Receive instant local notification alerts when prayer time arrives.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          {notifPermission === 'granted' ? (
            <button
              onClick={handleTestNotification}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Bell size={14} />
              <span>{isUr ? 'ٹیسٹ الرٹ' : 'Test Alert'}</span>
            </button>
          ) : (
            <button
              onClick={requestNotifPermission}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Bell size={14} />
              <span>{isUr ? 'الرٹس آن کریں' : 'Enable Alerts'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Daily Prayer Times List / Grid */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2 relative">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 text-xs font-bold text-slate-500">
          <span>{isUr ? 'نماز کا نام' : 'Prayer Name'}</span>
          <div className="flex items-center gap-4">
            <span>{isUr ? 'اوقات' : 'Time'}</span>
            <span className="w-8 text-center">{isUr ? 'الرٹ' : 'Alert'}</span>
          </div>
        </div>

        {loadingTimings ? (
          <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
            <RotateCw size={16} className="animate-spin text-emerald-500" />
            <span>Loading prayer schedule...</span>
          </div>
        ) : timings ? (
          [
            { key: 'Fajr', label: 'Fajr', labelUrdu: 'فجر', time: timings.Fajr, icon: Sunrise, hasAlert: true },
            { key: 'Sunrise', label: 'Sunrise', labelUrdu: 'طلوعِ آفتاب', time: timings.Sunrise, icon: Sun, hasAlert: false },
            { key: 'Dhuhr', label: 'Dhuhr', labelUrdu: 'ظہر', time: timings.Dhuhr, icon: Sun, hasAlert: true },
            { key: 'Asr', label: 'Asr', labelUrdu: 'عصر', time: timings.Asr, icon: Sun, hasAlert: true },
            { key: 'Maghrib', label: 'Maghrib', labelUrdu: 'مغرب', time: timings.Maghrib, icon: Sunset, hasAlert: true },
            { key: 'Isha', label: 'Isha', labelUrdu: 'عشاء', time: timings.Isha, icon: Moon, hasAlert: true }
          ].map((item) => {
            const Icon = item.icon;
            const isCurrent = nextPrayer?.name === item.key;
            const isAlertEnabled = prayerAlerts[item.key] ?? true;

            return (
              <div
                key={item.key}
                className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                  isCurrent 
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-amber-300 font-bold shadow-xs' 
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-100 dark:border-slate-800 text-slate-800 dark:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isCurrent ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-serif block">{isUr ? item.labelUrdu : item.label}</span>
                    {isCurrent && (
                      <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold uppercase tracking-wider block">
                        {isUr ? 'اگلی نماز' : 'Next Prayer'}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm font-bold">{item.time}</span>
                  {item.hasAlert ? (
                    <button
                      onClick={() => toggleAlert(item.key)}
                      className={`p-2 rounded-lg transition-colors ${
                        isAlertEnabled 
                          ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30' 
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-400 hover:bg-slate-300'
                      }`}
                      title={isAlertEnabled ? 'Disable Alert' : 'Enable Alert'}
                    >
                      {isAlertEnabled ? <Bell size={14} /> : <BellOff size={14} />}
                    </button>
                  ) : (
                    <div className="w-8"></div>
                  )}
                </div>
              </div>
            );
          })
        ) : null}
      </div>

      {/* MONTHLY PRAYER TIMETABLE SECTION (Only rendered if showMonthlyTable is true) */}
      {showMonthlyTable && (
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          {/* Header & Month/Year Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <Calendar size={18} className="text-amber-500" />
                <span>{isUr ? 'ماہانہ نماز کا ٹائم ٹیبل' : 'Monthly Prayer Timetable'}</span>
              </h3>
              <p className="text-[10px] text-slate-400">
                {isUr ? 'پورے ماہ کے اوقاتِ نماز بشمول فقہ شافعی و حنفی عصر' : 'Complete month schedule with Shafi and Hanafi Asr timings'}
              </p>
            </div>

            {/* Month & Year Selectors */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-emerald-500 flex-1 sm:flex-none"
              >
                {monthNamesEn.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {isUr ? monthNamesUr[idx] : m}
                  </option>
                ))}
              </select>

              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1.5 text-xs font-bold text-slate-800 dark:text-white focus:ring-1 focus:ring-emerald-500"
              >
                {[2025, 2026, 2027].map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Timetable Table */}
          {loadingMonthly ? (
            <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Loading monthly prayer schedule...</span>
            </div>
          ) : monthlyData ? (
            <div className="overflow-x-auto rounded-xl border border-slate-100 dark:border-slate-800">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-emerald-950 text-white font-serif text-[10.5px]">
                    <th className="p-2.5 whitespace-nowrap">{isUr ? 'تاریخ' : 'Date'}</th>
                    <th className="p-2.5 text-center">{isUr ? 'فجر' : 'Fajr'}</th>
                    <th className="p-2.5 text-center text-amber-300">{isUr ? 'طلوع' : 'Sunrise'}</th>
                    <th className="p-2.5 text-center">{isUr ? 'ظہر' : 'Zuhr'}</th>
                    <th className="p-2.5 text-center bg-emerald-900 text-amber-200">{isUr ? 'عصر (شافعی)' : 'Asr (Shafi)'}</th>
                    <th className="p-2.5 text-center bg-emerald-900/90 text-amber-300">{isUr ? 'عصر (حنفی)' : 'Asr (Hanafi)'}</th>
                    <th className="p-2.5 text-center">{isUr ? 'مغرب' : 'Maghrib'}</th>
                    <th className="p-2.5 text-center">{isUr ? 'عشاء' : 'Isha'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                  {monthlyData.map((row) => {
                    const isToday =
                      row.dayNum === new Date().getDate() &&
                      selectedMonth === new Date().getMonth() + 1 &&
                      selectedYear === new Date().getFullYear();

                    return (
                      <tr
                        key={row.dayNum}
                        className={
                          isToday
                            ? 'bg-amber-500/15 dark:bg-amber-500/20 font-bold text-slate-900 dark:text-amber-300 border-l-4 border-amber-500'
                            : 'hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                        }
                      >
                        <td className="p-2.5 whitespace-nowrap">
                          <span className="font-bold">{row.dateStr}</span>
                          <span className="text-[9px] font-serif text-slate-400 block">{row.hijriStr}</span>
                        </td>
                        <td className="p-2.5 text-center">{row.fajr}</td>
                        <td className="p-2.5 text-center text-slate-400 dark:text-slate-500">{row.sunrise}</td>
                        <td className="p-2.5 text-center">{row.zuhr}</td>
                        <td className="p-2.5 text-center font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/40 dark:bg-emerald-950/20">
                          {row.asrShafi}
                        </td>
                        <td className="p-2.5 text-center font-bold text-amber-600 dark:text-amber-400 bg-amber-50/40 dark:bg-amber-950/20">
                          {row.asrHanafi}
                        </td>
                        <td className="p-2.5 text-center font-bold text-emerald-800 dark:text-emerald-300">{row.maghrib}</td>
                        <td className="p-2.5 text-center">{row.isha}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      )}

      {/* In-App Toast Notification */}
      <AnimatePresence>
        {alertToast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-slate-900 text-amber-300 border border-amber-500/40 px-4 py-2 rounded-2xl shadow-xl text-xs font-bold z-50 flex items-center gap-2"
          >
            <Sparkles size={14} className="text-amber-400 animate-spin" />
            <span>{alertToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location / Calculation Settings Modal */}
      <AnimatePresence>
        {showSettingsModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                  <Settings size={18} className="text-emerald-500" />
                  <span>{isUr ? 'مقام و اوقات کی ترتیبات' : 'Location & Calculation Settings'}</span>
                </h3>
                <button onClick={() => setShowSettingsModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400">
                  <X size={18} />
                </button>
              </div>

              {/* GPS Button */}
              <button
                onClick={handleDetectGPS}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Compass size={16} />
                <span>{isUr ? 'خودکار لوکیشن (GPS) سے وقت رکھیں' : 'Auto Detect Location (GPS)'}</span>
              </button>

              {/* Major Cities Select */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  {isUr ? 'مشہور شہر منتخب کریں:' : 'Select Major City:'}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-36 overflow-y-auto p-1 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800">
                  {MAJOR_CITIES.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleSelectCity(c.name, c.country)}
                      className={`p-2 rounded-lg text-xs font-bold transition-all border ${
                        setting.city === c.name && !setting.autoLocation
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-500'
                      }`}
                    >
                      {isUr ? c.ur : c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Search Form */}
              <form onSubmit={handleCustomCitySearch} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  {isUr ? 'یا نیا شہر تلاش کریں:' : 'Or Search City Name:'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={searchCity}
                    onChange={(e) => setSearchCity(e.target.value)}
                    placeholder={isUr ? 'مثال: Sahiwal, Multan, London' : 'e.g. Sahiwal, Multan, London'}
                    className="flex-1 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                  />
                  <button type="submit" className="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs rounded-xl">
                    {isUr ? 'تلاش' : 'Search'}
                  </button>
                </div>
              </form>

              {/* Calculation Method */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  {isUr ? 'طریقہ حساب (Method):' : 'Calculation Method:'}
                </label>
                <select
                  value={setting.method}
                  onChange={(e) => updateSettings({ ...setting, method: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  {CALC_METHODS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {isUr ? m.ur : m.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* School Select (Shafi vs Hanafi) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  {isUr ? 'فقہی مسلک (عصر کے لیے):' : 'Juristic School (for Asr):'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => updateSettings({ ...setting, school: 1 })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      setting.school === 1
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUr ? 'فقہ حنفی (متاخر)' : 'Hanafi (Standard PK)'}
                  </button>
                  <button
                    onClick={() => updateSettings({ ...setting, school: 0 })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                      setting.school === 0
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {isUr ? 'فقہ شافعی/مالکی/حنبلی' : 'Shafi / Mainstream'}
                  </button>
                </div>
              </div>

              {/* Hijri Adjustment */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-300 block">
                  {isUr ? 'قمری تاریخ میں کیلیبریشن (دن):' : 'Hijri Date Adjustment (Days):'}
                </label>
                <div className="flex items-center gap-2">
                  {[-2, -1, 0, 1, 2].map((adj) => (
                    <button
                      key={adj}
                      onClick={() => updateSettings({ ...setting, hijriAdjustment: adj })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold border ${
                        (setting.hijriAdjustment || 0) === adj
                          ? 'bg-emerald-600 text-white border-emerald-500'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      {adj > 0 ? `+${adj}` : adj}
                    </button>
                  ))}
                </div>
              </div>

              {/* Adhan Sound & Audio Alarm Settings */}
              <AdhanSoundSettingsControl isUr={isUr} />

              <div className="pt-2">
                <button
                  onClick={() => setShowSettingsModal(false)}
                  className="w-full py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {isUr ? 'محفوظ کریں اور بند کریں' : 'Save & Close'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
