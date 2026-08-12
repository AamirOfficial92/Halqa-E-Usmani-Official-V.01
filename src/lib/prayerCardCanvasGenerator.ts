/**
 * Canvas-based Prayer Card Generator Utility
 * Uses manual canvas text wrapping, dynamic height calculation, and precise
 * font fallback rendering for Arabic (Muhammadi Quranic) and Urdu (Jameel Noori Nastaleeq).
 */

import { PrayerTimings, HadeesItem } from '../types';

export interface PrayerCardCanvasData {
  isUr: boolean;
  cityName: string;
  todayFormatted: string;
  displayHijri: string;
  appName: string;
  contactNumber: string;
  sehriTime: string;
  iftarTime: string;
  activeTimings: PrayerTimings;
  activeHadith: HadeesItem;
}

/**
 * Preloads required typography fonts before rendering to Canvas
 */
export async function ensurePrayerCardFontsLoaded(): Promise<void> {
  if (typeof document !== 'undefined' && document.fonts) {
    try {
      await Promise.allSettled([
        document.fonts.load('28px "Muhammadi Quranic"'),
        document.fonts.load('24px "Jameel Noori Nastaleeq"'),
        document.fonts.load('20px "Plus Jakarta Sans"'),
        document.fonts.ready
      ]);
      // Small tick delay to let rendering engine finalize glyph layout
      await new Promise((res) => setTimeout(res, 100));
    } catch (err) {
      console.warn('Font loading tick error:', err);
    }
  }
}

/**
 * Helper to draw a rounded rectangle on Canvas
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number,
  fillStyle?: string | CanvasGradient,
  strokeStyle?: string,
  lineWidth: number = 1
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  if (fillStyle) {
    ctx.fillStyle = fillStyle;
    ctx.fill();
  }
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

/**
 * Measure height required for wrapped text on canvas
 */

export function measureWrappedTextHeight(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
  font: string
): number {
  if (!text) return 0;
  ctx.save();
  ctx.font = font;

  const words = text.split(/\s+/);
  let currentLine = '';
  let lineCount = 0;

  for (let n = 0; n < words.length; n++) {
    const word = words[n];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== '') {
      lineCount++;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lineCount++;
  }

  ctx.restore();
  return Math.max(1, lineCount) * lineHeight;
}

/**
 * Draw wrapped text manually on Canvas line-by-line
 */
export function drawWrappedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  startY: number,
  maxWidth: number,
  lineHeight: number,
  font: string,
  color: string,
  align: 'left' | 'center' | 'right' = 'center'
): number {
  if (!text) return startY;

  ctx.save();
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.textBaseline = 'top';

  const words = text.split(/\s+/);
  let currentLine = '';
  let currentY = startY;

  const lines: string[] = [];

  for (let n = 0; n < words.length; n++) {
    const word = words[n];
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const metrics = ctx.measureText(testLine);

    if (metrics.width > maxWidth && currentLine !== '') {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) {
    lines.push(currentLine);
  }

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, currentY);
    currentY += lineHeight;
  }

  ctx.restore();
  return currentY;
}

/**
 * Main Prayer Card Image Generator using direct HTML5 Canvas
 */
export async function generatePrayerCardCanvasJPEG(
  data: PrayerCardCanvasData
): Promise<{ blob: Blob; dataUrl: string } | null> {
  await ensurePrayerCardFontsLoaded();

  const width = 800;
  // Font definitions
  const urduFont = '"Jameel Noori Nastaleeq", "Noto Nastaliq Urdu", "Urdu Typesetting", serif';
  const quranicFont = '"Muhammadi Quranic", "Amiri", "Scheherazade New", "Noto Naskh Arabic", serif';
  const englishFont = '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif';

  // First pass: create a dummy canvas to measure required total height dynamically
  const tempCanvas = document.createElement('canvas');
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) return null;

  const cardPadding = 36;
  const contentWidth = width - cardPadding * 2; // 728px

  // Calculate Hadith section height
  const hadithHeaderHeight = 45;
  const hadithArabicHeight = data.activeHadith?.arabicText 
    ? measureWrappedTextHeight(tempCtx, data.activeHadith.arabicText, contentWidth - 40, 52, `bold 32px ${quranicFont}`) + 16
    : 0;

  const translateText = data.isUr ? data.activeHadith?.textUrdu || '' : data.activeHadith?.text || '';
  const hadithTranslationHeight = measureWrappedTextHeight(
    tempCtx, 
    `"${translateText}"`, 
    contentWidth - 40, 
    38, 
    `bold 22px ${data.isUr ? urduFont : englishFont}`
  ) + 16;

  const hadithReferenceHeight = 35;
  const totalHadithBoxHeight = 24 + hadithHeaderHeight + hadithArabicHeight + hadithTranslationHeight + hadithReferenceHeight + 16;

  // Total height calculation
  // Header box (120) + Gap (20) + City (65) + Gap (15) + Date (45) + Gap (20) + Sehri/Iftar (110) + Gap (20) + Prayer Grid (310) + Gap (20) + Hadith Box + Gap (20) + Footer (50) + Outer padding (72)
  const estimatedHeight = Math.max(
    1240, 
    36 + 125 + 20 + 65 + 15 + 45 + 20 + 110 + 20 + 310 + 20 + totalHadithBoxHeight + 20 + 50 + 36
  );

  const height = estimatedHeight;

  // Real Canvas Setup
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // 1. Background Radial Gradient
  const bgGrad = ctx.createRadialGradient(width / 2, 100, 50, width / 2, height / 2, height);
  bgGrad.addColorStop(0, '#064e3b');
  bgGrad.addColorStop(0.55, '#022c22');
  bgGrad.addColorStop(1, '#020617');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Outer Gold Border Frame
  drawRoundedRect(ctx, 16, 16, width - 32, height - 32, 28, undefined, '#f59e0b', 3);
  drawRoundedRect(ctx, 24, 24, width - 48, height - 48, 22, undefined, '#059669', 1.5);

  let currentY = 44;

  // 2. Top Header Box: Organization Branding
  drawRoundedRect(ctx, 40, currentY, contentWidth, 115, 20, '#022c22', '#f59e0b', 2);

  // Urdu Organization Title
  ctx.save();
  ctx.font = `bold 30px ${urduFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ', width / 2, currentY + 18);
  ctx.restore();

  // English Organization Subtitle
  ctx.save();
  ctx.font = `800 14px ${englishFont}`;
  ctx.fillStyle = '#a7f3d0';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('HALQA E USMANIA MUHAMMADIA RASHEEDIA QADEERIYA', width / 2, currentY + 74);
  ctx.restore();

  currentY += 115 + 22;

  // 3. City Name
  ctx.save();
  ctx.font = `900 52px ${englishFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText(data.cityName, width / 2, currentY);
  ctx.restore();

  currentY += 68;

  // 4. Gregorian & Hijri Date Badge
  const dateBadgeWidth = 520;
  drawRoundedRect(ctx, (width - dateBadgeWidth) / 2, currentY, dateBadgeWidth, 46, 16, '#064e3b', '#047857', 1.5);

  ctx.save();
  ctx.font = `bold 16px ${englishFont}`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`${data.todayFormatted}   •   ${data.displayHijri}`, width / 2, currentY + 23);
  ctx.restore();

  currentY += 46 + 22;

  // 5. Sehri & Iftar Banner
  const boxWidth = (contentWidth - 18) / 2; // 355px each

  // Sehri Box
  drawRoundedRect(ctx, 40, currentY, boxWidth, 105, 20, '#0f172a', '#f59e0b', 2);
  
  ctx.save();
  ctx.font = `bold 22px ${urduFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.isUr ? 'سحری (ختم)' : 'Sehri Time', 60, currentY + 18);

  ctx.font = `500 13px ${englishFont}`;
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(data.isUr ? 'امساک / فجر' : 'Imsak / Fajr', 60, currentY + 62);

  // Time value box inside Sehri
  drawRoundedRect(ctx, 40 + boxWidth - 130, currentY + 25, 112, 52, 12, '#020617', '#1e293b', 1);
  ctx.font = `900 24px monospace`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.sehriTime, 40 + boxWidth - 74, currentY + 51);
  ctx.restore();

  // Iftar Box
  const iftarX = 40 + boxWidth + 18;
  drawRoundedRect(ctx, iftarX, currentY, boxWidth, 105, 20, '#0f172a', '#10b981', 2);

  ctx.save();
  ctx.font = `bold 22px ${urduFont}`;
  ctx.fillStyle = '#6ee7b7';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.isUr ? 'افطار (مغرب)' : 'Iftar Time', iftarX + 20, currentY + 18);

  ctx.font = `500 13px ${englishFont}`;
  ctx.fillStyle = '#a7f3d0';
  ctx.fillText(data.isUr ? 'غروبِ آفتاب' : 'Sunset', iftarX + 20, currentY + 62);

  // Time value box inside Iftar
  drawRoundedRect(ctx, iftarX + boxWidth - 130, currentY + 25, 112, 52, 12, '#020617', '#1e293b', 1);
  ctx.font = `900 24px monospace`;
  ctx.fillStyle = '#6ee7b7';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(data.iftarTime, iftarX + boxWidth - 74, currentY + 51);
  ctx.restore();

  currentY += 105 + 22;

  // 6. The 5 Prayer Times Grid
  drawRoundedRect(ctx, 40, currentY, contentWidth, 310, 22, '#0f172a', '#047857', 1.5);

  // Table Headers
  ctx.save();
  ctx.font = `800 13px ${englishFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.isUr ? 'نماز' : 'PRAYER', 64, currentY + 16);

  ctx.textAlign = 'right';
  ctx.fillText(data.isUr ? 'وقت' : 'TIME', 40 + contentWidth - 24, currentY + 16);
  ctx.restore();

  // Divider Line
  ctx.beginPath();
  ctx.moveTo(56, currentY + 38);
  ctx.lineTo(40 + contentWidth - 16, currentY + 38);
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 1;
  ctx.stroke();

  let prayerRowY = currentY + 48;
  const prayers = [
    { label: 'Fajr', labelUrdu: 'فجر', time: data.activeTimings.Fajr },
    { label: 'Dhuhr', labelUrdu: 'ظہر', time: data.activeTimings.Dhuhr },
    { label: 'Asr', labelUrdu: 'عصر', time: data.activeTimings.Asr },
    { label: 'Maghrib', labelUrdu: 'مغرب', time: data.activeTimings.Maghrib },
    { label: 'Isha', labelUrdu: 'عشاء', time: data.activeTimings.Isha }
  ];

  prayers.forEach((p) => {
    // Row background box
    drawRoundedRect(ctx, 56, prayerRowY, contentWidth - 32, 44, 12, '#ffffff', '#e2e8f0', 1);

    // Prayer Name
    ctx.save();
    ctx.font = `bold 19px ${data.isUr ? urduFont : englishFont}`;
    ctx.fillStyle = '#020617';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText(data.isUr ? p.labelUrdu : p.label, 80, prayerRowY + 22);

    // Prayer Time
    ctx.font = `900 21px monospace`;
    ctx.textAlign = 'right';
    ctx.fillText(p.time, 56 + contentWidth - 48, prayerRowY + 22);
    ctx.restore();

    prayerRowY += 50;
  });

  currentY += 310 + 22;

  // 7. Daily Hadith Box (Calculated Dynamic Bounds)
  drawRoundedRect(ctx, 40, currentY, contentWidth, totalHadithBoxHeight, 22, '#022c22', '#059669', 2);

  let hadithContentY = currentY + 18;

  // Hadith Header Line
  ctx.save();
  ctx.font = `bold 20px ${urduFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(data.isUr ? '✨ حدیثِ مبارکہ' : '✨ Daily Hadith', 60, hadithContentY);

  ctx.font = `bold 15px ${englishFont}`;
  ctx.fillStyle = '#6ee7b7';
  ctx.textAlign = 'right';
  ctx.fillText(data.activeHadith?.book || 'Hadith', 40 + contentWidth - 20, hadithContentY + 2);
  ctx.restore();

  hadithContentY += 38;

  // Divider Line inside Hadith box
  ctx.beginPath();
  ctx.moveTo(56, hadithContentY);
  ctx.lineTo(40 + contentWidth - 16, hadithContentY);
  ctx.strokeStyle = '#065f46';
  ctx.lineWidth = 1;
  ctx.stroke();

  hadithContentY += 16;

  // Arabic Text (Using Muhammadi Quranic font with canvas manual wrapper)
  if (data.activeHadith?.arabicText) {
    hadithContentY = drawWrappedText(
      ctx,
      data.activeHadith.arabicText,
      width / 2,
      hadithContentY,
      contentWidth - 40,
      52,
      `bold 32px ${quranicFont}`,
      '#f59e0b',
      'center'
    );
    hadithContentY += 12;
  }

  // Urdu / English Translation Text
  const transText = data.isUr ? data.activeHadith?.textUrdu || '' : data.activeHadith?.text || '';
  hadithContentY = drawWrappedText(
    ctx,
    `"${transText}"`,
    width / 2,
    hadithContentY,
    contentWidth - 40,
    38,
    `bold 22px ${data.isUr ? urduFont : englishFont}`,
    '#ecfdf5',
    'center'
  );
  hadithContentY += 12;

  // Reference line
  ctx.save();
  ctx.font = `bold 14px ${englishFont}`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'top';
  ctx.fillText(`— ${data.activeHadith?.reference || ''}`, 40 + contentWidth - 20, hadithContentY);
  ctx.restore();

  currentY += totalHadithBoxHeight + 22;

  // 8. Card Footer: Phone Number & Organization Branding
  ctx.save();
  ctx.font = `900 17px monospace`;
  ctx.fillStyle = '#f59e0b';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText(`📞 ${data.contactNumber}`, 48, currentY + 12);

  ctx.font = `bold 18px ${urduFont}`;
  ctx.fillStyle = '#a7f3d0';
  ctx.textAlign = 'right';
  ctx.fillText('حلقہ عثمانیہ محمدیہ رشیدیہ قدیریہ', width - 48, currentY + 12);
  ctx.restore();

  // Convert canvas to Blob & Data URL
  const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, dataUrl });
        } else {
          resolve(null);
        }
      },
      'image/jpeg',
      0.95
    );
  });
}
