import React from 'react';
import { Radio, Waves, Cpu, ShieldCheck, Map } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HeroOverlay({ 
  onStartDive, 
  onOpenDashboard, 
  onOpenVolume,
  depth 
}) {
  if (depth > 120) return null;

  return (
    <div className="absolute inset-x-0 top-0 z-20 flex flex-col items-start justify-start pt-28 pb-12 px-6 max-w-7xl mx-auto pointer-events-none gap-6 min-h-screen">
      {/* Top Banner / Scientific Pipeline Narrative */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-auto self-center bg-slate-950/90 border border-cyan-500/40 backdrop-blur-xl px-4 py-1.5 rounded-full shadow-2xl flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-mono text-slate-300"
      >
        <span className="flex items-center gap-1 text-amber-400 font-bold">
          <Radio className="w-3.5 h-3.5 animate-pulse" /> SATELLITE RADAR
        </span>
        <span className="text-slate-600">→</span>
        <span className="flex items-center gap-1 text-sky-400">
          <Waves className="w-3.5 h-3.5" /> SURFACE SST
        </span>
        <span className="text-slate-600">→</span>
        <span className="flex items-center gap-1 text-cyan-400 font-bold">
          <Cpu className="w-3.5 h-3.5" /> 3D PHYSICS AI
        </span>
        <span className="text-slate-600">→</span>
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" /> ARGO VALIDATION (0m–1000m)
        </span>
      </motion.div>

      {/* Hero Main Content */}
      <div className="max-w-2xl pointer-events-auto mt-2">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2 }}
        >
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4 leading-tight drop-shadow-2xl">
            Dive Beneath the Surface into the <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent text-cyan-glow">Hidden Ocean</span>.
          </h1>

          <p className="text-slate-100 text-base sm:text-lg mb-6 leading-relaxed font-medium max-w-xl drop-shadow-md">
            Satellite remote sensing only observes the top millimeter of the ocean. <strong className="text-cyan-300 font-semibold">OCEAN EMBEDDED</strong> uses Physics-Informed Neural Networks (PINNs) to reconstruct 3D subsurface temperature, salinity, and density profiles down to 1,000 meters in real time.
          </p>

          {/* Action CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenDashboard}
              className="glass-button px-7 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-2xl transition-all"
            >
              <Map className="w-4 h-4 text-cyan-300" />
              <span>LAUNCH SCIENTIFIC OBSERVATORY</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Scroll Dive Hint */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        className="self-center mt-auto flex flex-col items-center gap-2 pointer-events-auto text-cyan-400/90 font-mono text-xs cursor-pointer pb-6"
        onClick={() => {
          window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' });
        }}
      >
        <span>SCROLL DOWN TO DESCENT THROUGH THERMOCLINE</span>
        <div className="w-6 h-10 border-2 border-cyan-500/40 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
        </div>
      </motion.div>
    </div>
  );
}
