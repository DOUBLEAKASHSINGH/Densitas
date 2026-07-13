import React, { useEffect, memo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useLocationContext } from '../contexts/LocationContext';
import { useTelemetryContext } from '../contexts/TelemetryContext';
import { Shield, PlusSquare, Navigation, ActivitySquare, AlertTriangle } from 'lucide-react';

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

    const lists = ['zones', 'exits', 'gates', 'emergencyExits', 'assemblyPoints', 'medicalStations', 'securityRooms'];
    
    lists.forEach(key => {
      if (eventData[key]) {
        const iterable = Array.isArray(eventData[key]) ? eventData[key] : Object.values(eventData[key]);
        iterable.forEach(item => {
          if (item && item.lat && item.lng) points.push([item.lat, item.lng]);
        });
      }
    });

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 18, animate: true });
    }
  }, [eventData, map]);
  
  return null;
}

// Map Legend Component overlayed on top of the Leaflet Map
const MapLegend = () => (
  <div className="absolute bottom-4 right-4 z-[400] bg-white/95 backdrop-blur shadow-lg border border-slate-200 rounded-lg p-3 w-48 text-xs pointer-events-none">
    <h4 className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1">Command Center Key</h4>
    <div className="space-y-1.5">
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-blue-600 mr-2 border border-white shadow-sm"></div><span>Venue Center</span></div>
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-green-500 mr-2 border border-white shadow-sm"></div><span>Entry Gates</span></div>
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2 border border-white shadow-sm"></div><span>Exit Gates</span></div>
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-orange-500 mr-2 border border-white shadow-sm"></div><span>Emergency Exit</span></div>
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-purple-600 mr-2 border border-white shadow-sm"></div><span>Medical Aid</span></div>
      <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-slate-700 mr-2 border border-white shadow-sm"></div><span>Security Control</span></div>
    </div>
  </div>
);

const PopupContent = ({ name, type, flow, status = "Operational", density = "Normal" }) => (
  <div className="text-xs text-slate-800 min-w-[140px]">
    <div className="font-bold border-b border-slate-200 pb-1 mb-1">{name}</div>
    <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[10px]">
      <span className="text-slate-500">Status</span>
      <span className="font-semibold text-right">{status}</span>
      <span className="text-slate-500">Type</span>
      <span className="font-semibold text-right">{type}</span>
      <span className="text-slate-500">Density</span>
      <span className={`font-semibold text-right ${density === 'High' ? 'text-red-600' : 'text-green-600'}`}>{density}</span>
      {flow && (
        <>
          <span className="text-slate-500">Flow Rate</span>
          <span className="font-semibold text-right text-indigo-600">{flow} p/m</span>
        </>
      )}
    </div>
  </div>
);


const FALLBACK_ZONE_COORDS = { 'A': [0.0003, -0.0000], 'B': [-0.0003, 0.0003], 'C': [-0.0003, -0.0003], 'D': [0.0008, 0.0000] };
const FALLBACK_EXIT_COORDS = { 'A': [0.0008, -0.0010], 'B': [-0.0012, 0.0010], 'C': [-0.0012, -0.0010], 'D': [0.0013, 0.0005] };

/**
 * @param {Object} props
 * @param {Object} props.zoneStates
 */
const StadiumMap = memo(function StadiumMap({ zoneStates }) {
  const { eventData } = useLocationContext();
  const { gateMetrics } = useTelemetryContext();

  if (!eventData) return null;
  const mapCenter = [eventData.centerLat, eventData.centerLng];

  const getColor = (capacityPct) => {
    if (capacityPct > 85) return '#ef4444'; 
    if (capacityPct >= 70) return '#eab308'; 
    return '#22c55e'; 
  };

  const getRadius = (capacityPct) => 15 + (Math.min(capacityPct, 150) / 100) * 40; 

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative z-0">
      <MapLegend />
      <MapContainer center={mapCenter} zoom={eventData.zoom || 17} className="h-full w-full bg-slate-50" zoomControl={false}>
        <FitBounds eventData={eventData} />
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        />

        {/* Venue Center */}
        <CircleMarker center={mapCenter} radius={8} pathOptions={{ color: '#2563eb', fillColor: '#2563eb', fillOpacity: 0.9, weight: 3 }}>
          <Popup><PopupContent name={`${eventData.venue} Center`} type="Core Command" /></Popup>
        </CircleMarker>

        {/* Entry Gates (Green) */}
        {eventData.gates && eventData.gates.map((gate, i) => {
          if (!gate.lat || !gate.lng) return null;
          const metrics = gateMetrics[gate.id] || { flowRate: Math.floor(Math.random() * 50) + 10, congestion: 20 };
          return (
            <CircleMarker key={`gate-${i}`} center={[gate.lat, gate.lng]} radius={7} pathOptions={{ color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.9, weight: 2 }}>
              <Popup><PopupContent name={gate.id} type="Entry Gate" flow={metrics.flowRate} density={metrics.congestion > 70 ? 'High' : 'Normal'} /></Popup>
            </CircleMarker>
          );
        })}

        {/* Emergency Exits (Orange) */}
        {eventData.emergencyExits && eventData.emergencyExits.map((gate, i) => (
          <CircleMarker key={`emerg-${i}`} center={[gate.lat, gate.lng]} radius={7} pathOptions={{ color: '#f97316', fillColor: '#f97316', fillOpacity: 0.9, weight: 2 }}>
            <Popup><PopupContent name={gate.id} type="Emergency Exit" status="Standby" density="Zero" /></Popup>
          </CircleMarker>
        ))}

        {/* Medical Aid Stations (Purple) */}
        {eventData.medicalStations && eventData.medicalStations.map((med, i) => (
          <CircleMarker key={`med-${i}`} center={[med.lat, med.lng]} radius={6} pathOptions={{ color: '#9333ea', fillColor: '#9333ea', fillOpacity: 0.9, weight: 2 }}>
            <Popup><PopupContent name={med.id} type="Medical Station" status="Staffed" density="Low" /></Popup>
          </CircleMarker>
        ))}

        {/* Security Control Rooms (Dark Gray) */}
        {eventData.securityRooms && eventData.securityRooms.map((sec, i) => (
          <CircleMarker key={`sec-${i}`} center={[sec.lat, sec.lng]} radius={6} pathOptions={{ color: '#334155', fillColor: '#334155', fillOpacity: 0.9, weight: 2 }}>
            <Popup><PopupContent name={sec.id} type="Security Node" status="Active" density="Restricted" /></Popup>
          </CircleMarker>
        ))}

        {/* Evacuation Routes */}
        {eventData.routes && eventData.routes.map((route, i) => (
          <Polyline key={`route-${i}`} positions={route.path} pathOptions={{ color: '#3b82f6', weight: 4, dashArray: "10 5", opacity: 0.7 }}>
            <Tooltip sticky>Evac Route: {route.id}</Tooltip>
          </Polyline>
        ))}

        {/* ML Heatmap Zones & Standard Exits (Red) */}
        {Object.entries(zoneStates).map(([zoneId, data]) => {
          const cap = data.current_capacity_pct;
          const isCongested = cap > 85;
          const exactZone = eventData.zones && eventData.zones[zoneId];
          const zoneCoord = exactZone ? [exactZone.lat, exactZone.lng] : [mapCenter[0] + (FALLBACK_ZONE_COORDS[zoneId] || [0,0])[0], mapCenter[1] + (FALLBACK_ZONE_COORDS[zoneId] || [0,0])[1]];
          const exactExit = eventData.exits && eventData.exits[zoneId];
          const exitCoord = exactExit ? [exactExit.lat, exactExit.lng] : [mapCenter[0] + (FALLBACK_EXIT_COORDS[zoneId] || [0,0])[0], mapCenter[1] + (FALLBACK_EXIT_COORDS[zoneId] || [0,0])[1]];
          const areaName = exactZone ? exactZone.name : (data.meta_area || `Zone ${zoneId}`);

          return (
            <React.Fragment key={zoneId}>
              {/* Standard Exit Marker (Red) */}
              <CircleMarker center={exitCoord} radius={7} pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.9, weight: 2 }}>
                <Popup><PopupContent name={`Exit ${zoneId}`} type="Standard Exit" density={isCongested ? 'High' : 'Normal'} /></Popup>
              </CircleMarker>

              {/* Rerouting Visualization */}
              {isCongested && (
                <Polyline positions={[zoneCoord, exitCoord]} pathOptions={{ color: '#ef4444', weight: 4, dashArray: "5 5", className: 'animate-pulse' }}>
                  <Tooltip permanent direction="center" className="bg-red-50 text-red-600 border border-red-200 font-semibold text-[10px]">
                    Rerouting to Exit {zoneId}
                  </Tooltip>
                </Polyline>
              )}

              {/* Core Heatmap Overlay */}
              <CircleMarker center={zoneCoord} radius={getRadius(cap)} pathOptions={{ color: getColor(cap), fillColor: getColor(cap), fillOpacity: 0.6, weight: 2 }}>
                <Popup><PopupContent name={areaName} type="Audience Zone" density={isCongested ? 'High' : 'Normal'} status={`${Math.round(cap)}% Cap`}/></Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}
      </MapContainer>
    </div>
  );
});

export default StadiumMap;
