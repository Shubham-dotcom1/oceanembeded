import React, { useState } from 'react';
import MapLibreOceanMap from './MapLibreOceanMap';
import DepthProfileChart from './DepthProfileChart';
import ScientificWorkflowGuide from './ScientificWorkflowGuide';
import RegionSelector, { OCEAN_REGIONS } from './RegionSelector';
import { Layers, ShieldCheck, Thermometer, Radio, Cpu, Navigation, Activity, Droplets, Gauge, AlertCircle } from 'lucide-react';

export default function DashboardLayout({ onOpenArgoModal }) {
  const [selectedDepth, setSelectedDepth] = useState(200);
  const [currentRegion, setCurrentRegion] = useState(OCEAN_REGIONS[0]);
  const [activeMetric, setActiveMetric] = useState('temp'); // 'temp' | 'salinity' | 'density' | 'anomaly'

  return (
    <div className="relative z-30 pt-24 pb-12 px-6 max-w-7xl mx-auto min-h-screen flex flex-col gap-4">
      {/* Top Header Card */}
      <div className="glass-panel p-4 rounded-3xl border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4 backdrop-blur-xl shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white font-mono tracking-tight flex items-center gap-2">
              SCIENTIFIC OCEAN OBSERVATORY
              <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/40 font-normal">
                PINN 3D INFERENCE
              </span>
            </h2>
            <div className="text-xs text-slate-400 font-mono">
              Selected: <span className="text-cyan-300 font-semibold">{currentRegion.name}</span> ({currentRegion.coords}) • Grid: 1/12° (~9km)
            </div>
          </div>
        </div>

        {/* Multi-Parameter Metric Switch Pills */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 font-mono text-xs">
          <button
            onClick={() => setActiveMetric('temp')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeMetric === 'temp' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5 text-amber-400" /> TEMP (T °C)
          </button>
          <button
            onClick={() => setActiveMetric('salinity')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeMetric === 'salinity' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Droplets className="w-3.5 h-3.5 text-sky-400" /> SALINITY (PSU)
          </button>
          <button
            onClick={() => setActiveMetric('density')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeMetric === 'density' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Gauge className="w-3.5 h-3.5 text-indigo-400" /> DENSITY (σ)
          </button>
          <button
            onClick={() => setActiveMetric('anomaly')}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition-all ${
              activeMetric === 'anomaly' ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" /> ANOMALY (ΔT)
          </button>
        </div>
      </div>

      {/* Interactive Ocean Region Switcher */}
      <RegionSelector 
        currentRegion={currentRegion}
        onSelectRegion={setCurrentRegion}
      />

      {/* Scientific Workflow Guide Banner */}
      <ScientificWorkflowGuide />

      {/* Main Grid: MapLibre Interactive Spatial Map + Side Telemetry Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Map View (Spans 2 columns on desktop) */}
        <div className="lg:col-span-2 h-[560px] relative">
          <MapLibreOceanMap 
            selectedDepth={selectedDepth}
            setSelectedDepth={setSelectedDepth}
            onOpenArgoModal={onOpenArgoModal}
          />
        </div>

        {/* Right Telemetry Column */}
        <div className="flex flex-col gap-6">
          {/* Vertical Depth Profile Graph */}
          <DepthProfileChart 
            selectedDepth={selectedDepth}
            onSelectDepth={setSelectedDepth}
          />

          {/* AI Model Reliability & Uncertainty Metrics Card */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-xs font-mono backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                MODEL CONFIDENCE & UNCERTAINTY
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/20 px-1.5 py-0.5 rounded">
                HIGH RELIABILITY
              </span>
            </div>

            <p className="text-slate-300 text-[11px] mb-3 leading-relaxed font-sans">
              Subsurface physics-informed neural network estimation confidence interval: <span className="text-cyan-300 font-bold">±0.12°C</span>. Validated against altimetry sea surface height anomalies.
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">MODEL RELIABILITY</div>
                <div className="text-lg font-bold text-cyan-300 mt-0.5">98.4%</div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">ARGO DRIFT VECTOR</div>
                <div className="text-lg font-bold text-amber-400 mt-0.5">0.14 m/s</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
