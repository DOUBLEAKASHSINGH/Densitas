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
    }
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
    }
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
    }
  }
};
