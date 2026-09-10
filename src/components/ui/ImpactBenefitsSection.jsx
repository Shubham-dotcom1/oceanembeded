import React from 'react';
import { motion } from 'framer-motion';
import { Atom, Activity, ShieldAlert, Key } from 'lucide-react';

const impacts = [
  {
    title: 'Scientific Impact',
    subtitle: 'Unlocking Subsurface Physics',
    icon: Atom,
    color: 'from-cyan-500 to-blue-500',
    borderColor: 'border-cyan-500/40',
    description: 'Provides continuous, high-resolution 3D subsurface temperature & salinity estimates to study ocean circulation, thermocline stratification, and ocean heat distribution.'
  },
  {
    title: 'Operational Impact',
    subtitle: 'Closing Data Blind Spots',
    icon: Activity,
    color: 'from-blue-500 to-indigo-500',
    borderColor: 'border-blue-500/40',
    description: 'Fills spatial and temporal gaps between sparse in-situ observations using daily satellite remote sensing, offering real-time uncertainty and reliability scoring.'
  },
  {
    title: 'Environmental Impact',
    subtitle: 'Climate & Marine Preservation',
    icon: ShieldAlert,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/40',
    description: 'Improves early monitoring of subsurface marine heatwaves, thermal stress on coral reefs, and climate drivers (ENSO, IOD), supporting marine conservation.'
  },
  {
    title: 'Observation & Resource Impact',
    subtitle: 'Smart Sensor Deployment',
    icon: Key,
    color: 'from-purple-500 to-fuchsia-500',
    borderColor: 'border-purple-500/40',
    description: 'Identifies high-uncertainty ocean regions to guide targeted ARGO float deployment, reducing reliance on expensive physical vessel surveys.'
  }
];

export default function ImpactBenefitsSection() {
  return (
    <section id="impact" className="py-20 px-6 max-w-7xl mx-auto z-30 relative font-sans border-t border-slate-800/80 mb-12">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          TRANSFORMATIVE VALUE PROPOSITION
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Impact & Key Benefits
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          How OCEAN EMBEDDED delivers value across climate science, naval operations, marine environmental defense, and sensor network optimization.
        </p>
      </div>

      {/* 4 Impact Domain Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {impacts.map((imp, idx) => {
          const Icon = imp.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-6 rounded-3xl border border-cyan-500/20 flex flex-col justify-between backdrop-blur-xl shadow-2xl hover:border-cyan-400/50 transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${imp.color} flex items-center justify-center text-slate-950 font-bold shadow-xl shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 font-bold">
                    DOMAIN 0{idx + 1}
                  </span>
                </div>

                <div className="text-xs font-mono text-cyan-400 font-semibold mb-1">
                  {imp.subtitle}
                </div>
                <h3 className="text-xl font-extrabold text-white mb-3">
                  {imp.title}
                </h3>
                <p className="text-slate-300 text-xs leading-relaxed font-sans">
                  {imp.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  ✓ VERIFIED VALUE
                </span>
                <span className="text-slate-500">OCEAN EMBEDDED MVP</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
