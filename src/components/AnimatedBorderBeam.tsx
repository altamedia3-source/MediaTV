import React, { useRef, useEffect } from 'react';

interface AnimatedBorderBeamProps {
  color?: string;
  duration?: number;
  className?: string;
  delay?: number;
  beamCount?: number;
}

// Function to calculate exact (x, y) along a rounded rectangle perimeter
function getRoundedRectPoint(dist: number, width: number, height: number, radius: number) {
  const w = width;
  const h = height;
  const r = Math.min(radius, Math.min(w / 2, h / 2));
  
  const straightW = Math.max(0, w - 2 * r);
  const straightH = Math.max(0, h - 2 * r);
  const arcLen = (Math.PI * r) / 2;
  
  const perimeter = 2 * straightW + 2 * straightH + 4 * arcLen;
  if (perimeter <= 0) return { x: 0, y: 0 };

  // Normalize distance into [0, perimeter)
  let d = ((dist % perimeter) + perimeter) % perimeter;

  // 1. Top Straight (left to right)
  if (d <= straightW) {
    return { x: r + d, y: 0 };
  }
  d -= straightW;

  // 2. Top-Right Arc
  if (d <= arcLen) {
    const angle = -Math.PI / 2 + (d / arcLen) * (Math.PI / 2);
    return {
      x: w - r + Math.cos(angle) * r,
      y: r + Math.sin(angle) * r,
    };
  }
  d -= arcLen;

  // 3. Right Straight (top to bottom)
  if (d <= straightH) {
    return { x: w, y: r + d };
  }
  d -= straightH;

  // 4. Bottom-Right Arc
  if (d <= arcLen) {
    const angle = 0 + (d / arcLen) * (Math.PI / 2);
    return {
      x: w - r + Math.cos(angle) * r,
      y: h - r + Math.sin(angle) * r,
    };
  }
  d -= arcLen;

  // 5. Bottom Straight (right to left)
  if (d <= straightW) {
    return { x: w - r - d, y: h };
  }
  d -= straightW;

  // 6. Bottom-Left Arc
  if (d <= arcLen) {
    const angle = Math.PI / 2 + (d / arcLen) * (Math.PI / 2);
    return {
      x: r + Math.cos(angle) * r,
      y: h - r + Math.sin(angle) * r,
    };
  }
  d -= arcLen;

  // 7. Left Straight (bottom to top)
  if (d <= straightH) {
    return { x: 0, y: h - r - d };
  }
  d -= straightH;

  // 8. Top-Left Arc
  const angle = Math.PI + (d / arcLen) * (Math.PI / 2);
  return {
    x: r + Math.cos(angle) * r,
    y: r + Math.sin(angle) * r,
  };
}

export function AnimatedBorderBeam({
  color = "#38bdf8",
  duration = 6,
  className = "",
  delay = 0,
  beamCount = 1,
}: AnimatedBorderBeamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = 0;
    let height = 0;
    const radius = 12;
    const strokePadding = 2; // Offset from border edge

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      width = Math.round(rect.width);
      height = Math.round(rect.height);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const startTime = performance.now();

    const draw = (now: number) => {
      if (width <= 0 || height <= 0) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const effectiveW = width - strokePadding * 2;
      const effectiveH = height - strokePadding * 2;
      const straightW = Math.max(0, effectiveW - 2 * radius);
      const straightH = Math.max(0, effectiveH - 2 * radius);
      const perimeter = 2 * straightW + 2 * straightH + 2 * Math.PI * radius;

      const elapsed = (now - startTime) / 1000;
      const tailLength = Math.min(180, Math.max(70, perimeter * 0.18));
      const steps = 36; // Fine sampling for silky smooth tapered line

      for (let b = 0; b < beamCount; b++) {
        const offsetFraction = b / beamCount;
        const currentPos = ((elapsed + delay) / duration + offsetFraction) % 1;
        const headDist = currentPos * perimeter;

        // Draw the tapered glowing tail
        for (let i = 0; i < steps; i++) {
          const t1 = i / steps;
          const t2 = (i + 1) / steps;

          // Non-linear easing for smooth comet taper
          const alpha1 = Math.pow(t1, 1.8) * 0.95;
          const alpha2 = Math.pow(t2, 1.8) * 0.95;
          const lineW = 0.8 + t2 * 1.8; // Taper from 0.8px to 2.6px

          const d1 = headDist - tailLength * (1 - t1);
          const d2 = headDist - tailLength * (1 - t2);

          const p1 = getRoundedRectPoint(d1, effectiveW, effectiveH, radius);
          const p2 = getRoundedRectPoint(d2, effectiveW, effectiveH, radius);

          ctx.beginPath();
          ctx.moveTo(strokePadding + p1.x, strokePadding + p1.y);
          ctx.lineTo(strokePadding + p2.x, strokePadding + p2.y);
          ctx.strokeStyle = color;
          ctx.globalAlpha = (alpha1 + alpha2) / 2;
          ctx.lineWidth = lineW;
          ctx.lineCap = 'round';
          ctx.shadowBlur = 0;
          ctx.stroke();
        }

        // Draw the glowing white bead head at the tip
        const headPoint = getRoundedRectPoint(headDist, effectiveW, effectiveH, radius);
        const hx = strokePadding + headPoint.x;
        const hy = strokePadding + headPoint.y;

        // 1. Outer halo glow
        ctx.save();
        ctx.globalAlpha = 0.5;
        ctx.shadowColor = color;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(hx, hy, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        // 2. Inner bright white core bead
        ctx.globalAlpha = 1.0;
        ctx.shadowColor = '#ffffff';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.restore();
      }

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [color, duration, delay, beamCount]);

  return (
    <div 
      ref={containerRef} 
      className={`absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden z-20 ${className}`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
    </div>
  );
}
