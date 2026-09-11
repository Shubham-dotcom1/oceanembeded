import React, { useState } from 'react';
import Navbar from './components/ui/Navbar';
import PlanetHeroOverlay from './components/ui/PlanetHeroOverlay';
import PlanetDataGridSection from './components/ui/PlanetDataGridSection';
import PlanetBannerSection from './components/ui/PlanetBannerSection';
import PlanetTestimonialsSection from './components/ui/PlanetTestimonialsSection';
import PlanetCTASection from './components/ui/PlanetCTASection';
import DashboardLayout from './components/ui/DashboardLayout';

export default function App() {
  const [activeMode, setActiveMode] = useState('landing'); // 'landing' | 'dashboard'

  return (
    <div className="min-h-screen w-full bg-[#080c14] text-slate-100 font-sans select-none relative overflow-x-hidden">
      {/* Scanline texture overlay for scientific aesthetic */}
      <div className="scanline-overlay fixed inset-0 z-10 pointer-events-none opacity-30" />

      {/* Top Floating Header (Planet.com style) */}
      <Navbar 
        activeMode={activeMode}
        setActiveMode={setActiveMode}
      />

      {/* Main Content Area */}
      {activeMode === 'landing' ? (
        <main className="relative z-20">
          {/* Hero Section */}
          <PlanetHeroOverlay 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />

          {/* 3 High-Resolution Interactive Cards (Look broader, Look closer, Look deeper) */}
          <PlanetDataGridSection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />

          {/* Full-Width Feature Banner ('Unlock a Clearer Ocean') */}
          <PlanetBannerSection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />

          {/* Partner & Customer Testimonials Section */}
          <PlanetTestimonialsSection />

          {/* Bottom Conversion Section */}
          <PlanetCTASection 
            onOpenDashboard={() => setActiveMode('dashboard')}
          />
        </main>
      ) : (
        /* Scientific Map Observatory Dashboard View */
        <div className="pt-20">
          <DashboardLayout />
        </div>
      )}
    </div>
  );
}
