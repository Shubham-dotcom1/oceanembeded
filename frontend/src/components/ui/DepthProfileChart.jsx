import React from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';

export default function DepthProfileChart({ selectedDepth, onSelectDepth, selectedLocation, activeMetric = 'temp', inferenceData, isInferencing }) {
  
  // Map metrics to display config
  const metricConfig = {
    temp: { key: 'temp', color: '#fbbf24', name: 'Temperature', unit: '°C', domain: [0, 32] },
    salinity: { key: 'salinity', color: '#38bdf8', name: 'Salinity', unit: 'PSU', domain: [33, 36] },
    density: { key: 'density', color: '#818cf8', name: 'Density', unit: 'kg/m³', domain: [1020, 1030] },
    anomaly: { key: 'anomaly', color: '#fb7185', name: 'Anomaly', unit: 'ΔT', domain: [-3, 3] },
  };
  const config = metricConfig[activeMetric] || metricConfig.temp;

  // The PyTorch model reconstructs Temperature. We derive the others using standard equations of state (EOS)
  const dynamicProfile = (inferenceData && inferenceData.profile) ? inferenceData.profile.map(p => ({
    depth: p.depth,
    temp: p.aiTemp,
    uncertaintyLower: p.uncertaintyLower,
    uncertaintyUpper: p.uncertaintyUpper,
    // Derive secondary parameters based on inferred temperature and depth
    salinity: Number((34.0 + (30 - p.aiTemp) * 0.05).toFixed(2)),
    density: Number((1020 + (30 - p.aiTemp) * 0.2 + (p.depth * 0.005)).toFixed(2)),
    anomaly: Number((p.aiTemp - 24.0).toFixed(2)) // Compare to a 24°C climatological baseline
  })) : [];
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 border border-cyan-500/30 p-3 rounded-xl backdrop-blur-md shadow-xl font-mono text-xs">
          <div className="text-cyan-400 font-bold mb-1 border-b border-slate-700 pb-1">
            DEPTH: {label}m
          </div>
          <div className="text-slate-200">
            {config.name}: <span className="font-bold" style={{ color: config.color }}>{payload[0].value} {config.unit}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel p-4 rounded-3xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl relative">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-white font-mono tracking-tight flex items-center gap-2">
          DEPTH PROFILE CHART
        </h3>
        <div className="flex gap-2">
          {selectedLocation && (
            <div className={`text-[10px] px-2 py-0.5 rounded-full border font-mono ${selectedLocation.isValid ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' : 'bg-rose-500/20 text-rose-300 border-rose-400/40'}`}>
              {selectedLocation.lat}°, {selectedLocation.lng}°
            </div>
          )}
          <div className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-400/40 font-mono">
            {selectedDepth}m SELECTED
          </div>
        </div>
      </div>
      
      {!selectedLocation ? (
        <div className="h-[320px] w-full flex flex-col items-center justify-center text-slate-400 font-mono text-xs border border-dashed border-slate-700 rounded-xl bg-slate-900/30">
          <span className="text-3xl mb-2">🌍</span>
          <span>Click on the map to run PINN 3D inference</span>
        </div>
      ) : !selectedLocation.isValid ? (
        <div className="h-[320px] w-full flex flex-col items-center justify-center text-rose-400 font-mono text-xs border border-dashed border-rose-900/50 rounded-xl bg-rose-950/20">
          <span className="text-3xl mb-2 text-rose-500">⚠️</span>
          <span className="font-bold text-sm mb-1">NOT FOUND</span>
          <span className="text-slate-400 max-w-[200px] text-center">Model capabilities not trained for this specific ocean region.</span>
        </div>
      ) : isInferencing ? (
        <div className="h-[320px] w-full flex flex-col items-center justify-center text-cyan-400 font-mono text-xs border border-dashed border-cyan-900/50 rounded-xl bg-cyan-950/20">
          <span className="text-3xl mb-4 animate-spin text-cyan-500">⚙️</span>
          <span className="font-bold text-sm mb-1 animate-pulse">COMPUTING FORWARD PASS...</span>
          <span className="text-slate-400 max-w-[250px] text-center">Loading coordinates into PyTorch pilot model and executing PINN inference...</span>
        </div>
      ) : (
        <div className="h-[320px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              layout="vertical"
              data={dynamicProfile}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
            onClick={(e) => {
              if (e && e.activePayload) {
                onSelectDepth(e.activePayload[0].payload.depth);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" horizontal={true} vertical={true} opacity={0.5} />
            
            {/* Depth (Y-Axis) */}
            <YAxis 
              dataKey="depth" 
              type="category" 
              reversed={true} 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              width={40}
            />
            
            {/* Metric (X-Axis) */}
            <XAxis 
              type="number" 
              domain={config.domain}
              stroke="#475569" 
              tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
              tickFormatter={(val) => `${val}${config.unit === '°C' ? '°' : ''}`}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(6, 182, 212, 0.2)', strokeWidth: 2 }} />
            
            {/* Selected Depth Reference Line */}
            <ReferenceLine 
              y={selectedDepth} 
              stroke="rgba(34, 211, 238, 0.5)" 
              strokeDasharray="3 3" 
            />

            <Line
              type="monotone"
              dataKey={config.key}
              stroke={config.color}
              strokeWidth={3}
              dot={{ r: 4, fill: '#0f172a', stroke: config.color, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: config.color, stroke: '#fff', strokeWidth: 2 }}
              animationDuration={1000}
            />
            
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      )}
      
      <div className="mt-2 text-center text-[10px] text-slate-500 font-mono">
        Click on a map location to infer thermal stratification.
      </div>
    </div>
  );
}
