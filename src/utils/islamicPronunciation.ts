/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SupportedLanguage = 'ur' | 'ar' | 'en';

export interface HonorificMapping {
  id: string;
  name: string;
  pattern: RegExp;
  replacements: Record<SupportedLanguage, string>;
}

/**
 * INTENTIONALLY EXTENSIBLE HONORIFIC MAPPING TABLE
 * ===============================================
 * This mapping table defines regex patterns for Islamic honorific symbols, unicode ligatures,
 * and parenthetical/bracketed abbreviations, mapping them into full respectful spoken-out phrases
 * in Urdu, Arabic, and English.
 * 
 * EXTENSIBILITY COMMENT:
 * ----------------------
 * This table is designed to be easily extensible. To add support for new names, titles,
 * or honorific phrases (such as specific companions' names, Ahl-e-Bait titles, or scholar designations):
 * Simply append a new `HonorificMapping` object to the `HONORIFIC_MAPPINGS` array below.
 * The `expandHonorifics()` function iterates through this list dynamically without requiring
 * any changes to the core function logic.
 */
export const HONORIFIC_MAPPINGS: HonorificMapping[] = [
  {
    id: 'prophetic_saw',
    name: 'Prophet Muhammad (ﷺ)',
    // Matches U+FDFA (ﷺ), (ص), [ص], (صلعم), (PBUH), (pbuh)
    pattern: /(?:ﷺ|\(ﷺ\)|\[ﷺ\]|\(ص\)|\(ص\-\)|\[ص\]|\(صلعم\)|\(PBUH\)|\(pbuh\))/gi,
    replacements: {
      ur: 'صلی اللہ علیہ وآلہ وسلم',
      ar: 'صلى الله عليه وآله وسلم',
      en: 'peace and blessings be upon him'
    }
  },
  {
    id: 'divine_swt',
    name: 'Allah Almighty (ﷻ)',
    // Matches U+FDFB (ﷻ), (ج), [ج], (SWT), (swt)
    pattern: /(?:ﷻ|\(ﷻ\)|\[ﷻ\]|\(ج\)|\(ج\-\)|\[ج\]|\(SWT\)|\(swt\))/gi,
    replacements: {
      ur: 'جل جلالہ وتبارک وتعالیٰ',
      ar: 'سبحانه وتعالى',
      en: 'Glorified and Exalted is He'
    }
  },
  {
    id: 'prophetic_angelic_as',
    name: 'Prophets / Angels (علیہ السلام / ؑ)',
    // Matches U+0618 (ؑ), (ع), [ع], (AS), (as), (A.S.)
    pattern: /(?:ؑ|\(ؑ\)|\[ؑ\]|\(ع\)|\(ع\-\)|\[ع\]|\(AS\)|\(as\)|\(A\.S\.\))/gi,
    replacements: {
      ur: 'علیہ السلام',
      ar: 'عليه السلام',
      en: 'peace be upon him'
    }
  },
  {
    id: 'female_holy_as',
    name: 'Female Holy Figures (عليها السلام)',
    pattern: /(?:\(علیہا\s*السلام\)|\(عليها\s*السلام\))/gi,
    replacements: {
      ur: 'علیہا السلام',
      ar: 'عليها السلام',
      en: 'peace be upon her'
    }
  },
  {
    id: 'companion_ra_male',
    name: 'Male Companion (رضی اللہ عنہ / ؓ)',
    // Matches U+061B / U+FD8E (ؓ), (رض), [رض], (RA), (ra), (R.A.)
    pattern: /(?:ؓ|\(ؓ\)|\[ؓ\]|\(رض\)|\(رض\-\)|\[رض\]|\(RA\)|\(ra\)|\(R\.A\.\))/gi,
    replacements: {
      ur: 'رضی اللہ عنہ',
      ar: 'رضي الله عنه',
      en: 'may Allah be pleased with him'
    }
  },
  {
    id: 'companion_ra_female',
    name: 'Female Companion (رضی اللہ عنہا)',
    pattern: /(?:\(رضی\s*اللہ\s*عنہا\)|\(رضي\s*الله\s*عنها\))/gi,
    replacements: {
      ur: 'رضی اللہ عنہا',
      ar: 'رضي الله عنها',
      en: 'may Allah be pleased with her'
    }
  },
  {
    id: 'companion_ra_plural',
    name: 'Plural Companions (رضی اللہ عنہم)',
    pattern: /(?:\(رضی\s*اللہ\s*عنہم\)|\(رضي\s*الله\s*عنهم\)|\(رضوان\s*اللہ\s*علیہم\s*اجمعین\))/gi,
    replacements: {
      ur: 'رضی اللہ عنہم',
      ar: 'رضي الله عنهم',
      en: 'may Allah be pleased with them'
    }
  },
  {
    id: 'saint_scholar_rh',
    name: 'Scholar / Saint (رحمۃ اللہ علیہ / ؒ)',
    // Matches U+0619 (ؒ), (رح), [رح], (RH), (rh), (R.H.)
    pattern: /(?:ؒ|\(ؒ\)|\[ؒ\]|\(رح\)|\(رح\-\)|\[رح\]|\(RH\)|\(rh\)|\(R\.H\.\))/gi,
    replacements: {
      ur: 'رحمۃ اللہ علیہ',
      ar: 'رحمة الله عليه',
      en: 'may Allah have mercy on him'
    }
  }
];

/**
 * Replaces Islamic honorific symbols and abbreviations in a text with their full,
 * respectful spoken-out phrases appropriate to the specified target language.
 *
 * Rules:
 * - Never shorten, skip, or silently drop any honorific — always expand them into
 *   a full spoken phrase.
 * - This function handles phonetic expansion for TTS delivery only.
 *
 * @param text The input text containing symbols or abbreviations (e.g. "نبی کریم ﷺ")
 * @param lang Target language for spoken expansion ("ur" | "ar" | "en")
 * @returns The expanded text suitable for speech synthesis
 */
export function expandHonorifics(text: string, lang: SupportedLanguage): string {
  if (!text || text.trim().length === 0) {
    return '';
  }

  const effectiveLang: SupportedLanguage = (lang === 'ur' || lang === 'ar' || lang === 'en') ? lang : 'ur';
  let expandedText = text;

  for (const mapping of HONORIFIC_MAPPINGS) {
    const replacement = mapping.replacements[effectiveLang] || mapping.replacements.ur;
    expandedText = expandedText.replace(mapping.pattern, ` ${replacement} `);
  }

  // Clean up any extra spaces introduced during replacement
  return expandedText.replace(/\s+/g, ' ').trim();
}
