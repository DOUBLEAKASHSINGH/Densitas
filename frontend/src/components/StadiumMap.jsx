import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const DEFAULT_CENTER = [17.4727, 78.3725];

const ZONE_COORDS = {
  'A': [17.4730, 78.3725], // Hall 1
  'B': [17.4724, 78.3728], // Hall 2
  'C': [17.4724, 78.3722], // Hall 3
  'D': [17.4735, 78.3725], // Open Arena
};

const EXIT_COORDS = {
  'A': [17.4735, 78.3715],
  'B': [17.4715, 78.3735],
  'C': [17.4715, 78.3715],
  'D': [17.4740, 78.3730],
};

export default function StadiumMap({ zoneStates, customZoom = 17 }) {
  const mapCenter = DEFAULT_CENTER;

  const getColor = (capacityPct) => {
    if (capacityPct > 85) return '#ef4444'; // Red-500
    if (capacityPct >= 70) return '#eab308'; // Yellow-500
    return '#22c55e'; // Green-500
  };

  const getRadius = (capacityPct) => {
    return 15 + (Math.min(capacityPct, 150) / 100) * 40; 
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0">
      <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={customZoom} className="h-full w-full bg-slate-50" zoomControl={false}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Center Stage Marker */}
        <CircleMarker
          center={DEFAULT_CENTER}
          radius={8}
          pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.8, weight: 3 }}
        >
          <Popup>
            <div className="text-xs font-semibold text-slate-800">Main Control Center</div>
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
              <div className="text-xs font-semibold text-green-700">EXIT {exitId} (SAFE)</div>
            </Popup>
          </CircleMarker>
        ))}
        
        {Object.entries(zoneStates).map(([zoneId, data]) => {
          const cap = data.current_capacity_pct;
          const isCongested = cap > 85;
          const zoneCoord = ZONE_COORDS[zoneId] || DEFAULT_CENTER;
          const exitCoord = EXIT_COORDS[zoneId]; 
          const areaName = data.meta_area || `Zone ${zoneId}`;

          return (
            <React.Fragment key={zoneId}>
              {isCongested && (
                <Polyline 
                  positions={[zoneCoord, exitCoord]} 
                  pathOptions={{ color: '#ef4444', weight: 4, dashArray: "5 5", className: 'animate-pulse' }}
                >
                  <Tooltip permanent direction="center" className="bg-red-50 text-red-600 border border-red-200 font-semibold text-[10px]">
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
                  <div className="text-xs text-slate-800">
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
