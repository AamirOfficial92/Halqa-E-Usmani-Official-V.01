/**
 * Audit Log Viewer & Compliance Ledger
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { AuditLog, Branch } from '../../types';
import { 
  ShieldCheck, 
  Search, 
  Download, 
  Laptop, 
  Clock, 
  UserCheck, 
  Lock, 
  AlertTriangle,
  FileCheck,
  Building2,
  Filter
} from 'lucide-react';

interface AuditLogViewerProps {
  auditLogs: AuditLog[];
  branches: Branch[];
}

export const AuditLogViewer: React.FC<AuditLogViewerProps> = ({
  auditLogs,
  branches
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');

  const exportCsv = () => {
    const headers = ['Log ID', 'Timestamp', 'Action', 'Performed By', 'Role', 'Branch', 'Details', 'Device Info'];
    const rows = filteredLogs.map((l) => [
      l.id,
      new Date(l.timestamp).toLocaleString(),
      l.action,
      `"${l.performedBy}"`,
      l.role || '',
      l.branchCode || '',
      `"${l.details.replace(/"/g, '""')}"`,
      `"${(l.deviceInfo || 'Browser/Mobile Client').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Audit_Log_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLogs = auditLogs.filter((l) => {
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (branchFilter !== 'ALL' && l.branchCode !== branchFilter) return false;
    if (!searchTerm.trim()) return true;

    const q = searchTerm.toLowerCase();
    return (
      l.id.toLowerCase().includes(q) ||
      l.action.toLowerCase().includes(q) ||
      l.performedBy.toLowerCase().includes(q) ||
      l.details.toLowerCase().includes(q) ||
      (l.branchCode && l.branchCode.toLowerCase().includes(q))
    );
  });

  const getActionBadgeClass = (action: string) => {
    if (action.includes('BLOCKED') || action.includes('REJECTED')) {
      return 'bg-red-950 text-red-300 border-red-800';
    }
    if (action.includes('LOGIN') || action.includes('APPROVED')) {
      return 'bg-emerald-950 text-emerald-300 border-emerald-800';
    }
    if (action.includes('SLIP')) {
      return 'bg-amber-950 text-amber-300 border-amber-800';
    }
    if (action.includes('BACKUP')) {
      return 'bg-blue-950 text-blue-300 border-blue-800';
    }
    return 'bg-slate-800 text-slate-300 border-slate-700';
  };

  const totalLogs = auditLogs.length;
  const loginLogs = auditLogs.filter((l) => l.action.includes('LOGIN')).length;
  const blockedLogs = auditLogs.filter((l) => l.action.includes('BLOCKED') || l.action.includes('REJECTED')).length;
  const slipLogs = auditLogs.filter((l) => l.action.includes('SLIP')).length;

  return (
    <div className="space-y-4 text-left" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white tracking-wide">System Audit & Compliance Log</h2>
            <p className="text-[11px] text-slate-400">
              Immutable record of all login attempts, approval actions, slip creations, and system modifications
            </p>
          </div>
        </div>

        <button
          onClick={exportCsv}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
        >
          <Download size={16} />
          <span>Export Audit CSV</span>
        </button>
      </div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Total Audit Records</div>
          <div className="text-lg font-mono font-bold text-white mt-1">{totalLogs}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Login Events</div>
          <div className="text-lg font-mono font-bold text-emerald-400 mt-1">{loginLogs}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Blocked / Security Alerts</div>
          <div className="text-lg font-mono font-bold text-red-400 mt-1">{blockedLogs}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl">
          <div className="text-[10px] font-bold text-slate-400 uppercase">Slip Actions</div>
          <div className="text-lg font-mono font-bold text-amber-400 mt-1">{slipLogs}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search details, user, action..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 pl-8 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500 pointer-events-none" />
          </div>

          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="LOGIN">LOGIN</option>
            <option value="LOGIN_ATTEMPT">LOGIN_ATTEMPT</option>
            <option value="LOGIN_BLOCKED">LOGIN_BLOCKED</option>
            <option value="USER_APPROVED">USER_APPROVED</option>
            <option value="USER_REJECTED">USER_REJECTED</option>
            <option value="USER_BLOCKED">USER_BLOCKED</option>
            <option value="SLIP_CREATED">SLIP_CREATED</option>
            <option value="SLIP_CANCELLED">SLIP_CANCELLED</option>
            <option value="BRANCH_CREATED">BRANCH_CREATED</option>
            <option value="DATASET_UPDATED">DATASET_UPDATED</option>
            <option value="BACKUP_CREATED">BACKUP_CREATED</option>
            <option value="BACKUP_RESTORED">BACKUP_RESTORED</option>
          </select>

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
        </div>
      </div>

      {/* Log Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 border-b border-slate-800 uppercase font-mono text-[10px] text-slate-400 tracking-wider">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Performed By</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Device / Client</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    No audit records match the current filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-500" />
                        <span>{new Date(l.timestamp).toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${getActionBadgeClass(l.action)}`}>
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                      {l.performedBy}
                      {l.role && (
                        <div className="text-[10px] font-normal text-amber-400 font-mono">
                          {l.role}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 whitespace-nowrap">
                      {l.branchCode || 'SYSTEM'}
                    </td>
                    <td className="py-3 px-4 text-slate-200">
                      {l.details}
                    </td>
                    <td className="py-3 px-4 text-[10px] font-mono text-slate-400 max-w-xs truncate">
                      <div className="flex items-center gap-1">
                        <Laptop size={12} className="text-slate-500 shrink-0" />
                        <span className="truncate">{l.deviceInfo || 'Web App Client / Cloud'}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
