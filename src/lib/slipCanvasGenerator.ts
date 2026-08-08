/**
 * HTML5 Canvas Slip & Receipt Image Generator Utility
 * Halqa-e-Usmania Official System
 */

import { SpiritualSlip, DayOfWeek } from '../types';
import { DAY_NAMES } from './abjad';

export function generateSlipJPEG(slip: SpiritualSlip): string {
  const canvas = document.createElement('canvas');
  // High resolution canvas: 800 x 1180
  const width = 800;
  const height = 1180;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background
  ctx.fillStyle = '#fdfbf7'; // Warm ivory paper
  ctx.fillRect(0, 0, width, height);

  // Outer border & frame
  ctx.strokeStyle = '#064e3b'; // Dark Emerald
  ctx.lineWidth = 12;
  ctx.strokeRect(18, 18, width - 36, height - 36);

  ctx.strokeStyle = '#d97706'; // Gold Accent
  ctx.lineWidth = 3;
  ctx.strokeRect(28, 28, width - 56, height - 56);

  // Top Header Banner
  const headerGradient = ctx.createLinearGradient(0, 30, width, 140);
  headerGradient.addColorStop(0, '#064e3b');
  headerGradient.addColorStop(0.5, '#047857');
  headerGradient.addColorStop(1, '#065f46');
  ctx.fillStyle = headerGradient;
  ctx.fillRect(32, 32, width - 64, 130);

  // Title Text
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Noto Naskh Arabic", "Urdu Typesetting", "Amiri", serif';
  ctx.textAlign = 'center';
  ctx.fillText('حلقۂ عثمانیہ - روحانی سند و ہدایت برائے صدقہ', width / 2, 78);

  ctx.fillStyle = '#fbbf24'; // Gold Subtitle
  ctx.font = 'bold 15px "Noto Naskh Arabic", sans-serif';
  ctx.fillText('HALQA-E-USMANIA OFFICIAL RECEIPT & SPIRITUAL GUIDANCE SLIP', width / 2, 108);

  ctx.fillStyle = '#a7f3d0';
  ctx.font = '14px sans-serif';
  ctx.fillText(`شاخ / آستانہ: ${slip.branchName} (${slip.branchCode})`, width / 2, 136);

  // Slip ID Bar
  ctx.fillStyle = '#0f172a'; // Slate 900
  ctx.fillRect(50, 180, width - 100, 48);

  ctx.fillStyle = '#f59e0b'; // Amber font
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`سند نمبر: ${slip.id || (slip as any).slipId}`, width / 2, 212);

  // Info Grid Box
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1.5;
  ctx.fillRect(50, 245, width - 100, 160);
  ctx.strokeRect(50, 245, width - 100, 160);

  // Labels and Values
  ctx.textAlign = 'right';
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 15px "Noto Naskh Arabic", serif';

  // Row 1
  ctx.fillText(`سائل کا نام:  ${slip.userName}`, width - 70, 280);
  ctx.fillText(`والدہ کا نام:  ${slip.motherName || 'غیر نامزد (-)'}`, 380, 280);

  // Row 2
  const dayName = DAY_NAMES[slip.day as DayOfWeek]?.ur || slip.day || 'پیر';
  ctx.fillText(`روزِ تشخیص:  ${dayName}`, width - 70, 320);
  ctx.fillText(`موبائل نمبر:  ${slip.mobileNumber || (slip as any).phone || '-'}`, 380, 320);

  // Row 3 (Calculation summary)
  ctx.fillStyle = '#064e3b';
  ctx.font = 'bold 15px "Noto Naskh Arabic", serif';
  ctx.fillText(`مجموعی ابجد عدد:  ${slip.totalAdad}`, width - 70, 360);
  ctx.fillText(`صدقہ عدد:  ${slip.sadqaAdad ?? slip.finalAdad ?? 0}`, 380, 360);

  // Row 4
  ctx.fillStyle = '#d97706';
  ctx.fillText(`عنصر / مزاج:  ${slip.mizaj}`, width - 70, 390);
  ctx.fillStyle = '#475569';
  ctx.font = '13px monospace';
  ctx.fillText(`تاریخ اجرا:  ${slip.createdAt || new Date().toISOString().slice(0, 10)}`, 380, 390);

  // EXCLUDES ROOHANI TASHKHEES ON PETITIONER SLIP (Strict Prompt Requirement)

  // Section 1: Mashwara (مشورہ)
  let currentY = 430;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px "Noto Naskh Arabic", serif';
  ctx.textAlign = 'right';
  ctx.fillText('💡 مشورہ و باطنی ہدایت (Advice):', width - 50, currentY);

  currentY += 15;
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#cbd5e1';
  ctx.fillRect(50, currentY, width - 100, 80);
  ctx.strokeRect(50, currentY, width - 100, 80);

  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px "Noto Naskh Arabic", serif';
  const mashwaraText = slip.mashwara || 'نمازِ پنجگانہ کی پابندی اور روزانہ استغفار کریں۔ تمام امور باوضو انجام دیں۔';
  wrapText(ctx, mashwaraText, width - 70, currentY + 30, width - 140, 26);

  // Section 2: Recommended Sadqa (مستحب صدقہ)
  currentY += 105;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px "Noto Naskh Arabic", serif';
  ctx.fillText('🪙 مستحب صدقہ (Recommended Charity):', width - 50, currentY);

  currentY += 15;
  ctx.fillStyle = '#fff7ed'; // Amber tint
  ctx.strokeStyle = '#fed7aa';
  ctx.fillRect(50, currentY, width - 100, 80);
  ctx.strokeRect(50, currentY, width - 100, 80);

  ctx.fillStyle = '#9a3412';
  ctx.font = 'bold 14px "Noto Naskh Arabic", serif';
  const sadqaText = Array.isArray(slip.sadqa) ? slip.sadqa.join(' ، ') : (slip.sadqa || 'حسبِ استطاعت صدقہ و خیرات کریں۔');
  wrapText(ctx, sadqaText, width - 70, currentY + 30, width - 140, 26);

  // Section 3: Method of Performing Sadqa (طریقہٴ اداۓ صدقہ - Admin Editable)
  currentY += 105;
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 17px "Noto Naskh Arabic", serif';
  ctx.fillText('📜 طریقہٴ اداۓ صدقہ (Method of Performing Sadqa):', width - 50, currentY);

  currentY += 15;
  ctx.fillStyle = '#f0fdf4'; // Light green
  ctx.strokeStyle = '#bbf7d0';
  ctx.fillRect(50, currentY, width - 100, 110);
  ctx.strokeRect(50, currentY, width - 100, 110);

  ctx.fillStyle = '#166534';
  ctx.font = '13.5px "Noto Naskh Arabic", serif';
  const methodText = slip.methodOfSadqa || 'صدقہ کی رقم یا اشیاء سائل اپنے سر سے ۷ بار وار (گھما) کر کسی مستحق، یتیم یا پرندوں کو پیش کرے۔ اگر صدقہ جانور کا ہو تو اس کا گوشت غرُباء میں تقسیم فرمائیں۔';
  wrapText(ctx, methodText, width - 70, currentY + 28, width - 140, 24);

  // Section 4: Important Warning / Tanbeeh (اہم تنبیہ)
  currentY += 135;
  ctx.fillStyle = '#991b1b'; // Red
  ctx.font = 'bold 16px "Noto Naskh Arabic", serif';
  ctx.fillText('⚠️ اہم تنبیہ و شرائط (Important Warning):', width - 50, currentY);

  currentY += 12;
  ctx.fillStyle = '#fef2f2';
  ctx.strokeStyle = '#fecaca';
  ctx.fillRect(50, currentY, width - 100, 80);
  ctx.strokeRect(50, currentY, width - 100, 80);

  ctx.fillStyle = '#991b1b';
  ctx.font = '13px "Noto Naskh Arabic", serif';
  const tanbeehText = slip.tanbeehNote || 'یہ سند محض روحانی رہنمائی اور مستحب صدقات کی معلومات کے لیے ہے۔ حرام کاموں، تعویذات کی غلط فروخت یا غیر شرعی افعال کے لیے اس کا استعمال سخت ممنوع ہے۔';
  wrapText(ctx, tanbeehText, width - 70, currentY + 26, width - 140, 22);

  // Bottom Footer & Stamps
  currentY += 105;
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(50, currentY);
  ctx.lineTo(width - 50, currentY);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '12px "Noto Naskh Arabic", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText(`محرر / آپریٹر:  ${slip.operatorName || 'حلقۂ عثمانیہ'}`, width - 50, currentY + 25);

  ctx.textAlign = 'left';
  ctx.fillText('تصدیق شدہ از:  مرکزی آستانہ حلقۂ عثمانیہ', 50, currentY + 25);

  return canvas.toDataURL('image/jpeg', 0.95);
}

// Helper to wrap text line-by-line in canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';
  let testY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, testY);
      line = words[n] + ' ';
      testY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, testY);
}

// Download helper function
export function downloadSlipJPEG(slip: SpiritualSlip) {
  const dataUrl = generateSlipJPEG(slip);
  if (!dataUrl) return;

  const slipNumber = slip.id || (slip as any).slipId || 'Receipt';
  const fileName = `Halqa_Usmania_Slip_${slipNumber}.jpg`;
  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
