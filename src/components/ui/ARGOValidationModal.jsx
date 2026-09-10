import React from 'react';
import { X, ShieldCheck, Cpu, Database, Activity, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ARGOValidationModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const soundingRows = [
    { depth: '0 m (Surface)', argo: '26.50 °C', ai: '26.42 °C', delta: '-0.08 °C', status: 'Optimal' },
    { depth: '50 m', argo: '23.04 °C', ai: '23.10 °C', delta: '+0.06 °C', status: 'Optimal' },
    { depth: '100 m', argo: '19.22 °C', ai: '19.40 °C', delta: '+0.18 °C', status: 'Compliant' },
    { depth: '200 m', argo: '14.30 °C', ai: '14.21 °C', delta: '-0.09 °C', status: 'Optimal' },
    { depth: '500 m', argo: '8.52 °C', ai: '8.60 °C', delta: '+0.08 °C', status: 'Optimal' },
    { depth: '1000 m (Abyss)', argo: '4.10 °C', ai: '4.12 °C', delta: '+0.02 °C', status: 'Optimal' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="glass-panel w-full max-w-3xl rounded-3xl border border-cyan-500/40 p-6 shadow-2xl overflow-hidden relative"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
                  ARGO FLOAT NETWORK VALIDATION
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-normal">
                    PASSED QA
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Ground-truth autonomous profiler cross-validation telemetry
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900/80 text-slate-400 hover:text-white border border-slate-700/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> RMSE BIAS
              </div>
              <div className="text-xl font-bold text-emerald-400 mt-1">0.12 °C</div>
              <div className="text-[9px] text-slate-500">Target &lt; 0.25°C</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" /> MAE ERROR
              </div>
              <div className="text-xl font-bold text-cyan-300 mt-1">0.09 °C</div>
              <div className="text-[9px] text-slate-500">Mean Abs Error</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-indigo-400" /> R² SCORE
              </div>
              <div className="text-xl font-bold text-indigo-300 mt-1">0.984</div>
              <div className="text-[9px] text-slate-500">Correlation Coefficient</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-teal-400" /> SAMPLE COUNT
              </div>
              <div className="text-xl font-bold text-teal-300 mt-1">14,280</div>
              <div className="text-[9px] text-slate-500">Active Profiles</div>
            </div>
          </div>

          {/* Detailed Sounding Comparison Table */}
          <div className="mb-4">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold mb-2">
              FLOAT #4902311 PROFILE SOUNDING MATCH
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 font-mono text-xs">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-400 text-[10px]">
                  <tr>
                    <th className="p-3">DEPTH ZONE</th>
                    <th className="p-3">ARGO OBSERVED</th>
                    <th className="p-3">AI MODEL PRED</th>
                    <th className="p-3">DELTA BIAS</th>
                    <th className="p-3 text-right">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-200">
                  {soundingRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                      <td className="p-3 font-semibold text-cyan-300">{row.depth}</td>
                      <td className="p-3 text-amber-300">{row.argo}</td>
                      <td className="p-3 text-cyan-400">{row.ai}</td>
                      <td className="p-3 text-slate-300">{row.delta}</td>
                      <td className="p-3 text-right">
                        <span className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-500/30">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer Close */}
          <div className="flex items-center justify-between pt-2 border-t border-cyan-500/20 text-xs font-mono text-slate-400">
            <div>Sensor Spec: Sea-Bird SBE 41CP CTD Profiler</div>
            <button
              onClick={onClose}
              className="glass-button px-4 py-2 rounded-xl text-xs font-semibold"
            >
              CLOSE VALIDATION
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
