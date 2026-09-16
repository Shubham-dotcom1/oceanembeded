import React, { useState } from 'react';
import MapLibreOceanMap from './MapLibreOceanMap';
import DepthProfileChart from './DepthProfileChart';
import ScientificWorkflowGuide from './ScientificWorkflowGuide';
import RegionSelector, { OCEAN_REGIONS } from './RegionSelector';
import TimeSlider from './TimeSlider';
import GridCellVisualizer from './GridCellVisualizer';
import ARGOValidationModal from './ARGOValidationModal';
import { Layers, ShieldCheck, Thermometer, Radio, Cpu, Navigation, Activity, Droplets, Gauge, AlertCircle, Waves, ArrowDownToLine, Maximize2, Search, Box } from 'lucide-react';
import { Client } from "@gradio/client";

export default function DashboardLayout({ onOpenArgoModal }) {
  const [selectedDepth, setSelectedDepth] = useState(0);
  const [currentRegion, setCurrentRegion] = useState(OCEAN_REGIONS[0]);
  const [activeMetric, setActiveMetric] = useState('temp'); // 'temp' | 'salinity' | 'density' | 'anomaly'
  const [selectedLocation, setSelectedLocation] = useState(null); // { lat, lng, isValid }
  const [selectedDate, setSelectedDate] = useState('2020-01-01');
  const [inferenceData, setInferenceData] = useState(null);
  const [isInferencing, setIsInferencing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [isGridCellOpen, setIsGridCellOpen] = useState(false);
  const [isArgoModalOpen, setIsArgoModalOpen] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    // Parse coordinates and optional date (e.g., 15.0, 70.0 2020-05-15)
    const coordMatch = searchInput.match(/([+-]?\d*\.?\d+)\s*,\s*([+-]?\d*\.?\d+)/);
    const dateMatch = searchInput.match(/\b(20\d{2}-\d{2}-\d{2})\b/);

    if (!coordMatch) return alert("Please enter coordinates in format: Lat, Lng (e.g. 15.0, 70.0)");

    const lat = parseFloat(coordMatch[1]);
    const lng = parseFloat(coordMatch[2]);

    let isValid = lng >= 50 && lng <= 95 && lat >= 0 && lat <= 25;

    if (isValid) {
      try {
        const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
        const data = await res.json();
        if (data && data.elevation && data.elevation[0] > 5) isValid = false;
      } catch (err) { }
    }

    setSelectedLocation({ lat: lat.toFixed(2), lng: lng.toFixed(2), isValid });
    if (dateMatch) {
      setSelectedDate(dateMatch[1]);
    }
  };

  React.useEffect(() => {
    if (selectedLocation && selectedLocation.isValid) {
      setIsInferencing(true);
      // Hugging Face ZeroGPU requires us to use the official Gradio Client 
      // because requests go into a Queue (WebSockets) and standard HTTP POST will fail.
      const runInference = async () => {
        try {
          const client = await Client.connect("Shubham1029/nautilius-backend");
          const result = await client.predict("/reconstruct", [
            parseFloat(selectedLocation.lat),
            parseFloat(selectedLocation.lng),
            selectedDate
          ]);
          setInferenceData(result.data[0]);
          setIsInferencing(false);
        } catch (err) {
          console.error("Inference Error:", err);
          setIsInferencing(false);
        }
      };
      runInference();
    } else {
      setInferenceData(null);
    }
  }, [selectedLocation, selectedDate]);

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

        {/* Global Coordinate Search Bar */}
        <div className="flex items-center gap-1 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 font-mono text-xs shadow-inner">
          <form onSubmit={handleSearch} className="flex items-center">
            <Search className="w-4 h-4 text-cyan-400 ml-2" />
            <input
              type="text"
              placeholder="Search Lat, Lng, Date (e.g. 15.0, 70.0 2020-05-15)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="bg-transparent border-none outline-none text-xs font-mono text-cyan-100 placeholder:text-slate-500 px-3 py-1.5 w-80"
            />
            <button type="submit" className="hidden">Search</button>
          </form>
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
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="h-[520px] relative w-full">
            <MapLibreOceanMap
              selectedDepth={selectedDepth}
              setSelectedDepth={setSelectedDepth}
              onOpenArgoModal={() => setIsArgoModalOpen(true)}
              onMapClick={setSelectedLocation}
              selectedLocation={selectedLocation}
            />
          </div>
          <TimeSlider
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            isInferencing={isInferencing}
          />
        </div>

        {/* Right Telemetry Column */}
        <div className="flex flex-col gap-6">
          {/* Action Trigger for 3D Grid Cell */}
          {inferenceData && (
            <button
              onClick={() => setIsGridCellOpen(true)}
              className="w-full glass-panel p-4 rounded-2xl border-2 border-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-between group shadow-[0_0_20px_rgba(34,211,238,0.2)] hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]"
            >
              <div className="flex items-center gap-3">
                <Box className="w-6 h-6 text-cyan-300 group-hover:scale-110 transition-transform" />
                <div className="flex flex-col items-start font-mono">
                  <span className="text-cyan-300 font-bold text-sm tracking-wider">EXPLORE 3D GRID CELL</span>
                  <span className="text-slate-400 text-[10px]">0.25° × 0.25° Volumetric Architecture</span>
                </div>
              </div>
              <Maximize2 className="w-5 h-5 text-cyan-500/50 group-hover:text-cyan-300 transition-colors" />
            </button>
          )}

          {/* Vertical Depth Profile Graph */}
          <div className="flex-1 glass-panel rounded-3xl p-5 border border-cyan-500/30 shadow-2xl relative overflow-hidden flex flex-col">
            <DepthProfileChart
              selectedDepth={selectedDepth}
              onSelectDepth={setSelectedDepth}
              selectedLocation={selectedLocation}
              inferenceData={inferenceData}
              isInferencing={isInferencing}
            />
          </div>

          {/* AI Model Reliability & Uncertainty Metrics Card */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-xs font-mono backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                MODEL CONFIDENCE & UNCERTAINTY
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${selectedLocation?.isValid ? 'text-emerald-400 bg-emerald-500/20' : 'text-slate-500 bg-slate-800'}`}>
                {selectedLocation?.isValid ? 'HIGH RELIABILITY' : 'STANDBY'}
              </span>
            </div>

            <p className="text-slate-300 text-[11px] mb-3 leading-relaxed font-sans">
              {selectedLocation?.isValid
                ? `Running inference for coordinates [${selectedLocation.lat}°, ${selectedLocation.lng}°] against North Indian Ocean weights.`
                : 'Awaiting valid map coordinate selection to compute scientific confidence intervals.'}
            </p>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">MODEL RELIABILITY</div>
                <div className={`text-lg font-bold mt-0.5 ${inferenceData ? 'text-cyan-300' : 'text-slate-600 animate-pulse'}`}>
                  {isInferencing ? 'COMPUTING...' : inferenceData ? `${inferenceData.reliability}%` : 'PENDING'}
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">TRUST SCORE</div>
                <div className={`text-lg font-bold mt-0.5 ${inferenceData ? 'text-amber-400' : 'text-slate-600 animate-pulse'}`}>
                  {isInferencing ? 'COMPUTING...' : inferenceData ? inferenceData.trust_score : 'PENDING'}
                </div>
              </div>
            </div>
          </div>

          {/* 7-Channel Satellite Surface Inputs */}
          <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 text-xs font-mono backdrop-blur-xl shadow-xl">
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
              <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                <Waves className="w-4 h-4 text-cyan-400" />
                SATELLITE SURFACE SENSORS (INPUTS)
              </span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${inferenceData ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-500 bg-slate-800'}`}>
                7-CHANNELS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">SST (Surface Temp)</div>
                <div className="text-sm font-bold text-amber-300 mt-1">
                  {isInferencing ? '...' : inferenceData ? inferenceData.profile[0]?.aiTemp : '--'} <span className="text-[9px] font-normal text-slate-500">°C</span>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">SSS (Surface Salinity)</div>
                <div className="text-sm font-bold text-cyan-300 mt-1">
                  {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.sss.toFixed(2) : '--'} <span className="text-[9px] font-normal text-slate-500">PSU</span>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">SSH (Sea Surface Height)</div>
                <div className="text-sm font-bold text-indigo-300 mt-1">
                  {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.ssh.toFixed(2) : '--'} <span className="text-[9px] font-normal text-slate-500">m</span>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800">
                <div className="text-slate-400">U / V CURRENTS</div>
                <div className="text-sm font-bold text-emerald-300 mt-1 flex gap-2">
                  <span>U: {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.u_curr.toFixed(2) : '--'}</span>
                  <span>V: {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.v_curr.toFixed(2) : '--'}</span>
                </div>
              </div>
              <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 col-span-2">
                <div className="text-slate-400">U / V WINDS</div>
                <div className="text-sm font-bold text-sky-300 mt-1 flex gap-4">
                  <span>U: {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.u_wind.toFixed(1) : '--'} m/s</span>
                  <span>V: {isInferencing ? '...' : inferenceData?.inputs ? inferenceData.inputs.v_wind.toFixed(1) : '--'} m/s</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen 3D Grid Cell Overlay */}
      {isGridCellOpen && (
        <GridCellVisualizer
          onClose={() => setIsGridCellOpen(false)}
          inferenceData={inferenceData}
          selectedLocation={selectedLocation}
          selectedDate={selectedDate}
        />
      )}

      {/* ARGO Float Validation Modal */}
      <ARGOValidationModal
        isOpen={isArgoModalOpen}
        onClose={() => setIsArgoModalOpen(false)}
        inferenceData={inferenceData}
        selectedLocation={selectedLocation}
        selectedDate={selectedDate}
      />

    </div>
  );
}
