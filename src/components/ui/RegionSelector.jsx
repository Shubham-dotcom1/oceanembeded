import React from 'react';
import { Globe, Compass } from 'lucide-react';

export const OCEAN_REGIONS = [
  {
    id: 'gulf_stream',
    name: 'Gulf Stream Thermal Front',
    coords: '24.5° N, 68.2° W',
    ocean: 'North Atlantic',
    sst: '26.4°C',
    thermoclineDepth: '180m',
    description: 'Dynamic boundary current with intense mesoscale eddies and sharp subsurface thermal gradients.'
  },
  {
    id: 'equatorial_pacific',
    name: 'Equatorial Pacific (El Niño Zone)',
    coords: '0.5° S, 140.2° W',
    ocean: 'Tropical Pacific',
    sst: '29.1°C',
    thermoclineDepth: '90m',
    description: 'Strong thermocline slope displacement driven by trade wind relaxation during ENSO warming cycles.'
  },
  {
    id: 'sargasso_trench',
    name: 'Sargasso Deep Basin',
    coords: '26.1° N, 64.5° W',
    ocean: 'Central Atlantic',
    sst: '24.8°C',
    thermoclineDepth: '220m',
    description: 'Highly stratified subtropical gyre system used as global ARGO profiler calibration baseline.'
  },
  {
    id: 'southern_ocean',
    name: 'Southern Ocean Antarctic Front',
    coords: '55.4° S, 42.1° W',
    ocean: 'Antarctic Circumpolar',
    sst: '4.2°C',
    thermoclineDepth: '40m',
    description: 'Dense Antarctic Bottom Water (AABW) formation site with intense vertical mixing.'
  }
];

export default function RegionSelector({ currentRegion, onSelectRegion }) {
  return (
    <div className="glass-panel p-3 rounded-2xl border border-cyan-500/30 flex items-center justify-between gap-2 backdrop-blur-xl mb-4 font-mono text-xs overflow-x-auto">
      <div className="flex items-center gap-2 text-cyan-400 font-bold shrink-0">
        <Globe className="w-4 h-4" />
        <span>OCEAN REGION:</span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto">
        {OCEAN_REGIONS.map((reg) => (
          <button
            key={reg.id}
            onClick={() => onSelectRegion(reg)}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
              currentRegion.id === reg.id
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_12px_rgba(0,242,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200 bg-slate-950/60 border border-slate-800'
            }`}
          >
            {reg.name}
          </button>
        ))}
      </div>
    </div>
  );
}
