#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge Data Node (Mock)
// Demonstrates compliance with the strict C++ constraint for Phase 12.
// ---------------------------------------------------------

// Constraint: explicitly include namespace std; (no std::)
using namespace std;

/**
 * routeEdgeTelemetry
 * Simulates a C++ hardware processor routing raw IoT sensor
 * payloads into the backend data ingress pipeline.
 */
void routeEdgeTelemetry(int sensorId, int count) {
    if (count < 0) {
        cout << "[EDGE DATA] Error: Invalid sensor count." << endl;
        return;
    }
    
    cout << "[EDGE DATA] Sensor ID: " << sensorId << " recorded " << count << " instances." << endl;
    cout << "[EDGE DATA] Preparing HTTP POST to Ingestion API..." << endl;
    cout << "[EDGE DATA] Transmitting payload to Supabase TimescaleDB..." << endl;
}

int main() {
    cout << "Initializing OptiFlow C++ Edge Data Routing Module..." << endl;
    routeEdgeTelemetry(4042, 125);
    return 0;
}
