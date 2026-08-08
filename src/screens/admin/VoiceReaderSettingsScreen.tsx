/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Volume2, 
  Sparkles, 
  Check, 
  Globe, 
  Gauge, 
  Settings, 
  VolumeX, 
  Play, 
  Loader2, 
  AlertCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { VoiceReaderSettings } from '../../types';
import { getVoiceReaderSettings, updateVoiceReaderSettings, DEFAULT_FIRESTORE_VOICE_SETTINGS } from '../../lib/firestoreVoiceReader';
import { useVoiceReader } from '../../context/VoiceReaderContext';

interface VoiceReaderSettingsScreenProps {
  onSaveSuccess?: () => void;
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void;
}

export const VoiceReaderSettingsScreen: React.FC<VoiceReaderSettingsScreenProps> = ({
  onSaveSuccess,
  showToast
}) => {
  const context = useVoiceReader();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Form State
  const [globalEnabled, setGlobalEnabled] = useState<boolean>(true);
  const [autoLanguageDetection, setAutoLanguageDetection] = useState<boolean>(true);
  const [defaultVoiceUr, setDefaultVoiceUr] = useState<string>('ur-PK');
  const [defaultVoiceAr, setDefaultVoiceAr] = useState<string>('ar-SA');
  const [defaultVoiceEn, setDefaultVoiceEn] = useState<string>('en-US');
  const [defaultSpeed, setDefaultSpeed] = useState<number>(1.0);
  const [defaultVolume, setDefaultVolume] = useState<number>(1.0); // 0.0 - 1.0

  // Browser Available Voices
  const [browserVoices, setBrowserVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isTestingVoice, setIsTestingVoice] = useState<string | null>(null); // 'ur' | 'ar' | 'en' | null

  // Fetch initial settings from Firestore / Context
  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        setLoading(true);
        const data = await getVoiceReaderSettings();
        if (isMounted) {
          setGlobalEnabled(data.globalEnabled ?? data.enabled ?? true);
          setAutoLanguageDetection(data.autoLanguageDetection ?? true);
          setDefaultVoiceUr(data.defaultVoiceUr || 'ur-PK');
          setDefaultVoiceAr(data.defaultVoiceAr || 'ar-SA');
          setDefaultVoiceEn(data.defaultVoiceEn || 'en-US');
          setDefaultSpeed(data.defaultSpeed ?? data.readingSpeed ?? 1.0);
          setDefaultVolume(data.defaultVolume ?? data.volume ?? 1.0);
        }
      } catch (err) {
        console.warn('Failed to load VoiceReader settings:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSettings();
    return () => { isMounted = false; };
  }, []);

  // Fetch Browser Voices via SpeechSynthesis
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const updateVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      setBrowserVoices(voices);
    };

    updateVoices();

    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  // Toast Helper
  const displayToast = useCallback((msg: string, type: 'success' | 'error' | 'info') => {
    if (showToast) {
      showToast(msg, type);
    } else {
      setToastMessage({ text: msg, type });
      setTimeout(() => setToastMessage(null), 3500);
    }
  }, [showToast]);

  // Test Speech Synthesis Voice
  const handleTestVoice = (lang: 'ur' | 'ar' | 'en') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      displayToast('Speech synthesis is not supported in this browser environment.', 'error');
      return;
    }

    try {
      window.speechSynthesis.cancel();

      let testText = '';
      let targetVoiceURI = '';
      let fallbackLang = '';

      if (lang === 'ur') {
        testText = 'بسم اللہ الرحمن الرحیم، خوش آمدید';
        targetVoiceURI = defaultVoiceUr;
        fallbackLang = 'ur-PK';
      } else if (lang === 'ar') {
        testText = 'السلام عليكم ورحمة الله وبركاته';
        targetVoiceURI = defaultVoiceAr;
        fallbackLang = 'ar-SA';
      } else {
        testText = 'Welcome. This is a preview of the selected voice.';
        targetVoiceURI = defaultVoiceEn;
        fallbackLang = 'en-US';
      }

      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.rate = defaultSpeed;
      utterance.volume = defaultVolume;

      // Find matching voice object
      const matchedVoice = browserVoices.find(
        (v) => v.voiceURI === targetVoiceURI || v.name === targetVoiceURI || v.lang === targetVoiceURI
      );

      if (matchedVoice) {
        utterance.voice = matchedVoice;
      } else {
        utterance.lang = fallbackLang;
      }

      setIsTestingVoice(lang);

      utterance.onend = () => setIsTestingVoice(null);
      utterance.onerror = () => setIsTestingVoice(null);

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      setIsTestingVoice(null);
      displayToast('Error playing voice sample: ' + (err.message || 'Speech failed'), 'error');
    }
  };

  // Handle Save
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: Partial<VoiceReaderSettings> = {
      globalEnabled,
      enabled: globalEnabled,
      autoLanguageDetection,
      defaultVoiceUr,
      defaultVoiceAr,
      defaultVoiceEn,
      defaultSpeed,
      readingSpeed: defaultSpeed,
      defaultVolume,
      volume: defaultVolume
    };

    try {
      await updateVoiceReaderSettings(updated);
      displayToast('Voice Reader Settings saved successfully to Firestore!', 'success');
      if (onSaveSuccess) onSaveSuccess();
    } catch (err: any) {
      console.error('Save VoiceReader settings error:', err);
      displayToast('Failed to save Voice Reader settings: ' + (err.message || 'Server error'), 'error');
    } finally {
      setSaving(false);
    }
  };

  // Reset to Defaults
  const handleResetDefaults = () => {
    setGlobalEnabled(DEFAULT_FIRESTORE_VOICE_SETTINGS.globalEnabled);
    setAutoLanguageDetection(DEFAULT_FIRESTORE_VOICE_SETTINGS.autoLanguageDetection);
    setDefaultVoiceUr(DEFAULT_FIRESTORE_VOICE_SETTINGS.defaultVoiceUr);
    setDefaultVoiceAr(DEFAULT_FIRESTORE_VOICE_SETTINGS.defaultVoiceAr);
    setDefaultVoiceEn(DEFAULT_FIRESTORE_VOICE_SETTINGS.defaultVoiceEn);
    setDefaultSpeed(DEFAULT_FIRESTORE_VOICE_SETTINGS.defaultSpeed);
    setDefaultVolume(DEFAULT_FIRESTORE_VOICE_SETTINGS.defaultVolume);
    displayToast('Reset form to default values. Click Save to apply.', 'info');
  };

  // Filter browser voices by language
  const urduVoices = browserVoices.filter(v => v.lang.startsWith('ur') || v.lang.startsWith('hi') || v.name.toLowerCase().includes('urdu'));
  const arabicVoices = browserVoices.filter(v => v.lang.startsWith('ar') || v.name.toLowerCase().includes('arabic'));
  const englishVoices = browserVoices.filter(v => v.lang.startsWith('en') || v.name.toLowerCase().includes('english'));

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <span className="text-xs font-bold font-sans">Loading Voice Reader Settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto text-left font-sans text-slate-200" dir="ltr">
      
      {/* Toast Notification Banner (if not provided externally) */}
      {toastMessage && (
        <div className={`p-4 rounded-xl border text-xs font-bold flex items-center justify-between shadow-lg ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-600 text-emerald-200' 
            : toastMessage.type === 'error'
            ? 'bg-rose-950/90 border-rose-600 text-rose-200'
            : 'bg-slate-900 border-amber-500 text-amber-300'
        }`}>
          <div className="flex items-center gap-2">
            {toastMessage.type === 'success' && <Check className="w-4 h-4 text-emerald-400" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toastMessage.type === 'info' && <Sparkles className="w-4 h-4 text-amber-400" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 border border-emerald-800/80 rounded-2xl p-5 shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-2xl border border-amber-500/40">
            <Volume2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide font-serif">Voice Reader Settings</h2>
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] px-2.5 py-0.5 rounded-full font-bold">
                Firestore Config
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Configure global text-to-speech audio reader behavior, default voices, speed, and language detection.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleResetDefaults}
          className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0"
          title="Reset to default settings"
        >
          <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">Reset Defaults</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSettings} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-2xl">
        
        {/* Toggle 1: Global Enable/Disable */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Enable Voice Reader Globally</span>
            </div>
            <p className="text-xs text-slate-400">
              When toggled off, the "Listen / 🔊 سنیں" button is completely hidden across all post cards and detail views in the application.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setGlobalEnabled(!globalEnabled)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
              globalEnabled ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
            aria-label="Toggle Global Voice Reader"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                globalEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle 2: Automatic Language Detection */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Automatic Language Detection</span>
            </div>
            <p className="text-xs text-slate-400">
              Automatically inspect text scripts to dynamically switch between Urdu, Arabic, and English pronunciation engines.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setAutoLanguageDetection(!autoLanguageDetection)}
            className={`w-12 h-6 rounded-full transition-colors relative p-1 cursor-pointer shrink-0 ${
              autoLanguageDetection ? 'bg-emerald-600' : 'bg-slate-800'
            }`}
            aria-label="Toggle Automatic Language Detection"
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                autoLanguageDetection ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Section: Language Default Voices */}
        <div className="space-y-4 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            <span>Default Speech Voices by Language</span>
          </h3>

          {/* Urdu Voice Dropdown + Test */}
          <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-200 block">
              Default Urdu Voice (🇵🇰 اردو)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={defaultVoiceUr}
                onChange={(e) => setDefaultVoiceUr(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              >
                <option value="ur-PK">System Default Urdu (ur-PK)</option>
                {urduVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
                {urduVoices.length === 0 && (
                  <optgroup label="All Available Browser Voices">
                    {browserVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <button
                type="button"
                onClick={() => handleTestVoice('ur')}
                disabled={isTestingVoice === 'ur'}
                className="px-3.5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 disabled:opacity-50"
              >
                {isTestingVoice === 'ur' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>🔊 Test Voice</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-urdu dir-rtl text-right pt-1">
              نمونہ: "بسم اللہ الرحمن الرحیم، خوش آمدید"
            </p>
          </div>

          {/* Arabic Voice Dropdown + Test */}
          <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-200 block">
              Default Arabic Voice (🇸🇦 العربية)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={defaultVoiceAr}
                onChange={(e) => setDefaultVoiceAr(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              >
                <option value="ar-SA">System Default Arabic (ar-SA)</option>
                {arabicVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
                {arabicVoices.length === 0 && (
                  <optgroup label="All Available Browser Voices">
                    {browserVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <button
                type="button"
                onClick={() => handleTestVoice('ar')}
                disabled={isTestingVoice === 'ar'}
                className="px-3.5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 disabled:opacity-50"
              >
                {isTestingVoice === 'ar' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>🔊 Test Voice</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 font-sans dir-rtl text-right pt-1">
              Sample: "السلام عليكم ورحمة الله وبركاته"
            </p>
          </div>

          {/* English Voice Dropdown + Test */}
          <div className="space-y-1.5 bg-slate-950 p-4 rounded-xl border border-slate-800">
            <label className="text-xs font-bold text-slate-200 block">
              Default English Voice (🇬🇧 English)
            </label>
            <div className="flex items-center gap-2">
              <select
                value={defaultVoiceEn}
                onChange={(e) => setDefaultVoiceEn(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              >
                <option value="en-US">System Default English (en-US)</option>
                {englishVoices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
                {englishVoices.length === 0 && (
                  <optgroup label="All Available Browser Voices">
                    {browserVoices.map((v) => (
                      <option key={v.voiceURI} value={v.voiceURI}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>

              <button
                type="button"
                onClick={() => handleTestVoice('en')}
                disabled={isTestingVoice === 'en'}
                className="px-3.5 py-2.5 bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition shrink-0 active:scale-95 disabled:opacity-50"
              >
                {isTestingVoice === 'en' ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>🔊 Test Voice</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Sample: "Welcome. This is a preview of the selected voice."
            </p>
          </div>
        </div>

        {/* Section: Speed & Volume Sliders */}
        <div className="space-y-5 pt-2 border-t border-slate-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            <span>Playback Speed & Volume Defaults</span>
          </h3>

          {/* Speed Slider (0.75x – 1.5x) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-200">Default Reading Speed</span>
              <span className="text-amber-400 font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md">
                {defaultSpeed.toFixed(2)}x
              </span>
            </div>
            <input
              type="range"
              min={0.75}
              max={1.5}
              step={0.05}
              value={defaultSpeed}
              onChange={(e) => setDefaultSpeed(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0.75x (Slower)</span>
              <span>1.0x (Normal)</span>
              <span>1.5x (Faster)</span>
            </div>
          </div>

          {/* Volume Slider (0% – 100%) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-200">Default Volume</span>
              <span className="text-amber-400 font-mono bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md">
                {Math.round(defaultVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={1.0}
              step={0.05}
              value={defaultVolume}
              onChange={(e) => setDefaultVolume(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Muted)</span>
              <span>50%</span>
              <span>100% (Maximum)</span>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center gap-2 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Voice Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
};
