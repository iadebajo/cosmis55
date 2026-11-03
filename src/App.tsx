import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { LogoUploader } from './components/LogoUploader';
import { ProductPicker } from './components/ProductPicker';
import { ProductSvgRenderer } from './components/ProductSvgRenders';
import { AiMockupStudio } from './components/AiMockupStudio';
import { ProductConfig, LogoSettings, ProductId, ImageResolution } from './types';
import { PRODUCT_TEMPLATES } from './data/mockupTemplates';
import { SAMPLE_LOGOS } from './data/sampleLogos';
import { removeLightBackground, recolorImage, downloadImage } from './utils/imageUtils';
import { 
  Move, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Sparkles, 
  Check, 
  Download,
  Info,
  Maximize2,
  Undo2,
  Redo2,
  Keyboard
} from 'lucide-react';

interface HistorySnapshot {
  logo: LogoSettings;
  product: ProductConfig;
  label?: string;
}

export default function App() {
  // Product state: starts with 'mug'
  const [product, setProduct] = useState<ProductConfig>({
    id: 'mug',
    name: 'Ceramic Coffee Mug (11oz)',
    category: 'Drinkware',
    color: '#ffffff',
    handleSide: 'right',
    placementPreset: 'chest',
    lighting: 'studio',
    backdrop: 'studio',
  });

  // Logo state: starts with Apex Roasters or PK XD Cosmic Kitty
  const defaultLogoSample = SAMPLE_LOGOS[0];
  const [logo, setLogo] = useState<LogoSettings>({
    imageUrl: defaultLogoSample.svgDataUri,
    name: defaultLogoSample.name,
    x: 0,
    y: 0,
    scale: 1.0,
    rotation: 0,
    opacity: 1.0,
    colorMode: 'original',
    customColor: '#ffffff',
    blendMode: 'normal',
    finish: 'screenprint',
    removeWhiteBg: false,
    whiteThreshold: 235,
  });

  // Processed logo URL (after background removal or recolor)
  const [processedLogoUrl, setProcessedLogoUrl] = useState<string>(logo.imageUrl);
  
  // App UI state
  const [activeMode, setActiveMode] = useState<'canvas' | 'ai'>('canvas');
  const [canvasZoom, setCanvasZoom] = useState<number>(1.0);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Undo / Redo History Stacks
  const undoStackRef = useRef<HistorySnapshot[]>([]);
  const redoStackRef = useRef<HistorySnapshot[]>([]);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const isNudgingRef = useRef(false);
  const nudgeDebounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Track latest state for keyboard handlers and history
  const latestStateRef = useRef({ logo, product, canvasZoom });
  useEffect(() => {
    latestStateRef.current = { logo, product, canvasZoom };
  }, [logo, product, canvasZoom]);

  const showToast = useCallback((msg: string) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 1800);
  }, []);

  // Save current state into undo stack before mutating
  const pushHistory = useCallback((label: string = 'Change') => {
    const snapshot: HistorySnapshot = {
      logo: { ...latestStateRef.current.logo },
      product: { ...latestStateRef.current.product },
      label,
    };
    undoStackRef.current.push(snapshot);
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
    // Clear redo stack on new action
    redoStackRef.current = [];
    setCanUndo(true);
    setCanRedo(false);
  }, []);

  // Undo action
  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0) {
      showToast('Nothing to undo');
      return;
    }
    const previous = undoStackRef.current.pop();
    if (!previous) return;

    // Push current to redo
    redoStackRef.current.push({
      logo: { ...latestStateRef.current.logo },
      product: { ...latestStateRef.current.product },
      label: previous.label || 'Action',
    });

    setLogo(previous.logo);
    setProduct(previous.product);
    setCanUndo(undoStackRef.current.length > 0);
    setCanRedo(true);
    showToast(`Undo: ${previous.label || 'action'}`);
  }, [showToast]);

  // Redo action
  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0) return;
    const next = redoStackRef.current.pop();
    if (!next) return;

    undoStackRef.current.push({
      logo: { ...latestStateRef.current.logo },
      product: { ...latestStateRef.current.product },
      label: next.label || 'Action',
    });

    setLogo(next.logo);
    setProduct(next.product);
    setCanUndo(true);
    setCanRedo(redoStackRef.current.length > 0);
    showToast(`Redo: ${next.label || 'action'}`);
  }, [showToast]);

  // Nudge logo by dx, dy
  const nudgeLogo = useCallback((dx: number, dy: number, isShift: boolean) => {
    const step = isShift ? 5 : 1;
    // Record history snapshot before the burst of nudges begins
    if (!isNudgingRef.current) {
      pushHistory('Nudge logo');
      isNudgingRef.current = true;
    }

    if (nudgeDebounceTimer.current) {
      clearTimeout(nudgeDebounceTimer.current);
    }
    nudgeDebounceTimer.current = setTimeout(() => {
      isNudgingRef.current = false;
    }, 600);

    setLogo((prev) => {
      const newX = Math.min(100, Math.max(-100, prev.x + dx * step));
      const newY = Math.min(100, Math.max(-100, prev.y + dy * step));
      return {
        ...prev,
        x: newX,
        y: newY,
      };
    });
  }, [pushHistory]);

  // Zoom controls
  const zoomIn = useCallback(() => {
    setCanvasZoom((z) => {
      const next = Math.min(2.0, +(z + 0.1).toFixed(2));
      showToast(`Zoom: ${Math.round(next * 100)}%`);
      return next;
    });
  }, [showToast]);

  const zoomOut = useCallback(() => {
    setCanvasZoom((z) => {
      const next = Math.max(0.5, +(z - 0.1).toFixed(2));
      showToast(`Zoom: ${Math.round(next * 100)}%`);
      return next;
    });
  }, [showToast]);

  // Global Keyboard Event Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if target is an editable form element
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          tagName === 'select' ||
          target.isContentEditable
        ) {
          return; // Let standard text typing/navigation handle it
        }
      }

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;

      // 1. Undo: Ctrl+Z / Cmd+Z (without shift)
      if (isCtrlOrMeta && (e.key === 'z' || e.key === 'Z') && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        (isCtrlOrMeta && (e.key === 'y' || e.key === 'Y')) ||
        (isCtrlOrMeta && (e.key === 'z' || e.key === 'Z') && e.shiftKey)
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // 2. Zoom Controls: '+' (or '=') and '-' (or '_')
      if (e.key === '+' || e.key === '=' || e.code === 'NumpadAdd') {
        e.preventDefault();
        zoomIn();
        return;
      }

      if (e.key === '-' || e.key === '_' || e.code === 'NumpadSubtract') {
        e.preventDefault();
        zoomOut();
        return;
      }

      // 3. Arrow Keys to Nudge the Logo
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        nudgeLogo(0, -1, e.shiftKey);
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        nudgeLogo(0, 1, e.shiftKey);
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        nudgeLogo(-1, 0, e.shiftKey);
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nudgeLogo(1, 0, e.shiftKey);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo, nudgeLogo, zoomIn, zoomOut]);

  const dragStartPos = useRef<{ x: number; y: number; initialLogoX: number; initialLogoY: number }>({
    x: 0,
    y: 0,
    initialLogoX: 0,
    initialLogoY: 0,
  });

  // Process logo image when filters, threshold, or color treatment changes
  useEffect(() => {
    let isCancelled = false;

    async function processLogo() {
      if (!logo.imageUrl) {
        setProcessedLogoUrl('');
        return;
      }

      let current = logo.imageUrl;

      // 1. White Background Removal
      if (logo.removeWhiteBg) {
        try {
          current = await removeLightBackground(current, logo.whiteThreshold);
        } catch (e) {
          console.warn('Background removal failed:', e);
        }
      }

      // 2. Monochrome / Color Treatment
      if (logo.colorMode === 'white') {
        current = await recolorImage(current, '#ffffff');
      } else if (logo.colorMode === 'black') {
        current = await recolorImage(current, '#18181b');
      } else if (logo.colorMode === 'gold') {
        current = await recolorImage(current, '#d4af37');
      }

      if (!isCancelled) {
        setProcessedLogoUrl(current);
      }
    }

    processLogo();

    return () => {
      isCancelled = true;
    };
  }, [logo.imageUrl, logo.removeWhiteBg, logo.whiteThreshold, logo.colorMode]);

  // Handle product selection with history tracking
  const handleSelectProduct = (id: ProductId) => {
    const tmpl = PRODUCT_TEMPLATES.find((t) => t.id === id);
    if (!tmpl) return;

    pushHistory(`Switch to ${tmpl.name.split(' (')[0]}`);
    setProduct((prev) => ({
      ...prev,
      id: tmpl.id,
      name: tmpl.name,
      category: tmpl.category,
      color: tmpl.defaultColor,
    }));
  };

  // Change product config with history tracking
  const handleChangeProduct = (updated: Partial<ProductConfig>) => {
    pushHistory('Product settings');
    setProduct((prev) => ({ ...prev, ...updated }));
  };

  // Change logo with history tracking
  const handleChangeLogo = (updated: Partial<LogoSettings>) => {
    // Only push history for discrete settings changes
    if (updated.imageUrl || updated.colorMode || updated.finish || updated.blendMode) {
      pushHistory('Logo settings');
    }
    setLogo((prev) => ({ ...prev, ...updated }));
  };

  // Reset logo position & scale with history tracking
  const handleResetTransforms = () => {
    pushHistory('Reset transforms');
    setLogo((prev) => ({
      ...prev,
      x: 0,
      y: 0,
      scale: 1.0,
      rotation: 0,
      opacity: 1.0,
    }));
    showToast('Transforms reset (Ctrl+Z to undo)');
  };

  // Direct canvas drag interaction
  const handleLogoMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    pushHistory('Move logo');
    setIsDraggingLogo(true);
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      initialLogoX: logo.x,
      initialLogoY: logo.y,
    };
  };

  const handleLogoTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    const touch = e.touches[0];
    pushHistory('Move logo');
    setIsDraggingLogo(true);
    dragStartPos.current = {
      x: touch.clientX,
      y: touch.clientY,
      initialLogoX: logo.x,
      initialLogoY: logo.y,
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingLogo) return;
      const deltaX = (e.clientX - dragStartPos.current.x) / (canvasZoom * 2.5);
      const deltaY = (e.clientY - dragStartPos.current.y) / (canvasZoom * 2.5);

      setLogo((prev) => ({
        ...prev,
        x: Math.min(100, Math.max(-100, Math.round(dragStartPos.current.initialLogoX + deltaX))),
        y: Math.min(100, Math.max(-100, Math.round(dragStartPos.current.initialLogoY + deltaY))),
      }));
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingLogo || e.touches.length !== 1) return;
      const touch = e.touches[0];
      const deltaX = (touch.clientX - dragStartPos.current.x) / (canvasZoom * 2.5);
      const deltaY = (touch.clientY - dragStartPos.current.y) / (canvasZoom * 2.5);

      setLogo((prev) => ({
        ...prev,
        x: Math.min(100, Math.max(-100, Math.round(dragStartPos.current.initialLogoX + deltaX))),
        y: Math.min(100, Math.max(-100, Math.round(dragStartPos.current.initialLogoY + deltaY))),
      }));
    };

    const handleMouseUp = () => {
      if (isDraggingLogo) {
        setIsDraggingLogo(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingLogo, canvasZoom]);

  // Capture canvas to Data URL (high resolution support for 1K, 2K, 4K)
  const getCanvasDataUrl = useCallback(
    async (scaleFactor: number = 1.0): Promise<string> => {
      return new Promise((resolve, reject) => {
        const svgElement = document.getElementById('mockup-canvas-svg');
        if (!svgElement) {
          reject(new Error('SVG element not found'));
          return;
        }

        // Clone SVG and set explicit width, height and namespaces
        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
        clonedSvg.setAttribute('width', '1000');
        clonedSvg.setAttribute('height', '1000');
        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

        const svgData = new XMLSerializer().serializeToString(clonedSvg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL || window.webkitURL || window;
        const blobUrl = URL.createObjectURL(svgBlob);

        const targetDimension = Math.round(1000 * scaleFactor);

        const renderToCanvas = (loadedImg: HTMLImageElement) => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = targetDimension;
            canvas.height = targetDimension;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context not available'));
              return;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(loadedImg, 0, 0, targetDimension, targetDimension);
            resolve(canvas.toDataURL('image/png', 0.95));
          } catch (err) {
            reject(err);
          }
        };

        const img = new Image();
        img.onload = () => {
          URL.revokeObjectURL(blobUrl);
          renderToCanvas(img);
        };

        img.onerror = () => {
          URL.revokeObjectURL(blobUrl);
          // Fallback to base64 data URI
          const base64Url = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
          const img2 = new Image();
          img2.onload = () => renderToCanvas(img2);
          img2.onerror = () => reject(new Error('Failed to render SVG onto canvas'));
          img2.src = base64Url;
        };

        img.src = blobUrl;
      });
    },
    []
  );

  // High-res export download
  const handleDownloadHighRes = async (resolution: ImageResolution) => {
    const scaleMap: Record<ImageResolution, number> = {
      '1K': 1.0,
      '2K': 2.0,
      '4K': 4.0,
    };
    try {
      const dataUrl = await getCanvasDataUrl(scaleMap[resolution]);
      downloadImage(dataUrl, `${product.id}-mockup-${resolution.toLowerCase()}.png`);
      showToast(`Exported ${resolution} mockup!`);
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* 1. TOP NAVBAR */}
      <Navbar
        currentProductId={product.id}
        onSelectProduct={handleSelectProduct}
        activeMode={activeMode}
        onToggleMode={setActiveMode}
        onDownloadHighRes={handleDownloadHighRes}
      />

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* LEFT COLUMN: Logo Uploader, Presets & Transforms */}
        <aside className="w-full md:w-80 lg:w-96 shrink-0 h-1/3 md:h-full z-10 shadow-xl border-b md:border-b-0 border-slate-800">
          <LogoUploader
            logo={logo}
            onChangeLogo={handleChangeLogo}
            onResetTransforms={handleResetTransforms}
          />
        </aside>

        {/* CENTER COLUMN: Real-Time Interactive Viewport */}
        <section className="flex-1 flex flex-col h-full bg-slate-950 relative overflow-hidden select-none">
          {/* Viewport Top Bar */}
          <div className="h-10 px-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{product.name}</span>
              <span className="text-[11px] text-slate-500">•</span>
              <span className="text-[11px] text-indigo-400 capitalize">{product.lighting} Lighting</span>
            </div>

            {/* Middle: Keyboard Shortcuts Hint Badges */}
            <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                <Keyboard className="w-3 h-3 text-indigo-400" />
                <kbd className="font-mono text-slate-300">Arrows</kbd> nudge
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                <kbd className="font-mono text-slate-300">+/-</kbd> zoom
              </span>
              <span className="flex items-center gap-1 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60">
                <kbd className="font-mono text-slate-300">Ctrl+Z</kbd> undo
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Undo / Redo Buttons */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={handleUndo}
                  disabled={!canUndo}
                  className="p-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleRedo}
                  disabled={!canRedo}
                  className="p-1 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
                  title="Redo (Ctrl+Y)"
                >
                  <Redo2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Zoom Buttons */}
              <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                <button
                  onClick={zoomOut}
                  className="p-1 hover:text-white"
                  title="Zoom Out (-)"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="px-1.5 text-[10px] font-mono font-bold text-slate-300">
                  {Math.round(canvasZoom * 100)}%
                </span>
                <button
                  onClick={zoomIn}
                  className="p-1 hover:text-white"
                  title="Zoom In (+)"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Display Area */}
          <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden bg-dot-pattern">
            {/* Transient Toast Notification */}
            {toastMessage && (
              <div className="absolute top-4 z-20 px-3.5 py-1.5 bg-slate-900/95 border border-indigo-500/60 text-white text-xs font-semibold rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                <span>{toastMessage}</span>
              </div>
            )}

            <div
              style={{
                transform: `scale(${canvasZoom})`,
                transition: isDraggingLogo ? 'none' : 'transform 0.15s ease-out',
              }}
              className={`w-full max-w-[560px] aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-800/80 relative flex items-center justify-center transition-colors ${
                product.backdrop === 'transparent' ? 'bg-checker-pattern' : 'bg-slate-900/40'
              }`}
            >
              <ProductSvgRenderer
                product={product}
                logo={logo}
                processedLogoUrl={processedLogoUrl}
                isDraggingLogo={isDraggingLogo}
                onLogoMouseDown={handleLogoMouseDown}
                onLogoTouchStart={handleLogoTouchStart}
              />

              {/* Helper tag when hovering logo or nudging */}
              {isDraggingLogo && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600/90 backdrop-blur-md text-white text-[11px] font-bold rounded-full shadow-lg pointer-events-none flex items-center gap-1.5 animate-pulse">
                  <Move className="w-3.5 h-3.5" />
                  <span>X: {logo.x}px | Y: {logo.y}px</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Product Color Strip & Shortcut hint at bottom */}
          <div className="h-14 px-4 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="text-xs font-semibold text-slate-400 shrink-0">Colors:</span>
              {PRODUCT_TEMPLATES.find((t) => t.id === product.id)?.colorPalette.map((item) => (
                <button
                  key={item.hex}
                  onClick={() => {
                    pushHistory(`Change color to ${item.name}`);
                    setProduct((prev) => ({ ...prev, color: item.hex }));
                  }}
                  title={item.name}
                  style={{ backgroundColor: item.hex }}
                  className={`w-6 h-6 rounded-full border transition-transform shrink-0 ${
                    product.color.toLowerCase() === item.hex.toLowerCase()
                      ? 'border-indigo-400 scale-125 ring-2 ring-indigo-500/30'
                      : 'border-slate-700 hover:scale-110'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleDownloadHighRes('1K')}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-emerald-400" />
                <span>Save 1K</span>
              </button>

              <button
                onClick={() => handleDownloadHighRes('2K')}
                className="py-1.5 px-3 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm shadow-indigo-600/20 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save 2K</span>
              </button>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN: Mode-dependent Sidebar (Product Configuration or AI Studio) */}
        <aside className="w-full md:w-80 lg:w-96 shrink-0 h-1/3 md:h-full z-10 shadow-xl border-t md:border-t-0 border-slate-800">
          {activeMode === 'canvas' ? (
            <ProductPicker
              product={product}
              onChangeProduct={handleChangeProduct}
            />
          ) : (
            <AiMockupStudio
              product={product}
              logo={logo}
              processedLogoUrl={processedLogoUrl}
              getCanvasDataUrl={getCanvasDataUrl}
            />
          )}
        </aside>
      </main>
    </div>
  );
}
