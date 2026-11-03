export interface SampleLogo {
  id: string;
  name: string;
  tagline: string;
  category: string;
  svgDataUri: string;
}

const svgToDataUri = (svg: string): string => {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
};

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'pkxd-cosmic-cat',
    name: 'PK XD Cosmic Kitty',
    tagline: 'Vibrant Gamer Universe Mascot',
    category: 'PK XD & Gaming',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <defs>
          <linearGradient id="pkNeonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#ff007f" />
            <stop offset="50%" stop-color="#7928ca" />
            <stop offset="100%" stop-color="#00f0ff" />
          </linearGradient>
        </defs>
        <!-- Outer Glowing Badge -->
        <circle cx="200" cy="180" r="140" fill="#180b2b" stroke="url(#pkNeonGrad)" stroke-width="10"/>
        <!-- Cat Ears -->
        <polygon points="120,130 90,60 160,100" fill="#ff007f" stroke="#ffffff" stroke-width="4"/>
        <polygon points="280,130 310,60 240,100" fill="#00f0ff" stroke="#ffffff" stroke-width="4"/>
        <!-- Inner Ears -->
        <polygon points="120,120 100,75 145,100" fill="#ffd166"/>
        <polygon points="280,120 300,75 255,100" fill="#ffd166"/>
        <!-- Cat Head -->
        <ellipse cx="200" cy="180" rx="90" ry="75" fill="#2d1254"/>
        <!-- Gamer Visor Glasses -->
        <rect x="130" y="150" width="140" height="40" rx="16" fill="url(#pkNeonGrad)" stroke="#ffffff" stroke-width="3"/>
        <path d="M140 160 L180 160" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <path d="M220 160 L260 160" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
        <!-- Nose & Whiskers -->
        <polygon points="200,205 194,198 206,198" fill="#ff007f"/>
        <path d="M140 210 L100 205 M140 220 L105 225" stroke="#00f0ff" stroke-width="4" stroke-linecap="round"/>
        <path d="M260 210 L300 205 M260 220 L295 225" stroke="#ff007f" stroke-width="4" stroke-linecap="round"/>
        <!-- Mouth -->
        <path d="M190 215 Q200 225 210 215" stroke="#ffffff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Stars & Sparkles -->
        <polygon points="200,50 205,65 220,65 208,75 212,90 200,80 188,90 192,75 180,65 195,65" fill="#ffe600"/>
        <!-- Text -->
        <rect x="70" y="320" width="260" height="50" rx="25" fill="#ff007f"/>
        <text x="200" y="354" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff" letter-spacing="3" text-anchor="middle">PK XD CLUB</text>
      </svg>
    `),
  },
  {
    id: 'pkxd-robo-boost',
    name: 'Robo-Power Volt',
    tagline: 'Cyber Arcade & Mecha Armor',
    category: 'PK XD & Gaming',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <polygon points="200,30 350,120 350,280 200,370 50,280 50,120" fill="#0d1b2a" stroke="#00f0ff" stroke-width="8"/>
        <!-- Robot Antennas -->
        <circle cx="200" cy="90" r="14" fill="#ffe600"/>
        <rect x="196" y="104" width="8" height="20" fill="#00f0ff"/>
        <!-- Face Plate -->
        <rect x="110" y="125" width="180" height="130" rx="24" fill="#1b263b" stroke="#ffffff" stroke-width="4"/>
        <!-- Lightning Eyes -->
        <polygon points="145,155 170,155 155,185 180,185 140,225 150,195 135,195" fill="#00f0ff"/>
        <polygon points="235,155 260,155 245,185 270,185 230,225 240,195 225,195" fill="#ffe600"/>
        <!-- Soundwave Smile -->
        <rect x="160" y="225" width="10" height="18" rx="5" fill="#00f0ff"/>
        <rect x="175" y="220" width="10" height="28" rx="5" fill="#ff007f"/>
        <rect x="190" y="215" width="10" height="36" rx="5" fill="#ffe600"/>
        <rect x="205" y="215" width="10" height="36" rx="5" fill="#ffe600"/>
        <rect x="220" y="220" width="10" height="28" rx="5" fill="#ff007f"/>
        <rect x="235" y="225" width="10" height="18" rx="5" fill="#00f0ff"/>
        <text x="200" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="28" fill="#00f0ff" letter-spacing="4" text-anchor="middle">VOLT ROBO</text>
      </svg>
    `),
  },
  {
    id: 'apex-coffee',
    name: 'Apex Roasters',
    tagline: 'Artisanal Coffee & Roastery',
    category: 'Food & Beverage',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <circle cx="200" cy="200" r="180" fill="#1e1b18" stroke="#d4af37" stroke-width="6"/>
        <circle cx="200" cy="200" r="162" fill="none" stroke="#d4af37" stroke-width="2" stroke-dasharray="6 6"/>
        <path d="M200 80 L290 220 L240 220 L270 270 L130 270 L160 220 L110 220 Z" fill="#d4af37"/>
        <path d="M200 120 C180 160 180 200 200 240 C220 200 220 160 200 120 Z" fill="#1e1b18"/>
        <polygon points="120,180 125,195 140,195 128,205 132,220 120,210 108,220 112,205 100,195 115,195" fill="#d4af37"/>
        <polygon points="280,180 285,195 300,195 288,205 292,220 280,210 268,220 272,205 260,195 275,195" fill="#d4af37"/>
        <text x="200" y="315" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="28" fill="#ffffff" letter-spacing="6" text-anchor="middle">APEX ROASTERS</text>
        <text x="200" y="345" font-family="'JetBrains Mono', monospace" font-size="14" fill="#d4af37" letter-spacing="3" text-anchor="middle">EST. 2024 • CRAFT COFFEE</text>
      </svg>
    `),
  },
  {
    id: 'zenith-athletics',
    name: 'Zenith Sportswear',
    tagline: 'High Performance Apparel',
    category: 'Apparel & Streetwear',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <g transform="translate(40, 60)">
          <path d="M60 40 L280 40 L160 160 L280 160 L240 220 L20 220 L140 100 L40 100 Z" fill="#06b6d4"/>
          <path d="M120 70 L260 70 L175 155 L250 155 L225 195 L65 195 L150 110 L80 110 Z" fill="#3b82f6"/>
          <polygon points="180,15 290,15 270,45 160,45" fill="#f43f5e"/>
        </g>
        <text x="200" y="320" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="34" fill="#0f172a" letter-spacing="4" text-anchor="middle">ZENITH</text>
        <text x="200" y="350" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="700" font-size="14" fill="#64748b" letter-spacing="6" text-anchor="middle">ATHLETICS CLUB</text>
      </svg>
    `),
  },
  {
    id: 'nebula-labs',
    name: 'Nebula AI Labs',
    tagline: 'Next-Gen Intelligence',
    category: 'Technology',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <defs>
          <linearGradient id="nebulaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6" />
            <stop offset="50%" stop-color="#ec4899" />
            <stop offset="100%" stop-color="#f59e0b" />
          </linearGradient>
        </defs>
        <circle cx="200" cy="170" r="100" fill="none" stroke="url(#nebulaGrad)" stroke-width="12"/>
        <ellipse cx="200" cy="170" rx="115" ry="45" fill="none" stroke="url(#nebulaGrad)" stroke-width="9" transform="rotate(-30 200 170)"/>
        <ellipse cx="200" cy="170" rx="115" ry="45" fill="none" stroke="url(#nebulaGrad)" stroke-width="9" transform="rotate(30 200 170)"/>
        <circle cx="200" cy="170" r="32" fill="url(#nebulaGrad)"/>
        <circle cx="200" cy="170" r="14" fill="#ffffff"/>
        <text x="200" y="325" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="800" font-size="30" fill="#1e1b4b" letter-spacing="5" text-anchor="middle">NEBULA</text>
        <text x="200" y="355" font-family="'JetBrains Mono', monospace" font-size="13" fill="#8b5cf6" letter-spacing="4" text-anchor="middle">INTELLIGENCE LABS</text>
      </svg>
    `),
  },
  {
    id: 'summit-outdoors',
    name: 'Wilderness Summit',
    tagline: 'Adventure & Exploration Gear',
    category: 'Outdoor & Goods',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <polygon points="200,40 340,160 340,300 200,380 60,300 60,160" fill="#132a13" stroke="#e9c46a" stroke-width="6"/>
        <polygon points="200,100 280,240 120,240" fill="#31572c"/>
        <polygon points="200,100 230,150 170,150" fill="#f4f1de"/>
        <polygon points="250,160 305,240 195,240" fill="#4f772d"/>
        <polygon points="250,160 270,195 230,195" fill="#f4f1de"/>
        <polygon points="160,210 175,240 145,240" fill="#132a13"/>
        <polygon points="240,210 255,240 225,240" fill="#132a13"/>
        <polygon points="200,200 215,240 185,240" fill="#132a13"/>
        <circle cx="200" cy="95" r="16" fill="#e9c46a"/>
        <text x="200" y="285" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-weight="900" font-size="22" fill="#ffffff" letter-spacing="4" text-anchor="middle">SUMMIT GEAR</text>
        <text x="200" y="315" font-family="'Plus Jakarta Sans', Arial, sans-serif" font-size="12" fill="#e9c46a" letter-spacing="3" text-anchor="middle">NORTHWEST EXPEDITIONS</text>
      </svg>
    `),
  },
  {
    id: 'cyber-monogram',
    name: 'Cipher Minimal',
    tagline: 'Modern Geometric Monogram',
    category: 'Abstract & Modern',
    svgDataUri: svgToDataUri(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
        <rect width="400" height="400" fill="none"/>
        <rect x="90" y="90" width="220" height="220" rx="28" fill="#000000" stroke="#38bdf8" stroke-width="8"/>
        <path d="M140 140 H260 V180 H180 V220 H260 V260 H140 Z" fill="#38bdf8"/>
        <circle cx="230" cy="160" r="10" fill="#000000"/>
        <circle cx="230" cy="240" r="10" fill="#000000"/>
        <text x="200" y="355" font-family="'JetBrains Mono', monospace" font-weight="700" font-size="20" fill="#000000" letter-spacing="6" text-anchor="middle">CIPHER.STUDIO</text>
      </svg>
    `),
  },
];
