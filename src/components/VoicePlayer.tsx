/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  X, 
  Mic, 
  Sparkles, 
  Globe, 
  Gauge, 
  AlertCircle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { detectLanguage, SupportedLanguage, LanguageSetting } from '../utils/languageDetection';
import { 
  voiceReaderEngine, 
  getPlaybackProgress, 
  clearPlaybackProgress, 
  PlaybackState 
} from '../lib/voiceReaderEngine';
import { OfficialRecordingBadge, AIVoiceBadge } from './VoiceReaderBadges';
import { useVoiceReader } from '../context/VoiceReaderContext';
import { Post } from '../types';

export interface VoicePlayerProps {
  postId: string;
  text: string;
  language?: LanguageSetting;
  officialAudioUrl?: string;
  compact?: boolean;
  postTitle?: string;
  voiceReaderEnabled?: boolean;
}

/*
 * BACKGROUND PLAYBACK & SPEECH SYNTHESIS NOTE:
 * - Official audio (human MP3) playback is bound to the global voiceReaderEngine singleton.
 *   Navigating between React screens/tabs does NOT unmount or stop the Audio instance.
 * - SpeechSynthesis backgrounding is subject to browser tab visibility policies.
 *   When the tab is hidden, speech synthesis degrades gracefully into a paused state
 *   with saved progress, allowing the user to resume playback upon returning without crash.
 */

export const VoicePlayer: React.FC<VoicePlayerProps> = ({
  postId,
  text,
  language = 'auto',
  officialAudioUrl,
  compact = true,
  postTitle,
  voiceReaderEnabled = true
}) => {
  const { settings, setCurrentlyPlaying, setCurrentlyPlayingPostIdState } = useVoiceReader() as any;

  // Determine effective language
  const effectiveLanguage: SupportedLanguage = detectLanguage(text, language);

  // Expanded UI state
  const [isExpanded, setIsExpanded] = useState<boolean>(!compact);

  // Mode: 'official' (human recording) or 'ai' (TTS synthesis)
  const [playbackMode, setPlaybackMode] = useState<'official' | 'ai'>(
    officialAudioUrl ? 'official' : 'ai'
  );

  // Local synced playback state from voiceReaderEngine singleton
  const [engineState, setEngineState] = useState<PlaybackState>(voiceReaderEngine.getState());

  // Resume prompt state for saved playback position
  const [savedPositionPrompt, setSavedPositionPrompt] = useState<number | null>(null);

  // Speed and volume local settings
  const [speed, setSpeed] = useState<number>(1.0);
  const [volume, setVolume] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Browser SpeechSynthesis availability check
  const isSpeechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const isCurrentPostActive = engineState.activePostId === postId;
  const isPlaying = isCurrentPostActive && engineState.isPlaying;
  const isPaused = isCurrentPostActive && engineState.isPaused;
  const currentTime = isCurrentPostActive ? engineState.currentTime : 0;
  const duration = isCurrentPostActive ? engineState.duration : 0;
  const errorMessage = isCurrentPostActive ? engineState.error : null;

  // Render nothing if global or per-post settings are disabled
  if (settings && (settings.globalEnabled === false || settings.enabled === false)) {
    return null;
  }
  if (voiceReaderEnabled === false) {
    return null;
  }

  /* ========================================================================
   * 1. Subscribe to voiceReaderEngine Singleton for Persistent Background Playback
   * ======================================================================== */
  useEffect(() => {
    const unsubscribe = voiceReaderEngine.subscribe((state) => {
      setEngineState(state);
    });

    return () => {
      // NOTE: Unsubscribing does NOT stop the audio singleton, preserving background audio!
      unsubscribe();
    };
  }, []);

  /* ========================================================================
   * 2. Check for Saved Playback Position to Offer Resume Prompt
   * ======================================================================== */
  useEffect(() => {
    const progress = getPlaybackProgress(postId);
    if (progress && progress.lastPositionSec > 2 && !isPlaying) {
      setSavedPositionPrompt(progress.lastPositionSec);
    } else {
      setSavedPositionPrompt(null);
    }
  }, [postId, isPlaying]);

  /* ========================================================================
   * 3. Playback Controls Delegated to Singleton Engine
   * ======================================================================== */
  const constructDummyPost = (): Post => ({
    id: postId,
    title: postTitle || 'Post',
    titleUrdu: postTitle || 'مضمون',
    category: 'Makhzan',
    shortDescription: text,
    shortDescriptionUrdu: text,
    completeArticleUrdu: text,
    completeArticle: text,
    coverImage: '',
    images: [],
    officialAudioUrl: playbackMode === 'official' ? officialAudioUrl : undefined,
    humanVoiceUrl: playbackMode === 'official' ? officialAudioUrl : undefined,
    status: 'published',
    tags: [],
    city: '',
    country: '',
    publishDate: new Date().toISOString(),
    isDraft: false,
    views: 0,
    bookmarksCount: 0,
    language: effectiveLanguage,
    voiceReaderEnabled: true
  });

  const handlePlay = () => {
    if (!isExpanded) setIsExpanded(true);
    setSavedPositionPrompt(null);

    const post = constructDummyPost();
    voiceReaderEngine.playPost(post, {
      ...settings,
      readingSpeed: speed,
      defaultSpeed: speed,
      volume: isMuted ? 0 : volume,
      defaultVolume: isMuted ? 0 : volume
    });
  };

  const handleResumeFromPosition = (posSec: number) => {
    setSavedPositionPrompt(null);
    if (!isCurrentPostActive) {
      handlePlay();
      setTimeout(() => {
        voiceReaderEngine.seek(posSec);
      }, 200);
    } else {
      voiceReaderEngine.seek(posSec);
      voiceReaderEngine.resume();
    }
  };

  const handlePause = () => {
    voiceReaderEngine.pause();
  };

  const handleStop = () => {
    voiceReaderEngine.stop();
    setSavedPositionPrompt(null);
    clearPlaybackProgress(postId);
  };

  const handleRetry = () => {
    voiceReaderEngine.retry();
  };

  const handleRewind = () => {
    voiceReaderEngine.seek(currentTime - 10);
  };

  const handleForward = () => {
    voiceReaderEngine.seek(currentTime + 10);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    voiceReaderEngine.seek(val);
  };

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    voiceReaderEngine.setSpeed(newSpeed);
  };

  const toggleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    voiceReaderEngine.setVolume(newMuteState ? 0 : volume);
  };

  const handleToggleMode = () => {
    voiceReaderEngine.stop();
    setPlaybackMode((prev) => (prev === 'official' ? 'ai' : 'official'));
  };

  // Time format helper
  const formatTime = (secs: number): string => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, duration - currentTime);

  /* ========================================================================
   * 4. SpeechSynthesis Unsupported Fallback
   * ======================================================================== */
  if (playbackMode === 'ai' && !isSpeechSupported && !officialAudioUrl) {
    return (
      <div className="p-3 bg-amber-950/30 border border-amber-800/50 rounded-xl text-amber-200 text-xs flex items-center gap-2 font-urdu my-2">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>اس ڈیوائس پر آواز کی سہولت دستیاب نہیں (Speech Synthesis Unsupported on this Device)</span>
      </div>
    );
  }

  /* ========================================================================
   * 5. Render Compact Button (Collapsed View)
   * ======================================================================== */
  if (!isExpanded && compact) {
    const isLoadingThis = isCurrentPostActive && engineState.isLoading;
    return (
      <div className="inline-block my-1">
        <button
          onClick={() => {
            setIsExpanded(true);
            if (!isPlaying && !isLoadingThis) handlePlay();
          }}
          disabled={isLoadingThis}
          aria-label={effectiveLanguage === 'en' ? 'Listen to Post Audio' : 'آڈیو سنیں'}
          className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-900 to-teal-950 hover:from-emerald-800 hover:to-teal-900 text-emerald-200 hover:text-white border border-emerald-700/70 rounded-full text-xs font-bold font-urdu flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-80"
        >
          {isLoadingThis ? (
            <Loader2 className="w-4 h-4 text-amber-400 animate-spin" />
          ) : (
            <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />
          )}
          <span>
            {isLoadingThis
              ? (effectiveLanguage === 'en' ? 'Generating Voice...' : 'آواز کی تیاری...')
              : (effectiveLanguage === 'en' ? 'Listen' : '🔊 سنیں')}
          </span>
          {officialAudioUrl && (
            <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-1.5 py-0.2 rounded-full">
              رسمی
            </span>
          )}
        </button>
      </div>
    );
  }

  /* ========================================================================
   * 6. Full Expanded Player View
   * ======================================================================== */
  return (
    <div 
      dir={effectiveLanguage === 'en' ? 'ltr' : 'rtl'}
      className="w-full bg-gradient-to-r from-slate-950 via-emerald-950 to-slate-950 text-white rounded-2xl border border-emerald-700/80 shadow-xl p-3.5 sm:p-4 my-3 font-sans relative overflow-hidden transition-all duration-300 motion-reduce:transition-none"
    >
      {/* Top Header: Badge, Language Indicator & Collapse Button */}
      <div className="flex items-center justify-between gap-2 border-b border-emerald-800/60 pb-2.5 mb-3">
        <div className="flex items-center gap-2 min-w-0">
          {/* Source Badge */}
          {playbackMode === 'official' ? (
            <OfficialRecordingBadge size="xs" showBilingual={true} />
          ) : (
            <AIVoiceBadge size="xs" showBilingual={true} />
          )}

          {/* Language Chip */}
          <span className="text-[10px] bg-slate-900/80 text-slate-300 border border-slate-700 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Globe className="w-3 h-3 text-amber-400" />
            <span className="uppercase">{effectiveLanguage}</span>
          </span>
        </div>

        {/* Close/Collapse Button */}
        {compact && (
          <button
            onClick={() => {
              setIsExpanded(false);
            }}
            aria-label={effectiveLanguage === 'en' ? 'Close audio player view' : 'آڈیو ویو بند کریں'}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700 shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Resume Playback Position Banner */}
      {savedPositionPrompt !== null && !isPlaying && (
        <div className="p-2.5 bg-amber-950/80 border border-amber-500/60 rounded-xl text-amber-200 text-xs flex items-center justify-between gap-2 my-2 font-sans">
          <div className="flex items-center gap-2 min-w-0">
            <RotateCcw className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="truncate">
              جاری رکھیں؟ / Resume from where you left off? ({formatTime(savedPositionPrompt)})
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => handleResumeFromPosition(savedPositionPrompt)}
              className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-[11px] rounded-lg transition active:scale-95 shadow-sm cursor-pointer"
            >
              جاری رکھیں / Resume
            </button>

            <button
              onClick={() => {
                setSavedPositionPrompt(null);
                clearPlaybackProgress(postId);
              }}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] rounded-lg border border-slate-700 transition cursor-pointer"
            >
              شروع سے / Restart
            </button>
          </div>
        </div>
      )}

      {/* Error Message Banner & Retry Button */}
      {errorMessage && (
        <div className="mb-3 p-2.5 bg-rose-950/90 border border-rose-600/70 rounded-xl text-rose-200 text-xs flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            onClick={handleRetry}
            className="px-2.5 py-1 bg-rose-800 hover:bg-rose-700 text-white rounded-lg font-bold text-[11px] flex items-center gap-1 transition shrink-0 active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>دوبارہ کوشش / Retry</span>
          </button>
        </div>
      )}

      {/* Row 1: Core Media Controls */}
      <div className="flex items-center justify-center gap-3 sm:gap-4 my-2">
        {/* Rewind 10s */}
        <button
          onClick={handleRewind}
          aria-label={effectiveLanguage === 'en' ? 'Rewind 10 seconds' : '10 سیکنڈ پیچھے'}
          className="w-11 h-11 min-w-[44px] min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl flex items-center justify-center transition active:scale-95 shadow-md cursor-pointer"
          title={effectiveLanguage === 'en' ? 'Rewind 10s' : '10 سیکنڈ پیچھے'}
        >
          <RotateCcw className="w-5 h-5 text-emerald-400" />
        </button>

        {/* Big Center Play / Pause Button */}
        <button
          onClick={isPlaying ? handlePause : handlePlay}
          disabled={isCurrentPostActive && engineState.isLoading}
          aria-label={isPlaying ? (effectiveLanguage === 'en' ? 'Pause' : 'وقفہ کریں') : (effectiveLanguage === 'en' ? 'Play' : 'چلائیں')}
          className="w-14 h-14 min-w-[56px] min-h-[56px] bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg transition transform active:scale-95 border border-amber-300 shrink-0 cursor-pointer disabled:opacity-80"
        >
          {isCurrentPostActive && engineState.isLoading ? (
            <Loader2 className="w-7 h-7 text-slate-950 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-7 h-7 fill-slate-950" />
          ) : (
            <Play className="w-7 h-7 fill-slate-950 ml-0.5" />
          )}
        </button>

        {/* Forward 10s */}
        <button
          onClick={handleForward}
          aria-label={effectiveLanguage === 'en' ? 'Forward 10 seconds' : '10 سیکنڈ آگے'}
          className="w-11 h-11 min-w-[44px] min-h-[44px] bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 rounded-xl flex items-center justify-center transition active:scale-95 shadow-md cursor-pointer"
          title={effectiveLanguage === 'en' ? 'Forward 10s' : '10 سیکنڈ آگے'}
        >
          <RotateCw className="w-5 h-5 text-emerald-400" />
        </button>

        {/* Stop Button */}
        <button
          onClick={handleStop}
          aria-label={effectiveLanguage === 'en' ? 'Stop audio' : 'آڈیو روک دیں'}
          className="w-10 h-10 min-w-[40px] min-h-[40px] bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-700/60 rounded-xl flex items-center justify-center transition active:scale-95 shadow-md ml-2 cursor-pointer"
          title={effectiveLanguage === 'en' ? 'Stop' : 'روک دیں'}
        >
          <Square className="w-4 h-4 fill-rose-300" />
        </button>
      </div>

      {/* Row 2: Progress Bar & Elapsed / Remaining Time Labels */}
      <div className="space-y-1 my-3 px-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          step={0.1}
          value={currentTime || 0}
          onChange={handleSeek}
          aria-label={effectiveLanguage === 'en' ? 'Audio progress bar' : 'آڈیو وقت پوزیشن'}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 border border-emerald-900"
        />

        <div className="flex items-center justify-between text-[11px] font-mono text-emerald-300 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span className="text-slate-400 text-[10px]">
            -{formatTime(remainingTime)}
          </span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Row 3: Speed Selector Chips & Mute Button */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-900">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-slate-400 flex items-center gap-1 mr-1">
            <Gauge className="w-3 h-3 text-amber-400" />
            <span>{effectiveLanguage === 'en' ? 'Speed:' : 'رفتار:'}</span>
          </span>

          {[0.75, 1.0, 1.25, 1.5].map((s) => (
            <button
              key={s}
              onClick={() => handleSpeedChange(s)}
              aria-label={`Playback speed ${s}x`}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold font-mono transition border cursor-pointer ${
                speed === s
                  ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm'
                  : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Mute Toggle Button */}
        <button
          onClick={toggleMute}
          aria-label={isMuted ? 'Unmute audio' : 'Mute audio'}
          className="p-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 rounded-lg transition active:scale-95 shrink-0 cursor-pointer"
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
        </button>
      </div>

      {/* Row 4: Optional Preference Switcher (if officialAudioUrl exists) */}
      {officialAudioUrl && (
        <div className="pt-2 mt-2 border-t border-slate-900 text-center">
          <button
            onClick={handleToggleMode}
            className="text-[10px] text-amber-300/90 hover:text-amber-200 underline flex items-center justify-center gap-1 mx-auto transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3 text-amber-400" />
            <span>
              {playbackMode === 'official'
                ? (effectiveLanguage === 'en' ? 'Switch to AI Voice' : 'اے آئی آواز میں منتقل ہوں')
                : (effectiveLanguage === 'en' ? 'Switch to Official Recording' : 'اصل ریکارڈنگ میں منتقل ہوں')}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};
