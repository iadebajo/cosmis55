import React from 'react';
import { 
  Coffee, 
  Shirt, 
  Layers, 
  CupSoda, 
  ShoppingBag, 
  Crown, 
  CircleDot, 
  Smartphone,
  Download,
  Sparkles,
  Sliders,
  Palette
} from 'lucide-react';
import { ProductId, ProductConfig, ImageResolution } from '../types';
import { PRODUCT_TEMPLATES } from '../data/mockupTemplates';

interface NavbarProps {
  currentProductId: ProductId;
  onSelectProduct: (id: ProductId) => void;
  activeMode: 'canvas' | 'ai';
  onToggleMode: (mode: 'canvas' | 'ai') => void;
  onDownloadHighRes: (resolution: ImageResolution) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProductId,
  onSelectProduct,
  activeMode,
  onToggleMode,
  onDownloadHighRes,
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = React.useState(false);

  const getIcon = (id: ProductId) => {
    switch (id) {
      case 'mug':
        return <Coffee className="w-4 h-4" />;
      case 'tshirt':
        return <Shirt className="w-4 h-4" />;
      case 'hoodie':
        return <Layers className="w-4 h-4" />;
      case 'tumbler':
        return <CupSoda className="w-4 h-4" />;
      case 'tote':
        return <ShoppingBag className="w-4 h-4" />;
      case 'cap':
        return <Crown className="w-4 h-4" />;
      case 'pin':
        return <CircleDot className="w-4 h-4" />;
      case 'phone-case':
        return <Smartphone className="w-4 h-4" />;
    }
  };

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 flex items-center justify-between gap-4 z-30 shrink-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 via-indigo-600 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
            <Coffee className="w-5 h-5 text-indigo-400" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-extrabold text-white tracking-tight">
              MockupCraft
            </h1>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-pink-500/20 to-indigo-500/20 text-pink-300 border border-pink-500/30">
              PK XD & Merch Studio
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            Logo placement on mugs, t-shirts, hoodies & accessories
          </p>
        </div>
      </div>

      {/* Center Product Quick Pills (Responsive) */}
      <div className="hidden lg:flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
        {PRODUCT_TEMPLATES.slice(0, 5).map((tmpl) => (
          <button
            key={tmpl.id}
            onClick={() => onSelectProduct(tmpl.id)}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              currentProductId === tmpl.id
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {getIcon(tmpl.id)}
            <span>{tmpl.name.split(' (')[0]}</span>
          </button>
        ))}
      </div>

      {/* Right Controls: Mode Toggle & Export */}
      <div className="flex items-center gap-2.5">
        {/* Mode Switcher */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onToggleMode('canvas')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'canvas'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Interactive Studio</span>
          </button>

          <button
            onClick={() => onToggleMode('ai')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
              activeMode === 'ai'
                ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Studio</span>
          </button>
        </div>

        {/* High Res Export Button */}
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>

          {showDownloadMenu && (
            <div
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50 text-slate-200 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowDownloadMenu(false)}
            >
              <div className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Download Resolution
              </div>
              <button
                onClick={() => {
                  onDownloadHighRes('1K');
                  setShowDownloadMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Standard (1K • 1024px)</span>
                <span className="text-[10px] font-mono text-emerald-400">1K</span>
              </button>
              <button
                onClick={() => {
                  onDownloadHighRes('2K');
                  setShowDownloadMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800 flex items-center justify-between"
              >
                <span>High Res (2K • 2048px)</span>
                <span className="text-[10px] font-mono text-cyan-400">2K</span>
              </button>
              <button
                onClick={() => {
                  onDownloadHighRes('4K');
                  setShowDownloadMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-xs hover:bg-slate-800 flex items-center justify-between"
              >
                <span>Ultra Crisp (4K • 4096px)</span>
                <span className="text-[10px] font-mono text-amber-400">4K</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
