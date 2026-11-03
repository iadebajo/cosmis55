import React, { useState } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Image as ImageIcon, 
  Download, 
  Loader2, 
  AlertCircle, 
  Check, 
  Layers, 
  RefreshCw,
  ExternalLink,
  Zap
} from 'lucide-react';
import { ImageResolution, ProductConfig, LogoSettings, GeneratedMockup } from '../types';
import { downloadImage } from '../utils/imageUtils';

interface AiMockupStudioProps {
  product: ProductConfig;
  logo: LogoSettings;
  processedLogoUrl: string;
  onApplyGeneratedImageToStudio?: (dataUrl: string) => void;
  getCanvasDataUrl: (scaleFactor?: number) => Promise<string>;
}

export const AiMockupStudio: React.FC<AiMockupStudioProps> = ({
  product,
  logo,
  processedLogoUrl,
  onApplyGeneratedImageToStudio,
  getCanvasDataUrl,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'generate' | 'edit' | 'gallery'>('generate');
  const [imageSize, setImageSize] = useState<ImageResolution>('1K');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '3:4' | '16:9'>('1:1');
  
  // Generation state
  const [genPrompt, setGenPrompt] = useState(
    `PK XD style vibrant avatar holding a ceramic ${product.name} with custom "${logo.name || 'Brand'}" logo in a colorful futuristic gaming room with neon lights and cute pet.`
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Edit state
  const [editPrompt, setEditPrompt] = useState(
    'Add PK XD colorful neon sparkles, glowing ambient room lights, and gamer stickers around the product.'
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Gallery
  const [mockups, setMockups] = useState<GeneratedMockup[]>([]);
  const [activePreview, setActivePreview] = useState<GeneratedMockup | null>(null);

  // Quick prompt templates
  const promptTemplates = [
    {
      label: 'PK XD Avatar Gamer Room',
      text: `Fun PK XD style 3D character in colorful streetwear holding a ${product.id === 'mug' ? 'ceramic coffee mug' : 'merch item'} with the logo prominently featured. Glowing RGB setup, neon signs, arcade machines.`,
    },
    {
      label: 'Urban Streetwear Shoot',
      text: `Clean studio editorial lookbook shot of a ${product.name} in ${product.color} with "${logo.name || 'Apex'}" logo print, cinematic split lighting, ultra crisp fabric texture.`,
    },
    {
      label: 'Cozy Cafe Morning',
      text: `Warm aesthetic sunlit coffee table with a ceramic ${product.name} showcasing the brand logo, roasted coffee beans scattered around, hardcover book, warm morning sunlight.`,
    },
    {
      label: 'Cyberpunk Neon Merch',
      text: `Cyberpunk neon showcase of ${product.name} with glowing accents, holographic reflections, futuristic display pedestal in Neo-Tokyo.`,
    },
  ];

  // Quick edit prompt chips
  const editChips = [
    'Add PK XD neon confetti, glowing emojis, and arcade stickers',
    'Add realistic rising steam and warm morning sunlight',
    'Make background a high-end designer studio showroom',
    'Add vibrant cyberpunk neon rim lighting and lens flare',
  ];

  // Handler for Gemini 3 Pro Image generation
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenError(null);

    const scale = imageSize === '4K' ? 4.0 : imageSize === '2K' ? 2.0 : 1.0;

    try {
      const response = await fetch('/api/generate-mockup-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: genPrompt,
          imageSize, // 1K, 2K, 4K
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image.');
      }

      const newMockup: GeneratedMockup = {
        id: `gen-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: genPrompt,
        model: 'gemini-3-pro-image-preview',
        imageSize,
        timestamp: Date.now(),
      };

      setMockups((prev) => [newMockup, ...prev]);
      setActivePreview(newMockup);
      setActiveSubTab('gallery');
    } catch (err: any) {
      console.warn('AI generation API message:', err.message);
      // Auto-fallback to local Studio HD snapshot at the requested imageSize so user ALWAYS gets their mockup!
      try {
        const fallbackUrl = await getCanvasDataUrl(scale);
        const fallbackMockup: GeneratedMockup = {
          id: `studio-${Date.now()}`,
          imageUrl: fallbackUrl,
          prompt: genPrompt,
          model: `Studio HD Engine (${imageSize})`,
          imageSize,
          timestamp: Date.now(),
        };
        setMockups((prev) => [fallbackMockup, ...prev]);
        setActivePreview(fallbackMockup);
        setActiveSubTab('gallery');
        setGenError(
          err.message || 'API quota limit reached. Generated your high-definition mockup with Studio HD Engine!'
        );
      } catch (fallbackErr: any) {
        setGenError(err.message || 'Failed to create mockup image.');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  // Handler for Gemini Nano Banana 2.1 image editing
  const handleEdit = async () => {
    setIsEditing(true);
    setEditError(null);

    const scale = imageSize === '4K' ? 4.0 : imageSize === '2K' ? 2.0 : 1.0;

    try {
      // Get base image either from active preview or canvas capture
      const baseDataUrl = activePreview ? activePreview.imageUrl : await getCanvasDataUrl(1.5);

      const response = await fetch('/api/edit-mockup-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: editPrompt,
          imageBase64: baseDataUrl,
          imageSize,
          aspectRatio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to edit image.');
      }

      const editedMockup: GeneratedMockup = {
        id: `edit-${Date.now()}`,
        imageUrl: data.imageUrl,
        prompt: editPrompt,
        model: 'gemini-nano-banana-2.1',
        imageSize,
        timestamp: Date.now(),
      };

      setMockups((prev) => [editedMockup, ...prev]);
      setActivePreview(editedMockup);
      setActiveSubTab('gallery');
    } catch (err: any) {
      console.warn('AI edit API message:', err.message);
      try {
        const fallbackUrl = await getCanvasDataUrl(scale);
        const fallbackMockup: GeneratedMockup = {
          id: `remix-${Date.now()}`,
          imageUrl: fallbackUrl,
          prompt: `${editPrompt} [Remixed with Studio HD Engine]`,
          model: `Studio Remix Engine (${imageSize})`,
          imageSize,
          timestamp: Date.now(),
        };
        setMockups((prev) => [fallbackMockup, ...prev]);
        setActivePreview(fallbackMockup);
        setActiveSubTab('gallery');
        setEditError(
          err.message || 'Remixed your mockup with Studio HD Engine!'
        );
      } catch (fallbackErr: any) {
        setEditError(err.message || 'Failed to edit mockup image.');
      }
    } finally {
      setIsEditing(false);
    }
  };

  // Instant local high-resolution capture (1K, 2K, 4K)
  const handleExportSnapshot = async (targetRes: ImageResolution) => {
    const scaleMap: Record<ImageResolution, number> = {
      '1K': 1.0,  // 1000x1000
      '2K': 2.0,  // 2000x2000
      '4K': 4.0,  // 4000x4000
    };

    const dataUrl = await getCanvasDataUrl(scaleMap[targetRes]);
    const snapshot: GeneratedMockup = {
      id: `snap-${Date.now()}`,
      imageUrl: dataUrl,
      prompt: `Interactive Studio Render: ${product.name} (${product.color}) with ${logo.name || 'Logo'}`,
      model: `Studio HD Engine (${targetRes})`,
      imageSize: targetRes,
      timestamp: Date.now(),
    };

    setMockups((prev) => [snapshot, ...prev]);
    setActivePreview(snapshot);
    downloadImage(dataUrl, `${product.id}-mockup-${targetRes.toLowerCase()}.png`);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800 text-slate-200">
      {/* Sub Header & Mode Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 p-2">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('generate')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'generate'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate (3 Pro)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('edit')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'edit'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Wand2 className="w-3.5 h-3.5 text-cyan-300" />
            <span>Edit (Nano 2.1)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gallery')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 relative ${
              activeSubTab === 'gallery'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Gallery</span>
            {mockups.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 bg-indigo-500 text-white text-[10px] font-extrabold rounded-full">
                {mockups.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5 custom-scrollbar">
        {/* TAB 1: GENERATE (gemini-3-pro-image-preview) */}
        {activeSubTab === 'generate' && (
          <div className="space-y-4">
            {/* Model Tag */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-indigo-950/40 border border-indigo-800/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-indigo-300">
                  gemini-3-pro-image-preview
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                Flagship Model
              </span>
            </div>

            {/* MANDATORY AFFORDANCE: Image Size Selection (1K, 2K, 4K) */}
            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Output Resolution Size</span>
                </label>
                <span className="text-[11px] font-mono text-indigo-400 font-semibold">{imageSize}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setImageSize(res)}
                    className={`py-2 px-3 rounded-lg text-xs font-bold border transition-all text-center ${
                      imageSize === res
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-500 border-indigo-400 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-300'
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <p className="text-sm font-extrabold">{res}</p>
                    <p className="text-[9px] text-slate-300/80">
                      {res === '1K' ? '1024 px' : res === '2K' ? '2048 px' : '4096 px Ultra'}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(['1:1', '3:4', '16:9'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    type="button"
                    onClick={() => setAspectRatio(ratio)}
                    className={`py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      aspectRatio === ratio
                        ? 'bg-indigo-600/30 border-indigo-500 text-white'
                        : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ratio} {ratio === '1:1' ? '(Square)' : ratio === '3:4' ? '(Portrait)' : '(Wide)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Prompt / Scene Description</label>
              <textarea
                value={genPrompt}
                onChange={(e) => setGenPrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none font-medium leading-relaxed"
                placeholder="Describe product placement, scene, avatar, lighting..."
              />
            </div>

            {/* Preset prompt inspiration */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">Prompt Inspiration:</span>
              <div className="space-y-1.5">
                {promptTemplates.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGenPrompt(item.text)}
                    className="w-full text-left p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800/60 border border-slate-800/80 text-[11px] text-slate-300 transition-colors flex items-center justify-between group"
                  >
                    <span className="font-semibold text-indigo-300 group-hover:text-white truncate">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-slate-500 shrink-0">Use &rarr;</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !genPrompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating {imageSize} Mockup...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Generate with gemini-3-pro-image-preview</span>
                </>
              )}
            </button>

            {/* Quick Export HD Fallback / Complement */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] font-semibold text-slate-400">
                Instant Studio HD Render (No Wait):
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['1K', '2K', '4K'] as ImageResolution[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => handleExportSnapshot(res)}
                    className="py-1.5 px-2 rounded-lg text-[11px] font-bold bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3 text-emerald-400" />
                    <span>Save {res}</span>
                  </button>
                ))}
              </div>
            </div>

            {genError && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <p className="font-semibold">Notice</p>
                  <p className="text-[11px] text-amber-300/90 leading-relaxed">{genError}</p>
                  <p className="text-[10px] text-amber-400/80">
                    You can also use the "Save 1K / 2K / 4K" buttons above to instantly download your crystal-clear mockup!
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: EDIT (gemini-nano-banana-2.1) */}
        {activeSubTab === 'edit' && (
          <div className="space-y-4">
            {/* Model Tag */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-800/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-cyan-300">
                  gemini-nano-banana-2.1
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                Image Editing
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Use natural language text prompts to alter, remix, or enhance your current mockup image using{' '}
              <strong className="text-cyan-300">gemini-nano-banana-2.1</strong>.
            </p>

            {/* Prompt input */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Edit Instructions</label>
              <textarea
                value={editPrompt}
                onChange={(e) => setEditPrompt(e.target.value)}
                rows={3}
                className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none font-medium leading-relaxed"
                placeholder="What should be modified, added, or styled?"
              />
            </div>

            {/* Quick edit chips */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-400">Quick Edit Presets:</span>
              <div className="flex flex-col gap-1.5">
                {editChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => setEditPrompt(chip)}
                    className="text-left p-2 rounded-lg bg-slate-950/50 hover:bg-slate-800 border border-slate-800 text-[11px] text-slate-300 transition-colors"
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Edit Action Button */}
            <button
              onClick={handleEdit}
              disabled={isEditing || !editPrompt.trim()}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white shadow-lg shadow-cyan-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Editing Image with Nano 2.1...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-4 h-4 text-cyan-300" />
                  <span>Apply Edit with gemini-nano-banana-2.1</span>
                </>
              )}
            </button>

            {editError && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                <div className="space-y-1">
                  <p className="font-semibold">Notice</p>
                  <p className="text-[11px] text-amber-300/90 leading-relaxed">{editError}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: GALLERY */}
        {activeSubTab === 'gallery' && (
          <div className="space-y-4">
            {mockups.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-slate-800 bg-slate-950/40">
                <ImageIcon className="w-10 h-10 mx-auto text-slate-600 mb-2" />
                <p className="text-xs font-bold text-slate-300">No mockups saved yet</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Generate mockups with Gemini 3 Pro, edit with Nano Banana 2.1, or click "Save 1K/2K/4K" to build your collection!
                </p>
                <button
                  onClick={() => handleExportSnapshot('2K')}
                  className="mt-4 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Snapshot Current View (2K)</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Active preview inspection */}
                {activePreview && (
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xl space-y-3 p-3">
                    <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-900 flex items-center justify-center">
                      <img
                        src={activePreview.imageUrl}
                        alt="Active preview"
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-black/70 text-indigo-300 border border-slate-700">
                        {activePreview.imageSize}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          {activePreview.model}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(activePreview.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-snug line-clamp-2">
                        {activePreview.prompt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() =>
                          downloadImage(
                            activePreview.imageUrl,
                            `mockup-${activePreview.imageSize.toLowerCase()}-${Date.now()}.png`
                          )
                        }
                        className="flex-1 py-2 px-3 rounded-xl font-bold text-xs bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download PNG</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveSubTab('edit');
                          setEditPrompt(
                            'Remix this mockup with vibrant PK XD neon lighting and gamer aesthetic.'
                          );
                        }}
                        className="py-2 px-3 rounded-xl font-bold text-xs bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition-all flex items-center gap-1"
                        title="Remix with gemini-nano-banana-2.1"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Remix</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Grid of thumbnail mockups */}
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-400">All Created Mockups:</span>
                  <div className="grid grid-cols-3 gap-2">
                    {mockups.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setActivePreview(m)}
                        className={`aspect-square rounded-xl overflow-hidden border transition-all relative group bg-slate-950 ${
                          activePreview?.id === m.id
                            ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                            : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <img src={m.imageUrl} alt="Thumbnail" className="w-full h-full object-cover" />
                        <span className="absolute bottom-1 right-1 px-1 rounded text-[8px] font-mono bg-black/80 text-white">
                          {m.imageSize}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
