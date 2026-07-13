import React, { useEffect, memo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationContext } from '../contexts/LocationContext';

/**
 * Dynamically updates map camera by fitting to bounding box of all markers.
 */
function FitBounds({ eventData }) {
  const map = useMap();
  
  useEffect(() => {
    if (!eventData) return;
    
    // Collect all valid geographic points
    const points = [];
    points.push([eventData.centerLat, eventData.centerLng]);

    if (eventData.zones) {
      Object.values(eventData.zones).forEach(z => {
        if (z.lat && z.lng) points.push([z.lat, z.lng]);
      });
    }
    
    if (eventData.gates) {
      eventData.gates.forEach(g => {
        if (g.lat && g.lng) points.push([g.lat, g.lng]);
      });
    }
    
    if (eventData.exits) {
      Object.values(eventData.exits).forEach(e => {
        if (e.lat && e.lng) points.push([e.lat, e.lng]);
      });
    }

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true });
    }
  }, [eventData, map]);
  
  return null;
}

// Fallback relative offsets for unmapped simulated venues
const FALLBACK_ZONE_COORDS = { 'A': [0.0003, -0.0000], 'B': [-0.0003, 0.0003], 'C': [-0.0003, -0.0003], 'D': [0.0008, 0.0000] };
const FALLBACK_EXIT_COORDS = { 'A': [0.0008, -0.0010], 'B': [-0.0012, 0.0010], 'C': [-0.0012, -0.0010], 'D': [0.0013, 0.0005] };

/**
 * @param {Object} props
 * @param {Object} props.zoneStates
 */
const StadiumMap = memo(function StadiumMap({ zoneStates }) {
  const { eventData } = useLocationContext();

  if (!eventData) return null;
  const mapCenter = [eventData.centerLat, eventData.centerLng];

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
      <MapContainer center={mapCenter} zoom={eventData.zoom || 17} className="h-full w-full bg-slate-50" zoomControl={false}>
        <FitBounds eventData={eventData} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Main Venue Center */}
        <CircleMarker
          center={mapCenter}
          radius={8}
          pathOptions={{ color: '#4f46e5', fillColor: '#4f46e5', fillOpacity: 0.8, weight: 3 }}
        >
          <Popup><div className="text-xs font-semibold text-slate-800">{eventData.venue} Center</div></Popup>
        </CircleMarker>

        {/* External Gates Rendering */}
        {eventData.gates && eventData.gates.map((gate, i) => {
          if (!gate.lat || !gate.lng) return null;
          return (
            <CircleMarker
              key={`gate-${i}`}
              center={[gate.lat, gate.lng]}
              radius={6}
              pathOptions={{ color: '#0ea5e9', fillColor: '#0ea5e9', fillOpacity: 0.9, weight: 2 }}
            >
              <Popup><div className="text-xs font-semibold text-sky-700">{gate.id}</div></Popup>
            </CircleMarker>
          );
        })}

        {/* Dynamic Zone Rendering (ML Driven) */}
        {Object.entries(zoneStates).map(([zoneId, data]) => {
          const cap = data.current_capacity_pct;
          const isCongested = cap > 85;
          
          // Get Exact Coordinates or fallback to offsets
          const exactZone = eventData.zones && eventData.zones[zoneId];
          const zoneCoord = exactZone 
            ? [exactZone.lat, exactZone.lng] 
            : [mapCenter[0] + (FALLBACK_ZONE_COORDS[zoneId] || [0,0])[0], mapCenter[1] + (FALLBACK_ZONE_COORDS[zoneId] || [0,0])[1]];
            
          const exactExit = eventData.exits && eventData.exits[zoneId];
          const exitCoord = exactExit 
            ? [exactExit.lat, exactExit.lng]
            : [mapCenter[0] + (FALLBACK_EXIT_COORDS[zoneId] || [0,0])[0], mapCenter[1] + (FALLBACK_EXIT_COORDS[zoneId] || [0,0])[1]];
          
          const areaName = exactZone ? exactZone.name : (data.meta_area || `Zone ${zoneId}`);

          return (
            <React.Fragment key={zoneId}>
              {/* Plot Safe Exit Marker */}
              <CircleMarker
                center={exitCoord}
                radius={10}
                pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.9, weight: 2, dashArray: "4 4" }}
              >
                <Popup><div className="text-xs font-semibold text-green-700">EXIT {zoneId} (SAFE)</div></Popup>
              </CircleMarker>

              {/* Rerouting Visualization */}
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

              {/* Core Heatmap Overlay */}
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
