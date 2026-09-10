import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function PlanetBannerSection({ onOpenDashboard }) {
  return (
    <section className="relative my-20 w-full overflow-hidden min-h-[560px] flex items-center border-y border-slate-800">
      {/* High-Resolution Full-Width Background Satellite Image */}
      <img 
        src="/images/banner-ocean-superres.jpg" 
        alt="Ocean Embedded SuperRes Satellite Imagery" 
        className="absolute inset-0 w-full h-full object-cover object-center select-none"
      />

      {/* Dark Gradient Overlay for Readability (Left-Weighted) */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/40" />

      {/* Overlaid Content Container (Planet.com "Unlock a Clearer World" Layout) */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 py-20 w-full">
        <div className="max-w-2xl">
          
          {/* Small Category Tag */}
          <div className="text-xs font-mono font-bold tracking-[0.25em] text-cyan-300 uppercase mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            OCEAN EMBEDDED SUPERRES
          </div>

          {/* Giant Thin & Clean Headline (Planet.com Style) */}
          <h2 className="text-5xl sm:text-7xl font-extralight text-white tracking-tight leading-[1.1] mb-6 font-sans">
            Unlock a <br />
            <span className="font-semibold text-white">Clearer Ocean</span>
          </h2>

          {/* Subheadline Line */}
          <p className="text-lg sm:text-xl text-slate-200 font-normal leading-relaxed mb-8 max-w-xl">
            Gain clarity for human-in-the-loop analysis with unmatched scale, depth, and frequency.
          </p>

          {/* Action Pill Button */}
          <button 
            onClick={onOpenDashboard}
            className="px-7 py-3.5 rounded-xl border border-cyan-400 hover:border-cyan-300 text-white font-mono font-bold text-sm tracking-wider flex items-center gap-2 bg-slate-950/70 hover:bg-cyan-500/20 backdrop-blur-md transition-all shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:scale-105"
          >
            <span>Learn More</span>
            <ArrowUpRight className="w-4 h-4 text-cyan-300" />
          </button>

        </div>
      </div>
    </section>
  );
}
