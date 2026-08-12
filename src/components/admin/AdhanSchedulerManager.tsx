import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, 
  Upload, 
  Play, 
  Square, 
  Clock, 
  Sparkles, 
  Check, 
  RotateCcw, 
  Music, 
  FileAudio, 
  BellRing, 
  Settings2, 
  Sliders, 
  CheckCircle2, 
  AlertCircle,
  VolumeX,
  Radio
} from 'lucide-react';
import { 
  adhanAlarmEngine, 
  ADHAN_VOICES, 
  PrayerAdhanConfig, 
  DEFAULT_PRAYER_SCHEDULES 
} from '../../lib/adhanAlarmEngine';

interface AdhanSchedulerManagerProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const AdhanSchedulerManager: React.FC<AdhanSchedulerManagerProps> = ({ showToast }) => {
  const [schedules, setSchedules] = useState<Record<string, PrayerAdhanConfig>>(DEFAULT_PRAYER_SCHEDULES);
  const [playingPrayer, setPlayingPrayer] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'schedules' | 'presets' | 'test'>('schedules');

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    // Load existing prayer schedules from engine
    const configs = adhanAlarmEngine.getPrayerConfigs();
    setSchedules(configs);
  }, []);

  const handleVoiceChange = (prayerName: string, voiceId: string) => {
    setSchedules(prev => {
      const updated = {
        ...prev,
        [prayerName]: {
          ...prev[prayerName],
          voiceId
        }
      };
      adhanAlarmEngine.savePrayerConfig(prayerName, updated[prayerName]);
      return updated;
    });
    showToast(`Updated Adhan voice for ${prayerName}`, 'success');
  };

  const handleToggleEnable = (prayerName: string) => {
    setSchedules(prev => {
      const current = prev[prayerName];
      const updated = {
        ...prev,
        [prayerName]: {
          ...current,
          enabled: !current.enabled
        }
      };
      adhanAlarmEngine.savePrayerConfig(prayerName, updated[prayerName]);
      return updated;
    });
  };

  const handleVolumeChange = (prayerName: string, volume: number) => {
    setSchedules(prev => {
      const updated = {
        ...prev,
        [prayerName]: {
          ...prev[prayerName],
          volume
        }
      };
      adhanAlarmEngine.savePrayerConfig(prayerName, updated[prayerName]);
      return updated;
    });
  };

  const handleFileUpload = (prayerName: string, file: File) => {
    if (!file) return;

    if (!file.type.startsWith('audio/') && !file.name.endsWith('.mp3') && !file.name.endsWith('.wav')) {
      showToast('Please upload a valid audio file (.mp3, .wav, .ogg, .aac)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Audio file size exceeds 8MB limit. Please select a smaller file.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target?.result as string;
      if (base64Data) {
        setSchedules(prev => {
          const updated = {
            ...prev,
            [prayerName]: {
              ...prev[prayerName],
              voiceId: 'custom',
              customAudioUrl: base64Data,
              customAudioName: file.name
            }
          };
          adhanAlarmEngine.savePrayerConfig(prayerName, updated[prayerName]);
          return updated;
        });
        showToast(`Custom Adhan audio uploaded for ${prayerName} (${file.name})`, 'success');
      }
    };
    reader.onerror = () => {
      showToast('Error reading audio file', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleCustomUrlChange = (prayerName: string, url: string) => {
    setSchedules(prev => {
      const updated = {
        ...prev,
        [prayerName]: {
          ...prev[prayerName],
          voiceId: 'custom',
          customAudioUrl: url,
          customAudioName: url ? 'External Custom MP3 URL' : undefined
        }
      };
      adhanAlarmEngine.savePrayerConfig(prayerName, updated[prayerName]);
      return updated;
    });
  };

  const handleTestAudio = async (prayerName: string) => {
    if (playingPrayer === prayerName) {
      adhanAlarmEngine.stopAdhanSound();
      setPlayingPrayer(null);
      return;
    }

    const cfg = schedules[prayerName];
    if (!cfg) return;

    setPlayingPrayer(prayerName);
    showToast(`Playing Adhan preview for ${prayerName} (${cfg.prayerNameUrdu})`, 'info');

    if (cfg.voiceId === 'custom' && cfg.customAudioUrl) {
      await adhanAlarmEngine.playAdhanSound('custom', cfg.customAudioUrl, cfg.volume);
    } else {
      await adhanAlarmEngine.playAdhanSound(cfg.voiceId, undefined, cfg.volume);
    }
  };

  const handleStopAll = () => {
    adhanAlarmEngine.stopAdhanSound();
    setPlayingPrayer(null);
  };

  const handleApplyPreset = (presetType: 'makkah' | 'madinah' | 'egypt' | 'synth') => {
    const updated: Record<string, PrayerAdhanConfig> = {};
    Object.keys(schedules).forEach(pName => {
      updated[pName] = {
        ...schedules[pName],
        voiceId: presetType
      };
    });
    setSchedules(updated);
    adhanAlarmEngine.saveAllPrayerConfigs(updated);
    showToast(`Applied ${presetType.toUpperCase()} preset voice to all prayers!`, 'success');
  };

  const handleResetDefaults = () => {
    setSchedules(DEFAULT_PRAYER_SCHEDULES);
    adhanAlarmEngine.saveAllPrayerConfigs(DEFAULT_PRAYER_SCHEDULES);
    showToast('Reset all prayer Adhan schedules to system defaults', 'info');
  };

  const handleSimulateAlarmTrigger = (prayerName: string) => {
    const cfg = schedules[prayerName];
    if (!cfg) return;

    adhanAlarmEngine.triggerAlarm(
      cfg.prayerName,
      cfg.prayerNameUrdu,
      new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      'Islamabad Admin Hub'
    );
    showToast(`Simulated live Adhan alarm trigger for ${prayerName}!`, 'success');
  };

  const PRAYER_KEYS: Array<{ key: string; nameEn: string; nameUr: string; defaultTime: string }> = [
    { key: 'Fajr', nameEn: 'Fajr Adhan', nameUr: 'اذانِ فجر', defaultTime: '04:45 AM' },
    { key: 'Dhuhr', nameEn: 'Dhuhr Adhan', nameUr: 'اذانِ ظہر', defaultTime: '01:15 PM' },
    { key: 'Asr', nameEn: 'Asr Adhan', nameUr: 'اذانِ عصر', defaultTime: '04:45 PM' },
    { key: 'Maghrib', nameEn: 'Maghrib Adhan', nameUr: 'اذانِ مغرب', defaultTime: '07:10 PM' },
    { key: 'Isha', nameEn: 'Isha Adhan', nameUr: 'اذانِ عشاء', defaultTime: '08:45 PM' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Top Header Card */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/80 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="text-amber-400 animate-pulse" size={22} />
            <h3 className="text-lg font-bold font-serif text-amber-300">
              Automated Adhan Scheduler & Custom Audio Engine
            </h3>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono px-2 py-0.5 rounded-md font-bold">
              Admin Deck Core
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Configure, schedule, and upload custom Adhan audio files (.mp3, .wav) for each prayer time. 
            The AppSimulator local notification alarm system will automatically trigger these custom voices at exact prayer times.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {playingPrayer && (
            <button
              onClick={handleStopAll}
              className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <Square size={14} />
              <span>Stop Preview</span>
            </button>
          )}

          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs flex items-center gap-1.5 border border-slate-700 transition-all"
          >
            <RotateCcw size={14} />
            <span>Reset Defaults</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'schedules'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sliders size={15} />
          <span>5-Prayer Audio Schedules</span>
        </button>

        <button
          onClick={() => setActiveTab('presets')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'presets'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles size={15} />
          <span>Global Presets & Templates</span>
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'test'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md'
              : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800'
          }`}
        >
          <BellRing size={15} />
          <span>Live Simulator Alarm Test</span>
        </button>
      </div>

      {/* Main Tab 1: Per-Prayer Adhan Configuration Cards */}
      {activeTab === 'schedules' && (
        <div className="space-y-4">
          {PRAYER_KEYS.map(({ key, nameEn, nameUr, defaultTime }) => {
            const config = schedules[key] || DEFAULT_PRAYER_SCHEDULES[key];
            const isPlaying = playingPrayer === key;

            return (
              <div 
                key={key} 
                className={`bg-slate-900/90 border rounded-2xl p-4 sm:p-5 text-white transition-all shadow-md ${
                  config.enabled 
                    ? 'border-slate-800 hover:border-emerald-800/80' 
                    : 'border-slate-800/60 opacity-60 bg-slate-950'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleEnable(key)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        config.enabled 
                          ? 'bg-emerald-500 text-slate-950 font-bold' 
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                      title={config.enabled ? 'Click to disable Adhan alarm for this prayer' : 'Click to enable Adhan alarm'}
                    >
                      {config.enabled && <Check size={14} />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-white font-serif">{nameEn}</span>
                        <span className="text-xs font-serif text-amber-300 font-bold bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                          {nameUr}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">({defaultTime})</span>
                      </div>
                      <span className="text-[11px] text-slate-400">
                        {config.enabled ? 'Active Adhan alarm schedule enabled' : 'Disabled for this prayer time'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Audio Preview Trigger Button */}
                    <button
                      onClick={() => handleTestAudio(key)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        isPlaying
                          ? 'bg-rose-600 text-white animate-pulse shadow-md'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500 hover:text-slate-950'
                      }`}
                    >
                      {isPlaying ? <Square size={13} /> : <Play size={13} />}
                      <span>{isPlaying ? 'Stop Adhan' : 'Test Sound'}</span>
                    </button>

                    {/* Simulate Trigger Button */}
                    <button
                      onClick={() => handleSimulateAlarmTrigger(key)}
                      className="px-3 py-1.5 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-300 border border-emerald-700/80 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <BellRing size={13} />
                      <span>Simulate Alarm</span>
                    </button>
                  </div>
                </div>

                {/* Configuration Options Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-4">
                  {/* Voice Option Selector */}
                  <div className="md:col-span-5 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Select Adhan Voice Source
                    </label>
                    <select
                      value={config.voiceId}
                      onChange={(e) => handleVoiceChange(key, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                    >
                      {ADHAN_VOICES.map((v) => (
                        <option key={v.id} value={v.id} className="bg-slate-900 text-white">
                          {v.nameEn}
                        </option>
                      ))}
                      <option value="custom" className="bg-slate-900 text-amber-300 font-bold">
                        📁 Custom Audio File / Uploaded Track
                      </option>
                    </select>
                  </div>

                  {/* Volume Slider */}
                  <div className="md:col-span-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                      <span>Volume Level</span>
                      <span className="font-mono text-amber-300">{Math.round((config.volume || 1) * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1">
                      <VolumeX size={14} className="text-slate-500 shrink-0" />
                      <input
                        type="range"
                        min="0.1"
                        max="1.0"
                        step="0.05"
                        value={config.volume || 0.9}
                        onChange={(e) => handleVolumeChange(key, parseFloat(e.target.value))}
                        className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                      />
                      <Volume2 size={14} className="text-amber-400 shrink-0" />
                    </div>
                  </div>

                  {/* Upload Custom Audio File Box */}
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Custom MP3 Upload / File
                    </label>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        accept="audio/*,.mp3,.wav,.ogg,.aac"
                        ref={(el) => (fileInputRefs.current[key] = el)}
                        onChange={(e) => e.target.files?.[0] && handleFileUpload(key, e.target.files[0])}
                        className="hidden"
                      />

                      <button
                        type="button"
                        onClick={() => fileInputRefs.current[key]?.click()}
                        className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-750 border border-slate-700/80 rounded-xl text-xs text-slate-200 font-bold flex items-center justify-center gap-2 transition-all"
                      >
                        <Upload size={14} className="text-amber-400" />
                        <span className="truncate">
                          {config.customAudioName ? config.customAudioName : 'Upload MP3 / Audio'}
                        </span>
                      </button>
                    </div>

                    {/* External Audio URL fallback input if custom selected */}
                    {config.voiceId === 'custom' && (
                      <input
                        type="text"
                        value={config.customAudioUrl && !config.customAudioUrl.startsWith('data:') ? config.customAudioUrl : ''}
                        onChange={(e) => handleCustomUrlChange(key, e.target.value)}
                        placeholder="Paste HTTPS MP3 Audio URL..."
                        className="w-full bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-[11px] rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-amber-500 font-mono mt-1"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Main Tab 2: Global Presets */}
      {activeTab === 'presets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
          <h4 className="text-sm font-bold text-amber-300 font-serif flex items-center gap-2">
            <Sparkles size={18} className="text-amber-400" />
            <span>Apply Global Adhan Voice Presets Across All 5 Prayers</span>
          </h4>
          <p className="text-xs text-slate-300">
            Quickly set uniform audio reciters or offline synthesizers for all daily prayers simultaneously.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-2">
            {[
              { id: 'makkah', name: 'Makkah Mukarramah', desc: 'Haram Makkah Adhan Recitation', icon: '🕋' },
              { id: 'madinah', name: 'Madinah Munawwarah', desc: 'Masjid an-Nabawi Adhan', icon: '🕌' },
              { id: 'egypt', name: 'Traditional Takbeer', desc: 'Soft Classical Takbeerat', icon: '🔊' },
              { id: 'synth', name: 'Web Audio Offline', desc: 'Offline Harmonic Chime Synthesis', icon: '⚡' }
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleApplyPreset(p.id as any)}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 p-4 rounded-xl text-left transition-all group"
              >
                <div className="text-2xl mb-1">{p.icon}</div>
                <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">{p.name}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                <div className="mt-3 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-md text-center border border-amber-500/20">
                  Apply to All 5 Prayers
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Tab 3: Live Simulator Test */}
      {activeTab === 'test' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white space-y-4">
          <h4 className="text-sm font-bold text-emerald-400 font-serif flex items-center gap-2">
            <BellRing size={18} className="text-amber-400" />
            <span>Live System Alarm & Browser Notification Simulator</span>
          </h4>
          <p className="text-xs text-slate-300">
            Test the integration between scheduled Adhan audio files, device vibration, and browser system banner notifications.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            {PRAYER_KEYS.map(({ key, nameEn, nameUr }) => (
              <button
                key={key}
                onClick={() => handleSimulateAlarmTrigger(key)}
                className="bg-slate-950 border border-emerald-900/60 hover:border-emerald-500 p-3.5 rounded-xl text-left transition-all flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white">{nameEn}</div>
                  <div className="text-[10px] text-amber-300 font-serif">{nameUr}</div>
                </div>
                <BellRing size={16} className="text-emerald-400" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
