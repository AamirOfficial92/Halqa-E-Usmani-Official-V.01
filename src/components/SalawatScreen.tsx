import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ArrowLeft, Volume2, Heart, ChevronRight, ChevronLeft } from 'lucide-react';
import { PostSplashScreenItem } from '../types';

interface SalawatScreenProps {
  onComplete: () => void;
  screens?: PostSplashScreenItem[];
  durationSeconds?: number;
}

const DEFAULT_POST_SPLASH_SCREEN: PostSplashScreenItem = {
  id: 'post-splash-default',
  title: 'درودِ پاک و دعاۓ برکت',
  titleEnglish: 'Salawat & Blessing Prayer',
  bismillahText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
  mainArabicText: 'اللَّهُمَّ صَلِّ عَلَى سَيِّدِنَا مُحَمَّدٍ وَعَلَى آلِ سَيِّدِنَا مُحَمَّدٍ عَدَدَ كُلِّ شَيْءٍ مَعْلُومٍ لَكَ، رَبِّ أَرِنِي بِجَمَالِكَ وَجَمَالَهَا يَا رَسُولَ اللَّهِ، يَا حَبِيبَ اللَّهِ، يَا خَيْرَ خَلْقِ اللَّهِ، يَا نُورَ عَرْشِ اللَّهِ، يَا نُوراً مِنْ نُورِ اللَّهِ، مُحَمَّدْ رَسُولُ اللَّهِ، صَلَّى اللَّهُ تَعَالَى عَلَيْهِ وَسَلَّمَ، يَا زَيْنَا، يَا زَيْنَا۔',
  urduTranslation: 'اللہ تعالیٰ ہمیں حضور نبی کریم ﷺ کی سچی محبت، ادب، اتباع اور شفاعت نصیب فرمائے، اور دنیا و آخرت میں آپ ﷺ کی رضا و قرب عطا فرمائے۔ آمین یا رب العالمین۔',
  imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1200',
  durationSeconds: 15,
  isEnabled: true,
  order: 1
};

export const SalawatScreen: React.FC<SalawatScreenProps> = ({
  onComplete,
  screens,
  durationSeconds = 15
}) => {
  // Filter active enabled screens and sort by order
  const activeScreens = (screens && screens.length > 0)
    ? screens.filter(s => s.isEnabled).sort((a, b) => (a.order || 0) - (b.order || 0))
    : [DEFAULT_POST_SPLASH_SCREEN];

  const effectiveScreens = activeScreens.length > 0 ? activeScreens : [DEFAULT_POST_SPLASH_SCREEN];

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const currentScreen = effectiveScreens[currentIndex] || effectiveScreens[0];
  const itemDuration = currentScreen.durationSeconds || durationSeconds || 15;

  const [timeLeft, setTimeLeft] = useState<number>(itemDuration);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Reset timer on screen index change
  useEffect(() => {
    setTimeLeft(itemDuration);
  }, [currentIndex, itemDuration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (currentIndex < effectiveScreens.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onComplete();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentIndex, effectiveScreens.length, onComplete]);

  const progressPercent = Math.max(0, Math.min(100, ((itemDuration - timeLeft) / itemDuration) * 100));

  const handleSpeakText = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    
    // Custom audio or speech text
    const textToSpeak = currentScreen.mainArabicText || currentScreen.title;
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'ar-SA';
    utterance.rate = 0.85;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < effectiveScreens.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 select-none overflow-y-auto"
    >
      {/* Decorative Custom Image or Ambient Background Glow */}
      {currentScreen.imageUrl ? (
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
          <img
            src={currentScreen.imageUrl}
            alt={currentScreen.title}
            className="w-full h-full object-cover blur-sm scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/90" />
        </div>
      ) : (
        <>
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      {/* Top Bar: Progress Timer, Slide Indicator & Skip Button */}
      <div className="relative z-10 flex items-center justify-between max-w-2xl mx-auto w-full pt-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border-2 border-amber-400/50 flex items-center justify-center bg-emerald-950/80 text-amber-300 font-mono text-xs font-bold shadow-md">
            {timeLeft}s
          </div>

          {effectiveScreens.length > 1 && (
            <div className="px-3 py-1 bg-emerald-900/60 border border-emerald-700/60 rounded-full text-[11px] font-bold text-emerald-200">
              {currentIndex + 1} / {effectiveScreens.length}
            </div>
          )}

          <span className="text-xs text-emerald-300 font-serif hidden sm:inline-block">
            حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ
          </span>
        </div>

        <button
          onClick={onComplete}
          className="px-4 py-1.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-full shadow-lg transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer border border-amber-300/60"
        >
          <span>آگے بڑھیں (Skip)</span>
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Main Content Box */}
      <div className="relative z-10 max-w-2xl mx-auto w-full my-auto py-6 space-y-5 text-center">
        
        {/* Header Badge & Title */}
        <div className="space-y-2">
          {currentScreen.bismillahText && (
            <div className="inline-flex items-center gap-2 bg-emerald-900/80 border border-amber-400/40 px-4 py-1.5 rounded-full text-amber-300 font-bold text-xs font-serif shadow-md">
              <Sparkles size={14} className="text-amber-400 animate-pulse" />
              <span>{currentScreen.bismillahText}</span>
            </div>
          )}
          <h2 className="text-amber-400 font-serif font-bold text-base sm:text-lg tracking-widest uppercase">
            {currentScreen.title}
          </h2>
        </div>

        {/* Optional Image Banner if provided */}
        {currentScreen.imageUrl && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-h-48 sm:max-h-64 rounded-2xl overflow-hidden border border-amber-400/40 shadow-xl mx-auto"
          >
            <img
              src={currentScreen.imageUrl}
              alt={currentScreen.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        )}

        {/* Large Text Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScreen.id + '-' + currentIndex}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-emerald-950/85 border-2 border-amber-400/60 rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-md space-y-4"
          >
            {/* Subtle Golden Corner Ornaments */}
            <div className="absolute top-2 left-2 text-amber-400/40 text-xs">◈</div>
            <div className="absolute top-2 right-2 text-amber-400/40 text-xs">◈</div>
            <div className="absolute bottom-2 left-2 text-amber-400/40 text-xs">◈</div>
            <div className="absolute bottom-2 right-2 text-amber-400/40 text-xs">◈</div>

            <p
              className="text-amber-300 text-xl sm:text-2xl md:text-3xl font-serif font-black leading-loose text-center tracking-wide"
              dir="rtl"
              style={{ fontFamily: "'Scheherazade New', 'Amiri', 'Traditional Arabic', 'Noto Naskh Arabic', serif" }}
            >
              {currentScreen.mainArabicText}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* Urdu Translation & Subtitle */}
        {currentScreen.urduTranslation && (
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-slate-900/90 border border-emerald-700/60 rounded-2xl p-4 sm:p-5 shadow-lg text-emerald-100 space-y-2"
            dir="rtl"
          >
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-bold font-serif">
              <Heart size={14} className="fill-amber-400 text-amber-400" />
              <span>وضاحت و دعا</span>
            </div>
            <p className="text-sm sm:text-base font-serif leading-relaxed text-amber-100/95 font-medium text-center">
              {currentScreen.urduTranslation}
            </p>
          </motion.div>
        )}

        {/* Action Controls: Audio Playback & Manual Navigation */}
        <div className="flex items-center justify-center gap-3 pt-2">
          {effectiveScreens.length > 1 && (
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-2 rounded-full border text-xs font-bold transition-all ${
                currentIndex === 0
                  ? 'opacity-40 border-slate-700 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-900/60 text-amber-300 border-emerald-700 hover:bg-emerald-800 cursor-pointer'
              }`}
              title="پچھلا صفحہ"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          <button
            onClick={handleSpeakText}
            className={`px-4 py-2 rounded-full border text-xs font-bold font-serif transition-all flex items-center gap-2 ${
              isPlayingAudio
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-lg'
                : 'bg-emerald-900/60 text-amber-300 border-emerald-700/60 hover:bg-emerald-800 cursor-pointer'
            }`}
          >
            <Volume2 size={16} className={isPlayingAudio ? 'animate-bounce' : ''} />
            <span>{isPlayingAudio ? 'تلاوت جاری ہے...' : 'آواز سنیں'}</span>
          </button>

          {effectiveScreens.length > 1 && (
            <button
              onClick={handleNext}
              className="p-2 rounded-full border bg-emerald-900/60 text-amber-300 border-emerald-700 hover:bg-emerald-800 cursor-pointer text-xs font-bold transition-all"
              title="اگلا صفحہ"
            >
              <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Progress Bar & Touch Prompt */}
      <div className="relative z-10 max-w-2xl mx-auto w-full pb-2 space-y-2 text-center">
        {/* Progress Bar Container */}
        <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden border border-emerald-800/60">
          <div
            className="bg-gradient-to-r from-amber-500 to-amber-300 h-full transition-all duration-1000 ease-linear"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-emerald-300/80 font-serif">
          صفحہ پر کہیں بھی کلک کر کے فوراً آگے بڑھیں
        </p>
      </div>
    </motion.div>
  );
};
