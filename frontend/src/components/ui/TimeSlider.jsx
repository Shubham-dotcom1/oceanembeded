import React, { useState, useEffect } from 'react';
import { Play, Pause, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

export default function TimeSlider({ selectedDate, onDateChange, isInferencing }) {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Define time range (e.g., Year 2020 for GLORYS pilot data)
  const START_DATE = new Date('2020-01-01').getTime();
  const END_DATE = new Date('2020-12-31').getTime();
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  const currentDateMs = new Date(selectedDate).getTime();
  const progress = ((currentDateMs - START_DATE) / (END_DATE - START_DATE)) * 100;

  // Auto-play logic
  useEffect(() => {
    let interval;
    if (isPlaying && !isInferencing) {
      interval = setInterval(() => {
        handleStep(1);
      }, 1500); // 1.5 seconds per day to allow API inference to catch up
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentDateMs, isInferencing]);

  const handleStep = (direction) => {
    const newDateMs = currentDateMs + (direction * ONE_DAY * 7); // Step by 7 days for visibility
    if (newDateMs >= START_DATE && newDateMs <= END_DATE) {
      onDateChange(new Date(newDateMs).toISOString().split('T')[0]);
    } else if (newDateMs > END_DATE) {
      setIsPlaying(false); // Stop when reaching end
    }
  };

  const handleSliderChange = (e) => {
    const newProgress = parseFloat(e.target.value);
    const newDateMs = START_DATE + (newProgress / 100) * (END_DATE - START_DATE);
    onDateChange(new Date(newDateMs).toISOString().split('T')[0]);
  };

  return (
    <div className="w-full glass-panel p-3 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-2xl flex items-center gap-4">
      {/* Play/Pause Button */}
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className="w-10 h-10 shrink-0 rounded-full bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 hover:bg-cyan-500/40 transition-colors shadow-[0_0_15px_rgba(34,211,238,0.3)]"
      >
        {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-1" />}
      </button>

      <div className="flex-1 flex flex-col gap-2">
        <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wider">{selectedDate}</span>
          </div>
          <div className="text-slate-400 flex gap-2">
            <button onClick={() => handleStep(-1)} className="hover:text-cyan-300"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => handleStep(1)} className="hover:text-cyan-300"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Custom Range Slider */}
        <div className="relative h-2 bg-slate-800 rounded-full w-full">
          {/* Active Track */}
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-600 to-cyan-300 rounded-full"
            style={{ width: `${progress}%` }}
          />
          {/* Slider Input */}
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="0.1"
            value={progress}
            onChange={handleSliderChange}
            className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
