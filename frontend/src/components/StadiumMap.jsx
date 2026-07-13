import React, { useEffect, memo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Component to dynamically update map center when props change
function ChangeView({ center, zoom }) {
  const map = useMap();
  const centerLat = center[0];
  const centerLng = center[1];
  
  useEffect(() => {
    map.setView([centerLat, centerLng], zoom);
  }, [centerLat, centerLng, zoom, map]);
  return null;
}

const ZONE_COORDS = {
  'A': [0.0003, -0.0000], 
  'B': [-0.0003, 0.0003], 
  'C': [-0.0003, -0.0003], 
  'D': [0.0008, 0.0000], 
};

const EXIT_COORDS = {
  'A': [0.0008, -0.0010],
  'B': [-0.0012, 0.0010],
  'C': [-0.0012, -0.0010],
  'D': [0.0013, 0.0005],
};

/**
 * @param {Object} props
 * @param {Object} props.zoneStates
 * @param {[number, number]} props.dynamicCenter
 * @param {number} props.customZoom
 */
const StadiumMap = memo(function StadiumMap({ zoneStates, dynamicCenter, customZoom = 17 }) {
  
  // Fallback to HITEX if no center provided
  const mapCenter = dynamicCenter || [17.4727, 78.3725];

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
      <MapContainer center={mapCenter} zoom={customZoom} className="h-full w-full bg-slate-50" zoomControl={false}>
        <ChangeView center={mapCenter} zoom={customZoom} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Main Control Center Marker */}
        <CircleMarker
          center={mapCenter}
          radius={8}
          pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.8, weight: 3 }}
        >
          <Popup>
            <div className="text-xs font-semibold text-slate-800">Main Control Center</div>
          </Popup>
        </CircleMarker>

        {Object.entries(EXIT_COORDS).map(([exitId, offset]) => {
          const coords = [mapCenter[0] + offset[0], mapCenter[1] + offset[1]];
          return (
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
          );
        })}
        
        {Object.entries(zoneStates).map(([zoneId, data]) => {
          const cap = data.current_capacity_pct;
          const isCongested = cap > 85;
          const offset = ZONE_COORDS[zoneId] || [0,0];
          const zoneCoord = [mapCenter[0] + offset[0], mapCenter[1] + offset[1]];
          const exitOffset = EXIT_COORDS[zoneId] || [0,0];
          const exitCoord = [mapCenter[0] + exitOffset[0], mapCenter[1] + exitOffset[1]];
          
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
});

export default StadiumMap;
