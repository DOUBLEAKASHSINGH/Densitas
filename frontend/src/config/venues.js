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
    polygon: [
      [17.4725, 78.3735], [17.4725, 78.3765], [17.4685, 78.3765], [17.4685, 78.3735]
    ],
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
    reroutes: {
      'A': [[17.4718, 78.3750], [17.4718, 78.3753], [17.4720, 78.3753]],
      'B': [[17.4713, 78.3745], [17.4713, 78.3748], [17.4715, 78.3748]],
      'C': [[17.4708, 78.3740], [17.4708, 78.3743], [17.4710, 78.3743]],
      'D': [[17.4695, 78.3760], [17.4692, 78.3765], [17.4690, 78.3765]]
    },
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
  },
  "hyderabad-open-arena": {
    id: "hyd-open-arena",
    name: "Hyderabad Open Arena (Gachibowli)",
    city: "Hyderabad",
    centerLat: 17.4370,
    centerLng: 78.3440,
    defaultZoom: 17,
    polygon: [
      [17.4390, 78.3440], [17.4370, 78.3465], [17.4350, 78.3440], [17.4370, 78.3415]
    ],
    zones: {
      'A': { lat: 17.4375, lng: 78.3440, name: 'North Stand' },
      'B': { lat: 17.4365, lng: 78.3440, name: 'South Stand' },
      'C': { lat: 17.4370, lng: 78.3445, name: 'East Stand' },
      'D': { lat: 17.4370, lng: 78.3435, name: 'West Stand' }
    },
    gates: [
      { id: 'Gate 1 (Main VIP)', lat: 17.4385, lng: 78.3440, type: 'primary' },
      { id: 'Gate 2 (General)', lat: 17.4355, lng: 78.3440, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 17.4382, lng: 78.3435 },
      'B': { lat: 17.4358, lng: 78.3445 },
      'C': { lat: 17.4370, lng: 78.3455 },
      'D': { lat: 17.4370, lng: 78.3425 }
    },
    emergencyExits: [
      { id: 'Emergency N-W', lat: 17.4380, lng: 78.3430 },
      { id: 'Emergency S-E', lat: 17.4360, lng: 78.3450 }
    ],
    assemblyPoints: [
      { id: 'Assembly Ground Alpha', lat: 17.4395, lng: 78.3440 }
    ],
    medicalStations: [
      { id: 'Med-Bay 1', lat: 17.4380, lng: 78.3445 }
    ],
    securityRooms: [
      { id: 'Command Center', lat: 17.4375, lng: 78.3445 }
    ],
    reroutes: {
      'A': [[17.4375, 78.3440], [17.4380, 78.3438], [17.4382, 78.3435]],
      'B': [[17.4365, 78.3440], [17.4360, 78.3442], [17.4358, 78.3445]],
      'C': [[17.4370, 78.3445], [17.4370, 78.3450], [17.4370, 78.3455]],
      'D': [[17.4370, 78.3435], [17.4370, 78.3430], [17.4370, 78.3425]]
    },
    routes: [
      { id: 'North Evacuation', path: [[17.4375, 78.3440], [17.4380, 78.3440], [17.4385, 78.3440], [17.4395, 78.3440]] }
    ]
  },
  "pharma-expo-jaipur": {
    id: "jaipur-jecc",
    name: "Jaipur Exhibition & Convention Centre",
    city: "Jaipur",
    centerLat: 26.7865,
    centerLng: 75.8340,
    defaultZoom: 16,
    polygon: [
      [26.7880, 75.8330], [26.7880, 75.8360], [26.7850, 75.8360], [26.7850, 75.8330]
    ],
    zones: {
      'A': { lat: 26.7875, lng: 75.8340, name: 'Exhibition Hall 1' },
      'B': { lat: 26.7865, lng: 75.8345, name: 'Exhibition Hall 2' },
      'C': { lat: 26.7855, lng: 75.8340, name: 'Convention Center' },
      'D': { lat: 26.7865, lng: 75.8335, name: 'Open Grounds' }
    },
    gates: [
      { id: 'Main Entrance', lat: 26.7870, lng: 75.8330, type: 'primary' },
      { id: 'Service Gate', lat: 26.7860, lng: 75.8360, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 26.7880, lng: 75.8335 },
      'B': { lat: 26.7865, lng: 75.8355 },
      'C': { lat: 26.7850, lng: 75.8345 },
      'D': { lat: 26.7865, lng: 75.8330 }
    },
    emergencyExits: [
      { id: 'Emergency North', lat: 26.7880, lng: 75.8350 },
      { id: 'Emergency South', lat: 26.7850, lng: 75.8335 }
    ],
    assemblyPoints: [
      { id: 'Safe Zone Alpha', lat: 26.7890, lng: 75.8340 }
    ],
    medicalStations: [
      { id: 'Medical Wing', lat: 26.7870, lng: 75.8350 }
    ],
    securityRooms: [
      { id: 'Security Hub', lat: 26.7860, lng: 75.8345 }
    ],
    reroutes: {
      'A': [[26.7875, 75.8340], [26.7880, 75.8340], [26.7880, 75.8335]],
      'B': [[26.7865, 75.8345], [26.7865, 75.8350], [26.7865, 75.8355]],
      'C': [[26.7855, 75.8340], [26.7850, 75.8340], [26.7850, 75.8345]],
      'D': [[26.7865, 75.8335], [26.7865, 75.8332], [26.7865, 75.8330]]
    },
    routes: [
      { id: 'Main Evac Route', path: [[26.7875, 75.8340], [26.7880, 75.8340], [26.7890, 75.8340]] }
    ]
  },
  "pharma-expo-ahmedabad": {
    id: "ahmedabad-gucec",
    name: "Gujarat University Convention and Exhibition Centre",
    city: "Ahmedabad",
    centerLat: 23.0429,
    centerLng: 72.5487,
    defaultZoom: 17,
    polygon: [
      [23.0440, 72.5475], [23.0440, 72.5500], [23.0420, 72.5500], [23.0420, 72.5475]
    ],
    zones: {
      'A': { lat: 23.0435, lng: 72.5480, name: 'Main Hall A' },
      'B': { lat: 23.0435, lng: 72.5490, name: 'Main Hall B' },
      'C': { lat: 23.0425, lng: 72.5480, name: 'Conference Wing' },
      'D': { lat: 23.0425, lng: 72.5490, name: 'Outdoor Arena' }
    },
    gates: [
      { id: 'Main Entrance (West)', lat: 23.0430, lng: 72.5475, type: 'primary' },
      { id: 'Service Gate (East)', lat: 23.0430, lng: 72.5500, type: 'secondary' }
    ],
    exits: {
      'A': { lat: 23.0440, lng: 72.5480 },
      'B': { lat: 23.0440, lng: 72.5490 },
      'C': { lat: 23.0420, lng: 72.5480 },
      'D': { lat: 23.0420, lng: 72.5490 }
    },
    emergencyExits: [
      { id: 'Emergency NW', lat: 23.0440, lng: 72.5475 },
      { id: 'Emergency SE', lat: 23.0420, lng: 72.5500 }
    ],
    assemblyPoints: [
      { id: 'Safe Zone West', lat: 23.0430, lng: 72.5460 }
    ],
    medicalStations: [
      { id: 'Medical Wing', lat: 23.0425, lng: 72.5478 }
    ],
    securityRooms: [
      { id: 'Security Hub', lat: 23.0435, lng: 72.5485 }
    ],
    reroutes: {
      'A': [[23.0435, 72.5480], [23.0438, 72.5480], [23.0440, 72.5480]],
      'B': [[23.0435, 72.5490], [23.0438, 72.5490], [23.0440, 72.5490]],
      'C': [[23.0425, 72.5480], [23.0422, 72.5480], [23.0420, 72.5480]],
      'D': [[23.0425, 72.5490], [23.0422, 72.5490], [23.0420, 72.5490]]
    },
    routes: [
      { id: 'Main Evac Route', path: [[23.0435, 72.5480], [23.0430, 72.5475], [23.0430, 72.5460]] }
    ]
  }
};
