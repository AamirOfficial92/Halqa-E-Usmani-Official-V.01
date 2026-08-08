/**
 * Master Slips Audit Ledger & Cancellation Manager
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { SpiritualSlip, Branch } from '../../types';
import { downloadSlipJPEG } from '../../lib/slipCanvasGenerator';
import { 
  FileCheck, 
  Search, 
  XCircle, 
  Printer, 
  Download, 
  Building2, 
  Calendar, 
  Sparkles, 
  ShieldAlert,
  X
} from 'lucide-react';

interface MasterSlipsManagerProps {
  slips: SpiritualSlip[];
  branches: Branch[];
  onCancelSlip: (slipId: string, reason: string) => void;
}

export const MasterSlipsManager: React.FC<MasterSlipsManagerProps> = ({
  slips,
  branches,
  onCancelSlip
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [branchFilter, setBranchFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'valid' | 'cancelled'>('ALL');

  const [cancellingSlip, setCancellingSlip] = useState<SpiritualSlip | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const confirmCancel = () => {
    if (!cancellingSlip || !cancelReason.trim()) return;
    onCancelSlip(cancellingSlip.id, cancelReason.trim());
    setCancellingSlip(null);
    setCancelReason('');
  };

  const exportToCsv = () => {
    const headers = ['Slip ID', 'Branch', 'User Name', 'Mother Name', 'Day', 'Total Adad', 'Status', 'Date'];
    const rows = filteredSlips.map((s) => [
      s.slipId,
      s.branchCode,
      `"${s.userName}"`,
      `"${s.motherName}"`,
      s.calculationDay,
      s.totalAdad,
      s.status,
      new Date(s.timestamp).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Halqa_Usmania_Slips_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSlips = slips.filter((s) => {
    if (branchFilter !== 'ALL' && s.branchCode !== branchFilter) return false;
    if (statusFilter !== 'ALL' && s.status !== statusFilter) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      s.slipId.toLowerCase().includes(q) ||
      s.userName.toLowerCase().includes(q) ||
      s.motherName.toLowerCase().includes(q) ||
      s.calculationDay.toLowerCase().includes(q) ||
      s.branchCode.toLowerCase().includes(q)
    );
  });

  const totalSlips = slips.length;
  const validSlips = slips.filter((s) => s.status === 'valid').length;
  const cancelledSlips = slips.filter((s) => s.status === 'cancelled').length;

  return (
    <div className="space-y-4 text-left" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <FileCheck size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">Master Slips Audit Ledger</h2>
            <p className="text-[11px] text-slate-400">
              Central record of all generated spiritual guidance slips across all branches
            </p>
          </div>
        </div>

        <button
          onClick={exportToCsv}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Download size={16} />
          <span>Export CSV Ledger</span>
        </button>
      </div>

      {/* Filters & Stats */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search Slip ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
          </div>

          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Branches</option>
            {branches.map((b) => (
              <option key={b.id} value={b.code}>
                {b.code} - {b.name}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="valid">Valid Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>

        <div className="flex gap-3 text-xs font-mono">
          <span className="text-slate-400">Total: <strong className="text-white">{totalSlips}</strong></span>
          <span className="text-emerald-400">Valid: <strong>{validSlips}</strong></span>
          <span className="text-red-400">Cancelled: <strong>{cancelledSlips}</strong></span>
        </div>
      </div>

      {/* Slips Ledger Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase font-mono text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Slip ID</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">User & Mother Name</th>
                <th className="py-3 px-4">Day & Total Adad</th>
                <th className="py-3 px-4">Generated Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredSlips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                    No spiritual slips found.
                  </td>
                </tr>
              ) : (
                filteredSlips.map((s) => (
                  <tr key={s.id} className={`hover:bg-slate-800/50 transition-colors ${s.status === 'cancelled' ? 'opacity-60 bg-red-950/10' : ''}`}>
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {s.slipId || s.id}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400">
                      {s.branchCode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-serif font-bold text-white text-right" dir="rtl">{s.userName}</div>
                      <div className="text-[10px] text-slate-400 text-right" dir="rtl">والدہ: {s.motherName}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="text-amber-300 font-bold">Total: {s.totalAdad ?? 0}</div>
                      <div className="text-[10px] text-slate-400">{(s as any).calculationDay || s.day || 'Monday'}</div>
                    </td>
                    <td className="py-3 px-4 text-[11px] text-slate-400 font-mono">
                      {s.createdAt || ((s as any).timestamp && !isNaN(new Date((s as any).timestamp).getTime()) ? new Date((s as any).timestamp).toLocaleDateString() : 'N/A')}
                    </td>
                    <td className="py-3 px-4">
                      {s.status === 'valid' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          VALID
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-950 text-red-300 border border-red-800" title={s.cancelReason}>
                          CANCELLED
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => downloadSlipJPEG(s)}
                        title="Download JPEG Receipt"
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-300 p-1.5 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Download size={12} />
                        <span>JPEG</span>
                      </button>
                      {s.status === 'valid' && (
                        <button
                          onClick={() => setCancellingSlip(s)}
                          className="bg-red-950 hover:bg-red-900 text-red-300 p-1.5 rounded-lg text-[10px] font-bold shadow transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle size={12} />
                          <span>Cancel</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slip Cancellation Modal */}
      {cancellingSlip && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 text-left space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ShieldAlert className="text-red-400" size={18} />
                <span>Cancel Spiritual Slip</span>
              </h3>
              <button
                onClick={() => setCancellingSlip(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs space-y-1 font-mono">
              <div className="text-amber-400 font-bold">{cancellingSlip.slipId}</div>
              <div className="text-white">{cancellingSlip.userName} (والدہ: {cancellingSlip.motherName})</div>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                Reason for Cancellation: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="e.g. Duplicate entry or name typo requested by operator"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
              />
            </div>

            <button
              onClick={confirmCancel}
              disabled={!cancelReason.trim()}
              className="w-full bg-red-900 hover:bg-red-800 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50 mt-2 cursor-pointer"
            >
              Confirm Slip Cancellation
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
