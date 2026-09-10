import React from 'react';
import { motion } from 'framer-motion';
import { SearchCheck, AlertOctagon, Lightbulb, TrendingUp } from 'lucide-react';

const pillars = [
  {
    title: 'Analysis of Feasibility',
    icon: SearchCheck,
    color: 'from-blue-500 to-cyan-500',
    borderColor: 'border-blue-500/40',
    points: [
      'Real satellite (SST/SSH) and ARGO float open datasets are readily available (NOAA, Copernicus).',
      'Existing physical oceanography research provides a strong mathematical foundation for PINN models.',
      'Developed using standard PyTorch deep learning stacks without requiring specialized proprietary hardware.',
      'Initial rollout focused on the Bay of Bengal & North Indian Ocean, scaling globally.'
    ]
  },
  {
    title: 'Potential Challenges & Risks',
    icon: AlertOctagon,
    color: 'from-amber-500 to-orange-500',
    borderColor: 'border-amber-500/40',
    points: [
      'Domain Shift: Models may perform differently in monsoon-driven Indian Ocean dynamics.',
      'Data Quality: Missing satellite pixels due to heavy cloud cover and resolution gaps.',
      'Data Leakage: Reanalysis datasets may assimilate in-situ observations during training.',
      'Deep-Ocean Uncertainty: Estimation accuracy naturally decreases at abyssal depths (>500m).'
    ]
  },
  {
    title: 'Strategies to Overcome',
    icon: Lightbulb,
    color: 'from-purple-500 to-indigo-500',
    borderColor: 'border-purple-500/40',
    points: [
      'Domain Shift → Fine-tune and adapt PINN weights specifically on Indian Ocean soundings.',
      'Data Quality → Automated QC masking, kriging interpolation, and spatial regridding.',
      'Data Leakage → Enforce strict spatial, temporal, and independent ARGO float holdouts.',
      'Deep Uncertainty → Implement depth-wise Bayesian uncertainty flags & confidence bounds.'
    ]
  },
  {
    title: 'Validation & Scalability',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-500',
    borderColor: 'border-emerald-500/40',
    points: [
      'Use independent ARGO profilers across diverse seasons and coordinates for QA.',
      'Start with lightweight baseline models and progressively scale network capacity.',
      'Flag unreliable high-uncertainty regions rather than forcing unverified predictions.',
      'Scale validated framework from Bay of Bengal → North Indian Ocean → Global Basins.'
    ]
  }
];

export default function FeasibilityViabilitySection() {
  return (
    <section id="feasibility" className="py-20 px-6 max-w-7xl mx-auto z-30 relative font-sans border-t border-slate-800/80">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          TECHNICAL & STRATEGIC ASSESSMENT
        </div>
        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Feasibility & Viability
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Comprehensive analysis of technical feasibility, operational challenges, risk mitigations, and global scalability roadmap.
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-5 rounded-3xl border border-cyan-500/20 flex flex-col justify-between backdrop-blur-xl shadow-2xl hover:border-cyan-400/50 transition-all"
            >
              <div>
                {/* Pillar Header */}
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-slate-800">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${pillar.color} flex items-center justify-center text-slate-950 font-bold shadow-lg shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-extrabold text-white font-mono leading-tight">
                    {pillar.title}
                  </h3>
                </div>

                {/* Points List */}
                <ul className="flex flex-col gap-3 font-sans text-xs text-slate-300">
                  {pillar.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400/80 flex items-center justify-between">
                <span>PILLAR 0{idx + 1}</span>
                <span>CODEGENESIS ASSESSMENT</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
