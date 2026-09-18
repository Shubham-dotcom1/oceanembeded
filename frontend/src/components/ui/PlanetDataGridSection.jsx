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
    <section id="data-grid" className="py-24 px-[5vw] max-w-[1440px] mx-auto border-t border-white/10 select-none">
      <div className="max-w-3xl mb-14">
        <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#6EDCFF] font-sans block mb-3">
          MULTIDIMENSIONAL OBSERVATORY
        </span>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white tracking-tight leading-snug">
          Harness the power of multidimensional ocean insights to look broader with daily satellite monitoring, closer with in-situ profilers, and deeper with 3D physics-guided reconstructions.
        </h2>
      </div>

      {/* 3 High-Resolution Interactive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        
        {/* Card 1: Look broader */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-2xl bg-[#052847]/30 p-5 border border-white/10 hover:border-[#6EDCFF]/40 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Look broader.
            </h3>
            
            {/* Visual Media Box */}
            <div className="relative h-60 rounded-xl overflow-hidden bg-[#031A2E] border border-white/10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#064B78]/40 to-[#031A2E] flex items-center justify-center">
                <div className="w-full h-full opacity-60 bg-[radial-gradient(#6EDCFF_1px,transparent_1px)] [background-size:16px_16px] flex items-center justify-center">
                  <div className="w-40 h-28 rounded-full border border-cyan-400/30 bg-cyan-500/10 blur-sm" />
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#031A2E] px-3 py-1 rounded-full text-[11px] font-sans text-[#6EDCFF] border border-white/10">
                Arabian Sea • Surface Altimetry
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            Continuous daily sea surface monitoring identifying marine heatwaves, coastal upwelling, and sea surface height variations across continental shelves.
          </p>
        </div>

        {/* Card 2: Look closer */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-2xl bg-[#052847]/30 p-5 border border-white/10 hover:border-[#6EDCFF]/40 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Look closer.
            </h3>
            
            {/* Visual Media Box */}
            <div className="relative h-60 rounded-xl overflow-hidden bg-[#031A2E] border border-white/10 flex items-center justify-center p-4">
              <div className="w-full h-full rounded-lg border border-white/10 bg-[#052847]/40 p-3 flex flex-col justify-between font-mono text-[10px] text-white/80">
                <div className="flex justify-between border-b border-white/10 pb-1">
                  <span>BAY OF BENGAL TRANSECT</span>
                  <span className="text-[#6EDCFF]">LAT 14.2° N</span>
                </div>
                <div className="grid grid-cols-2 gap-2 my-auto">
                  <div className="bg-[#031A2E] p-2 rounded border border-white/5">
                    ARGO PROFILES: <span className="text-[#6EDCFF]">128 FLOATS</span>
                  </div>
                  <div className="bg-[#031A2E] p-2 rounded border border-white/5">
                    DEPTH RES: <span className="text-[#6EDCFF]">1 m CTD</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-[#031A2E] px-3 py-1 rounded-full text-[11px] font-sans text-[#6EDCFF] border border-white/10">
                Indian Ocean • In-Situ Telemetry
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            High-resolution targeted observations capturing localized vessel movement, harbour thermal plumes, and high-frequency in-situ profiler casts.
          </p>
        </div>

        {/* Card 3: Look deeper */}
        <div 
          onClick={onOpenDashboard}
          className="group cursor-pointer rounded-2xl bg-[#052847]/30 p-5 border border-white/10 hover:border-[#6EDCFF]/40 transition-all duration-300 flex flex-col justify-between"
        >
          <div className="mb-4">
            <h3 className="text-xl font-semibold text-white mb-4">
              Look deeper.
            </h3>
            
            {/* Visual Media Box with Recharts Graphic */}
            <div className="relative h-60 rounded-xl overflow-hidden bg-[#031A2E] border border-white/10 p-3 flex flex-col justify-between">
              <div className="text-[10px] font-mono text-white/60 mb-1 flex items-center justify-between">
                <span>SUB-SURFACE WATER TEMP (°C)</span>
                <span className="text-[#6EDCFF]">0 - 1000m DEPTH</span>
              </div>
              <div className="w-full h-36">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={graphData}>
                    <defs>
                      <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6EDCFF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#087DB5" stopOpacity={0.0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="month" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} domain={[0, 0.4]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#031A2E', borderColor: '#6EDCFF', borderRadius: '6px', fontSize: '11px', color: '#fff' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#6EDCFF" strokeWidth={1.5} fillOpacity={1} fill="url(#tempGradient)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-[#031A2E] px-3 py-1 rounded-full text-[11px] font-sans text-[#6EDCFF] border border-white/10 w-fit">
                Equatorial Indian Ocean • 3D PINN Model
              </div>
            </div>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            Reconstruct complete 3D subsurface ocean temperature, salinity, and density fields down to 1,000 meters depth using Physics-Informed AI.
          </p>
        </div>

      </div>
    </section>
  );
}
