import React from 'react';
import { Map, Globe } from 'lucide-react';

export default function Navbar({ activeMode, setActiveMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#031A2E] border-b border-white/10">
      <div className="max-w-[1440px] mx-auto px-[5vw] h-16 flex items-center justify-between">

        {/* Left: Brand Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group select-none"
          onClick={() => setActiveMode('landing')}
        >
          <div className="w-8 h-8 flex items-center justify-center text-cyan-400">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
              <path d="M6 24C9 14 18 8 28 8C33 8 36 10 38 12C33 13 29 16 26 20C23 24 18 26 13 26C10 26 7.5 25.2 6 24Z" fill="currentColor" fillOpacity="0.95" />
              <path d="M7 27C11 31 18 33 26 31C32 29.5 36.5 25 38 18C35.5 21.5 31.5 24 26 24C21 24 16.5 21.5 14 17C12 13 9 10 6 12C8 16 8 22 7 27Z" fill="currentColor" fillOpacity="0.75" />
            </svg>
          </div>
          <span className="text-white font-semibold text-base tracking-[0.12em] uppercase font-sans">
            NAUTILUS
          </span>
        </div>

        {/* Right: Primary Action (Return / Switch) */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveMode(activeMode === 'dashboard' ? 'landing' : 'dashboard')}
            className="btn-nautilus-nav px-5 py-2.5 text-xs font-semibold tracking-wide flex items-center gap-2 cursor-pointer"
          >
            <Map className="w-3.5 h-3.5 text-[#073458]" />
            <span>{activeMode === 'dashboard' ? 'RETURN TO HOME' : 'OBSERVATORY DASHBOARD'}</span>
          </button>
        </div>

      </div>
    </header>
  );
}
