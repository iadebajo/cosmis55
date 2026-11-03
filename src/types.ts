export type ProductId = 
  | 'mug' 
  | 'tshirt' 
  | 'hoodie' 
  | 'tote' 
  | 'tumbler' 
  | 'cap' 
  | 'pin' 
  | 'phone-case';

export type LogoColorMode = 'original' | 'white' | 'black' | 'gold' | 'custom';

export type LogoBlendMode = 'normal' | 'multiply' | 'screen' | 'overlay';

export type LogoFinish = 'screenprint' | 'glossy' | 'embroidered' | 'foil';

export type LightingPreset = 'studio' | 'warm' | 'dramatic' | 'daylight';

export type BackdropType = 'transparent' | 'studio' | 'white' | 'dark' | 'wood' | 'concrete';

export type ImageResolution = '1K' | '2K' | '4K';

export interface LogoSettings {
  imageUrl: string;
  name: string;
  x: number; // -100 to 100 percentage offset from center
  y: number; // -100 to 100 percentage offset from center
  scale: number; // 0.1 to 2.0
  rotation: number; // -180 to 180 degrees
  opacity: number; // 0.1 to 1.0
  colorMode: LogoColorMode;
  customColor: string;
  blendMode: LogoBlendMode;
  finish: LogoFinish;
  removeWhiteBg: boolean;
  whiteThreshold: number; // 0 to 255
}

export interface ProductConfig {
  id: ProductId;
  name: string;
  category: 'Drinkware' | 'Apparel' | 'Accessories';
  color: string;
  handleSide?: 'left' | 'right';
  placementPreset: 'chest' | 'pocket' | 'large' | 'center' | 'all-over';
  lighting: LightingPreset;
  backdrop: BackdropType;
}

export interface ProductTemplate {
  id: ProductId;
  name: string;
  category: 'Drinkware' | 'Apparel' | 'Accessories';
  icon: string;
  defaultColor: string;
  colorPalette: { name: string; hex: string }[];
  placementArea: {
    // Relative bounding box for logo placement on 1000x1000 canvas
    x: number;
    y: number;
    width: number;
    height: number;
    maxScale: number;
    isCylindrical?: boolean;
    curveFactor?: number;
  };
  description: string;
}

export interface AiGenerationParams {
  prompt: string;
  imageSize: ImageResolution;
  aspectRatio: '1:1' | '3:4' | '16:9';
  productContext: string;
}

export interface AiEditParams {
  prompt: string;
  imageSize: ImageResolution;
  aspectRatio: '1:1' | '3:4' | '16:9';
}

export interface GeneratedMockup {
  id: string;
  imageUrl: string;
  prompt: string;
  model: string;
  imageSize: ImageResolution;
  timestamp: number;
}
