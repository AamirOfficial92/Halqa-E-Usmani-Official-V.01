import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Download, 
  ExternalLink, 
  Maximize2, 
  Minimize2, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Share2, 
  AlertCircle, 
  RefreshCw, 
  ShieldAlert, 
  WifiOff, 
  FileText, 
  Check, 
  ChevronLeft, 
  ChevronRight,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { GoogleDriveResolver } from '../services/googleDriveResolver';
import { PDFBook, GoogleDriveResolveResult } from '../types';

interface PdfViewerModalProps {
  pdf: PDFBook;
  onClose: () => void;
  isUrdu?: boolean;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  pdf,
  onClose,
  isUrdu = true
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [resolution, setResolution] = useState<GoogleDriveResolveResult | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copied, setCopied] = useState<boolean>(false);
  const [renderEngine, setRenderEngine] = useState<'preview_embed' | 'gdoc_viewer' | 'direct_stream'>('preview_embed');
  const [isOffline, setIsOffline] = useState<boolean>(typeof navigator !== 'undefined' ? !navigator.onLine : false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Monitor Online/Offline Status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Resolve and validate PDF URL on mount or PDF change
  useEffect(() => {
    initPdfResolver();
  }, [pdf.pdfUrl]);

  const initPdfResolver = async () => {
    setLoading(true);
    const res = await GoogleDriveResolver.resolveUrl(pdf.pdfUrl || pdf.originalUrl || '', false);
    setResolution(res);

    // Set default render engine based on provider
    if (res.isGoogleDrive && res.fileId) {
      setRenderEngine('preview_embed');
    } else {
      setRenderEngine('direct_stream');
    }

    // Artificial tiny timer to allow iframe render
    setTimeout(() => {
      setLoading(false);
    }, 800);
  };

  const handleRetry = () => {
    if (renderEngine === 'preview_embed') {
      setRenderEngine('gdoc_viewer');
    } else {
      setRenderEngine('preview_embed');
    }
    initPdfResolver();
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(250, prev + 25));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(50, prev - 25));
  const handleResetZoom = () => setZoomLevel(100);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleShare = async () => {
    const shareUrl = pdf.pdfUrl || pdf.originalUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: pdf.title,
          text: `Read PDF: ${pdf.titleUrdu || pdf.title}`,
          url: shareUrl
        });
        return;
      } catch (e) {
        // Fallback
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  const handleOpenExternal = () => {
    const targetUrl = resolution?.viewUrl || pdf.pdfUrl || pdf.originalUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
  };

  // Determine iframe SRC based on chosen rendering engine
  const getIframeSrc = () => {
    if (!pdf.pdfUrl) return '';

    if (resolution?.isGoogleDrive && resolution.fileId) {
      if (renderEngine === 'gdoc_viewer') {
        const directUrl = resolution.resolvedUrl || pdf.pdfUrl;
        return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(directUrl)}`;
      }
      return resolution.previewUrl || `https://drive.google.com/file/d/${resolution.fileId}/preview`;
    }

    if (renderEngine === 'gdoc_viewer') {
      return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdf.pdfUrl)}`;
    }

    return pdf.pdfUrl;
  };

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-50 bg-slate-950 flex flex-col w-full h-full min-h-screen select-none font-sans"
      dir="ltr"
    >
      {/* Top Header Navigation Toolbar */}
      <div className="bg-slate-900 text-white px-3 sm:px-4 py-2.5 flex items-center justify-between shrink-0 border-b border-slate-800 shadow-xl">
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onClose}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-all shrink-0 border border-slate-700/80 shadow-sm"
            title={isUrdu ? "واپس" : "Back"}
          >
            <ArrowLeft size={18} />
          </button>

          <div className="truncate text-left">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-xs sm:text-sm truncate text-slate-100 font-serif">
                {pdf.titleUrdu || pdf.title}
              </h4>
              {resolution?.isGoogleDrive && (
                <span className="text-[9px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40 px-1.5 py-0.2 rounded font-mono shrink-0">
                  Google Drive
                </span>
              )}
            </div>
            {pdf.author && (
              <p className="text-[10px] text-slate-400 truncate">
                {pdf.authorUrdu || pdf.author}
              </p>
            )}
          </div>
        </div>

        {/* Right: Controls Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Zoom Level Controls */}
          <div className="hidden md:flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-2 py-1">
            <button
              onClick={handleZoomOut}
              className="p-1 hover:text-amber-400 text-slate-300 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={handleResetZoom}
              className="text-[10px] font-mono font-bold text-amber-300 px-1.5 hover:underline"
              title="Reset Zoom"
            >
              {zoomLevel}%
            </button>
            <button
              onClick={handleZoomIn}
              className="p-1 hover:text-amber-400 text-slate-300 transition-colors"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700/60"
            title="Share or Copy Link"
          >
            {copied ? <Check size={16} className="text-emerald-400" /> : <Share2 size={16} />}
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl transition-all border border-slate-700/60 hidden sm:flex"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          {/* Open Direct / External Link */}
          <button
            onClick={handleOpenExternal}
            className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
          >
            <span className="hidden xs:inline">{isUrdu ? "نئی ٹیب" : "Open Browser"}</span>
            <ExternalLink size={14} />
          </button>
        </div>
      </div>

      {/* Main PDF Content Viewer Area */}
      <div className="flex-1 w-full h-full bg-slate-900 relative overflow-auto flex items-center justify-center">
        {/* OFFLINE WARNING STATE */}
        {isOffline ? (
          <div className="max-w-md p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-amber-500/20 text-amber-400 border border-amber-500/40 rounded-full flex items-center justify-center mx-auto">
              <WifiOff size={24} />
            </div>
            <div>
              <h4 className="text-base font-bold text-white font-serif">No Internet Connection</h4>
              <p className="text-xs text-slate-300 mt-1">
                This Google Drive PDF file cannot be loaded while offline. Please reconnect to internet to view.
              </p>
              <p className="text-xs text-amber-300 font-serif mt-2" dir="rtl">
                انٹرنیٹ کنکشن دستیاب نہیں ہے۔ یہ گوگل ڈرائیو فائل آف لائن لوڈ نہیں کی جا سکتی۔
              </p>
            </div>
            <button
              onClick={() => setIsOffline(!navigator.onLine)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 mx-auto"
            >
              <RefreshCw size={14} />
              <span>Retry Connection</span>
            </button>
          </div>
        ) : resolution?.success === false && resolution.errorCode === 'ACCESS_DENIED' ? (
          /* GOOGLE DRIVE ACCESS DENIED STATE */
          <div className="max-w-lg p-6 bg-slate-950 border border-rose-900/80 rounded-2xl text-center space-y-4 shadow-2xl mx-4">
            <div className="w-14 h-14 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <ShieldAlert size={30} />
            </div>
            <div>
              <h4 className="text-lg font-bold text-rose-300 font-serif">Google Drive File Access Denied</h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                The permissions on this Google Drive file are restricted.
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-left font-mono text-xs text-amber-300 space-y-1 mt-3">
                <p className="font-bold text-slate-200">Required Sharing Setting:</p>
                <div>1. Open Google Drive → Share</div>
                <div>2. General Access → <span className="text-emerald-400 font-bold">Anyone with the link</span></div>
                <div>3. Role → <span className="text-emerald-400 font-bold">Viewer</span></div>
              </div>

              {resolution.detailsUrdu && (
                <p className="text-xs text-amber-300 font-serif mt-3" dir="rtl">
                  {resolution.detailsUrdu}
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg transition-all"
              >
                <RefreshCw size={14} />
                <span>Retry Loading</span>
              </button>

              <button
                onClick={handleOpenExternal}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2 border border-slate-700 transition-all"
              >
                <span>Open in Browser</span>
                <ExternalLink size={14} />
              </button>
            </div>
          </div>
        ) : (
          /* STANDARD IFRAME VIEWER WITH SMART FALLBACK ENGINE */
          <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            {loading && (
              <div className="absolute inset-0 z-20 bg-slate-950/90 flex flex-col items-center justify-center text-amber-300 space-y-3">
                <RefreshCw size={32} className="animate-spin text-amber-400" />
                <p className="text-sm font-bold font-serif text-slate-200">
                  {isUrdu ? "پی ڈی ایف لوڈ ہو رہی ہے..." : "Loading PDF Document..."}
                </p>
                <p className="text-xs text-slate-400">Optimizing Google Drive file renderer...</p>
              </div>
            )}

            <div 
              className="w-full h-full transition-transform duration-200 origin-center"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              <iframe
                src={getIframeSrc()}
                title={pdf.title}
                className="w-full h-full border-0 block"
                style={{ width: '100%', height: '100%', minHeight: '100%' }}
                onLoad={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  if (renderEngine === 'preview_embed') {
                    setRenderEngine('gdoc_viewer');
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-slate-900 border-t border-slate-800 text-slate-400 px-4 py-1.5 text-[11px] flex items-center justify-between shrink-0 font-mono">
        <div className="flex items-center gap-2">
          <BookOpen size={13} className="text-amber-400" />
          <span>Pages: {pdf.pages || 1}</span>
          <span className="text-slate-600">|</span>
          <span>Size: {pdf.size || 'PDF'}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-300">
          <span className="hidden sm:inline">Engine: {renderEngine.toUpperCase()}</span>
          <button 
            onClick={handleRetry}
            className="text-amber-400 hover:underline flex items-center gap-1 font-bold"
            title="Switch Render Engine"
          >
            <RefreshCw size={11} />
            <span>Switch Engine</span>
          </button>
        </div>
      </div>
    </div>
  );
};
