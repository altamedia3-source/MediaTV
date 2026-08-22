import React from 'react';

export function LampIllustration({ isOn = true, onToggle }: { isOn?: boolean, onToggle?: () => void }) {
  return (
    <div 
      className="relative w-[400px] h-[550px] flex flex-col items-center justify-end pb-8 cursor-pointer group"
      onClick={onToggle}
      title="Click to toggle lamp"
    >
      
      {/* --- FLOOR SPOTLIGHT --- */}
      <div className={`absolute bottom-[20px] w-[450px] h-[80px] rounded-[50%] transition-opacity duration-1000 pointer-events-none ${isOn ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.6) 0%, rgba(217, 119, 6, 0.2) 50%, rgba(0,0,0,0) 70%)' }} />
      <div className={`absolute bottom-[30px] w-[250px] h-[40px] rounded-[50%] transition-opacity duration-1000 pointer-events-none ${isOn ? 'opacity-100' : 'opacity-0'}`}
           style={{ background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.8) 0%, rgba(253, 230, 138, 0.5) 60%, rgba(0,0,0,0) 80%)' }} />

      {/* --- VOLUMETRIC LIGHT BEAM --- */}
      <div className={`absolute top-[180px] w-[500px] h-[340px] pointer-events-none transition-opacity duration-1000 flex justify-center ${isOn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="absolute top-0 w-full h-full" style={{ background: 'radial-gradient(ellipse at top, rgba(253, 230, 138, 0.25) 0%, rgba(0,0,0,0) 70%)', clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0% 100%)', filter: 'blur(25px)' }} />
        <div className="absolute top-0 w-[280px] h-full" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5) 0%, rgba(253, 230, 138, 0.1) 80%, transparent 100%)', clipPath: 'polygon(30% 0, 70% 0, 90% 100%, 10% 100%)', filter: 'blur(15px)' }} />
      </div>

      {/* --- ELEGANT LAMP STRUCTURE --- */}
      <div className="relative z-10 flex flex-col items-center drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] group-hover:scale-[1.01] transition-transform duration-300">
        
        {/* 1. Finial (Top decorative piece) */}
        <div className="relative z-40 flex flex-col items-center -mb-2">
           <div className="w-2 h-3 rounded-full bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-800 shadow-sm" />
           <div className="w-6 h-3 rounded-full bg-gradient-to-r from-yellow-800 via-yellow-300 to-yellow-900 shadow-md" />
           <div className="w-4 h-4 bg-gradient-to-r from-yellow-700 via-yellow-400 to-yellow-800" />
        </div>

        {/* 2. Silk Empire Shade */}
        <div className="relative flex flex-col items-center z-30">
          <div 
            className={`relative w-[280px] h-[160px] overflow-hidden transition-all duration-700 ${isOn ? 'shadow-[0_25px_60px_rgba(253,230,138,0.4)]' : 'shadow-2xl'}`}
            style={{ 
              clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)',
              background: isOn 
                ? 'linear-gradient(to right, #fef08a, #ffffff 40%, #ffffff 60%, #fde047)' 
                : 'linear-gradient(to right, #6b7280, #9ca3af 40%, #9ca3af 60%, #4b5563)'
            }}
          >
            {/* Silk Sheen/Texture */}
            <div className="absolute inset-0 mix-blend-overlay opacity-30" 
                 style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 10px, rgba(0,0,0,0.1) 12px, rgba(0,0,0,0.1) 15px)' }} />
            
            {/* Glowing Core (when on) */}
            <div className={`absolute inset-0 bg-white transition-opacity duration-700 blur-2xl scale-75 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Elegant Top & Bottom Trim */}
            <div className="absolute top-0 w-full h-[6px] bg-gradient-to-r from-yellow-800 via-yellow-300 to-yellow-800 opacity-80" />
            <div className="absolute bottom-0 w-full h-[8px] bg-gradient-to-r from-yellow-800 via-yellow-400 to-yellow-900 opacity-90 shadow-[0_-2px_10px_rgba(0,0,0,0.2)]" />
          </div>

          {/* Under-shade shadow & rim for 3D effect */}
          <div className="relative w-[280px] h-[16px] -mt-[8px] rounded-[50%] z-20 flex justify-center items-center overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.9)]">
             <div className="absolute inset-0 bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-950" />
             <div className="relative w-[260px] h-[8px] rounded-[50%] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900" />
               <div className={`absolute inset-0 bg-gradient-to-r from-yellow-500 via-[#fffbeb] to-yellow-600 shadow-[inset_0_0_20px_#a16207] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             </div>
          </div>
        </div>

        {/* 3. Pull String & Core Hub */}
        <div className="relative w-full flex justify-center h-4 z-20">
           
           {/* Pull String (Thick Gold Beaded Chain + Elegant Teardrop) */}
           <div className="absolute right-[75px] top-0 flex flex-col items-center group-active:translate-y-6 transition-transform duration-300 ease-out z-40">
             {/* Chain */}
             <div className="relative w-[3.5px] h-28 shadow-sm">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #4b5563 45%, transparent 55%)', backgroundSize: '100% 8px' }} />
                <div className={`absolute inset-0 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'radial-gradient(circle, #ca8a04 45%, transparent 55%)', backgroundSize: '100% 8px' }} />
             </div>
             
             {/* Teardrop Pendant */}
             <div className="relative w-5 h-8 -mt-1 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] shadow-[0_5px_10px_rgba(0,0,0,0.5)] overflow-hidden border border-black/30">
               <div className="absolute inset-0 bg-gradient-to-br from-gray-500 via-gray-300 to-gray-700" />
               <div className={`absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-700 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             </div>
           </div>
           
           {/* Glowing Bulb Area (hidden under shade but casting light) */}
           <div className={`absolute -top-6 w-16 h-16 rounded-full transition-opacity duration-700 ${isOn ? 'bg-yellow-200/40 shadow-[0_10px_50px_#fde047]' : 'bg-transparent'}`} />
        </div>

        {/* 4. Elegant Fluted Brass Stem */}
        <div className="relative -mt-6 z-10 flex flex-col items-center">
           {/* Top Column Collar */}
           <div className="relative w-12 h-10 rounded-t-full overflow-hidden shadow-lg z-10">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-500 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-900 via-yellow-200 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Slender Fluted Pole */}
           <div className="relative w-[22px] h-[190px] shadow-[inset_4px_0_10px_rgba(0,0,0,0.5),inset_-4px_0_10px_rgba(0,0,0,0.5)] overflow-hidden -mt-2">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-400 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-950 via-yellow-200 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             {/* Fluted lines (vertical grooves) */}
             <div className="absolute inset-0 opacity-30 mix-blend-multiply" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000 0px, #000 1px, transparent 1px, transparent 4px)' }} />
           </div>
           
           {/* Decorative Orb / Column Break */}
           <div className="absolute top-[85px] w-14 h-14 rounded-full overflow-hidden shadow-xl z-20 border border-black/40">
             <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-400 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-br from-yellow-800 via-yellow-100 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>

        {/* 5. Heavy Marble & Brass Tiered Base */}
        <div className="relative z-20 flex flex-col items-center -mt-2">
           {/* Brass Pedestal Top */}
           <div className="relative w-[140px] h-[35px] rounded-[50%] overflow-hidden z-30 shadow-[0_5px_15px_rgba(0,0,0,0.7)]">
             <div className="absolute inset-0 bg-gradient-to-b from-gray-400 via-gray-600 to-gray-800" />
             <div className={`absolute inset-0 bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             <div className="absolute top-1 left-[15%] w-[70%] h-4 rounded-[50%] bg-gradient-to-b from-white/40 to-transparent" />
           </div>
           
           {/* Dark Marble Mid-Tier */}
           <div className="relative w-[180px] h-[35px] -mt-5 rounded-[50%] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.9)] z-20 border border-black">
             {/* Marble Texture */}
             <div className="absolute inset-0 bg-[#0f0f0f]" />
             <div className="absolute inset-0 mix-blend-screen opacity-20" 
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, white 0%, transparent 10%), radial-gradient(circle at 70% 60%, white 0%, transparent 15%)', filter: 'blur(2px)' }} />
             {/* Golden Rim Light from above */}
             <div className={`absolute top-0 left-0 w-full h-[6px] bg-gradient-to-b from-yellow-500/30 to-transparent transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Brass Bottom Rim (Thick edge resting on table) */}
           <div className="relative w-[210px] h-[28px] -mt-[15px] rounded-b-[50%] overflow-hidden shadow-[0_30px_50px_rgba(0,0,0,1)] z-10 border-b-2 border-black">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-500 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-950 via-yellow-400 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>
        
      </div>
    </div>
  );
}
