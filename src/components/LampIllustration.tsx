import React from 'react';

export function LampIllustration({ isOn = true, onToggle }: { isOn?: boolean, onToggle?: () => void }) {
  return (
    <div className="relative w-[340px] h-[480px] flex flex-col items-center justify-end pb-12">
      
      {/* --- BACKGROUND LIGHTING EFFECTS --- */}
      
      {/* Floor Glow */}
      <div 
        className={`absolute bottom-[20px] w-[500px] h-[80px] rounded-full pointer-events-none transition-opacity duration-1000 ease-in-out ${isOn ? 'opacity-40' : 'opacity-0'}`}
        style={{ background: 'radial-gradient(ellipse at center, rgba(253, 230, 138, 0.6) 0%, rgba(0,0,0,0) 70%)' }}
      />
      
      {/* Light Cone */}
      <div 
        className={`absolute top-[160px] w-[500px] h-[320px] pointer-events-none transition-opacity duration-1000 ease-in-out ${isOn ? 'opacity-30' : 'opacity-0'}`}
        style={{
          background: 'radial-gradient(ellipse at top, rgba(253, 230, 138, 1) 0%, rgba(253, 224, 71, 0.15) 60%, rgba(0,0,0,0) 100%)',
          clipPath: 'polygon(30% 0, 70% 0, 100% 100%, 0% 100%)',
          filter: 'blur(12px)'
        }}
      />

      {/* Magical Sparkles (Dust Motes) */}
      <div className={`absolute top-[220px] left-[100px] w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_10px_2px_#fff] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-90' : 'opacity-0'}`} />
      <div className={`absolute top-[260px] left-[260px] w-2 h-2 bg-yellow-100 rounded-full shadow-[0_0_12px_4px_#fde047] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-70' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }} />
      <div className={`absolute top-[180px] left-[220px] w-1 h-1 bg-yellow-50 rounded-full shadow-[0_0_8px_2px_#fff] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }} />
      <div className={`absolute top-[320px] left-[150px] w-1 h-1 bg-yellow-200 rounded-full shadow-[0_0_6px_2px_#fef08a] animate-pulse transition-opacity duration-700 ${isOn ? 'opacity-60' : 'opacity-0'}`} style={{ animationDelay: '1.2s' }} />

      {/* --- LAMP ASSEMBLY --- */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* SHADE */}
        <div className="relative flex flex-col items-center z-30 drop-shadow-2xl">
          {/* Top Cap (Brass) */}
          <div className="relative w-12 h-6 -mb-3 rounded-t-full overflow-hidden z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-800" />
            <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
          </div>
          
          {/* Main Dome */}
          <div className="relative w-[260px] h-[110px] rounded-t-[130px] overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
            {/* Off State (Dark Matte) */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] via-[#222222] to-[#111111]" />
            {/* On State (Cream Glossy) */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#ffffff] via-[#f7f7f2] to-[#d6d6d0] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
            {/* Glossy Highlight Reflection */}
            <div className={`absolute top-2 left-6 w-[120px] h-[70px] rounded-t-full bg-gradient-to-tr from-transparent to-white opacity-40 rotate-[20deg] transition-opacity duration-700 ${isOn ? 'opacity-40' : 'opacity-5'}`} />
          </div>

          {/* Shade Inner Rim (Depth & Foil) */}
          <div className="relative w-[260px] h-[20px] -mt-[10px] rounded-[50%] z-20 flex justify-center items-center overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.8)]">
             {/* Outer Lip (Brass) */}
             <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-300 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             
             {/* Inner Cavity (Reflective Foil) */}
             <div className="relative w-[240px] h-[12px] rounded-[50%] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900" />
               <div className={`absolute inset-0 bg-gradient-to-r from-yellow-300 via-[#fffbeb] to-yellow-500 shadow-[inset_0_0_15px_#a16207] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             </div>
          </div>
        </div>

        {/* BULB & PULL STRING */}
        <div className="relative w-full flex justify-center h-4 z-10">
           
           {/* Glowing Edison Bulb */}
           <div className="absolute -top-6 flex justify-center items-center w-16 h-20">
             {/* Glass bulb off */}
             <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent border border-white/5" />
             {/* Glass bulb on */}
             <div className={`absolute inset-0 rounded-full bg-gradient-to-b from-yellow-100/90 to-yellow-500/10 shadow-[0_15px_50px_#fef08a,0_0_100px_#fde047] transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
             {/* Filament */}
             <div className={`relative w-5 h-8 rounded-t-full border-[2px] transition-colors duration-700 ${isOn ? 'border-orange-400 shadow-[0_0_20px_#fb923c]' : 'border-gray-600'}`} />
           </div>

           {/* Pull String (Beaded Chain) */}
           <div 
             className="absolute right-[50px] top-2 flex flex-col items-center cursor-pointer group z-40 p-4 -m-4"
             onClick={onToggle}
           >
             {/* Beaded Chain Pattern */}
             <div className="relative w-[3px] h-24 group-active:translate-y-3 transition-transform duration-150">
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #6b7280 45%, transparent 55%)', backgroundSize: '100% 8px' }} />
                <div className={`absolute inset-0 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: 'radial-gradient(circle, #ca8a04 45%, transparent 55%)', backgroundSize: '100% 8px' }} />
             </div>
             
             {/* Pendant / Handle */}
             <div className="relative group-active:translate-y-3 transition-transform duration-150">
               {/* Handle Neck */}
               <div className="relative w-4 h-6 rounded-t-full rounded-b-sm overflow-hidden shadow-md">
                 <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-400 to-gray-800" />
                 <div className={`absolute inset-0 bg-gradient-to-r from-yellow-700 via-yellow-200 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
               </div>
               {/* Handle Ball */}
               <div className="relative w-6 h-6 -mt-2 -ml-1 rounded-full overflow-hidden shadow-lg border border-black/10">
                 <div className="absolute inset-0 bg-gradient-to-br from-gray-400 to-gray-800" />
                 <div className={`absolute inset-0 bg-gradient-to-br from-yellow-200 via-yellow-500 to-yellow-800 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
               </div>
             </div>
           </div>
        </div>

        {/* STEM / POLE */}
        <div className="relative -mt-8 z-0">
           {/* Stem Top Connector */}
           <div className="relative w-8 h-12 mx-auto rounded-t-lg overflow-hidden z-10">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-500 to-gray-900" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-900 via-yellow-300 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           {/* Main Pole */}
           <div className="relative w-[16px] h-[190px] mx-auto shadow-inner overflow-hidden -mt-2">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-500 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-900 via-yellow-100 to-yellow-900 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>

        {/* BASE */}
        <div className="relative z-20 flex flex-col items-center -mt-2 drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)]">
           {/* Base Top Tier */}
           <div className="relative w-[140px] h-[20px] rounded-[50%] overflow-hidden z-30 shadow-inner">
             <div className="absolute inset-0 bg-gradient-to-b from-gray-300 to-gray-600" />
             <div className={`absolute inset-0 bg-gradient-to-b from-yellow-100 to-yellow-600 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Base Middle Tier */}
           <div className="relative w-[180px] h-[28px] -mt-3 rounded-[50%] overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.8)] z-20">
             <div className="absolute inset-0 bg-gradient-to-b from-gray-500 to-gray-800" />
             <div className={`absolute inset-0 bg-gradient-to-b from-yellow-300 to-yellow-700 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
           
           {/* Base Bottom Cylinder (Depth) */}
           <div className="relative w-[180px] h-[18px] -mt-[14px] rounded-b-[50%] overflow-hidden shadow-[0_25px_40px_rgba(0,0,0,1)] z-10 border-b border-black/50">
             <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-600 to-black" />
             <div className={`absolute inset-0 bg-gradient-to-r from-yellow-900 via-yellow-500 to-yellow-950 transition-opacity duration-700 ${isOn ? 'opacity-100' : 'opacity-0'}`} />
           </div>
        </div>
      </div>
    </div>
  );
}
