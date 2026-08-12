import React, { useEffect, useState } from 'react';
import { Volume2, VolumeX, Bell, Clock, X, Sparkles, MapPin, Play, Pause, Check } from 'lucide-react';
import { adhanAlarmEngine, TriggeredAlarm, ADHAN_VOICES } from '../lib/adhanAlarmEngine';

interface AdhanAlarmModalProps {
  isUr: boolean;
}

export const AdhanAlarmModal: React.FC<AdhanAlarmModalProps> = ({ isUr }) => {
  const [alarm, setAlarm] = useState<TriggeredAlarm | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = adhanAlarmEngine.subscribe((activeAlarm) => {
      setAlarm(activeAlarm);
      setIsMuted(!adhanAlarmEngine.isSoundEnabled());
    });
    return () => unsubscribe();
  }, []);

  if (!alarm) return null;

  const handleDismiss = () => {
    adhanAlarmEngine.dismissAlarm();
  };

  const handleSnooze = () => {
    adhanAlarmEngine.snoozeAlarm();
  };

  const handleToggleSound = () => {
    const nextState = !isMuted;
    setIsMuted(nextState);
    if (nextState) {
      adhanAlarmEngine.stopAdhanSound();
    } else {
      adhanAlarmEngine.playAdhanSound();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      {/* Decorative ambient background glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-slate-950/90 to-amber-950/40 pointer-events-none" />

      <div className="relative w-full max-w-sm bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 text-center text-white shadow-2xl overflow-hidden space-y-5 animate-scale-up">
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide">
          <Bell size={14} className="text-amber-400 animate-bounce" />
          <span>{isUr ? 'وقتِ نماز — اذان الرٹ' : 'Prayer Time Adhan Alarm'}</span>
        </div>

        {/* Pulse Ring Icon */}
        <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
          <div className="absolute -inset-2 rounded-full bg-emerald-500/10 animate-pulse" />
          <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-emerald-700 flex items-center justify-center text-slate-950 shadow-lg font-black text-2xl border-2 border-amber-300">
            🕌
          </div>
        </div>

        {/* Call to Prayer Text */}
        <div className="space-y-1.5">
          <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-300 tracking-wide">
            {isUr ? `نمازِ ${alarm.prayerNameUrdu} کا وقت ہو گیا ہے` : `It is time for ${alarm.prayerName} Prayer`}
          </h3>
          <p className="text-xs text-emerald-200/90 font-serif leading-relaxed px-2">
            {alarm.prayerName === 'Fajr' 
              ? (isUr ? 'الصلاة خير من النوم — نماز نیند سے بہتر ہے' : 'Prayer is better than sleep')
              : (isUr ? 'حیّ علی الصلاة — حیّ علی الفلاح (نماز اور کامیابی کی طرف آئیں)' : 'Hayya Ala-Sallah — Come to Prayer')}
          </p>
        </div>

        {/* Details Card */}
        <div className="bg-emerald-950/70 border border-emerald-800/80 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-200">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-amber-400 shrink-0" />
            <span className="font-mono font-bold text-sm text-white">{alarm.timeStr}</span>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-300 font-serif">
            <MapPin size={14} className="text-emerald-400 shrink-0" />
            <span className="truncate max-w-[120px]">{alarm.cityName}</span>
          </div>
        </div>

        {/* Actions Button Bar */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={handleSnooze}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Clock size={14} className="text-amber-400" />
            <span>{isUr ? 'اسنوز (5 منٹ)' : 'Snooze 5m'}</span>
          </button>

          <button
            onClick={handleDismiss}
            className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-extrabold shadow-md flex items-center justify-center gap-1.5 transition-all"
          >
            <Check size={16} className="text-slate-950 stroke-[3]" />
            <span>{isUr ? 'اذان بند کریں' : 'Dismiss Alarm'}</span>
          </button>
        </div>

        {/* Mute/Unmute audio button */}
        <div className="flex items-center justify-center pt-2">
          <button
            onClick={handleToggleSound}
            className="text-[11px] text-slate-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors py-1 px-3 rounded-full hover:bg-slate-800/60"
          >
            {isMuted ? <VolumeX size={14} className="text-amber-400" /> : <Volume2 size={14} className="text-emerald-400 animate-pulse" />}
            <span>{isMuted ? (isUr ? 'صوت آن کریں' : 'Unmute Sound') : (isUr ? 'صوت خاموش کریں' : 'Mute Adhan Audio')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface AdhanSoundSettingsControlProps {
  isUr: boolean;
}

export const AdhanSoundSettingsControl: React.FC<AdhanSoundSettingsControlProps> = ({ isUr }) => {
  const [selectedVoice, setSelectedVoice] = useState<string>(adhanAlarmEngine.getVoice());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(adhanAlarmEngine.isSoundEnabled());
  const [isPlayingTest, setIsPlayingTest] = useState<boolean>(false);

  const handleVoiceChange = (voiceId: string) => {
    setSelectedVoice(voiceId);
    adhanAlarmEngine.setVoice(voiceId);
  };

  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
    adhanAlarmEngine.setSoundEnabled(enabled);
  };

  const handleTestAdhan = () => {
    if (isPlayingTest) {
      adhanAlarmEngine.stopAdhanSound();
      setIsPlayingTest(false);
    } else {
      setIsPlayingTest(true);
      adhanAlarmEngine.playAdhanSound(selectedVoice);
      
      // Auto reset test state after 10 seconds if not manually stopped
      setTimeout(() => {
        setIsPlayingTest(false);
      }, 10000);
    }
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-800/60 rounded-2xl p-4 text-white space-y-3.5 shadow-md">
      <div className="flex items-center justify-between border-b border-emerald-800/40 pb-2.5">
        <div className="flex items-center gap-2">
          <Volume2 size={18} className="text-amber-400" />
          <h4 className="text-xs sm:text-sm font-bold font-serif text-amber-300">
            {isUr ? 'اذان ساؤنڈ و آڈیو الرٹ سیٹنگز' : 'Adhan Audio Alarm Settings'}
          </h4>
        </div>

        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => handleToggleSound(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
        </label>
      </div>

      {soundEnabled && (
        <div className="space-y-3 pt-1 animate-fade-in">
          <div>
            <label className="text-[11px] text-slate-300 font-bold block mb-1.5">
              {isUr ? 'اذان کی آواز / موذن کا انتخاب:' : 'Select Adhan Voice / Sound Source:'}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ADHAN_VOICES.map((v) => (
                <button
                  key={v.id}
                  onClick={() => handleVoiceChange(v.id)}
                  className={`px-3 py-2 rounded-xl text-left text-xs font-serif transition-all flex items-center justify-between border ${
                    selectedVoice === v.id
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold shadow-xs'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <span className="truncate">{isUr ? v.nameUrdu : v.nameEn}</span>
                  {selectedVoice === v.id && <Check size={14} className="text-amber-400 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-800/60">
            <span className="text-[10px] text-slate-400">
              {isUr ? 'طے شدہ وقت پر خودمختار آڈیو اذان پلے ہوگی' : 'Audio alarm plays automatically at prayer times'}
            </span>

            <button
              onClick={handleTestAdhan}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                isPlayingTest
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-xs'
              }`}
            >
              {isPlayingTest ? <Pause size={13} /> : <Play size={13} className="ml-0.5" />}
              <span>
                {isPlayingTest
                  ? (isUr ? 'اذان روکے' : 'Stop Test')
                  : (isUr ? 'آزمائشی اذان (Test Adhan)' : 'Test Adhan Sound')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
