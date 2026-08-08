/**
 * Backup & Disaster Recovery Manager
 * Halqa-e-Usmania Admin Panel
 */

import React, { useState } from 'react';
import { SystemBackupData, Branch, DayDatasetRecord, AppUser, SpiritualSlip, AuditLog, ModSettings } from '../../types';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw, 
  ShieldAlert, 
  CheckCircle2, 
  FileText, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';

interface BackupRestoreManagerProps {
  branches: Branch[];
  dayDatasets: DayDatasetRecord[];
  appUsers: AppUser[];
  slips: SpiritualSlip[];
  auditLogs: AuditLog[];
  modSettings: ModSettings;
  onRestoreBackup: (backup: SystemBackupData) => void;
}

export const BackupRestoreManager: React.FC<BackupRestoreManagerProps> = ({
  branches,
  dayDatasets,
  appUsers,
  slips,
  auditLogs,
  modSettings,
  onRestoreBackup
}) => {
  const [restoreJson, setRestoreJson] = useState('');
  const [restorePreview, setRestorePreview] = useState<SystemBackupData | null>(null);
  const [restoreError, setRestoreError] = useState('');
  const [restoreSuccess, setRestoreSuccess] = useState(false);

  const exportFullBackup = () => {
    const backup: SystemBackupData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0-HU-KHANQAH',
      branches,
      dayDatasets,
      appUsers,
      slips,
      auditLogs,
      modSettings
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Halqa_Usmania_Full_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setRestoreJson(content);
      parseAndPreview(content);
    };
    reader.readAsText(file);
  };

  const parseAndPreview = (jsonStr: string) => {
    setRestoreError('');
    setRestoreSuccess(false);
    try {
      const parsed = JSON.parse(jsonStr) as SystemBackupData;
      if (!parsed.branches || !parsed.dayDatasets || !parsed.appUsers || !parsed.slips) {
        throw new Error('Invalid backup schema: missing core collections (branches, dayDatasets, appUsers, slips).');
      }
      setRestorePreview(parsed);
    } catch (err: any) {
      setRestoreError(err.message || 'Failed to parse JSON backup file.');
      setRestorePreview(null);
    }
  };

  const confirmRestore = () => {
    if (!restorePreview) return;
    onRestoreBackup(restorePreview);
    setRestoreSuccess(true);
    setRestorePreview(null);
    setRestoreJson('');
  };

  return (
    <div className="space-y-4 text-left max-w-2xl mx-auto" dir="ltr">

      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
        <div className="p-3 bg-emerald-950 text-emerald-400 rounded-xl border border-emerald-800">
          <Database size={22} />
        </div>
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">Database Backup & Disaster Recovery</h2>
          <p className="text-[11px] text-slate-400">
            Export complete system snapshots and restore records safely
          </p>
        </div>
      </div>

      {/* Current Database Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <HardDrive size={16} className="text-amber-400" />
          <span>Current System State</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Branches</span>
            <strong className="text-white text-sm">{branches.length}</strong>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Day Records</span>
            <strong className="text-amber-400 text-sm">{dayDatasets.length}</strong>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Registered Users</span>
            <strong className="text-emerald-400 text-sm">{appUsers.length}</strong>
          </div>
          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
            <span className="text-slate-400 block text-[10px]">Generated Slips</span>
            <strong className="text-blue-400 text-sm">{slips.length}</strong>
          </div>
        </div>

        <button
          onClick={exportFullBackup}
          className="w-full bg-emerald-800 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <Download size={16} />
          <span>Export Full System JSON Backup</span>
        </button>
      </div>

      {/* Restore Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} className="text-emerald-400" />
          <span>Restore System From Snapshot</span>
        </h3>

        {restoreSuccess && (
          <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-300 rounded-xl p-3 text-xs flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>System backup restored successfully! All collections updated.</span>
          </div>
        )}

        {restoreError && (
          <div className="bg-red-950/60 border border-red-800 text-red-300 rounded-xl p-3 text-xs flex items-center gap-2">
            <AlertTriangle size={16} />
            <span>{restoreError}</span>
          </div>
        )}

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Upload JSON Backup File:
          </label>
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-950 file:text-emerald-400 cursor-pointer"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
            Or Paste Backup JSON Data:
          </label>
          <textarea
            rows={4}
            placeholder='{"exportDate": "...", "branches": [...]}'
            value={restoreJson}
            onChange={(e) => {
              setRestoreJson(e.target.value);
              if (e.target.value.trim()) parseAndPreview(e.target.value);
            }}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Restore Preview */}
        {restorePreview && (
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs space-y-2">
            <div className="text-amber-300 font-bold flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Snapshot Validated: Exported {new Date(restorePreview.exportDate).toLocaleString()}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-slate-300">
              <div>Branches: {restorePreview.branches?.length || 0}</div>
              <div>Day Sets: {restorePreview.dayDatasets?.length || 0}</div>
              <div>Users: {restorePreview.appUsers?.length || 0}</div>
              <div>Slips: {restorePreview.slips?.length || 0}</div>
            </div>

            <div className="bg-amber-950/40 border border-amber-800/60 rounded-lg p-2.5 text-[11px] text-amber-200 flex items-start gap-2">
              <ShieldAlert size={16} className="shrink-0 text-amber-400" />
              <span>Warning: Restoring will overwrite current system collections with data from this snapshot.</span>
            </div>

            <button
              onClick={confirmRestore}
              className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-2 rounded-xl text-xs shadow transition-all cursor-pointer"
            >
              Confirm System Data Restore
            </button>
          </div>
        )}
      </div>

    </div>
  );
};
