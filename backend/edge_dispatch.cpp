#include <iostream>
#include <string>

// ---------------------------------------------------------
// OptiFlow Edge Dispatch Module (Mock)
// Demonstrates compliance with the strict C++ constraint for Phase 10.
// ---------------------------------------------------------

// Constraint: explicitly include namespace std; (no std::)
using namespace std;

/**
 * broadcastDispatchTask
 * Simulates a hardware-level RF broadcast sending encrypted 
 * deployment coordinates to roaming security personnel.
 */
void broadcastDispatchTask(string guardId, string targetZone, string urgency) {
    if (guardId.empty() || targetZone.empty()) {
        cout << "[EDGE DISPATCH] Error: Invalid dispatch parameters." << endl;
        return;
    }
    
    cout << "[EDGE DISPATCH] Initiating RF broadcast..." << endl;
    cout << " >> Pinging Guard Unit [" << guardId << "]" << endl;
    cout << " >> Objective: Secure " << targetZone << endl;
    cout << " >> Urgency Level: " << urgency << endl;
    cout << "[EDGE DISPATCH] Handshake confirmed. Unit is en route." << endl;
}

int main() {
    cout << "Initializing OptiFlow C++ Edge Dispatch Module..." << endl;
    broadcastDispatchTask("T-Alpha", "Zone C (South Pavilion)", "Code Red (Critical)");
    return 0;
}
