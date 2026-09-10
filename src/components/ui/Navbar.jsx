import React from 'react';
import { Map, Globe } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#080c14]/90 border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 h-18 py-3.5 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveMode('landing')}
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-[0_0_12px_rgba(34,211,238,0.5)]">
            <Globe className="w-4 h-4 text-slate-950" />
          </div>
          <div className="font-extrabold tracking-tight text-lg text-white font-sans flex items-center gap-1">
            <span>ocean</span>
            <span className="text-cyan-400 font-bold">embedded</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block ml-0.5 animate-pulse" />
          </div>
        </div>

        {/* Right: Primary Action (Observatory Dashboard CTA) */}
        <div className="flex items-center gap-3 font-mono">
          <button
            onClick={() => setActiveMode(activeMode === 'dashboard' ? 'landing' : 'dashboard')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-slate-950 font-extrabold text-xs tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all hover:scale-105"
          >
            <Map className="w-3.5 h-3.5" />
            <span>{activeMode === 'dashboard' ? 'CLOSE DASHBOARD' : 'OBSERVATORY DASHBOARD'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
