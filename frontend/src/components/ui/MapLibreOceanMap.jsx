import React, { useEffect, useRef, useState } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Layers, Compass, Thermometer, ShieldCheck, Search, Radio } from 'lucide-react';

export default function MapLibreOceanMap({ 
  selectedDepth = 0, 
  setSelectedDepth,
  onOpenArgoModal,
  onMapClick,
  selectedLocation
}) {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);
  const selectedMarker = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locationName, setLocationName] = useState('');

  // Depth color overlay mapping
  const depthStyles = {
    0: { color: 'rgba(56, 189, 248, 0.1)', name: 'Surface (0m)' },
    10: { color: 'rgba(14, 165, 233, 0.2)', name: 'Epipelagic (10m)' },
    50: { color: 'rgba(2, 132, 199, 0.3)', name: 'Mixed Layer (50m)' },
    100: { color: 'rgba(3, 105, 161, 0.4)', name: 'Thermocline (100m)' },
    200: { color: 'rgba(15, 23, 42, 0.6)', name: 'Mesopelagic (200m)' },
    500: { color: 'rgba(2, 6, 23, 0.8)', name: 'Bathypelagic (500m)' },
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!mapInstance.current) {
      const map = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'satellite': {
              type: 'raster',
              tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              attribution: 'ESRI World Imagery'
            }
          },
          layers: [{
            id: 'satellite-layer',
            type: 'raster',
            source: 'satellite',
            minzoom: 0,
            maxzoom: 19
          }]
        },
        center: [80.0, 15.0], // Centered on India / North Indian Ocean
        zoom: 4,
        pitch: 0,
        bearing: 0,
        maxBounds: [[45.0, -20.0], [100.0, 35.0]] // Strict bounds: only India & Indian Ocean
      });

      map.on('load', () => {
        setMapLoaded(true);

        // Add ocean depth styling overlay
        map.addSource('ocean-depth', {
          type: 'geojson',
          data: {
            type: 'Feature',
            geometry: {
              type: 'Polygon',
              coordinates: [[[45, -20], [100, -20], [100, 35], [45, 35], [45, -20]]]
            }
          }
        });

        map.addLayer({
          id: 'ocean-depth-layer',
          type: 'fill',
          source: 'ocean-depth',
          paint: {
            'fill-color': depthStyles[selectedDepth]?.color || depthStyles[0].color,
            'fill-opacity': 1
          }
        });
      });

      // Handle map clicks - only compute validation and dispatch to parent!
      map.on('click', async (e) => {
        const { lng, lat } = e.lngLat;
        
        let isValid = lng >= 50 && lng <= 95 && lat >= 0 && lat <= 25; // North Indian Ocean training bounds
        
        // Ensure it's ocean, not land (Basic elevation check)
        if (isValid) {
          try {
            const res = await fetch(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lng}`);
            const data = await res.json();
            if (data && data.elevation && data.elevation[0] > 5) {
              isValid = false; // Landmass detected
            }
          } catch (err) {
            console.error(err);
          }
        }

        if (onMapClick) {
          onMapClick({ lat: lat.toFixed(2), lng: lng.toFixed(2), isValid });
        }
      });

      mapInstance.current = map;
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []); // Only run once on mount

  // Watch for depth changes to update color overlay
  useEffect(() => {
    if (mapLoaded && mapInstance.current) {
      if (mapInstance.current.getLayer('ocean-depth-layer')) {
        mapInstance.current.setPaintProperty(
          'ocean-depth-layer',
          'fill-color',
          depthStyles[selectedDepth]?.color || depthStyles[0].color
        );
      }
    }
  }, [selectedDepth, mapLoaded]);

  // Unidirectional flow: Watch for selectedLocation changes and react to them!
  useEffect(() => {
    if (selectedLocation) {
      // 1. Fly to the location
      if (mapInstance.current) {
        mapInstance.current.flyTo({ center: [parseFloat(selectedLocation.lng), parseFloat(selectedLocation.lat)], zoom: 5, duration: 1500 });
      }

      // 2. Manage Marker
      if (selectedMarker.current) {
        selectedMarker.current.remove();
      }

      const el = document.createElement('div');
      el.className = `w-4 h-4 rounded-full border-2 border-white cursor-pointer ${selectedLocation.isValid ? 'bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.8)]'}`;
      
      selectedMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat([parseFloat(selectedLocation.lng), parseFloat(selectedLocation.lat)])
        .addTo(mapInstance.current);

      // 3. Fetch Reverse Geocoding Name
      if (selectedLocation.isValid) {
        fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}&localityLanguage=en`)
          .then(res => res.json())
          .then(data => {
            const oceanName = data.localityInfo?.informational?.find(info => info.name.toLowerCase().includes('sea') || info.name.toLowerCase().includes('ocean'))?.name;
            setLocationName(oceanName || data.locality || data.city || data.principalSubdivision || 'Open Ocean');
          })
          .catch(err => {
            setLocationName('Ocean Region');
          });
      } else {
        setLocationName('');
      }
    } else {
      if (selectedMarker.current) selectedMarker.current.remove();
      setLocationName('');
    }
  }, [selectedLocation]);

  const currentInfo = depthStyles[selectedDepth] || depthStyles[0];

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/20 bg-slate-900">
      {/* Map Container Element */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full" />

      {/* Dynamic Subsurface Color Overlay simulation when traveling vertically */}
      <div 
        className="absolute inset-0 pointer-events-none transition-colors duration-1000 mix-blend-multiply z-[5]"
        style={{ backgroundColor: currentInfo.color }}
      />

      {/* ARGO Validation Button (Top Right) */}
      {selectedLocation?.isValid && (
        <div className="absolute top-4 right-4 z-10 animate-fade-in">
          <button 
            onClick={onOpenArgoModal}
            className="glass-panel p-2.5 rounded-xl border-2 border-emerald-500/60 hover:bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105"
          >
            <Radio className="w-4 h-4 animate-pulse" />
            ARGO VALIDATION
          </button>
        </div>
      )}

      {/* Floating Dynamic Bottom Panel */}
      <div className="absolute bottom-4 left-4 z-10 glass-panel p-4 rounded-2xl border border-cyan-500/30 backdrop-blur-xl shadow-xl flex items-center gap-6 min-w-[340px]">
        {/* Depth Dial */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center bg-slate-950/80 shadow-[inset_0_0_10px_rgba(34,211,238,0.2)]">
            <span className="font-bold text-cyan-300 font-mono text-sm">{selectedDepth}m</span>
          </div>
          <span className="text-[10px] text-cyan-500/80 font-mono font-bold tracking-widest uppercase">Depth Z-Axis</span>
        </div>

        <div className="h-10 w-px bg-cyan-500/20" />

        {/* Real-time Location Stats */}
        <div className="flex flex-col gap-1.5 flex-1 font-mono">
          <div className="flex items-center justify-between">
            <span className="text-cyan-400 font-bold text-xs flex items-center gap-1.5 uppercase">
              <Compass className="w-3.5 h-3.5" />
              {selectedLocation?.isValid && locationName ? locationName : 'LOCATION PENDING'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>COORD:</span>
            <span className="font-semibold text-slate-200">
              {selectedLocation ? `[${selectedLocation.lat}°, ${selectedLocation.lng}°]` : '--'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400">
            <span>EST TEMP:</span>
            <span className="font-semibold text-amber-300">
              {selectedLocation?.isValid ? (28.5 - (selectedDepth / 1000) * 24).toFixed(1) : '--'}°C
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
