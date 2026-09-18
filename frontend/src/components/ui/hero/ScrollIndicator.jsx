import React from 'react';

export default function ScrollIndicator({ targetId = '#data-grid' }) {
  const handleScroll = () => {
    const el = document.querySelector(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      onClick={handleScroll}
      className="hidden md:flex flex-col items-center gap-2.5 absolute left-[4vw] bottom-7 z-20 cursor-pointer group select-none opacity-85 hover:opacity-100 transition-opacity"
    >
      <div className="h-9 flex items-start justify-center">
        <div className="w-[1.5px] bg-[#6EDCFF] animate-scroll-line" />
      </div>
      <span className="text-[10px] sm:text-[11px] font-medium tracking-[0.25em] text-white/75 group-hover:text-white uppercase font-sans transition-colors">
        SCROLL TO EXPLORE
      </span>
    </div>
  );
}
