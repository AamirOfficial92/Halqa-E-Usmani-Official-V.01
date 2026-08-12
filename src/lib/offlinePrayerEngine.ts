/**
 * Offline Prayer & Qibla Calculation Engine
 * Provides offline astronomical calculations for prayer times and Qibla bearings,
 * as well as IndexedDB/LocalStorage caching utilities.
 */

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak: string;
  Midnight: string;
}

export interface QiblaResult {
  qiblaAngle: number;
  distanceKm: number;
  cardinalUrdu: string;
  cardinalEn: string;
}

export interface CityCoord {
  name: string;
  nameUrdu: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
  defaultMethod?: number;
}

export const POPULAR_CITIES: Record<string, CityCoord> = {
  'Karachi': { name: 'Karachi', nameUrdu: 'کراچی', country: 'Pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Lahore': { name: 'Lahore', nameUrdu: 'لاہور', country: 'Pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Islamabad': { name: 'Islamabad', nameUrdu: 'اسلام آباد', country: 'Pakistan', lat: 33.6844, lng: 73.0479, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Rawalpindi': { name: 'Rawalpindi', nameUrdu: 'راولپنڈی', country: 'Pakistan', lat: 33.5651, lng: 73.0169, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Faisalabad': { name: 'Faisalabad', nameUrdu: 'فیصل آباد', country: 'Pakistan', lat: 31.4504, lng: 73.1350, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Peshawar': { name: 'Peshawar', nameUrdu: 'پشاور', country: 'Pakistan', lat: 34.0151, lng: 71.5249, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Multan': { name: 'Multan', nameUrdu: 'ملتان', country: 'Pakistan', lat: 30.1575, lng: 71.5249, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Quetta': { name: 'Quetta', nameUrdu: 'کوئٹہ', country: 'Pakistan', lat: 30.1798, lng: 66.9750, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Hyderabad': { name: 'Hyderabad', nameUrdu: 'حیدرآباد', country: 'Pakistan', lat: 25.3960, lng: 68.3578, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Gujranwala': { name: 'Gujranwala', nameUrdu: 'گوجرانوالہ', country: 'Pakistan', lat: 32.1877, lng: 74.1945, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Sialkot': { name: 'Sialkot', nameUrdu: 'سیالکوٹ', country: 'Pakistan', lat: 32.4945, lng: 74.5229, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Sukkur': { name: 'Sukkur', nameUrdu: 'سکھر', country: 'Pakistan', lat: 27.7131, lng: 68.8492, timezone: 'Asia/Karachi', defaultMethod: 1 },
  'Makkah': { name: 'Makkah', nameUrdu: 'مکہ مکرمہ', country: 'Saudi Arabia', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh', defaultMethod: 4 },
  'Madinah': { name: 'Madinah', nameUrdu: 'مدینہ منورہ', country: 'Saudi Arabia', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh', defaultMethod: 4 },
  'Dubai': { name: 'Dubai', nameUrdu: 'دبئی', country: 'UAE', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', defaultMethod: 4 },
  'London': { name: 'London', nameUrdu: 'لندن', country: 'UK', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', defaultMethod: 3 },
  'New York': { name: 'New York', nameUrdu: 'نیویارک', country: 'USA', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', defaultMethod: 2 },
  'Istanbul': { name: 'Istanbul', nameUrdu: 'استنبول', country: 'Turkey', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', defaultMethod: 13 }
};

/**
 * Calculates exact Qibla direction angle (from True North) and distance to Kaaba in km.
 */
export function calculateOfflineQibla(lat: number, lng: number): QiblaResult {
  const makkahLat = 21.4225 * (Math.PI / 180);
  const makkahLng = 39.8262 * (Math.PI / 180);
  const phi = lat * (Math.PI / 180);
  const lambda = lng * (Math.PI / 180);

  const dLng = makkahLng - lambda;
  const y = Math.sin(dLng);
  const x = Math.cos(phi) * Math.tan(makkahLat) - Math.sin(phi) * Math.cos(dLng);
  let qiblaRad = Math.atan2(y, x);
  let qiblaDeg = qiblaRad * (180 / Math.PI);
  qiblaDeg = Math.round((qiblaDeg + 360) % 360);

  // Distance calculation via Haversine formula
  const R = 6371; // Earth's mean radius in km
  const dLat = makkahLat - phi;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(phi) * Math.cos(makkahLat) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = Math.round(R * c);

  // Cardinal directions
  let cardinalUrdu = 'شمال مغرب (NW)';
  let cardinalEn = 'North-West (NW)';

  if (qiblaDeg >= 337.5 || qiblaDeg < 22.5) {
    cardinalUrdu = 'شمال (North)';
    cardinalEn = 'North (N)';
  } else if (qiblaDeg >= 22.5 && qiblaDeg < 67.5) {
    cardinalUrdu = 'شمال مشرق (NE)';
    cardinalEn = 'North-East (NE)';
  } else if (qiblaDeg >= 67.5 && qiblaDeg < 112.5) {
    cardinalUrdu = 'مشرق (East)';
    cardinalEn = 'East (E)';
  } else if (qiblaDeg >= 112.5 && qiblaDeg < 157.5) {
    cardinalUrdu = 'جنوب مشرق (SE)';
    cardinalEn = 'South-East (SE)';
  } else if (qiblaDeg >= 157.5 && qiblaDeg < 202.5) {
    cardinalUrdu = 'جنوب (South)';
    cardinalEn = 'South (S)';
  } else if (qiblaDeg >= 202.5 && qiblaDeg < 247.5) {
    cardinalUrdu = 'جنوب مغرب (SW)';
    cardinalEn = 'South-West (SW)';
  } else if (qiblaDeg >= 247.5 && qiblaDeg < 292.5) {
    cardinalUrdu = 'مغرب (West)';
    cardinalEn = 'West (W)';
  }

  return {
    qiblaAngle: qiblaDeg,
    distanceKm,
    cardinalUrdu,
    cardinalEn
  };
}

/**
 * Solar position algorithm for offline astronomical calculation of prayer times
 */
export function calculateOfflinePrayerTimes(
  lat: number,
  lng: number,
  date: Date = new Date(),
  isHanafi: boolean = true,
  fajrAngle: number = 18,
  ishaAngle: number = 18
): PrayerTimings {
  const d = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  
  // Approximate solar declination
  const declination = 23.45 * Math.sin((Math.PI / 180) * ((360 / 365) * (d - 81)));
  const decRad = declination * (Math.PI / 180);
  const latRad = lat * (Math.PI / 180);

  // Timezone offset in hours
  const tzOffset = -date.getTimezoneOffset() / 60;

  // Equation of time approximation in minutes
  const B = (360 / 365) * (d - 81) * (Math.PI / 180);
  const eqTime = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Solar Noon (Dhuhr)
  const solarNoonMinutes = 720 - 4 * lng - eqTime + tzOffset * 60;

  // Helper for sun angle hour angle
  const hourAngle = (angle: number) => {
    const angleRad = angle * (Math.PI / 180);
    const cosHA = (Math.sin(-angleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
    if (cosHA > 1) return 0;
    if (cosHA < -1) return Math.PI;
    return Math.acos(cosHA);
  };

  // Sunrise / Sunset hour angle (0.833 degrees refraction)
  const haSunrise = hourAngle(0.833);
  const sunriseMinutes = solarNoonMinutes - (haSunrise * (180 / Math.PI) * 4);
  const sunsetMinutes = solarNoonMinutes + (haSunrise * (180 / Math.PI) * 4);

  // Fajr hour angle
  const haFajr = hourAngle(fajrAngle);
  const fajrMinutes = solarNoonMinutes - (haFajr * (180 / Math.PI) * 4);

  // Isha hour angle
  const haIsha = hourAngle(ishaAngle);
  const ishaMinutes = solarNoonMinutes + (haIsha * (180 / Math.PI) * 4);

  // Asr shadow angle calculation
  const shadowFactor = isHanafi ? 2 : 1;
  const acot = (x: number) => Math.atan(1 / x);
  const asrAngleRad = acot(shadowFactor + Math.tan(Math.abs(latRad - decRad)));
  const cosAsrHA = (Math.sin(asrAngleRad) - Math.sin(latRad) * Math.sin(decRad)) / (Math.cos(latRad) * Math.cos(decRad));
  const haAsr = Math.acos(Math.max(-1, Math.min(1, cosAsrHA)));
  const asrMinutes = solarNoonMinutes + (haAsr * (180 / Math.PI) * 4);

  const formatMin = (mins: number) => {
    const totalMin = Math.round((mins + 1440) % 1440);
    const h = Math.floor(totalMin / 60);
    const m = totalMin % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return {
    Fajr: formatMin(fajrMinutes),
    Sunrise: formatMin(sunriseMinutes),
    Dhuhr: formatMin(solarNoonMinutes + 1), // 1 min buffer after zawal
    Asr: formatMin(asrMinutes),
    Sunset: formatMin(sunsetMinutes),
    Maghrib: formatMin(sunsetMinutes + 2), // 2 min buffer
    Isha: formatMin(ishaMinutes),
    Imsak: formatMin(fajrMinutes - 10),
    Midnight: formatMin(solarNoonMinutes + 720)
  };
}

/**
 * Local Storage Persistence Helpers
 */
export function savePrayerTimesToOfflineStorage(city: string, dateKey: string, timings: PrayerTimings) {
  try {
    const key = `halqa_offline_prayer_${city.toLowerCase().replace(/\s+/g, '_')}_${dateKey}`;
    localStorage.setItem(key, JSON.stringify(timings));
    localStorage.setItem('halqa_last_cached_prayer', JSON.stringify({ city, dateKey, timings, timestamp: Date.now() }));
  } catch (err) {
    console.warn('Unable to write to localStorage offline prayer cache:', err);
  }
}

export function getPrayerTimesFromOfflineStorage(city: string, dateKey: string): PrayerTimings | null {
  try {
    const key = `halqa_offline_prayer_${city.toLowerCase().replace(/\s+/g, '_')}_${dateKey}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    const lastCached = localStorage.getItem('halqa_last_cached_prayer');
    if (lastCached) {
      const parsed = JSON.parse(lastCached);
      if (parsed.timings) return parsed.timings;
    }
  } catch (err) {
    console.warn('Error reading from offline prayer cache:', err);
  }
  return null;
}

export function saveQiblaToOfflineStorage(cityName: string, qiblaResult: QiblaResult) {
  try {
    const key = `halqa_offline_qibla_${cityName.toLowerCase().replace(/\s+/g, '_')}`;
    localStorage.setItem(key, JSON.stringify(qiblaResult));
    localStorage.setItem('halqa_last_cached_qibla', JSON.stringify({ cityName, qiblaResult, timestamp: Date.now() }));
  } catch (err) {
    console.warn('Unable to write offline Qibla cache:', err);
  }
}

export function getQiblaFromOfflineStorage(cityName: string): QiblaResult | null {
  try {
    const key = `halqa_offline_qibla_${cityName.toLowerCase().replace(/\s+/g, '_')}`;
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored);

    const last = localStorage.getItem('halqa_last_cached_qibla');
    if (last) {
      const parsed = JSON.parse(last);
      if (parsed.qiblaResult) return parsed.qiblaResult;
    }
  } catch (err) {
    console.warn('Error reading offline Qibla cache:', err);
  }
  return null;
}
