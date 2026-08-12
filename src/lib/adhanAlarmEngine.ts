/**
 * Islamic Adhan Audio Alarm & Local Notification Engine
 * Handles precise prayer time monitoring, Adhan audio playback,
 * Web Audio API offline Adhan synthesis, and active alarm triggers.
 */

export interface AdhanVoiceOption {
  id: string;
  nameEn: string;
  nameUrdu: string;
  url: string;
}

export const ADHAN_VOICES: AdhanVoiceOption[] = [
  {
    id: 'makkah',
    nameEn: 'Makkah Mukarramah Adhan (اذان مکہ مکرمہ)',
    nameUrdu: 'اذان مکہ مکرمہ (حرم مکی)',
    url: 'https://cdn.islamicfinder.org/adhan/makkah.mp3'
  },
  {
    id: 'madinah',
    nameEn: 'Madinah Munawwarah Adhan (اذان مدینہ منورہ)',
    nameUrdu: 'اذان مدینہ منورہ (مسجد نبوی)',
    url: 'https://cdn.islamicfinder.org/adhan/madinah.mp3'
  },
  {
    id: 'egypt',
    nameEn: 'Traditional Soft Takbeer (تکبیرات و اذان)',
    nameUrdu: 'روایتی اذان و تکبیرات',
    url: 'https://cdn.islamicfinder.org/adhan/egypt.mp3'
  },
  {
    id: 'synth',
    nameEn: 'Web Audio Offline Harmonic Chime (آف لائن سنتھیسس)',
    nameUrdu: 'آف لائن سنتھیسس ٹون (ویب آڈیو)',
    url: 'synth'
  }
];

export interface PrayerAdhanConfig {
  prayerName: 'Fajr' | 'Dhuhr' | 'Asr' | 'Maghrib' | 'Isha';
  prayerNameUrdu: string;
  voiceId: string; // 'makkah' | 'madinah' | 'egypt' | 'synth' | 'custom'
  customAudioUrl?: string; // base64 or custom audio URL uploaded by admin
  customAudioName?: string;
  volume: number; // 0.1 to 1.0
  enabled: boolean;
  updatedAt?: string;
}

export const DEFAULT_PRAYER_SCHEDULES: Record<string, PrayerAdhanConfig> = {
  Fajr: { prayerName: 'Fajr', prayerNameUrdu: 'فجر', voiceId: 'makkah', volume: 1.0, enabled: true },
  Dhuhr: { prayerName: 'Dhuhr', prayerNameUrdu: 'ظہر', voiceId: 'makkah', volume: 0.9, enabled: true },
  Asr: { prayerName: 'Asr', prayerNameUrdu: 'عصر', voiceId: 'madinah', volume: 0.9, enabled: true },
  Maghrib: { prayerName: 'Maghrib', prayerNameUrdu: 'مغرب', voiceId: 'egypt', volume: 1.0, enabled: true },
  Isha: { prayerName: 'Isha', prayerNameUrdu: 'عشاء', voiceId: 'makkah', volume: 0.9, enabled: true },
};

export interface TriggeredAlarm {
  prayerName: string;
  prayerNameUrdu: string;
  timeStr: string;
  cityName: string;
  timestamp: number;
}

class AdhanAlarmEngine {
  private activeAudio: HTMLAudioElement | null = null;
  private activeSynthCtx: AudioContext | null = null;
  private lastTriggeredKey: string | null = null;
  private listeners: Array<(alarm: TriggeredAlarm | null) => void> = [];
  private currentAlarm: TriggeredAlarm | null = null;

  private selectedVoiceId: string = 'makkah';
  private soundEnabled: boolean = true;

  private prayerConfigs: Record<string, PrayerAdhanConfig> = { ...DEFAULT_PRAYER_SCHEDULES };

  constructor() {
    if (typeof window !== 'undefined') {
      const savedVoice = localStorage.getItem('halqa_adhan_voice');
      if (savedVoice) this.selectedVoiceId = savedVoice;

      const savedSound = localStorage.getItem('halqa_adhan_sound_enabled');
      if (savedSound !== null) this.soundEnabled = savedSound === 'true';

      const savedConfigs = localStorage.getItem('halqa_adhan_prayer_schedules');
      if (savedConfigs) {
        try {
          this.prayerConfigs = JSON.parse(savedConfigs);
        } catch (e) {}
      }
    }
  }

  public getPrayerConfigs(): Record<string, PrayerAdhanConfig> {
    return { ...this.prayerConfigs };
  }

  public savePrayerConfig(prayerName: string, config: PrayerAdhanConfig) {
    this.prayerConfigs[prayerName] = { ...config, updatedAt: new Date().toISOString() };
    if (typeof window !== 'undefined') {
      localStorage.setItem('halqa_adhan_prayer_schedules', JSON.stringify(this.prayerConfigs));
    }
  }

  public saveAllPrayerConfigs(configs: Record<string, PrayerAdhanConfig>) {
    this.prayerConfigs = { ...configs };
    if (typeof window !== 'undefined') {
      localStorage.setItem('halqa_adhan_prayer_schedules', JSON.stringify(this.prayerConfigs));
    }
  }

  public setVoice(voiceId: string) {
    this.selectedVoiceId = voiceId;
    if (typeof window !== 'undefined') {
      localStorage.setItem('halqa_adhan_voice', voiceId);
    }
  }

  public getVoice(): string {
    return this.selectedVoiceId;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('halqa_adhan_sound_enabled', String(enabled));
    }
  }

  public isSoundEnabled(): boolean {
    return this.soundEnabled;
  }

  public subscribe(fn: (alarm: TriggeredAlarm | null) => void) {
    this.listeners.push(fn);
    fn(this.currentAlarm);
    return () => {
      this.listeners = this.listeners.filter(l => l !== fn);
    };
  }

  private notify() {
    this.listeners.forEach(fn => fn(this.currentAlarm));
  }

  /**
   * Play Adhan audio or synthesize Web Audio chime offline
   */
  public async playAdhanSound(voiceId: string = this.selectedVoiceId, customAudioUrl?: string, volumeLevel: number = 0.95) {
    this.stopAdhanSound();

    if (!this.soundEnabled) return;

    // Direct custom audio URL
    if (customAudioUrl) {
      try {
        const audio = new Audio(customAudioUrl);
        audio.volume = Math.max(0.1, Math.min(1.0, volumeLevel));
        this.activeAudio = audio;

        audio.addEventListener('error', () => {
          console.warn('Custom Adhan audio URL failed to load, falling back to Web Audio Synthesis');
          this.playSynthesizedAdhan();
        });

        await audio.play();
        return;
      } catch (err) {
        console.warn('Failed playing custom Adhan audio, falling back to Web Audio Synthesizer', err);
        this.playSynthesizedAdhan();
        return;
      }
    }

    const selectedOption = ADHAN_VOICES.find(v => v.id === voiceId) || ADHAN_VOICES[0];

    // Web Audio Synthesis fallback
    if (selectedOption.url === 'synth') {
      this.playSynthesizedAdhan();
      return;
    }

    try {
      const audio = new Audio(selectedOption.url);
      audio.volume = Math.max(0.1, Math.min(1.0, volumeLevel));
      this.activeAudio = audio;

      audio.addEventListener('error', () => {
        console.warn('Adhan audio URL failed to load, falling back to Web Audio Synthesis');
        this.playSynthesizedAdhan();
      });

      await audio.play();
    } catch (err) {
      console.warn('Failed playing HTML5 Adhan audio, using Web Audio Synthesizer fallback', err);
      this.playSynthesizedAdhan();
    }
  }

  /**
   * Multi-harmonic Islamic Takbeer Synthesizer using Web Audio API
   */
  public playSynthesizedAdhan() {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      this.activeSynthCtx = ctx;

      const now = ctx.currentTime;

      // Harmonic frequencies for Islamic Takbeer melody (F3, A3, C4, F4)
      const notes = [
        { freq: 174.61, start: 0.0, duration: 1.2 }, // F3 - Allah
        { freq: 220.00, start: 0.8, duration: 1.2 }, // A3 - u - Ak
        { freq: 261.63, start: 1.6, duration: 2.2 }, // C4 - bar
        { freq: 349.23, start: 3.0, duration: 2.5 }, // F4 - Allahu Akbar
      ];

      notes.forEach(({ freq, start, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + start);

        // Warm sine + harmonic warmth
        gain.gain.setValueAtTime(0.001, now + start);
        gain.gain.exponentialRampToValueAtTime(0.25, now + start + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + duration);
      });

      // Repeat second verse
      setTimeout(() => {
        if (this.activeSynthCtx) {
          notes.forEach(({ freq, start, duration }) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const offset = 5.8;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime + start + offset);

            gain.gain.setValueAtTime(0.001, ctx.currentTime + start + offset);
            gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + start + offset + 0.2);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + offset + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(ctx.currentTime + start + offset);
            osc.stop(ctx.currentTime + start + offset + duration);
          });
        }
      }, 5500);

    } catch (e) {
      console.warn('Web Audio synthesis error:', e);
    }
  }

  /**
   * Stop active Adhan sound
   */
  public stopAdhanSound() {
    if (this.activeAudio) {
      try {
        this.activeAudio.pause();
        this.activeAudio.currentTime = 0;
      } catch (e) {}
      this.activeAudio = null;
    }

    if (this.activeSynthCtx) {
      try {
        this.activeSynthCtx.close();
      } catch (e) {}
      this.activeSynthCtx = null;
    }
  }

  /**
   * Trigger explicit alarm modal & sound
   */
  public triggerAlarm(
    prayerName: string,
    prayerNameUrdu: string,
    timeStr: string,
    cityName: string
  ) {
    const alarm: TriggeredAlarm = {
      prayerName,
      prayerNameUrdu,
      timeStr,
      cityName,
      timestamp: Date.now()
    };

    // Check per-prayer custom schedule configuration
    const pConfig = this.prayerConfigs[prayerName];
    if (pConfig && !pConfig.enabled) {
      console.log(`Adhan alarm for ${prayerName} is disabled in schedule settings.`);
      return;
    }

    this.currentAlarm = alarm;
    this.notify();

    // Play Scheduled Adhan Sound for this specific prayer
    if (pConfig) {
      this.playAdhanSound(pConfig.voiceId, pConfig.customAudioUrl, pConfig.volume);
    } else {
      this.playAdhanSound();
    }

    // Vibrate device if supported
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate([400, 200, 400, 200, 800]);
    }

    // Trigger System Web Notification if permitted
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`الله أكبر! نمازِ ${prayerNameUrdu} کا وقت ہو گیا ہے`, {
          body: `مقام: ${cityName} | وقت: ${timeStr} — مساجد میں نمازِ باجماعت کا اہتمام فرمائیں۔`,
          icon: '/app-logo.jpg',
          tag: 'prayer-adhan-alarm'
        });
      } catch (e) {}
    }
  }

  /**
   * Dismiss/Clear active alarm
   */
  public dismissAlarm() {
    this.stopAdhanSound();
    this.currentAlarm = null;
    this.notify();
  }

  /**
   * Snooze alarm for 5 minutes
   */
  public snoozeAlarm() {
    this.stopAdhanSound();
    const existing = this.currentAlarm;
    this.currentAlarm = null;
    this.notify();

    if (existing) {
      setTimeout(() => {
        this.triggerAlarm(existing.prayerName, existing.prayerNameUrdu, existing.timeStr, existing.cityName);
      }, 5 * 60 * 1000);
    }
  }

  /**
   * Check prayer times against system time
   */
  public checkAndTrigger(
    timings: Record<string, string>,
    alerts: Record<string, boolean>,
    cityName: string
  ) {
    if (!timings) return;

    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const mins = now.getMinutes().toString().padStart(2, '0');
    const currentHHMM = `${hours}:${mins}`;
    const dateStr = now.toISOString().split('T')[0];

    const PRAYER_MAP_URDU: Record<string, string> = {
      Fajr: 'فجر',
      Dhuhr: 'ظہر',
      Asr: 'عصر',
      Maghrib: 'مغرب',
      Isha: 'عشاء'
    };

    for (const [pName, pUrdu] of Object.entries(PRAYER_MAP_URDU)) {
      if (!alerts[pName]) continue;

      const prayerTime = timings[pName];
      if (!prayerTime) continue;

      const cleanTime = prayerTime.trim().split(' ')[0]; // HH:MM

      if (cleanTime === currentHHMM) {
        const triggerKey = `${dateStr}_${pName}_${cleanTime}`;

        if (this.lastTriggeredKey !== triggerKey) {
          this.lastTriggeredKey = triggerKey;
          this.triggerAlarm(pName, pUrdu, cleanTime, cityName);
          break;
        }
      }
    }
  }
}

export const adhanAlarmEngine = new AdhanAlarmEngine();
