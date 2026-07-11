#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge ML Node (Mock)
// Demonstrates compliance with the strict C++ constraint.
// ---------------------------------------------------------

// Constraint: explicitly include using namespace std;
// and ensure no std:: prefixes are used anywhere in the code.
using namespace std;

/**
 * edgeMLFilter
 * Simulates a hardware edge component (like a smart camera) pre-processing
 * ML features before hitting the Python FastAPI layer.
 */
void edgeMLFilter(string payload) {
    if (payload.empty()) {
        cout << "Error: Empty ML feature payload at edge." << endl;
        return;
    }
    
    // Simulate analyzing the telemetry at the edge for basic feature engineering
    cout << "Edge Node inspecting ML features: " << payload << endl;
    
    // In a real scenario, we'd extract high-frequency signals here
    if (payload.find("rapid_motion") != string::npos) {
        cout << "High frequency motion detected! Tagging for PredictionAgent." << endl;
    } else {
        cout << "Traffic steady. Forwarding raw payload to FastAPI /ingest..." << endl;
    }
}

int main() {
    cout << "Initializing OptiFlow Edge ML Processor..." << endl;
    
    string normalPayload = "{\"zone_id\": 1, \"headcount\": 150, \"rapid_motion\": false}";
    edgeMLFilter(normalPayload);
    
    string surgePayload = "{\"zone_id\": 2, \"headcount\": 2500, \"rapid_motion\": true}";
    edgeMLFilter(surgePayload);
    
    return 0;
}
