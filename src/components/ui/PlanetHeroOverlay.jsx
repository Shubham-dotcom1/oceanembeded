import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUpRight, Activity, Globe, Compass, Layers, Radio, Sparkles, Cpu, Waves, ShieldCheck } from 'lucide-react';

export default function PlanetHeroOverlay({ onOpenDashboard }) {
  const [activeTab, setActiveTab] = useState(0);

  const heroModes = [
    { title: 'Act on it.', color: 'from-cyan-300 via-sky-300 to-emerald-400', desc: 'Convert raw ocean satellite data into actionable decisions for climate resilience & maritime navigation.' },
    { title: 'Dive deeper.', color: 'from-emerald-300 via-teal-300 to-cyan-400', desc: 'Reconstruct complete 3D subsurface temperature & salinity profiles down to 1,000 meters depth.' },
    { title: 'Predict futures.', color: 'from-sky-300 via-blue-300 to-cyan-300', desc: 'Forecast marine heatwaves, thermocline anomalies, and acoustic propagation with PINN AI.' },
  ];

  // Auto-rotate dynamic action text every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTab((prev) => (prev + 1) % heroModes.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const pillars = [
    {
      id: 'broader',
      tag: 'LOOK BROADER',
      title: 'Global Satellite Altimetry',
      desc: 'Expand your vantage point with daily sea surface temperature & surface anomaly monitoring across all global oceans.',
      icon: Globe,
      color: 'from-cyan-500/20 to-sky-500/10 border-cyan-500/40',
      badge: 'SURFACE SST • 100% GLOBAL'
    },
    {
      id: 'backward',
      tag: 'LOOK BACKWARD',
      title: '30-Year Ocean Climate Archive',
      desc: 'Go back in time to analyze historical ocean thermocline shifts, El Niño anomalies, and decadal heat storage dynamics.',
      icon: Compass,
      color: 'from-sky-500/20 to-blue-500/10 border-sky-500/40',
      badge: '1993 - 2026 ARCHIVE'
    },
    {
      id: 'closer',
      tag: 'LOOK CLOSER',
      title: 'High-Res Autonomous Profilers',
      desc: 'Inspect real-time telemetry from 4,000+ ARGO floats, CTD oceanographic casts, and gliders down to meter-scale precision.',
      icon: Activity,
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40',
      badge: '4,000+ ARGO FLOATS'
    },
    {
      id: 'deeper',
      tag: 'LOOK DEEPER',
      title: 'Subsurface Physics-AI Reconstructions',
      desc: 'Measure changing temperature, salinity, and water density profiles down to 1,000 meters in real time using PINNs.',
      icon: Layers,
      color: 'from-cyan-400/25 to-emerald-400/10 border-cyan-400/50',
      badge: '0m - 1,000m DEPTH'
    }
  ];

  return (
    <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto text-slate-100">
      {/* Background Radial Glow & Ambient Particles */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[450px] bg-gradient-to-tr from-cyan-500/20 via-emerald-500/15 to-blue-600/10 blur-[120px] pointer-events-none rounded-full" />

      {/* Main Tagline, Interactive Ticker & Headline Container */}
      <div className="max-w-4xl mx-auto text-center mb-12 relative z-10">
        
        {/* Live Telemetry Metric Ticker Bar */}
        <div className="inline-flex flex-wrap items-center justify-center gap-3 px-4 py-2 rounded-full bg-slate-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold tracking-wider uppercase mb-8 shadow-[0_0_30px_rgba(0,242,255,0.2)] backdrop-blur-2xl">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            LIVE TELEMETRY
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400" />
            4,218 ARGO FLOATS
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1 text-slate-300">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            PINN 3D ACCURACY: 99.4%
          </span>
        </div>

        {/* Dynamic Interactive Headline */}
        <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white leading-[1.08] mb-6 font-sans">
          Don't just observe change. <br />
          <span className={`bg-gradient-to-r ${heroModes[activeTab].color} bg-clip-text text-transparent transition-all duration-700 inline-block`}>
            {heroModes[activeTab].title}
          </span>
        </h1>

        {/* Interactive Mode Pills Switcher */}
        <div className="flex items-center justify-center gap-2 mb-8 font-mono">
          {heroModes.map((mode, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTab(idx)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === idx
                  ? 'bg-cyan-500/25 border border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,242,255,0.4)] scale-105'
                  : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${activeTab === idx ? 'bg-cyan-400' : 'bg-slate-600'}`} />
              <span>0{idx + 1}. {mode.title.replace('.', '')}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Subheadline Text */}
        <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal mb-10 min-h-[56px] transition-opacity duration-500">
          {heroModes[activeTab].desc}
        </p>

        {/* Ultra-Luxury CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-5 font-mono mb-16">
          <button 
            onClick={onOpenDashboard}
            className="group relative px-8 py-4 rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-400 text-slate-950 font-extrabold text-sm tracking-wider flex items-center gap-3 shadow-[0_0_40px_rgba(34,211,238,0.5)] transition-all hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Waves className="w-4 h-4 text-slate-950 animate-bounce" />
            <span>LAUNCH MAP OBSERVATORY</span>
            <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          
          <a 
            href="#data-grid"
            className="px-8 py-4 rounded-full bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-cyan-400/60 font-bold text-sm tracking-wider flex items-center gap-2 transition-all hover:scale-105 shadow-xl"
          >
            <span>EXPLORE DATA PRODUCTS</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </a>
        </div>
      </div>

      {/* FEATURED OCEAN SATELLITE HERO IMAGE FRAME */}
      <div 
        onClick={onOpenDashboard}
        className="relative mb-20 max-w-6xl mx-auto rounded-[36px] overflow-hidden border border-cyan-500/40 bg-slate-950 p-2 shadow-[0_0_70px_rgba(34,211,238,0.25)] group cursor-pointer"
      >
        <div className="relative rounded-[30px] overflow-hidden aspect-[16/9] max-h-[540px] w-full">
          <img 
            src="/images/hero-ocean.jpg" 
            alt="Ocean Satellite & Subsurface Observatory Telemetry" 
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Gradient Overlay For Contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-slate-950/40" />

          {/* Top Left Live HUD Badge */}
          <div className="absolute top-5 left-5 flex flex-wrap items-center gap-2 font-mono text-[11px]">
            <div className="bg-slate-950/80 backdrop-blur-xl border border-cyan-500/50 text-cyan-300 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-2xl">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>SENTINEL-3 REMOTE SENSING</span>
            </div>
            <div className="bg-slate-950/80 backdrop-blur-xl border border-emerald-500/50 text-emerald-300 px-3.5 py-1.5 rounded-full flex items-center gap-2 shadow-2xl">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>3D THERMOCLINE PINN (0-1,000M)</span>
            </div>
          </div>

          {/* Bottom Right CTA Floating Pill */}
          <div className="absolute bottom-6 right-6 bg-slate-950/90 backdrop-blur-2xl border border-cyan-400 text-cyan-200 px-5 py-2.5 rounded-full flex items-center gap-2 shadow-2xl group-hover:bg-cyan-400 group-hover:text-slate-950 font-mono text-xs font-bold transition-all">
            <span>EXPLORE 3D MAP OBSERVATORY</span>
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 4 Multidimensional Vantage Cards (Planet.com Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {pillars.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div 
              key={pillar.id}
              className={`p-6 rounded-3xl bg-slate-900/60 border ${pillar.color} backdrop-blur-xl hover:bg-slate-900/90 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group cursor-pointer shadow-xl`}
              onClick={onOpenDashboard}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                    {pillar.tag}
                  </span>
                  <div className="p-2 rounded-xl bg-slate-800/80 text-cyan-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-200 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                  {pillar.badge}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-300 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
