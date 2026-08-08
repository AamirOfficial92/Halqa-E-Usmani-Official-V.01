/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Post, VoiceReaderSettings } from '../types';
import { detectLanguage } from '../utils/languageDetection';

export type AudioSourceType = 'human' | 'ai';
export type DetectedLanguage = 'ur' | 'ar' | 'en';
export { detectLanguage };

export interface PlaybackState {
  isPlaying: boolean;
  isPaused: boolean;
  isLoading?: boolean;
  currentTime: number;
  duration: number;
  speed: number;
  volume: number;
  sourceType: AudioSourceType;
  language: DetectedLanguage;
  activePostId: string | null;
  activePostTitle: string | null;
  activePostCategory: string | null;
  error: string | null;
  audioUrl?: string | null;
}

export interface PlaybackProgress {
  postId: string;
  lastPositionSec: number;
  updatedAt: number;
}

/**
 * Stores playback position in localStorage under namespaced key "voiceReader:progress:{postId}"
 */
export function savePlaybackProgress(postId: string, lastPositionSec: number): void {
  if (!postId || typeof window === 'undefined') return;
  try {
    if (lastPositionSec <= 1) return;
    const data: PlaybackProgress = {
      postId,
      lastPositionSec: Math.floor(lastPositionSec),
      updatedAt: Date.now()
    };
    localStorage.setItem(`voiceReader:progress:${postId}`, JSON.stringify(data));
  } catch (e) {
    // Ignore storage quota or security errors
  }
}

/**
 * Retrieves saved playback progress position for a post
 */
export function getPlaybackProgress(postId: string): PlaybackProgress | null {
  if (!postId || typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(`voiceReader:progress:${postId}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.lastPositionSec === 'number' && parsed.lastPositionSec > 2) {
      return parsed as PlaybackProgress;
    }
  } catch (e) {}
  return null;
}

/**
 * Clears saved playback progress for a post once finished
 */
export function clearPlaybackProgress(postId: string): void {
  if (!postId || typeof window === 'undefined') return;
  try {
    localStorage.removeItem(`voiceReader:progress:${postId}`);
  } catch (e) {}
}

/**
 * Preprocesses Islamic text to ensure respectful honorific pronunciation
 */
export function preprocessIslamicText(text: string, lang: DetectedLanguage): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Remove HTML tags & Markdown formatting
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');
  cleaned = cleaned.replace(/[*_#`~[\]()]/g, ' ');
  cleaned = cleaned.replace(/\s+/g, ' ');

  if (lang === 'en') {
    // English Islamic Honorific expansions
    cleaned = cleaned.replace(/ﷺ|\(pbuh\)|\(PBUH\)/gi, ' Peace be upon Him ');
    cleaned = cleaned.replace(/\(ra\)|\(RA\)|\(r\.a\)/gi, ' May Allah be pleased with him ');
    cleaned = cleaned.replace(/\(as\)|\(AS\)|\(a\.s\)/gi, ' Peace be upon him ');
    cleaned = cleaned.replace(/\(rh\)|\(RH\)|\(r\.h\)/gi, ' May Allah have mercy upon him ');
    cleaned = cleaned.replace(/\(swt\)|\(SWT\)/gi, ' Glory to Him, the Exalted ');
    cleaned = cleaned.replace(/Allah/g, ' Allah ');
  } else {
    // Urdu / Arabic Honorific expansions for respectful AI pronunciation
    cleaned = cleaned.replace(/ﷺ|\(ص\)|صلی اللہ علیہ وسلم|صلی الله علیہ وسلم/g, ' صَلَّى اللّٰہُ عَلَیْہِ وَآلِہٖ وَسَلَّم ');
    cleaned = cleaned.replace(/\(ع\)|\(علیہ السلام\)/g, ' عَلَیْہِ السَّلَام ');
    cleaned = cleaned.replace(/\(رض\)|\(رضی اللہ عنہ\)/g, ' رَضِیَ اللّٰہُ عَنْہُ ');
    cleaned = cleaned.replace(/رضی اللہ عنہا/g, ' رَضِیَ اللّٰہُ عَنْہَا ');
    cleaned = cleaned.replace(/رضی اللہ عنہم/g, ' رَضِیَ اللّٰہُ عَنْہُمْ ');
    cleaned = cleaned.replace(/\(رح\)|\(رحمۃ اللہ علیہ\)/g, ' رَحْمَۃُ اللّٰہِ عَلَیْہِ ');
    cleaned = cleaned.replace(/اللہ تعالیٰ|اللہ تعالی/g, ' اللّٰہ تَعَالٰى ');
    cleaned = cleaned.replace(/رسول اللہ/g, ' رَسُولُ اللّٰہ ');
    cleaned = cleaned.replace(/نبی کریم/g, ' نَبِیِّ کَرِیم ');
    cleaned = cleaned.replace(/صحابہ کرام/g, ' صَحَابَۂ کِرَام ');
    cleaned = cleaned.replace(/اہلِ بیت|اہل بیت/g, ' اَہْلِ بَیْت ');
  }

  return cleaned.trim();
}

/**
 * Default global voice settings fallback
 */
export const DEFAULT_VOICE_SETTINGS: VoiceReaderSettings = {
  globalEnabled: true,
  defaultVoiceUr: 'ur-PK',
  defaultVoiceAr: 'ar-SA',
  defaultVoiceEn: 'en-US',
  defaultSpeed: 1.0,
  defaultVolume: 1.0,
  autoLanguageDetection: true,
  enabled: true,
  defaultVoice: 'auto',
  readingSpeed: 1.0,
  volume: 1.0,
  honorificPronunciation: true,
  cacheAudio: true
};

/*
 * BACKGROUND PLAYBACK ARCHITECTURE NOTE:
 * Official audio recordings (human MP3 files) use a singleton HTMLAudioElement bound to
 * the application-level voiceReaderEngine service.
 * Because the Audio instance is maintained outside React's component lifecycle, user navigation
 * between tabs, screens, and posts does NOT unmount or kill the audio player.
 *
 * SPEECH SYNTHESIS BACKGROUND PLAYBACK LIMITATION NOTE:
 * Browser Web Speech APIs (window.speechSynthesis) are subject to background throttling
 * and audio policies enforced by mobile OSes (iOS Safari, Android Chrome) when the browser tab
 * loses focus or screen locks.
 * The engine catches visibility change and pause/error events, degrading gracefully
 * into a 'paused' state while storing the position in localStorage, allowing the user to
 * smoothly resume speech playback upon returning to the app without errors or crashes.
 */

/**
 * VoiceReaderEngine Singleton Service
 */
class VoiceReaderEngine {
  private audioElement: HTMLAudioElement | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private stateListeners: Array<(state: PlaybackState) => void> = [];
  private lastSavedProgressTime = 0;

  private currentState: PlaybackState = {
    isPlaying: false,
    isPaused: false,
    currentTime: 0,
    duration: 0,
    speed: 1.0,
    volume: 1.0,
    sourceType: 'ai',
    language: 'ur',
    activePostId: null,
    activePostTitle: null,
    activePostCategory: null,
    error: null,
    audioUrl: null
  };

  private speechChunks: string[] = [];
  private currentChunkIndex = 0;
  private speechTimer: any = null;
  private lastPostObject: Post | null = null;
  private lastSettingsObject: VoiceReaderSettings = DEFAULT_VOICE_SETTINGS;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupAudioListeners();
      this.setupVisibilityListeners();
    }
  }

  public subscribe(listener: (state: PlaybackState) => void): () => void {
    this.stateListeners.push(listener);
    listener(this.currentState);
    return () => {
      this.stateListeners = this.stateListeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.stateListeners.forEach((listener) => listener({ ...this.currentState }));
  }

  private setupVisibilityListeners() {
    if (typeof window === 'undefined') return;
    document.addEventListener('visibilitychange', () => {
      // Degrade gracefully for SpeechSynthesis if backgrounded
      if (document.hidden && this.currentState.sourceType === 'ai' && this.currentState.isPlaying) {
        this.pause();
      }
    });
  }

  private setupAudioListeners() {
    if (!this.audioElement) return;

    this.audioElement.addEventListener('play', () => {
      this.currentState.isPlaying = true;
      this.currentState.isPaused = false;
      this.currentState.error = null;
      this.notify();
    });

    this.audioElement.addEventListener('pause', () => {
      if (!this.audioElement?.ended) {
        this.currentState.isPlaying = false;
        this.currentState.isPaused = true;
        if (this.currentState.activePostId) {
          savePlaybackProgress(this.currentState.activePostId, this.currentState.currentTime);
        }
        this.notify();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      this.currentState.isPlaying = false;
      this.currentState.isPaused = false;
      this.currentState.currentTime = 0;
      if (this.currentState.activePostId) {
        clearPlaybackProgress(this.currentState.activePostId);
      }
      this.notify();
    });

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.audioElement) {
        this.currentState.currentTime = this.audioElement.currentTime;
        this.currentState.duration = this.audioElement.duration || 0;

        // Periodically save playback position every ~2 seconds
        const now = Date.now();
        if (now - this.lastSavedProgressTime > 2000 && this.currentState.activePostId) {
          this.lastSavedProgressTime = now;
          savePlaybackProgress(this.currentState.activePostId, this.currentState.currentTime);
        }

        this.notify();
      }
    });

    this.audioElement.addEventListener('error', (e) => {
      console.warn('Human MP3 audio network/playback error:', e);
      this.currentState.isPlaying = false;
      this.currentState.isPaused = true;
      this.currentState.error = 'شبکہ کنکشن کی خرابی یا آڈیو فائل نہیں چل سکی۔ (Network error or audio failed to load)';
      this.notify();
    });
  }

  /**
   * Main Play function: Handles human MP3 or AI TTS fallback
   */
  public playPost(post: Post, settings: VoiceReaderSettings = DEFAULT_VOICE_SETTINGS) {
    if (post.voiceReaderEnabled === false) {
      this.currentState.error = 'Voice Reader is disabled for this specific post.';
      this.notify();
      return;
    }

    const isEnabled = settings.globalEnabled ?? settings.enabled ?? true;
    if (!isEnabled) {
      this.currentState.error = 'Voice Reader is disabled in settings.';
      this.notify();
      return;
    }

    this.lastPostObject = post;
    this.lastSettingsObject = settings;

    // Check if we are already playing this post
    if (this.currentState.activePostId === post.id && (this.currentState.isPlaying || this.currentState.isPaused)) {
      if (this.currentState.isPaused) {
        this.resume();
      }
      return;
    }

    this.stop();

    const textToRead = post.completeArticleUrdu || post.completeArticle || post.shortDescriptionUrdu || post.shortDescription || post.titleUrdu || post.title;
    const lang = detectLanguage(textToRead, post.language);
    const speed = settings.defaultSpeed ?? settings.readingSpeed ?? 1.0;
    const volume = settings.defaultVolume ?? settings.volume ?? 1.0;

    this.currentState.activePostId = post.id;
    this.currentState.activePostTitle = post.titleUrdu || post.title;
    this.currentState.activePostCategory = post.category;
    this.currentState.language = lang;
    this.currentState.speed = speed;
    this.currentState.volume = volume;
    this.currentState.error = null;

    const audioRecordingUrl = post.officialAudioUrl || post.humanVoiceUrl;
    this.currentState.audioUrl = audioRecordingUrl || null;

    if (audioRecordingUrl && audioRecordingUrl.trim().length > 0) {
      this.playHumanVoice(audioRecordingUrl, settings);
    } else {
      this.playAIVoice(textToRead, lang, settings);
    }
  }

  /**
   * Plays human official recording MP3 with try/catch network error handling
   */
  public playHumanVoice(url: string, settings: VoiceReaderSettings = DEFAULT_VOICE_SETTINGS) {
    if (!this.audioElement) return;

    try {
      this.currentState.sourceType = 'human';
      this.currentState.error = null;
      this.currentState.audioUrl = url;

      if (this.audioElement.src !== url) {
        this.audioElement.src = url;
      }
      this.audioElement.playbackRate = settings.readingSpeed || this.currentState.speed || 1.0;
      this.audioElement.volume = settings.volume ?? this.currentState.volume ?? 1.0;

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            this.currentState.isPlaying = true;
            this.currentState.isPaused = false;
            this.currentState.error = null;
            this.notify();
          })
          .catch((err) => {
            console.warn('Human Voice play promise error:', err);
            this.currentState.isPlaying = false;
            this.currentState.isPaused = true;
            this.currentState.error = 'آڈیو فائل نٹ ورک کی خرابی کی وجہ سے نہیں چلی۔ (Network error loading audio)';
            this.notify();
          });
      }
    } catch (err: any) {
      console.error('playHumanVoice exception:', err);
      this.currentState.isPlaying = false;
      this.currentState.isPaused = true;
      this.currentState.error = 'آڈیو سسٹم میں خرابی پیش آئی۔ (Audio system error)';
      this.notify();
    }
  }

  /**
   * Retries playing after a network or loading error
   */
  public retry() {
    this.currentState.error = null;
    if (this.lastPostObject) {
      this.playPost(this.lastPostObject, this.lastSettingsObject);
    } else if (this.currentState.audioUrl && this.currentState.sourceType === 'human') {
      this.playHumanVoice(this.currentState.audioUrl, this.lastSettingsObject);
    } else {
      this.resume();
    }
  }

  private async playAIVoice(rawText: string, lang: DetectedLanguage, settings: VoiceReaderSettings) {
    this.currentState.sourceType = 'ai';
    this.currentState.isLoading = true;
    this.currentState.error = null;
    this.notify();

    const processedText = settings.honorificPronunciation
      ? preprocessIslamicText(rawText, lang)
      : rawText.replace(/<[^>]*>/g, ' ');

    if (!processedText || processedText.trim().length === 0) {
      this.currentState.isLoading = false;
      this.currentState.error = 'No readable text content found for recitation.';
      this.notify();
      return;
    }

    // Try server-side Gemini AI Text-To-Speech API first
    try {
      const selectedVoice = lang === 'ar' ? settings.defaultVoiceAr || 'Zephyr' : lang === 'ur' ? settings.defaultVoiceUr || 'Kore' : settings.defaultVoiceEn || 'Kore';
      
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: processedText,
          lang,
          voiceName: selectedVoice
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.audioUrl && this.audioElement) {
          this.currentState.isLoading = false;
          this.currentState.audioUrl = data.audioUrl;
          this.audioElement.src = data.audioUrl;
          this.audioElement.playbackRate = settings.readingSpeed || this.currentState.speed || 1.0;
          this.audioElement.volume = settings.volume ?? this.currentState.volume ?? 1.0;

          const playPromise = this.audioElement.play();
          if (playPromise !== undefined) {
            await playPromise;
            this.currentState.isPlaying = true;
            this.currentState.isPaused = false;
            this.currentState.error = null;
            this.notify();
            return;
          }
        }
      }
    } catch (err) {
      console.warn('Gemini TTS API unavailable, using browser speech synthesis fallback:', err);
    }

    // Fallback to browser client-side Speech Synthesis
    this.currentState.isLoading = false;
    this.fallbackToBrowserSpeech(processedText, lang, settings);
  }

  private fallbackToBrowserSpeech(processedText: string, lang: DetectedLanguage, settings: VoiceReaderSettings) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.currentState.error = 'Speech synthesis is not supported on this device browser.';
      this.notify();
      return;
    }

    window.speechSynthesis.cancel();

    // Split text into natural sentences for smooth non-robotic pauses
    const sentences = processedText
      .split(/(?<=[.!?۔\n])\s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    if (sentences.length === 0) {
      this.currentState.error = 'No readable text content found for recitation.';
      this.notify();
      return;
    }

    this.speechChunks = sentences;
    this.currentChunkIndex = 0;
    this.currentState.duration = sentences.length * 4; // approximate total duration estimate
    this.currentState.currentTime = 0;

    this.speakNextChunk(lang, settings);
  }

  private speakNextChunk(lang: DetectedLanguage, settings: VoiceReaderSettings) {
    if (this.currentChunkIndex >= this.speechChunks.length) {
      this.currentState.isPlaying = false;
      this.currentState.isPaused = false;
      this.currentState.currentTime = this.currentState.duration;
      this.notify();
      return;
    }

    const chunk = this.speechChunks[this.currentChunkIndex];
    const utterance = new SpeechSynthesisUtterance(chunk);
    this.currentUtterance = utterance;

    // Set voice language code according to detected language
    if (lang === 'ur') {
      utterance.lang = 'ur-PK';
    } else if (lang === 'ar') {
      utterance.lang = 'ar-SA';
    } else {
      utterance.lang = 'en-US';
    }

    // Try finding natural matching voice installed on device if available
    const availableVoices = window.speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      const match = availableVoices.find(
        (v) =>
          v.lang.toLowerCase().startsWith(utterance.lang.toLowerCase()) ||
          v.lang.toLowerCase().includes(lang)
      );
      if (match) {
        utterance.voice = match;
      }
    }

    // Set dignified rate (speed) and pitch
    utterance.rate = settings.readingSpeed || 1.0;
    utterance.pitch = 0.95; // Soft dignified Islamic tone
    utterance.volume = settings.volume ?? 1.0;

    utterance.onstart = () => {
      this.currentState.isPlaying = true;
      this.currentState.isPaused = false;
      this.currentState.currentTime = this.currentChunkIndex * 4;
      this.notify();
    };

    utterance.onend = () => {
      this.currentChunkIndex++;
      if (this.currentState.isPlaying) {
        this.speakNextChunk(lang, settings);
      }
    };

    utterance.onerror = (evt) => {
      console.warn('Speech synthesis chunk error:', evt);
      this.currentChunkIndex++;
      if (this.currentChunkIndex < this.speechChunks.length && this.currentState.isPlaying) {
        this.speakNextChunk(lang, settings);
      } else {
        this.currentState.isPlaying = false;
        this.notify();
      }
    };

    window.speechSynthesis.speak(utterance);
  }

  public pause() {
    if (this.currentState.sourceType === 'human' && this.audioElement) {
      this.audioElement.pause();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
    }
    this.currentState.isPlaying = false;
    this.currentState.isPaused = true;
    this.notify();
  }

  public resume() {
    if (this.currentState.sourceType === 'human' && this.audioElement) {
      this.audioElement.play();
    } else if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.currentState.isPlaying = true;
      this.currentState.isPaused = false;
      this.notify();
    }
  }

  public stop() {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (this.speechTimer) {
      clearInterval(this.speechTimer);
      this.speechTimer = null;
    }
    this.currentState.isPlaying = false;
    this.currentState.isPaused = false;
    this.currentState.currentTime = 0;
    this.currentState.activePostId = null;
    this.currentState.activePostTitle = null;
    this.notify();
  }

  public seek(seconds: number) {
    if (this.currentState.sourceType === 'human' && this.audioElement) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration || 0));
    } else {
      // For AI Speech Synthesis, seek jump to chunk
      const targetChunk = Math.floor((seconds / (this.currentState.duration || 1)) * this.speechChunks.length);
      this.currentChunkIndex = Math.max(0, Math.min(targetChunk, this.speechChunks.length - 1));
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (this.currentState.isPlaying) {
        this.speakNextChunk(this.currentState.language, DEFAULT_VOICE_SETTINGS);
      }
    }
  }

  public setSpeed(speed: number) {
    this.currentState.speed = speed;
    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
    this.notify();
  }

  public setVolume(volume: number) {
    this.currentState.volume = volume;
    if (this.audioElement) {
      this.audioElement.volume = volume;
    }
    this.notify();
  }

  public getState(): PlaybackState {
    return { ...this.currentState };
  }
}

export const voiceReaderEngine = new VoiceReaderEngine();
