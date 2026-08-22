import React, { useMemo } from 'react';
import { TextItem } from '../types';
import { motion } from 'motion/react';

interface MagicTickerProps {
  tickerTexts: TextItem[];
  textColor?: string;
}

interface StardustMote {
  id: number;
  top: number;
  left: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
}

// 4-point Enchanted Star Gem Separator
const StarGemSeparator: React.FC = () => {
  return (
    <span className="inline-flex items-center justify-center mx-6 relative align-middle select-none shrink-0">
      <svg 
        viewBox="0 0 24 24" 
        className="w-5 h-5 animate-[star-spin-twinkle_3s_ease-in-out_infinite]"
        fill="none"
      >
        <path 
          d="M12 0 L14.8 9.2 L24 12 L14.8 14.8 L12 24 L9.2 14.8 L0 12 L9.2 9.2 Z" 
          fill="url(#starGoldCyan)"
        />
        <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
        <defs>
          <linearGradient id="starGoldCyan" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>
      {/* Soft Star Glow */}
      <span className="absolute w-2 h-2 rounded-full bg-amber-400/80 blur-xs animate-ping" />
    </span>
  );
};

export const MagicTicker: React.FC<MagicTickerProps> = ({
  tickerTexts,
  textColor = '#ffffff',
}) => {
  const activeTexts = tickerTexts.filter(t => t.active);

  // Background floating stardust motes
  const stardustMotes: StardustMote[] = useMemo(() => {
    const colors = ['#fbbf24', '#fde047', '#38bdf8', '#67e8f9', '#ffffff'];
    const list: StardustMote[] = [];
    const count = 16;

    for (let i = 0; i < count; i++) {
      list.push({
        id: i,
        top: Math.random() * 65 + 15,
        left: Math.random() * 96 + 2,
        size: Math.random() * 3.5 + 2.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        duration: Math.random() * 3 + 3,
        delay: Math.random() * 3,
      });
    }
    return list;
  }, []);

  const itemsToRender = activeTexts.length > 0 
    ? activeTexts 
    : [{ id: 0, type: 'ticker' as const, content: 'Selamat Datang di Media TV Informasi', active: true, order: 0 }];

  // Calculate dynamic duration based on total text length so speed is pleasant
  const totalLength = itemsToRender.reduce((acc, curr) => acc + curr.content.length, 0);
  const calculatedDuration = Math.max(20, Math.min(65, Math.round(totalLength * 0.45)));

  const textGroup = (
    <div className="flex items-center shrink-0">
      {itemsToRender.map((item, idx) => (
        <span key={`ticker-item-${item.id || idx}`} className="flex items-center shrink-0">
          <span className="text-xl md:text-2xl font-medium tracking-wide">
            {item.content}
          </span>
          <StarGemSeparator />
        </span>
      ))}
    </div>
  );

  return (
    <div className="relative flex-1 overflow-hidden h-full flex items-center select-none">
      
      {/* Background Stardust Motes Trail */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {stardustMotes.map((m) => (
          <div
            key={m.id}
            className="absolute rounded-full pointer-events-none animate-[stardust-orbit_5s_ease-in-out_infinite]"
            style={{
              top: `${m.top}%`,
              left: `${m.left}%`,
              width: `${m.size}px`,
              height: `${m.size}px`,
              backgroundColor: m.color,
              boxShadow: `0 0 6px ${m.color}, 0 0 12px ${m.color}88`,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Left Portal Fade (Ethereal mist entrance) */}
      <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-[#0b1426] via-[#0b1426]/70 to-transparent z-20 pointer-events-none" />

      {/* Right Portal Fade (Ethereal mist exit) */}
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[#0b1426] via-[#0b1426]/70 to-transparent z-20 pointer-events-none" />

      {/* Hardware-Accelerated Smooth Motion Marquee */}
      <motion.div 
        className="flex items-center whitespace-nowrap z-10 shrink-0"
        style={{
          color: textColor,
          textShadow: '0 0 10px rgba(56, 189, 248, 0.4), 0 0 20px rgba(251, 191, 36, 0.25)',
          width: 'max-content',
        }}
        animate={{ x: ['0%', '-50%'] }}
        transition={{
          repeat: Infinity,
          ease: 'linear',
          duration: calculatedDuration,
        }}
      >
        {textGroup}
        {textGroup}
      </motion.div>
    </div>
  );
};
