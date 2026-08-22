import React from 'react';

export function StudioBackground({ isLightOn }: { isLightOn: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Ambient Wall (Warm Maroon/Brown from image) */}
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${isLightOn ? 'bg-[#3b1510]' : 'bg-[#0f0504]'}`} />

      {/* 2. Subtle Wallpaper/Wall Texture */}
      <div className="absolute inset-0 opacity-[0.25] mix-blend-overlay"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 0px, #000 2px, transparent 2px, transparent 12px)' }} />

      {/* 3. Main Lamp Glow on Wall */}
      <div 
        className={`absolute top-[5%] left-[5%] w-[60vw] h-[90vh] rounded-full transition-all duration-1000 ease-in-out ${isLightOn ? 'opacity-80 scale-100' : 'opacity-0 scale-90'}`} 
        style={{ 
          background: 'radial-gradient(circle at 40% 50%, rgba(253, 230, 138, 0.4) 0%, rgba(220, 38, 38, 0.15) 50%, rgba(0,0,0,0) 80%)', 
          filter: 'blur(80px)'
        }} 
      />

      {/* 4. Vignette (Darkens the corners of the room) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.95)_100%)]" />

      {/* 5. Desk / Surface Area (Warm Wood tone) */}
      <div className="absolute bottom-0 left-0 w-full h-[32vh]">
         {/* Desk Base Color */}
         <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${isLightOn ? 'bg-[#261309]' : 'bg-[#050302]'}`} />
         
         {/* Desk Edge Highlight */}
         <div className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-1000 ease-in-out ${isLightOn ? 'bg-gradient-to-r from-transparent via-orange-400/50 to-transparent opacity-100' : 'opacity-0'}`} />
         
         {/* Desk Surface Wood Grain / Reflection */}
         <div 
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${isLightOn ? 'opacity-100' : 'opacity-0'}`} 
            style={{ background: 'radial-gradient(ellipse at 30% 0%, rgba(253, 230, 138, 0.15) 0%, rgba(217, 119, 6, 0.05) 50%, rgba(0,0,0,0) 80%)' }} 
         />
         <div className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 20px)' }} />
         
         {/* Deep Shadow at the very bottom */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>
    </div>
  );
}
