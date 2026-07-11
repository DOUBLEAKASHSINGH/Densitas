#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge Cloud Proxy (Mock)
// Demonstrates compliance with the strict C++ constraint for Phase 5.
// ---------------------------------------------------------

// Constraint: explicitly include using namespace std;
// and ensure no std:: prefixes are used anywhere in the code.
using namespace std;

/**
 * routeToCloud
 * Simulates a C++ edge proxy device prioritizing payload routing
 * depending on latency constraints for cloud deployment.
 */
void routeToCloud(string payload) {
    if (payload.empty()) {
        cout << "Error: No payload to route." << endl;
        return;
    }
    
    // Simulate routing data to Render vs local edge network
    cout << "Edge Cloud Proxy analyzing routing for: " << payload << endl;
    
    if (payload.find("CRITICAL") != string::npos) {
        cout << "[LOW LATENCY PRIORITY] Routing immediately to Render cloud endpoint!" << endl;
    } else {
        cout << "Batching payload for bulk cloud transmission to save bandwidth." << endl;
    }
}

int main() {
    cout << "Initializing OptiFlow C++ Edge Cloud Proxy..." << endl;
    
    string state = "CRITICAL: Zone 2 Overcrowded";
    routeToCloud(state);
    
    return 0;
}
