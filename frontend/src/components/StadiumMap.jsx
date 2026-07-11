import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const CENTER = [17.4065, 78.5538];

const ZONE_COORDS = {
  'A': [17.4070, 78.5538], // North
  'B': [17.4065, 78.5543], // East
  'C': [17.4060, 78.5538], // South
  'D': [17.4065, 78.5533], // West
};

const EXIT_COORDS = {
  'A': [17.4085, 78.5538],
  'B': [17.4065, 78.5560],
  'C': [17.4045, 78.5538],
  'D': [17.4065, 78.5515],
};

export default function StadiumMap({ zoneStates }) {
  const getColor = (capacityPct) => {
    if (capacityPct > 85) return '#ef4444'; 
    if (capacityPct >= 70) return '#eab308'; 
    return '#22c55e'; 
  };

  const getRadius = (capacityPct) => {
    return 15 + (Math.min(capacityPct, 150) / 100) * 40; 
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden border border-gray-800 shadow-[0_0_15px_rgba(0,243,255,0.15)] relative z-0">
      <div className="absolute inset-0 border-2 border-neon-cyan/20 rounded-xl pointer-events-none z-[1000]"></div>
      
      <MapContainer center={CENTER} zoom={16} className="h-full w-full bg-gray-900" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        <CircleMarker
          center={CENTER}
          radius={8}
          pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.8, weight: 3 }}
        >
          <Popup>
            <div className="text-xs font-mono font-bold text-gray-900">Main Stage</div>
          </Popup>
        </CircleMarker>

        {Object.entries(EXIT_COORDS).map(([exitId, coords]) => (
          <CircleMarker
            key={`exit-${exitId}`}
            center={coords}
            radius={10}
            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.9, weight: 2, dashArray: "4 4" }}
          >
            <Popup>
              <div className="text-xs font-mono font-bold text-green-700">EXIT {exitId} (SAFE)</div>
            </Popup>
          </CircleMarker>
        ))}
        
        {Object.entries(zoneStates).map(([zoneId, data]) => {
          const cap = data.current_capacity_pct;
          const isCongested = cap > 85;
          const zoneCoord = ZONE_COORDS[zoneId] || CENTER;
          const exitCoord = EXIT_COORDS[zoneId]; 
          const areaName = data.meta_area || `Zone ${zoneId}`;

          return (
            <React.Fragment key={zoneId}>
              {isCongested && (
                <Polyline 
                  positions={[zoneCoord, exitCoord]} 
                  pathOptions={{ color: '#00f3ff', weight: 4, dashArray: "10 10", className: 'animate-pulse' }}
                >
                  <Tooltip permanent direction="center" className="bg-gray-900 text-neon-cyan border border-neon-cyan font-mono text-[10px]">
                    Rerouting to Exit {zoneId}
                  </Tooltip>
                </Polyline>
              )}

              <CircleMarker
                center={zoneCoord}
                radius={getRadius(cap)}
                pathOptions={{
                  color: getColor(cap),
                  fillColor: getColor(cap),
                  fillOpacity: 0.6,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-xs font-mono text-gray-900">
                    <strong>{areaName}</strong><br/>
                    Capacity: {Math.round(cap)}%<br/>
                    Predicted (5m): {Math.round(data.predicted_capacity_pct_5m)}%
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
}
