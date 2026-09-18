import React from 'react';

export default function EarthVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10 select-none">
      {/* 1. Atmospheric Radial Scattering Glow (Behind Earth - Section 6) */}
      <div 
        className="earth-glow absolute w-[65vw] h-[85vh] right-[2%] bottom-[-10%] rounded-full animate-glow-pulse"
        style={{
          background: 'radial-gradient(ellipse at 60% 50%, rgba(105, 222, 255, 0.40) 0%, rgba(40, 165, 220, 0.18) 45%, transparent 75%)',
          filter: 'blur(50px)',
        }}
      />

      {/* 2. Secondary Ocean Core Illumination */}
      <div 
        className="absolute w-[50vw] h-[60vh] right-[8%] bottom-[5%] rounded-full opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.3) 0%, rgba(3, 26, 46, 0) 70%)',
          filter: 'blur(75px)',
        }}
      />

      {/* 3. Subtle Scientific Micro Data Grid (Section 18, Opacity 0.04) */}
      <div 
        className="absolute right-0 top-0 w-[65vw] h-full opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.6) 1px, transparent 1px), radial-gradient(rgba(110, 220, 255, 0.6) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0, 20px 20px',
          maskImage: 'radial-gradient(ellipse at 80% 60%, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 80% 60%, black 40%, transparent 80%)'
        }}
      />

      {/* 4. Pure Clean UHD Earth Centerpiece Visual (Zero Text Baked In, Zero Seams) */}
      <div 
        className="absolute right-[-8%] sm:right-[-6%] lg:right-[-4%] bottom-[-18%] sm:bottom-[-16%] lg:bottom-[-15%] w-[90vw] sm:w-[78vw] md:w-[72vw] lg:w-[65%] xl:w-[64%] max-w-[1300px] select-none transition-transform duration-1000"
        style={{
          mixBlendMode: 'screen',
          maskImage: 'radial-gradient(ellipse at 65% 65%, black 45%, transparent 76%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 65% 65%, black 45%, transparent 76%)'
        }}
      >
        <div className="relative w-full aspect-[16/10] animate-earth-float">
          <img
            src="/earth-clean.jpg"
            alt="Earth from space showing India and the Indian Ocean"
            className="w-full h-full object-cover object-left-top select-none"
            loading="eager"
            decoding="async"
            draggable={false}
          />
        </div>
      </div>

      {/* 5. Orbital Remote Sensing Satellite Hovering Above Limb (Section 26) */}
      <div 
        className="absolute right-[22%] sm:right-[24%] lg:right-[26%] top-[14%] sm:top-[16%] lg:top-[17%] z-20 animate-satellite-drift select-none"
        style={{
          filter: 'drop-shadow(0 4px 18px rgba(110, 220, 255, 0.45))'
        }}
      >
        <svg 
          viewBox="0 0 120 70" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-18 h-11 sm:w-22 sm:h-13 lg:w-26 lg:h-15 transform -rotate-[22deg]"
        >
          {/* Left Solar Panel Array */}
          <rect x="6" y="24" width="34" height="18" rx="2" fill="#155E75" stroke="#38BDF8" strokeWidth="0.8" />
          <line x1="17" y1="24" x2="17" y2="42" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="28" y1="24" x2="28" y2="42" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="6" y1="33" x2="40" y2="33" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="40" y1="33" x2="48" y2="33" stroke="#CBD5E1" strokeWidth="1.5" />

          {/* Central Satellite Body Bus */}
          <rect x="48" y="21" width="24" height="24" rx="3" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="0.8" />
          <rect x="52" y="25" width="16" height="16" rx="1.5" fill="#0F172A" />
          <circle cx="60" cy="33" r="4" fill="#38BDF8" fillOpacity="0.8" />
          <circle cx="60" cy="33" r="1.5" fill="#FFFFFF" />

          {/* Radar Altimeter Sensor */}
          <path d="M54 45L60 52L66 45" stroke="#CBD5E1" strokeWidth="1.2" strokeLinecap="round" />
          <ellipse cx="60" cy="53" rx="5" ry="2" fill="#0369A1" stroke="#38BDF8" strokeWidth="0.7" />

          {/* Right Solar Panel Array */}
          <line x1="72" y1="33" x2="80" y2="33" stroke="#CBD5E1" strokeWidth="1.5" />
          <rect x="80" y="24" width="34" height="18" rx="2" fill="#155E75" stroke="#38BDF8" strokeWidth="0.8" />
          <line x1="91" y1="24" x2="91" y2="42" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="102" y1="24" x2="102" y2="42" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
          <line x1="80" y1="33" x2="114" y2="33" stroke="#38BDF8" strokeWidth="0.6" strokeOpacity="0.7" />
        </svg>
      </div>
    </div>
  );
}
