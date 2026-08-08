/**
 * Abjad Calculation & Spiritual Assessment Utilities for Halqa-e-Usmania
 */

import { DayOfWeek, ModSettings } from '../types';

// Standard Abjad-i-Kabir letter mapping
export const ABJAD_MAP: Record<string, number> = {
  // Alif
  'ا': 1, 'أ': 1, 'إ': 1, 'آ': 1, 'ء': 1,
  // Baa / Paa
  'ب': 2, 'پ': 2,
  // Jeem / Chay
  'ج': 3, 'چ': 3,
  // Daal / Ddaal
  'د': 4, 'ڈ': 4,
  // Haa / Choti Hee / Do Chashmi Hee
  'ه': 5, 'ہ': 5, 'ھ': 5, 'ۃ': 5,
  // Waw
  'و': 6, 'ؤ': 6,
  // Zay / Zhey
  'ز': 7, 'ژ': 7,
  // Haa (ح)
  'ح': 8,
  // Taa (ط)
  'ط': 9,
  // Yaa / Bari Yaa
  'ی': 10, 'ئ': 10, 'ے': 10, 'ي': 10,
  // Kaaf / Gaaf
  'ک': 20, 'ك': 20, 'گ': 20,
  // Laam
  'ل': 30,
  // Meem
  'م': 40,
  // Noon / Noon Ghunna
  'ن': 50, 'ں': 50,
  // Seen
  'س': 60,
  // Ain
  'ع': 70,
  // Faa
  'ف': 80,
  // Saad
  'ص': 90,
  // Qaaf
  'ق': 100,
  // Raa / Rraa
  'ر': 200, 'ڑ': 200,
  // Sheen
  'ش': 300,
  // Taa (ت) / Ttaa (ٹ)
  'ت': 400, 'ٹ': 400,
  // Thaa (ث)
  'ث': 500,
  // Khaa (خ)
  'خ': 600,
  // Dhaal (ذ)
  'ذ': 700,
  // Dhad (ض)
  'ض': 800,
  // Zhaa (ظ)
  'ظ': 900,
  // Ghain (غ)
  'غ': 1000
};

export interface AbjadBreakdownItem {
  char: string;
  val: number;
}

export interface AbjadResult {
  total: number;
  breakdown: AbjadBreakdownItem[];
  cleanText: string;
}

/**
 * Calculates Abjad value for a given name/text
 */
export function calculateAbjad(text: string): AbjadResult {
  if (!text) return { total: 0, breakdown: [], cleanText: '' };

  const breakdown: AbjadBreakdownItem[] = [];
  let total = 0;
  let cleanText = '';

  for (const char of text) {
    const val = ABJAD_MAP[char];
    if (val !== undefined) {
      breakdown.push({ char, val });
      total += val;
      cleanText += char;
    }
  }

  return { total, breakdown, cleanText };
}

/**
 * Applies organization Mod Formula if enabled
 */
export function calculateFinalAdad(
  totalAdad: number,
  modSettings: ModSettings
): { finalAdad: number; formulaDescription: string } {
  if (!modSettings.enabled || totalAdad <= 0) {
    return {
      finalAdad: totalAdad,
      formulaDescription: 'مستقیم عدد (Direct Total Adad)'
    };
  }

  const divisor = modSettings.divisor || 7;
  const rem = totalAdad % divisor;
  
  let finalAdad = rem;
  if (modSettings.mode === 'exact_or_mod' && rem === 0) {
    finalAdad = divisor;
  } else if (rem === 0) {
    finalAdad = divisor; // default to divisor if remainder is 0 in spiritual calculations
  }

  return {
    finalAdad,
    formulaDescription: `کل اعداد (${totalAdad}) کا موڈ فارمولا [تقسیم بحساب ${divisor}] = ${finalAdad}`
  };
}

/**
 * Confirmed Per-Weekday Adad Table for Halqa-e-Usmania:
 * Saturday (Hafta) = 357
 * Sunday (Itwar) = 387
 * Monday (Peer) = 367
 * Tuesday (Mangal) = 422
 * Wednesday (Budh) = 566
 * Thursday (Jumeraat) = 412
 * Friday (Jumma) = 118
 */
export const WEEKDAY_ADAD: Record<DayOfWeek, { adad: number; ur: string; en: string }> = {
  saturday:  { adad: 357, ur: 'ہفتہ (Hafta)', en: 'Saturday' },
  sunday:    { adad: 387, ur: 'اتوار (Itwar)', en: 'Sunday' },
  monday:    { adad: 367, ur: 'پیر (Peer)', en: 'Monday' },
  tuesday:   { adad: 422, ur: 'منگل (Mangal)', en: 'Tuesday' },
  wednesday: { adad: 566, ur: 'بدھ (Budh)', en: 'Wednesday' },
  thursday:  { adad: 412, ur: 'جمعرات (Jumeraat)', en: 'Thursday' },
  friday:    { adad: 118, ur: 'جمعہ (Jumma)', en: 'Friday' }
};

export interface SpiritualCalculationResult {
  nameAdad: number;
  motherAdad: number;
  dayAdad: number;
  totalAdad: number;
  marzAdad: number; // Total Adad mod 4 (range 0..3)
  sadqaAdad: number; // Total Adad mod 7 (range 0..6)
  mizajObj: { en: string; ur: string };
}

/**
 * Spiritual Calculation formula:
 * Name is required; Mother's name is optional (treated as 0 if blank).
 * Total Adad = NameAdad + MotherNameAdad + DayAdad
 * Marz Adad = Total Adad mod 4 (range 0..3) - for Tashkhees
 * Sadqa Adad = Total Adad mod 7 (range 0..6) - for Sadqa & Mashwara
 */
export function calculateSpiritualAdad(
  userName: string,
  motherName: string,
  day: DayOfWeek
): SpiritualCalculationResult {
  const nameRes = calculateAbjad(userName);
  const motherRes = motherName.trim() ? calculateAbjad(motherName) : { total: 0 };
  
  const dayInfo = WEEKDAY_ADAD[day] || WEEKDAY_ADAD.monday;
  const dayAdad = dayInfo.adad;

  const totalAdad = nameRes.total + motherRes.total + dayAdad;
  
  // Marz Adad = Total Adad mod 4 (range 0..3)
  const marzAdad = totalAdad % 4;
  
  // Sadqa Adad = Total Adad mod 7 (range 0..6)
  const sadqaAdad = totalAdad % 7;

  const mizajObj = getMizajByAdad(totalAdad);

  return {
    nameAdad: nameRes.total,
    motherAdad: motherRes.total,
    dayAdad,
    totalAdad,
    marzAdad,
    sadqaAdad,
    mizajObj
  };
}

/**
 * Returns current day of week in lowercase
 */
export function getCurrentDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const dayIndex = new Date().getDay();
  return days[dayIndex];
}

/**
 * English & Urdu labels for days
 */
export const DAY_NAMES: Record<DayOfWeek, { en: string; ur: string }> = {
  monday: { en: 'Monday', ur: 'پیر (Monday)' },
  tuesday: { en: 'Tuesday', ur: 'منگل (Tuesday)' },
  wednesday: { en: 'Wednesday', ur: 'بدھ (Wednesday)' },
  thursday: { en: 'Thursday', ur: 'جمعرات (Thursday)' },
  friday: { en: 'Friday', ur: 'جمعہ (Friday)' },
  saturday: { en: 'Saturday', ur: 'ہفتہ (Saturday)' },
  sunday: { en: 'Sunday', ur: 'اتوار (Sunday)' }
};

/**
 * Derives Mizaj (Element / Nature) from total or final Adad
 */
export function getMizajByAdad(adad: number): { en: string; ur: string } {
  const rem = adad % 4;
  if (rem === 1) return { en: 'Fire (Aatashi)', ur: 'آتشین (عنصرِ آگ)' };
  if (rem === 2) return { en: 'Air (Baadi)', ur: 'بادی (عنصرِ ہوا)' };
  if (rem === 3) return { en: 'Water (Aabi)', ur: 'آبی (عنصرِ پانی)' };
  return { en: 'Earth (Khaaki)', ur: 'خاکی (عنصرِ مٹی)' };
}
