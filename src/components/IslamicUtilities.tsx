import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Clock, 
  Calendar, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  MapPin, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  BookOpen, 
  Sparkles, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Sun, 
  Moon, 
  Sunset, 
  Sunrise, 
  Info, 
  Settings, 
  Bell, 
  BellOff,
  Sliders,
  Maximize2,
  TrendingUp,
  WifiOff
} from 'lucide-react';
import { PrayerTimeSetting, PrayerTimings, IslamicEvent, DuaItem } from '../types';
import { initialIslamicEvents, initialDuas } from '../data';
import { PrayerWidget } from './PrayerWidget';
import { PrayerTrackerDashboard } from './PrayerTrackerDashboard';
import { IslamicEventsCalendar } from './IslamicEventsCalendar';
import { 
  calculateOfflineQibla, 
  calculateOfflinePrayerTimes, 
  savePrayerTimesToOfflineStorage, 
  getPrayerTimesFromOfflineStorage, 
  saveQiblaToOfflineStorage, 
  getQiblaFromOfflineStorage 
} from '../lib/offlinePrayerEngine';
import { OfflineLandmarksMap } from './OfflineLandmarksMap';

interface IslamicUtilitiesProps {
  language: 'ur' | 'en';
  prayerSetting?: PrayerTimeSetting;
  onUpdatePrayerSetting?: (setting: PrayerTimeSetting) => void;
  islamicEvents?: IslamicEvent[];
  duas?: DuaItem[];
}

export const IslamicUtilities: React.FC<IslamicUtilitiesProps> = ({
  language,
  prayerSetting: initialSetting,
  onUpdatePrayerSetting,
  islamicEvents = initialIslamicEvents,
  duas = initialDuas
}) => {
  const isUr = language === 'ur';

  // Active Tab: 'prayer' | 'tracker' | 'calendar' | 'qibla' | 'tasbeeh' | 'azkar'
  const [activeTab, setActiveTab] = useState<'prayer' | 'tracker' | 'calendar' | 'qibla' | 'tasbeeh' | 'azkar'>('prayer');

  // Prayer Settings & State
  const [setting, setSetting] = useState<PrayerTimeSetting>(() => {
    if (initialSetting) return initialSetting;
    const saved = localStorage.getItem('halqa_prayer_setting');
    return saved ? JSON.parse(saved) : {
      city: 'Karachi',
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
  const [searchCity, setSearchCity] = useState<string>('');

  // Monthly Calendar State
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

  // Fetch Monthly Prayer Timetable from Aladhan API (School=0 for Shafi, School=1 for Hanafi)
  const fetchMonthlyTimetable = async (month: number, year: number) => {
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
    const base = timings || {
      Fajr: '04:25', Sunrise: '05:48', Dhuhr: '12:35', Asr: '16:05', Maghrib: '19:18', Isha: '20:42'
    };

    for (let d = 1; d <= daysInMonth; d++) {
      fallbackList.push({
        dayNum: d,
        dateStr: `${String(d).padStart(2, '0')} ${monthNamesEn[month - 1].slice(0, 3)}`,
        hijriStr: `${d} Safar`,
        fajr: base.Fajr.split(' ')[0],
        sunrise: base.Sunrise.split(' ')[0],
        zuhr: base.Dhuhr.split(' ')[0],
        asrShafi: '15:30',
        asrHanafi: base.Asr.split(' ')[0],
        maghrib: base.Maghrib.split(' ')[0],
        isha: base.Isha.split(' ')[0]
      });
    }
    setMonthlyData(fallbackList);
    setLoadingMonthly(false);
  };

  useEffect(() => {
    fetchMonthlyTimetable(selectedMonth, selectedYear);
  }, [selectedMonth, selectedYear, setting]);

  // Local Push Notification & Prayer Alerts State
  const [prayerAlerts, setPrayerAlerts] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('halqa_prayer_alerts');
    return saved ? JSON.parse(saved) : {
      Fajr: true,
      Dhuhr: true,
      Asr: true,
      Maghrib: true,
      Isha: true
    };
  });
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(() => {
    return typeof Notification !== 'undefined' ? Notification.permission : 'denied';
  });
  const [alertToast, setAlertToast] = useState<{ title: string; message: string } | null>(null);

  // Auto-dismiss in-app notification feedback toast
  useEffect(() => {
    if (alertToast) {
      const timer = setTimeout(() => setAlertToast(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [alertToast]);

  // Request Web Notification Permission
  const requestNotifPermission = async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') {
      setAlertToast({
        title: isUr ? 'سپورٹ موجود نہیں' : 'Not Supported',
        message: isUr ? 'آپ کا براؤزر ویب نوٹیفکیشنز کو سپورٹ نہیں کرتا۔' : 'Web Notifications API is not supported in this browser.'
      });
      return false;
    }

    try {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === 'granted') {
        setAlertToast({
          title: isUr ? 'نوٹیفکیشن سگنل فعال' : 'Notifications Activated',
          message: isUr ? 'نماز کے لائیو پش الرٹس آن کر دیے گئے ہیں۔' : 'Prayer time push notifications have been activated.'
        });
        return true;
      } else if (perm === 'denied') {
        setAlertToast({
          title: isUr ? 'اجازت نہیں دی گئی' : 'Permission Denied',
          message: isUr ? 'براؤزر سیٹنگز سے نوٹیفکیشنز آن کریں۔' : 'Notification permission was denied in browser settings.'
        });
        return false;
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
    }
    return false;
  };

  // Dispatch Prayer Notification via Service Worker / Web Notification API
  const triggerPrayerNotification = (title: string, body: string, tag: string) => {
    // Play subtle audio alert tone
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      }
    } catch (e) {
      // Audio fallback silent
    }

    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'SHOW_PRAYER_NOTIFICATION',
        title,
        body,
        tag,
        icon: '/splash.jpg'
      });
    } else if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          tag,
          icon: '/splash.jpg',
          badge: '/splash.jpg',
          vibrate: [300, 100, 300]
        } as any);
      });
    } else if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/splash.jpg', tag });
    }
  };

  // Toggle alert for an individual prayer
  const togglePrayerAlert = async (prayerKey: string, prayerNameUrdu: string) => {
    if (notifPermission !== 'granted') {
      const granted = await requestNotifPermission();
      if (!granted) return;
    }

    const updated = {
      ...prayerAlerts,
      [prayerKey]: !prayerAlerts[prayerKey]
    };
    setPrayerAlerts(updated);
    localStorage.setItem('halqa_prayer_alerts', JSON.stringify(updated));

    const statusMsg = updated[prayerKey] 
      ? (isUr ? 'اذان الرٹ آن کر دیا گیا' : 'Notification Alert Enabled') 
      : (isUr ? 'اذان الرٹ بند کر دیا گیا' : 'Notification Alert Disabled');

    setAlertToast({
      title: `${prayerKey} (${prayerNameUrdu})`,
      message: statusMsg
    });
  };

  // Send Test Prayer Notification
  const handleTestNotification = async () => {
    if (notifPermission !== 'granted') {
      const granted = await requestNotifPermission();
      if (!granted) return;
    }

    triggerPrayerNotification(
      isUr ? '🕌 نمازِ ظہر کا وقت ہو گیا ہے' : '🕌 Time for Dhuhr Prayer',
      isUr ? `مقام: ${locationName} • ہللقہ اسلامی سہولیات` : `Location: ${locationName} • Halqa Islamic App`,
      'test-prayer-notification'
    );

    setAlertToast({
      title: isUr ? 'ٹیسٹ الرٹ روانہ کر دیا گیا' : 'Test Alert Sent',
      message: isUr ? 'اپنے ڈیوائس کے نوٹیفکیشن ٹرے میں چیک کریں۔' : 'Check your device notification tray to verify delivery.'
    });
  };

  // Background Periodic Checker for Daily Prayer Alerts
  useEffect(() => {
    if (!timings) return;

    const checkInterval = setInterval(() => {
      const now = new Date();
      const hrs = String(now.getHours()).padStart(2, '0');
      const mins = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${hrs}:${mins}`;
      const todayStr = now.toISOString().split('T')[0];

      const prayerMap: Record<string, { en: string; ur: string; time: string }> = {
        Fajr: { en: 'Fajr', ur: 'فجر', time: timings.Fajr },
        Dhuhr: { en: 'Dhuhr', ur: 'ظہر', time: timings.Dhuhr },
        Asr: { en: 'Asr', ur: 'عصر', time: timings.Asr },
        Maghrib: { en: 'Maghrib', ur: 'مغرب', time: timings.Maghrib },
        Isha: { en: 'Isha', ur: 'عشاء', time: timings.Isha }
      };

      Object.entries(prayerMap).forEach(([key, info]) => {
        if (!prayerAlerts[key]) return;
        if (!info.time) return;

        const cleanTime = info.time.trim().split(' ')[0];

        if (cleanTime === currentTimeStr) {
          const notifKey = `halqa_notified_${todayStr}_${key}`;
          if (!localStorage.getItem(notifKey)) {
            localStorage.setItem(notifKey, 'true');
            triggerPrayerNotification(
              isUr ? `🕌 نمازِ ${info.ur} کا وقت ہو گیا ہے` : `🕌 Time for ${info.en} Prayer`,
              isUr ? `اذان کا وقت: ${cleanTime} (${locationName})` : `Adhan Time: ${cleanTime} (${locationName})`,
              `prayer-${key}-${todayStr}`
            );
          }
        }
      });
    }, 15000);

    return () => clearInterval(checkInterval);
  }, [timings, prayerAlerts, locationName, isUr]);

  // Search cities preset list
  const popularCities = [
    { city: 'Karachi', country: 'Pakistan' },
    { city: 'Lahore', country: 'Pakistan' },
    { city: 'Islamabad', country: 'Pakistan' },
    { city: 'Makkah', country: 'Saudi Arabia' },
    { city: 'Madinah', country: 'Saudi Arabia' },
    { city: 'London', country: 'United Kingdom' },
    { city: 'New York', country: 'United States' },
    { city: 'Dubai', country: 'United Arab Emirates' },
    { city: 'Istanbul', country: 'Turkey' }
  ];

  // Tasbeeh State
  const [tasbeehCount, setTasbeehCount] = useState<number>(0);
  const [tasbeehTarget, setTasbeehTarget] = useState<number>(33);
  const [selectedDhikr, setSelectedDhikr] = useState<{ text: string; textUrdu: string; arabic: string }>({
    text: 'SubhanAllah',
    textUrdu: 'سبحان اللہ',
    arabic: 'سُبْحَانَ اللَّهِ'
  });
  const [tasbeehSound, setTasbeehSound] = useState<boolean>(true);

  // Qibla State & Sensor Logic
  const [heading, setHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [isManualMode, setIsManualMode] = useState<boolean>(false);
  const [hasSensorEvent, setHasSensorEvent] = useState<boolean>(false);
  const [showCalibrationGuide, setShowCalibrationGuide] = useState<boolean>(false);
  const [qiblaSound, setQiblaSound] = useState<boolean>(true);
  const [qiblaAngle, setQiblaAngle] = useState<number>(268); // Default Makkah angle from Karachi/Pakistan (~268 deg)
  const [distanceToMakkah, setDistanceToMakkah] = useState<number>(3300); // Approximate km
  const [compassPermissionNeeded, setCompassPermissionNeeded] = useState<boolean>(false);
  const [compassPermissionGranted, setCompassPermissionGranted] = useState<boolean>(false);

  // City coordinate map for offline / manual city Qibla calculations
  const cityCoordinates: Record<string, { lat: number; lng: number; country: string }> = {
    'Karachi': { lat: 24.8607, lng: 67.0011, country: 'Pakistan' },
    'Lahore': { lat: 31.5204, lng: 74.3587, country: 'Pakistan' },
    'Islamabad': { lat: 33.6844, lng: 73.0479, country: 'Pakistan' },
    'Rawalpindi': { lat: 33.5651, lng: 73.0169, country: 'Pakistan' },
    'Faisalabad': { lat: 31.4504, lng: 73.1350, country: 'Pakistan' },
    'Peshawar': { lat: 34.0151, lng: 71.5249, country: 'Pakistan' },
    'Multan': { lat: 30.1575, lng: 71.5249, country: 'Pakistan' },
    'Quetta': { lat: 30.1798, lng: 66.9750, country: 'Pakistan' },
    'Hyderabad': { lat: 25.3960, lng: 68.3578, country: 'Pakistan' },
    'Gujranwala': { lat: 32.1877, lng: 74.1945, country: 'Pakistan' },
    'Sialkot': { lat: 32.4945, lng: 74.5229, country: 'Pakistan' },
    'Sukkur': { lat: 27.7131, lng: 68.8492, country: 'Pakistan' },
    'Makkah': { lat: 21.3891, lng: 39.8579, country: 'Saudi Arabia' },
    'Madinah': { lat: 24.5247, lng: 39.5692, country: 'Saudi Arabia' },
    'Dubai': { lat: 25.2048, lng: 55.2708, country: 'UAE' },
    'London': { lat: 51.5074, lng: -0.1278, country: 'UK' },
    'New York': { lat: 40.7128, lng: -74.0060, country: 'USA' },
    'Istanbul': { lat: 41.0082, lng: 28.9784, country: 'Turkey' }
  };

  useEffect(() => {
    if (setting.autoLocation && setting.latitude && setting.longitude) {
      calculateQibla(setting.latitude, setting.longitude);
    } else if (cityCoordinates[setting.city]) {
      const coords = cityCoordinates[setting.city];
      calculateQibla(coords.lat, coords.lng);
    } else {
      calculateQibla(24.8607, 67.0011);
    }
  }, [setting]);

  // Duas State
  const [selectedDuaCat, setSelectedDuaCat] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Online / Offline Network Listener State
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

  // Save Prayer Settings
  useEffect(() => {
    localStorage.setItem('halqa_prayer_setting', JSON.stringify(setting));
    if (onUpdatePrayerSetting) onUpdatePrayerSetting(setting);
    fetchPrayerTimes();
  }, [setting]);

  // Fetch Prayer Times from Aladhan API or offline calculation engine
  const fetchPrayerTimes = async () => {
    setLoadingTimings(true);
    const dateKey = new Date().toISOString().split('T')[0];

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
        if (data.data && data.data.timings) {
          setTimings(data.data.timings);
          
          // Store in Service Worker / Local Storage Offline Cache
          localStorage.setItem('halqa_cached_timings', JSON.stringify(data.data.timings));
          savePrayerTimesToOfflineStorage(setting.city, dateKey, data.data.timings);
          
          const h = data.data.date.hijri;
          const adjustedDay = parseInt(h.day) + setting.hijriAdjustment;
          setHijriDateString(`${adjustedDay} ${h.month.en} (${h.month.ar}) ${h.year} AH`);
          setLocationName(setting.autoLocation ? (data.data.meta.timezone || setting.city) : `${setting.city}, ${setting.country}`);
          setLoadingTimings(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Network error fetching prayer times, using offline calculation engine', err);
    }

    // Offline fallback from local storage cache OR offline mathematical calculation
    const offlineCached = getPrayerTimesFromOfflineStorage(setting.city, dateKey);
    const legacyCached = localStorage.getItem('halqa_cached_timings');

    if (offlineCached) {
      setTimings(offlineCached);
    } else if (legacyCached) {
      setTimings(JSON.parse(legacyCached));
    } else {
      // Calculate exact solar prayer times offline using offline engine
      const lat = setting.latitude || (cityCoordinates[setting.city]?.lat ?? 24.8607);
      const lng = setting.longitude || (cityCoordinates[setting.city]?.lng ?? 67.0011);
      const isHanafi = setting.school === 1;
      const calculatedTimings = calculateOfflinePrayerTimes(lat, lng, new Date(), isHanafi);
      
      setTimings(calculatedTimings);
      savePrayerTimesToOfflineStorage(setting.city, dateKey, calculatedTimings);
    }

    setHijriDateString('27 Safar 1448 AH');
    setLocationName(setting.autoLocation ? 'Local GPS Location (Offline)' : `${setting.city}, ${setting.country}`);
    setLoadingTimings(false);
  };

  // GPS Location Trigger
  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          setSetting(prev => ({
            ...prev,
            autoLocation: true,
            latitude: lat,
            longitude: lng,
            city: 'Current GPS Location'
          }));
          calculateQibla(lat, lng);
        },
        (err) => {
          alert('Could not access GPS location. Please select your city manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser.');
    }
  };

  // Calculate Qibla Angle from Lat/Lng using Offline Qibla Engine
  const calculateQibla = (lat: number, lng: number) => {
    const qiblaRes = calculateOfflineQibla(lat, lng);
    setQiblaAngle(qiblaRes.qiblaAngle);
    setDistanceToMakkah(qiblaRes.distanceKm);

    // Save Qibla result to offline storage
    saveQiblaToOfflineStorage(setting.city, qiblaRes);
  };

  // Helper cardinal text display
  const getCardinalDirectionText = (angle: number, isUrdu: boolean) => {
    if (angle >= 337.5 || angle < 22.5) return isUrdu ? 'شمال (North)' : 'North (شمال)';
    if (angle >= 22.5 && angle < 67.5) return isUrdu ? 'شمال مشرق (NE)' : 'North-East (شمال مشرق)';
    if (angle >= 67.5 && angle < 112.5) return isUrdu ? 'مشرق (East)' : 'East (مشرق)';
    if (angle >= 112.5 && angle < 157.5) return isUrdu ? 'جنوب مشرق (SE)' : 'South-East (جنوب مشرق)';
    if (angle >= 157.5 && angle < 202.5) return isUrdu ? 'جنوب (South)' : 'South (جنوب)';
    if (angle >= 202.5 && angle < 247.5) return isUrdu ? 'جنوب مغرب (SW)' : 'South-West (جنوب مغرب)';
    if (angle >= 247.5 && angle < 292.5) return isUrdu ? 'مغرب (West)' : 'West (مغرب)';
    return isUrdu ? 'شمال مغرب (NW)' : 'North-West (شمال مغرب)';
  };

  // Web Audio Chime Sound for Perfect Alignment
  const playQiblaChime = () => {
    if (!qiblaSound) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.25); // G5

      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);

      if ('vibrate' in navigator) {
        navigator.vibrate([80, 40, 80]);
      }
    } catch (err) {
      // Audio not permitted or muted
    }
  };

  // Smooth test alignment animation for manual / desktop mode
  const handleTestAutoRotate = () => {
    setIsManualMode(true);
    const start = manualHeading;
    const target = qiblaAngle;
    const startTime = performance.now();
    const duration = 1200;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = Math.round((start + (target - start) * ease + 360) % 360);
      setManualHeading(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setManualHeading(target);
        playQiblaChime();
      }
    };
    requestAnimationFrame(animate);
  };

  // Quick City Selection directly in Qibla tab
  const handleSelectQiblaCity = (cityName: string) => {
    const c = cityCoordinates[cityName];
    if (c) {
      setSetting(prev => ({
        ...prev,
        city: cityName,
        country: c.country,
        autoLocation: false,
        latitude: c.lat,
        longitude: c.lng
      }));
      calculateQibla(c.lat, c.lng);
      setLocationName(`${cityName}, ${c.country}`);
    }
  };

  // Active heading calculation
  const activeHeading = isManualMode || heading === null ? manualHeading : heading;
  const isAligned = Math.abs(((activeHeading - qiblaAngle + 540) % 360) - 180) <= 5;

  // Sound chime trigger on alignment
  useEffect(() => {
    if (isAligned && activeTab === 'qibla') {
      playQiblaChime();
    }
  }, [isAligned, activeTab]);

  // Device Orientation Listener with iOS permission & webkitCompassHeading support
  useEffect(() => {
    if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      setCompassPermissionNeeded(true);
    } else {
      startCompassListener();
    }
  }, []);

  const startCompassListener = () => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;
      if (typeof (e as any).webkitCompassHeading !== 'undefined' && (e as any).webkitCompassHeading !== null) {
        compassHeading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        compassHeading = (360 - e.alpha) % 360;
      }

      if (compassHeading !== null) {
        setHeading(Math.round((compassHeading + 360) % 360));
        setCompassPermissionGranted(true);
        setHasSensorEvent(true);
      }
    };

    const win = window as any;
    if ('ondeviceorientationabsolute' in win) {
      win.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else if (win.DeviceOrientationEvent) {
      win.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const requestCompassPermission = async () => {
    if (typeof (DeviceOrientationEvent as any) !== 'undefined' && typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setCompassPermissionGranted(true);
          setCompassPermissionNeeded(false);
          startCompassListener();
        } else {
          setCompassPermissionGranted(false);
          setIsManualMode(true);
          alert(isUr ? 'کمپاس سنسر کی اجازت نہیں ملی۔ آپ دستی (Manual) موڈ استعمال کر سکتے ہیں۔' : 'Compass sensor permission not granted. You can use Manual Dial mode.');
        }
      } catch (err) {
        console.error('Compass permission error:', err);
        setCompassPermissionGranted(false);
        setIsManualMode(true);
      }
    } else {
      startCompassListener();
    }
  };

  // Countdown to Next Prayer Timer
  useEffect(() => {
    if (!timings) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      const parseTimeToMinutes = (tStr: string): number => {
        if (!tStr) return 0;
        const timeOnly = tStr.trim().split(' ')[0];
        const parts = timeOnly.split(':');
        const h = parseInt(parts[0], 10) || 0;
        const m = parseInt(parts[1], 10) || 0;
        return h * 60 + m;
      };

      const pList = [
        { name: 'Fajr', nameUrdu: 'فجر', time: timings.Fajr },
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
    }, 1000);

    return () => clearInterval(interval);
  }, [timings]);

  // Handle Tasbeeh Click
  const handleTasbeehIncrement = () => {
    const newCount = tasbeehCount + 1;
    setTasbeehCount(newCount);

    if (tasbeehSound && 'vibrate' in navigator) {
      navigator.vibrate(25);
    }
  };

  return (
    <div className="w-full space-y-4 text-left">
      {/* Top Module Header & Navigation Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-white p-4 rounded-2xl shadow-md border border-emerald-800/40">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-emerald-800/80 rounded-xl text-amber-300 border border-amber-500/30">
              <Compass size={22} />
            </div>
            <div>
              <h2 className="font-serif font-bold text-sm sm:text-base text-white">
                {isUr ? 'اسلامی سہولیات و اوقاتِ نماز' : 'Islamic Utilities & Prayer Suite'}
              </h2>
              <p className="text-[10px] text-emerald-200/80">
                {locationName} • {hijriDateString}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-amber-400 rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5 text-xs font-bold"
            title="Prayer & Location Settings"
          >
            <Settings size={16} />
            <span className="hidden sm:inline">{isUr ? 'ترتیبات' : 'Settings'}</span>
          </button>
        </div>

        {/* Offline Status Banner */}
        {isOffline && (
          <div className="mb-3 bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between gap-2 shadow-xs">
            <div className="flex items-center gap-2">
              <WifiOff size={16} className="text-amber-500 shrink-0 animate-pulse" />
              <span>{isUr ? 'آف لائن موڈ فعال ہے — قبلہ کمپاس اور اوقاتِ نماز لوکل کیش اور ڈیوائس سنسر سے چالو ہیں۔' : 'Offline Mode Active — Prayer times & Qibla compass are running via Service Worker & local cache.'}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/40 shrink-0 font-extrabold">Offline Engine</span>
          </div>
        )}

        {/* Tab Navigation Pill bar */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
          {[
            { id: 'prayer', label: isUr ? 'نماز' : 'Prayer', icon: Clock },
            { id: 'tracker', label: isUr ? 'کارکردگی 📊' : 'Tracker 📊', icon: TrendingUp },
            { id: 'calendar', label: isUr ? 'تقویم' : 'Calendar', icon: Calendar },
            { id: 'qibla', label: isUr ? 'قبلہ' : 'Qibla', icon: Compass },
            { id: 'tasbeeh', label: isUr ? 'تسبیح' : 'Tasbeeh', icon: Sparkles },
            { id: 'azkar', label: isUr ? 'اذکار' : 'Azkar', icon: BookOpen }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg text-[10px] sm:text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-700 text-white shadow-sm border border-emerald-500/50' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-amber-300' : ''} />
                <span className="mt-0.5 leading-none">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Panels Content */}
      <AnimatePresence mode="wait">
        
        {/* ================= 1. PRAYER TIMINGS TAB ================= */}
        {activeTab === 'prayer' && (
          <motion.div
            key="prayer-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            <PrayerWidget isUr={isUr} currentUserCity={setting.city} showMonthlyTable={true} />
          </motion.div>
        )}

        {/* ================= PRAYER PERFORMANCE TRACKER TAB ================= */}
        {activeTab === 'tracker' && (
          <motion.div
            key="tracker-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <PrayerTrackerDashboard isUr={isUr} />
          </motion.div>
        )}

        {/* ================= 2. HIJRI CALENDAR TAB ================= */}
        {activeTab === 'calendar' && (
          <motion.div
            key="calendar-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Interactive Monthly Grid Islamic Events Calendar Component */}
            <IslamicEventsCalendar
              language={language}
              events={islamicEvents}
              hijriAdjustment={setting.hijriAdjustment}
            />
          </motion.div>
        )}

        {/* ================= 3. QIBLA COMPASS TAB ================= */}
        {activeTab === 'qibla' && (
          <motion.div
            key="qibla-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 text-center"
          >
            <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
              
              {/* Header Title & City Selector */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/80 pb-3">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-emerald-700 dark:text-emerald-400 flex items-center gap-2">
                    <Compass size={22} className="text-amber-500 animate-spin-slow" />
                    <span>{isUr ? 'قبلہ رخ نما (کامل سمتی کمپاس)' : 'Qibla Direction Compass'}</span>
                  </h3>

                  {/* Inline Quick City Selector */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <MapPin size={14} className="text-emerald-500 shrink-0" />
                    <select
                      value={setting.city in cityCoordinates ? setting.city : 'Karachi'}
                      onChange={(e) => handleSelectQiblaCity(e.target.value)}
                      className="bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 font-bold text-xs cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      {Object.keys(cityCoordinates).map((cName) => (
                        <option key={cName} value={cName}>
                          {cName} ({cityCoordinates[cName].country})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-300">
                  <span>
                    {isUr ? 'مطلوبہ زاویہ:' : 'Qibla Angle:'} <strong className="text-amber-600 dark:text-amber-400 font-mono">{qiblaAngle}°</strong> ({getCardinalDirectionText(qiblaAngle, isUr)})
                  </span>
                  <span>•</span>
                  <span>
                    {isUr ? 'کعبہ کا فاصلہ:' : 'Distance to Kaaba:'} <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{distanceToMakkah.toLocaleString()} km</strong>
                  </span>
                </div>
              </div>

              {/* Mode Switch Pill Bar */}
              <div className="flex items-center justify-between gap-2 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-1 flex-1">
                  <button
                    onClick={() => setIsManualMode(false)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      !isManualMode
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>🛰️</span>
                    <span>{isUr ? 'سنسر موڈ (Live)' : 'Sensor Mode'}</span>
                  </button>

                  <button
                    onClick={() => setIsManualMode(true)}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                      isManualMode
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    <span>🎛️</span>
                    <span>{isUr ? 'دستی موڈ (Manual)' : 'Manual Mode'}</span>
                  </button>
                </div>

                <button
                  onClick={() => setQiblaSound(!qiblaSound)}
                  className={`p-1.5 rounded-lg border transition-colors shrink-0 ${
                    qiblaSound ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-slate-200 dark:bg-slate-700 text-slate-500 border-slate-300 dark:border-slate-600'
                  }`}
                  title={isUr ? 'آواز بند/کھولیں' : 'Toggle Audio Chime'}
                >
                  {qiblaSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Live Sensor Callout / Notice */}
              {compassPermissionNeeded && !compassPermissionGranted && !isManualMode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-bold block">{isUr ? 'کمپاس سنسر کی اجازت درکار ہے' : 'Compass Sensor Permission Required'}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                      {isUr ? 'کمپاس کو لائیو سمت معلوم کرنے کے لیے ڈیوائس سنسر کی اجازت دیں۔' : 'Grant sensor access for real-time mobile orientation.'}
                    </span>
                  </div>
                  <button
                    onClick={requestCompassPermission}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shrink-0"
                  >
                    {isUr ? 'سنسر فعال کریں' : 'Enable Sensor'}
                  </button>
                </div>
              )}

              {/* Perfect Alignment Banner */}
              {isAligned && (
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-3 bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-400 flex items-center justify-center gap-2 animate-pulse"
                >
                  <Check size={20} className="text-amber-300 shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {isUr ? 'قِبلہ کا درست رخ متصل ہے! (آپ کا رخ بالکل خانہ کعبہ کی سمت میں ہے)' : 'Perfect Alignment! You are facing the Holy Kaaba 🕋.'}
                  </span>
                </motion.div>
              )}

              {/* Enhanced Visual Compass Dial */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-3 select-none">
                
                {/* Fixed TOP Phone Marker */}
                <div className="absolute -top-3.5 z-30 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-b-[14px] border-b-amber-400 drop-shadow-md"></div>
                  <span className="text-[8px] font-black text-amber-300 uppercase tracking-wider bg-slate-950/90 px-2 py-0.5 rounded border border-amber-500/40 shadow-sm">
                    {isUr ? 'فون کا رخ (TOP)' : 'TOP OF DEVICE'}
                  </span>
                </div>

                {/* Bezel Ring */}
                <div className={`w-full h-full rounded-full border-4 ${
                  isAligned ? 'border-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.6)]' : 'border-amber-500/40 shadow-2xl'
                } bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 relative flex items-center justify-center p-3 overflow-hidden transition-all duration-300`}>
                  
                  {/* Rotating Dial Plate */}
                  <div 
                    className="w-full h-full rounded-full relative flex items-center justify-center transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(-${activeHeading}deg)` }}
                  >
                    {/* Degree Ticks around circle */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                      <div 
                        key={deg}
                        className="absolute w-full h-full flex justify-center pt-1"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                        <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3.5 bg-amber-400' : 'h-2 bg-slate-600'}`}></div>
                      </div>
                    ))}

                    {/* Cardinal Labels */}
                    <div className="absolute top-2 flex flex-col items-center text-red-500 font-mono font-black text-xs sm:text-sm">
                      N
                      <span className="text-[8px] font-serif font-bold text-red-400">{isUr ? 'شمال' : 'North'}</span>
                    </div>

                    <div className="absolute right-2 flex flex-col items-center text-emerald-400 font-mono font-bold text-xs">
                      E
                      <span className="text-[8px] font-serif text-emerald-300">{isUr ? 'مشرق' : 'East'}</span>
                    </div>

                    <div className="absolute bottom-2 flex flex-col items-center text-slate-400 font-mono font-bold text-xs">
                      <span className="text-[8px] font-serif text-slate-300">{isUr ? 'جنوب' : 'South'}</span>
                      S
                    </div>

                    <div className="absolute left-2 flex flex-col items-center text-emerald-400 font-mono font-bold text-xs">
                      W
                      <span className="text-[8px] font-serif text-emerald-300">{isUr ? 'مغرب' : 'West'}</span>
                    </div>

                    {/* Kaaba Direction Beam Needle */}
                    <div 
                      className="absolute w-full h-full flex justify-center items-center pointer-events-none"
                      style={{ transform: `rotate(${qiblaAngle}deg)` }}
                    >
                      <div className="w-1.5 h-1/2 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 origin-bottom absolute bottom-1/2 rounded-full flex flex-col items-center shadow-[0_0_15px_rgba(251,191,36,0.9)]">
                        <div className="w-9 h-9 bg-gradient-to-br from-amber-300 to-amber-500 text-slate-950 font-black rounded-full flex items-center justify-center text-sm shadow-xl -mt-4 border-2 border-slate-950 animate-pulse">
                          🕋
                        </div>
                      </div>
                    </div>

                    {/* Pivot Pin */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-300 to-amber-500 border-2 border-slate-950 z-20 shadow-lg flex items-center justify-center text-[9px] text-slate-950 font-black">
                      {activeHeading}°
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Manual Controls / Dial Angle Slider */}
              {isManualMode && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-900 dark:text-amber-300 font-bold">
                    <span>{isUr ? 'ڈائل کو موڑیں (توجیہ):' : 'Rotate Compass Dial Manually:'}</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400">{manualHeading}° ({getCardinalDirectionText(manualHeading, isUr)})</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={manualHeading}
                    onChange={(e) => setManualHeading(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => setManualHeading((prev) => (prev + 345) % 360)}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-bold"
                    >
                      -15°
                    </button>
                    <button
                      onClick={handleTestAutoRotate}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded shadow-xs flex items-center gap-1.5"
                    >
                      <span>🎯</span>
                      <span>{isUr ? 'قبلہ کی طرف خودکار الائنمنٹ ٹیسٹ' : 'Test Auto Alignment'}</span>
                    </button>
                    <button
                      onClick={() => setManualHeading((prev) => (prev + 15) % 360)}
                      className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 rounded text-xs font-bold"
                    >
                      +15°
                    </button>
                  </div>
                </div>
              )}

              {/* Info Badges */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
                  <span className="text-[10px] text-slate-400 block">{isUr ? 'موجودہ زاوِیہ (Current)' : 'Current Heading'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm">
                    {activeHeading}° ({getCardinalDirectionText(activeHeading, isUr)})
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/60 text-left">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">{isUr ? 'مطلوبہ قبلہ رخ (Target)' : 'Target Qibla Bearing'}</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm">
                    {qiblaAngle}° ({getCardinalDirectionText(qiblaAngle, isUr)})
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleDetectLocation}
                  className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MapPin size={14} />
                  <span>{isUr ? 'جی پی ایس مقام (GPS)' : 'Update GPS Location'}</span>
                </button>

                <button
                  onClick={() => setShowCalibrationGuide(!showCalibrationGuide)}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <Info size={14} className="text-amber-500" />
                  <span>{isUr ? 'کیلیبریشن رہنمائی' : 'Calibration Guide'}</span>
                </button>
              </div>

              {/* Collapsible Calibration Instructions */}
              {showCalibrationGuide && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="p-3 bg-slate-900 text-slate-200 rounded-xl text-xs text-right space-y-2 border border-slate-800 text-left font-serif leading-relaxed"
                >
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5 border-b border-slate-800 pb-1">
                    <Info size={14} />
                    <span>{isUr ? 'کمپاس سنسر کی درستگی اور رہنمائی:' : 'Compass Sensor Calibration & Tips:'}</span>
                  </h4>
                  <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                    <li>{isUr ? 'موبائل سنسر کو کیلیبریٹ کرنے کے لیے فون کو ہوا میں انگریزی کے "8" کے ہندسے کی شکل میں 2 سے 3 بار گھمائیں۔' : 'Calibrate sensor by waving phone in a Figure-8 motion 2-3 times in the air.'}</li>
                    <li>{isUr ? 'فون کو لیپ ٹاپ، میگنیٹ یا لوہے کی اشیاء کے بالکل قریب نہ رکھیں۔' : 'Keep device away from laptops, speakers, or large magnetic/metal objects.'}</li>
                    <li>{isUr ? 'اگر ڈیوائس کا میگنیٹو میٹر نہ ہو تو "دستی موڈ (Manual Mode)" کا استعمال کریں۔' : 'Use Manual Mode if your device lacks a hardware compass sensor.'}</li>
                  </ul>
                </motion.div>
              )}

              {/* Integrated Offline Vector Map & Historic Landmarks Engine */}
              <div className="pt-2">
                <OfflineLandmarksMap 
                  isUr={isUr} 
                  currentSelectedCity={setting.city}
                  onSelectLocation={(city, country, lat, lng) => {
                    const newSetting: PrayerTimeSetting = {
                      ...setting,
                      city,
                      country,
                      latitude: lat,
                      longitude: lng,
                      autoLocation: false
                    };
                    setSetting(newSetting);
                    if (onUpdatePrayerSetting) onUpdatePrayerSetting(newSetting);
                    calculateQibla(lat, lng);
                  }}
                />
              </div>

            </div>
          </motion.div>
        )}

        {/* ================= 4. DIGITAL TASBEEH TAB ================= */}
        {activeTab === 'tasbeeh' && (
          <motion.div
            key="tasbeeh-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4 text-center"
          >
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-5">
              {/* Dhikr Selector */}
              <div className="flex justify-between items-center gap-2">
                <div className="text-left">
                  <span className="text-[10px] text-amber-400 font-mono block">{isUr ? 'منتخب ذکر' : 'Selected Dhikr'}</span>
                  <h4 className="font-serif font-bold text-base text-amber-300">{selectedDhikr.arabic}</h4>
                </div>

                <button
                  onClick={() => setTasbeehSound(!tasbeehSound)}
                  className={`p-2 rounded-xl border transition-colors ${tasbeehSound ? 'bg-emerald-900 text-emerald-300 border-emerald-700' : 'bg-slate-800 text-slate-400 border-slate-700'}`}
                  title="Toggle Haptic Feedback"
                >
                  {tasbeehSound ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>
              </div>

              {/* Counter Display & Target Progress */}
              <div className="py-6 bg-slate-950/80 rounded-2xl border border-slate-800/80 space-y-1 shadow-inner">
                <div className="text-5xl sm:text-6xl font-black font-mono text-emerald-400 tracking-wider">
                  {tasbeehCount}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Target Goal: <span className="text-amber-400 font-bold">{tasbeehTarget || 33}</span> | Round: {Math.floor(tasbeehCount / (tasbeehTarget || 1)) + 1}
                </div>
              </div>

              {/* Big Interactive Tap Counter Button */}
              <button
                onClick={handleTasbeehIncrement}
                className="w-full py-10 bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 hover:from-emerald-700 hover:to-emerald-600 active:scale-98 text-white rounded-2xl font-bold text-lg shadow-xl border border-emerald-500/50 flex flex-col items-center justify-center gap-1 transition-all"
              >
                <Sparkles size={28} className="text-amber-300 animate-pulse" />
                <span>{isUr ? 'تسبیح کے لیے یہاں ٹیپ کریں' : 'TAP HERE TO COUNT'}</span>
              </button>

              {/* Action Controls (Reset & Goal targets) */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex gap-1.5">
                  {[33, 100, 1000].map(tgt => (
                    <button
                      key={tgt}
                      onClick={() => setTasbeehTarget(tgt)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        tasbeehTarget === tgt ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      {tgt}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setTasbeehCount(0)}
                  className="px-3 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <RotateCcw size={12} /> {isUr ? 'ریسیٹ' : 'Reset'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ================= 5. DAILY DUAS & AZKAR TAB ================= */}
        {activeTab === 'azkar' && (
          <motion.div
            key="azkar-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-4"
          >
            {/* Category Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {[
                { id: 'all', label: isUr ? 'تمام مسنون دعائیں' : 'All Duas' },
                { id: 'morning_evening', label: isUr ? 'صبح و شام' : 'Morning & Evening' },
                { id: 'daily_life', label: isUr ? 'روزمرہ دعائیں' : 'Daily Life' },
                { id: 'forgiveness', label: isUr ? 'استغفار' : 'Forgiveness' },
                { id: 'ramadan', label: isUr ? 'رمضان المبارک' : 'Ramadan' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedDuaCat(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                    selectedDuaCat === cat.id 
                      ? 'bg-emerald-800 text-white border-emerald-600 shadow-xs' 
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* List of Duas */}
            <div className="space-y-3">
              {duas
                .filter(d => selectedDuaCat === 'all' || d.category === selectedDuaCat)
                .map((dua) => (
                  <div key={dua.id} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h4 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400">{dua.title}</h4>
                        <span className="text-xs text-amber-600 dark:text-amber-400 font-serif">{dua.titleUrdu}</span>
                      </div>

                      <button
                        onClick={() => {
                          const text = `${dua.title}\n\n${dua.arabicText}\n\n${dua.translation}`;
                          navigator.clipboard.writeText(text);
                          setCopiedId(dua.id);
                          setTimeout(() => setCopiedId(null), 2000);
                        }}
                        className="p-2 text-slate-400 hover:text-emerald-600 rounded-lg"
                        title="Copy Dua"
                      >
                        {copiedId === dua.id ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                      </button>
                    </div>

                    {/* Arabic Calligraphy Box */}
                    <div className="p-4 bg-emerald-50/50 dark:bg-slate-950/80 rounded-xl border border-emerald-100 dark:border-slate-800/80 text-right">
                      <p className="font-serif text-lg sm:text-xl text-slate-900 dark:text-amber-300 leading-loose">
                        {dua.arabicText}
                      </p>
                    </div>

                    {/* Translation */}
                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      <p className="italic">{dua.translation}</p>
                      <p className="text-right font-serif text-amber-700 dark:text-amber-400">{dua.translationUrdu}</p>
                    </div>

                    {/* Reference & Virtues */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                      <span>Ref: {dua.reference}</span>
                      {dua.virtues && <span className="text-emerald-600 dark:text-emerald-400">{dua.virtues}</span>}
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Settings Modal (City & Calculation Method) */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 text-left shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-sm text-emerald-800 dark:text-emerald-400">
                {isUr ? 'اوقاتِ نماز و مقام کی ترتیبات' : 'Prayer Times & Location Settings'}
              </h3>
              <button 
                onClick={() => setShowSettingsModal(false)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* GPS Auto Detect */}
            <button
              onClick={handleDetectLocation}
              className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <MapPin size={16} />
              <span>{isUr ? 'GPS سے خودکار مقام معلوم کریں' : 'Auto-Detect Location via GPS'}</span>
            </button>

            {/* Manual City Select */}
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-400 block uppercase">
                {isUr ? 'یا شہر منتخب کریں' : 'Or Select City Worldwide'}
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {popularCities.map((pc) => (
                  <button
                    key={pc.city}
                    onClick={() => {
                      setSetting(prev => ({
                        ...prev,
                        city: pc.city,
                        country: pc.country,
                        autoLocation: false
                      }));
                      setShowSettingsModal(false);
                    }}
                    className={`p-2 rounded-xl text-[11px] font-bold border text-center transition-all ${
                      setting.city === pc.city ? 'bg-amber-400 text-slate-950 border-amber-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {pc.city}
                  </button>
                ))}
              </div>
            </div>

            {/* Juristic & Calculation Method */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="text-[10px] font-bold text-slate-400 block mb-1">
                  Calculation Method (طریقہ حساب)
                </label>
                <select
                  value={setting.method}
                  onChange={(e) => setSetting({ ...setting, method: parseInt(e.target.value) })}
                  className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                >
                  <option value={1}>University of Islamic Sciences, Karachi (حنافی)</option>
                  <option value={2}>Islamic Society of North America (ISNA)</option>
                  <option value={3}>Muslim World League (MWL)</option>
                  <option value={4}>Umm Al-Qura University, Makkah</option>
                  <option value={5}>Egyptian General Authority of Survey</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Asr School (عصر فقه)</label>
                  <select
                    value={setting.school}
                    onChange={(e) => setSetting({ ...setting, school: parseInt(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                  >
                    <option value={1}>Hanafi (حنافی)</option>
                    <option value={0}>Shafi / Maliki / Hanbali</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-400 block mb-1">Hijri Moon Offset (+/-)</label>
                  <select
                    value={setting.hijriAdjustment}
                    onChange={(e) => setSetting({ ...setting, hijriAdjustment: parseInt(e.target.value) })}
                    className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-white"
                  >
                    <option value={-2}>-2 Days</option>
                    <option value={-1}>-1 Day</option>
                    <option value={0}>0 Days (Default)</option>
                    <option value={1}>+1 Day</option>
                    <option value={2}>+2 Days</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs mt-2"
            >
              Done & Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
