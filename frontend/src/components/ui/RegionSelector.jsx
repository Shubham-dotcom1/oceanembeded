import React from 'react';
import { Globe, Compass } from 'lucide-react';

export const OCEAN_REGIONS = [
  {
    id: 'north_indian_ocean',
    name: 'North Indian Ocean (Arabian Sea & Bay of Bengal)',
    coords: '15.0° N, 70.0° E',
    ocean: 'Indian Ocean',
    sst: '28.5°C',
    thermoclineDepth: '60m',
    description: 'Dynamic monsoon-driven region where our PINN 3D model is extensively trained.'
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
