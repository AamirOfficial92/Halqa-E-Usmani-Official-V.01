/**
 * User Slips History & Search View Component
 * Halqa-e-Usmania
 */

import React, { useState } from 'react';
import { SpiritualSlip, Branch, AppUser } from '../types';
import { 
  FileCheck, 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Send, 
  Printer, 
  Copy, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  X,
  FileText,
  User
} from 'lucide-react';

interface UserSlipsHistoryProps {
  slips: SpiritualSlip[];
  branches: Branch[];
  activeUser: AppUser | null;
  onCancelSlip?: (slipId: string, reason: string) => void;
}

export const UserSlipsHistory: React.FC<UserSlipsHistoryProps> = ({
  slips,
  branches,
  activeUser,
  onCancelSlip
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSlip, setSelectedSlip] = useState<SpiritualSlip | null>(null);
  const [copiedId, setCopiedId] = useState(false);
  const [cancelReasonInput, setCancelReasonInput] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  // If user is a regular registered user, show only their slips or allow searching by Slip ID
  const isRegularUser = activeUser?.role === 'registered_user';

  const filteredSlips = slips.filter((s) => {
    // Role scope check
    if (isRegularUser && activeUser) {
      if (s.userId && s.userId !== activeUser.id && !s.id.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
    }

    // Branch filter
    if (branchFilter !== 'all' && s.branchCode !== branchFilter) {
      return false;
    }

    // Status filter
    if (statusFilter !== 'all' && s.status !== statusFilter) {
      return false;
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchId = s.id.toLowerCase().includes(q);
      const matchName = s.userName.toLowerCase().includes(q);
      const matchMother = s.motherName.toLowerCase().includes(q);
      const matchBranch = s.branchCode.toLowerCase().includes(q) || s.branchName.toLowerCase().includes(q);
      const matchMobile = s.mobileNumber?.toLowerCase().includes(q);
      return matchId || matchName || matchMother || matchBranch || matchMobile;
    }

    return true;
  });

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleShareWhatsApp = (slip: SpiritualSlip) => {
    const text = `*حلقۂ عثمانیہ - روحانی سند / تشخیص سلیپ*
📌 *سند نمبر:* ${slip.id}
👤 *نام:* ${slip.userName} (والدہ: ${slip.motherName})
🔢 *کل عدد:* ${slip.totalAdad} (عددِ نهایی: ${slip.finalAdad})
✨ *مزاج:* ${slip.mizaj}
🕌 *شاخ / آستانہ:* ${slip.branchName} (${slip.branchCode})

📋 *تشخیص:*
${slip.tashkhees.map((t, i) => `${i + 1}. ${t}`).join('\n')}

🤲 *وظیفہ:*
${slip.wazifa} (${slip.duration})

تصدیق شدہ از: حلقۂ عثمانیہ مرکزی آستانہ`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handleConfirmCancel = () => {
    if (!selectedSlip || !cancelReasonInput.trim() || !onCancelSlip) return;
    onCancelSlip(selectedSlip.id, cancelReasonInput.trim());
    setSelectedSlip({ ...selectedSlip, status: 'cancelled', cancellationReason: cancelReasonInput.trim() });
    setShowCancelModal(false);
    setCancelReasonInput('');
  };

  return (
    <div className="w-full space-y-4 text-right" dir="rtl">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-2xl p-4 text-white shadow-md flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-800/80 text-amber-400 rounded-xl border border-amber-500/30">
            <FileCheck size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold font-serif text-white">
              روحانی اسناد و سلیپس ہسٹری (Slip Audit Ledger)
            </h2>
            <p className="text-[11px] text-slate-400">
              حلقہ عثمانیہ کے منظور شدہ ریکارڈز اور جاری کردہ اسناد
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold bg-emerald-900 text-emerald-300 px-3 py-1 rounded-full border border-emerald-700">
          کل سلیپس: {filteredSlips.length}
        </span>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 shadow-sm space-y-3">
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Search Box */}
          <div className="relative sm:col-span-1">
            <input
              type="text"
              placeholder="سند نمبر، نام، والدہ کا نام، موبائل..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-emerald-500 pr-8"
            />
            <Search size={14} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">تمام آستانہ / شاخیں</option>
              {branches.map((b) => (
                <option key={b.id} value={b.code}>
                  {b.name} ({b.code})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-white rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="all">تمام اسٹیٹس</option>
              <option value="active">فعال / منظور شدہ (Active)</option>
              <option value="cancelled">منسوخ شدہ (Cancelled)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Slips List */}
      <div className="space-y-2.5">
        {filteredSlips.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500 dark:text-slate-400 space-y-2">
            <FileText size={32} className="mx-auto text-slate-400" />
            <p className="text-xs font-bold">کوئی سلیپ یا سند نہیں ملی</p>
            <p className="text-[10px]">سرچ یا فلٹر تبدیل کر کے دوبارہ کوشش کریں۔</p>
          </div>
        ) : (
          filteredSlips.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelectedSlip(s)}
              className={`bg-white dark:bg-slate-900 border rounded-2xl p-3.5 shadow-sm transition-all hover:border-emerald-500 cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-3 ${
                s.status === 'cancelled'
                  ? 'border-red-300 dark:border-red-950/80 bg-red-50/20 dark:bg-red-950/10'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold bg-slate-100 dark:bg-slate-950 px-2.5 py-0.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-amber-400">
                    {s.id}
                  </span>

                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      s.status === 'active'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30'
                        : 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300 border border-red-500/30'
                    }`}
                  >
                    {s.status === 'active' ? 'فعال' : 'منسوخ'}
                  </span>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                    {s.createdAt}
                  </span>
                </div>

                <div className="text-xs font-bold text-slate-900 dark:text-white pt-1">
                  سائل: {s.userName} <span className="text-slate-500 font-normal">(والدہ: {s.motherName})</span>
                </div>

                <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-3 flex-wrap">
                  <span>شاخ: <strong>{s.branchName} ({s.branchCode})</strong></span>
                  <span>عدد: <strong className="text-emerald-600 dark:text-emerald-400">{s.finalAdad ?? s.sadqaAdad ?? 0}</strong></span>
                  <span>مزاج: {s.mizaj}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSlip(s);
                  }}
                  className="bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
                >
                  <Eye size={14} />
                  <span>تفصیل دیکھیں</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Slip Detailed Modal View */}
      {selectedSlip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-5 text-right space-y-4 shadow-2xl my-auto animate-scaleUp">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <h3 className="font-serif font-bold text-sm text-slate-900 dark:text-white">
                    حلقۂ عثمانیہ - تصدیق شدہ روحانی سلیپ
                  </h3>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-mono mt-0.5">
                  رقمِ سند: {selectedSlip.id}
                </p>
              </div>

              <button
                onClick={() => setSelectedSlip(null)}
                className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Printable Slip Card Content */}
            <div className="bg-amber-50/40 dark:bg-slate-950 p-4 rounded-2xl border-2 border-amber-500/40 space-y-3.5 relative overflow-hidden">
              
              <div className="text-center border-b border-amber-200 dark:border-slate-800 pb-3">
                <h2 className="font-serif font-bold text-base text-emerald-900 dark:text-emerald-400">
                  حلقۂ عثمانیہ (Halqa-e-Usmania)
                </h2>
                <p className="text-[10px] text-amber-800 dark:text-amber-300 font-bold">
                  روحانی آستانہ و شعبہٴ علمی تحقیق
                </p>
                <p className="text-[9px] text-slate-500 font-mono mt-0.5">
                  شاخ: {selectedSlip.branchName} ({selectedSlip.branchCode})
                </p>
              </div>

              {/* User Metadata Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="text-[9px] text-slate-400 block">سائل کا نام:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlip.userName}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">والدہ کا نام:</span>
                  <strong className="text-slate-900 dark:text-white">{selectedSlip.motherName}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">کل ابجد عدد:</span>
                  <strong className="text-amber-600 font-mono">{selectedSlip.totalAdad}</strong>
                </div>
                <div>
                  <span className="text-[9px] text-slate-400 block">فائنل عدد / مزاج:</span>
                  <strong className="text-emerald-600 font-mono">{selectedSlip.finalAdad ?? selectedSlip.sadqaAdad ?? 0} ({selectedSlip.mizaj})</strong>
                </div>
              </div>

              {/* Tashkhees List */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">روحانی تشخیص:</span>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                  {selectedSlip.tashkhees.map((t, i) => (
                    <p key={i} className="text-slate-800 dark:text-slate-200">• {t}</p>
                  ))}
                </div>
              </div>

              {/* Prescribed Wazifa */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300">تجویز کردہ وظیفہ:</span>
                <div className="bg-amber-100/60 dark:bg-amber-950/60 p-3 rounded-xl border border-amber-300/60 text-xs font-serif text-amber-950 dark:text-amber-200 leading-relaxed">
                  <p className="font-bold text-sm">{selectedSlip.wazifa}</p>
                  <p className="text-[10px] font-sans text-slate-600 dark:text-slate-400 mt-1">
                    مدت: <strong>{selectedSlip.duration}</strong>
                  </p>
                </div>
              </div>

              {/* Sadqa */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">مستحب صدقہ:</span>
                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200">
                  {selectedSlip.sadqa.join(', ')}
                </div>
              </div>

              {selectedSlip.status === 'cancelled' && (
                <div className="bg-red-100 dark:bg-red-950 p-2.5 rounded-xl border border-red-300 text-xs text-red-800 dark:text-red-200">
                  <strong>یہ سلیپ منسوخ کر دی گئی ہے۔</strong>
                  {selectedSlip.cancellationReason && (
                    <p className="text-[10px] mt-0.5">سبب: {selectedSlip.cancellationReason}</p>
                  )}
                </div>
              )}

              {/* Operator Sign Off */}
              <div className="pt-2 flex justify-between items-center text-[9px] text-slate-400 border-t border-slate-200 dark:border-slate-800">
                <span>محرر: {selectedSlip.operatorName || 'حلقہ عثمانیہ'}</span>
                <span className="font-mono">{selectedSlip.createdAt}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => handleCopyId(selectedSlip.id)}
                className="flex-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Copy size={14} />
                <span>{copiedId ? 'کاپی ہو گیا!' : 'سند نمبر کاپی'}</span>
              </button>

              <button
                onClick={() => handleShareWhatsApp(selectedSlip)}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send size={14} />
                <span>واٹس ایپ شیئر</span>
              </button>

              <button
                onClick={() => window.print()}
                className="bg-emerald-800 hover:bg-emerald-700 text-white py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} />
                <span>پرنٹ</span>
              </button>
            </div>

            {/* Cancel Button for Admin/Operator */}
            {onCancelSlip && selectedSlip.status === 'active' && !isRegularUser && (
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
                {!showCancelModal ? (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle size={14} />
                    <span>سلیپ منسوخ کریں (Cancel Slip)</span>
                  </button>
                ) : (
                  <div className="space-y-2 bg-red-50 dark:bg-red-950/30 p-3 rounded-xl border border-red-300 text-xs">
                    <label className="font-bold text-red-800 dark:text-red-300 block">
                      منسوخی کی وجہ درج کریں:
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثلاً: غلط نام یا غلط اندراج"
                      value={cancelReasonInput}
                      onChange={(e) => setCancelReasonInput(e.target.value)}
                      className="w-full bg-white dark:bg-slate-900 border border-red-300 text-xs rounded-lg p-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleConfirmCancel}
                        disabled={!cancelReasonInput.trim()}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        منسوخی کی تصدیق کریں
                      </button>
                      <button
                        onClick={() => setShowCancelModal(false)}
                        className="bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white px-3 py-1.5 rounded-lg text-xs"
                      >
                        منسوخ کریں
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
