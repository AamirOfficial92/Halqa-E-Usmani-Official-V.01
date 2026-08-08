import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X, Image as ImageIcon, Sliders, RefreshCw } from 'lucide-react';

interface ImageCropperModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onCropComplete: (croppedImageBase64: string) => void;
  aspectRatio?: number; // Default 16/9
  title?: string;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation = 0
): Promise<string> {
  try {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const rotRad = (rotation * Math.PI) / 180;

    // calculate bounding box of the rotated image
    const { width: bBoxWidth, height: bBoxHeight } = {
      width: Math.abs(Math.cos(rotRad) * image.width) + Math.abs(Math.sin(rotRad) * image.height),
      height: Math.abs(Math.sin(rotRad) * image.width) + Math.abs(Math.cos(rotRad) * image.height),
    };

    // set canvas size to match the bounding box
    canvas.width = bBoxWidth;
    canvas.height = bBoxHeight;

    // translate canvas context to center for rotation
    ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
    ctx.rotate(rotRad);
    ctx.translate(-image.width / 2, -image.height / 2);

    // draw image
    ctx.drawImage(image, 0, 0);

    const croppedCanvas = document.createElement('canvas');
    const croppedCtx = croppedCanvas.getContext('2d');

    if (!croppedCtx) {
      throw new Error('No cropped 2d context');
    }

    // Target 16:9 HD resolution or exact cropped size
    croppedCanvas.width = pixelCrop.width;
    croppedCanvas.height = pixelCrop.height;

    // Draw cropped region from bounding box canvas onto final cropped canvas
    croppedCtx.drawImage(
      canvas,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return croppedCanvas.toDataURL('image/jpeg', 0.92);
  } catch (e) {
    console.error('Failed to crop image via canvas CORS:', e);
    // If CORS prevents canvas reading, try fetching image as blob first
    try {
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const image = await createImage(objectUrl);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      URL.revokeObjectURL(objectUrl);
      return canvas.toDataURL('image/jpeg', 0.92);
    } catch (fallbackError) {
      throw new Error('Could not crop image due to strict cross-origin restrictions on the remote URL. Try uploading a local image file instead.');
    }
  }
}

export const ImageCropperModal: React.FC<ImageCropperModalProps> = ({
  isOpen,
  imageSrc,
  onClose,
  onCropComplete,
  aspectRatio = 16 / 9,
  title = 'Crop Image (16:9 Standard)'
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const onCropChange = useCallback((newCrop: { x: number; y: number }) => {
    setCrop(newCrop);
  }, []);

  const onZoomChange = useCallback((newZoom: number) => {
    setZoom(newZoom);
  }, []);

  const handleCropComplete = useCallback((_croppedArea: Area, currentCroppedAreaPixels: Area) => {
    setCroppedAreaPixels(currentCroppedAreaPixels);
  }, []);

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const croppedBase64 = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
      onCropComplete(croppedBase64);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
    setErrorMessage(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-950/80 border border-emerald-800 text-emerald-400 rounded-xl">
              <Crop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{title}</h3>
              <p className="text-[11px] text-slate-400">Lock ratio: <span className="font-semibold text-emerald-400">16:9 Widescreen</span> (CMS Standard)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 bg-emerald-950 text-emerald-300 border border-emerald-800/80 rounded-full">
              16 : 9 Locked
            </span>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Error Alert if any */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-950/80 border border-rose-800 rounded-2xl text-xs text-rose-200 flex items-center justify-between">
            <span>{errorMessage}</span>
            <button onClick={() => setErrorMessage(null)} className="text-rose-400 hover:text-white font-bold ml-2">✕</button>
          </div>
        )}

        {/* Cropper Workspace Area with 16:9 Overlay */}
        <div className="relative w-full h-[380px] bg-slate-950 flex-1 overflow-hidden select-none group">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspectRatio}
            showGrid={true}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={handleCropComplete}
            objectFit="contain"
            style={{
              containerStyle: { background: '#020617' },
              cropAreaStyle: {
                border: '2px solid #10b981',
                boxShadow: '0 0 0 9999px rgba(2, 6, 23, 0.82), 0 0 20px rgba(16, 185, 129, 0.35)',
                borderRadius: '8px'
              }
            }}
          />

          {/* Floating Real-time 16:9 Aspect Ratio & Dimensions Badge */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-emerald-500/50 shadow-xl text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-emerald-300">16:9 Overlay Active</span>
            {croppedAreaPixels && (
              <span className="text-slate-300 border-l border-slate-700 pl-2 font-semibold">
                {Math.round(croppedAreaPixels.width)} × {Math.round(croppedAreaPixels.height)} px
              </span>
            )}
          </div>

          {/* Helper visual note at bottom of cropper area */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-full border border-slate-800 text-[10px] text-slate-400 font-medium">
            Drag image or use zoom slider to position within the 16:9 frame
          </div>
        </div>

        {/* Controls Toolbar */}
        <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 space-y-4">
          {/* Sliders and Quick Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Zoom Control */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
              <ZoomOut className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.05}
                aria-label="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <ZoomIn className="w-4 h-4 text-slate-400 shrink-0" />
              <span className="text-xs font-mono font-bold text-emerald-400 min-w-[36px]">
                {zoom.toFixed(1)}x
              </span>
            </div>

            {/* Rotation & Reset Control */}
            <div className="flex items-center justify-between gap-2 bg-slate-950/60 p-2.5 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>Rotate</span>
                </button>
                <span className="text-xs font-mono font-bold text-slate-400">{rotation}°</span>
              </div>

              <button
                type="button"
                onClick={handleReset}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                title="Reset zoom & rotation"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>Output: <strong className="text-slate-200">16:9 Standard Image</strong></span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCrop}
                disabled={isProcessing}
                className="px-5 py-2 bg-emerald-700 hover:bg-emerald-600 active:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg flex items-center gap-2 transition disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Cropping...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Apply 16:9 Crop</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
