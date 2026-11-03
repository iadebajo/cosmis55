import React from 'react';
import { ProductConfig, LogoSettings, LightingPreset, BackdropType } from '../types';

interface ProductRendererProps {
  product: ProductConfig;
  logo: LogoSettings;
  processedLogoUrl: string;
  isDraggingLogo: boolean;
  onLogoMouseDown?: (e: React.MouseEvent) => void;
  onLogoTouchStart?: (e: React.TouchEvent) => void;
}

export const ProductSvgRenderer: React.FC<ProductRendererProps> = ({
  product,
  logo,
  processedLogoUrl,
  isDraggingLogo,
  onLogoMouseDown,
  onLogoTouchStart,
}) => {
  // Lighting styles
  const getLightingOverlay = (preset: LightingPreset) => {
    switch (preset) {
      case 'warm':
        return (
          <radialGradient id="lightingGrad" cx="30%" cy="20%" r="90%">
            <stop offset="0%" stopColor="#ffeedd" stopOpacity="0.25" />
            <stop offset="60%" stopColor="#ffaa55" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#221100" stopOpacity="0.3" />
          </radialGradient>
        );
      case 'dramatic':
        return (
          <linearGradient id="lightingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.65" />
          </linearGradient>
        );
      case 'daylight':
        return (
          <linearGradient id="lightingGrad" x1="15%" y1="0%" x2="85%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" stopOpacity="0.22" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.35" />
          </linearGradient>
        );
      case 'studio':
      default:
        return (
          <radialGradient id="lightingGrad" cx="40%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
            <stop offset="70%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.38" />
          </radialGradient>
        );
    }
  };

  // Background scene styles
  const renderBackdrop = (backdrop: BackdropType) => {
    switch (backdrop) {
      case 'white':
        return <rect width="1000" height="1000" fill="#f8fafc" />;
      case 'dark':
        return <rect width="1000" height="1000" fill="#090d16" />;
      case 'wood':
        return (
          <g>
            <rect width="1000" height="1000" fill="#3d2817" />
            {/* Wood planks */}
            <line x1="0" y1="200" x2="1000" y2="200" stroke="#2c1d10" strokeWidth="3" />
            <line x1="0" y1="400" x2="1000" y2="400" stroke="#2c1d10" strokeWidth="3" />
            <line x1="0" y1="600" x2="1000" y2="600" stroke="#2c1d10" strokeWidth="3" />
            <line x1="0" y1="800" x2="1000" y2="800" stroke="#2c1d10" strokeWidth="3" />
            <radialGradient id="woodGlow" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#634224" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#25170b" stopOpacity="0.95" />
            </radialGradient>
            <rect width="1000" height="1000" fill="url(#woodGlow)" />
          </g>
        );
      case 'concrete':
        return (
          <g>
            <rect width="1000" height="1000" fill="#2d3238" />
            <radialGradient id="concreteGlow" cx="50%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#434952" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#181a1d" stopOpacity="0.95" />
            </radialGradient>
            <rect width="1000" height="1000" fill="url(#concreteGlow)" />
          </g>
        );
      case 'studio':
        return (
          <g>
            <radialGradient id="studioWall" cx="50%" cy="35%" r="75%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="55%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#020617" />
            </radialGradient>
            <rect width="1000" height="1000" fill="url(#studioWall)" />
            {/* Horizon floor highlight */}
            <ellipse cx="500" cy="850" rx="420" ry="80" fill="#38bdf8" opacity="0.04" />
          </g>
        );
      case 'transparent':
      default:
        // Return null so transparent PNG exports have a truly transparent background
        return null;
    }
  };

  // Logo finish CSS filter & blend styling
  const getLogoFilter = () => {
    switch (logo.finish) {
      case 'embroidered':
        return 'url(#embroideredEffect)';
      case 'foil':
        return 'url(#goldFoilEffect)';
      case 'glossy':
        return 'url(#glossySheen)';
      case 'screenprint':
      default:
        return undefined;
    }
  };

  // Calculate logo position based on product and offsets
  const getLogoPlacement = () => {
    let centerX = 500;
    let centerY = 500;
    let baseWidth = 260;
    let baseHeight = 260;
    let isCylinder = false;

    if (product.id === 'mug') {
      centerX = 480;
      centerY = 520;
      baseWidth = 240;
      baseHeight = 240;
      isCylinder = true;
    } else if (product.id === 'tshirt') {
      if (product.placementPreset === 'pocket') {
        centerX = 400;
        centerY = 380;
        baseWidth = 120;
        baseHeight = 120;
      } else if (product.placementPreset === 'large') {
        centerX = 500;
        centerY = 480;
        baseWidth = 320;
        baseHeight = 360;
      } else {
        // center chest
        centerX = 500;
        centerY = 440;
        baseWidth = 240;
        baseHeight = 240;
      }
    } else if (product.id === 'hoodie') {
      centerX = 500;
      centerY = 470;
      baseWidth = 250;
      baseHeight = 250;
    } else if (product.id === 'tumbler') {
      centerX = 500;
      centerY = 540;
      baseWidth = 180;
      baseHeight = 260;
      isCylinder = true;
    } else if (product.id === 'tote') {
      centerX = 500;
      centerY = 570;
      baseWidth = 280;
      baseHeight = 280;
    } else if (product.id === 'cap') {
      centerX = 500;
      centerY = 450;
      baseWidth = 190;
      baseHeight = 130;
      isCylinder = true;
    } else if (product.id === 'pin') {
      centerX = 500;
      centerY = 500;
      baseWidth = 260;
      baseHeight = 260;
    } else if (product.id === 'phone-case') {
      centerX = 500;
      centerY = 570;
      baseWidth = 230;
      baseHeight = 260;
    }

    // Apply logo position offsets
    const finalX = centerX + (logo.x * 2.5);
    const finalY = centerY + (logo.y * 2.5);
    const finalWidth = baseWidth * logo.scale;
    const finalHeight = baseHeight * logo.scale;

    return {
      x: finalX - finalWidth / 2,
      y: finalY - finalHeight / 2,
      width: finalWidth,
      height: finalHeight,
      centerX: finalX,
      centerY: finalY,
      isCylinder,
    };
  };

  const placement = getLogoPlacement();

  const renderLogoElement = () => {
    if (!processedLogoUrl) return null;
    const baseW = placement.width / logo.scale;
    const baseH = placement.height / logo.scale;

    return (
      <g
        transform={`
          translate(${placement.centerX}, ${placement.centerY})
          rotate(${logo.rotation})
          scale(${logo.scale})
          translate(-${baseW / 2}, -${baseH / 2})
        `}
        style={{
          mixBlendMode: logo.blendMode,
          opacity: logo.opacity,
          filter: getLogoFilter(),
          cursor: isDraggingLogo ? 'grabbing' : 'grab',
        }}
        onMouseDown={onLogoMouseDown}
        onTouchStart={onLogoTouchStart}
      >
        {/* Transparent hit area for reliable dragging even on transparent logos */}
        <rect
          x={0}
          y={0}
          width={baseW}
          height={baseH}
          fill="transparent"
          style={{ pointerEvents: 'all' }}
        />
        <image
          href={processedLogoUrl}
          xlinkHref={processedLogoUrl}
          x={0}
          y={0}
          width={baseW}
          height={baseH}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    );
  };

  return (
    <svg
      id="mockup-canvas-svg"
      viewBox="0 0 1000 1000"
      width="1000"
      height="1000"
      className="w-full h-full select-none"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <defs>
        {getLightingOverlay(product.lighting)}

        {/* Shadow filter */}
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="16" />
          <feOffset dx="0" dy="24" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.45" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Ground shadow filter */}
        <filter id="groundDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="22" />
        </filter>

        {/* Embroidered Thread Texture Filter */}
        <filter id="embroideredEffect" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="3" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000000" floodOpacity="0.5" />
        </filter>

        {/* Gold Foil Effect Filter */}
        <filter id="goldFoilEffect" x="-10%" y="-10%" width="120%" height="120%">
          <feColorMatrix
            type="matrix"
            values="
              1.2  0.2  0.0  0  0
              0.8  0.9  0.0  0  0
              0.1  0.1  0.2  0  0
              0.0  0.0  0.0  1  0"
          />
        </filter>

        {/* Ceramic Mug Glaze Reflection Gradient */}
        <linearGradient id="ceramicSheen" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
          <stop offset="15%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.18" />
          <stop offset="85%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
        </linearGradient>

        {/* Mug Cylindrical 3D Curvature Mask */}
        <clipPath id="mugBodyClip">
          <path d="M300 320 C300 300 660 300 660 320 L650 740 C650 780 310 780 310 740 Z" />
        </clipPath>

        {/* T-Shirt Body Clip for Seamless Print Edge */}
        <clipPath id="tshirtClip">
          <path d="M360 160 C420 220 580 220 640 160 L780 280 L710 380 L640 330 L640 850 L360 850 L360 330 L290 380 L220 280 Z" />
        </clipPath>

        {/* Hoodie Clip */}
        <clipPath id="hoodieClip">
          <path d="M360 180 C440 250 560 250 640 180 L800 310 L720 420 L660 370 L660 850 L340 850 L340 370 L280 420 L200 310 Z" />
        </clipPath>

        {/* Tumbler Clip */}
        <clipPath id="tumblerClip">
          <path d="M370 280 L630 280 L600 810 C600 830 400 830 400 810 Z" />
        </clipPath>

        {/* Tote Bag Clip */}
        <clipPath id="toteClip">
          <path d="M280 380 L720 380 L700 860 C700 880 300 880 300 860 Z" />
        </clipPath>

        {/* Cap Clip */}
        <clipPath id="capClip">
          <ellipse cx="500" cy="460" rx="270" ry="200" />
        </clipPath>

        {/* Phone Case Clip */}
        <clipPath id="phoneCaseClip">
          <rect x="330" y="240" width="340" height="600" rx="55" />
        </clipPath>
      </defs>

      {/* 1. Backdrop */}
      {renderBackdrop(product.backdrop)}

      {/* 2. Product Render according to product.id */}
      {product.id === 'mug' && (
        <g id="product-mug">
          {/* Ground Contact Shadow */}
          <ellipse cx="480" cy="775" rx="200" ry="38" fill="#000000" opacity="0.45" filter="url(#groundDropShadow)" />

          {/* Mug Handle */}
          {product.handleSide === 'left' ? (
            <g id="mug-handle-left">
              <path
                d="M320 380 C180 380 170 660 320 660"
                fill="none"
                stroke={product.color}
                strokeWidth="50"
                strokeLinecap="round"
                filter="url(#softShadow)"
              />
              <path
                d="M320 380 C180 380 170 660 320 660"
                fill="none"
                stroke="#000000"
                strokeWidth="50"
                strokeLinecap="round"
                opacity="0.18"
              />
              <path
                d="M320 395 C210 395 200 645 320 645"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.3"
              />
            </g>
          ) : (
            <g id="mug-handle-right">
              <path
                d="M640 380 C780 380 790 660 640 660"
                fill="none"
                stroke={product.color}
                strokeWidth="50"
                strokeLinecap="round"
                filter="url(#softShadow)"
              />
              <path
                d="M640 380 C780 380 790 660 640 660"
                fill="none"
                stroke="#000000"
                strokeWidth="50"
                strokeLinecap="round"
                opacity="0.22"
              />
              <path
                d="M640 395 C750 395 760 645 640 645"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                opacity="0.3"
              />
            </g>
          )}

          {/* Inside Mug Cavity (Darker Interior) */}
          <ellipse cx="480" cy="320" rx="180" ry="42" fill="#1e1814" />
          <ellipse cx="480" cy="326" rx="174" ry="38" fill="#140f0c" />
          {/* Coffee liquid surface with subtle shine */}
          <ellipse cx="480" cy="340" rx="160" ry="32" fill="#2d1606" />
          <ellipse cx="475" cy="336" rx="140" ry="24" fill="#3f210d" opacity="0.6" />

          {/* Mug Exterior Ceramic Body */}
          <g clipPath="url(#mugBodyClip)">
            {/* Base Color */}
            <rect x="260" y="260" width="440" height="540" fill={product.color} />

            {/* Ceramic Glaze Reflection Gradient */}
            <rect x="260" y="260" width="440" height="540" fill="url(#ceramicSheen)" />

            {/* Cylinder 3D Left & Right Shading */}
            <linearGradient id="mugCurvatureShading" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.45" />
              <stop offset="18%" stopColor="#000000" stopOpacity="0.05" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
              <stop offset="82%" stopColor="#000000" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
            </linearGradient>
            <rect x="260" y="260" width="440" height="540" fill="url(#mugCurvatureShading)" />

            {/* LOGO PLACEMENT ON MUG */}
            {renderLogoElement()}

            {/* Surface Glaze Specular Highlight on top of logo */}
            <rect x="260" y="260" width="440" height="540" fill="url(#ceramicSheen)" opacity="0.35" style={{ pointerEvents: 'none' }} />
          </g>

          {/* Top Ceramic Rim Bevel & Highlight */}
          <ellipse
            cx="480"
            cy="320"
            rx="180"
            ry="40"
            fill="none"
            stroke={product.color}
            strokeWidth="12"
          />
          <ellipse
            cx="480"
            cy="320"
            rx="180"
            ry="40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.45"
          />
          {/* Bottom base curve highlight */}
          <path
            d="M310 740 C310 780 650 780 650 740"
            fill="none"
            stroke="#000000"
            strokeWidth="10"
            opacity="0.35"
          />
        </g>
      )}

      {product.id === 'tshirt' && (
        <g id="product-tshirt">
          {/* Ground drop shadow behind t-shirt */}
          <path
            d="M340 180 L660 180 L790 300 L710 400 L650 350 L650 860 L350 860 L350 350 L290 400 L210 300 Z"
            fill="#000000"
            opacity="0.3"
            filter="url(#groundDropShadow)"
          />

          <g clipPath="url(#tshirtClip)">
            {/* T-Shirt Fabric Base Color */}
            <rect x="180" y="100" width="640" height="800" fill={product.color} />

            {/* Heavyweight Fabric Texture Pattern */}
            <defs>
              <pattern id="fabricWeave" width="4" height="4" patternUnits="userSpaceOnUse">
                <rect width="2" height="2" fill="#ffffff" opacity="0.03" />
                <rect x="2" y="2" width="2" height="2" fill="#000000" opacity="0.04" />
              </pattern>
            </defs>
            <rect x="180" y="100" width="640" height="800" fill="url(#fabricWeave)" />

            {/* Fold Shadows & Highlights */}
            <path d="M360 300 Q450 480 390 700" stroke="#000000" strokeWidth="24" fill="none" opacity="0.12" />
            <path d="M640 300 Q550 480 610 700" stroke="#000000" strokeWidth="24" fill="none" opacity="0.12" />
            <path d="M460 250 Q500 500 480 780" stroke="#ffffff" strokeWidth="18" fill="none" opacity="0.08" />
            <path d="M520 250 Q540 520 530 820" stroke="#000000" strokeWidth="16" fill="none" opacity="0.1" />

            {/* Sleeve crease lines */}
            <path d="M250 290 L330 330" stroke="#000000" strokeWidth="14" opacity="0.18" />
            <path d="M750 290 L670 330" stroke="#000000" strokeWidth="14" opacity="0.18" />

            {/* LOGO PLACEMENT ON T-SHIRT */}
            {renderLogoElement()}

            {/* Ambient Lighting Gradient over t-shirt */}
            <rect x="180" y="100" width="640" height="800" fill="url(#lightingGrad)" style={{ pointerEvents: 'none' }} />
          </g>

          {/* Ribbed Collar & Neckline Detail */}
          {/* Inner back collar */}
          <path d="M400 170 C460 210 540 210 600 170" fill="#18181b" opacity="0.4" />
          {/* Front Ribbed Neckband */}
          <path
            d="M380 160 C440 230 560 230 620 160"
            fill="none"
            stroke={product.color}
            strokeWidth="20"
            strokeLinecap="round"
          />
          <path
            d="M380 160 C440 230 560 230 620 160"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3"
            opacity="0.25"
          />
          <path
            d="M380 172 C440 242 560 242 620 172"
            fill="none"
            stroke="#000000"
            strokeWidth="3"
            opacity="0.3"
          />

          {/* Hem bottom fold stitch */}
          <path d="M360 835 L640 835" stroke="#000000" strokeWidth="4" opacity="0.25" />
          <path d="M360 837 L640 837" stroke="#ffffff" strokeWidth="2" opacity="0.15" />
        </g>
      )}

      {product.id === 'hoodie' && (
        <g id="product-hoodie">
          {/* Ground drop shadow */}
          <path
            d="M340 160 L660 160 L810 320 L730 430 L660 380 L660 860 L340 860 L340 380 L270 430 L190 320 Z"
            fill="#000000"
            opacity="0.35"
            filter="url(#groundDropShadow)"
          />

          <g clipPath="url(#hoodieClip)">
            {/* Hoodie Fleece Base */}
            <rect x="180" y="100" width="640" height="800" fill={product.color} />

            {/* Kangaroo Pocket */}
            <path
              d="M400 620 L600 620 L620 770 L380 770 Z"
              fill={product.color}
              stroke="#000000"
              strokeWidth="6"
              opacity="0.9"
            />
            {/* Pocket slant openings */}
            <path d="M400 620 L380 720" stroke="#000000" strokeWidth="8" opacity="0.3" />
            <path d="M600 620 L620 720" stroke="#000000" strokeWidth="8" opacity="0.3" />

            {/* LOGO PLACEMENT ON HOODIE */}
            {renderLogoElement()}

            {/* Lighting overlay */}
            <rect x="180" y="100" width="640" height="800" fill="url(#lightingGrad)" style={{ pointerEvents: 'none' }} />
          </g>

          {/* Drawstrings & Hood Collar */}
          <path d="M370 170 C440 260 560 260 630 170" fill="none" stroke="#000000" strokeWidth="14" opacity="0.35" />
          {/* Braided Drawstrings */}
          <path d="M460 220 Q450 330 460 380" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <rect x="457" y="380" width="6" height="18" rx="2" fill="#94a3b8" />
          <path d="M540 220 Q550 330 540 380" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <rect x="537" y="380" width="6" height="18" rx="2" fill="#94a3b8" />
        </g>
      )}

      {product.id === 'tumbler' && (
        <g id="product-tumbler">
          {/* Drop shadow */}
          <ellipse cx="500" cy="830" rx="140" ry="25" fill="#000000" opacity="0.45" filter="url(#groundDropShadow)" />

          {/* Tumbler Body */}
          <g clipPath="url(#tumblerClip)">
            <rect x="360" y="270" width="280" height="560" fill={product.color} />

            {/* Cylindrical Metallic Reflection */}
            <linearGradient id="steelGleam" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
              <stop offset="25%" stopColor="#ffffff" stopOpacity="0.4" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="75%" stopColor="#ffffff" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
            </linearGradient>
            <rect x="360" y="270" width="280" height="560" fill="url(#steelGleam)" />

            {/* LOGO ON TUMBLER */}
            {renderLogoElement()}

            {/* Surface shine over logo */}
            <rect x="360" y="270" width="280" height="560" fill="url(#steelGleam)" opacity="0.25" style={{ pointerEvents: 'none' }} />
          </g>

          {/* Tumbler Acrylic Top Lid & Beveled Lip */}
          <rect x="365" y="250" width="270" height="30" rx="8" fill="#334155" />
          <rect x="440" y="235" width="120" height="18" rx="6" fill="#1e293b" />
          <line x1="365" y1="280" x2="635" y2="280" stroke="#cbd5e1" strokeWidth="4" />
        </g>
      )}

      {product.id === 'tote' && (
        <g id="product-tote">
          {/* Ground shadow */}
          <ellipse cx="500" cy="870" rx="230" ry="32" fill="#000000" opacity="0.38" filter="url(#groundDropShadow)" />

          {/* Tote Straps */}
          <path d="M380 400 C380 180 440 180 440 400" fill="none" stroke={product.color} strokeWidth="32" />
          <path d="M380 400 C380 180 440 180 440 400" fill="none" stroke="#000000" strokeWidth="32" opacity="0.15" />
          <path d="M560 400 C560 180 620 180 620 400" fill="none" stroke={product.color} strokeWidth="32" />
          <path d="M560 400 C560 180 620 180 620 400" fill="none" stroke="#000000" strokeWidth="32" opacity="0.15" />

          {/* Tote Body */}
          <g clipPath="url(#toteClip)">
            <rect x="260" y="360" width="480" height="520" fill={product.color} />

            {/* Canvas Texture */}
            <defs>
              <pattern id="canvasWeave" width="6" height="6" patternUnits="userSpaceOnUse">
                <rect width="3" height="3" fill="#000000" opacity="0.04" />
                <rect x="3" y="3" width="3" height="3" fill="#ffffff" opacity="0.05" />
              </pattern>
            </defs>
            <rect x="260" y="360" width="480" height="520" fill="url(#canvasWeave)" />

            {/* Fold wrinkles */}
            <path d="M340 420 Q320 620 330 840" stroke="#000000" strokeWidth="16" opacity="0.1" />
            <path d="M660 420 Q680 620 670 840" stroke="#000000" strokeWidth="16" opacity="0.1" />

            {/* LOGO ON TOTE */}
            {renderLogoElement()}

            <rect x="260" y="360" width="480" height="520" fill="url(#lightingGrad)" style={{ pointerEvents: 'none' }} />
          </g>

          {/* Top border stitching */}
          <line x1="280" y1="390" x2="720" y2="390" stroke="#000000" strokeWidth="3" strokeDasharray="6 4" opacity="0.3" />
        </g>
      )}

      {product.id === 'cap' && (
        <g id="product-cap">
          <ellipse cx="500" cy="620" rx="250" ry="40" fill="#000000" opacity="0.4" filter="url(#groundDropShadow)" />

          {/* Cap Crown Dome */}
          <g clipPath="url(#capClip)">
            <ellipse cx="500" cy="460" rx="260" ry="190" fill={product.color} />
            <ellipse cx="500" cy="460" rx="260" ry="190" fill="url(#lightingGrad)" />

            {/* Cap Panels Seam Lines */}
            <path d="M500 280 L500 560" stroke="#000000" strokeWidth="4" opacity="0.3" />
            <path d="M500 280 Q400 400 320 540" stroke="#000000" strokeWidth="4" opacity="0.25" />
            <path d="M500 280 Q600 400 680 540" stroke="#000000" strokeWidth="4" opacity="0.25" />

            {/* LOGO ON CAP FRONT */}
            {renderLogoElement()}
          </g>

          {/* Button on top */}
          <ellipse cx="500" cy="275" rx="14" ry="9" fill={product.color} stroke="#000000" strokeWidth="3" />

          {/* Curved Visor / Bill */}
          <path
            d="M260 520 C320 620 680 620 740 520 C700 660 300 660 260 520 Z"
            fill={product.color}
            filter="url(#softShadow)"
          />
          {/* Visor rows of stitching */}
          <path d="M300 550 C380 625 620 625 700 550" fill="none" stroke="#000000" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.3" />
          <path d="M320 570 C390 635 610 635 680 570" fill="none" stroke="#000000" strokeWidth="2.5" strokeDasharray="5 3" opacity="0.3" />
        </g>
      )}

      {product.id === 'pin' && (
        <g id="product-pin">
          <circle cx="500" cy="500" r="230" fill="#000000" opacity="0.45" filter="url(#groundDropShadow)" />

          {/* Pin Metallic Beveled Rim */}
          <circle cx="500" cy="500" r="220" fill="#cbd5e1" stroke="#64748b" strokeWidth="8" />
          <circle cx="500" cy="500" r="208" fill={product.color} />

          {/* LOGO ON PIN */}
          {renderLogoElement()}

          {/* Dome Glass Convex Reflection */}
          <path
            d="M320 380 C360 320 640 320 680 380 C600 370 400 370 320 380 Z"
            fill="#ffffff"
            opacity="0.5"
            style={{ pointerEvents: 'none' }}
          />
          <ellipse cx="500" cy="500" rx="205" ry="205" fill="none" stroke="#ffffff" strokeWidth="4" opacity="0.3" />
        </g>
      )}

      {product.id === 'phone-case' && (
        <g id="product-phone-case">
          <rect x="330" y="240" width="340" height="600" rx="55" fill="#000000" opacity="0.45" filter="url(#groundDropShadow)" />

          <g clipPath="url(#phoneCaseClip)">
            <rect x="320" y="230" width="360" height="620" fill={product.color} />

            {/* Glossy Sheen */}
            <linearGradient id="caseSheen" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.4" />
            </linearGradient>
            <rect x="320" y="230" width="360" height="620" fill="url(#caseSheen)" />

            {/* LOGO ON PHONE CASE */}
            {renderLogoElement()}
          </g>

          {/* Camera Bump Cutout */}
          <rect x="360" y="270" width="105" height="115" rx="26" fill="#18181b" stroke="#3f3f46" strokeWidth="5" />
          <circle cx="390" cy="305" r="16" fill="#09090b" stroke="#52525b" strokeWidth="3" />
          <circle cx="390" cy="350" r="16" fill="#09090b" stroke="#52525b" strokeWidth="3" />
          <circle cx="435" cy="305" r="12" fill="#09090b" stroke="#52525b" strokeWidth="3" />
          <circle cx="435" cy="345" r="6" fill="#fef08a" />
        </g>
      )}
    </svg>
  );
};
