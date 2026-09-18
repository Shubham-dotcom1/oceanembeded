import React from 'react';
import HeroNav from './HeroNav';
import EarthVisual from './EarthVisual';
import HeroCopy from './HeroCopy';
import HeroActions from './HeroActions';
import HeroMetrics from './HeroMetrics';
import OceanLabel from './OceanLabel';
import PhilosophyMarker from './PhilosophyMarker';
import ScrollIndicator from './ScrollIndicator';

export default function NautilusHeroSection({ onOpenDashboard, onExplore }) {
  const handleLaunch = () => {
    if (onOpenDashboard) onOpenDashboard();
  };

  const handleExplore = () => {
    if (onExplore) {
      onExplore();
    } else {
      const dataGrid = document.getElementById('data-grid');
      if (dataGrid) {
        dataGrid.scrollIntoView({ behavior: 'smooth' });
      } else if (onOpenDashboard) {
        onOpenDashboard();
      }
    }
  };

  return (
    <section 
      id="home"
      className="relative min-h-[92vh] lg:min-h-screen w-full flex flex-col justify-between overflow-hidden select-none"
      style={{
        background: `
          radial-gradient(
            circle at 68% 48%,
            rgba(35, 168, 225, 0.45),
            transparent 32%
          ),
          linear-gradient(
            115deg,
            #031A2E 0%,
            #064B78 52%,
            #087DB5 100%
          )
        `
      }}
    >
      {/* 1. Minimal Top Navigation */}
      <HeroNav onLaunchApp={handleLaunch} />

      {/* 2. Earth Centerpiece Visual with Atmospheric Glow & Orbital Satellite */}
      <EarthVisual />

      {/* 3. Main Hero Content Container */}
      <div className="relative z-20 w-full max-w-[1440px] mx-auto px-[5vw] pt-4 sm:pt-8 lg:pt-10 pb-16 lg:pb-20 flex-1 flex flex-col justify-center">
        <div className="max-w-[640px]">
          {/* Eyebrow, 'See Deeper' Headline, Supporting Copy */}
          <HeroCopy />

          {/* Solid CTAs: 'Explore the Ocean →' + '◯ Watch Video' */}
          <HeroActions onExplore={handleExplore} />

          {/* 3 Verified Scientific Metrics with 1px Vertical Dividers */}
          <HeroMetrics />
        </div>
      </div>

      {/* 4. Scientific Indian Ocean Annotation */}
      <OceanLabel />

      {/* 5. Brand Philosophy Marker on Lower Right */}
      <PhilosophyMarker />

      {/* 6. Scroll Indicator on Bottom Left */}
      <ScrollIndicator targetId="#data-grid" />
    </section>
  );
}
