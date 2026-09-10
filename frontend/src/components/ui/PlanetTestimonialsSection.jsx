import React from 'react';
import { Quote, Building2, Anchor, ShieldCheck, Sparkles } from 'lucide-react';

export default function PlanetTestimonialsSection() {
  const partners = [
    {
      category: 'CIVIL GOVERNMENT & RESEARCH',
      name: 'NOAA Ocean Exploration',
      speaker: 'Valentin Louis',
      role: 'Senior Earth Observation Specialist',
      quote: 'Ocean Embedded’s 3D thermocline profiling bridges the gap between satellite SST maps and deep ROV missions, allowing us to predict ocean heat transport faster than ever before.',
      icon: Anchor,
      color: 'border-cyan-500/30'
    },
    {
      category: 'SPACE & REMOTE SENSING AGENCIES',
      name: 'Copernicus Marine Service',
      speaker: 'Osken Toishibekov',
      role: 'Satellite Data Integration Lead',
      quote: 'Integrating Physics-Informed Neural Networks directly with daily altimetry data has transformed our daily ocean state reanalysis accuracy across coastal waters.',
      icon: Building2,
      color: 'border-sky-500/30'
    },
    {
      category: 'COMMERCIAL MARITIME & CLIMATE',
      name: 'Bayer Marine & Bio-Agri',
      speaker: 'Elena Rostova',
      role: 'Climate Resilience Director',
      quote: 'Having meter-scale depth profiles for salinity and density gives our global maritime logistics teams unprecedented clarity during extreme marine weather events.',
      icon: ShieldCheck,
      color: 'border-emerald-500/30'
    }
  ];

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4 font-sans">
          Hear from our partners
        </h2>
        <p className="text-lg text-slate-300 font-normal">
          Organizations across ocean science, climate research, and civil government work with Ocean Embedded to gain a global, dynamic perspective about their most pressing marine challenges.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {partners.map((partner, idx) => {
          const Icon = partner.icon;
          return (
            <div 
              key={idx}
              className={`p-8 rounded-[32px] bg-slate-900/60 border ${partner.color} backdrop-blur-xl hover:bg-slate-900/90 transition-all duration-300 flex flex-col justify-between shadow-2xl group`}
            >
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-[11px] font-mono font-bold tracking-widest text-slate-400 uppercase">
                    {partner.category}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-cyan-400/40 mb-4 group-hover:text-cyan-300 transition-colors" />

                <p className="text-sm text-slate-200 leading-relaxed italic mb-8 font-serif">
                  "{partner.quote}"
                </p>
              </div>

              <div className="pt-6 border-t border-slate-800 flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold shrink-0">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {partner.speaker}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {partner.role} • <span className="text-cyan-400 font-medium">{partner.name}</span>
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
