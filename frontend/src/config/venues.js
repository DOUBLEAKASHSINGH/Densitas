/**
 * Pre-configured geographic constraints for high-fidelity spatial telemetry rendering.
 * Real-world coordinates are used to ensure accurate gate and zone placement.
 */
export const VENUE_CONFIG = {
  "hitex-exhibition-centre": {
    id: "hitex",
    name: "HITEX Exhibition Centre",
    city: "Hyderabad",
    centerLat: 17.4708,
    centerLng: 78.3753,
    defaultZoom: 17,
    zones: {
      'A': { lat: 17.4718, lng: 78.3750, name: 'Hall 1' },
      'B': { lat: 17.4713, lng: 78.3745, name: 'Hall 2' },
      'C': { lat: 17.4708, lng: 78.3740, name: 'Hall 3' },
      'D': { lat: 17.4695, lng: 78.3760, name: 'Open Arena' }
    },
    gates: [
      { id: 'Gate 1 (Main Entrance)', lat: 17.4690, lng: 78.3756, type: 'primary' },
      { id: 'Gate 2 (Trade Entry)', lat: 17.4715, lng: 78.3730, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 17.4720, lng: 78.3753 },
      'B': { lat: 17.4715, lng: 78.3748 },
      'C': { lat: 17.4710, lng: 78.3743 },
      'D': { lat: 17.4690, lng: 78.3765 }
    },
    emergencyExits: [
      { id: 'Emergency West', lat: 17.4705, lng: 78.3730 },
      { id: 'Emergency East', lat: 17.4705, lng: 78.3765 }
    ],
    assemblyPoints: [
      { id: 'Assembly Point Alpha', lat: 17.4725, lng: 78.3750 },
      { id: 'Assembly Point Beta', lat: 17.4685, lng: 78.3760 }
    ],
    medicalStations: [
      { id: 'Med-Bay 1', lat: 17.4710, lng: 78.3755 }
    ],
    securityRooms: [
      { id: 'Command Center', lat: 17.4712, lng: 78.3749 }
    ],
    routes: [
      { id: 'Evac Route A', path: [[17.4718, 78.3750], [17.4720, 78.3753], [17.4725, 78.3750]] },
      { id: 'Evac Route B', path: [[17.4695, 78.3760], [17.4690, 78.3765], [17.4685, 78.3760]] }
    ]
  },
  "jio-world-convention-centre": {
    id: "jioworld",
    name: "Jio World Convention Centre",
    city: "Mumbai",
    centerLat: 19.0639,
    centerLng: 72.8665,
    defaultZoom: 17,
    zones: {
      'A': { lat: 19.0645, lng: 72.8660, name: 'Pavilion 1' },
      'B': { lat: 19.0640, lng: 72.8660, name: 'Pavilion 2' },
      'C': { lat: 19.0635, lng: 72.8660, name: 'Pavilion 3' },
      'D': { lat: 19.0639, lng: 72.8672, name: 'Jasmine Hall' }
    },
    gates: [
      { id: 'Gate 20', lat: 19.0645, lng: 72.8675, type: 'primary' },
      { id: 'Gate 18', lat: 19.0630, lng: 72.8665, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 19.0647, lng: 72.8655 },
      'B': { lat: 19.0642, lng: 72.8655 },
      'C': { lat: 19.0632, lng: 72.8655 },
      'D': { lat: 19.0640, lng: 72.8678 }
    },
    emergencyExits: [
      { id: 'Service Exit North', lat: 19.0650, lng: 72.8660 },
      { id: 'Service Exit South', lat: 19.0628, lng: 72.8665 }
    ],
    assemblyPoints: [
      { id: 'North Plaza', lat: 19.0655, lng: 72.8655 },
      { id: 'South Grounds', lat: 19.0620, lng: 72.8665 }
    ],
    medicalStations: [
      { id: 'First Aid North', lat: 19.0642, lng: 72.8668 }
    ],
    securityRooms: [
      { id: 'Main Security Office', lat: 19.0640, lng: 72.8662 }
    ],
    routes: [
      { id: 'North Egress', path: [[19.0645, 72.8660], [19.0650, 72.8660], [19.0655, 72.8655]] }
    ]
  },
  "pragati-maidan": {
    id: "pragati",
    name: "Pragati Maidan",
    city: "New Delhi",
    centerLat: 28.6159,
    centerLng: 77.2443,
    defaultZoom: 16,
    zones: {
      'A': { lat: 28.6170, lng: 77.2435, name: 'Bharat Mandapam' },
      'B': { lat: 28.6160, lng: 77.2440, name: 'Hall 1-6' },
      'C': { lat: 28.6150, lng: 77.2450, name: 'Hall 7-12' },
      'D': { lat: 28.6140, lng: 77.2445, name: 'Open Amphitheatre' }
    },
    gates: [
      { id: 'Gate 4', lat: 28.6145, lng: 77.2425, type: 'primary' },
      { id: 'Gate 10', lat: 28.6175, lng: 77.2455, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 28.6175, lng: 77.2430 },
      'B': { lat: 28.6165, lng: 77.2435 },
      'C': { lat: 28.6155, lng: 77.2455 },
      'D': { lat: 28.6135, lng: 77.2440 }
    },
    emergencyExits: [
      { id: 'Bhairon Marg Exit', lat: 28.6130, lng: 77.2450 },
      { id: 'Mathura Road Exit', lat: 28.6165, lng: 77.2420 }
    ],
    assemblyPoints: [
      { id: 'Lake Area', lat: 28.6135, lng: 77.2460 },
      { id: 'Supreme Court Side', lat: 28.6180, lng: 77.2425 }
    ],
    medicalStations: [
      { id: 'Central Dispensary', lat: 28.6155, lng: 77.2445 }
    ],
    securityRooms: [
      { id: 'Delhi Police Control', lat: 28.6150, lng: 77.2435 }
    ],
    routes: [
      { id: 'Main Evac Route', path: [[28.6170, 77.2435], [28.6175, 77.2430], [28.6180, 77.2425]] }
    ]
  }
};
