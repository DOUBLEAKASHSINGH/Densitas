#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge Enrichment (Mock)
// Demonstrates compliance with the strict C++ constraint for Phase 8.
// ---------------------------------------------------------

// Constraint: explicitly include namespace std; (no std::)
using namespace std;

/**
 * enrichTelemetryWithGIS
 * Simulates a C++ hardware processor appending static GIS metadata
 * (e.g. area names, precise coordinates) to raw sensor ticks before
 * sending them upstream to the cloud broker.
 */
void enrichTelemetryWithGIS(string zoneId, int capacity) {
    string areaName = "Unknown Area";
    
    if (zoneId == "A") areaName = "North Entrance";
    else if (zoneId == "B") areaName = "Main Concourse";
    else if (zoneId == "C") areaName = "South Pavilion";
    else if (zoneId == "D") areaName = "VIP West Wing";
    
    cout << "[EDGE ENRICHMENT] Raw Tick (Zone " << zoneId << ", Cap: " << capacity << "%) enriched with GIS metadata: " << areaName << endl;
}

int main() {
    cout << "Initializing OptiFlow C++ Edge Enrichment Module..." << endl;
    enrichTelemetryWithGIS("C", 92);
    return 0;
}
