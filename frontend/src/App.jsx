import React, { useState } from 'react';
import Navbar from './components/ui/Navbar';
import NautilusHeroSection from './components/ui/hero/NautilusHeroSection';
import PlanetDataGridSection from './components/ui/PlanetDataGridSection';
import PlanetBannerSection from './components/ui/PlanetBannerSection';
import PlanetTestimonialsSection from './components/ui/PlanetTestimonialsSection';
import PlanetCTASection from './components/ui/PlanetCTASection';
import DashboardLayout from './components/ui/DashboardLayout';

export default function App() {
  const [activeMode, setActiveMode] = useState('landing'); // 'landing' | 'dashboard'

  return (
    <div className="min-h-screen w-full bg-[#031A2E] text-[#F4FBFF] font-sans select-none relative overflow-x-hidden m-0 p-0">
      {/* Main Content Area */}
      {activeMode === 'landing' ? (
        <main className="relative z-20">
          {/* NAUTILUS Hero Section (NASA × Climate Tech × Editorial) */}
          <NautilusHeroSection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />

          {/* 3 High-Resolution Interactive Cards (Look broader, Look closer, Look deeper) */}
          <div id="data-grid">
            <PlanetDataGridSection 
              onOpenDashboard={() => setActiveMode('dashboard')}
            />
          </div>

          {/* Full-Width Feature Banner ('Unlock a Clearer Ocean') */}
          <PlanetBannerSection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />

          {/* Partner & Scientific Testimonials Section */}
          <PlanetTestimonialsSection />

          {/* Bottom Conversion Section */}
          <PlanetCTASection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />
        </main>
      ) : (
        /* Scientific Map Observatory Dashboard View */
        <div>
          <Navbar 
            activeMode={activeMode}
            setActiveMode={setActiveMode}
          />
          <div className="pt-16">
            <DashboardLayout />
          </div>
        </div>
      )}
    </div>
  );
}

