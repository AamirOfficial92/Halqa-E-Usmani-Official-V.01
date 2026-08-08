/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SupportedLanguage } from '../utils/languageDetection';
import { expandHonorifics } from '../utils/islamicPronunciation';

export interface SpeakOptions {
  rate?: number;
  volume?: number;
  onWord?: (charIndex: number, charLength?: number) => void;
  onSentenceChange?: (sentenceIndex: number) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
}

/**
 * Prepares and cleanses raw text for speech synthesis:
 * - Expands honorific abbreviations into their full respectful spoken form (e.g. ﷺ, (ع), (رض), (رح))
 * - Normalizes multiple whitespace and line breaks
 * - Removes markdown symbols (**, #, *, _, ~, `, >, etc.)
 */
export function prepareTextForSpeech(text: string, lang: SupportedLanguage): string {
  if (!text) return '';

  let cleaned = text;

  // 1. Strip Markdown Formatting
  cleaned = cleaned
    .replace(/^#{1,6}\s+/gm, '') // Headings
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1') // Bold/Italics * or **
    .replace(/_{1,3}([^_]+)_{1,3}/g, '$1') // Underscores _ or __
    .replace(/~~([^~]+)~~/g, '$1') // Strikethrough
    .replace(/`([^`]+)`/g, '$1') // Inline code
    .replace(/```[\s\S]*?```/g, '') // Code blocks
    .replace(/^>\s+/gm, '') // Blockquotes
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links [text](url)
    .replace(/<[^>]*>/g, ' '); // HTML tags

  // 2. Expand Honorific Abbreviations for Spoken Phonetics
  cleaned = expandHonorifics(cleaned, lang);

  // 3. Normalize Whitespace and Line Breaks
  cleaned = cleaned
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned;
}

/**
 * Splitting text into sentence-level chunks using punctuation (۔, ।, ., !, ?, line breaks)
 */
export function splitIntoSentences(text: string): string[] {
  if (!text) return [];
  
  // Split on Urdu full stop (۔), Devanagari danda (।), period, exclamations, question marks, or newlines
  const rawSentences = text.split(/(?<=[۔।.!?\n])\s+/);
  
  return rawSentences
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

/**
 * Provider-agnostic VoiceReaderEngine wrapping the browser's SpeechSynthesis API
 * with fallback voice heuristics, sentence-level chunking, and time estimation.
 */
export class VoiceReaderEngine {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private sentences: string[] = [];
  private currentSentenceIndex: number = 0;
  private currentLanguage: SupportedLanguage = 'ur';
  private currentRate: number = 1.0;
  private currentVolume: number = 1.0;
  private isPausedState: boolean = false;
  private isSpeakingState: boolean = false;
  private options: SpeakOptions = {};
  
  // Timer & progress estimation
  private startTimeMs: number = 0;
  private totalWordCount: number = 0;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  /**
   * Selects the best available voice based on language heuristics:
   * - Urdu ("ur"): "ur" -> "ar" -> "hi" -> default (with warning console.info)
   * - Arabic ("ar"): "ar-SA" -> "ar" -> default
   * - English ("en"): "en-GB" / "en-US" -> standard non-novelty -> default
   */
  private selectVoice(lang: SupportedLanguage): SpeechSynthesisVoice | null {
    if (!this.synth) return null;

    const voices = this.synth.getVoices();
    if (!voices || voices.length === 0) return null;

    if (lang === 'ur') {
      const urVoice = voices.find(v => v.lang.toLowerCase().startsWith('ur'));
      if (urVoice) return urVoice;

      const arVoice = voices.find(v => v.lang.toLowerCase().startsWith('ar'));
      if (arVoice) return arVoice;

      const hiVoice = voices.find(v => v.lang.toLowerCase().includes('hi'));
      if (hiVoice) return hiVoice;

      console.info('Urdu Speech Synthesis Note: No native "ur" voice found on this device. Falling back to default system voice. Quality may vary.');
      return voices.find(v => v.default) || voices[0] || null;
    }

    if (lang === 'ar') {
      const arSaVoice = voices.find(v => v.lang.toLowerCase().startsWith('ar-sa'));
      if (arSaVoice) return arSaVoice;

      const arVoice = voices.find(v => v.lang.toLowerCase().startsWith('ar'));
      if (arVoice) return arVoice;

      return voices.find(v => v.default) || voices[0] || null;
    }

    if (lang === 'en') {
      const enGbVoice = voices.find(v => v.lang.toLowerCase().startsWith('en-gb') && !v.name.toLowerCase().includes('novelty'));
      if (enGbVoice) return enGbVoice;

      const enUsVoice = voices.find(v => v.lang.toLowerCase().startsWith('en-us') && !v.name.toLowerCase().includes('novelty'));
      if (enUsVoice) return enUsVoice;

      const enVoice = voices.find(v => v.lang.toLowerCase().startsWith('en'));
      if (enVoice) return enVoice;

      return voices.find(v => v.default) || voices[0] || null;
    }

    return voices.find(v => v.default) || voices[0] || null;
  }

  /* ========================================================================
   * TODO: CLOUD TTS PROVIDER INTEGRATION POINT
   * ------------------------------------------------------------------------
   * To plug in a high-quality Cloud TTS Provider (e.g. Google Cloud Text-to-Speech API,
   * ElevenLabs, or a custom backend REST endpoint returning an MP3/OGG audio stream),
   * replace or extend the `speakCurrentSentence()` method below.
   * 
   * Example Cloud Implementation:
   * 
   * private async speakCloudAudio(text: string, lang: string): Promise<HTMLAudioElement> {
   *   const response = await fetch('/api/tts', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({ text, languageCode: lang, audioEncoding: 'MP3' })
   *   });
   *   const blob = await response.blob();
   *   const audio = new Audio(URL.createObjectURL(blob));
   *   audio.playbackRate = this.currentRate;
   *   audio.volume = this.currentVolume;
   *   await audio.play();
   *   return audio;
   * }
   * ======================================================================== */

  /**
   * Starts speaking text using the specified language and options.
   */
  public speak(text: string, lang: SupportedLanguage, opts: SpeakOptions = {}): void {
    this.stop();

    if (!text || text.trim().length === 0) return;

    this.options = opts;
    this.currentLanguage = lang;
    this.currentRate = opts.rate ?? 1.0;
    this.currentVolume = opts.volume ?? 1.0;

    const preparedText = prepareTextForSpeech(text, lang);
    this.sentences = splitIntoSentences(preparedText);
    
    if (this.sentences.length === 0) {
      this.sentences = [preparedText];
    }

    this.currentSentenceIndex = 0;
    this.isSpeakingState = true;
    this.isPausedState = false;
    this.startTimeMs = Date.now();
    this.totalWordCount = preparedText.split(/\s+/).length;

    this.speakCurrentSentence();
  }

  /**
   * Internal sentence utterance dispatcher
   */
  private speakCurrentSentence(): void {
    if (!this.synth || this.currentSentenceIndex >= this.sentences.length) {
      this.isSpeakingState = false;
      this.isPausedState = false;
      if (this.options.onEnd) {
        this.options.onEnd();
      }
      return;
    }

    const sentence = this.sentences[this.currentSentenceIndex];
    
    if (this.options.onSentenceChange) {
      this.options.onSentenceChange(this.currentSentenceIndex);
    }

    const utterance = new SpeechSynthesisUtterance(sentence);
    this.currentUtterance = utterance;

    const chosenVoice = this.selectVoice(this.currentLanguage);
    if (chosenVoice) {
      utterance.voice = chosenVoice;
    }
    utterance.lang = this.currentLanguage === 'ur' ? 'ur-PK' : (this.currentLanguage === 'ar' ? 'ar-SA' : 'en-US');
    utterance.rate = this.currentRate;
    utterance.volume = this.currentVolume;

    utterance.onboundary = (event) => {
      if (event.name === 'word' && this.options.onWord) {
        this.options.onWord(event.charIndex, event.charLength);
      }
    };

    utterance.onend = () => {
      this.currentSentenceIndex++;
      if (this.isSpeakingState && !this.isPausedState) {
        this.speakCurrentSentence();
      }
    };

    utterance.onerror = (error) => {
      console.warn('SpeechSynthesis sentence error:', error);
      if (this.options.onError) {
        this.options.onError(error);
      }
      this.currentSentenceIndex++;
      if (this.isSpeakingState) {
        this.speakCurrentSentence();
      }
    };

    this.synth.speak(utterance);
  }

  /**
   * Pauses current speech playback
   */
  public pause(): void {
    if (this.synth && this.isSpeakingState) {
      this.synth.pause();
      this.isPausedState = true;
    }
  }

  /**
   * Resumes paused speech playback
   */
  public resume(): void {
    if (this.synth && this.isPausedState) {
      this.synth.resume();
      this.isPausedState = false;
    }
  }

  /**
   * Stops speech playback and resets state
   */
  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeakingState = false;
    this.isPausedState = false;
    this.currentUtterance = null;
    this.sentences = [];
    this.currentSentenceIndex = 0;
  }

  /**
   * Jump to a specific sentence index (enabling sentence-level seeking)
   */
  public jumpToSentence(sentenceIndex: number): void {
    if (sentenceIndex >= 0 && sentenceIndex < this.sentences.length) {
      if (this.synth) {
        this.synth.cancel();
      }
      this.currentSentenceIndex = sentenceIndex;
      this.speakCurrentSentence();
    }
  }

  /**
   * Dynamic rate modification
   */
  public setRate(rate: number): void {
    this.currentRate = Math.max(0.5, Math.min(2.0, rate));
    if (this.currentUtterance) {
      this.currentUtterance.rate = this.currentRate;
    }
  }

  /**
   * Dynamic volume modification
   */
  public setVolume(volume: number): void {
    this.currentVolume = Math.max(0, Math.min(1.0, volume));
    if (this.currentUtterance) {
      this.currentUtterance.volume = this.currentVolume;
    }
  }

  /**
   * Checks if synthesis is active or paused
   */
  public isSpeaking(): boolean {
    return this.isSpeakingState;
  }

  /**
   * Returns current sentence breakdown details
   */
  public getSentenceDetails(): { current: number; total: number; sentences: string[] } {
    return {
      current: this.currentSentenceIndex,
      total: this.sentences.length,
      sentences: this.sentences
    };
  }

  /**
   * Estimates total duration in seconds based on ~150 words per minute at rate 1.0
   */
  public getEstimatedDurationSec(): number {
    if (this.totalWordCount === 0) return 0;
    const wordsPerSec = (150 / 60) * this.currentRate;
    return Math.ceil(this.totalWordCount / wordsPerSec);
  }
}

export const defaultVoiceReaderEngine = new VoiceReaderEngine();
