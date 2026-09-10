import React from 'react';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function PlanetDataGridSection({ onOpenDashboard }) {
  // Sample subsurface temperature profile dataset for the 3rd card
  const graphData = [
    { month: 'Jan 2025', temp: 0.28, depth: 200 },
    { month: 'Apr 2025', temp: 0.16, depth: 400 },
    { month: 'Jul 2025', temp: 0.12, depth: 600 },
    { month: 'Oct 2025', temp: 0.22, depth: 800 },
    { month: 'Jan 2026', temp: 0.15, depth: 1000 },
  ];

  return (
    <section id="data-grid" className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-800/80">
      <div className="max-w-3xl mb-14">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-snug mb-4">
          Harness the power of multidimensional Earth & Ocean insights to look broader with daily monitoring, closer with high-resolution tasking, and deeper with derived 3D physics data.
        </h2>
      </div>

      {/* 3 High-Resolution Interactive Planet.com Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Card 1: Look broader (Satellite Altimetry & Coastal Thermal SST) */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-[32px] bg-slate-900/60 p-4 border-2 border-emerald-400/80 hover:border-emerald-300 transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.15)] flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4 px-2">
              Look broader.
            </h3>
            
            {/* Visual Media Box */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-[1.01] transition-transform">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/60 via-slate-950 to-emerald-950/60 flex items-center justify-center">
                {/* Synthetic Radar Bathymetry Graphic */}
                <div className="w-full h-full opacity-70 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
                  <div className="w-48 h-32 rounded-full border border-cyan-400/50 bg-cyan-500/20 blur-sm animate-pulse" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-cyan-300 border border-cyan-500/40">
                Hood Canal, WA • 3 m Surface Altimetry
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 px-2 py-1 leading-relaxed">
            Continuous daily sea surface monitoring identifying marine heatwaves, coastal upwelling, and sea surface height variations across continental shelves.
          </p>
        </div>

        {/* Card 2: Look closer (High-Res Port & ARGO Vessel Tasking) */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-[32px] bg-slate-900/60 p-4 border-2 border-cyan-400/80 hover:border-cyan-300 transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.15)] flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4 px-2">
              Look closer.
            </h3>
            
            {/* Visual Media Box */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group-hover:scale-[1.01] transition-transform">
              <div className="absolute inset-0 bg-gradient-to-tr from-sky-950 via-slate-950 to-cyan-950 flex items-center justify-center p-4">
                {/* Port / Vessel Tasking Graphic */}
                <div className="w-full h-full rounded-xl border border-sky-500/30 bg-slate-900/80 p-3 flex flex-col justify-between font-mono text-[10px] text-sky-300">
                  <div className="flex justify-between border-b border-sky-500/30 pb-1">
                    <span>PORT OF SEATTLE OBS</span>
                    <span className="text-emerald-400">LAT 47.6° N</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-slate-300 my-auto">
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      VESSEL TRAFFIC: <span className="text-cyan-300">42 SHIPS</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded border border-slate-800">
                      FLOAT RES: <span className="text-emerald-400">50 cm SkySat</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-sky-300 border border-sky-500/40">
                Port of Seattle, WA • 50 cm ARGO Tasking
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 px-2 py-1 leading-relaxed">
            High-resolution targeted observations capturing localized vessel movement, harbour thermal plumes, and high-frequency in-situ profiler casts.
          </p>
        </div>

        {/* Card 3: Look deeper (Subsurface Temperature & Salinity Profiles) */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-[32px] bg-slate-900/60 p-4 border-2 border-emerald-400/80 hover:border-emerald-300 transition-all duration-300 shadow-[0_0_20px_rgba(52,211,153,0.15)] flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-2xl font-bold text-cyan-300 mb-4 px-2">
              Look deeper.
            </h3>
            
            {/* Visual Media Box with Recharts Graphic */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-3 group-hover:scale-[1.01] transition-transform">
              <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center justify-between">
                <span>SUB-SURFACE WATER TEMP (°C)</span>
                <span className="text-emerald-400">0 - 1000m DEPTH</span>
              </div>
              <div className="w-full h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.5}/>
                        <stop offset="95%" stopColor="#34d399" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#64748b' }} axisLine={false} domain={[0, 0.4]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#020617', borderColor: '#22d3ee', borderRadius: '8px', fontSize: '11px' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#tempGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-mono text-emerald-300 border border-emerald-500/40">
                Eastern Pacific • Subsurface PINN Model
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 px-2 py-1 leading-relaxed">
            Reconstruct complete 3D subsurface ocean temperature, salinity, and density fields down to 1,000 meters depth using Physics-Informed AI.
          </p>
        </div>

      </div>
    </section>
  );
}
