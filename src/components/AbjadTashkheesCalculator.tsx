/**
 * Abjad Tashkhees & Spiritual Guidance Calculator Component
 * Halqa-e-Usmania Official System
 */

import React, { useState } from 'react';
import { 
  Branch, 
  DayDatasetRecord, 
  SpiritualSlip, 
  ModSettings, 
  DayOfWeek, 
  AppUser 
} from '../types';
import { 
  calculateAbjad, 
  calculateSpiritualAdad,
  getCurrentDayOfWeek, 
  DAY_NAMES, 
  WEEKDAY_ADAD
} from '../lib/abjad';
import { downloadSlipJPEG } from '../lib/slipCanvasGenerator';
import { 
  Sparkles, 
  Calculator, 
  Calendar, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  Download, 
  Copy, 
  AlertCircle, 
  Send, 
  Heart, 
  Info,
  Lightbulb,
  CheckCircle2
} from 'lucide-react';

interface AbjadTashkheesCalculatorProps {
  branches: Branch[];
  dayDatasets: DayDatasetRecord[];
  modSettings: ModSettings;
  activeUser: AppUser | null;
  onCreateSlip: (slipData: any) => SpiritualSlip;
  onViewSlipHistory?: () => void;
}

export const AbjadTashkheesCalculator: React.FC<AbjadTashkheesCalculatorProps> = ({
  branches,
  dayDatasets,
  activeUser,
  onCreateSlip,
}) => {
  // Form Inputs
  const [userName, setUserName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [mobileNumber, setMobileNumber] = useState('');
  const [selectedBranchId, setSelectedBranchId] = useState<string>(
    activeUser?.branchId || branches[0]?.id || ''
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(getCurrentDayOfWeek());

  // Calculated Results
  const [calculatedResult, setCalculatedResult] = useState<{
    nameAdad: number;
    motherAdad: number;
    dayAdad: number;
    totalAdad: number;
    marzAdad: number; // mod 4 (0..3)
    sadqaAdad: number; // mod 7 (0..6)
    mizajObj: { en: string; ur: string };
    tashkheesList: string[];
    mashwaraText: string;
    sadqaList: string[];
    methodOfSadqa: string;
    tanbeehNote: string;
    calculatedAt: string;
  } | null>(null);

  // Active Generated Slip State
  const [generatedSlip, setGeneratedSlip] = useState<SpiritualSlip | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId) || branches[0];

  // Auto calculate live preview
  const nameAbjadObj = calculateAbjad(userName || '');
  const motherAbjadObj = motherName.trim() ? calculateAbjad(motherName) : { total: 0 };
  const currentDayInfo = WEEKDAY_ADAD[selectedDay] || WEEKDAY_ADAD.monday;
  const currentTotal = (nameAbjadObj.total || 0) + (motherAbjadObj.total || 0) + (currentDayInfo.adad || 0);
  const currentMarz = isNaN(currentTotal % 4) ? 0 : currentTotal % 4;
  const currentSadqa = isNaN(currentTotal % 7) ? 0 : currentTotal % 7;

  const handlePerformCalculation = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userName.trim()) return;

    const calc = calculateSpiritualAdad(userName.trim(), motherName.trim(), selectedDay);

    // Look up dataset record for this day or fallback
    const matchedRecord = dayDatasets.find(
      (r) => (r.dayName || r.day || '').toString().toLowerCase() === selectedDay.toLowerCase() && (r.sadqaAdad === calc.sadqaAdad || r.adad === calc.sadqaAdad)
    ) || dayDatasets.find((r) => r.sadqaAdad === calc.sadqaAdad || r.adad === calc.sadqaAdad) || dayDatasets[0];

    // Default Tashkhees mapping for Marz Adad (0..3)
    const defaultTashkheesMap: Record<number, string[]> = {
      0: ['جسمانی تھکاوٹ، بوجھل پن اور اعصابی تناؤ', 'سستی اور نزلہ زکام کی کیفیت'],
      1: ['نظربد اور حاسدین کی بدخواہی کے اثرات', 'کام کاج میں اچانک رکاوٹ اور بے برکتی'],
      2: ['دل کی گھبراہٹ، ذہنی پریشانی اور ناچاقی', 'خوابوں میں ڈرنا اور بے خوابی'],
      3: ['رزق میں تنگی اور معاشی دباؤ', 'سفر اور قانونی یا خاندانی الجھنیں']
    };

    // Default Mashwara & Sadqa for Sadqa Adad (0..6)
    const defaultSadqaMap: Record<number, { mashwara: string; sadqa: string[] }> = {
      0: {
        mashwara: 'نمازِ پنجگانہ کی پابندی کریں اور روزانہ 100 بار استغفار کریں۔ اپنے تمام کام باوضو انجام دیں۔',
        sadqa: ['حسبِ استطاعت سفید چیز (دودھ، چاول یا چینی) کا صدقہ دیں', 'پرندوں کو باجرہ اور پانی پیش کریں']
      },
      1: {
        mashwara: 'روزانہ صبح سورہ یٰسین یا منزل کا ورد کریں۔ صدقہ دینے میں جلدی کریں۔',
        sadqa: ['سرخ دال (مسور) یا 100 روپے کسی غریب کو پیش کریں', 'کسی مسکین کو کھانا کھلائیں']
      },
      2: {
        mashwara: 'درود شریف کی کثرت کریں اور غصہ و جذباتی فیصلوں سے پرہیز کریں۔',
        sadqa: ['پرندوں کے لیے پانی اور دانہ رکھیں', 'کسی ضرورت مند کو پانی یا شربت پلائیں']
      },
      3: {
        mashwara: 'صبح فجر کے بعد آیت الکرسی اور معوذتین باقاعدگی سے پڑھ کر دم کریں۔',
        sadqa: ['سبز دال یا سبز کپڑے کا صدقہ دیں', 'طالب علم کو کتاب یا قلم تحفہ دیں']
      },
      4: {
        mashwara: 'استغفار اور صدقہ کے ذریعے رکاوٹیں دور کریں۔ کثرت سے "لا حول ولا قوة إلا بالله" پڑھیں۔',
        sadqa: ['کالی دال یا کالے تل کا صدقہ دیں', 'پرانے کپڑے یا جوتے کسی مستحق کو دیں']
      },
      5: {
        mashwara: 'خاندانی تعلقات خوش اسلوبی سے استوار رکھیں اور رات کو باوضو سوئیں۔',
        sadqa: ['سرخ رنگ کی نمکین چیز یا روٹی پرندوں کو ڈالیں', 'یتیم بچے کی مدد کریں']
      },
      6: {
        mashwara: 'آیت الکرسی اور سورہ الفاتحہ پڑھ کر پانی پر دم کر کے پیئیں۔ نیت صاف رکھیں۔',
        sadqa: ['گوشت کا ٹکڑا پرندوں یا جانوروں کو ڈالیں', 'حسبِ توفیق نقد رقم صدقہ کریں']
      }
    };

    const tashkheesList = matchedRecord?.tashkhees && matchedRecord.tashkhees.length > 0 
      ? matchedRecord.tashkhees 
      : (defaultTashkheesMap[calc.marzAdad] || defaultTashkheesMap[0]);

    const mashwaraText = matchedRecord?.mashwara 
      || defaultSadqaMap[calc.sadqaAdad]?.mashwara 
      || 'نمازِ پنجگانہ کی پابندی اور باوضو رہنے کا اہتمام کریں۔';

    const sadqaList = matchedRecord?.sadqa && matchedRecord.sadqa.length > 0 
      ? matchedRecord.sadqa 
      : (defaultSadqaMap[calc.sadqaAdad]?.sadqa || ['حسبِ استطاعت صدقہ و خیرات کریں۔']);

    const methodOfSadqa = matchedRecord?.methodOfSadqa 
      || 'صدقہ کی رقم یا اشیاء سائل اپنے سر سے ۷ بار وار (گھما) کر کسی مستحق، یتیم یا پرندوں کو پیش کرے۔ اگر صدقہ جانور کا ہو تو اس کا گوشت غرُباء میں تقسیم فرمائیں۔';

    const tanbeehNote = matchedRecord?.tanbeehNote 
      || 'یہ سند محض روحانی رہنمائی اور مستحب صدقات کی معلومات کے لیے ہے۔ حرام کاموں، تعویذات کی غلط فروخت یا غیر شرعی افعال کے لیے اس کا استعمال سخت ممنوع ہے۔';

    setCalculatedResult({
      nameAdad: calc.nameAdad,
      motherAdad: calc.motherAdad,
      dayAdad: calc.dayAdad,
      totalAdad: calc.totalAdad,
      marzAdad: calc.marzAdad,
      sadqaAdad: calc.sadqaAdad,
      mizajObj: calc.mizajObj,
      tashkheesList,
      mashwaraText,
      sadqaList,
      methodOfSadqa,
      tanbeehNote,
      calculatedAt: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' })
    });

    setGeneratedSlip(null);
  };

  const handleGenerateSlip = () => {
    if (!calculatedResult || !userName.trim()) return;

    const branch = selectedBranch || branches[0];

    const newSlip = onCreateSlip({
      userId: activeUser?.id || undefined,
      userName: userName.trim(),
      motherName: motherName.trim() || '-',
      dob: dob || undefined,
      gender: gender,
      mobileNumber: mobileNumber || activeUser?.mobile || undefined,
      branchId: branch.id,
      branchCode: branch.code,
      branchName: branch.name,
      nameAdad: calculatedResult.nameAdad,
      motherAdad: calculatedResult.motherAdad,
      dayAdad: calculatedResult.dayAdad,
      totalAdad: calculatedResult.totalAdad,
      sadqaAdad: calculatedResult.sadqaAdad,
      marzAdad: calculatedResult.marzAdad,
      day: selectedDay,
      mizaj: calculatedResult.mizajObj.ur,
      tashkhees: calculatedResult.tashkheesList,
      mashwara: calculatedResult.mashwaraText,
      sadqa: calculatedResult.sadqaList,
      methodOfSadqa: calculatedResult.methodOfSadqa,
      tanbeehNote: calculatedResult.tanbeehNote,
      operatorName: activeUser?.fullName || 'محقق آستانہ عثمانیہ',
      operatorRole: activeUser?.role === 'muhaqqiq' ? 'محقق / محرر' : 'روحانی آپریٹر'
    });

    setGeneratedSlip(newSlip);
  };

  const handleCopySlipId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareWhatsApp = (slip: SpiritualSlip) => {
    const rawMobile = mobileNumber || slip.mobileNumber || '';
    const cleanMobile = rawMobile.replace(/[^0-9]/g, '');
    let formattedPhone = cleanMobile;
    if (cleanMobile.startsWith('0')) {
      formattedPhone = '92' + cleanMobile.slice(1);
    }

    const text = `*حلقۂ عثمانیہ - روحانی سند و ہدایت برائے صدقہ*
📌 *سند نمبر:* ${slip.id || slip.slipId}
👤 *نام:* ${slip.userName} (والدہ: ${slip.motherName || '-'})
🔢 *کل ابجد عدد:* ${slip.totalAdad} | *صدقہ عدد:* ${slip.sadqaAdad}
✨ *مزاج:* ${slip.mizaj}
🕌 *شاخ:* ${slip.branchName} (${slip.branchCode})
📅 *روز:* ${DAY_NAMES[slip.day as DayOfWeek]?.ur || slip.day}

💡 *مشورہ:*
${slip.mashwara}

🪙 *مستحب صدقہ:*
${Array.isArray(slip.sadqa) ? slip.sadqa.join(', ') : slip.sadqa}

📜 *طریقہٴ اداۓ صدقہ:*
${slip.methodOfSadqa || 'سر سے ۷ بار وار کر کسی مستحق کو پیش کریں۔'}

تصدیق شدہ از: حلقۂ عثمانیہ مرکزی آستانہ`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = formattedPhone 
      ? `https://wa.me/${formattedPhone}?text=${encoded}`
      : `https://wa.me/?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="w-full space-y-4 text-right" dir="rtl">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-l from-emerald-950 via-emerald-900 to-slate-900 border border-emerald-800/80 rounded-2xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 p-3 opacity-10 font-serif text-6xl select-none">
          ح
        </div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/40 shrink-0">
            <Calculator size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white font-serif tracking-wide">
                روحانی حسابِ ابجد و ہدایتِ صدقہ
              </h2>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                حلقہ عثمانیہ
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/90 leading-relaxed mt-0.5">
              نام، روزِ تشخیص اور اعداد کے حساب سے مرض عدد، صدقہ عدد اور مستحب صدقات کا جائزہ
            </p>
          </div>
        </div>
      </div>

      {/* Main Calculation Form Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-4">
        
        <form onSubmit={handlePerformCalculation} className="space-y-4">
          
          {/* Branch & Day Selection Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
            {/* Branch Selection */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>مرکزی آستانہ / شاخ انتخاب کریں:</span>
              </label>
              <select
                value={selectedBranchId}
                onChange={(e) => setSelectedBranchId(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-semibold"
              >
                {branches.map((br) => (
                  <option key={br.id} value={br.id}>
                    {br.name} ({br.code}) - {br.city}
                  </option>
                ))}
              </select>
            </div>

            {/* Day Detection */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1">
                <Calendar size={14} className="text-amber-500" />
                <span>روزِ تشخیص (Day Adad):</span>
              </label>
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-amber-500 font-semibold"
              >
                {Object.entries(DAY_NAMES).map(([key, val]) => {
                  const dayAdadVal = WEEKDAY_ADAD[key as DayOfWeek]?.adad || 0;
                  return (
                    <option key={key} value={key}>
                      {val.ur} • عدد: {dayAdadVal} {key === getCurrentDayOfWeek() ? ' (آج کا دن)' : ''}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Name & Mother Name Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* User Name */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block mb-1">
                سائل کا مکمل نام (اردو میں): <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="مثلاً: محمد بلال"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                {nameAbjadObj.total > 0 && (
                  <span className="absolute left-3 top-2.5 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    عدد: {nameAbjadObj.total}
                  </span>
                )}
              </div>
            </div>

            {/* Mother Name (Optional - Treats as 0 if blank) */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-200 block mb-1">
                والدہ کا نام (اختیاری - نہ ہونے پر 0):
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="مثلاً: خدیجہ بی بی (خالی چھوڑنے پر 0)"
                  value={motherName}
                  onChange={(e) => setMotherName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 font-medium"
                />
                <span className="absolute left-3 top-2.5 text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  عدد: {motherAbjadObj.total}
                </span>
              </div>
            </div>
          </div>

          {/* Optional Inputs: DOB, Gender, Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                تاریخِ پیدائش (اختیاری):
              </label>
              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                جنس (اختیاری):
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200"
              >
                <option value="Male">مرد (Male)</option>
                <option value="Female">عورت (Female)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                موبائل نمبر (اختیاری):
              </label>
              <input
                type="text"
                placeholder="03001234567"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 dark:text-slate-200 font-mono text-left"
              />
            </div>
          </div>

          {/* Live Abjad Calculation Box */}
          {userName.trim().length > 0 && (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3 text-xs space-y-2">
              <div className="flex justify-between items-center text-emerald-900 dark:text-emerald-200 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" />
                  حسابِ ابجد کا لائیو نتیجہ:
                </span>
                <span className="font-mono text-xs bg-emerald-800 text-white px-2.5 py-0.5 rounded-lg shadow-sm">
                  کل عدد: {currentTotal}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px] text-slate-700 dark:text-slate-300 font-mono">
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">نام اعداد</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{nameAbjadObj.total}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">والدہ اعداد</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{motherAbjadObj.total}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">روز اعداد ({DAY_NAMES[selectedDay]?.en})</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{currentDayInfo.adad}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-[9px] text-slate-400 block">مرض عدد (mod 4)</span>
                  <span className="font-bold text-rose-600 dark:text-rose-400">{currentMarz}</span>
                </div>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-center col-span-2 sm:col-span-1">
                  <span className="text-[9px] text-slate-400 block">صدقہ عدد (mod 7)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{currentSadqa}</span>
                </div>
              </div>
            </div>
          )}

          {/* Calculate Button */}
          <button
            type="submit"
            disabled={!userName.trim()}
            className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calculator size={18} />
            <span>روحانی حسابِ ابجد کا جائزہ لیں (Calculate Spiritual Assessment)</span>
          </button>
        </form>
      </div>

      {/* RESULT SCREEN */}
      {calculatedResult && (
        <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500/80 rounded-2xl p-4 sm:p-5 shadow-xl space-y-4 animate-fadeIn">
          
          {/* Header & Summary */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-200 dark:border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white font-serif">
                  روحانی حساب و ہدایت (Spiritual Assessment)
                </h3>
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                سائل: <strong className="text-slate-800 dark:text-slate-200">{userName}</strong> {motherName.trim() ? `(والدہ: ${motherName})` : ''} • شاخ: {selectedBranch?.name} ({selectedBranch?.code})
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[10px] bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-1 rounded-full border border-amber-500/30">
                روز: {DAY_NAMES[selectedDay]?.ur}
              </span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
                مزاج: {calculatedResult.mizajObj.ur}
              </span>
            </div>
          </div>

          {/* Adad Metrics Display */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center">
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">نام اعداد</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {calculatedResult.nameAdad}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">والدہ اعداد</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {calculatedResult.motherAdad}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">روز اعداد</span>
              <span className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">
                {calculatedResult.dayAdad}
              </span>
            </div>
            <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 block">کل ابجد عدد</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 font-mono">
                {calculatedResult.totalAdad}
              </span>
            </div>
            <div className="bg-emerald-950 text-white p-2.5 rounded-xl border border-emerald-600 text-center shadow-inner col-span-2 sm:col-span-1">
              <span className="text-[10px] text-emerald-300 block">صدقہ عدد</span>
              <span className="text-base font-black text-amber-400 font-mono">
                {calculatedResult.sadqaAdad}
              </span>
            </div>
          </div>

          {/* Spiritual Assessment Details */}
          <div className="space-y-3.5 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            
            {/* 1. Spiritual Diagnosis (Roohani Tashkhees) - Shown ONLY to Operator on Result Screen */}
            <div className="bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 p-3 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-xs text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <FileText size={15} className="text-amber-600" />
                  <span>روحانی تشخیص (Spiritual Diagnosis - آپریٹر معائنہ):</span>
                </h4>
                <span className="text-[9px] bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100 font-bold px-2 py-0.5 rounded-md">
                  مرض عدد: {calculatedResult.marzAdad}
                </span>
              </div>
              <ul className="space-y-1 pt-1">
                {calculatedResult.tashkheesList.map((item, idx) => (
                  <li key={idx} className="text-xs text-slate-800 dark:text-slate-200 flex items-start gap-2 bg-white dark:bg-slate-900 p-2 rounded-lg border border-amber-100 dark:border-slate-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
                    <span className="leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-[9px] text-amber-800/80 dark:text-amber-300/70 italic pt-0.5">
                * یہ تشخیص صرف آپریٹر معائنے کے لیے ہے، سائل کی پرنٹ شدہ سلیپ پر شامل نہیں ہوگی۔
              </p>
            </div>

            {/* 2. Advice (Mashwara) - Directly below Roohani Tashkhees */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5 mb-1.5">
                <Lightbulb size={15} className="text-amber-500" />
                <span>مشورہ و باطنی ہدایت (Advice):</span>
              </h4>
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-xl text-xs text-slate-900 dark:text-slate-100 leading-relaxed font-serif">
                {calculatedResult.mashwaraText}
              </div>
            </div>

            {/* 3. Recommended Sadqa (مستحب صدقہ) */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5 mb-1.5">
                <Heart size={15} className="text-rose-500" />
                <span>مستحب صدقہ (Recommended Charity):</span>
              </h4>
              <div className="space-y-1">
                {calculatedResult.sadqaList.map((sad, i) => (
                  <div key={i} className="text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center gap-2">
                    <span className="text-rose-500 font-bold">•</span>
                    <span>{sad}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Method of Performing Sadqa */}
            <div>
              <h4 className="font-bold text-xs text-slate-800 dark:text-white flex items-center gap-1.5 mb-1">
                <Info size={15} className="text-emerald-600" />
                <span>طریقہٴ اداۓ صدقہ (Method of Performing Sadqa):</span>
              </h4>
              <div className="text-[11px] text-emerald-900 dark:text-emerald-200 bg-emerald-50 dark:bg-emerald-950/60 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 leading-relaxed">
                {calculatedResult.methodOfSadqa}
              </div>
            </div>
          </div>

          {/* Important Warning / Tanbeeh Banner */}
          <div className="bg-red-50 dark:bg-red-950/40 p-3 rounded-xl border border-red-200 dark:border-red-800/60 text-[10px] text-red-900 dark:text-red-200 leading-relaxed flex items-start gap-2">
            <AlertCircle size={16} className="text-red-600 shrink-0 mt-0.5" />
            <p>
              <strong>اہم تنبیہ:</strong> {calculatedResult.tanbeehNote}
            </p>
          </div>

          {/* Action Buttons: Generate Slip */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
            {!generatedSlip ? (
              <button
                onClick={handleGenerateSlip}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-4 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck size={18} />
                <span>تصدیق شدہ روحانی سلیپ (Slip) جاری کریں</span>
              </button>
            ) : (
              <div className="w-full bg-emerald-950 text-white p-4 rounded-xl border border-emerald-600 shadow-xl space-y-3">
                <div className="flex justify-between items-center border-b border-emerald-800 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <span className="font-bold text-xs text-emerald-200">سند و سلیپ کامیابی سے جاری ہو گئی</span>
                  </div>
                  <span className="font-mono text-xs text-amber-400 font-bold">
                    {generatedSlip.id || generatedSlip.slipId}
                  </span>
                </div>

                <p className="text-[11px] text-emerald-100/90 leading-relaxed">
                  یہ سلیپ آپ کے آستانہ ریکارڈ میں محفوظ کر دی گئی ہے۔ تصویری رسید (JPEG Image) یا واٹس ایپ کے ذریعے سائل کو پیش کریں۔
                </p>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => downloadSlipJPEG(generatedSlip)}
                    className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Download size={15} />
                    <span>ڈاؤن لوڈ (JPEG Receipt)</span>
                  </button>

                  <button
                    onClick={() => handleShareWhatsApp(generatedSlip)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-md transition-all"
                  >
                    <Send size={15} />
                    <span>واٹس ایپ شیئر</span>
                  </button>

                  <button
                    onClick={() => handleCopySlipId(generatedSlip.id || generatedSlip.slipId || '')}
                    className="bg-slate-900 hover:bg-slate-800 text-emerald-300 border border-emerald-700 py-2.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 cursor-pointer font-medium"
                  >
                    <Copy size={15} />
                    <span>{copiedId ? 'کاپی ہو گیا!' : 'سند نمبر کاپی'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
};

