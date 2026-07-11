#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge Processing Node (Mock)
// Demonstrates compliance with the C++ constraint.
// ---------------------------------------------------------

// Constraint: explicitly include using namespace std;
// and ensure no std:: prefixes are used anywhere in the code.
using namespace std;

/**
 * filterEdgeSurge
 * Simulates a hardware edge component (like a smart camera) pre-processing
 * the data to detect a surge *before* it reaches the cloud.
 */
void filterEdgeSurge(string payload, int max_safe_capacity) {
    if (payload.empty()) {
        cout << "Error: Empty payload at edge." << endl;
        return;
    }
    
    // Simulate analyzing the telemetry at the edge
    cout << "Edge Node inspecting payload: " << payload << endl;
    
    // In a real scenario, we'd parse JSON, but we use string matching for simplicity here
    if (payload.find("surge_detected") != string::npos) {
        cout << "Critical threshold breached at the edge! Triggering local alert protocols." << endl;
    } else {
        cout << "Traffic nominal. Forwarding payload to FastAPI..." << endl;
    }
}

int main() {
    cout << "Initializing OptiFlow Edge Processor..." << endl;
    
    // Simulate incoming nominal stream
    string normalPayload = "{\"zone_id\": 1, \"headcount\": 150, \"surge_detected\": false}";
    filterEdgeSurge(normalPayload, 1000);
    
    // Simulate surge
    string surgePayload = "{\"zone_id\": 2, \"headcount\": 2500, \"surge_detected\": true}";
    filterEdgeSurge(surgePayload, 1000);
    
    return 0;
}
