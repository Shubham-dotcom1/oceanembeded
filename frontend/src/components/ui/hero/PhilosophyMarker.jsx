import React from 'react';

export default function PhilosophyMarker() {
  const steps = ['OBSERVE', 'UNDERSTAND', 'PREDICT', 'PROTECT'];

  return (
    <div className="hidden lg:flex items-center gap-3.5 absolute right-[5vw] bottom-[14%] z-20 pointer-events-none select-none">
      {/* Thin vertical accent line */}
      <div className="w-[1.5px] h-[76px] bg-gradient-to-b from-white/40 via-[#6EDCFF]/60 to-transparent" />

      {/* Brand philosophy vertical lettering */}
      <div className="flex flex-col text-left">
        {steps.map((step, idx) => (
          <span 
            key={step} 
            className={`text-[11px] tracking-[0.24em] font-medium leading-[1.8] font-sans ${
              idx === 0 ? 'text-white/95' : 'text-white/60'
            }`}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}
