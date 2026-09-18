import React from 'react';

export default function HeroMetrics() {
  const metrics = [
    {
      value: '7',
      label: 'Surface Variables',
    },
    {
      value: '0 – 1000 m',
      label: '3D Reconstruction',
    },
    {
      value: '0.25°',
      label: 'Spatial Resolution',
    },
  ];

  return (
    <div className="flex items-center gap-6 sm:gap-10 mt-12 sm:mt-16 pt-2 select-none">
      {metrics.map((metric, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && (
            <div 
              className="w-[1px] h-[46px] bg-white/25 shrink-0" 
              aria-hidden="true"
            />
          )}
          <div className="flex flex-col">
            <span className="text-[22px] sm:text-[24px] font-semibold text-white tracking-tight font-sans">
              {metric.value}
            </span>
            <span className="text-[12px] tracking-[0.04em] text-white/72 font-sans mt-0.5">
              {metric.label}
            </span>
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
