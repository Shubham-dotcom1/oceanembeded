import React from 'react';

export default function OceanLabel() {
  return (
    <div className="hidden lg:flex flex-col items-start absolute right-[22%] xl:right-[25%] top-[24%] z-20 pointer-events-none select-none">
      <span className="text-[11px] font-medium tracking-[0.30em] text-white/95 uppercase font-sans">
        INDIAN OCEAN
      </span>
      <span className="text-[10px] font-normal tracking-[0.30em] text-[#6EDCFF]/90 uppercase font-sans mt-0.5">
        OUR SHARED HOME
      </span>
      <div className="w-24 xl:w-32 h-[1px] bg-white/40 mt-2" />
    </div>
  );
}
