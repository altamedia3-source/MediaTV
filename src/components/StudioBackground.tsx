import React from 'react';

export function StudioBackground({ isLightOn }: { isLightOn: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* 1. Base Ambient Wall */}
      <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${isLightOn ? 'bg-[#141419]' : 'bg-[#030303]'}`} />

      {/* 2. Luxury Acoustic Slat Wall Texture */}
      <div 
        className="absolute inset-0 opacity-[0.35] mix-blend-overlay"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 2px, transparent 2px, transparent 48px)',
        }} 
      />
      <div 
        className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
        style={{ 
          backgroundImage: 'repeating-linear-gradient(0deg, #000 0px, #000 1px, transparent 1px, transparent 120px)' 
        }} 
      />

      {/* 3. Main Lamp Glow on Wall */}
      <div 
        className={`absolute top-[10%] left-[5%] w-[50vw] h-[80vh] rounded-full transition-all duration-1000 ease-in-out ${isLightOn ? 'opacity-50 scale-100' : 'opacity-0 scale-90'}`} 
        style={{ 
          background: 'radial-gradient(circle at 40% 50%, rgba(253, 230, 138, 0.5) 0%, rgba(217, 119, 6, 0.15) 40%, rgba(0,0,0,0) 70%)', 
          filter: 'blur(70px)'
        }} 
      />

      {/* 4. Cinematic Bokeh (Out of Focus Lights in far background) */}
      <div className={`absolute top-[20%] right-[20%] w-[350px] h-[350px] rounded-full transition-all duration-1000 ease-in-out delay-100 ${isLightOn ? 'opacity-20 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}`} 
           style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.9) 0%, transparent 60%)', filter: 'blur(60px)' }} />
      <div className={`absolute bottom-[40%] right-[8%] w-[200px] h-[200px] rounded-full transition-all duration-1000 ease-in-out delay-200 ${isLightOn ? 'opacity-[0.15] translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`} 
           style={{ background: 'radial-gradient(circle, rgba(253,230,138,0.9) 0%, transparent 60%)', filter: 'blur(40px)' }} />

      {/* 5. Vignette (Darkens the corners of the room) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(0,0,0,0.95)_100%)]" />

      {/* 6. Desk / Surface Area (Bottom 32vh) */}
      <div className="absolute bottom-0 left-0 w-full h-[32vh]">
         {/* Desk Base Color */}
         <div className={`absolute inset-0 transition-colors duration-1000 ease-in-out ${isLightOn ? 'bg-[#0d0d10]' : 'bg-[#000000]'}`} />
         
         {/* Desk Edge Highlight (The crisp line separating wall from table) */}
         <div className={`absolute top-0 left-0 w-full h-[1px] transition-opacity duration-1000 ease-in-out ${isLightOn ? 'bg-gradient-to-r from-transparent via-yellow-600/70 to-transparent opacity-100' : 'opacity-0'}`} />
         
         {/* Desk Surface Reflection (Glossy Table effect) */}
         <div 
            className={`absolute top-0 left-0 w-full h-full transition-all duration-1000 ease-in-out ${isLightOn ? 'opacity-100' : 'opacity-0'}`} 
            style={{ 
              background: 'radial-gradient(ellipse at 30% 0%, rgba(253, 230, 138, 0.12) 0%, rgba(217, 119, 6, 0.04) 45%, rgba(0,0,0,0) 80%)' 
            }} 
         />
         
         {/* Deep Shadow at the very bottom */}
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent" />
      </div>
    </div>
  );
}
