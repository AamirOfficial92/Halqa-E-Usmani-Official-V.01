/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'ur' | 'ar' | 'en';
export type LanguageSetting = SupportedLanguage | 'auto';

/**
 * Common Islamic honorifics and Quranic / Arabic phrases stripped during language detection
 * so that common Arabic blessings in an Urdu text do not skew detection towards Arabic.
 */
const ISLAMIC_HONORIFICS_AND_PHRASES: RegExp[] = [
  /ﷺ/g,
  /صلى\s*الله\s*عليه\s*وسلم/gi,
  /رضي\s*الله\s*عنه(ا|م|ما)?/gi,
  /رحمة\s*الله\s*عليه(ا|م|ما)?/gi,
  /رحمه\s*الله/gi,
  /عليه\s*السلام/gi,
  /عليهما\s*السلام/gi,
  /عليهم\s*السلام/gi,
  /صلوات\s*الله\s*عليه/gi,
  /بِسْمِ\s*اللهِ\s*الرَّحْمٰنِ\s*الرَّحِيمِ/gi,
  /بسم\g?\s*الله\s*الرحمن\s*الرحيم/gi,
  /سبحان\s*الله/gi,
  /الحمد\s*لله/gi,
  /الله\s*اكبر/gi,
  /جزاك\s*الله\s*خيرا/gi,
  /ان\s*شاء\s*الله/gi,
  /ما\s*شاء\s*الله/gi,
  /لا\s*اله\s*الا\s*الله/gi,
  /\(ص\)/g,
  /\(ع\)/g,
  /\(رض\)/g,
  /\(رح\)/g,
  /\(ج\)/g,
  /\(ط\)/g,
  /\(ق\)/g,
  /\(صلعم\)/g,
];

/**
 * Common Urdu-only characters
 */
const URDU_SPECIFIC_CHARS = /[ںےھٹڈڑگ]/;

/**
 * Common Arabic function words
 */
const ARABIC_FUNCTION_WORDS = /\b(في|من|على|الله|رسول|أن|إلى|عن|هذا|التي|الذي|ما|كان|قال|فيها|إن|لم|لا|يكون|قد)\b/i;

/**
 * Detects the language ("ur" | "ar" | "en") of a string.
 * If `overrideLang` is set to anything other than "auto" (e.g., "ur", "ar", "en"),
 * it immediately returns that override value.
 *
 * @param text The input text string to analyze
 * @param overrideLang Optional post/manual language setting ('ur' | 'ar' | 'en' | 'auto')
 */
export function detectLanguage(text: string, overrideLang?: LanguageSetting | string): SupportedLanguage {
  // If post.language is set to anything other than "auto", always respect that value
  if (overrideLang && overrideLang !== 'auto') {
    if (overrideLang === 'ur' || overrideLang === 'ar' || overrideLang === 'en') {
      return overrideLang as SupportedLanguage;
    }
  }

  if (!text || text.trim().length === 0) {
    return 'ur'; // Default fallback
  }

  // HTML stripping if text contains HTML markup
  let strippedText = text.replace(/<[^>]*>/g, ' ');

  // Strip Islamic honorifics & Quranic phrases for the language-guessing pass only
  ISLAMIC_HONORIFICS_AND_PHRASES.forEach((pattern) => {
    strippedText = strippedText.replace(pattern, ' ');
  });

  // Count Latin characters
  const latinCharsMatch = strippedText.match(/[a-zA-Z]/g) || [];
  const latinCount = latinCharsMatch.length;

  // Count Arabic block characters (U+0600 - U+06FF)
  const arabicBlockMatch = strippedText.match(/[\u0600-\u06FF]/g) || [];
  const arabicBlockCount = arabicBlockMatch.length;

  const totalAlphaChars = latinCount + arabicBlockCount;

  // 1. If majority Latin characters -> "en"
  if (latinCount > 0 && (latinCount / (totalAlphaChars || 1) > 0.5 || totalAlphaChars === 0)) {
    return 'en';
  }

  // 2. If majority Arabic block characters
  if (arabicBlockCount > 0) {
    // Check if text contains common Urdu-only characters (ں, ے, ھ, ٹ, ڈ, ڑ, گ)
    if (URDU_SPECIFIC_CHARS.test(strippedText)) {
      return 'ur';
    }

    // Check if it matches common Arabic function words and lacks Urdu-specific characters
    if (ARABIC_FUNCTION_WORDS.test(strippedText)) {
      return 'ar';
    }

    // Default Arabic block fallback -> "ur" (since audience is primarily Urdu-speaking)
    return 'ur';
  }

  // 3. Default fallback
  return 'ur';
}

/**
 * Unit-test style example calls demonstrating correct language detection
 */
export function runLanguageDetectionExamples(): {
  urduResult: SupportedLanguage;
  arabicResult: SupportedLanguage;
  englishResult: SupportedLanguage;
  passed: boolean;
} {
  // 1. Sample Urdu text with Islamic honorifics (ﷺ) and Urdu letters (ے, ں, گ)
  const urduSample = "حضرت ابو بکر صدیق (رض) مسلمانوں کے پہلے خلیفہ تھے اور آپ نے دینِ اسلام کی عظمت کے لیے عظیم خدمات سرانجام دیں۔";
  const urduResult = detectLanguage(urduSample);

  // 2. Sample Arabic text without Urdu-only letters, with Arabic function words (في, من, على, رسول)
  const arabicSample = "إن الصلاة كانت على المؤمنين كتابا موقوتا وقال رسول الله في الحديث الشريف";
  const arabicResult = detectLanguage(arabicSample);

  // 3. Sample English text
  const englishSample = "The history of Islamic civilization is rich with knowledge, spirituality, and wisdom.";
  const englishResult = detectLanguage(englishSample);

  const passed = urduResult === 'ur' && arabicResult === 'ar' && englishResult === 'en';

  console.log('[Language Detection Unit Test Examples]:');
  console.log('Urdu Sample -> Detected:', urduResult, '(Expected: ur) ->', urduResult === 'ur' ? 'PASSED ✅' : 'FAILED ❌');
  console.log('Arabic Sample -> Detected:', arabicResult, '(Expected: ar) ->', arabicResult === 'ar' ? 'PASSED ✅' : 'FAILED ❌');
  console.log('English Sample -> Detected:', englishResult, '(Expected: en) ->', englishResult === 'en' ? 'PASSED ✅' : 'FAILED ❌');

  return { urduResult, arabicResult, englishResult, passed };
}

// Automatically execute unit test examples on module evaluation to verify
runLanguageDetectionExamples();
