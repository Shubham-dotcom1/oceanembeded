import React from 'react';
import { motion } from 'framer-motion';
import { Database, CheckCircle2, Grid, Cpu, Brain, ShieldAlert } from 'lucide-react';

const pipelineStages = [
  {
    id: '01',
    title: 'Automatic Ingestion',
    tag: 'DATA ACQUISITION',
    subtitle: 'Daily Automated Satellite & Data Ingestion',
    description: 'Daily automated data pipelines fetch high-resolution Surface Sea Temperature (SST) from AVHRR/VIIRS microwave sensors and Sea Surface Height (SSH) altimetry from Sentinel satellites.',
    icon: Database,
    color: 'from-cyan-500 to-blue-600',
    accentHex: '#00f2ff',
    tech: ['Apache Airflow', 'NetCDF4', 'NOAA CoastWatch']
  },
  {
    id: '02',
    title: 'Quality Control (QC)',
    tag: 'VERIFICATION',
    subtitle: 'Data Accuracy & Masking Verification',
    description: 'Rigorous automated quality flags filter out cloud-contaminated pixels, sensor noise artifacts, atmospheric interference, and missing spatial observation tiles.',
    icon: CheckCircle2,
    color: 'from-emerald-500 to-teal-600',
    accentHex: '#10b981',
    tech: ['PyResample', 'QC Masking', 'Outlier Filtering']
  },
  {
    id: '03',
    title: 'Spatial Harmonization',
    tag: 'GRID MESH',
    subtitle: 'Grid Standardization & Multi-Sensor Alignment',
    description: 'Re-grids diverse satellite observations, wind stress data, and bathymetric grids onto a consistent 1/12° (~9km) regular spatial-temporal ocean mesh.',
    icon: Grid,
    color: 'from-sky-500 to-indigo-600',
    accentHex: '#0ea5e9',
    tech: ['Bilinear Interpolation', 'Kriging', 'Xarray']
  },
  {
    id: '04',
    title: 'Feature Engineering',
    tag: 'HYDRODYNAMICS',
    subtitle: 'Hydrodynamic Proxy & Feature Prep',
    description: 'Extracts relevant oceanographic features including geostrophic current velocities, sea surface density anomalies, and thermocline depth proxies.',
    icon: Cpu,
    color: 'from-amber-500 to-orange-600',
    accentHex: '#f59e0b',
    tech: ['Geostrophic Engine', 'PyTorch Preproc', 'Proxy Matrix']
  },
  {
    id: '05',
    title: '3D PINN AI Reconstruction',
    tag: 'NEURAL INVERSION',
    subtitle: '3D Physics-Informed Neural Network',
    description: 'Employs deep physics-informed neural network architectures enforcing hydrostatic & geostrophic balance to reconstruct 3D subsurface ocean temperature & salinity down to 1,000m.',
    icon: Brain,
    color: 'from-orange-500 to-rose-600',
    accentHex: '#f97316',
    tech: ['PyTorch PINN', 'CUDA Physics Core', '0m–1000m Inversion']
  },
  {
    id: '06',
    title: 'Uncertainty Estimation',
    tag: 'BAYESIAN QA',
    subtitle: 'Confidence Interval & Error Bounds',
    description: 'Calculates depth-dependent confidence intervals (±0.12°C) and reliability metrics, flagging low-confidence regions for targeted in-situ observations.',
    icon: ShieldAlert,
    color: 'from-rose-500 to-pink-600',
    accentHex: '#f43f5e',
    tech: ['Monte Carlo Dropout', 'Bayesian Ensembles', 'ARGO QA']
  }
];

export default function MVPWorkflowSection() {
  return (
    <section id="workflow" className="py-20 px-6 max-w-7xl mx-auto z-30 relative font-sans">
      {/* Background Bioluminescent Grid Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#00f2ff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16 relative z-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-4 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          SYSTEM ARCHITECTURE & PIPELINE
        </div>
        <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-4 leading-tight">
          MVP Workflow <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent text-cyan-glow">Architecture</span>
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          From raw satellite Earth observation telemetry to validated 3D subsurface thermal fields: inspect how our physics-informed AI pipeline operates.
        </p>
      </div>

      {/* Clean 6-Stage Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {pipelineStages.map((stage) => {
          const Icon = stage.icon;
          return (
            <motion.div
              key={stage.id}
              whileHover={{ y: -4 }}
              className="glass-panel p-6 rounded-3xl border border-cyan-500/20 hover:border-cyan-400/50 transition-all relative overflow-hidden flex flex-col justify-between bg-slate-950/80 shadow-2xl group"
            >
              {/* Accent Top Line */}
              <div 
                className="absolute top-0 left-0 right-0 h-1 opacity-70 group-hover:opacity-100 transition-opacity"
                style={{ background: stage.accentHex }}
              />

              <div>
                {/* Stage Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${stage.color} flex items-center justify-center text-slate-950 font-bold shadow-xl shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest block">
                        STAGE {stage.id}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {stage.tag}
                      </span>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white mb-2 tracking-tight">
                  {stage.title}
                </h3>

                <p className="text-slate-300 text-xs leading-relaxed font-sans mb-4">
                  {stage.description}
                </p>
              </div>

              {/* Tech Badges Row */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-800/80 font-mono text-[10px]">
                {stage.tech.map((t, idx) => (
                  <span key={idx} className="bg-slate-900/90 text-cyan-300 px-2 py-0.5 rounded-md border border-slate-800">
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
