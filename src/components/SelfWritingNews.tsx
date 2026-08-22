import React, { useState, useEffect, useMemo } from 'react';
import { TextItem } from '../types';
import { Feather, Sparkles, Wand2 } from 'lucide-react';

interface SelfWritingNewsProps {
  newsList: TextItem[];
  textColor?: string;
  speed?: 'fast' | 'normal' | 'slow';
  readingDuration?: number;
  enableAnimation?: boolean;
}

type WritingState = 'WRITING' | 'READING' | 'EVANESCO' | 'PAUSE';

interface SparkleParticle {
  id: number;
  x: number; // percentage
  y: number; // percentage
  size: number;
  color: string;
  delay: number;
  duration: number;
  dx: number;
}

export const SelfWritingNews: React.FC<SelfWritingNewsProps> = ({
  newsList,
  textColor = '#e2e8f0',
  speed = 'normal',
  readingDuration = 6,
  enableAnimation = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [writingState, setWritingState] = useState<WritingState>('WRITING');
  const [magicParticles, setMagicParticles] = useState<SparkleParticle[]>([]);

  const activeNewsList = newsList.filter(n => n.active);
  const currentItem = activeNewsList[currentIndex];
  const fullText = currentItem?.content || '';

  // Calculate typing interval speed in ms
  const getTypingSpeed = () => {
    switch (speed) {
      case 'fast': return 25;
      case 'slow': return 65;
      default: return 40;
    }
  };

  // Generate magical dust sparkles for Evanesco spell
  const generateEvanescoDust = () => {
    const colors = [
      '#fbbf24', // Gold
      '#fde047', // Light Gold
      '#38bdf8', // Sky Cyan
      '#67e8f9', // Bright Cyan
      '#ffffff', // White Star
      '#a855f7', // Soft Violet Glow
    ];

    const particles: SparkleParticle[] = [];
    const count = 45;

    for (let i = 0; i < count; i++) {
      particles.push({
        id: i,
        x: Math.random() * 92 + 4, // 4% to 96%
        y: Math.random() * 85 + 10, // 10% to 95%
        size: Math.random() * 8 + 4, // 4px to 12px
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.45,
        duration: Math.random() * 0.6 + 0.9, // 0.9s to 1.5s
        dx: (Math.random() - 0.5) * 40, // Drift left or right
      });
    }

    setMagicParticles(particles);
  };

  // Reset if active news items change
  useEffect(() => {
    if (currentIndex >= activeNewsList.length) {
      setCurrentIndex(0);
    }
  }, [activeNewsList.length]);

  useEffect(() => {
    if (!enableAnimation || activeNewsList.length === 0 || !fullText) {
      return;
    }

    let timer: NodeJS.Timeout;

    if (writingState === 'WRITING') {
      if (charCount < fullText.length) {
        timer = setTimeout(() => {
          setCharCount(prev => prev + 1);
        }, getTypingSpeed());
      } else {
        // Finished writing, switch to reading phase
        setWritingState('READING');
      }
    } else if (writingState === 'READING') {
      // Reading phase
      timer = setTimeout(() => {
        // Trigger Evanesco Magical Sparkling Dust Spell
        generateEvanescoDust();
        setWritingState('EVANESCO');
      }, readingDuration * 1000);
    } else if (writingState === 'EVANESCO') {
      // Magical dissolve duration (1.6s)
      timer = setTimeout(() => {
        setWritingState('PAUSE');
      }, 1600);
    } else if (writingState === 'PAUSE') {
      timer = setTimeout(() => {
        setCurrentIndex(prev => (prev + 1) % activeNewsList.length);
        setCharCount(0);
        setMagicParticles([]);
        setWritingState('WRITING');
      }, 250);
    }

    return () => clearTimeout(timer);
  }, [charCount, writingState, fullText, enableAnimation, activeNewsList.length, speed, readingDuration]);

  if (activeNewsList.length === 0) {
    return (
      <div className="text-slate-500 italic text-center mt-10 text-sm">
        Belum ada berita aktif.
      </div>
    );
  }

  // Non-animated fallback
  if (!enableAnimation) {
    return (
      <div className="space-y-4 overflow-y-auto pr-1">
        {activeNewsList.map((news) => (
          <div key={news.id} className="p-3.5 bg-blue-950/30 rounded-xl border border-blue-900/40">
            <p className="text-base leading-relaxed font-medium" style={{ color: textColor }}>
              {news.content}
            </p>
          </div>
        ))}
      </div>
    );
  }

  const displayedText = fullText.slice(0, charCount);

  return (
    <div className="flex flex-col h-full justify-between">
      {/* Main Quill Writing Container */}
      <div className="relative p-5 bg-gradient-to-b from-[#0e1b33]/80 to-[#091224]/90 rounded-2xl border border-blue-800/40 shadow-inner flex-1 flex flex-col justify-between overflow-hidden">
        
        {/* Glowing Watermark / Background Feather Accents */}
        <div className="absolute top-2 right-2 opacity-5 pointer-events-none text-blue-300">
          <Feather className="w-32 h-32 transform rotate-12" />
        </div>

        {/* Text Content Area */}
        <div className="relative z-10 min-h-[140px]">
          
          {/* Active Writing & Reading View */}
          {writingState !== 'EVANESCO' && writingState !== 'PAUSE' && (
            <div 
              className="text-lg md:text-xl leading-relaxed font-medium tracking-wide break-words transition-all duration-300"
              style={{ color: textColor }}
            >
              {displayedText}

              {/* Self-Writing Quill Nib & Feather Cursor */}
              {writingState === 'WRITING' && (
                <span 
                  className="inline-block relative select-none pointer-events-none"
                  style={{
                    verticalAlign: '-2px',
                    marginLeft: '2px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  {/* SVG Feather with Nib Tip anchored directly at Bottom-Left (2, 30) */}
                  <svg
                    className="w-8 h-8 overflow-visible animate-[quill_0.35s_ease-in-out_infinite]"
                    viewBox="0 0 32 32"
                    fill="none"
                    style={{
                      transformOrigin: '2px 30px',
                      filter: 'drop-shadow(0 0 5px rgba(56, 189, 248, 0.7))'
                    }}
                  >
                    {/* Glowing Ink Contact Point at (2, 30) */}
                    <circle cx="2" cy="30" r="2.5" fill="#38bdf8" className="animate-pulse" />
                    <circle cx="2" cy="30" r="4.5" fill="none" stroke="#38bdf8" strokeWidth="1" opacity="0.6" className="animate-ping" />

                    {/* Sharp Metallic Nib Collar from (2, 30) to (8, 24) */}
                    <path
                      d="M2 30 L6.5 22 L11 26.5 Z"
                      fill="#38bdf8"
                      stroke="#e0f2fe"
                      strokeWidth="0.8"
                    />
                    {/* Nib Ink Breathing Slit */}
                    <line x1="2" y1="30" x2="8" y2="24.5" stroke="#0c4a6e" strokeWidth="0.8" />

                    {/* Feather Shaft (Spine) stretching upwards to (30, 2) */}
                    <line x1="8" y1="24.5" x2="30" y2="2" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />

                    {/* Feather Plume (Bulu Bagian Atas) */}
                    <path
                      d="M9 22 C11 15 17 9 30 2 C22 6 16 13 12 19 Z"
                      fill="rgba(56, 189, 248, 0.55)"
                      stroke="#38bdf8"
                      strokeWidth="0.9"
                      strokeLinejoin="round"
                    />

                    {/* Feather Plume (Bulu Bagian Bawah) */}
                    <path
                      d="M13 25 C18 21 24 14 30 2 C25 8 19 17 11 23 Z"
                      fill="rgba(14, 165, 233, 0.4)"
                      stroke="#0284c7"
                      strokeWidth="0.9"
                      strokeLinejoin="round"
                    />

                    {/* Feather Vane Texture Strands */}
                    <line x1="13" y1="17" x2="17" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6" />
                    <line x1="17" y1="13" x2="22" y2="9" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6" />
                    <line x1="21" y1="9" x2="26" y2="5" stroke="rgba(255,255,255,0.7)" strokeWidth="0.6" />
                  </svg>
                </span>
              )}

              {/* Reading Sparkle at End of Text */}
              {writingState === 'READING' && (
                <span className="inline-flex items-center ml-2 text-cyan-400 animate-pulse">
                  <Sparkles className="w-4 h-4" />
                </span>
              )}
            </div>
          )}

          {/* Harry Potter Evanesco Spell Dissolve Phase */}
          {writingState === 'EVANESCO' && (
            <div className="relative">
              {/* Vanishing Shimmer Text */}
              <div 
                className="text-lg md:text-xl leading-relaxed font-medium tracking-wide break-words animate-[evanesco-text_1.6s_ease-out_forwards]"
                style={{ color: textColor }}
              >
                {fullText}
              </div>

              {/* Floating Magical Sparkling Dust Particles */}
              <div className="absolute inset-0 pointer-events-none overflow-visible">
                {magicParticles.map((p) => (
                  <div
                    key={p.id}
                    className="absolute animate-[spark-rise_1.3s_ease-out_forwards] flex items-center justify-center"
                    style={{
                      left: `${p.x}%`,
                      top: `${p.y}%`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                      ['--dx' as any]: `${p.dx}px`,
                    }}
                  >
                    {/* Glowing Magic Star Dust */}
                    {p.id % 2 === 0 ? (
                      <svg 
                        viewBox="0 0 24 24" 
                        className="overflow-visible"
                        style={{ 
                          width: `${p.size}px`, 
                          height: `${p.size}px`,
                          filter: `drop-shadow(0 0 6px ${p.color}) drop-shadow(0 0 12px ${p.color})`,
                          fill: p.color
                        }}
                      >
                        <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
                      </svg>
                    ) : (
                      <div 
                        className="rounded-full animate-ping"
                        style={{
                          width: `${p.size * 0.7}px`,
                          height: `${p.size * 0.7}px`,
                          backgroundColor: p.color,
                          boxShadow: `0 0 10px ${p.color}, 0 0 18px ${p.color}`
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Status / News Index Indicators */}
        <div className="mt-6 pt-4 border-t border-blue-900/40 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              writingState === 'WRITING' ? 'bg-cyan-400 animate-ping' :
              writingState === 'READING' ? 'bg-emerald-400' :
              writingState === 'EVANESCO' ? 'bg-amber-400 animate-ping shadow-[0_0_8px_#fbbf24]' : 'bg-slate-500'
            }`} />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              {writingState === 'WRITING' && 'Sedang Menulis...'}
              {writingState === 'READING' && 'Selesai Ditulis'}
              {writingState === 'EVANESCO' && '✨ Menghilang Secara Magis...'}
              {writingState === 'PAUSE' && 'Memuat Berita Berikutnya...'}
            </span>
          </div>

          {/* Dots Indicator */}
          {activeNewsList.length > 1 && (
            <div className="flex items-center gap-1.5">
              {activeNewsList.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentIndex 
                      ? 'w-5 bg-cyan-400 shadow-[0_0_6px_rgba(56,189,248,0.8)]' 
                      : 'w-1.5 bg-slate-700'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
