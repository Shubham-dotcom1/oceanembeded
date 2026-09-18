import React from 'react';
import { ArrowUpRight, Compass, ShieldCheck } from 'lucide-react';

export default function PlanetCTASection({ onOpenDashboard }) {
  return (
    <section className="py-28 px-6 max-w-7xl mx-auto border-t border-slate-800/80 text-center relative overflow-hidden">
      {/* Radial Glow Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.12)_0%,transparent_70%)] pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-none mb-8 font-sans">
          See. Decide. <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-emerald-400 bg-clip-text text-transparent">Act.</span>
        </h2>
        
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-normal leading-relaxed">
          Transform raw satellite and float data into actionable 3D oceanographic intelligence for climate, research, and marine navigation.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={onOpenDashboard}
            className="btn-nautilus-primary px-8 py-4 text-sm font-semibold tracking-wide flex items-center gap-2.5 cursor-pointer"
          >
            <span>Launch Map Observatory</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            NOAA & ARGO VALIDATED
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Compass className="w-4 h-4 text-cyan-400" />
            GLOBAL 0-1,000M COVERAGE
          </span>
        </div>
      </div>
    </section>
  );
}
