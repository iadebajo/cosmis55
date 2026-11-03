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
  Sun,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { ProductConfig, ProductId, LightingPreset, BackdropType } from '../types';
import { PRODUCT_TEMPLATES } from '../data/mockupTemplates';

interface ProductPickerProps {
  product: ProductConfig;
  onChangeProduct: (newConfig: Partial<ProductConfig>) => void;
}

export const ProductPicker: React.FC<ProductPickerProps> = ({
  product,
  onChangeProduct,
}) => {
  const currentTemplate = PRODUCT_TEMPLATES.find((t) => t.id === product.id) || PRODUCT_TEMPLATES[0];

  const getProductIcon = (id: ProductId) => {
    switch (id) {
      case 'mug':
        return <Coffee className="w-5 h-5" />;
      case 'tshirt':
        return <Shirt className="w-5 h-5" />;
      case 'hoodie':
        return <Layers className="w-5 h-5" />;
      case 'tumbler':
        return <CupSoda className="w-5 h-5" />;
      case 'tote':
        return <ShoppingBag className="w-5 h-5" />;
      case 'cap':
        return <Crown className="w-5 h-5" />;
      case 'pin':
        return <CircleDot className="w-5 h-5" />;
      case 'phone-case':
        return <Smartphone className="w-5 h-5" />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200">
      <div className="p-3 border-b border-slate-800 bg-slate-950/60">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Product & Environment
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {/* 1. SELECT PRODUCT TYPE */}
        <div className="space-y-2.5">
          <label className="text-xs font-semibold text-slate-300">Choose Mockup Item</label>
          <div className="grid grid-cols-2 gap-2">
            {PRODUCT_TEMPLATES.map((tmpl) => {
              const isSelected = tmpl.id === product.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => {
                    onChangeProduct({
                      id: tmpl.id,
                      name: tmpl.name,
                      category: tmpl.category,
                      color: tmpl.defaultColor,
                    });
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                      : 'border-slate-800 bg-slate-950/50 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg shrink-0 ${
                      isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getProductIcon(tmpl.id)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate leading-tight">{tmpl.name.split(' (')[0]}</p>
                    <span className="text-[10px] text-slate-500">{tmpl.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. PRODUCT COLOR PALETTE */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">Product Color</label>
            <span className="text-[11px] font-mono text-slate-400">
              {currentTemplate.colorPalette.find((c) => c.hex.toLowerCase() === product.color.toLowerCase())?.name || product.color}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {currentTemplate.colorPalette.map((item) => {
              const isSelected = item.hex.toLowerCase() === product.color.toLowerCase();
              return (
                <button
                  key={item.hex}
                  onClick={() => onChangeProduct({ color: item.hex })}
                  title={item.name}
                  style={{ backgroundColor: item.hex }}
                  className={`w-7 h-7 rounded-full border-2 transition-transform relative flex items-center justify-center ${
                    isSelected
                      ? 'border-indigo-400 scale-110 shadow-md ring-2 ring-indigo-500/30'
                      : 'border-slate-700 hover:scale-105'
                  }`}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 ${
                        item.hex === '#ffffff' || item.hex === '#fcfcfd' || item.hex === '#f6f3eb'
                          ? 'text-slate-900'
                          : 'text-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}

            {/* Custom Color Input */}
            <div className="relative flex items-center ml-1">
              <input
                type="color"
                value={product.color}
                onChange={(e) => onChangeProduct({ color: e.target.value })}
                className="w-7 h-7 rounded-full cursor-pointer bg-transparent border-0 opacity-0 absolute inset-0 z-10"
                title="Custom color"
              />
              <div
                style={{ backgroundColor: product.color }}
                className="w-7 h-7 rounded-full border-2 border-dashed border-indigo-400/80 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
              >
                +
              </div>
            </div>
          </div>
        </div>

        {/* 3. ITEM-SPECIFIC CONTROLS */}
        {product.id === 'mug' && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">Mug Handle Position</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onChangeProduct({ handleSide: 'left' })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  product.handleSide === 'left'
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Left Handle
              </button>
              <button
                onClick={() => onChangeProduct({ handleSide: 'right' })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  product.handleSide === 'right' || !product.handleSide
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                Right Handle
              </button>
            </div>
          </div>
        )}

        {product.id === 'tshirt' && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="text-xs font-semibold text-slate-300">T-Shirt Placement Preset</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'chest', label: 'Center Chest' },
                { id: 'pocket', label: 'Left Pocket' },
                { id: 'large', label: 'Oversized' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => onChangeProduct({ placementPreset: p.id as any })}
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all ${
                    product.placementPreset === p.id
                      ? 'bg-indigo-600/30 border-indigo-500 text-white'
                      : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. LIGHTING ATMOSPHERE */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span>Studio Lighting Preset</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'studio', label: 'Neutral Studio', desc: 'Crisp & balanced' },
              { id: 'warm', label: 'Warm Glow', desc: 'Cozy cafe vibes' },
              { id: 'dramatic', label: 'Dramatic Contrast', desc: 'High shadow' },
              { id: 'daylight', label: 'Crisp Daylight', desc: 'Clean natural' },
            ].map((light) => (
              <button
                key={light.id}
                onClick={() => onChangeProduct({ lighting: light.id as LightingPreset })}
                className={`p-2 rounded-lg text-left border transition-all ${
                  product.lighting === light.id
                    ? 'border-indigo-500 bg-indigo-950/40 text-white ring-1 ring-indigo-500/50'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                <p className="text-xs font-bold">{light.label}</p>
                <p className="text-[10px] text-slate-500">{light.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 5. BACKDROP ENVIRONMENT */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />
            <span>Mockup Scene Backdrop</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'studio', label: 'Studio' },
              { id: 'wood', label: 'Wood Table' },
              { id: 'concrete', label: 'Concrete' },
              { id: 'white', label: 'Pure White' },
              { id: 'dark', label: 'Midnight' },
              { id: 'transparent', label: 'Cutout PNG' },
            ].map((bd) => (
              <button
                key={bd.id}
                onClick={() => onChangeProduct({ backdrop: bd.id as BackdropType })}
                className={`py-2 px-1.5 rounded-lg text-center text-xs font-semibold border transition-all ${
                  product.backdrop === bd.id
                    ? 'bg-indigo-600/30 border-indigo-500 text-white'
                    : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                {bd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
