import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import { Layers, Compass, Thermometer, ShieldCheck } from 'lucide-react';

export default function MapLibreOceanMap({ 
  selectedDepth = 0, 
  setSelectedDepth,
  onOpenArgoModal
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Depth color overlay mapping
  const depthStyles = {
    0: { name: 'Surface Sea Temperature (0m)', overlayColor: 'rgba(239, 68, 68, 0.25)', tempRange: '24°C – 28°C' },
    200: { name: 'Thermocline Layer (200m)', overlayColor: 'rgba(6, 182, 212, 0.35)', tempRange: '12°C – 16°C' },
    500: { name: 'Deep Water Structure (500m)', overlayColor: 'rgba(37, 99, 235, 0.45)', tempRange: '6°C – 9°C' },
    1000: { name: 'Abyssal Thermal Field (1000m)', overlayColor: 'rgba(124, 58, 237, 0.55)', tempRange: '3°C – 5°C' }
  };

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'carto-dark': {
              type: 'raster',
              tiles: [
                'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'
              ],
              tileSize: 256
            }
          },
          layers: [
            {
              id: 'carto-dark-layer',
              type: 'raster',
              source: 'carto-dark',
              minzoom: 0,
              maxzoom: 18
            }
          ]
        },
        center: [-68.4, 24.6], // Sargasso Sea / Atlantic Trench
        zoom: 5.5,
        pitch: 45,
        bearing: -15
      });

      map.on('load', () => {
        setMapLoaded(true);

        // Add ARGO Float Markers
        const argoPoints = [
          { lon: -68.2, lat: 24.5, id: 'ARGO-4902311', temp: '26.4°C', depth: '1000m' },
          { lon: -69.1, lat: 25.2, id: 'ARGO-5904122', temp: '25.8°C', depth: '1000m' },
          { lon: -67.6, lat: 23.9, id: 'ARGO-3901844', temp: '26.1°C', depth: '1000m' }
        ];

        argoPoints.forEach((pt) => {
          const el = document.createElement('div');
          el.className = 'argo-marker';
          el.innerHTML = `
            <div class="relative group cursor-pointer">
              <div class="w-4 h-4 rounded-full bg-cyan-400 border-2 border-slate-950 shadow-[0_0_12px_#00f2ff] animate-ping opacity-75"></div>
              <div class="absolute -top-1 -left-1 w-6 h-6 rounded-full bg-cyan-400 border-2 border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-950">A</div>
            </div>
          `;
          
          el.addEventListener('click', () => {
            onOpenArgoModal && onOpenArgoModal();
          });

          new maplibregl.Marker({ element: el })
            .setLngLat([pt.lon, pt.lat])
            .addTo(map);
        });
      });

      mapInstance.current = map;
    } catch (err) {
      console.warn("MapLibre init fallback:", err);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onOpenArgoModal]);

  // Smooth pitch & zoom vertical camera transition on depth level change
  useEffect(() => {
    if (mapInstance.current) {
      const targetPitch = 30 + (selectedDepth / 1000) * 35;
      const targetZoom = 5.5 + (selectedDepth / 1000) * 0.8;
      
      mapInstance.current.easeTo({
        pitch: targetPitch,
        zoom: targetZoom,
        duration: 1000
      });
    }
  }, [selectedDepth]);

  const currentInfo = depthStyles[selectedDepth] || depthStyles[0];

  return (
    <div className="relative w-full h-full rounded-3xl overflow-hidden border border-cyan-500/20 shadow-2xl glass-panel">
      {/* Map Container Element */}
      <div ref={mapContainer} className="w-full h-full min-h-[420px]" />

      {/* Dynamic Subsurface Color Overlay simulation when traveling vertically */}
      <div 
        className="absolute inset-0 pointer-events-none transition-all duration-1000 ease-out"
        style={{ backgroundColor: currentInfo.overlayColor }}
      />

      {/* Floating Depth Selection Controller Bar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 p-1.5 rounded-2xl glass-panel border border-cyan-500/30 backdrop-blur-xl">
        {[0, 200, 500, 1000].map((d) => (
          <button
            key={d}
            onClick={() => setSelectedDepth(d)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedDepth === d
                ? 'bg-cyan-500/30 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,242,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
            }`}
          >
            {d === 0 ? 'SURFACE (0m)' : `${d}m`}
          </button>
        ))}
      </div>

      {/* Map Status Info Badge */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-3 rounded-2xl border border-cyan-500/30 text-xs font-mono backdrop-blur-xl">
        <div className="flex items-center gap-2 text-cyan-400 font-bold mb-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{currentInfo.name}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300 text-[11px]">
          <div>EST TEMP: <span className="text-amber-400 font-bold">{currentInfo.tempRange}</span></div>
          <div>BOUNDS: <span className="text-cyan-300">24°N – 26°N</span></div>
        </div>
      </div>

      {/* ARGO Float Inspection Trigger Pill */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={onOpenArgoModal}
          className="glass-button px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 shadow-xl"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
          <span>LIVE ARGO PROFILE</span>
        </button>
      </div>
    </div>
  );
}
