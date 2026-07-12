#include <iostream>
#include <string>
#include <vector>
#include <chrono>
#include <thread>
#include <random>

// ---------------------------------------------------------
// OptiFlow Edge Mock Fallback Constraint
// Simulates the generation of telemetry when the upstream
// WebSocket connection is severed.
// ---------------------------------------------------------

// Constraint: explicitly include namespace std; (no std::)
using namespace std;

struct MockTelemetry {
    string zoneId;
    int headcount;
    int flowRate;
};

void runFallbackSimulation() {
    cout << "[EDGE FALLBACK] Upstream connection lost. Initiating active mock loop..." << endl;
    
    vector<string> zones = {"A", "B", "C", "D"};
    
    // Seed random generator
    random_device rd;
    mt19937 gen(rd());
    uniform_int_distribution<> headcountDist(50, 400);
    uniform_int_distribution<> flowDist(-10, 20);
    uniform_int_distribution<> zoneDist(0, 3);
    
    // Simulate 5 ticks
    for (int i = 0; i < 5; ++i) {
        string targetZone = zones[zoneDist(gen)];
        int headcount = headcountDist(gen);
        int flow = flowDist(gen);
        
        cout << "[EDGE FALLBACK TICK " << i + 1 << "] Zone: " << targetZone 
             << " | Generated Headcount: " << headcount 
             << " | Flow: " << flow << endl;
             
        this_thread::sleep_for(chrono::milliseconds(1500));
    }
    
    cout << "[EDGE FALLBACK] Simulation loop complete." << endl;
}

int main() {
    runFallbackSimulation();
    return 0;
}
