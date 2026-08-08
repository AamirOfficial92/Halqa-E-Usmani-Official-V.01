/**
 * Islamic TTS Text Pre-Processor & Phonetic Mapper
 * ------------------------------------------------
 * Identifies Islamic honorifics (ﷺ, علیہ السلام, رضی اللہ عنہ, etc.) and sacred names,
 * mapping them to respectful vocalized phrases, phonetic cues, and SSML pause markers
 * to ensure dignified, reverent, and accurate pronunciation across Urdu, Arabic, and English.
 */

export type SupportedLanguage = 'ur' | 'ar' | 'en';

export interface HonorificRule {
  id: string;
  name: string;
  pattern: RegExp;
  replacements: {
    ur: string;
    ar: string;
    en: string;
  };
  phoneticCue: {
    ur: string;
    ar: string;
    en: string;
  };
  audioSnippetKey: string;
  ssmlPauseBeforeMs: number;
  ssmlPauseAfterMs: number;
}

export interface TextToken {
  type: 'text' | 'honorific' | 'sacred_name';
  content: string;
  spokenText: string;
  originalMatch?: string;
  honorificId?: string;
  audioSnippetKey?: string;
  language: SupportedLanguage;
}

// Comprehensive registry of Islamic honorifics and sacred symbols
export const ISLAMIC_HONORIFIC_RULES: HonorificRule[] = [
  {
    id: 'sallallahu_alayhi_wa_sallam',
    name: 'Prophetic Honorific (SAW)',
    // Matches U+FDFA (ﷺ), variations of (صلی اللہ علیہ وسلم), (صلی اللہ علیہ وآلہ وسلم), (صلى الله عليه وسلم)
    pattern: /(?:ﷺ|\(ﷺ\)|\[ﷺ\]|صَلَّى\s*اللّٰهُ\s*عَلَيْهِ\s*وَآلِهِ\s*وَسَلَّم|صلى\s*الله\s*عليه\s*وسلم|صلی\s*اللہ\s*علیہ\s*وسلم|صلی\s*اللہ\s*علیہ\s*وآلہ\s*وسلم|صلی\s*اللہ\s*علیہ\s*والہ\s*وسلم|صلى\s*الله\s*عليه\s*وآله\s*وسلم|\(ص\)|\[ص\])/gi,
    replacements: {
      ur: 'صلی اللہ علیہ والہ وسلم',
      ar: 'صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ وَسَلَّم',
      en: 'Sallallahu Alayhi Wa Alihi Wa Sallam'
    },
    phoneticCue: {
      ur: 'صَلَّی اللّٰہُ عَلَیْہِ وَآلِہٖ وَسَلَّمْ',
      ar: 'صَلَّى اللّٰهُ عَلَيْهِ وَآلِهِ وَسَلَّمَ',
      en: 'Sal-lal-laa-hu A-lai-hi Wa Aaa-li-hi Wa Sal-lam'
    },
    audioSnippetKey: 'audio_saw',
    ssmlPauseBeforeMs: 150,
    ssmlPauseAfterMs: 200
  },
  {
    id: 'alayhis_salam',
    name: 'Prophetic/Angelic Honorific (AS)',
    // Matches U+0618 (ؑ), (علیہ السلام), (علیہا السلام), (علیہم السلام), (عليهم السلام)
    pattern: /(?:ؑ|\(ؑ\)|\[ؑ\]|عَلَيْهِ\s*السَّلَام|علیہ\s*السلام|عـلیہ\s*السلام|عليهم\s*السلام|علیہم\s*السلام|\(ع\)|\[ع\])/gi,
    replacements: {
      ur: 'علیہ السلام',
      ar: 'عَلَيْهِ السَّلَام',
      en: 'Alayhis Salam'
    },
    phoneticCue: {
      ur: 'عَلَیْہِ السَّلَامْ',
      ar: 'عَلَيْهِ السَّلَامُ',
      en: 'A-lai-his Sa-laam'
    },
    audioSnippetKey: 'audio_as',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'alayhas_salam',
    name: 'Female Holy Honorific (AS)',
    pattern: /(?:علیہا\s*السلام|عليها\s*السلام)/gi,
    replacements: {
      ur: 'علیہا السلام',
      ar: 'عَلَيْهَا السَّلَام',
      en: 'Alayhas Salam'
    },
    phoneticCue: {
      ur: 'عَلَیْہَا السَّلَامْ',
      ar: 'عَلَيْهَا السَّلَامُ',
      en: 'A-lai-has Sa-laam'
    },
    audioSnippetKey: 'audio_as_female',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'radiyallahu_anhu',
    name: 'Companion Honorific Male (RA)',
    // Matches U+061B / U+FD8E (ؓ), (رضی اللہ عنہ), (رضي الله عنه)
    pattern: /(?:ؓ|\(ؓ\)|\[ؓ\]|رَضِیَ\s*اللّٰهُ\s*عَنْهُ|رضی\s*اللہ\s*عنہ|رضي\s*الله\s*عنه|\(ر⁠ض\)|\[رض\])/gi,
    replacements: {
      ur: 'رضی اللہ عنہ',
      ar: 'رَضِیَ اللّٰهُ عَنْهُ',
      en: 'Radi Allahu Anhu'
    },
    phoneticCue: {
      ur: 'رَضِیَ اللّٰہُ عَنْہُ',
      ar: 'رَضِيَ اللّٰهُ عَنْهُ',
      en: 'Ra-di-yal-laa-hu An-hu'
    },
    audioSnippetKey: 'audio_ra_male',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'radiyallahu_anha',
    name: 'Companion Honorific Female (RA)',
    pattern: /(?:رضی\s*اللہ\s*عنہا|رضي\s*الله\s*عنها)/gi,
    replacements: {
      ur: 'رضی اللہ عنہا',
      ar: 'رَضِیَ اللّٰهُ عَنْهَا',
      en: 'Radi Allahu Anha'
    },
    phoneticCue: {
      ur: 'رَضِیَ اللّٰہُ عَنْہَا',
      ar: 'رَضِيَ اللّٰهُ عَنْهَا',
      en: 'Ra-di-yal-laa-hu An-ha'
    },
    audioSnippetKey: 'audio_ra_female',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'radiyallahu_anhum',
    name: 'Companions Plural Honorific (RA)',
    pattern: /(?:رضی\s*اللہ\s*عنہم|رضي\s*الله\s*عنهم|رضوان\s*اللہ\s*علیہم\s*اجمعین)/gi,
    replacements: {
      ur: 'رضی اللہ عنہم',
      ar: 'رَضِیَ اللّٰهُ عَنْهُمْ',
      en: 'Radi Allahu Anhum'
    },
    phoneticCue: {
      ur: 'رَضِیَ اللّٰہُ عَنْہُمْ',
      ar: 'رَضِيَ اللّٰهُ عَنْهُمْ',
      en: 'Ra-di-yal-laa-hu An-hum'
    },
    audioSnippetKey: 'audio_ra_plural',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'rahmatullah_alayh',
    name: 'Saint / Scholar Honorific (RH)',
    // Matches U+0619 (ؒ), (رحمۃ اللہ علیہ), (رحمه الله)
    pattern: /(?:ؒ|\(ؒ\)|\[ؒ\]|رَحْمَةُ\s*اللّٰهِ\s*عَلَيْهِ|رحمۃ\s*اللہ\s*علیہ|رحمہ\s*اللہ|رحمة\s*الله\s*عليه|\(رح\)|\[رح\])/gi,
    replacements: {
      ur: 'رحمۃ اللہ علیہ',
      ar: 'رَحْمَةُ اللّٰهِ عَلَيْهِ',
      en: 'Rahmatullah Alayh'
    },
    phoneticCue: {
      ur: 'رَحْمَةُ اللّٰہِ عَلَیْہِ',
      ar: 'رَحْمَةُ اللّٰهِ عَلَيْهِ',
      en: 'Rah-ma-tul-laa-hi A-laih'
    },
    audioSnippetKey: 'audio_rh',
    ssmlPauseBeforeMs: 100,
    ssmlPauseAfterMs: 150
  },
  {
    id: 'jalla_jalaluh',
    name: 'Divine Honorific Almighty (SWT)',
    // Matches U+FDFB (ﷻ), (جل جلالہ), (عزوجل)
    pattern: /(?:ﷻ|\(ﷻ\)|\[ﷻ\]|جَلَّ\s*جَلَالُهُ|جل\s*جلالہ|عزوجل|عَزَّ\s*وَجَلَّ|سبحانہ\s*وتعالیٰ|سبحانہ\s*و\s*تعالی|تبارک\s*وتعالیٰ)/gi,
    replacements: {
      ur: 'جل جلالہ وتبارک وتعالیٰ',
      ar: 'جَلَّ جَلَالُهُ وَتَبَارَكَ وَتَعَالَىٰ',
      en: 'Subhanahu Wa Ta\'ala Jalla Jalaluh'
    },
    phoneticCue: {
      ur: 'جَلَّ جَلَالُہٗ وَ تَبَارَکَ وَ تَعَالٰی',
      ar: 'جَلَّ جَلَالُهُ وَتَبَارَكَ وَتَعَالَىٰ',
      en: 'Jal-la Ja-laa-lu-hu Wa Ta-baa-ra-ka Wa Ta-aa-laa'
    },
    audioSnippetKey: 'audio_swt',
    ssmlPauseBeforeMs: 150,
    ssmlPauseAfterMs: 200
  }
];

// Sacred Name Expressions for soft pauses & dignified stress
const SACRED_NAMES_PATTERN = /(?:اللہ\s*تعالیٰ|اللہ\s*پاک|اللہ\s*رب\s*العزت|حضرت\s*محمد|رسول\s*اللہ|نبی\s*کریم|خاتم\s*النبیین|صحابة\s*کرام|اہلِ\s*بیت|امہاؔت\s*المؤمنین|غوث\s*اعظم|امام\s*عالی\s*مقام)/gi;

/**
 * Automatically detects the primary language of the input string
 */
export function detectLanguage(text: string): SupportedLanguage {
  if (!text || text.trim().length === 0) return 'ur';

  const cleaned = text.replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+/g, '');

  // Check for Urdu specific characters: ٹ ڈ ڑ ں ے ھ پ چ ژ گ
  const urduCharCount = (cleaned.match(/[ٹڈڑںےھپچژگ۔ۧہر‎]/g) || []).length;

  // Check for Arabic specific characters / diacritics: ً  ٌ  ٍ  َ  ُ  ِ  ّ  ْ  ٰ  أ إ ؤ ئ ة ى
  const arabicDiacriticCount = (cleaned.match(/[\u064B-\u0652\u0670\u0622\u0623\u0624\u0625\u0626\u0629\u0649]/g) || []).length;

  // Count Latin characters
  const latinCharCount = (cleaned.match(/[a-zA-Z]/g) || []).length;
  const totalLetters = (cleaned.match(/[\p{L}]/gu) || []).length || 1;

  if (latinCharCount / totalLetters > 0.4) {
    return 'en';
  }

  if (arabicDiacriticCount > 10 || (arabicDiacriticCount > 3 && urduCharCount === 0)) {
    return 'ar';
  }

  // Default to Urdu for South Asian Islamic posts
  return 'ur';
}

/**
 * Pre-processes input text by stripping unwanted formatting, HTML tags,
 * and normalizing Islamic honorific symbols to full vocalized phrases.
 */
export function preprocessText(
  rawText: string,
  forcedLanguage?: SupportedLanguage
): {
  processedText: string;
  detectedLanguage: SupportedLanguage;
  honorificsFoundCount: number;
} {
  if (!rawText) {
    return { processedText: '', detectedLanguage: 'ur', honorificsFoundCount: 0 };
  }

  const detectedLanguage = forcedLanguage || detectLanguage(rawText);

  // 1. Clean HTML, markdown formatting, emojis, extra whitespace
  let text = rawText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '') // strip HTML
    .replace(/[*_~`#>-]/g, ' ') // strip markdown
    .replace(/\s+/g, ' ')
    .trim();

  let honorificsCount = 0;

  // 2. Replace honorific symbols & abbreviations with full vocalized phrases
  for (const rule of ISLAMIC_HONORIFIC_RULES) {
    const matches = text.match(rule.pattern);
    if (matches && matches.length > 0) {
      honorificsCount += matches.length;
      const replacement = rule.replacements[detectedLanguage] || rule.replacements.ur;
      // Add slight punctuation framing for natural pause during speech synthesis
      text = text.replace(rule.pattern, ` ${replacement} `);
    }
  }

  // 3. Clean up multiple spaces created during replacement
  text = text.replace(/\s+/g, ' ').trim();

  return {
    processedText: text,
    detectedLanguage,
    honorificsFoundCount: honorificsCount
  };
}

/**
 * Tokenizes text into sequential chunks (text vs honorific vs sacred names),
 * allowing playback engines to alternate between synthesized TTS and
 * pre-recorded audio snippets or SSML audio clips.
 */
export function tokenizeWithHonorifics(
  rawText: string,
  forcedLanguage?: SupportedLanguage
): TextToken[] {
  const detectedLanguage = forcedLanguage || detectLanguage(rawText);

  // First replace HTML tags
  const clean = rawText
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();

  const tokens: TextToken[] = [];
  let remainingText = clean;

  // Build a combined regular expression for all honorifics
  const combinedPattern = new RegExp(
    ISLAMIC_HONORIFIC_RULES.map(r => r.pattern.source).join('|'),
    'gi'
  );

  let match: RegExpExecArray | null;
  let lastIndex = 0;

  while ((match = combinedPattern.exec(clean)) !== null) {
    const matchStart = match.index;
    const matchedStr = match[0];

    // Push preceding normal text if present
    if (matchStart > lastIndex) {
      const textChunk = clean.substring(lastIndex, matchStart).trim();
      if (textChunk) {
        tokens.push({
          type: 'text',
          content: textChunk,
          spokenText: textChunk,
          language: detectedLanguage
        });
      }
    }

    // Identify which rule matched
    const matchedRule = ISLAMIC_HONORIFIC_RULES.find(rule => {
      const singleReg = new RegExp(`^${rule.pattern.source}$`, 'i');
      return singleReg.test(matchedStr);
    }) || ISLAMIC_HONORIFIC_RULES[0]; // fallback

    const replacementStr = matchedRule.replacements[detectedLanguage] || matchedRule.replacements.ur;
    const phoneticStr = matchedRule.phoneticCue[detectedLanguage] || matchedRule.phoneticCue.ur;

    tokens.push({
      type: 'honorific',
      content: matchedStr,
      spokenText: replacementStr,
      originalMatch: matchedStr,
      honorificId: matchedRule.id,
      audioSnippetKey: matchedRule.audioSnippetKey,
      language: detectedLanguage
    });

    lastIndex = combinedPattern.lastIndex;
  }

  // Push remaining trailing text
  if (lastIndex < clean.length) {
    const trailingChunk = clean.substring(lastIndex).trim();
    if (trailingChunk) {
      tokens.push({
        type: 'text',
        content: trailingChunk,
        spokenText: trailingChunk,
        language: detectedLanguage
      });
    }
  }

  return tokens.length > 0
    ? tokens
    : [{ type: 'text', content: clean, spokenText: clean, language: detectedLanguage }];
}

/**
 * Generates W3C SSML (Speech Synthesis Markup Language) string with proper pauses,
 * prosody, and phonetic pronunciations for high-grade TTS engines (e.g., Google Cloud TTS / ElevenLabs).
 */
export function generateSsml(
  rawText: string,
  forcedLanguage?: SupportedLanguage,
  rate = '1.0'
): string {
  const tokens = tokenizeWithHonorifics(rawText, forcedLanguage);
  const lang = forcedLanguage || detectLanguage(rawText);

  let xmlLang = 'ur-PK';
  if (lang === 'ar') xmlLang = 'ar-SA';
  if (lang === 'en') xmlLang = 'en-US';

  let ssmlBody = '';

  for (const token of tokens) {
    if (token.type === 'honorific' && token.honorificId) {
      const rule = ISLAMIC_HONORIFIC_RULES.find(r => r.id === token.honorificId);
      const pauseBefore = rule?.ssmlPauseBeforeMs || 100;
      const pauseAfter = rule?.ssmlPauseAfterMs || 150;

      ssmlBody += `<break time="${pauseBefore}ms"/>`;
      ssmlBody += `<prosody pitch="-2%" rate="95%">${token.spokenText}</prosody>`;
      ssmlBody += `<break time="${pauseAfter}ms"/>`;
    } else {
      // Highlight sacred names with slight pause
      let textContent = token.spokenText;
      textContent = textContent.replace(
        SACRED_NAMES_PATTERN,
        `<break time="100ms"/><prosody volume="loud">$&</prosody><break time="100ms"/>`
      );
      ssmlBody += textContent + ' ';
    }
  }

  return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${xmlLang}">
  <prosody rate="${rate}">
    ${ssmlBody}
  </prosody>
</speak>`;
}
