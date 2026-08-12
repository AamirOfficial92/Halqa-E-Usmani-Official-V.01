import React, { useState, useMemo } from 'react';
import { 
  MapPin, 
  Compass, 
  Search, 
  Navigation, 
  Clock, 
  Sparkles, 
  Check, 
  WifiOff, 
  Info, 
  Layers,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import { 
  OFFLINE_LANDMARKS, 
  OfflineLandmark, 
  searchOfflineLandmarks 
} from '../data/offlineLandmarksData';
import { 
  calculateOfflineQibla, 
  calculateOfflinePrayerTimes, 
  PrayerTimings 
} from '../lib/offlinePrayerEngine';

interface OfflineLandmarksMapProps {
  isUr: boolean;
  onSelectLocation?: (city: string, country: string, lat: number, lng: number) => void;
  currentSelectedCity?: string;
}

export const OfflineLandmarksMap: React.FC<OfflineLandmarksMapProps> = ({
  isUr,
  onSelectLocation,
  currentSelectedCity
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLandmark, setSelectedLandmark] = useState<OfflineLandmark>(
    OFFLINE_LANDMARKS.find(l => l.id === 'faisal_mosque') || OFFLINE_LANDMARKS[0]
  );

  // Filter landmarks
  const filteredLandmarks = useMemo(() => {
    return searchOfflineLandmarks(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Calculate Qibla & Distance for currently selected landmark
  const qiblaResult = useMemo(() => {
    return calculateOfflineQibla(selectedLandmark.lat, selectedLandmark.lng);
  }, [selectedLandmark]);

  // Calculate Offline Prayer Times for currently selected landmark
  const offlineTimings: PrayerTimings = useMemo(() => {
    return calculateOfflinePrayerTimes(selectedLandmark.lat, selectedLandmark.lng, new Date(), true);
  }, [selectedLandmark]);

  // Kaaba Holy Site constant
  const kaaba = OFFLINE_LANDMARKS.find(l => l.id === 'makkah_kaaba') || { lat: 21.4225, lng: 39.8262 };

  // Equirectangular Map Projection Constants (Covers 10°N to 45°N, 20°E to 82°E)
  const mapBounds = {
    minLat: 10,
    maxLat: 46,
    minLng: 20,
    maxLng: 82,
    width: 600,
    height: 380
  };

  const projectToMap = (lat: number, lng: number) => {
    const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * mapBounds.width;
    const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * mapBounds.height;
    return {
      x: Math.max(15, Math.min(mapBounds.width - 15, x)),
      y: Math.max(15, Math.min(mapBounds.height - 15, y))
    };
  };

  const kaabaPos = projectToMap(kaaba.lat, kaaba.lng);
  const selectedPos = projectToMap(selectedLandmark.lat, selectedLandmark.lng);

  const handleSelectLandmark = (item: OfflineLandmark) => {
    setSelectedLandmark(item);
  };

  const handleApplyLocation = () => {
    if (onSelectLocation) {
      onSelectLocation(selectedLandmark.nameEn, selectedLandmark.country, selectedLandmark.lat, selectedLandmark.lng);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-800/60 rounded-3xl p-4 sm:p-5 text-white shadow-xl space-y-4">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-emerald-800/40 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="text-amber-400 shrink-0" size={20} />
            <h3 className="text-base sm:text-lg font-bold font-serif text-amber-300">
              {isUr ? 'آف لائن میپ و تاریخی مقاماتِ قبلہ' : 'Offline Map & Landmark Qibla Engine'}
            </h3>
            <span className="text-[10px] uppercase font-mono bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
              <WifiOff size={11} className="text-amber-400" />
              <span>100% Offline</span>
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isUr 
              ? 'بغیر انٹرنیٹ کے پاکستان اور دنیا بھر کے اسلامک سائٹس کے جغرافیائی اور قبلہ رخ کا جائزہ لیں' 
              : 'Explore coordinates, exact Qibla bearings & prayer times without active internet.'}
          </p>
        </div>
      </div>

      {/* Category Pills & Search */}
      <div className="space-y-2.5">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isUr ? 'مقامات یا شہر تلاش کریں...' : 'Search cities or historic mosques...'}
            className="w-full bg-slate-800/80 border border-slate-700/80 text-white placeholder-slate-400 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {[
            { id: 'all', labelEn: 'All Places', labelUr: 'تمام مقامات' },
            { id: 'holy_site', labelEn: 'Holy Sanctuaries 🕌', labelUr: 'مقدس مقامات 🕌' },
            { id: 'historical_mosque', labelEn: 'Historic Mosques 🕌', labelUr: 'تاریخی مساجد 🕌' },
            { id: 'major_city', labelEn: 'Major Cities 🏙️', labelUr: 'بڑے شہر 🏙️' },
            { id: 'regional_center', labelEn: 'Regional Hubs 📍', labelUr: 'علاقائی مراکز 📍' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              {isUr ? cat.labelUr : cat.labelEn}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Left Vector Projection Map, Right Selected Landmark Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Vector SVG Offline Projection Canvas */}
        <div className="lg:col-span-7 bg-slate-950 border border-emerald-900/80 rounded-2xl p-3 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Map Overlay Badge */}
          <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs border border-emerald-800/60 text-emerald-300 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold flex items-center gap-1.5">
            <Layers size={12} className="text-amber-400" />
            <span>{isUr ? 'ویکٹر میپ پروجیکشن (جنوبی ایشیا و مشرق وسطیٰ)' : 'Vector Grid Projection (South Asia & Middle East)'}</span>
          </div>

          <svg 
            viewBox={`0 0 ${mapBounds.width} ${mapBounds.height}`} 
            className="w-full h-auto rounded-xl bg-slate-950/90 border border-slate-800/60 shadow-inner"
          >
            {/* Background Map Grid Pattern */}
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(16, 185, 129, 0.08)" strokeWidth="0.8" />
              </pattern>
              <linearGradient id="qiblaRay" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {/* Approximate Region Boundaries for Visual Context (Off-grid vector paths) */}
            {/* Arabian Peninsula */}
            <path 
              d="M 60,220 Q 90,200 130,210 T 180,260 T 150,330 T 70,300 Z" 
              fill="rgba(245, 158, 11, 0.04)" 
              stroke="rgba(245, 158, 11, 0.15)" 
              strokeWidth="1" 
              strokeDasharray="3 3"
            />
            {/* Pakistan / South Asia Outline */}
            <path 
              d="M 370,120 Q 420,100 480,120 T 520,220 T 420,320 T 360,240 Z" 
              fill="rgba(16, 185, 129, 0.05)" 
              stroke="rgba(16, 185, 129, 0.2)" 
              strokeWidth="1.2" 
            />

            {/* Qibla Direction Ray Vector */}
            <line
              x1={selectedPos.x}
              y1={selectedPos.y}
              x2={kaabaPos.x}
              y2={kaabaPos.y}
              stroke="url(#qiblaRay)"
              strokeWidth="2.5"
              strokeDasharray="5 3"
              className="animate-pulse"
            />

            {/* Makkah Kaaba Central Pin */}
            <g transform={`translate(${kaabaPos.x}, ${kaabaPos.y})`}>
              <circle r="12" fill="rgba(245, 158, 11, 0.2)" className="animate-ping" />
              <rect x="-7" y="-7" width="14" height="14" rx="3" fill="#10b981" stroke="#f59e0b" strokeWidth="2" />
              <text x="0" y="3" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="bold">🕋</text>
              <text x="0" y="20" textAnchor="middle" fontSize="9" fill="#f59e0b" fontWeight="bold" fontFamily="serif">
                Makkah (21.42°N)
              </text>
            </g>

            {/* Render Map Landmark Pins */}
            {filteredLandmarks.map((lm) => {
              const pos = projectToMap(lm.lat, lm.lng);
              const isSelected = selectedLandmark.id === lm.id;

              return (
                <g 
                  key={lm.id} 
                  transform={`translate(${pos.x}, ${pos.y})`} 
                  onClick={() => handleSelectLandmark(lm)}
                  className="cursor-pointer group"
                >
                  {isSelected && (
                    <circle r="14" fill="rgba(16, 185, 129, 0.3)" className="animate-pulse" />
                  )}
                  <circle 
                    r={isSelected ? "6" : "4"} 
                    fill={isSelected ? "#f59e0b" : lm.category === 'holy_site' ? "#eab308" : "#10b981"} 
                    stroke="#020617" 
                    strokeWidth="1.5"
                  />
                  <text 
                    x="0" 
                    y="-10" 
                    textAnchor="middle" 
                    fontSize={isSelected ? "9" : "7"} 
                    fill={isSelected ? "#f59e0b" : "#94a3b8"} 
                    fontWeight={isSelected ? "bold" : "normal"}
                    className="pointer-events-none drop-shadow-md"
                  >
                    {lm.nameEn.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Map Legend */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 px-1 border-t border-slate-900">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400"></span> 🕋 Kaaba / Makkah</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> {isUr ? 'منتخب مقام' : 'Selected Site'}</span>
            </div>
            <span className="font-mono text-emerald-400">{isUr ? `فاصلہ: ${qiblaResult.distanceKm.toLocaleString()} کلومیٹر` : `${qiblaResult.distanceKm.toLocaleString()} km to Kaaba`}</span>
          </div>
        </div>

        {/* Selected Landmark Detail Card & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-3 bg-slate-950/80 border border-slate-800 rounded-2xl p-4">
          <div className="space-y-3">
            {/* Header info */}
            <div className="border-b border-slate-800 pb-2.5">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  {selectedLandmark.country} {selectedLandmark.provinceOrState ? `• ${selectedLandmark.provinceOrState}` : ''}
                </span>
                <span className="text-[11px] font-mono text-amber-400 font-bold">
                  {selectedLandmark.lat.toFixed(4)}°N, {selectedLandmark.lng.toFixed(4)}°E
                </span>
              </div>

              <h4 className="text-base sm:text-lg font-bold text-white font-serif mt-1.5 leading-snug">
                {isUr ? selectedLandmark.nameUrdu : selectedLandmark.nameEn}
              </h4>
              <p className="text-xs text-slate-300 font-serif leading-relaxed mt-1">
                {isUr ? selectedLandmark.descriptionUrdu : selectedLandmark.descriptionEn}
              </p>
            </div>

            {/* Qibla Angle & Distance Cards */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">{isUr ? 'قبلہ کا رخ (زاویہ)' : 'Qibla Bearing'}</span>
                <div className="text-base font-extrabold text-amber-300 font-mono mt-0.5 flex items-center justify-center gap-1">
                  <Compass size={16} className="text-amber-400 animate-spin" style={{ animationDuration: '10s' }} />
                  <span>{qiblaResult.qiblaAngle}°</span>
                </div>
                <span className="text-[9px] text-amber-200/80 font-serif block mt-0.5">{isUr ? qiblaResult.cardinalUrdu : qiblaResult.cardinalEn}</span>
              </div>

              <div className="bg-slate-900 border border-emerald-800/60 rounded-xl p-2.5 text-center">
                <span className="text-[10px] text-slate-400 block font-bold">{isUr ? 'خانہ کعبہ سے فاصلہ' : 'Distance to Kaaba'}</span>
                <div className="text-base font-extrabold text-emerald-400 font-mono mt-0.5">
                  {qiblaResult.distanceKm.toLocaleString()} km
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5">{isUr ? 'مستقیم ہوائی فاصلہ' : 'Direct Geodesic Line'}</span>
              </div>
            </div>

            {/* Offline Calculated Prayer Times for this Landmark */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs text-amber-300 font-bold border-b border-slate-800 pb-1">
                <div className="flex items-center gap-1">
                  <Clock size={13} className="text-amber-400" />
                  <span>{isUr ? 'حساب شدہ اوقاتِ نماز (آف لائن)' : 'Offline Calculated Prayer Times'}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400">Hanafi / Shafi</span>
              </div>

              <div className="grid grid-cols-5 gap-1 text-center pt-1">
                {[
                  { nameEn: 'Fajr', nameUr: 'فجر', time: offlineTimings.Fajr },
                  { nameEn: 'Dhuhr', nameUr: 'ظہر', time: offlineTimings.Dhuhr },
                  { nameEn: 'Asr', nameUr: 'عصر', time: offlineTimings.Asr },
                  { nameEn: 'Maghrib', nameUr: 'مغرب', time: offlineTimings.Maghrib },
                  { nameEn: 'Isha', nameUr: 'عشاء', time: offlineTimings.Isha }
                ].map((p) => (
                  <div key={p.nameEn} className="bg-slate-950/80 border border-slate-800 rounded-lg p-1">
                    <span className="text-[9px] text-slate-400 block">{isUr ? p.nameUr : p.nameEn}</span>
                    <span className="text-[11px] font-mono font-bold text-amber-300">{p.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button: Set as Active Location */}
          <button
            onClick={handleApplyLocation}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 hover:to-emerald-600 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <MapPin size={15} className="text-amber-300" />
            <span>
              {isUr 
                ? `اوقاتِ نماز کے لیے "${selectedLandmark.nameUrdu}" منتخب کریں` 
                : `Set "${selectedLandmark.nameEn}" as Active Prayer Location`}
            </span>
          </button>
        </div>
      </div>

      {/* Offline Landmark Selection Scroll List */}
      <div className="pt-2 border-t border-slate-800/80">
        <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
          <span>{isUr ? 'آف لائن ڈیٹا بیس میں موجود تمام سائٹس' : 'Bundled Offline Landmarks Database'}</span>
          <span className="text-[10px] text-slate-400 font-mono">{filteredLandmarks.length} locations stored</span>
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredLandmarks.map((item) => {
            const isSelected = selectedLandmark.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectLandmark(item)}
                className={`p-2 rounded-xl text-left text-xs transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold shadow-xs'
                    : 'bg-slate-800/50 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="truncate text-[11px]">{isUr ? item.nameUrdu : item.nameEn}</span>
                  {isSelected && <Check size={12} className="text-amber-400 shrink-0" />}
                </div>
                <span className="text-[9px] text-slate-400 font-mono mt-1 block">
                  {item.country} ({item.lat.toFixed(2)}°)
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
