import React from 'react';
import { Radio, Cpu, ShieldCheck, Waves, Info, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ScientificWorkflowGuide() {
  return (
    <div className="glass-panel p-4 rounded-3xl border border-cyan-500/30 text-xs font-mono backdrop-blur-xl shadow-2xl mb-6">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <span className="font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" />
          HOW SATELLITE SUBSURFACE INFERENCE WORKS
        </span>
        <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold">
          PHYSICS-INFORMED NEURAL ARCHITECTURE
        </span>
      </div>

      {/* 3 Step Workflow Diagram */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 relative">
          <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>1. SATELLITE ORBITAL SENSING</span>
          </div>
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
            Altimeters & microwave radiometers measure Surface Temperature (SST) & Sea Surface Height (SSH) anomalies. Satellite radar cannot penetrate beneath the surface.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 relative">
          <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>2. 3D PHYSICS AI INVERSION</span>
          </div>
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
            Our Physics-Informed Neural Network (PINN) solves hydrostatic & geostrophic balance equations to predict subsurface thermal stratification down to 1,000 meters.
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800 relative">
          <div className="flex items-center gap-2 font-bold text-cyan-300 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. ARGO FLOAT CALIBRATION</span>
          </div>
          <p className="text-slate-300 text-[11px] font-sans leading-relaxed">
            Real-time Autonomous ARGO profiling floats transmit in-situ soundings every 10 days to continuously calibrate and validate model predictions (RMSE &lt; 0.12°C).
          </p>
        </div>
      </div>
    </div>
  );
}
