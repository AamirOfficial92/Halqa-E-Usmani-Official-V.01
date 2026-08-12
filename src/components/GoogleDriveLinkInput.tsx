import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  RefreshCw, 
  ExternalLink, 
  Clipboard, 
  ShieldAlert, 
  Check, 
  Sparkles, 
  FileType,
  Cloud
} from 'lucide-react';
import { GoogleDriveResolver } from '../services/googleDriveResolver';
import { GoogleDriveResolveResult } from '../types';

interface GoogleDriveLinkInputProps {
  value: string;
  onChange: (url: string, metadata?: GoogleDriveResolveResult) => void;
  label?: string;
  placeholder?: string;
  expectedType?: 'pdf' | 'image' | 'audio' | 'video' | 'any';
  required?: boolean;
  className?: string;
}

export const GoogleDriveLinkInput: React.FC<GoogleDriveLinkInputProps> = ({
  value,
  onChange,
  label = 'File URL / Google Drive Link',
  placeholder = 'Paste Google Drive URL or direct HTTPS link...',
  expectedType = 'any',
  required = false,
  className = ''
}) => {
  const [validating, setValidating] = useState<boolean>(false);
  const [result, setResult] = useState<GoogleDriveResolveResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Auto-detect URL format as user types
  useEffect(() => {
    if (!value || !value.trim()) {
      setResult(null);
      return;
    }

    const trimmed = value.trim();

    // Quick initial resolve (synchronous detection + cached resolve)
    GoogleDriveResolver.resolveUrl(trimmed, false).then((res) => {
      setResult(res);
      if (res.success) {
        onChange(trimmed, res);
      }
    });
  }, [value]);

  const handlePaste = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          handleUrlChange(text);
        }
      }
    } catch (e) {
      console.warn('Clipboard read failed', e);
    }
  };

  const handleUrlChange = (newUrl: string) => {
    onChange(newUrl);
  };

  const handleValidateNow = async () => {
    if (!value || !value.trim()) return;

    setValidating(true);
    // Bypass cache to force fresh network check
    const freshResult = await GoogleDriveResolver.resolveUrl(value.trim(), true);
    setResult(freshResult);
    setValidating(false);

    onChange(value.trim(), freshResult);
  };

  const handleOpenInBrowser = () => {
    if (result?.viewUrl || value) {
      window.open(result?.viewUrl || value, '_blank', 'noopener,noreferrer');
    }
  };

  // Status badges
  const isGDrive = GoogleDriveResolver.isGoogleDriveUrl(value);
  const isFolder = GoogleDriveResolver.isFolderUrl(value);
  const fileId = GoogleDriveResolver.extractFileId(value);

  return (
    <div className={`space-y-2 text-left ${className}`}>
      {/* Label & Type Indicator */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 font-serif">
          <Cloud size={14} className="text-emerald-400" />
          <span>{label}</span>
          {required && <span className="text-rose-400 font-bold">*</span>}
        </label>

        {value && value.trim() && (
          <div className="flex items-center gap-1">
            {isFolder ? (
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <FolderAlert size={11} />
                <span>Drive Folder Detected</span>
              </span>
            ) : isGDrive ? (
              <span className="text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles size={11} />
                <span>Google Drive File Detected</span>
              </span>
            ) : (
              <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                <CheckCircle2 size={11} />
                <span>Direct File URL</span>
              </span>
            )}
          </div>
        )}
      </div>

      {/* URL Input Box & Paste Button */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full bg-slate-950 border text-white placeholder-slate-500 text-xs rounded-xl pl-3 pr-28 py-2.5 focus:outline-none transition-all font-mono ${
            result?.success === false
              ? 'border-rose-500/80 focus:border-rose-400'
              : result?.success === true
              ? 'border-emerald-500/80 focus:border-emerald-400'
              : 'border-slate-800 focus:border-amber-500'
          }`}
        />

        <div className="absolute right-1.5 flex items-center gap-1">
          {!value && (
            <button
              type="button"
              onClick={handlePaste}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold rounded-lg flex items-center gap-1 transition-colors border border-slate-700"
              title="Paste from clipboard"
            >
              <Clipboard size={12} className="text-amber-400" />
              <span>Paste</span>
            </button>
          )}

          {value && (
            <button
              type="button"
              onClick={handleValidateNow}
              disabled={validating}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black rounded-lg flex items-center gap-1 transition-all shadow-sm"
            >
              <RefreshCw size={11} className={validating ? 'animate-spin' : ''} />
              <span>{validating ? 'Testing...' : 'Validate'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Validation Result Box */}
      {result && value && value.trim() && (
        <div className="mt-2 text-xs rounded-xl p-3 border transition-all animate-fadeIn">
          {/* SUCCESS CASE */}
          {result.success && (
            <div className="bg-emerald-950/40 border-emerald-800/80 text-emerald-200 p-2.5 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between font-bold text-emerald-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span>✓ File Accessible & Ready</span>
                </div>
                <span className="text-[10px] uppercase font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  {result.provider.replace('_', ' ')}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-emerald-900/60 font-mono text-emerald-200/90">
                <div>
                  <span className="text-slate-400 text-[10px] block">File Type:</span>
                  <span className="font-bold uppercase text-amber-300">{result.fileType || 'PDF'}</span>
                </div>
                {result.fileId && (
                  <div>
                    <span className="text-slate-400 text-[10px] block">Google File ID:</span>
                    <span className="font-bold truncate block">{result.fileId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FOLDER WARNING CASE */}
          {result.isFolder && (
            <div className="bg-amber-950/60 border-amber-800/80 text-amber-200 p-3 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300 text-xs">
                <AlertTriangle size={18} className="text-amber-400 shrink-0" />
                <span>Google Drive Folder Link Detected</span>
              </div>
              <p className="text-[11px] text-amber-200/90 leading-relaxed font-sans">
                {result.message}
              </p>
              {result.detailsUrdu && (
                <p className="text-[11px] text-amber-300 font-serif leading-relaxed text-right" dir="rtl">
                  {result.detailsUrdu}
                </p>
              )}
            </div>
          )}

          {/* ACCESS DENIED CASE */}
          {!result.success && !result.isFolder && result.errorCode === 'ACCESS_DENIED' && (
            <div className="bg-rose-950/60 border-rose-800/90 text-rose-200 p-3.5 rounded-xl space-y-2.5 shadow-lg">
              <div className="flex items-center justify-between border-b border-rose-900/80 pb-2">
                <div className="flex items-center gap-2 font-bold text-rose-300 text-xs">
                  <ShieldAlert size={18} className="text-rose-400 shrink-0 animate-bounce" />
                  <span>Google Drive File Access Denied</span>
                </div>
                <span className="text-[10px] font-mono bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                  HTTP 403 / Restricted
                </span>
              </div>

              <div className="text-xs text-rose-100/90 space-y-1 font-sans">
                <p className="font-bold text-amber-300">Please change the Google Drive file sharing setting to:</p>
                <div className="bg-slate-950/80 border border-rose-900/80 p-2 rounded-lg font-mono text-[11px] text-amber-200 space-y-0.5">
                  <div>1. Open Google Drive → Share</div>
                  <div>2. General Access → <span className="text-emerald-400 font-bold">Anyone with the link</span></div>
                  <div>3. Role → <span className="text-emerald-400 font-bold">Viewer</span></div>
                </div>
              </div>

              {result.detailsUrdu && (
                <p className="text-[11px] text-amber-300 font-serif leading-relaxed text-right pt-1" dir="rtl">
                  {result.detailsUrdu}
                </p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t border-rose-900/80">
                <button
                  type="button"
                  onClick={handleValidateNow}
                  disabled={validating}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all shadow-md"
                >
                  <RefreshCw size={13} className={validating ? 'animate-spin' : ''} />
                  <span>Retry Validation</span>
                </button>

                <button
                  type="button"
                  onClick={handleOpenInBrowser}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 transition-all border border-slate-700"
                >
                  <span>Open in Browser</span>
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          )}

          {/* OTHER ERROR CASES (File not found, Invalid URL, etc.) */}
          {!result.success && !result.isFolder && result.errorCode !== 'ACCESS_DENIED' && (
            <div className="bg-slate-950 border-rose-900/80 text-rose-300 p-3 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-bold text-xs text-rose-400">
                <XCircle size={16} className="shrink-0" />
                <span>{result.message || 'Unable to resolve file URL'}</span>
              </div>
              {result.detailsUrdu && (
                <p className="text-[11px] text-amber-300 font-serif text-right" dir="rtl">
                  {result.detailsUrdu}
                </p>
              )}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleValidateNow}
                  disabled={validating}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg flex items-center gap-1"
                >
                  <RefreshCw size={11} className={validating ? 'animate-spin' : ''} />
                  <span>Retry</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenInBrowser}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-[10px] rounded-lg flex items-center gap-1"
                >
                  <span>Open Link</span>
                  <ExternalLink size={11} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
