import React from 'react';

export default function HeroCopy() {
  return (
    <div className="flex flex-col items-start text-left max-w-[600px] select-none">
      {/* Eyebrow */}
      <div className="mb-6 sm:mb-8">
        <span className="text-[11px] sm:text-[12px] font-medium tracking-[0.28em] uppercase text-[#DCF6FF]/85 font-sans block">
          THE OCEAN HOLDS MORE THAN WE SEE
        </span>
      </div>

      {/* Main Headline */}
      <h1 className="text-[72px] sm:text-[96px] md:text-[118px] lg:text-[136px] xl:text-[150px] font-semibold tracking-[-0.055em] leading-[0.82] text-left mb-6 sm:mb-8 font-sans">
        <span className="block text-white">See</span>
        <span 
          className="block bg-gradient-to-b from-[#FFFFFF] via-[#EAF8FF] to-[#8FE6FF] bg-clip-text text-transparent pb-1"
          style={{
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Deeper
        </span>
      </h1>

      {/* Supporting Copy */}
      <p className="text-[16px] sm:text-[17px] md:text-[18px] leading-[1.55] font-normal text-[#EBF9FF]/82 max-w-[580px] font-sans">
        Transform satellite data into high-resolution 3D ocean intelligence for climate, research, and a more resilient future.
      </p>
    </div>
  );
}
