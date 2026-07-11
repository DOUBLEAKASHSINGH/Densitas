#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge WebSocket Client Node (Mock)
// Demonstrates compliance with the strict C++ constraint.
// ---------------------------------------------------------

// Constraint: explicitly include using namespace std;
// and ensure no std:: prefixes are used anywhere in the code.
using namespace std;

/**
 * processEdgeWebSocketMessage
 * Simulates a C++ edge device (e.g. digital signage) listening to the 
 * FastAPI /ws/dashboard WebSocket to display alerts locally.
 */
void processEdgeWebSocketMessage(string payload) {
    if (payload.empty()) {
        cout << "Error: Empty payload received via WebSocket." << endl;
        return;
    }
    
    // Simulate parsing the AlertAgent JSON payload
    cout << "Edge Display received WebSocket broadcast: " << payload << endl;
    
    // In a real scenario, this would trigger a local display update
    if (payload.find("CRITICAL") != string::npos) {
        cout << "[HARDWARE INTERRUPT] Flashing red lights triggered on local display!" << endl;
    } else {
        cout << "Displaying nominal capacity metrics on screen." << endl;
    }
}

int main() {
    cout << "Initializing OptiFlow WebSocket Edge Client..." << endl;
    
    // Simulate receiving an alert payload over WebSocket
    string criticalAlert = "{\"zone_id\": 2, \"action_required\": \"CRITICAL: Open Emergency Exits and Dispatch 5 Guards\"}";
    processEdgeWebSocketMessage(criticalAlert);
    
    return 0;
}
