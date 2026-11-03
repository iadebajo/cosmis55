import React, { useRef, useState } from 'react';
import { 
  Upload, 
  Sparkles, 
  RotateCw, 
  Maximize2, 
  Sliders, 
  Trash2, 
  Layers, 
  Type, 
  Check, 
  Scissors,
  Palette
} from 'lucide-react';
import { LogoSettings, LogoFinish, LogoBlendMode, LogoColorMode } from '../types';
import { SAMPLE_LOGOS } from '../data/sampleLogos';

interface LogoUploaderProps {
  logo: LogoSettings;
  onChangeLogo: (newSettings: Partial<LogoSettings>) => void;
  onResetTransforms: () => void;
}

export const LogoUploader: React.FC<LogoUploaderProps> = ({
  logo,
  onChangeLogo,
  onResetTransforms,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'samples' | 'text' | 'adjust'>('upload');
  const [textInput, setTextInput] = useState('STUDIO 99');
  const [textFont, setTextFont] = useState('sans');
  const [textColor, setTextColor] = useState('#ffffff');

  // Handle file upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onChangeLogo({
          imageUrl: result,
          name: file.name.replace(/\.[^/.]+$/, ''),
          scale: 1.0,
          rotation: 0,
          x: 0,
          y: 0,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Generate SVG from text logo
  const handleGenerateTextLogo = () => {
    const fontFamilies: Record<string, string> = {
      sans: "'Plus Jakarta Sans', Arial, sans-serif",
      mono: "'JetBrains Mono', monospace",
      serif: "Georgia, serif",
      display: "Impact, sans-serif",
    };

    const chosenFont = fontFamilies[textFont] || fontFamilies.sans;
    const svgString = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 250" width="500" height="250">
        <rect width="500" height="250" fill="none"/>
        <text 
          x="250" 
          y="145" 
          font-family="${chosenFont}" 
          font-weight="900" 
          font-size="64" 
          fill="${textColor}" 
          letter-spacing="4" 
          text-anchor="middle"
        >${textInput.toUpperCase()}</text>
      </svg>
    `;
    const dataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
    onChangeLogo({
      imageUrl: dataUri,
      name: textInput,
      scale: 1.0,
      rotation: 0,
      x: 0,
      y: 0,
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800 text-slate-200">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 p-1.5 gap-1">
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'upload'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </button>

        <button
          onClick={() => setActiveTab('samples')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'samples'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Presets</span>
        </button>

        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'text'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Type Logo</span>
        </button>

        <button
          onClick={() => setActiveTab('adjust')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
            activeTab === 'adjust'
              ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Fit & FX</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* TAB 1: UPLOAD */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-indigo-500/40 hover:border-indigo-400 hover:bg-indigo-950/20 bg-slate-950/50 rounded-2xl p-6 text-center cursor-pointer transition-all group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-indigo-500/10 group-hover:bg-indigo-500/20 text-indigo-400 flex items-center justify-center transition-colors">
                <Upload className="w-7 h-7 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Upload your logo</h3>
              <p className="text-xs text-slate-400 mb-3">
                PNG, SVG, JPG, WebP with transparency
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-indigo-600 text-white shadow-md shadow-indigo-600/30 group-hover:bg-indigo-500 transition-colors">
                Browse file
              </span>
            </div>

            {/* Current Logo Preview Card */}
            {logo.imageUrl && (
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center p-1.5 shrink-0 overflow-hidden">
                    <img
                      src={logo.imageUrl}
                      alt="Current logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{logo.name || 'Active Logo'}</p>
                    <p className="text-[11px] text-emerald-400 font-medium">Ready on mockup</p>
                  </div>
                </div>

                <button
                  onClick={() => onChangeLogo({ imageUrl: '' })}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  title="Remove logo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Quick Background Removal Filter */}
            <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-semibold text-slate-200">Auto-Remove White BG</span>
                </div>
                <input
                  type="checkbox"
                  checked={logo.removeWhiteBg}
                  onChange={(e) => onChangeLogo({ removeWhiteBg: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                If your logo has a white square background, enable this to make it transparent automatically.
              </p>
              {logo.removeWhiteBg && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Cutout Sensitivity</span>
                    <span className="font-mono text-slate-300">{logo.whiteThreshold}</span>
                  </div>
                  <input
                    type="range"
                    min="180"
                    max="254"
                    value={logo.whiteThreshold}
                    onChange={(e) => onChangeLogo({ whiteThreshold: parseInt(e.target.value, 10) })}
                    className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SAMPLE PRESETS */}
        {activeTab === 'samples' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Pick a Demo Design
              </span>
              <span className="text-[10px] text-indigo-400 font-medium">Instant Test</span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {SAMPLE_LOGOS.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onChangeLogo({
                      imageUrl: sample.svgDataUri,
                      name: sample.name,
                      scale: 1.0,
                      rotation: 0,
                      x: 0,
                      y: 0,
                    });
                  }}
                  className={`flex items-center gap-3 p-2.5 rounded-xl border text-left transition-all ${
                    logo.name === sample.name
                      ? 'border-indigo-500 bg-indigo-950/30 ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 p-1 flex items-center justify-center shrink-0">
                    <img src={sample.svgDataUri} alt={sample.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-white truncate">{sample.name}</p>
                      {logo.name === sample.name && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate">{sample.tagline}</p>
                    <span className="inline-block mt-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                      {sample.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TYPE LOGO GENERATOR */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Brand or Wordmark Text</label>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="e.g. PK XD / SQUAD"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Typography Style</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'sans', label: 'Modern Sans' },
                  { id: 'display', label: 'Bold Impact' },
                  { id: 'mono', label: 'Tech Mono' },
                  { id: 'serif', label: 'Classic Serif' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setTextFont(f.id)}
                    className={`py-2 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                      textFont === f.id
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Text Color</label>
              <div className="flex items-center gap-2">
                {['#ffffff', '#000000', '#f59e0b', '#ec4899', '#00f0ff', '#10b981'].map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    style={{ backgroundColor: c }}
                    className={`w-7 h-7 rounded-full border-2 transition-transform ${
                      textColor === c ? 'border-indigo-400 scale-110 shadow-sm' : 'border-slate-700'
                    }`}
                  />
                ))}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  title="Custom Color"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateTextLogo}
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Apply Wordmark to Mockup</span>
            </button>
          </div>
        )}

        {/* TAB 4: ADJUST, FINISH & EFFECTS */}
        {activeTab === 'adjust' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">Placement & Scale</span>
              <button
                onClick={onResetTransforms}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Scale slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Maximize2 className="w-3.5 h-3.5" /> Size
                </span>
                <span className="font-mono text-slate-300">{(logo.scale * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.2"
                step="0.05"
                value={logo.scale}
                onChange={(e) => onChangeLogo({ scale: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Rotation slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <RotateCw className="w-3.5 h-3.5" /> Rotation
                </span>
                <span className="font-mono text-slate-300">{logo.rotation}°</span>
              </div>
              <input
                type="range"
                min="-180"
                max="180"
                step="5"
                value={logo.rotation}
                onChange={(e) => onChangeLogo({ rotation: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Position X slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Offset Horizontal (X)</span>
                <span className="font-mono text-slate-300">{logo.x}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={logo.x}
                onChange={(e) => onChangeLogo({ x: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Position Y slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Offset Vertical (Y)</span>
                <span className="font-mono text-slate-300">{logo.y}px</span>
              </div>
              <input
                type="range"
                min="-100"
                max="100"
                value={logo.y}
                onChange={(e) => onChangeLogo({ y: parseInt(e.target.value, 10) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Opacity slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>Opacity</span>
                <span className="font-mono text-slate-300">{(logo.opacity * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={logo.opacity}
                onChange={(e) => onChangeLogo({ opacity: parseFloat(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
              />
            </div>

            {/* Material Finish */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Print Material / Finish</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'screenprint', label: 'Screenprint', desc: 'Flat matte ink' },
                  { id: 'glossy', label: 'Glossy Glaze', desc: 'Reflective shine' },
                  { id: 'embroidered', label: 'Embroidered', desc: 'Raised stitches' },
                  { id: 'foil', label: 'Gold Foil', desc: 'Metallic luster' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onChangeLogo({ finish: f.id as LogoFinish })}
                    className={`p-2 rounded-lg text-left border transition-all ${
                      logo.finish === f.id
                        ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <p className="text-xs font-bold">{f.label}</p>
                    <p className="text-[10px] text-slate-400">{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Blend Mode */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>Fabric Blend Mode</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'normal', label: 'Normal' },
                  { id: 'multiply', label: 'Multiply' },
                  { id: 'overlay', label: 'Overlay' },
                  { id: 'screen', label: 'Screen' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onChangeLogo({ blendMode: b.id as LogoBlendMode })}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      logo.blendMode === b.id
                        ? 'bg-indigo-600/40 border-indigo-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400">
                Tip: Use <strong>Multiply</strong> on light fabrics for ink realism, or <strong>Normal</strong> for opaque stickers.
              </p>
            </div>

            {/* Color Tint Override */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-indigo-400" />
                <span>Logo Color Treatment</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'original', label: 'Original' },
                  { id: 'white', label: 'Monochrome White' },
                  { id: 'black', label: 'Monochrome Black' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => onChangeLogo({ colorMode: m.id as LogoColorMode })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                      logo.colorMode === m.id
                        ? 'bg-indigo-600/40 border-indigo-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
