import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Approximate coordinates for our zones based on the schema seed
const ZONE_COORDS = {
  1: [40.7128, -74.0060], // North Entrance
  2: [40.7129, -74.0061], // Main Hall
  3: [40.7130, -74.0062], // VIP Lounge
};

export default function StadiumMap({ zoneStates }) {
  const center = [40.7129, -74.0061];

  const getColor = (capacityPct) => {
    if (capacityPct >= 90) return '#ff003c'; // neon-red
    if (capacityPct >= 75) return '#ffb000'; // neon-amber
    return '#00f3ff'; // neon-cyan
  };

  const getRadius = (capacityPct) => {
    return 15 + (Math.min(capacityPct, 150) / 100) * 40; 
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_15px_rgba(0,243,255,0.15)] relative">
      {/* Decorative overlay border */}
      <div className="absolute inset-0 border-2 border-neon-cyan/20 rounded-xl pointer-events-none z-[1000]"></div>
      
      <MapContainer center={center} zoom={18} className="h-full w-full bg-gray-900" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />
        
        {Object.entries(zoneStates).map(([zoneId, data]) => (
          <CircleMarker
            key={zoneId}
            center={ZONE_COORDS[zoneId] || center}
            radius={getRadius(data.current_capacity_pct)}
            pathOptions={{
              color: getColor(data.current_capacity_pct),
              fillColor: getColor(data.current_capacity_pct),
              fillOpacity: 0.5,
              weight: 2,
            }}
          >
            <Popup>
              <div className="text-xs font-mono text-gray-900">
                <strong>Zone {zoneId}</strong><br/>
                Capacity: {data.current_capacity_pct}%<br/>
                Predicted (5m): {data.predicted_capacity_pct_5m}%
              </div>
            </Popup>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}
