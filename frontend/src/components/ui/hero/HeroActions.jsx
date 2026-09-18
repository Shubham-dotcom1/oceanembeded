import React, { useState } from 'react';
import { ArrowRight, Play, X } from 'lucide-react';

export default function HeroActions({ onExplore, onWatchVideo }) {
  const [showVideoModal, setShowVideoModal] = useState(false);

  const handleVideoClick = () => {
    if (onWatchVideo) {
      onWatchVideo();
    } else {
      setShowVideoModal(true);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-8 sm:mt-10 select-none">
        {/* Primary CTA: Explore the Ocean */}
        <button
          onClick={onExplore}
          className="btn-nautilus-primary px-7 sm:px-8 py-4 text-[15px] sm:text-[16px] font-semibold tracking-wide flex items-center gap-3 group cursor-pointer"
        >
          <span>Explore the Ocean</span>
          <ArrowRight className="w-4 h-4 text-[#073458] group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Secondary CTA: Watch Video */}
        <button
          onClick={handleVideoClick}
          className="flex items-center gap-3.5 text-[#F0FAFF]/90 hover:text-white transition-colors group cursor-pointer py-2 px-1"
        >
          {/* Circular Play Icon Outline */}
          <div className="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white group-hover:border-white group-hover:scale-105 transition-all">
            <Play className="w-4 h-4 fill-white/85 text-white/85 translate-x-[1px]" />
          </div>
          <span className="text-[15px] sm:text-[16px] font-medium tracking-wide">
            Watch Video
          </span>
        </button>
      </div>

      {/* Video Preview Modal */}
      {showVideoModal && (
        <div 
          className="fixed inset-0 z-50 bg-[#031A2E]/85 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowVideoModal(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-[#052847] border border-cyan-400/20 rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 px-6 flex items-center justify-between border-b border-white/10 bg-[#031A2E]">
              <span className="text-xs font-semibold tracking-widest text-[#6EDCFF] uppercase font-sans">
                NAUTILUS // 3D Ocean Intelligence Overview
              </span>
              <button 
                onClick={() => setShowVideoModal(false)}
                className="text-white/70 hover:text-white p-1 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-[#031A2E] flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/30 flex items-center justify-center mb-4 text-white hover:scale-105 transition-transform cursor-pointer">
                <Play className="w-6 h-6 fill-white translate-x-0.5" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Transform Satellite Data Into 3D Depth</h3>
              <p className="text-sm text-[#EBF9FF]/80 max-w-md leading-relaxed">
                Watch how NAUTILUS converts multi-spectral sea surface observations and satellite altimetry into 0-1,000m physics-informed subsurface profiles.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
