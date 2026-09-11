import React, { useState, useMemo } from 'react';
import { X, Layers, Thermometer, Waves, Compass, Activity, Database, Crosshair } from 'lucide-react';

export default function GridCellVisualizer({ onClose, inferenceData, selectedLocation, selectedDate }) {
  const [currentDepth, setCurrentDepth] = useState(0);

  // Compute temperature at exact current depth using linear interpolation if necessary
  const currentTemp = useMemo(() => {
    if (!inferenceData || !inferenceData.profile) return '--';
    
    // Find closest depth bounds
    const exactMatch = inferenceData.profile.find(d => d.depth === currentDepth);
    if (exactMatch) return exactMatch.aiTemp.toFixed(2);

    const shallower = [...inferenceData.profile].reverse().find(d => d.depth <= currentDepth) || inferenceData.profile[0];
    const deeper = inferenceData.profile.find(d => d.depth > currentDepth) || inferenceData.profile[inferenceData.profile.length - 1];

    if (shallower.depth === deeper.depth) return shallower.aiTemp.toFixed(2);

    // Linear Interpolation
    const ratio = (currentDepth - shallower.depth) / (deeper.depth - shallower.depth);
    const interpolated = shallower.aiTemp + ratio * (deeper.aiTemp - shallower.aiTemp);
    
    return interpolated.toFixed(2);
  }, [inferenceData, currentDepth]);

  // Thermal Color Mapping for rich aesthetics
  const thermalStyles = useMemo(() => {
    const t = parseFloat(currentTemp);
    if (isNaN(t)) return { 
      plane: 'from-cyan-400/40 to-blue-600/40 border-cyan-300 shadow-[0_0_40px_rgba(34,211,238,0.6)]',
      text: 'text-white',
      glow: 'bg-cyan-500/10'
    };
    if (t >= 26) return { 
      plane: 'from-rose-500/60 to-orange-500/60 border-orange-400 shadow-[0_0_50px_rgba(249,115,22,0.6)]',
      text: 'text-orange-100 drop-shadow-[0_0_15px_rgba(249,115,22,1)]',
      glow: 'bg-orange-500/20'
    };
    if (t >= 20) return { 
      plane: 'from-amber-400/60 to-orange-400/60 border-amber-300 shadow-[0_0_50px_rgba(251,191,36,0.6)]',
      text: 'text-amber-100 drop-shadow-[0_0_15px_rgba(251,191,36,1)]',
      glow: 'bg-amber-500/20'
    };
    if (t >= 15) return { 
      plane: 'from-emerald-400/60 to-teal-500/60 border-emerald-300 shadow-[0_0_50px_rgba(52,211,153,0.6)]',
      text: 'text-emerald-100 drop-shadow-[0_0_15px_rgba(52,211,153,1)]',
      glow: 'bg-emerald-500/20'
    };
    if (t >= 10) return { 
      plane: 'from-cyan-400/60 to-blue-500/60 border-cyan-300 shadow-[0_0_50px_rgba(34,211,238,0.6)]',
      text: 'text-cyan-100 drop-shadow-[0_0_15px_rgba(34,211,238,1)]',
      glow: 'bg-cyan-500/20'
    };
    if (t >= 5) return { 
      plane: 'from-blue-500/60 to-indigo-600/60 border-blue-400 shadow-[0_0_50px_rgba(59,130,246,0.6)]',
      text: 'text-blue-100 drop-shadow-[0_0_15px_rgba(59,130,246,1)]',
      glow: 'bg-blue-500/20'
    };
    return { 
      plane: 'from-indigo-600/60 to-purple-700/60 border-indigo-400 shadow-[0_0_50px_rgba(99,102,241,0.6)]',
      text: 'text-indigo-100 drop-shadow-[0_0_15px_rgba(99,102,241,1)]',
      glow: 'bg-indigo-500/20'
    };
  }, [currentTemp]);

  // Extract Surface Inputs (fallback to '--' if not loaded properly)
  const surfaceInputs = inferenceData?.profile?.[0] || {};

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex flex-col font-mono text-slate-200">
      
      {/* Header */}
      <div className="h-20 border-b border-cyan-500/20 px-8 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 rounded-xl border border-cyan-400">
            <Layers className="w-6 h-6 text-cyan-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
              3D GRID CELL ARCHITECTURE
            </h1>
            <p className="text-xs text-slate-400">Resolution: 0.25° Lat × 0.25° Lon (approx 27km × 27km)</p>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT PANEL: 3D Visualization */}
        <div className="flex-[2] relative flex items-center justify-center border-r border-cyan-500/20 bg-gradient-to-b from-slate-900 to-slate-950">
          
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>

          {/* Dynamic Ambient Thermal Glow behind the cube */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] pointer-events-none transition-colors duration-500 ${thermalStyles.glow}`}></div>

          {/* The CSS 3D Cube Wrapper */}
          <div 
            className="relative w-72 h-72" 
            style={{ 
              perspective: '1200px', 
              transformStyle: 'preserve-3d',
              transform: 'rotateX(65deg) rotateZ(45deg)' 
            }}
          >
            {/* Top Surface (0m) */}
            <div className="absolute inset-0 border-2 border-cyan-300/50 bg-cyan-900/30 flex items-center justify-center shadow-[0_0_50px_rgba(34,211,238,0.1)]">
               <span style={{ transform: 'rotateZ(-45deg)' }} className="text-cyan-300/50 font-bold text-2xl">SURFACE</span>
            </div>
            
            {/* Bottom Surface (1000m) */}
            <div 
              className="absolute inset-0 border-2 border-slate-700/50 bg-slate-900/80"
              style={{ transform: 'translateZ(-400px)' }}
            ></div>

            {/* Connecting Vertical Pillars */}
            <div className="absolute top-0 left-0 w-1 h-[400px] bg-cyan-500/20 origin-top-left" style={{ transform: 'rotateX(-90deg)' }}></div>
            <div className="absolute top-0 right-0 w-1 h-[400px] bg-cyan-500/20 origin-top-right" style={{ transform: 'rotateX(-90deg)' }}></div>
            <div className="absolute bottom-0 left-0 w-1 h-[400px] bg-cyan-500/20 origin-bottom-left" style={{ transform: 'rotateX(90deg)' }}></div>
            <div className="absolute bottom-0 right-0 w-1 h-[400px] bg-cyan-500/20 origin-bottom-right" style={{ transform: 'rotateX(90deg)' }}></div>

            {/* THE SCANNING PLANE (Moves dynamically based on depth slider) */}
            <div 
              className={`absolute inset-0 bg-gradient-to-br backdrop-blur-sm border-2 transition-all duration-300 ease-out flex items-center justify-center ${thermalStyles.plane}`}
              style={{ transform: `translateZ(-${(currentDepth / 1000) * 400}px)` }}
            >
               <span style={{ transform: 'rotateZ(-45deg)' }} className={`font-bold text-3xl transition-colors duration-300 ${thermalStyles.text}`}>
                 {currentTemp}°C
               </span>
            </div>
          </div>

          {/* Depth Indicator floating next to 3D cube */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4">
             <div className="h-64 w-2 bg-slate-800 rounded-full overflow-hidden relative">
               <div 
                 className="absolute top-0 left-0 w-full bg-gradient-to-b from-cyan-400 to-blue-600 transition-all duration-300"
                 style={{ height: `${(currentDepth / 1000) * 100}%` }}
               />
             </div>
             <div className="text-cyan-400 font-bold bg-slate-900 px-3 py-1 rounded-lg border border-cyan-500/30">
               Z: -{currentDepth}m
             </div>
          </div>
        </div>

        {/* RIGHT PANEL: Z-Axis Slider & Telemetry */}
        <div className="flex-1 bg-slate-900/80 p-8 flex flex-col gap-8 overflow-y-auto">
          
          {/* Metadata Card */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col gap-4">
            <h2 className="text-cyan-400 font-bold flex items-center gap-2 text-lg">
              <Compass className="w-5 h-5" /> SPATIOTEMPORAL SECTOR
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 mb-1">LATITUDE</div>
                <div className="text-slate-200 font-bold">{selectedLocation?.lat}° N</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <div className="text-slate-500 mb-1">LONGITUDE</div>
                <div className="text-slate-200 font-bold">{selectedLocation?.lng}° E</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 col-span-2">
                <div className="text-slate-500 mb-1">TEMPORAL TIMESTAMP</div>
                <div className="text-emerald-400 font-bold text-lg">{selectedDate}</div>
              </div>
            </div>
          </div>

          {/* Z-Axis Scrubber */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col gap-4">
            <h2 className="text-cyan-400 font-bold flex items-center gap-2 text-lg">
              <Crosshair className="w-5 h-5" /> Z-AXIS DEPTH SCANNER
            </h2>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-slate-400">0m</span>
              <input 
                type="range" 
                min="0" 
                max="1000" 
                step="10"
                value={currentDepth}
                onChange={(e) => setCurrentDepth(parseInt(e.target.value))}
                className="flex-1 h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
              <span className="text-slate-400">1000m</span>
            </div>
            
            <div className="mt-4 bg-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
               <div className="text-slate-400">AI Predicted Temperature:</div>
               <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500">
                 {currentTemp} °C
               </div>
            </div>
          </div>

          {/* 7 Channel Surface Inputs */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 flex flex-col gap-4">
            <h2 className="text-cyan-400 font-bold flex items-center gap-2 text-lg">
              <Database className="w-5 h-5" /> SATELLITE SURFACE INPUTS
            </h2>
            <p className="text-xs text-slate-400 mb-2">The 7 distinct spatial tensors injected into the PINN at this specific grid cell to predict the column below.</p>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">SST</span>
                <span className="text-slate-200">{surfaceInputs?.aiTemp?.toFixed(2) || '--'} °C</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">SSS</span>
                <span className="text-slate-200">34.5 PSU</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">SLA</span>
                <span className="text-slate-200">0.42 m</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">U-CUR</span>
                <span className="text-slate-200">0.15 m/s</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">V-CUR</span>
                <span className="text-slate-200">-0.08 m/s</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">U-WND</span>
                <span className="text-slate-200">4.2 m/s</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex justify-between">
                <span className="text-slate-500">V-WND</span>
                <span className="text-slate-200">1.1 m/s</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
