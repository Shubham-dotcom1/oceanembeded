import React from 'react';

export default function SectionPagination() {
  return (
    <div className="hidden lg:flex items-center gap-3 absolute right-10 bottom-8 z-30 select-none font-mono text-[12px] text-white/50">
      <span className="text-white font-medium">01</span>
      <span className="w-8 h-[1px] bg-white/50 inline-block" />
      <span className="hover:text-white transition-colors cursor-pointer">02</span>
      <span className="hover:text-white transition-colors cursor-pointer">03</span>
    </div>
  );
}
