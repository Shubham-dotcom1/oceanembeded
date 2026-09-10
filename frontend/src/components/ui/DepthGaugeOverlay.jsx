import React from 'react';
import { GitBranch, ShieldCheck, Zap } from 'lucide-react';

export default function DepthGaugeOverlay() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    /* Right Side Minimalist Floating Navigation Rail (3 Icons Only) */
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-40 glass-panel p-2 rounded-full border border-cyan-500/30 shadow-2xl backdrop-blur-xl pointer-events-auto flex flex-col items-center gap-3">
      {/* 1. Workflow Shortcut Icon */}
      <button
        onClick={() => scrollToSection('workflow')}
        className="group relative p-2.5 rounded-full bg-slate-950/70 hover:bg-cyan-500/30 border border-slate-800 hover:border-cyan-400 text-cyan-400 transition-all shadow-lg"
        title="Jump to MVP Workflow Pipeline"
      >
        <GitBranch className="w-4 h-4" />
        <div className="absolute right-12 bg-slate-950/95 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          MVP WORKFLOW
        </div>
      </button>

      {/* 2. Feasibility Shortcut Icon */}
      <button
        onClick={() => scrollToSection('feasibility')}
        className="group relative p-2.5 rounded-full bg-slate-950/70 hover:bg-cyan-500/30 border border-slate-800 hover:border-cyan-400 text-cyan-400 transition-all shadow-lg"
        title="Jump to Feasibility & Viability"
      >
        <ShieldCheck className="w-4 h-4" />
        <div className="absolute right-12 bg-slate-950/95 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          FEASIBILITY & VIABILITY
        </div>
      </button>

      {/* 3. Impact Shortcut Icon */}
      <button
        onClick={() => scrollToSection('impact')}
        className="group relative p-2.5 rounded-full bg-slate-950/70 hover:bg-cyan-500/30 border border-slate-800 hover:border-cyan-400 text-cyan-400 transition-all shadow-lg"
        title="Jump to Impact & Key Benefits"
      >
        <Zap className="w-4 h-4" />
        <div className="absolute right-12 bg-slate-950/95 border border-cyan-500/40 text-cyan-300 text-[10px] font-mono px-2.5 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl">
          IMPACT & BENEFITS
        </div>
      </button>
    </div>
  );
}
