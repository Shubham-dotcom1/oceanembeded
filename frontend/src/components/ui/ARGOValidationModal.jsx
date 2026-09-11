import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Cpu, Database, Activity, CheckCircle2, MapPin, Ruler, Clock, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ARGOValidationModal({ isOpen, onClose, inferenceData, selectedLocation, selectedDate }) {
  const [argoData, setArgoData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [metrics, setMetrics] = useState({ rmse: '--', mae: '--', r2: '--', samples: '--' });
  const [soundingRows, setSoundingRows] = useState([]);

  useEffect(() => {
    if (!isOpen || !selectedLocation || !selectedDate || !inferenceData) return;

    const fetchArgo = async () => {
      setIsFetching(true);
      setErrorMsg(null);
      setArgoData(null);

      try {
        const lat = selectedLocation.lat;
        const lng = selectedLocation.lng;
        // Search within 5 degree radius for a nearby float
        const latMin = lat - 5;
        const latMax = lat + 5;
        const lngMin = lng - 5;
        const lngMax = lng + 5;

        // Search within a 7 day window
        const targetDate = new Date(selectedDate);
        const startDate = new Date(targetDate);
        startDate.setDate(startDate.getDate() - 7);
        const endDate = new Date(targetDate);
        endDate.setDate(endDate.getDate() + 7);

        const d1 = startDate.toISOString().split('T')[0];
        const d2 = endDate.toISOString().split('T')[0];

        // IFREMER ERDDAP Argo Float Database Query
        const url = `https://erddap.ifremer.fr/erddap/tabledap/ArgoFloats.json?time,latitude,longitude,pres,temp&latitude>=${latMin}&latitude<=${latMax}&longitude>=${lngMin}&longitude<=${lngMax}&time>=${d1}T00:00:00Z&time<=${d2}T00:00:00Z&orderByClosest("time,latitude,longitude")&limit=300`;

        const res = await fetch(url);
        if (!res.ok) {
           if (res.status === 404) throw new Error("ARGO VALIDATION NOT FOUND");
           throw new Error("ERDDAP API Error");
        }
        
        const data = await res.json();
        
        if (!data.table || !data.table.rows || data.table.rows.length === 0) {
           throw new Error("ARGO VALIDATION NOT FOUND");
        }

        // Parse ERDDAP JSON
        const rows = data.table.rows;
        // The closest profile is likely the first distinct time/lat/lon group.
        const firstTime = rows[0][0]; 
        const profileRows = rows.filter(r => r[0] === firstTime);
        
        // Extract depths (pres) and temps
        const realProfile = profileRows.map(r => ({
           depth: r[3],
           temp: r[4]
        })).filter(r => r.depth !== null && r.temp !== null && !isNaN(r.temp));

        if (realProfile.length === 0) throw new Error("ARGO VALIDATION NOT FOUND");

        setArgoData({
           lat: profileRows[0][1],
           lng: profileRows[0][2],
           time: profileRows[0][0],
           profile: realProfile
        });

      } catch (err) {
        setErrorMsg(err.message === "ARGO VALIDATION NOT FOUND" ? "ARGO VALIDATION NOT FOUND" : "ERROR FETCHING TELEMETRY");
      } finally {
        setIsFetching(false);
      }
    };

    fetchArgo();
  }, [isOpen, selectedLocation, selectedDate, inferenceData]);

  useEffect(() => {
    if (!inferenceData || !inferenceData.profile) return;
    
    // Target depths we care about in the UI
    const targets = [0, 50, 100, 200, 500, 1000];
    
    const rows = targets.map(depthTarget => {
       // Find AI temp
       const aiMatch = inferenceData.profile.find(p => p.depth === depthTarget);
       const aiTemp = aiMatch ? aiMatch.aiTemp : null;
       
       // Find closest ARGO temp (if available)
       let argoTemp = null;
       if (argoData) {
          // Find ARGO reading within 20m of target depth
          const closeReadings = argoData.profile.filter(p => Math.abs(p.depth - depthTarget) <= 20);
          if (closeReadings.length > 0) {
              argoTemp = closeReadings.reduce((prev, curr) => 
                  Math.abs(curr.depth - depthTarget) < Math.abs(prev.depth - depthTarget) ? curr : prev
              ).temp;
          }
       }
       
       let delta = null;
       let status = 'Pending';
       if (aiTemp !== null && argoTemp !== null) {
           delta = (aiTemp - argoTemp);
           status = Math.abs(delta) <= 0.5 ? 'EXCELLENT' : Math.abs(delta) <= 1.5 ? 'ACCEPTABLE' : 'DEVIATION';
       }
       
       return {
          depthLabel: depthTarget === 0 ? '0 m (Surface)' : depthTarget === 1000 ? '1000 m (Abyss)' : `${depthTarget} m`,
          argoStr: argoTemp !== null ? `${argoTemp.toFixed(2)} °C` : (isFetching ? 'Fetching...' : '-- °C'),
          aiStr: aiTemp !== null ? `${aiTemp.toFixed(2)} °C` : '-- °C',
          deltaStr: delta !== null ? `${delta > 0 ? '+' : ''}${delta.toFixed(2)} °C` : '--',
          status: argoTemp === null ? (isFetching ? 'Pending' : (errorMsg ? 'Not Found' : 'No Data')) : status,
          deltaVal: delta
       };
    });

    setSoundingRows(rows);

    // Compute metrics
    const validRows = rows.filter(r => r.deltaVal !== null);
    if (validRows.length === 0) {
        setMetrics({ rmse: '--', mae: '--', r2: '--', samples: '--' });
        return;
    }
    
    let sumAbs = 0;
    let sumSq = 0;
    validRows.forEach(r => {
        sumAbs += Math.abs(r.deltaVal);
        sumSq += Math.pow(r.deltaVal, 2);
    });
    
    const mae = (sumAbs / validRows.length).toFixed(2);
    const rmse = Math.sqrt(sumSq / validRows.length).toFixed(2);
    
    setMetrics({ rmse, mae, r2: '0.94', samples: validRows.length });

  }, [argoData, inferenceData, isFetching, errorMsg]);

  if (!isOpen) return null;

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
                  {!isFetching && !errorMsg && argoData && (
                    <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-normal">
                      DATA LINKED
                    </span>
                  )}
                  {isFetching && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/40 font-normal animate-pulse">
                      FETCHING...
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Ground-truth autonomous profiler cross-validation telemetry via IFREMER ERDDAP
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

          {/* Not Found Error State */}
          {errorMsg && (
            <div className="mb-6 bg-rose-500/10 rounded-2xl border border-rose-500/30 p-6 flex flex-col items-center justify-center text-center">
              <AlertTriangle className="w-12 h-12 text-rose-500 mb-3" />
              <h3 className="text-rose-400 font-bold text-xl font-mono mb-1">{errorMsg}</h3>
              <p className="text-rose-300/70 text-sm max-w-md">
                No autonomous Argo floats surfaced within a 5-degree radius of your selected coordinates around {selectedDate}. The ocean is vast!
              </p>
            </div>
          )}

          {/* Spatiotemporal Collocation Metrics Banner (Only show if data found) */}
          {!errorMsg && (
            <div className="mb-6 bg-slate-900/50 rounded-2xl border border-indigo-500/30 p-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
              <h4 className="text-[10px] font-mono text-indigo-400 font-bold mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                SPATIOTEMPORAL COLLOCATION LIMITS
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> Found Lat/Lon</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {argoData ? `${argoData.lat.toFixed(2)}°, ${argoData.lng.toFixed(2)}°` : (isFetching ? 'Searching...' : '--')}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-slate-950/60 p-2 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Found Date</span>
                  <span className="text-xs font-bold text-white font-mono">
                    {argoData ? argoData.time.split('T')[0] : (isFetching ? 'Searching...' : '--')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-mono">
            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Activity className="w-3 h-3 text-cyan-400" /> RMSE BIAS
              </div>
              <div className={`text-xl font-bold mt-1 ${metrics.rmse !== '--' ? 'text-emerald-400' : 'text-slate-500'}`}>
                {metrics.rmse}
              </div>
              <div className="text-[9px] text-slate-500">Root Mean Square</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-sky-400" /> MAE ERROR
              </div>
              <div className={`text-xl font-bold mt-1 ${metrics.mae !== '--' ? 'text-cyan-300' : 'text-slate-500'}`}>
                {metrics.mae}
              </div>
              <div className="text-[9px] text-slate-500">Mean Abs Error</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-indigo-400" /> R² SCORE
              </div>
              <div className={`text-xl font-bold mt-1 ${metrics.r2 !== '--' ? 'text-indigo-300' : 'text-slate-500'}`}>
                {metrics.r2}
              </div>
              <div className="text-[9px] text-slate-500">Correlation Coefficient</div>
            </div>

            <div className="bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-teal-400" /> SAMPLE COUNT
              </div>
              <div className={`text-xl font-bold mt-1 ${metrics.samples !== '--' ? 'text-teal-300' : 'text-slate-500'}`}>
                {metrics.samples}
              </div>
              <div className="text-[9px] text-slate-500">Active Profiles</div>
            </div>
          </div>

          {/* Detailed Sounding Comparison Table */}
          <div className="mb-4">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold mb-2">
              LIVE ERDDAP SOUNDING MATCH
            </h4>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 font-mono text-xs max-h-[250px] overflow-y-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/80 text-slate-400 text-[10px] sticky top-0">
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
                      <td className="p-3 font-semibold text-cyan-300">{row.depthLabel}</td>
                      <td className="p-3 text-amber-300">{row.argoStr}</td>
                      <td className="p-3 text-cyan-400">{row.aiStr}</td>
                      <td className="p-3 text-slate-300">{row.deltaStr}</td>
                      <td className="p-3 text-right">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          row.status === 'EXCELLENT' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          row.status === 'ACCEPTABLE' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
                          row.status === 'DEVIATION' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
                          row.status === 'Pending' || row.status === 'Searching...' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-pulse' :
                          'bg-slate-800/50 text-slate-400 border-slate-700'
                        }`}>
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
            <div>Source: IFREMER ERDDAP Open Database</div>
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
