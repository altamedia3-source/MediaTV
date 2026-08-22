import React from 'react';

interface Clock3DProps {
  time: Date;
  color?: string; // Hex color for active LED
  showSeconds?: boolean;
}

// 7-Segment activation mapping: [a, b, c, d, e, f, g]
//
//        -- a --
//      |         |
//      f         b
//      |         |
//        -- g --
//      |         |
//      e         c
//      |         |
//        -- d --
//
const SEGMENT_MAP: Record<string, number[]> = {
  '0': [1, 1, 1, 1, 1, 1, 0],
  '1': [0, 1, 1, 0, 0, 0, 0],
  '2': [1, 1, 0, 1, 1, 0, 1],
  '3': [1, 1, 1, 1, 0, 0, 1],
  '4': [0, 1, 1, 0, 0, 1, 1],
  '5': [1, 0, 1, 1, 0, 1, 1],
  '6': [1, 0, 1, 1, 1, 1, 1],
  '7': [1, 1, 1, 0, 0, 0, 0],
  '8': [1, 1, 1, 1, 1, 1, 1],
  '9': [1, 1, 1, 1, 0, 1, 1],
};

// Precise 3D Segment Paths (viewBox: 0 0 100 160)
// Designed with uniform 16px bar thickness, 45-degree miter joints, and 3px safety gaps
const SEGMENT_PATHS = [
  // a: Top horizontal bar
  { id: 'a', d: 'M 18 10 L 82 10 L 70 24 L 30 24 Z' },
  // b: Top-right vertical bar
  { id: 'b', d: 'M 85 13 L 97 25 L 97 73 L 85 77 L 73 67 L 73 27 Z' },
  // c: Bottom-right vertical bar
  { id: 'c', d: 'M 85 83 L 97 87 L 97 135 L 85 147 L 73 133 L 73 93 Z' },
  // d: Bottom horizontal bar
  { id: 'd', d: 'M 30 136 L 70 136 L 82 150 L 18 150 Z' },
  // e: Bottom-left vertical bar
  { id: 'e', d: 'M 15 83 L 27 93 L 27 133 L 15 147 L 3 135 L 3 87 Z' },
  // f: Top-left vertical bar
  { id: 'f', d: 'M 15 13 L 27 27 L 27 67 L 15 77 L 3 73 L 3 25 Z' },
  // g: Middle horizontal bar (hexagon with pointed ends)
  { id: 'g', d: 'M 19 80 L 29 72 L 71 72 L 81 80 L 71 88 L 29 88 Z' },
];

// Single 3D Digit Housing Component
const DigitModule: React.FC<{ digit: string; color: string; size?: 'normal' | 'small' }> = ({
  digit,
  color,
  size = 'normal',
}) => {
  const activeSegments = SEGMENT_MAP[digit] || [0, 0, 0, 0, 0, 0, 0];

  const width = size === 'small' ? '30px' : '48px';
  const height = size === 'small' ? '50px' : '76px';

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width, height }}
    >
      {/* 3D Outer Bevel Digit Shell */}
      <svg
        viewBox="0 0 100 160"
        className="w-full h-full overflow-visible"
        fill="none"
      >
        <defs>
          {/* Active 3D Phosphor LED Core Gradient */}
          <linearGradient id={`ledCore-${digit}-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="70%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.8" />
          </linearGradient>

          {/* Inactive Deep Smoky Acrylic Track */}
          <linearGradient id="ledOffDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#0f172a" stopOpacity="0.55" />
          </linearGradient>

          {/* 3D Bevel Highlight & Shading Filter */}
          <filter id="chassisGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.8" />
          </filter>
        </defs>

        {/* 3D Digit Outer Chassis Frame (Nordic Octagonal Body) */}
        <path
          d="M 18 4 L 82 4 L 99 21 L 99 139 L 82 156 L 18 156 L 1 139 L 1 21 Z"
          fill="#0a0f1d"
          stroke="#1e293b"
          strokeWidth="2"
          filter="url(#chassisGlow)"
        />

        {/* Upper Inner Cutout (Top Hollow Frame) */}
        <path
          d="M 30 27 L 70 27 L 70 67 L 30 67 Z"
          fill="#060a12"
          stroke="#1e293b"
          strokeWidth="1.2"
        />

        {/* Lower Inner Cutout (Bottom Hollow Frame) */}
        <path
          d="M 30 93 L 70 93 L 70 133 L 30 133 Z"
          fill="#060a12"
          stroke="#1e293b"
          strokeWidth="1.2"
        />

        {/* 7 Segments Rendering */}
        {SEGMENT_PATHS.map((seg, idx) => {
          const isActive = activeSegments[idx] === 1;
          return (
            <g key={seg.id}>
              {/* Segment Bar Base */}
              <path
                d={seg.d}
                fill={isActive ? `url(#ledCore-${digit}-${size})` : 'url(#ledOffDark)'}
                stroke={isActive ? 'rgba(255,255,255,0.85)' : 'rgba(30,41,59,0.45)'}
                strokeWidth={isActive ? '1.2' : '0.8'}
                strokeLinejoin="round"
                style={{
                  filter: isActive 
                    ? `drop-shadow(0 0 5px ${color}) drop-shadow(0 0 12px ${color}bb)` 
                    : 'none',
                  transition: 'fill 0.12s ease-out, filter 0.12s ease-out'
                }}
              />

              {/* 3D High-Gloss Center Specular Strip (Active only) */}
              {isActive && (
                <path
                  d={seg.d}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="0.8"
                  opacity="0.9"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

// 3D Colon Separator (Two Cylindrical Glowing Domes)
const ColonModule: React.FC<{ color: string }> = ({ color }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-1.5 py-1">
      {/* Top Colon Dot */}
      <div 
        className="w-3.5 h-3.5 rounded-full bg-white animate-pulse"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: `0 0 8px #ffffff, 0 0 16px ${color}, 0 0 24px ${color}aa, inset 0 1px 2px #ffffff`,
          border: '1px solid rgba(255,255,255,0.9)'
        }}
      />
      {/* Bottom Colon Dot */}
      <div 
        className="w-3.5 h-3.5 rounded-full bg-white animate-pulse"
        style={{
          backgroundColor: '#ffffff',
          boxShadow: `0 0 8px #ffffff, 0 0 16px ${color}, 0 0 24px ${color}aa, inset 0 1px 2px #ffffff`,
          border: '1px solid rgba(255,255,255,0.9)'
        }}
      />
    </div>
  );
};

export const Clock3D: React.FC<Clock3DProps> = ({
  time,
  color = '#ffffff',
  showSeconds = false,
}) => {
  const hours = String(time.getHours()).padStart(2, '0');
  const minutes = String(time.getMinutes()).padStart(2, '0');
  const seconds = String(time.getSeconds()).padStart(2, '0');

  return (
    <div className="inline-flex items-center gap-2 p-2.5 bg-gradient-to-b from-[#0e1628] via-[#090e1a] to-[#04070d] rounded-2xl border border-slate-700/60 shadow-[0_12px_28px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.15)] backdrop-blur-md">
      {/* Hour Block (Tens + Units) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#070b14]/70 rounded-xl border border-slate-800/80 shadow-inner">
        <DigitModule digit={hours[0]} color={color} />
        <DigitModule digit={hours[1]} color={color} />
      </div>

      {/* 3D Pulsing Colon */}
      <ColonModule color={color} />

      {/* Minute Block (Tens + Units) */}
      <div className="flex items-center gap-1.5 p-1 bg-[#070b14]/70 rounded-xl border border-slate-800/80 shadow-inner">
        <DigitModule digit={minutes[0]} color={color} />
        <DigitModule digit={minutes[1]} color={color} />
      </div>

      {/* Optional Seconds Block */}
      {showSeconds && (
        <>
          <div className="w-[1.5px] h-12 bg-slate-800 mx-1" />
          <div className="flex items-center gap-1 p-1 bg-[#070b14]/70 rounded-xl border border-slate-800/80 shadow-inner opacity-95">
            <DigitModule digit={seconds[0]} color={color} size="small" />
            <DigitModule digit={seconds[1]} color={color} size="small" />
          </div>
        </>
      )}
    </div>
  );
};
