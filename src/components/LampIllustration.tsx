import React from 'react';

export function LampIllustration({ isOn = true, onToggle }: { isOn?: boolean, onToggle?: () => void }) {
  return (
    <div className="relative w-[360px] h-[500px] flex flex-col items-center justify-end pb-12">
      
      {/* --- BACKGROUND LIGHTING EFFECTS --- */}
      
      {/* Floor Glow */}
      <div 
        className={`absolute bottom-[10px] w-[550px] h-[90px] rounded-full pointer-events-none transition-opacity duration-1000 ease-in-out ${isOn ? 'opacity-50' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.7) 0%, rgba(217, 119, 6, 0.2) 40%, rgba(0,0,0,0) 70%)' }}
      />
      
      {/* Volumetric Light Cone - Multiple Layers for Realism */}
      <div className={`absolute top-[160px] w-full h-[320px] pointer-events-none transition-opacity duration-1000 ease-in-out flex justify-center ${isOn ? 'opacity-100' : 'opacity-0'}`}>
        {/* Wide Soft Cone */}
        <div className="absolute top-0 w-[550px] h-full" style={{ background: 'radial-gradient(ellipse at top, rgba(253, 230, 138, 0.25) 0%, rgba(0,0,0,0) 80%)', clipPath: 'polygon(25% 0, 75% 0, 100% 100%, 0% 100%)', filter: 'blur(20px)' }} />
        {/* Core Hot Beam */}
        <div className="absolute top-0 w-[300px] h-full opacity-60" style={{ background: 'linear-gradient(to bottom, rgba(255, 245, 190, 0.8) 0%, rgba(253, 230, 138, 0.1) 80%, transparent 100%)', clipPath: 'polygon(35% 0, 65% 0, 85% 100%, 15% 100%)', filter: 'blur(12px)' }} />
      </div>

      {/* Magical Sparkles (Dust Motes) */}
      <div className={`absolute top-[210px] left-[110px] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_12px_3px_#fff] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-90' : 'opacity-0'}`} />
      <div className={`absolute top-[280px] left-[270px] w-2 h-2 bg-yellow-200 rounded-full shadow-[0_0_15px_4px_#fde047] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-80' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }} />
      <div className={`absolute top-[190px] left-[230px] w-1 h-1 bg-yellow-50 rounded-full shadow-[0_0_10px_2px_#fff] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }} />
      <div className={`absolute top-[350px] left-[130px] w-2.5 h-2.5 bg-yellow-100 rounded-full shadow-[0_0_15px_5px_#fef08a] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-50' : 'opacity-0'}`} style={{ animationDelay: '1.1s' }} />

      {/* --- LAMP ASSEMBLY --- */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* SHADE */}
        <div className="relative flex flex-col items-center z-30 drop-shadow-2xl">
          {/* Top Cap (Brass) - More ornate */}
          <div className="relative w-14 h-8 -mb-4 rounded-t-[20px] overflow-hidden z-10 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-400 to-gray-900" />
            <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
            {/* Cap details */}
            <div className="absolute top-1 left-0 w-full h-[2px] bg-black/20" />
            <div className="absolute bottom-2 left-0 w-full h-[3px] bg-black/30" />
          </div>
          
          {/* Main Dome - Mid Century Pleated/Ribbed Look */}
          <div className="relative w-[280px] h-[120px] rounded-t-[140px] overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.6)]">
            {/* Base Color Off State */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#444] via-[#2a2a2a] to-[#151515]" />
            
            {/* Base Color On State (Cream Glossy) */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#fdfbf7] to-[#e4e2d8] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
            
            {/* Ribbed Texture */}
            <div className="absolute inset-0 mix-blend-multiply opacity-[0.08]" 
                 style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 15px, #000 18px, #000 20px)' }} />
                 
            {/* Volumetric shading to curve the ribs */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/40" />

            {/* Glossy Highlight Reflection */}
            <div className={`absolute top-2 left-8 w-[140px] h-[80px] rounded-t-full bg-gradient-to-tr from-transparent to-white opacity-60 rotate-[25deg] transition-opacity duration-700 ${isOn ? 'opacity-60' : 'opacity-5'}`} />
            
            {/* Bottom edge rim light */}
            <div className={`absolute bottom-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-white to-transparent transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-10'}`} />
          </div>

          {/* Shade Inner Rim (Depth & Foil) */}
          <div className="relative w-[280px] h-[22px] -mt-[11px] rounded-[50%] z-20 flex justify-center items-center overflow-hidden shadow-[0_10px_25px_rgba(0,0,0,0.9)]">
             {/* Outer Lip (Brass) */}
             <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             
             {/* Inner Cavity (Reflective Foil) */}
             <div className="relative w-[260px] h-[14px] rounded-[50%] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-black" />
               <div className={`absolute inset-0 bg-gradient-to-r from-yellow-400 via-[#fffbeb] to-yellow-600 shadow-[inset_0_0_20px_#854d0e] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             </div>
          </div>
        </div>

        {/* BULB & PULL STRING */}
        <div className="relative w-full flex justify-center h-4 z-10">
           
           {/* Glass Bulb Enclosure */}
           <div className={`absolute -top-7 flex justify-center items-center w-20 h-24 rounded-full border-[1px] transition-all duration-1000 ${isOn ? 'border-yellow-100/30 bg-yellow-500/10 shadow-[0_20px_60px_#fef08a,0_0_120px_#fde047]' : 'border-white/10 bg-white/5'}`}>
             
             {/* Glowing Core / Filament */}
             <div className={`relative w-8 h-10 rounded-t-full border-[3px] flex items-center justify-center transition-all duration-700 ${isOn ? 'border-orange-300 shadow-[0_0_30px_#fb923c,inset_0_0_15px_#fcd34d] bg-yellow-100/50' : 'border-gray-600 bg-transparent'}`}>
               <div className={`w-2 h-6 rounded-full transition-colors duration-700 ${isOn ? 'bg-white shadow-[0_0_10px_#fff]' : 'bg-gray-700'}`} />
             </div>
             
             {/* Glass reflection */}
             <div className="absolute top-2 left-2 w-4 h-8 rounded-full bg-white/20 rotate-[30deg]" />
           </div>

           {/* Pull String (Beaded Chain) */}
           <div 
             className="absolute right-[60px] top-4 flex flex-col items-center cursor-pointer group z-40 p-4 -m-4"
             onClick={onToggle}
           >
             {/* Beaded Chain Pattern */}
             <div className="relative w-[4px] h-28 group-active:translate-y-4 transition-transform duration-200">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #6b7280 40%, transparent 50%)', backgroundSize: '100% 10px' }} />
                <div className={`absolute inset-0 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'radial-gradient(circle, #ca8a04 40%, transparent 50%)', backgroundSize: '100% 10px' }} />
             </div>
             
             {/* Pendant / Handle - More sculpted */}
             <div className="relative group-active:translate-y-4 transition-transform duration-200 drop-shadow-lg">
               {/* Handle Top Ring */}
               <div className="relative w-6 h-3 rounded-t-full overflow-hidden z-10 -mb-1">
                 <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-800" />
                 <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
               </div>
               {/* Handle Base Drop */}
               <div className="relative w-8 h-10 rounded-b-full rounded-t-sm overflow-hidden shadow-[inset_0_-4px_10px_rgba(0,0,0,0.5)] border border-black/20">
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-500 via-gray-300 to-gray-700" />
                 <div className={`absolute inset-0 bg-gradient-to-br from-yellow-300 via-yellow-100 to-yellow-700 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
                 <div className="absolute top-1 left-1 w-3 h-4 bg-white/40 rounded-full" />
               </div>
             </div>
           </div>
        </div>

        {/* STEM / POLE - More detailed and sculpted */}
        <div className="relative -mt-10 z-0 flex flex-col items-center">
           {/* Stem Top Bracket */}
           <div className="relative w-10 h-16 rounded-t-xl overflow-hidden z-10 shadow-lg">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-500 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-950 via-yellow-300 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             <div className="absolute bottom-2 left-0 w-full h-[2px] bg-black/40" />
           </div>
           
           {/* Main Pole */}
           <div className="relative w-[18px] h-[190px] shadow-[inset_4px_0_10px_rgba(0,0,0,0.5),inset_-4px_0_10px_rgba(0,0,0,0.5)] overflow-hidden -mt-2">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-400 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-950 via-yellow-200 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Decorative Middle Ring */}
           <div className="absolute top-[100px] w-8 h-4 rounded-full overflow-hidden shadow-md z-20 border-y border-black/30">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-300 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-800 via-yellow-100 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>

        {/* BASE - Thicker, more substantial */}
        <div className="relative z-20 flex flex-col items-center -mt-2 drop-shadow-[0_25px_35px_rgba(0,0,0,0.9)]">
           {/* Base Top Tier (Dome shape) */}
           <div className="relative w-[160px] h-[30px] rounded-[50%] overflow-hidden z-30 shadow-[inset_0_4px_10px_rgba(255,255,255,0.2)]">
             <div className="absolute inset-0 bg-gradient-to-b from-gray-300 via-gray-500 to-gray-700" />
             <div className={`absolute inset-0 bg-gradient-to-b from-yellow-100 via-yellow-500 to-yellow-700 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             <div className="absolute top-1 left-[15%] w-[70%] h-3 rounded-[50%] bg-gradient-to-b from-white/30 to-transparent" />
           </div>
           
           {/* Base Middle Tier */}
           <div className="relative w-[210px] h-[36px] -mt-5 rounded-[50%] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.9)] z-20">
             <div className="absolute inset-0 bg-gradient-to-b from-gray-500 via-gray-700 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-b from-yellow-300 via-yellow-600 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Base Bottom Cylinder (Thick edge) */}
           <div className="relative w-[210px] h-[24px] -mt-[18px] rounded-b-[50%] overflow-hidden shadow-[0_30px_50px_rgba(0,0,0,1)] z-10 border-b border-black">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-600 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-950 via-yellow-500 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>
      </div>
    </div>
  );
}
