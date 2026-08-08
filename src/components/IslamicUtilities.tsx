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
  TrendingUp
} from 'lucide-react';
import { PrayerTimeSetting, PrayerTimings, IslamicEvent, DuaItem } from '../types';
import { initialIslamicEvents, initialDuas } from '../data';
import { PrayerWidget } from './PrayerWidget';
import { PrayerTrackerDashboard } from './PrayerTrackerDashboard';
import { IslamicEventsCalendar } from './IslamicEventsCalendar';

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
  const [qiblaAngle, setQiblaAngle] = useState<number>(254); // Default Makkah angle from South Asia (~254 deg)
  const [distanceToMakkah, setDistanceToMakkah] = useState<number>(3350); // Approximate km
  const [compassPermissionNeeded, setCompassPermissionNeeded] = useState<boolean>(false);
  const [compassPermissionGranted, setCompassPermissionGranted] = useState<boolean>(false);

  // City coordinate map for offline / manual city Qibla calculations
  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'Karachi': { lat: 24.8607, lng: 67.0011 },
    'Lahore': { lat: 31.5204, lng: 74.3587 },
    'Islamabad': { lat: 33.6844, lng: 73.0479 },
    'Makkah': { lat: 21.3891, lng: 39.8579 },
    'Madinah': { lat: 24.5247, lng: 39.5692 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'Istanbul': { lat: 41.0082, lng: 28.9784 }
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

  // Save Prayer Settings
  useEffect(() => {
    localStorage.setItem('halqa_prayer_setting', JSON.stringify(setting));
    if (onUpdatePrayerSetting) onUpdatePrayerSetting(setting);
    fetchPrayerTimes();
  }, [setting]);

  // Fetch Prayer Times from Aladhan API or offline fallback
  const fetchPrayerTimes = async () => {
    setLoadingTimings(true);
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
          // Store in offline cache
          localStorage.setItem('halqa_cached_timings', JSON.stringify(data.data.timings));
          
          const h = data.data.date.hijri;
          const adjustedDay = parseInt(h.day) + setting.hijriAdjustment;
          setHijriDateString(`${adjustedDay} ${h.month.en} (${h.month.ar}) ${h.year} AH`);
          setLocationName(setting.autoLocation ? (data.data.meta.timezone || setting.city) : `${setting.city}, ${setting.country}`);
          setLoadingTimings(false);
          return;
        }
      }
    } catch (err) {
      console.warn('Network error fetching prayer times, using offline cache', err);
    }

    // Offline fallback
    const cached = localStorage.getItem('halqa_cached_timings');
    if (cached) {
      setTimings(JSON.parse(cached));
    } else {
      // Default offline timings for Karachi / South Asia
      setTimings({
        Fajr: '04:25',
        Sunrise: '05:48',
        Dhuhr: '12:35',
        Asr: '16:05',
        Sunset: '19:18',
        Maghrib: '19:18',
        Isha: '20:42',
        Imsak: '04:15',
        Midnight: '00:35',
        Firstthird: '22:15',
        Lastthird: '02:50'
      });
    }
    setHijriDateString('10 Safar 1448 AH');
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

  // Calculate Qibla Angle from Lat/Lng
  const calculateQibla = (lat: number, lng: number) => {
    const makkahLat = 21.4225 * (Math.PI / 180);
    const makkahLng = 39.8262 * (Math.PI / 180);
    const phi = lat * (Math.PI / 180);
    const lambda = lng * (Math.PI / 180);

    const y = Math.sin(makkahLng - lambda);
    const x = Math.cos(phi) * Math.tan(makkahLat) - Math.sin(phi) * Math.cos(makkahLng - lambda);
    let qibla = Math.atan2(y, x) * (180 / Math.PI);
    qibla = (qibla + 360) % 360;
    setQiblaAngle(Math.round(qibla));

    // Distance calculation
    const R = 6371; // km
    const dLat = makkahLat - phi;
    const dLon = makkahLng - lambda;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(phi) * Math.cos(makkahLat) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    setDistanceToMakkah(Math.round(R * c));
  };

  // Device Orientation Handler for Qibla Compass with iOS permission & webkitCompassHeading support
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
      // Sensor preference: iOS webkitCompassHeading directly provides magnetic heading (0..360)
      if (typeof (e as any).webkitCompassHeading !== 'undefined' && (e as any).webkitCompassHeading !== null) {
        compassHeading = (e as any).webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Standard Android/Web DeviceOrientationEvent
        compassHeading = (360 - e.alpha) % 360;
      }

      if (compassHeading !== null) {
        setHeading(Math.round((compassHeading + 360) % 360));
        setCompassPermissionGranted(true);
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
          alert(isUr ? 'کمپاس سنسر کی اجازت منظور نہیں کی گئی۔' : 'Compass sensor permission was not granted.');
        }
      } catch (err) {
        console.error('Compass permission error:', err);
        setCompassPermissionGranted(false);
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
            <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-5">
              <div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-emerald-700 dark:text-emerald-400 flex items-center justify-center gap-2">
                  <Compass size={20} className="text-amber-500" />
                  <span>{isUr ? 'قبلہ رخ نما (سنسر کمپاس)' : 'Qibla Direction Compass'}</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {isUr 
                    ? `مکہ مکرمہ کا زاویہ: ${qiblaAngle}° | فاصلہ: ${distanceToMakkah.toLocaleString()} کلومیٹر (${locationName})` 
                    : `Qibla Bearing: ${qiblaAngle}° from North | Distance: ${distanceToMakkah.toLocaleString()} km (${locationName})`}
                </p>
              </div>

              {/* IOS / Sensor Permission Callout if needed */}
              {compassPermissionNeeded && !compassPermissionGranted && (
                <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-left flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="space-y-0.5 text-xs text-amber-800 dark:text-amber-300">
                    <span className="font-bold block">{isUr ? 'کمپاس سنسر کی اجازت درکار ہے' : 'Compass Sensor Permission Required'}</span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400 block">
                      {isUr ? 'کمپاس کو ڈیوائس کی سمت معلوم کرنے کے لیے سنسر ایکسیس چاہیے' : 'Grant device orientation access to view live interactive compass movement.'}
                    </span>
                  </div>
                  <button
                    onClick={requestCompassPermission}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-lg shadow-xs shrink-0 whitespace-nowrap"
                  >
                    {isUr ? 'سنسر فعال کریں' : 'Enable Sensor'}
                  </button>
                </div>
              )}

              {/* Live Alignment Notification Banner */}
              {heading !== null && Math.abs(((heading - qiblaAngle + 540) % 360) - 180) <= 5 && (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="p-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-lg border border-emerald-400 flex items-center justify-center gap-2 animate-pulse"
                >
                  <Check size={18} />
                  <span>{isUr ? 'آپ کی ڈیوائس بالکل قبلہ رخ کی سمت میں ہے!' : 'Perfect Alignment! You are facing the Holy Kaaba.'}</span>
                </motion.div>
              )}

              {/* Enhanced Visual Compass Dial */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto flex items-center justify-center my-2">
                {/* Phone Top Direction Pointer (Fixed at top) */}
                <div className="absolute -top-3 z-20 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-amber-400 drop-shadow-md"></div>
                  <span className="text-[9px] font-bold text-amber-400 uppercase tracking-tighter bg-slate-900/90 px-1.5 py-0.5 rounded border border-amber-500/30">
                    {isUr ? 'فون کا سرا' : 'TOP'}
                  </span>
                </div>

                {/* Outer Brass Bezel */}
                <div className="w-full h-full rounded-full border-4 border-amber-500/40 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl relative flex items-center justify-center p-3 overflow-hidden">
                  
                  {/* Rotating Dial Plate (Rotates by -heading) */}
                  <div 
                    className="w-full h-full rounded-full relative flex items-center justify-center transition-transform duration-200 ease-out"
                    style={{ transform: `rotate(-${heading || 0}deg)` }}
                  >
                    {/* Degree Ticks around the circle (every 30 deg) */}
                    {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
                      <div 
                        key={deg}
                        className="absolute w-full h-full flex justify-center pt-1"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                        <div className={`w-0.5 ${deg % 90 === 0 ? 'h-3 bg-amber-400' : 'h-1.5 bg-slate-600'}`}></div>
                      </div>
                    ))}

                    {/* Cardinal Direction Labels */}
                    {/* NORTH (0°) */}
                    <div className="absolute top-2.5 flex flex-col items-center text-red-500">
                      <span className="font-mono font-black text-xs sm:text-sm leading-none">N</span>
                      <span className="text-[8px] font-serif font-bold leading-tight">{isUr ? 'شمال' : 'North'}</span>
                    </div>

                    {/* NORTH EAST (45°) */}
                    <div className="absolute w-full h-full flex justify-center pt-7" style={{ transform: 'rotate(45deg)' }}>
                      <span className="text-[9px] font-bold text-slate-500 font-mono">NE</span>
                    </div>

                    {/* EAST (90°) */}
                    <div className="absolute right-2.5 flex flex-col items-center text-emerald-400">
                      <span className="font-mono font-bold text-xs leading-none">E</span>
                      <span className="text-[8px] font-serif font-bold leading-tight">{isUr ? 'مشرق' : 'East'}</span>
                    </div>

                    {/* SOUTH EAST (135°) */}
                    <div className="absolute w-full h-full flex justify-center pb-7 items-end" style={{ transform: 'rotate(-45deg)' }}>
                      <span className="text-[9px] font-bold text-slate-500 font-mono">SE</span>
                    </div>

                    {/* SOUTH (180°) */}
                    <div className="absolute bottom-2.5 flex flex-col items-center text-slate-400">
                      <span className="text-[8px] font-serif font-bold leading-tight">{isUr ? 'جنوب' : 'South'}</span>
                      <span className="font-mono font-bold text-xs leading-none">S</span>
                    </div>

                    {/* SOUTH WEST (225°) */}
                    <div className="absolute w-full h-full flex justify-center pb-7 items-end" style={{ transform: 'rotate(45deg)' }}>
                      <span className="text-[9px] font-bold text-slate-500 font-mono">SW</span>
                    </div>

                    {/* WEST (270°) */}
                    <div className="absolute left-2.5 flex flex-col items-center text-emerald-400">
                      <span className="font-mono font-bold text-xs leading-none">W</span>
                      <span className="text-[8px] font-serif font-bold leading-tight">{isUr ? 'مغرب' : 'West'}</span>
                    </div>

                    {/* NORTH WEST (315°) */}
                    <div className="absolute w-full h-full flex justify-center pt-7" style={{ transform: 'rotate(-45deg)' }}>
                      <span className="text-[9px] font-bold text-slate-500 font-mono">NW</span>
                    </div>

                    {/* Kaaba Direction Indicator Needle */}
                    <div 
                      className="absolute w-full h-full flex justify-center items-center pointer-events-none"
                      style={{ transform: `rotate(${qiblaAngle}deg)` }}
                    >
                      <div className="w-1 h-1/2 bg-gradient-to-t from-transparent via-amber-400 to-amber-300 origin-bottom absolute bottom-1/2 rounded-full flex flex-col items-center shadow-[0_0_12px_rgba(251,191,36,0.8)]">
                        <div className="w-8 h-8 bg-amber-400 text-slate-950 font-bold rounded-full flex items-center justify-center text-xs shadow-xl -mt-4 border-2 border-slate-900 animate-bounce">
                          🕋
                        </div>
                      </div>
                    </div>

                    {/* Dial Center Pivot Pin */}
                    <div className="w-6 h-6 rounded-full bg-amber-400 border-2 border-slate-950 z-10 shadow-lg flex items-center justify-center text-[8px] text-slate-950 font-black">
                      {heading !== null ? `${heading}°` : `${qiblaAngle}°`}
                    </div>
                  </div>
                </div>
              </div>

              {/* Status Info & Calibration Options */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-100 dark:border-slate-800 text-left">
                  <span className="text-[10px] text-slate-400 block">{isUr ? 'ڈیوائس کا رخ (Heading)' : 'Current Heading'}</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
                    {heading !== null ? `${heading}°` : (isUr ? 'سنسر غیر فعال' : 'Sensor Inactive')}
                  </span>
                </div>

                <div className="p-2.5 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-800/60 text-left">
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">{isUr ? 'مطلوبہ سمتِ قبلہ' : 'Target Qibla Bearing'}</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-300 text-sm">
                    {qiblaAngle}° {isUr ? 'شمال سے' : 'from North'}
                  </span>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  onClick={handleDetectLocation}
                  className="flex-1 py-2 px-3 bg-emerald-800 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                >
                  <MapPin size={14} />
                  <span>{isUr ? 'مقام اپ ڈیٹ کریں (GPS)' : 'Update GPS Location'}</span>
                </button>

                <button
                  onClick={requestCompassPermission}
                  className="py-2 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-200 dark:border-slate-700 transition-colors"
                >
                  <RotateCcw size={14} />
                  <span>{isUr ? 'سنسر ری سیٹ' : 'Reset Sensor'}</span>
                </button>
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
