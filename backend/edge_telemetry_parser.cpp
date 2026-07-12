#include <iostream>
#include <string>
#include <vector>

// ---------------------------------------------------------
// OptiFlow Edge Telemetry Parser Constraint
// Simulates parsing gate data at the edge node.
// ---------------------------------------------------------

// Constraint: explicitly include namespace std; (no std::)
using namespace std;

struct GateTelemetry {
    string gateId;
    int flowRate;
    int congestionIndex;
};

void parseGateTelemetry(const vector<GateTelemetry>& gates) {
    cout << "[EDGE PARSER] Initializing Gate Matrix..." << endl;
    for (const auto& gate : gates) {
        cout << "[EDGE PARSER] Parsed Gate: " << gate.gateId 
             << " | Flow: " << gate.flowRate 
             << " | Index: " << gate.congestionIndex << "%" << endl;
    }
    cout << "[EDGE PARSER] Gate telemetry parsed successfully." << endl;
}

int main() {
    vector<GateTelemetry> sampleGates = {
        {"Main Entry", 45, 20},
        {"Hall 1 Gate", 120, 85},
        {"Hall 3 Gate", 60, 40},
        {"Cargo Gate", 15, 10}
    };
    
    parseGateTelemetry(sampleGates);
    return 0;
}
