import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, ComposedChart, Scatter } from 'recharts';

// Synthetic profile data matching oceanic thermocline physics
const profileData = [
  { depth: 0, aiTemp: 26.4, argoTemp: 26.5, uncertaintyUpper: 26.65, uncertaintyLower: 26.15 },
  { depth: 50, aiTemp: 23.1, argoTemp: 23.0, uncertaintyUpper: 23.35, uncertaintyLower: 22.85 },
  { depth: 100, aiTemp: 19.4, argoTemp: 19.2, uncertaintyUpper: 19.70, uncertaintyLower: 19.10 },
  { depth: 200, aiTemp: 14.2, argoTemp: 14.3, uncertaintyUpper: 14.50, uncertaintyLower: 13.90 },
  { depth: 300, aiTemp: 11.5, argoTemp: 11.4, uncertaintyUpper: 11.80, uncertaintyLower: 11.20 },
  { depth: 500, aiTemp: 8.6, argoTemp: 8.5, uncertaintyUpper: 8.85, uncertaintyLower: 8.35 },
  { depth: 750, aiTemp: 5.8, argoTemp: 5.9, uncertaintyUpper: 6.05, uncertaintyLower: 5.55 },
  { depth: 1000, aiTemp: 4.1, argoTemp: 4.1, uncertaintyUpper: 4.30, uncertaintyLower: 3.90 }
];

export default function DepthProfileChart({ selectedDepth, onSelectDepth }) {
  const [activeMetric, setActiveMetric] = useState('temp');

  return (
    <div className="glass-panel p-4 rounded-2xl border border-cyan-500/20 w-full shadow-2xl backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2 mb-3">
        <div>
          <div className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            VERTICAL SUBSURFACE TEMPERATURE PROFILE
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            AI ESTIMATION VS ARGO FLOAT #4902311 SOUNDING
          </div>
        </div>

        {/* Legend Pills */}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <div className="flex items-center gap-1">
            <span className="w-3 h-0.5 bg-cyan-400" />
            <span className="text-cyan-300">AI MODEL</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span className="text-amber-300">ARGO FLOAT</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-2 bg-cyan-500/20 border border-cyan-500/40 rounded-sm" />
            <span className="text-slate-400">UNCERTAINTY</span>
          </div>
        </div>
      </div>

      {/* Recharts Temperature vs Depth Profile */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={profileData}
            margin={{ top: 10, right: 20, left: -10, bottom: 5 }}
            onClick={(e) => {
              if (e && e.activePayload && e.activePayload.length > 0) {
                onSelectDepth && onSelectDepth(e.activePayload[0].payload.depth);
              }
            }}
          >
            <XAxis 
              dataKey="aiTemp" 
              type="number" 
              domain={[0, 30]} 
              unit="°C" 
              stroke="#64748b" 
              fontSize={10} 
              fontFamily="JetBrains Mono"
            />
            <YAxis 
              dataKey="depth" 
              type="number" 
              reversed={true} 
              domain={[0, 1000]} 
              unit="m" 
              stroke="#64748b" 
              fontSize={10} 
              fontFamily="JetBrains Mono"
            />
            <Tooltip 
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const delta = (data.aiTemp - data.argoTemp).toFixed(2);
                  return (
                    <div className="glass-panel p-2.5 rounded-lg border border-cyan-400/50 text-[11px] font-mono shadow-xl backdrop-blur-md">
                      <div className="text-cyan-400 font-bold">DEPTH: {data.depth} m</div>
                      <div className="text-cyan-300">AI MODEL: {data.aiTemp}°C</div>
                      <div className="text-amber-400">ARGO SOUNDING: {data.argoTemp}°C</div>
                      <div className="text-slate-400 text-[10px] mt-1 pt-1 border-t border-slate-800">
                        BIAS DELTA: <span className={Math.abs(delta) < 0.2 ? "text-emerald-400" : "text-amber-400"}>{delta}°C</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />

            {/* Uncertainty Error Band Shading */}
            <Area 
              type="monotone" 
              dataKey="uncertaintyUpper" 
              stroke="none" 
              fill="#00f2ff" 
              fillOpacity={0.15} 
            />

            {/* AI Estimation Curve */}
            <Line 
              type="monotone" 
              dataKey="aiTemp" 
              stroke="#00f2ff" 
              strokeWidth={2.5} 
              dot={{ r: 3, fill: '#00f2ff' }} 
              activeDot={{ r: 6, fill: '#ffffff', stroke: '#00f2ff', strokeWidth: 2 }}
            />

            {/* ARGO Float Sounding Scatter Dots */}
            <Scatter 
              dataKey="argoTemp" 
              fill="#f59e0b" 
              stroke="#f59e0b" 
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Metric Info Bar */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-800/80">
        <div>RMSE ERROR: <span className="text-emerald-400 font-bold">0.12°C</span></div>
        <div>MODEL RELIABILITY: <span className="text-cyan-300 font-bold">98.4%</span></div>
        <div>ARGO SYNC: <span className="text-cyan-400 font-bold">12 MINS AGO</span></div>
      </div>
    </div>
  );
}
